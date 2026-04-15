import { useState } from 'react';
import { motion } from 'motion/react';
import MarkdownRenderer from './MarkdownRenderer';
import { ArrowLeft, Twitter, Facebook, Link as LinkIcon, Check, Coffee, MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArchiveEntry } from '../services/types';

interface PostDetailProps {
  entry: ArchiveEntry;
  previousEntry?: ArchiveEntry;
  onNavigate: (id: string) => void;
  onBack: () => void;
  onTagClick: (tag: string) => void;
  buyMeCoffeeUrl?: string;
}

export default function PostDetail({ entry, previousEntry, onNavigate, onBack, onTagClick, buyMeCoffeeUrl }: PostDetailProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/post/${entry.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(entry.title)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#1DA1F2]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#4267B2]'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(entry.title + ' ' + shareUrl)}`,
      color: 'hover:text-[#25D366]'
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(entry.title)}`,
      color: 'hover:text-[#0088cc]'
    }
  ];

  return (
    <>
      <motion.div
        key="detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": entry.title,
            "description": entry.excerpt,
            "author": {
              "@type": "Person",
              "name": "Orion Author"
            },
            "datePublished": entry.date?.split(' ')[0],
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": shareUrl
            }
          })}
        </script>
        <div className="content-card">
          <article>
            <header className="post-header">
              <h1 className="text-[2rem] font-bold text-text-title leading-tight tracking-tight !mb-4">{entry.title}</h1>
              <div className="flex items-center justify-center gap-3 text-[12px] text-text-muted uppercase tracking-wider mt-3 mb-8">
                <span><span className="font-semibold">{t('dateLabel')}</span> {entry.date?.split(' ')[0]}</span>
                <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                <span><span className="font-semibold">{t('categoryLabel')}</span> <span className="text-accent">{entry.category}</span></span>
              </div>
            </header>

            <MarkdownRenderer content={entry.content || ''} />

            {/* Copyright Box */}
            <div className="mt-16 p-6 bg-surface-hover border-l-4 border-accent text-[14px] leading-[1.8] text-text-main">
              <div className="mb-2">
                <span className="font-bold mr-2">{t('link')}</span>
                <a href={shareUrl} className="text-text-main border-b border-border hover:border-accent transition-all">
                  {shareUrl}
                </a>
              </div>
              <div>
                <span className="font-bold mr-2">{t('copyright')}</span>
                <span>{t('license')}<a href="#" className="text-text-main border-b border-border hover:border-accent transition-all">CC BY-NC-SA 3.0 CN</a>{t('licenseEnd')}</span>
              </div>
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="mt-10 flex justify-center gap-4 text-[13px] text-text-muted">
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    className="border-b border-border hover:border-accent transition-all cursor-pointer"
                    onClick={() => onTagClick(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Navigation */}
            <footer className="mt-16 pt-8 border-t border-border flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => previousEntry && onNavigate(previousEntry.id)}
                  className="flex items-center gap-2 text-[14px] text-text-title hover:text-accent transition-all group"
                  disabled={!previousEntry}
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  <span>{previousEntry?.title || t('previousPost')}</span>
                </button>
                <button
                  onClick={onBack}
                  className="text-[14px] text-text-muted hover:text-accent transition-all"
                >
                  {t('backToList')}
                </button>
              </div>
            </footer>
          </article>
        </div>
      </motion.div>

      {/* Share & Support Section - Outside Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-16 flex flex-col items-center gap-12"
      >
        {buyMeCoffeeUrl && (
          <div className="flex flex-col items-center">
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

        <div className="flex justify-center gap-6">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-muted transition-all duration-300 hover:shadow-md hover:border-accent hover:-translate-y-1 group ${link.color}`}
              title={`Share on ${link.name}`}
            >
              <link.icon size={20} className="transition-colors" />
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            className="w-12 h-12 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-text-muted transition-all duration-300 hover:shadow-md hover:border-accent hover:-translate-y-1 group relative"
            title="Copy Link"
          >
            {copied ? (
              <Check size={20} className="text-accent" />
            ) : (
              <LinkIcon size={20} className="group-hover:text-accent transition-colors" />
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}
