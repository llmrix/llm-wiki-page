import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArchiveEntry } from '../services/types';

interface CategoriesProps {
  categories: string[];
  groupedEntries: { [key: string]: ArchiveEntry[] };
  onCategoryClick: (category: string) => void;
  onPostClick: (id: string) => void;
}

export default function Categories({
  categories,
  groupedEntries,
  onCategoryClick,
  onPostClick,
}: CategoriesProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-card text-center">
        <h2 className="text-[24px] font-bold text-text-title">{t('categories')}</h2>
      </div>

      {categories.filter(c => c !== 'All').length > 0 ? (
        categories.filter(c => c !== 'All').map(category => (
          <div key={category} id={`category-${category}`} className="content-card scroll-mt-24">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <h3
                className="text-[20px] font-bold text-text-title hover:text-accent cursor-pointer transition-colors"
                onClick={() => onCategoryClick(category)}
              >
                {category}
              </h3>
              <span className="text-text-muted text-[14px]">
                {groupedEntries[category]?.length || 0} posts
              </span>
            </div>

            {groupedEntries[category]?.length > 0 ? (
              <div className="grid gap-4">
                {groupedEntries[category]?.slice(0, 10).map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between group cursor-pointer p-2 hover:bg-surface-hover rounded transition-all"
                    onClick={() => onPostClick(entry.id)}
                  >
                    <span className="text-text-main group-hover:text-accent transition-colors text-[15px] truncate flex-1 mr-4">
                      {entry.title}
                    </span>
                    <span className="text-text-muted text-[13px] whitespace-nowrap">
                      {entry.date?.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted">{t('noData')}</p>
            )}

            {groupedEntries[category]?.length > 10 && (
              <div className="mt-6 text-center">
                <button
                  className="text-[13px] text-accent hover:underline"
                  onClick={() => onCategoryClick(category)}
                >
                  {t('viewAll')}
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="content-card text-center pt-0">
          <p className="text-text-muted">{t('noData')}</p>
        </div>
      )}
    </motion.div>
  );
}
