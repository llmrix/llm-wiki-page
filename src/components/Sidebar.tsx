import { Home, Tag, Search, User, Settings, Rss, Github, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { ArchiveEntry } from '../services/types';
import config from '../config/config.json';

interface SidebarProps {
  activeCategory: string;
  onCategoryClick: (category: string) => void;
  entries: ArchiveEntry[];
  categories: string[];
  allTags: string[];
  name: string;
  bio: string;
  title: string;
  subtitle: string;
}

export default function Sidebar({
  activeCategory,
  onCategoryClick,
  entries,
  categories,
  allTags,
  name,
  bio,
  title,
  subtitle,
}: SidebarProps) {
  const { t } = useTranslation();

  const handleRSSClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const siteUrl = window.location.origin;
    const title = t('sidebarTitle');
    const description = t('sidebarSubtitle');

    const items = entries
      .filter(e => e.id !== 'about')
      .sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .map(entry => `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${siteUrl}/post/${entry.id}</link>
      <guid>${siteUrl}/post/${entry.id}</guid>
      <description><![CDATA[${entry.excerpt || ''}]]></description>
      <pubDate>${entry.date ? new Date(entry.date).toUTCString() : ''}</pubDate>
    </item>`).join('');

    const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${title}</title>
  <link>${siteUrl}</link>
  <description>${description}</description>
  ${items}
</channel>
</rss>`;

    const blob = new Blob([rssContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title" onClick={() => onCategoryClick('All')}>
          {title}
        </div>
        <div className="sidebar-subtitle">{subtitle}</div>
      </div>

      <nav className="sidebar-section">
        <div
          onClick={() => onCategoryClick('All')}
          className={cn("sidebar-nav-item", activeCategory === 'All' && "active")}
        >
          <Home size={16} />
          <span>{t('home')}</span>
        </div>
        <div
          onClick={() => onCategoryClick('Tags')}
          className={cn("sidebar-nav-item", activeCategory === 'Tags' && "active")}
        >
          <Tag size={16} />
          <span>{t('tags')}</span>
        </div>
        <div
          onClick={() => onCategoryClick('Search')}
          className={cn("sidebar-nav-item", activeCategory === 'Search' && "active")}
        >
          <Search size={16} />
          <span>{t('search')}</span>
        </div>
        <div
          onClick={() => onCategoryClick('About')}
          className={cn("sidebar-nav-item", activeCategory === 'About' && "active")}
        >
          <User size={16} />
          <span>{t('about')}</span>
        </div>
        <div
          onClick={() => onCategoryClick('Settings')}
          className={cn("sidebar-nav-item", activeCategory === 'Settings' && "active")}
        >
          <Settings size={16} />
          <span>{t('settings')}</span>
        </div>
      </nav>

      <div className="sidebar-section">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mt-4 mb-4 border border-border bg-accent text-surface text-2xl font-bold mx-auto">
          {name.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="author-name text-[16px] font-bold text-text-title mb-1">{name}</div>
        <div className="author-bio text-[13px] text-text-muted leading-relaxed mb-8 px-3">{bio}</div>

        <div className="author-stats !mb-3">
          <div
            className="stat-item cursor-pointer hover:text-accent transition-colors group"
            onClick={() => onCategoryClick('All')}
          >
            <span className="stat-count group-hover:text-accent transition-colors">{entries.length}</span>
            <span className="stat-label group-hover:text-accent transition-colors">{t('logs')}</span>
          </div>
          <div
            className="stat-item cursor-pointer hover:text-accent transition-colors group"
            onClick={() => onCategoryClick('Categories')}
          >
            <span className="stat-count group-hover:text-accent transition-colors">{categories.length - 1}</span>
            <span className="stat-label group-hover:text-accent transition-colors">{t('categories')}</span>
          </div>
          <div
            className="stat-item cursor-pointer hover:text-accent transition-colors group"
            onClick={() => onCategoryClick('Tags')}
          >
            <span className="stat-count group-hover:text-accent transition-colors">{allTags.length}</span>
            <span className="stat-label group-hover:text-accent transition-colors">{t('tags')}</span>
          </div>
        </div>

        <div className="rss-section !my-3">
          <a href="#" className="rss-link" onClick={handleRSSClick}>
            <Rss size={14} /> {t('rss')}
          </a>
        </div>

        <div className="flex justify-center gap-4 pb-4">
          {config.social?.github && (
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-title transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
          )}
          {config.social?.website && (
            <a
              href={config.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-title transition-colors"
            >
              <Globe size={14} />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
