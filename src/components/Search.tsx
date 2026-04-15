import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArchiveEntry } from '../services/types';

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredEntries: ArchiveEntry[];
  onPostClick: (id: string) => void;
}

export default function Search({
  searchQuery,
  setSearchQuery,
  filteredEntries,
  onPostClick,
}: SearchProps) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setVisibleCount(5);
  }, [searchQuery]);

  return (
    <motion.div
      key="search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="content-card"
    >
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-12">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-hover border-b-2 border-border focus:border-accent outline-none transition-all text-[16px]"
            autoFocus
          />
        </div>

        {searchQuery ? (
          <div className="space-y-12">
            {filteredEntries.length > 0 ? (
              <>
                {filteredEntries.slice(0, visibleCount).map(entry => (
                  <article key={entry.id} className="group">
                    <h3
                      className="text-[20px] text-text-main group-hover:text-accent transition-all cursor-pointer mb-2"
                      onClick={() => onPostClick(entry.id)}
                    >
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[12px] text-text-muted uppercase tracking-wider mt-3 mb-4">
                      <span><span className="font-semibold">{t('dateLabel')}</span> {entry.date?.split(' ')[0]}</span>
                      <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                      <span><span className="font-semibold">{t('categoryLabel')}</span> <span className="text-accent">{entry.category}</span></span>
                    </div>
                    <p className="text-[14px] text-text-main line-clamp-2 leading-relaxed">
                      {entry.excerpt}
                    </p>
                  </article>
                ))}
                {filteredEntries.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="block mx-auto mt-10 px-6 py-2 border border-accent text-accent text-[14px] hover:bg-accent hover:text-surface transition-all"
                  >
                    {t('loadMore')}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-text-muted">
                {t('noResults', { query: searchQuery })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            {t('searchPrompt')}
          </div>
        )}
      </div>
    </motion.div>
  );
}
