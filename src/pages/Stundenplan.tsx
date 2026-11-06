import { useState } from 'react'
import { Card } from '../components/Card'
import { periods, subjects, timetable, weekdays } from '../data/demo'
import { todayIndex } from '../lib/utils'
import { StatusPill } from './Dashboard'

export function Stundenplan() {
  const today = todayIndex()
  const [mobileDay, setMobileDay] = useState(today)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Stundenplan</h1>

      <Legend />

      {/* Handy: ein Tag mit Tabs */}
      <div className="md:hidden">
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {weekdays.map((d, i) => (
            <button
              key={d}
              onClick={() => setMobileDay(i)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                mobileDay === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {d.slice(0, 2)}
            </button>
          ))}
        </div>
        <Card>
          <ul className="space-y-2">
            {timetable[mobileDay].map((lesson, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-12 text-xs text-slate-500">{periods[i].start}</span>
                <div className="flex-1">
                  <LessonCell lesson={lesson} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Computer: ganze Woche */}
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="w-20" />
              {weekdays.map((d, i) => (
                <th key={d} className={`rounded-lg py-2 text-sm font-semibold ${i === today ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p, pi) => (
              <tr key={p.nr}>
                <td className="text-xs text-slate-500">
                  <div className="font-semibold text-slate-700">{p.nr}. Std.</div>
                  {p.start}–{p.end}
                </td>
                {weekdays.map((_, di) => (
                  <td key={di} className="align-top">
                    <LessonCell lesson={timetable[di][pi]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function LessonCell({ lesson }: { lesson: (typeof timetable)[number][number] }) {
  if (!lesson) return <div className="h-full min-h-16 rounded-xl border border-dashed border-slate-200" />
  const s = subjects[lesson.subject]
  const cancelled = lesson.status === 'entfall'
  return (
    <div className={`min-h-16 rounded-xl border p-2.5 ${cancelled ? 'border-dashed border-slate-300 bg-slate-50 text-slate-400' : s.color}`}>
      <p className={`text-sm font-semibold ${cancelled ? 'line-through' : ''}`}>{s.name}</p>
      <p className="text-xs opacity-80">
        {s.room} · {s.teacher}
      </p>
      {lesson.status && lesson.status !== 'normal' && (
        <div className="mt-1.5 space-y-1">
          <StatusPill status={lesson.status} note={lesson.note} />
          {lesson.note && <p className="text-[11px] text-slate-600">{lesson.note}</p>}
        </div>
      )}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <StatusPill status="entfall" />
      <StatusPill status="vertretung" />
      <StatusPill status="raumänderung" />
    </div>
  )
}
