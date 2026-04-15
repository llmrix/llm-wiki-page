import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        primaryColor: isDark ? '#333' : '#f9f9f9',
        primaryTextColor: isDark ? '#eee' : '#333',
        primaryBorderColor: isDark ? '#444' : '#eee',
        lineColor: isDark ? '#888' : '#333',
        secondaryColor: isDark ? '#222' : '#fff',
        tertiaryColor: isDark ? '#222' : '#fff',
      }
    });

    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
      
      // For dynamic updates, we need to use render
      const renderChart = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
          if (ref.current) {
            ref.current.innerHTML = '<div class="text-red-500 text-xs p-2">Mermaid diagram error</div>';
          }
        }
      };

      renderChart();
    }
  }, [chart]);

  return (
    <div className="mermaid-container flex justify-center my-8 bg-surface p-4 rounded-lg border border-border overflow-x-auto">
      <div ref={ref} className="mermaid" />
    </div>
  );
}
