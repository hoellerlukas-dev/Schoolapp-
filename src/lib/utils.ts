import { useEffect, useState } from 'react'

/** Speichert einen Wert im Browser, damit er nach dem Neuladen noch da ist. */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* Speicher nicht verfügbar – egal */
    }
  }, [key, value])
  return [value, setValue] as const
}

/** "morgen", "in 3 Tagen", "heute" … */
export function relativeDay(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(iso + 'T00:00:00')
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return 'heute'
  if (diff === 1) return 'morgen'
  if (diff === -1) return 'gestern'
  if (diff > 1) return `in ${diff} Tagen`
  return `vor ${-diff} Tagen`
}

export function daysUntil(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000)
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

/** Montag = 0 … Freitag = 4. Am Wochenende wird Montag angezeigt. */
export function todayIndex() {
  const day = new Date().getDay() // 0 = Sonntag
  return day >= 1 && day <= 5 ? day - 1 : 0
}

export function average(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}
