import type { ReactNode } from 'react'

export function Card({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function SubjectBadge({ color, children }: { color: string; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold ${color}`}>{children}</span>
}
