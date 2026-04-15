import { motion } from 'motion/react';
import MarkdownRenderer from './MarkdownRenderer';
import { Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArchiveEntry } from '../services/types';

interface AboutProps {
  entry?: ArchiveEntry;
  buyMeCoffeeUrl?: string;
}

export default function About({ entry, buyMeCoffeeUrl }: AboutProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-card">
        <article className="markdown-body">
          <header className="post-header">
            <h1 className="!mb-4">{entry?.title}</h1>
          </header>
          <MarkdownRenderer content={entry?.content || '# About\n\nContent not found.'} />
        </article>
      </div>

      {buyMeCoffeeUrl && (
        <div className="mt-12 flex flex-col items-center">
          <a
            href={buyMeCoffeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-3 border-2 border-text-title rounded-full hover:bg-text-title hover:text-surface transition-all duration-300 active:scale-95 shadow-sm hover:shadow-lg"
          >
            <Coffee size={20} className="transition-all group-hover:rotate-12 group-hover:scale-110" />
            <span className="text-[15px] font-bold tracking-tight">
              {t('buyMeCoffee')}
            </span>
          </a>
        </div>
      )}
    </motion.div>
  );
}
