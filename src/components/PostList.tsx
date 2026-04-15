import { motion } from 'motion/react';
import MarkdownRenderer from './MarkdownRenderer';
import { useTranslation } from 'react-i18next';
import { ArchiveEntry } from '../services/types';

interface PostListProps {
  entries: ArchiveEntry[];
  activeCategory: string;
  visibleCount: number;
  onLoadMore: () => void;
  onPostClick: (id: string) => void;
}

export default function PostList({
  entries,
  activeCategory,
  visibleCount,
  onLoadMore,
  onPostClick,
}: PostListProps) {
  const { t } = useTranslation();

  const filteredEntries = entries
    .filter(e => e.id !== 'about')
    .filter(e => activeCategory === 'All' || e.category === activeCategory);

  const visibleEntries = filteredEntries.slice(0, visibleCount);

  return (
    <motion.div
      key={activeCategory}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        {visibleEntries.map((entry) => (
          <div key={entry.id} className="mb-3 last:mb-0">
            <article className="post-item">
              <header className="post-header">
                <h2 className="post-title" onClick={() => onPostClick(entry.id)}>
                  {entry.title}
                </h2>
                <div className="flex items-center justify-center gap-3 text-[12px] text-text-muted uppercase tracking-wider mt-3 mb-4">
                  <span><span className="font-semibold">{t('dateLabel')}</span> {entry.date?.split(' ')[0]}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                  <span><span className="font-semibold">{t('categoryLabel')}</span> <span className="text-accent">{entry.category}</span></span>
                </div>
              </header>
              <div className="text-text-muted text-[15px] leading-relaxed mb-6">
                {entry.summary || entry.excerpt}
              </div>
              <button className="read-more-btn" onClick={() => onPostClick(entry.id)}>
                {t('readMore')}
              </button>
            </article>
          </div>
        ))}

        {filteredEntries.length > visibleCount && (
          <div className="text-center mt-8">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-surface border border-border rounded-full text-text-muted hover:text-accent hover:border-accent transition-all"
            >
              {t('loadMore')}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
