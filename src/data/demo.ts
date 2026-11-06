// Beispiel-Daten für die Schul-App.
// Später kommen diese Daten aus einer echten Datenbank.

export type Subject = {
  id: string
  name: string
  short: string
  teacher: string
  room: string
  color: string // Tailwind-Farbklassen für Hintergrund + Text
  accent: string // kräftige Farbe für den Streifen
}

export const subjects: Record<string, Subject> = {
  de: { id: 'de', name: 'Deutsch', short: 'D', teacher: 'Fr. Berger', room: '204', color: 'bg-rose-100 text-rose-800 border-rose-200', accent: 'bg-rose-500' },
  ma: { id: 'ma', name: 'Mathematik', short: 'M', teacher: 'Hr. Novak', room: '108', color: 'bg-blue-100 text-blue-800 border-blue-200', accent: 'bg-blue-500' },
  en: { id: 'en', name: 'Englisch', short: 'E', teacher: 'Ms. Taylor', room: '210', color: 'bg-amber-100 text-amber-800 border-amber-200', accent: 'bg-amber-500' },
  bio: { id: 'bio', name: 'Biologie', short: 'Bio', teacher: 'Fr. Huber', room: 'Bio-Saal', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', accent: 'bg-emerald-500' },
  ph: { id: 'ph', name: 'Physik', short: 'Ph', teacher: 'Hr. Gruber', room: 'Ph-Saal', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', accent: 'bg-indigo-500' },
  ge: { id: 'ge', name: 'Geschichte', short: 'G', teacher: 'Hr. Wagner', room: '305', color: 'bg-orange-100 text-orange-800 border-orange-200', accent: 'bg-orange-500' },
  sp: { id: 'sp', name: 'Sport', short: 'Sp', teacher: 'Fr. Klein', room: 'Turnhalle', color: 'bg-lime-100 text-lime-800 border-lime-200', accent: 'bg-lime-500' },
  ku: { id: 'ku', name: 'Kunst', short: 'Ku', teacher: 'Fr. Moser', room: 'Atelier', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200', accent: 'bg-fuchsia-500' },
  inf: { id: 'inf', name: 'Informatik', short: 'Inf', teacher: 'Hr. Steiner', room: 'EDV 1', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', accent: 'bg-cyan-500' },
  mu: { id: 'mu', name: 'Musik', short: 'Mu', teacher: 'Fr. Lang', room: 'Musiksaal', color: 'bg-violet-100 text-violet-800 border-violet-200', accent: 'bg-violet-500' },
}

export const periods = [
  { nr: 1, start: '08:00', end: '08:50' },
  { nr: 2, start: '08:55', end: '09:45' },
  { nr: 3, start: '10:00', end: '10:50' },
  { nr: 4, start: '10:55', end: '11:45' },
  { nr: 5, start: '11:50', end: '12:40' },
  { nr: 6, start: '12:45', end: '13:35' },
]

export const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']

export type LessonStatus = 'normal' | 'entfall' | 'vertretung' | 'raumänderung'

export type Lesson = {
  subject: string
  status?: LessonStatus
  note?: string
}

// timetable[Wochentag 0-4][Stunde 0-5]; null = Freistunde
export const timetable: (Lesson | null)[][] = [
  [{ subject: 'ma' }, { subject: 'ma' }, { subject: 'de' }, { subject: 'en' }, { subject: 'bio' }, null],
  [{ subject: 'en' }, { subject: 'ph' }, { subject: 'ge', status: 'entfall', note: 'Lehrer krank' }, { subject: 'de' }, { subject: 'sp' }, { subject: 'sp' }],
  [{ subject: 'de' }, { subject: 'ma' }, { subject: 'inf' }, { subject: 'inf' }, { subject: 'ku', status: 'raumänderung', note: 'Raum 112' }, null],
  [{ subject: 'bio' }, { subject: 'en' }, { subject: 'ma', status: 'vertretung', note: 'Vertretung: Fr. Huber' }, { subject: 'ph' }, { subject: 'mu' }, { subject: 'ge' }],
  [{ subject: 'ge' }, { subject: 'de' }, { subject: 'en' }, { subject: 'ma' }, null, null],
]

export type Homework = {
  id: string
  subject: string
  title: string
  due: string // ISO-Datum
}

const inDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const homework: Homework[] = [
  { id: 'h1', subject: 'ma', title: 'Buch S. 84, Aufgaben 3–7', due: inDays(1) },
  { id: 'h2', subject: 'en', title: 'Vokabeln Unit 5 lernen', due: inDays(2) },
  { id: 'h3', subject: 'de', title: 'Erörterung „Social Media“ fertig schreiben', due: inDays(4) },
  { id: 'h4', subject: 'bio', title: 'Plakat Zellaufbau vorbereiten', due: inDays(6) },
  { id: 'h5', subject: 'inf', title: 'Python-Übung: Schleifen', due: inDays(3) },
]

export type Exam = { id: string; subject: string; title: string; date: string }

export const exams: Exam[] = [
  { id: 'e1', subject: 'ma', title: 'Schularbeit: Lineare Funktionen', date: inDays(5) },
  { id: 'e2', subject: 'en', title: 'Vokabeltest Unit 5', date: inDays(2) },
  { id: 'e3', subject: 'ph', title: 'Test: Elektrizität', date: inDays(12) },
]

export type GradeKind = 'schriftlich' | 'muendlich'
export type Grade = { id: string; subject: string; value: number; kind: GradeKind; title: string; date: string }

// Sek I: Noten 1–6 (1,7 = 2+, 2,3 = 2-)
export const grades: Grade[] = [
  { id: 'g1', subject: 'ma', value: 2.3, kind: 'schriftlich', title: 'Klassenarbeit 1', date: inDays(-40) },
  { id: 'g2', subject: 'ma', value: 2, kind: 'schriftlich', title: 'Klassenarbeit 2', date: inDays(-12) },
  { id: 'g3', subject: 'ma', value: 1.7, kind: 'muendlich', title: 'Mitarbeit', date: inDays(-6) },
  { id: 'g4', subject: 'de', value: 3, kind: 'schriftlich', title: 'Aufsatz', date: inDays(-25) },
  { id: 'g5', subject: 'de', value: 2, kind: 'muendlich', title: 'Referat', date: inDays(-8) },
  { id: 'g6', subject: 'en', value: 1.7, kind: 'schriftlich', title: 'Klassenarbeit', date: inDays(-20) },
  { id: 'g7', subject: 'en', value: 2, kind: 'muendlich', title: 'Vokabeltest', date: inDays(-5) },
  { id: 'g8', subject: 'bio', value: 2.3, kind: 'schriftlich', title: 'Test Zellen', date: inDays(-15) },
  { id: 'g9', subject: 'ph', value: 3.7, kind: 'schriftlich', title: 'Test Mechanik', date: inDays(-14) },
  { id: 'g10', subject: 'ph', value: 3, kind: 'muendlich', title: 'Mitarbeit', date: inDays(-4) },
  { id: 'g11', subject: 'inf', value: 1, kind: 'muendlich', title: 'Projekt', date: inDays(-3) },
  { id: 'g12', subject: 'ge', value: 2, kind: 'muendlich', title: 'Referat', date: inDays(-18) },
]

// Oberstufe: Punkte 0–15
export const gradesPoints: Grade[] = [
  { id: 'p1', subject: 'ma', value: 11, kind: 'schriftlich', title: 'Klausur 1', date: inDays(-40) },
  { id: 'p2', subject: 'ma', value: 12, kind: 'muendlich', title: 'Mitarbeit', date: inDays(-6) },
  { id: 'p3', subject: 'de', value: 9, kind: 'schriftlich', title: 'Klausur 1', date: inDays(-25) },
  { id: 'p4', subject: 'de', value: 10, kind: 'muendlich', title: 'Referat', date: inDays(-8) },
  { id: 'p5', subject: 'en', value: 13, kind: 'schriftlich', title: 'Klausur 1', date: inDays(-20) },
  { id: 'p6', subject: 'en', value: 12, kind: 'muendlich', title: 'Mitarbeit', date: inDays(-5) },
  { id: 'p7', subject: 'ph', value: 7, kind: 'schriftlich', title: 'Klausur 1', date: inDays(-14) },
  { id: 'p8', subject: 'ph', value: 8, kind: 'muendlich', title: 'Mitarbeit', date: inDays(-4) },
  { id: 'p9', subject: 'inf', value: 15, kind: 'muendlich', title: 'Projekt', date: inDays(-3) },
]

export type News = { id: string; title: string; text: string; date: string; from: string; important?: boolean }

export const news: News[] = [
  { id: 'n1', title: 'Wandertag am Freitag', text: 'Treffpunkt 8:00 Uhr beim Haupteingang. Bitte festes Schuhwerk und Jause mitnehmen.', date: inDays(-1), from: 'Klassenvorstand', important: true },
  { id: 'n2', title: 'Elternsprechtag', text: 'Der Elternsprechtag findet am 20. November von 14–18 Uhr statt. Termine bitte online buchen.', date: inDays(-3), from: 'Direktion' },
  { id: 'n3', title: 'Neue AG: Robotik', text: 'Ab nächster Woche jeden Mittwoch in der 7. Stunde im EDV-Raum 1. Anmeldung bei Hr. Steiner.', date: inDays(-6), from: 'Hr. Steiner' },
]
