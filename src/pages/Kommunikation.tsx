import { ArrowLeft, Check, CheckCheck, CalendarClock, FileText, Megaphone, MessageCircle, Send, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Card } from '../components/Card'
import { letters, sprechtag, threads as demoThreads, type ChatMessage } from '../data/kommunikation'
import { formatDate, relativeDay, useStoredState } from '../lib/utils'
import { Nachrichten } from './Nachrichten'

type Tab = 'chat' | 'briefe' | 'sprechtag' | 'infos'

export type KommState = {
  sent: Record<string, ChatMessage[]>
  readThreads: string[]
  readLetters: string[]
  replies: Record<string, string>
  bookings: Record<string, string> // Lehrer-ID → Uhrzeit
}

export const initialKomm: KommState = { sent: {}, readThreads: [], readLetters: [], replies: {}, bookings: {} }

/** Anzahl ungelesener Chats + Briefe (für das Abzeichen in der Navigation) */
export function unreadCount(s: KommState) {
  const chats = demoThreads.filter((t) => !s.readThreads.includes(t.id) && t.messages.at(-1)?.from !== 'me').length
  const briefe = letters.filter((l) => !s.readLetters.includes(l.id)).length
  return chats + briefe
}

export function Kommunikation({ state, setState }: { state: KommState; setState: (f: (s: KommState) => KommState) => void }) {
  const [tab, setTab] = useStoredState<Tab>('komm-tab', 'chat')
  const tabs: { id: Tab; label: string; icon: typeof Send }[] = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'briefe', label: 'Elternbriefe', icon: FileText },
    { id: 'sprechtag', label: 'Sprechtag', icon: CalendarClock },
    { id: 'infos', label: 'Infos', icon: Megaphone },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nachrichten</h1>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              tab === id ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      {tab === 'chat' && <Chat state={state} setState={setState} />}
      {tab === 'briefe' && <Briefe state={state} setState={setState} />}
      {tab === 'sprechtag' && <Sprechtag state={state} setState={setState} />}
      {tab === 'infos' && <Nachrichten embedded />}
    </div>
  )
}

type Props = { state: KommState; setState: (f: (s: KommState) => KommState) => void }

const time = (iso: string) => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

