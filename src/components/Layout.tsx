import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-main selection:bg-accent selection:text-surface border-t-[3px] border-t-brand-bg">
      <div className="layout-wrapper">
        {sidebar}
        <main className="main-content">
          {children}
        </main>
      </div>

      <footer className="pt-20 pb-10 text-center text-[12px] text-text-muted tracking-widest uppercase">
        <div>{t('footer')}</div>
      </footer>

      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-12 bottom-12 p-3 bg-surface border border-border rounded-full shadow-sm text-text-muted hover:text-accent hover:border-accent transition-all duration-300 z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
}
