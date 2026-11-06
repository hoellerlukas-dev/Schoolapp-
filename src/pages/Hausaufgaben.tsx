import { CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'
import { Card, SubjectBadge } from '../components/Card'
import { homework, subjects } from '../data/demo'
import { daysUntil, formatDate, relativeDay } from '../lib/utils'

type Props = { done: string[]; toggle: (id: string) => void }

export function Hausaufgaben({ done, toggle }: Props) {
  const [filter, setFilter] = useState<'offen' | 'erledigt' | 'alle'>('offen')
  const list = [...homework]
    .sort((a, b) => a.due.localeCompare(b.due))
    .filter((h) => (filter === 'alle' ? true : filter === 'offen' ? !done.includes(h.id) : done.includes(h.id)))
  const progress = Math.round((done.length / homework.length) * 100)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Hausaufgaben</h1>

      <Card>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-slate-700">Fortschritt diese Woche</span>
          <span className="text-slate-500">
            {done.length} von {homework.length} erledigt
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <div className="flex gap-2">
        {(['offen', 'erledigt', 'alle'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              filter === f ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.length === 0 && <p className="py-10 text-center text-slate-500">Hier ist nichts. 🎉</p>}
        {list.map((h) => {
          const isDone = done.includes(h.id)
          const urgent = !isDone && daysUntil(h.due) <= 1
          const s = subjects[h.subject]
          return (
            <button
              key={h.id}
              onClick={() => toggle(h.id)}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300"
            >
              {isDone ? <CheckCircle2 className="shrink-0 text-emerald-500" size={26} /> : <Circle className="shrink-0 text-slate-300" size={26} />}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <SubjectBadge color={s.color}>{s.name}</SubjectBadge>
                  {urgent && <span className="text-xs font-semibold text-rose-600">Dringend</span>}
                </div>
                <p className={`font-medium ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{h.title}</p>
              </div>
              <div className="shrink-0 text-right text-xs text-slate-500">
                <div className="font-medium text-slate-700">{relativeDay(h.due)}</div>
                {formatDate(h.due)}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
