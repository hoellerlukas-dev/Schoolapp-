import { AlertTriangle, ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { Card, SubjectBadge } from '../components/Card'
import type { Page } from '../components/Navigation'
import { exams, grades, homework, news, periods, subjects, timetable, weekdays } from '../data/demo'
import { overallAverage } from '../lib/grades'
import { daysUntil, relativeDay, todayIndex } from '../lib/utils'

type Props = { done: string[]; onNavigate: (p: Page) => void }

export function Dashboard({ done, onNavigate }: Props) {
  const day = todayIndex()
  const lessons = timetable[day]
  const openHomework = homework.filter((h) => !done.includes(h.id)).sort((a, b) => a.due.localeCompare(b.due))
  const nextExams = [...exams].sort((a, b) => a.date.localeCompare(b.date)).filter((e) => daysUntil(e.date) >= 0)
  const avg = overallAverage(grades) ?? 0
  const changes = lessons.filter((l) => l?.status && l.status !== 'normal').length
  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend'

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{greeting}, Lukas! 👋</h1>
      </header>

      {/* Kurzübersicht */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Offene Aufgaben" value={openHomework.length} tone="indigo" />
        <Stat label="Nächster Test" value={nextExams[0] ? relativeDay(nextExams[0].date) : '–'} tone="rose" />
        <Stat label="Notenschnitt" value={avg.toFixed(2).replace('.', ',')} tone="emerald" />
        <Stat label="Änderungen heute" value={changes} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Heute */}
        <Card
          className="lg:col-span-2"
          title={`Dein Tag – ${weekdays[day]}`}
          action={<LinkButton onClick={() => onNavigate('stundenplan')}>Ganze Woche</LinkButton>}
        >
          <ol className="space-y-2">
            {lessons.map((lesson, i) => {
              const p = periods[i]
              if (!lesson)
                return (
                  <li key={i} className="flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-slate-400">
                    <span className="w-12 text-xs">{p.start}</span> Frei
                  </li>
                )
              const s = subjects[lesson.subject]
              const cancelled = lesson.status === 'entfall'
              return (
                <li
                  key={i}
                  className={`flex items-center gap-4 rounded-xl border px-3 py-2.5 ${
                    cancelled ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="w-12 text-xs text-slate-500">
                    <div className="font-semibold text-slate-700">{p.start}</div>
                    {p.end}
                  </div>
                  <div className={`h-10 w-1.5 rounded-full ${s.accent}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${cancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{s.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} /> {s.room} · {s.teacher}
                    </p>
                  </div>
                  {lesson.status && lesson.status !== 'normal' && <StatusPill status={lesson.status} note={lesson.note} />}
                </li>
              )
            })}
          </ol>
        </Card>

        <div className="space-y-6">
          {/* Hausaufgaben */}
          <Card title="Als Nächstes fällig" action={<LinkButton onClick={() => onNavigate('hausaufgaben')}>Alle</LinkButton>}>
            {openHomework.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={18} /> Alles erledigt – stark!
              </p>
            ) : (
              <ul className="space-y-3">
                {openHomework.slice(0, 3).map((h) => (
                  <li key={h.id} className="flex items-start gap-3">
                    <SubjectBadge color={subjects[h.subject].color}>{subjects[h.subject].short}</SubjectBadge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800">{h.title}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} /> {relativeDay(h.due)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Tests */}
          <Card title="Kommende Tests">
            <ul className="space-y-3">
              {nextExams.map((e) => {
                const d = daysUntil(e.date)
                return (
                  <li key={e.id} className="flex items-center gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl text-center text-xs font-bold ${d <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                      {d}
                      <br />
                      <span className="font-normal">Tg.</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{subjects[e.subject].name}</p>
                      <p className="truncate text-xs text-slate-500">{e.title}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          {/* Neueste Nachricht */}
          <Card title="Neuigkeiten" action={<LinkButton onClick={() => onNavigate('nachrichten')}>Alle</LinkButton>}>
            <p className="text-sm font-medium text-slate-800">{news[0].title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{news[0].text}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: 'indigo' | 'rose' | 'emerald' | 'amber' }) {
  const tones = {
    indigo: 'from-indigo-500 to-indigo-600',
    rose: 'from-rose-500 to-rose-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-500',
  }
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-4 text-white shadow-sm`}>
      <p className="text-xs/5 opacity-90">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}

export function StatusPill({ status, note }: { status: string; note?: string }) {
  const styles: Record<string, string> = {
    entfall: 'bg-slate-200 text-slate-700',
    vertretung: 'bg-amber-100 text-amber-800',
    raumänderung: 'bg-sky-100 text-sky-800',
  }
  const labels: Record<string, string> = { entfall: 'Entfällt', vertretung: 'Vertretung', raumänderung: 'Raumänderung' }
  return (
    <span title={note} className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <AlertTriangle size={12} /> {labels[status]}
    </span>
  )
}

function LinkButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
      {children} <ArrowRight size={14} />
    </button>
  )
}
