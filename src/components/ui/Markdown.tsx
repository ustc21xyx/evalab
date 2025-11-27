'use client'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // 标题
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-warm-800 mt-6 mb-3 pb-2 border-b border-warm-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-warm-800 mt-5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-warm-700 mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-warm-700 mt-3 mb-1">
              {children}
            </h4>
          ),

          // 段落
          p: ({ children }) => (
            <p className="text-warm-600 mb-4 leading-7">
              {children}
            </p>
          ),

          // 列表
          ul: ({ children }) => (
            <ul className="list-disc pl-6 text-warm-600 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 text-warm-600 mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-warm-600 leading-7">
              {children}
            </li>
          ),

          // 代码
          code: ({ className, children }) => {
            const isCodeBlock = className?.includes('language-')
            if (isCodeBlock) {
              return (
                <code className="text-sm font-mono">
                  {children}
                </code>
              )
            }
            return (
              <code className="px-1.5 py-0.5 bg-cream-200 text-warm-700 rounded text-sm font-mono">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-warm-800 text-cream-100 p-4 rounded-xl overflow-x-auto my-4 text-sm leading-6">
              {children}
            </pre>
          ),

          // 引用
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-warm-300 pl-4 py-1 my-4 bg-cream-50 rounded-r-lg">
              {children}
            </blockquote>
          ),

          // 链接
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-warm-600 underline decoration-warm-300 hover:text-warm-800 hover:decoration-warm-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // 强调
          strong: ({ children }) => (
            <strong className="font-semibold text-warm-700">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-warm-600">
              {children}
            </em>
          ),

          // 分隔线
          hr: () => (
            <hr className="my-6 border-warm-200" />
          ),

          // 表格
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-cream-100">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-warm-700 border border-warm-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-warm-600 border border-warm-200">
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
