import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as LucideIcons from 'lucide-react';
import Mermaid from './Mermaid';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`markdown-body ${className}`.trim()}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                    pre: ({ children }) => <pre>{children}</pre>,
                    // @ts-ignore
                    icon: ({ name, size = 16, className = "" }) => {
                        // @ts-ignore
                        const IconComponent = LucideIcons[name];
                        if (!IconComponent) return null;
                        return <IconComponent size={size} className={`inline-block align-text-bottom mb-0.5 ${className}`} />;
                    },
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        // In react-markdown v9+, `inline` prop is removed.
                        // Detect inline by checking if parent is NOT a `pre` element.
                        const isInline = node?.position?.start.line === node?.position?.end.line
                            && !className;

                        if (!isInline && match && match[1] === 'mermaid') {
                            return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                        }

                        if (!isInline && match) {
                            return (
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="pre"
                                />
                            );
                        }

                        if (!isInline && !match) {
                            return (
                                <pre>
                                    <code className={className}>{children}</code>
                                </pre>
                            );
                        }

                        return (
                            <code {...props} className={className}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
