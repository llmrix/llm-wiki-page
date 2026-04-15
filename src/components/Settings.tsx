import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Settings({ theme, toggleTheme }: SettingsProps) {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="content-card"
    >
      <h2 className="text-[20px] font-bold text-text-title mb-8 border-b border-border pb-2">{t('settings')}</h2>

      <div className="py-6 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="font-bold text-text-title">{t('themeMode')}</h3>
          <p className="text-[13px] text-text-muted">{t('themeDescription')}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 border border-accent text-accent text-[13px] hover:bg-accent hover:text-surface transition-all"
        >
          {theme === 'light' ? t('darkMode') : t('lightMode')}
        </button>
      </div>
      <div className="py-6 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="font-bold text-text-title">{t('language')}</h3>
          <p className="text-[13px] text-text-muted">{t('languageDescription')}</p>
        </div>
        <div className="relative group">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-accent bg-transparent text-accent text-[13px] rounded-none hover:bg-accent hover:text-surface transition-all cursor-pointer focus:outline-none"
          >
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent pointer-events-none transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );
}
