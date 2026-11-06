import { Card } from '../components/Card'
import { grades, subjects } from '../data/demo'
import { average, formatDate } from '../lib/utils'

function gradeColor(v: number) {
  if (v <= 1.5) return 'bg-emerald-500'
  if (v <= 2.5) return 'bg-lime-500'
  if (v <= 3.5) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function Noten() {
  const bySubject = Object.values(subjects)
    .map((s) => ({ subject: s, list: grades.filter((g) => g.subject === s.id) }))
    .filter((x) => x.list.length > 0)
  const total = average(grades.map((g) => g.value))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Noten</h1>

      <Card>
        <div className="flex items-center gap-5">
          <div className={`grid h-20 w-20 place-items-center rounded-2xl text-2xl font-bold text-white ${gradeColor(total)}`}>
            {total.toFixed(2).replace('.', ',')}
          </div>
          <div>
            <p className="font-semibold text-slate-900">Gesamtdurchschnitt</p>
            <p className="text-sm text-slate-500">aus {grades.length} Noten in {bySubject.length} Fächern</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {bySubject.map(({ subject, list }) => {
          const avg = average(list.map((g) => g.value))
          return (
            <Card key={subject.id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{subject.name}</p>
                  <p className="text-xs text-slate-500">{subject.teacher}</p>
                </div>
                <span className={`rounded-xl px-3 py-1.5 text-sm font-bold text-white ${gradeColor(avg)}`}>Ø {avg.toFixed(1).replace('.', ',')}</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {list.map((g, i) => (
                  <li key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-slate-700">{g.type}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{formatDate(g.date)}</span>
                      <span className={`grid h-7 w-7 place-items-center rounded-lg font-bold text-white ${gradeColor(g.value)}`}>{g.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
