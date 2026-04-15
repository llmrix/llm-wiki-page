import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import matter from 'gray-matter';
import { ArchiveEntry } from './services/types';
import config from './config/config.json';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import PostDetail from './components/PostDetail';
import PostList from './components/PostList';
import Categories from './components/Categories';
import Tags from './components/Tags';
import Search from './components/Search';
import Settings from './components/Settings';
import About from './components/About';

const markdownFiles = {
  ...import.meta.glob('./public/*.md', { query: '?raw', import: 'default' }),
  ...import.meta.glob('./source/*.md', { query: '?raw', import: 'default' }),
};

export default function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(config.ui.defaultTheme as 'light' | 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(config.ui.postsPerPage);

  // Profile state from config
  const name = config.profile.name;
  const bio = config.profile.bio;
  const buyMeCoffeeUrl = config.profile.buyMeCoffeeUrl;

  useEffect(() => {
    setVisibleCount(config.ui.postsPerPage);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    async function loadEntries() {
      try {
        const loadedEntries: ArchiveEntry[] = [];

        for (const path in markdownFiles) {
          const rawContent = await markdownFiles[path]() as string;
          const { data, content } = matter(rawContent);
          const id = path.split('/').pop()?.replace('.md', '') || '';

          const title = data.title || id;
          const category = data.category || 'Uncategorized';
          const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map((t: string) => t.trim()) : []);
          const dateValue = data.date || data.time;
          const date = dateValue ? (dateValue instanceof Date ? dateValue.toISOString().replace('T', ' ').split('.')[0] : String(dateValue)) : '';
          const summary = data.summary || '';

          const excerpt = summary || content
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))[0]
            ?.slice(0, 150) + '...';

          const words = content.split(/\s+/).length;
          const readTime = `${Math.ceil(words / 200)} min read`;

          loadedEntries.push({ id, title, content: content.trim(), category, date, readTime, excerpt, summary, tags });
        }

        setEntries(loadedEntries);
        setLoading(false);
      } catch (error) {
        console.error('Error loading entries:', error);
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(entries.filter(e => e.id !== 'about').map(e => e.category));
    return ['All', ...Array.from(cats).sort()];
  }, [entries]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach(e => {
      if (e.id !== 'about' && e.tags) {
        e.tags.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [entries]);

  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: ArchiveEntry[] } = {};
    const sortedEntries = [...entries].sort((a, b) => {
      if (a.id === 'about') return -1;
      if (b.id === 'about') return 1;
      return 0;
    });

    sortedEntries.forEach(entry => {
      if (!groups[entry.category]) {
        groups[entry.category] = [];
      }
      groups[entry.category].push(entry);
    });
    return groups;
  }, [entries]);

  const aboutEntry = entries.find(e => e.id === 'about');

  // Unified SEO Logic
  useEffect(() => {
    if (loading) return;

    let title = config.site.title;
    let description = config.site.subtitle;
    let keywords = "AI, Technology, Architecture, Valuation, Dev Log, Programming";
    let canonicalPath = location.pathname;

    const pathParts = location.pathname.split('/').filter(Boolean);
    const topPath = pathParts[0];

    if (topPath === 'post' && pathParts[1]) {
      const entry = entries.find(e => e.id === pathParts[1]);
      if (entry) {
        title = `${entry.title} - ${config.site.title}`;
        description = entry.excerpt || description;
        if (entry.tags && entry.tags.length > 0) {
          keywords = entry.tags.join(', ');
        }
      }
    } else if (topPath === 'category' && pathParts[1]) {
      title = `${decodeURIComponent(pathParts[1])} - ${config.site.title}`;
    } else if (topPath === 'about') {
      title = `About - ${config.site.title}`;
    } else if (topPath === 'tags') {
      title = `Tags - ${config.site.title}`;
    } else if (topPath === 'search') {
      title = `Search - ${config.site.title}`;
    }

    document.title = title;

    const updateOrCreateMeta = (query: string, attr: string, value: string, isProperty = false) => {
      let el = document.querySelector(query);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', (query.match(/\[property="(.*)"\]/) || [])[1] || '');
        } else {
          el.setAttribute('name', (query.match(/\[name="(.*)"\]/) || [])[1] || '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    updateOrCreateMeta('meta[name="description"]', 'content', description);
    updateOrCreateMeta('meta[name="keywords"]', 'content', keywords);
    updateOrCreateMeta('meta[property="og:title"]', 'content', title, true);
    updateOrCreateMeta('meta[property="og:description"]', 'content', description, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${canonicalPath}`);
  }, [location.pathname, entries, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-sans font-bold text-2xl tracking-tighter"
        >
          {t('loading')}
        </motion.div>
      </div>
    );
  }

  const PostDetailWrapper = () => {
    const { id } = useParams();
    const entry = entries.find(e => e.id === id);
    if (!entry) return <Navigate to="/" replace />;

    return (
      <PostDetail
        entry={entry}
        previousEntry={entries[entries.findIndex(e => e.id === id) - 1]}
        onNavigate={(newId) => navigate(`/post/${newId}`)}
        onBack={() => navigate('/')}
        onTagClick={(tag) => {
          setSearchQuery(tag);
          navigate('/search');
        }}
        buyMeCoffeeUrl={buyMeCoffeeUrl}
      />
    );
  };

  const PostListWrapper = () => {
    const { category } = useParams();
    const activeCategory = category || 'All';

    return (
      <PostList
        entries={entries}
        activeCategory={activeCategory}
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount(prev => prev + 5)}
        onPostClick={(id) => navigate(`/post/${id}`)}
      />
    );
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          activeCategory={location.pathname === '/' ? 'All' : location.pathname.split('/')[1] === 'category' ? decodeURIComponent(location.pathname.split('/')[2]) : location.pathname.split('/')[1]}
          onCategoryClick={(cat) => {
            if (cat === 'All') navigate('/');
            else if (['Tags', 'Search', 'About', 'Settings', 'Categories'].includes(cat)) navigate(`/${cat.toLowerCase()}`);
            else navigate(`/category/${cat}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          entries={entries}
          categories={categories}
          allTags={allTags}
          name={name}
          bio={bio}
          title={config.site.title}
          subtitle={config.site.subtitle}
        />
      }
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PostListWrapper />} />
          <Route path="/category/:category" element={<PostListWrapper />} />
          <Route path="/post/:id" element={<PostDetailWrapper />} />
          <Route path="/categories" element={
            <Categories
              categories={categories}
              groupedEntries={groupedEntries}
              onCategoryClick={(cat) => navigate(`/category/${cat}`)}
              onPostClick={(id) => navigate(`/post/${id}`)}
            />
          } />
          <Route path="/tags" element={
            <Tags
              allTags={allTags}
              onTagClick={(tag) => {
                setSearchQuery(tag);
                navigate('/search');
              }}
            />
          } />
          <Route path="/search" element={
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredEntries={entries.filter(e =>
                e.id !== 'about' &&
                (e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (e.summary && e.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
              )}
              onPostClick={(id) => navigate(`/post/${id}`)}
            />
          } />
          <Route path="/settings" element={
            <Settings theme={theme} toggleTheme={toggleTheme} />
          } />
          <Route path="/about" element={<About entry={aboutEntry} buyMeCoffeeUrl={buyMeCoffeeUrl} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
