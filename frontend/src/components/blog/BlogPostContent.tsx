import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mb-3 mt-8 font-display text-2xl font-bold text-slate-900 first:mt-0">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 font-display text-2xl font-bold text-slate-900 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mb-2 mt-6 font-display text-xl font-bold text-slate-900">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-relaxed text-slate-700">{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-lagoon-700 underline decoration-lagoon-300 underline-offset-2 hover:text-lagoon-800"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-6 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-slate-700">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-lagoon-200 pl-4 italic text-slate-600">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-lagoon-700">{children}</code>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={src} alt={alt ?? ''} loading="lazy" className="my-6 w-full rounded-2xl" />
  ),
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  hr: () => <hr className="my-8 border-slate-200" />,
}

export interface BlogPostContentProps {
  markdown: string
}

export function BlogPostContent({ markdown }: BlogPostContentProps) {
  return (
    <div className="max-w-none text-base">
      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </div>
  )
}
