import type { Grade, GradeKind } from '../data/demo'
import { average } from './utils'

export type GradeSystem = 'noten' | 'punkte'

export const systems = {
  noten: { label: 'Noten 1–6', min: 1, max: 6, lowerIsBetter: true },
  punkte: { label: 'Punkte 0–15', min: 0, max: 15, lowerIsBetter: false },
} as const

/** Anteil schriftlich am Fach-Schnitt (Rest = mündlich) */
export const WRITTEN_WEIGHT = 0.5

/** Auswahl-Werte für Noten mit Tendenz */
export const noteOptions = [1, 1.3, 1.7, 2, 2.3, 2.7, 3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6]
export const pointOptions = Array.from({ length: 16 }, (_, i) => 15 - i)

/** 1,7 → "2+", 2,3 → "2-", 2 → "2" */
export function gradeLabel(v: number, system: GradeSystem) {
  if (system === 'punkte') return String(Math.round(v))
  const r = Math.round(v * 10) / 10
  const base = Math.round(r)
  if (r < base) return `${base}+`
  if (r > base) return `${base}-`
  return String(base)
}

export const fmt = (v: number, digits = 2) => v.toFixed(digits).replace('.', ',')

/** Umrechnung Punkte → Note (für Farben): 15 P = 0,67 … 0 P = 6 */
export const toNote = (v: number, system: GradeSystem) => (system === 'punkte' ? (17 - v) / 3 : v)

export function gradeColor(v: number, system: GradeSystem) {
  const n = toNote(v, system)
  if (n <= 1.5) return 'bg-emerald-500'
  if (n <= 2.5) return 'bg-lime-500'
  if (n <= 3.5) return 'bg-amber-500'
  if (n <= 4.5) return 'bg-orange-500'
  return 'bg-rose-500'
}

/** Gewichteter Fach-Schnitt; fehlt eine Kategorie, zählt nur die andere. */
export function subjectAverage(list: Grade[]) {
  const w = list.filter((g) => g.kind === 'schriftlich').map((g) => g.value)
  const m = list.filter((g) => g.kind === 'muendlich').map((g) => g.value)
  if (!w.length && !m.length) return null
  if (!w.length) return average(m)
  if (!m.length) return average(w)
  return WRITTEN_WEIGHT * average(w) + (1 - WRITTEN_WEIGHT) * average(m)
}

/** Gesamtschnitt = Schnitt der Fach-Schnitte */
export function overallAverage(all: Grade[]) {
  const bySubject = new Map<string, Grade[]>()
  all.forEach((g) => bySubject.set(g.subject, [...(bySubject.get(g.subject) ?? []), g]))
  const avgs = [...bySubject.values()].map(subjectAverage).filter((x): x is number => x !== null)
  return avgs.length ? average(avgs) : null
}

/**
 * Welche Note brauche ich in der nächsten Leistung (Kategorie `kind`),
 * damit der Fach-Schnitt das Ziel erreicht? Gibt den rohen Wert zurück.
 */
export function neededGrade(list: Grade[], kind: GradeKind, target: number) {
  const same = list.filter((g) => g.kind === kind).map((g) => g.value)
  const other = list.filter((g) => g.kind !== kind).map((g) => g.value)
  const sum = same.reduce((a, b) => a + b, 0)
  const n = same.length + 1
  if (!other.length) return target * n - sum
  const wSame = kind === 'schriftlich' ? WRITTEN_WEIGHT : 1 - WRITTEN_WEIGHT
  const catTarget = (target - (1 - wSame) * average(other)) / wSame
  return catTarget * n - sum
}
