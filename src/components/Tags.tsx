import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface TagsProps {
  allTags: string[];
  onTagClick: (tag: string) => void;
}

export default function Tags({ allTags, onTagClick }: TagsProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="tags"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="content-card"
    >
      <div className="text-center">
        <h2 className="text-[20px] font-bold text-text-title mb-12">{t('tagCloud')}</h2>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
          {allTags.length > 0 ? allTags.map(tag => (
            <span 
              key={tag} 
              className="text-text-muted hover:text-accent transition-all cursor-pointer border-b border-border hover:border-accent pb-1"
              style={{ fontSize: `${Math.max(12, 12 + Math.random() * 10)}px` }}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </span>
          )) : (
            <p className="text-text-muted">{t('noTags')}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