function Chat({ state, setState }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const threads = demoThreads.map((t) => ({ ...t, messages: [...t.messages, ...(state.sent[t.id] ?? [])] }))
  const open = threads.find((t) => t.id === openId)

  useEffect(() => {
    const box = endRef.current?.parentElement
    if (box) box.scrollTop = box.scrollHeight
  }, [openId, open?.messages.length])

  const openThread = (id: string) => {
    setOpenId(id)
    setState((s) => (s.readThreads.includes(id) ? s : { ...s, readThreads: [...s.readThreads, id] }))
  }
  const send = () => {
    if (!text.trim() || !open) return
    const msg: ChatMessage = { id: `own-${Date.now()}`, from: 'me', text: text.trim(), time: new Date().toISOString() }
    setState((s) => ({ ...s, sent: { ...s.sent, [open.id]: [...(s.sent[open.id] ?? []), msg] } }))
    setText('')
  }

  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
      {/* Liste */}
      <div className={`space-y-2 ${open ? 'hidden md:block' : ''}`}>
        {threads.map((t) => {
          const last = t.messages.at(-1)!
          const unread = !state.readThreads.includes(t.id) && last.from !== 'me'
          return (
            <button
              key={t.id}
              onClick={() => openThread(t.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                openId === t.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-200'
              }`}
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold ${t.group ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {t.group ? <Users size={18} /> : t.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className={`truncate text-sm ${unread ? 'font-bold' : 'font-semibold'} text-slate-900`}>{t.title}</p>
                  <span className="shrink-0 text-xs text-slate-400">{time(last.time)}</span>
                </div>
                <p className={`truncate text-xs ${unread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                  {last.from === 'me' ? 'Du: ' : t.group ? `${last.from}: ` : ''}
                  {last.text}
                </p>
              </div>
              {unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />}
            </button>
          )
        })}
      </div>

      {/* Verlauf */}
      {open ? (
        <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 p-3">
            <button onClick={() => setOpenId(null)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Zurück">
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="font-semibold text-slate-900">{open.title}</p>
              <p className="text-xs text-slate-500">{open.subtitle}</p>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {open.messages.map((m) => {
              const mine = m.from === 'me'
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${mine ? 'rounded-br-md bg-indigo-600 text-white' : 'rounded-bl-md bg-white text-slate-800'}`}>
                    {!mine && open.group && <p className="mb-0.5 text-xs font-semibold text-indigo-600">{m.from}</p>}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {time(m.time)} {mine && (m.read ? <CheckCheck size={13} /> : <Check size={13} />)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex gap-2 border-t border-slate-100 p-3"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nachricht schreiben …"
              aria-label="Nachricht"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
            />
            <button type="submit" aria-label="Senden" className="grid w-11 place-items-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40" disabled={!text.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden place-items-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400 md:grid">
          Wähle links einen Chat aus
        </div>
      )}
    </div>
  )
}

function Briefe({ state, setState }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = letters.find((l) => l.id === openId)

  if (open) {
    const read = state.readLetters.includes(open.id)
    const reply = state.replies[open.id]
    return (
      <Card>
        <button onClick={() => setOpenId(null)} className="mb-4 flex items-center gap-1 text-sm font-medium text-indigo-600">
          <ArrowLeft size={16} /> Alle Briefe
        </button>
        <h2 className="text-xl font-bold text-slate-900">{open.title}</h2>
        <p className="mb-4 text-sm text-slate-500">
          {open.from} · {formatDate(open.date)}
        </p>
        <p className="whitespace-pre-wrap text-slate-700">{open.text}</p>

        {open.needsReply && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-slate-900">{open.needsReply.question}</p>
            <p className="mb-3 text-xs text-amber-700">Rückmeldung bis {formatDate(open.needsReply.deadline)} ({relativeDay(open.needsReply.deadline)})</p>
            <div className="flex flex-wrap gap-2">
              {open.needsReply.options.map((o) => (
                <button
                  key={o}
                  onClick={() => setState((s) => ({ ...s, replies: { ...s.replies, [open.id]: o }, readLetters: s.readLetters.includes(open.id) ? s.readLetters : [...s.readLetters, open.id] }))}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${reply === o ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}
                >
                  {reply === o && <Check size={14} className="mr-1 inline" />}
                  {o}
                </button>
              ))}
            </div>
            {reply && <p className="mt-3 text-sm text-emerald-700">✓ Deine Antwort wurde übermittelt.</p>}
          </div>
        )}

        {!open.needsReply && (
          <button
            disabled={read}
            onClick={() => setState((s) => ({ ...s, readLetters: [...s.readLetters, open.id] }))}
            className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-emerald-600"
          >
            <CheckCheck size={18} /> {read ? 'Lesen bestätigt' : 'Lesen bestätigen'}
          </button>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {letters.map((l) => {
        const read = state.readLetters.includes(l.id)
        const open = l.needsReply && !state.replies[l.id]
        return (
          <button key={l.id} onClick={() => setOpenId(l.id)} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-indigo-300">
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-600'}`}>
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-slate-900 ${read ? 'font-medium' : 'font-bold'}`}>{l.title}</p>
                {!read && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-medium text-white">Neu</span>}
                {open && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">Antwort nötig</span>}
              </div>
              <p className="text-xs text-slate-500">
                {l.from} · {relativeDay(l.date)}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function Sprechtag({ state, setState }: Props) {
  const booked = Object.entries(state.bookings)
  const book = (teacher: string, slot: string) =>
    setState((s) => {
      const b = { ...s.bookings }
      if (b[teacher] === slot) delete b[teacher]
      else b[teacher] = slot
      return { ...s, bookings: b }
    })
  // Zeit bereits bei einem anderen Lehrer gebucht?
  const clash = (teacher: string, slot: string) => booked.some(([t, s]) => t !== teacher && s === slot)

  return (
    <div className="space-y-4">
      <Card>
        <p className="font-semibold text-slate-900">Elternsprechtag am {sprechtag.date}</p>
        <p className="text-sm text-slate-500">Tippe auf eine freie Zeit, um sie zu buchen. Nochmal tippen = absagen.</p>
        {booked.length > 0 && (
          <ul className="mt-3 space-y-1">
            {booked
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([tid, slot]) => {
                const t = sprechtag.teachers.find((x) => x.id === tid)!
                return (
                  <li key={tid} className="flex items-center gap-2 text-sm text-emerald-700">
                    <Check size={16} /> {slot} Uhr – {t.name}, Raum {t.room}
                  </li>
                )
              })}
          </ul>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {sprechtag.teachers.map((t) => (
          <Card key={t.id}>
            <p className="font-semibold text-slate-900">{t.name}</p>
            <p className="mb-3 text-xs text-slate-500">
              {t.subjects} · Raum {t.room}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.slots.map((slot) => {
                const taken = sprechtag.taken[t.id]?.includes(slot)
                const mine = state.bookings[t.id] === slot
                const blocked = !mine && (taken || clash(t.id, slot) || (!!state.bookings[t.id] && !mine))
                return (
                  <button
                    key={slot}
                    disabled={blocked}
                    onClick={() => book(t.id, slot)}
                    title={taken ? 'Bereits vergeben' : clash(t.id, slot) ? 'Zu dieser Zeit hast du schon einen Termin' : undefined}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      mine ? 'bg-emerald-600 text-white' : blocked ? 'cursor-not-allowed bg-slate-100 text-slate-300 line-through' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
