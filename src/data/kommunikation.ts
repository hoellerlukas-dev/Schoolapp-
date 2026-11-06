// Beispiel-Daten für Chat, Elternbriefe und Sprechtag

export type ChatMessage = { id: string; from: 'me' | string; text: string; time: string; read?: boolean }
export type ChatThread = { id: string; title: string; subtitle: string; avatar: string; group?: boolean; messages: ChatMessage[] }

const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString()

export const threads: ChatThread[] = [
  {
    id: 't1', title: 'Hr. Novak', subtitle: 'Mathematik', avatar: 'HN',
    messages: [
      { id: 'm1', from: 'me', text: 'Guten Tag Herr Novak, ich habe Aufgabe 5 auf S. 84 nicht verstanden. Können Sie mir einen Tipp geben?', time: ago(180), read: true },
      { id: 'm2', from: 'Hr. Novak', text: 'Hallo Lukas, zeichne dir die Gerade zuerst ins Koordinatensystem – dann siehst du die Steigung direkt. Wir besprechen es morgen nochmal.', time: ago(95) },
    ],
  },
  {
    id: 't2', title: 'Klasse 9b', subtitle: '27 Mitglieder', avatar: '9b', group: true,
    messages: [
      { id: 'm3', from: 'Fr. Berger', text: 'Denkt bitte an die Einverständniserklärung für den Wandertag!', time: ago(600) },
      { id: 'm4', from: 'Mia', text: 'Wann genau ist Treffpunkt?', time: ago(560) },
      { id: 'm5', from: 'Fr. Berger', text: '8:00 Uhr am Haupteingang.', time: ago(540) },
    ],
  },
  {
    id: 't3', title: 'Fr. Berger', subtitle: 'Klassenleitung · Deutsch', avatar: 'FB',
    messages: [{ id: 'm6', from: 'Fr. Berger', text: 'Dein Referat war super, weiter so!', time: ago(2880) }],
  },
]

export type Letter = {
  id: string; title: string; from: string; date: string; text: string
  needsReply?: { question: string; options: string[]; deadline: string }
}

const inDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const letters: Letter[] = [
  {
    id: 'l1', title: 'Wandertag – Einverständniserklärung', from: 'Fr. Berger (Klassenleitung)', date: inDays(-1),
    text: 'Liebe Eltern,\n\nam kommenden Freitag findet unser Wandertag statt. Treffpunkt ist um 8:00 Uhr am Haupteingang, Rückkehr gegen 15:00 Uhr. Bitte geben Sie Ihrem Kind festes Schuhwerk, Regenjacke und Verpflegung mit.\n\nMit freundlichen Grüßen\nM. Berger',
    needsReply: { question: 'Darf Ihr Kind am Wandertag teilnehmen?', options: ['Ja, einverstanden', 'Nein'], deadline: inDays(3) },
  },
  {
    id: 'l2', title: 'Einladung zum Elternsprechtag', from: 'Schulleitung', date: inDays(-4),
    text: 'Sehr geehrte Eltern,\n\nder Elternsprechtag findet am 20. November von 14 bis 18 Uhr statt. Termine können Sie ab sofort direkt in der App unter „Sprechtag“ buchen.\n\nDie Schulleitung',
  },
  {
    id: 'l3', title: 'Fotograf in der Schule', from: 'Sekretariat', date: inDays(-9),
    text: 'Am 25. November kommt der Schulfotograf. Klassen- und Einzelfotos sind freiwillig.',
    needsReply: { question: 'Soll Ihr Kind fotografiert werden?', options: ['Ja', 'Nur Klassenfoto', 'Nein'], deadline: inDays(10) },
  },
]

export type SlotTeacher = { id: string; name: string; subjects: string; room: string; slots: string[] }

export const sprechtag = {
  date: '20.11.',
  teachers: [
    { id: 'st1', name: 'Fr. Berger', subjects: 'Deutsch · Klassenleitung', room: '204', slots: ['14:00', '14:10', '14:20', '14:30', '14:40', '14:50', '15:00', '15:10'] },
    { id: 'st2', name: 'Hr. Novak', subjects: 'Mathematik', room: '108', slots: ['14:00', '14:10', '14:20', '15:00', '15:10', '15:20'] },
    { id: 'st3', name: 'Ms. Taylor', subjects: 'Englisch', room: '210', slots: ['16:00', '16:10', '16:20', '16:30'] },
    { id: 'st4', name: 'Hr. Gruber', subjects: 'Physik', room: 'Ph-Saal', slots: ['14:30', '14:40', '17:00', '17:10'] },
  ] as SlotTeacher[],
  // bereits von anderen gebuchte Zeiten
  taken: { st1: ['14:00', '14:20', '15:00'], st2: ['14:10'], st3: [], st4: ['14:30'] } as Record<string, string[]>,
}
