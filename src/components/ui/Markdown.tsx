'use client'

import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={`prose prose-warm max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // 自定义样式
          h1: ({ children }) => <h1 className="text-xl font-bold text-warm-800 mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-warm-800 mt-3 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold text-warm-700 mt-2 mb-1">{children}</h3>,
          p: ({ children }) => <p className="text-warm-600 mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-warm-600 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-warm-600 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-warm-600">{children}</li>,
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return <code className="px-1.5 py-0.5 bg-cream-200 text-warm-700 rounded text-sm font-mono">{children}</code>
            }
            return (
              <code className="block bg-warm-800 text-cream-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <pre className="bg-warm-800 text-cream-100 p-4 rounded-lg overflow-x-auto my-3">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-warm-300 pl-4 italic text-warm-500 my-3">{children}</blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-warm-600 underline hover:text-warm-800" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-warm-700">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
