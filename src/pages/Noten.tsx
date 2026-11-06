import { Calculator, Plus, Target, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../components/Card'
import { grades as demoNoten, gradesPoints as demoPunkte, subjects, type Grade, type GradeKind } from '../data/demo'
import {
  fmt, gradeColor, gradeLabel, neededGrade, noteOptions, overallAverage, pointOptions, subjectAverage, systems, type GradeSystem,
} from '../lib/grades'
import { formatDate, useStoredState } from '../lib/utils'

export function Noten() {
  const [system, setSystem] = useStoredState<GradeSystem>('grade-system', 'noten')
  const [own, setOwn] = useStoredState<Grade[]>('own-grades', [])
  const [adding, setAdding] = useState(false)

  const all = [...(system === 'noten' ? demoNoten : demoPunkte), ...own.filter((g) => isPoints(g) === (system === 'punkte'))]
  const bySubject = Object.values(subjects)
    .map((s) => ({ subject: s, list: all.filter((g) => g.subject === s.id) }))
    .filter((x) => x.list.length > 0)
  const total = overallAverage(all)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Noten</h1>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-sm">
          {(Object.keys(systems) as GradeSystem[]).map((k) => (
            <button key={k} onClick={() => setSystem(k)} className={`rounded-lg px-3 py-1.5 font-medium ${system === k ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>
              {k === 'noten' ? 'Sek I (1–6)' : 'Oberstufe (0–15)'}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-5">
          {total !== null && (
            <div className={`grid h-20 w-20 place-items-center rounded-2xl text-2xl font-bold text-white ${gradeColor(total, system)}`}>{fmt(total)}</div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Gesamtdurchschnitt</p>
            <p className="text-sm text-slate-500">
              {all.length} Noten in {bySubject.length} Fächern · schriftlich & mündlich je 50 %
            </p>
          </div>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={18} /> Note eintragen
          </button>
        </div>
      </Card>

      {adding && <AddGrade system={system} onClose={() => setAdding(false)} onAdd={(g) => setOwn((o) => [...o, g])} />}

      <NotenRechner system={system} all={all} />

      <div className="grid gap-4 md:grid-cols-2">
        {bySubject.map(({ subject, list }) => {
          const avg = subjectAverage(list)!
          return (
            <Card key={subject.id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{subject.name}</p>
                  <p className="text-xs text-slate-500">{subject.teacher}</p>
                </div>
                <span className={`rounded-xl px-3 py-1.5 text-sm font-bold text-white ${gradeColor(avg, system)}`}>Ø {fmt(avg)}</span>
              </div>
              {(['schriftlich', 'muendlich'] as GradeKind[]).map((kind) => {
                const items = list.filter((g) => g.kind === kind)
                if (!items.length) return null
                return (
                  <div key={kind} className="mt-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{kind === 'schriftlich' ? 'Schriftlich' : 'Mündlich'}</p>
                    <ul className="divide-y divide-slate-100">
                      {items.map((g) => {
                        const mine = own.some((o) => o.id === g.id)
                        return (
                          <li key={g.id} className="flex items-center justify-between py-2 text-sm">
                            <span className="text-slate-700">
                              {g.title} {mine && <span className="ml-1 text-xs text-indigo-500">(eigene)</span>}
                            </span>
                            <span className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">{formatDate(g.date)}</span>
                              {mine && (
                                <button aria-label="Löschen" onClick={() => setOwn((o) => o.filter((x) => x.id !== g.id))} className="text-slate-300 hover:text-rose-500">
                                  <Trash2 size={15} />
                                </button>
                              )}
                              <span className={`grid h-7 min-w-7 place-items-center rounded-lg px-1 font-bold text-white ${gradeColor(g.value, system)}`}>{gradeLabel(g.value, system)}</span>
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Eigene Noten werden mit ID-Präfix gespeichert, damit klar ist, zu welchem System sie gehören.
const isPoints = (g: Grade) => g.id.startsWith('own-p-')

function GradePicker({ system, value, onChange }: { system: GradeSystem; value: number; onChange: (v: number) => void }) {
  const opts = system === 'noten' ? noteOptions : pointOptions
  return (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`h-9 min-w-10 rounded-lg px-2 text-sm font-semibold ${value === v ? `${gradeColor(v, system)} text-white` : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          {gradeLabel(v, system)}
        </button>
      ))}
    </div>
  )
}

function KindToggle({ kind, onChange }: { kind: GradeKind; onChange: (k: GradeKind) => void }) {
  return (
    <div className="flex rounded-xl bg-slate-100 p-1 text-sm">
      {(['schriftlich', 'muendlich'] as GradeKind[]).map((k) => (
        <button key={k} onClick={() => onChange(k)} className={`flex-1 rounded-lg px-3 py-1.5 font-medium ${kind === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
          {k === 'schriftlich' ? 'Schriftlich' : 'Mündlich'}
        </button>
      ))}
    </div>
  )
}

function SubjectSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
      {Object.values(subjects).map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  )
}

function AddGrade({ system, onAdd, onClose }: { system: GradeSystem; onAdd: (g: Grade) => void; onClose: () => void }) {
  const [subject, setSubject] = useState('ma')
  const [kind, setKind] = useState<GradeKind>('schriftlich')
  const [value, setValue] = useState(system === 'noten' ? 2 : 10)
  const [title, setTitle] = useState('')

  const save = () => {
    onAdd({
      id: `own-${system === 'punkte' ? 'p' : 'n'}-${Date.now()}`,
      subject, kind, value,
      title: title.trim() || (kind === 'schriftlich' ? 'Klassenarbeit' : 'Mündlich'),
      date: new Date().toISOString().slice(0, 10),
    })
    onClose()
  }

  return (
    <Card title="Neue Note eintragen">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SubjectSelect value={subject} onChange={setSubject} />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bezeichnung (z. B. Vokabeltest)" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
        </div>
        <KindToggle kind={kind} onChange={setKind} />
        <GradePicker system={system} value={value} onChange={setValue} />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Abbrechen</button>
          <button onClick={save} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Speichern</button>
        </div>
      </div>
    </Card>
  )
}

function NotenRechner({ system, all }: { system: GradeSystem; all: Grade[] }) {
  const cfg = systems[system]
  const [subject, setSubject] = useState('ma')
  const [kind, setKind] = useState<GradeKind>('schriftlich')
  const [mode, setMode] = useState<'wenn' | 'ziel'>('wenn')
  const [value, setValue] = useState(system === 'noten' ? 2 : 10)
  const [target, setTarget] = useState(system === 'noten' ? 2 : 10)

  // Beim Wechsel des Systems passende Startwerte setzen
  const [lastSystem, setLastSystem] = useState(system)
  if (lastSystem !== system) {
    setLastSystem(system)
    setValue(system === 'noten' ? 2 : 10)
    setTarget(system === 'noten' ? 2 : 10)
  }

  const list = all.filter((g) => g.subject === subject)
  const before = subjectAverage(list)
  const after = subjectAverage([...list, { id: 'x', subject, kind, value, title: '', date: '' }])!
  const need = neededGrade(list, kind, target)
  const better = before === null ? false : cfg.lowerIsBetter ? after < before : after > before

  let needText: string
  if (cfg.lowerIsBetter ? need < cfg.min : need > cfg.max) needText = 'Mit einer einzigen Note leider nicht mehr erreichbar.'
  else if (cfg.lowerIsBetter ? need >= cfg.max : need <= cfg.min) needText = 'Schaffst du sicher – egal welche Note!'
  else {
    // auf die nächste wählbare Note runden (sicherheitshalber zur besseren Seite)
    const opts = system === 'noten' ? noteOptions : pointOptions
    const ok = opts.filter((o) => (cfg.lowerIsBetter ? o <= need + 1e-9 : o >= need - 1e-9))
    const pick = cfg.lowerIsBetter ? Math.max(...ok) : Math.min(...ok)
    needText = `Du brauchst mindestens eine ${gradeLabel(pick, system)}.`
  }

  return (
    <Card title="Notenrechner" action={<Calculator className="text-indigo-500" size={20} />}>
      <div className="space-y-4">
        <div className="flex rounded-xl bg-slate-100 p-1 text-sm">
          <button onClick={() => setMode('wenn')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium ${mode === 'wenn' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
            <Calculator size={15} /> Was wäre wenn?
          </button>
          <button onClick={() => setMode('ziel')} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium ${mode === 'ziel' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
            <Target size={15} /> Welche Note brauche ich?
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SubjectSelect value={subject} onChange={setSubject} />
          <KindToggle kind={kind} onChange={setKind} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">{mode === 'wenn' ? 'Nächste Note:' : 'Mein Ziel-Schnitt:'}</p>
          <GradePicker system={system} value={mode === 'wenn' ? value : target} onChange={mode === 'wenn' ? setValue : setTarget} />
        </div>

        <div className="rounded-xl bg-indigo-50 p-4">
          {mode === 'wenn' ? (
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-xs text-slate-500">Jetzt</p>
                <p className="text-2xl font-bold text-slate-700">{before === null ? '–' : fmt(before)}</p>
              </div>
              <span className="text-2xl text-slate-400">→</span>
              <div>
                <p className="text-xs text-slate-500">Danach</p>
                <p className={`text-2xl font-bold ${before === null ? 'text-slate-900' : better ? 'text-emerald-600' : after === before ? 'text-slate-700' : 'text-rose-600'}`}>{fmt(after)}</p>
              </div>
            </div>
          ) : (
            <p className="text-center font-semibold text-indigo-900">{needText}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
