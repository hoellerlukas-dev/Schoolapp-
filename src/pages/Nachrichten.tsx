import { Megaphone } from 'lucide-react'
import { Card } from '../components/Card'
import { news } from '../data/demo'
import { relativeDay } from '../lib/utils'

export function Nachrichten() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Neuigkeiten</h1>
      <div className="space-y-4">
        {news.map((n) => (
          <Card key={n.id} className={n.important ? 'border-l-4 border-l-rose-500' : ''}>
            <div className="flex gap-4">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${n.important ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <Megaphone size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-900">{n.title}</h2>
                  {n.important && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">Wichtig</span>}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {n.from} · {relativeDay(n.date)}
                </p>
                <p className="mt-2 text-sm text-slate-700">{n.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
