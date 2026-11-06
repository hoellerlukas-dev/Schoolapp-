import { BookOpen, CalendarDays, GraduationCap, Home, MessageCircle } from 'lucide-react'

export type Page = 'start' | 'stundenplan' | 'hausaufgaben' | 'noten' | 'nachrichten'

export const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'start', label: 'Start', icon: Home },
  { id: 'stundenplan', label: 'Stundenplan', icon: CalendarDays },
  { id: 'hausaufgaben', label: 'Aufgaben', icon: BookOpen },
  { id: 'noten', label: 'Noten', icon: GraduationCap },
  { id: 'nachrichten', label: 'Nachrichten', icon: MessageCircle },
]

type Props = { page: Page; onChange: (p: Page) => void; badges?: Partial<Record<Page, number>> }

/** Seitenleiste am Computer */
export function Sidebar({ page, onChange, badges = {} }: Props) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
          <GraduationCap size={22} />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-slate-900">SchulApp</p>
          <p className="text-xs text-slate-500">Klasse 4B</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={20} />
              <span className="flex-1">{label}</span>
              {!!badges[id] && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">{badges[id]}</span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

/** Leiste unten am Handy */
export function BottomNav({ page, onChange, badges = {} }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      {navItems.map(({ id, label, icon: Icon }) => {
        const active = page === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium ${
              active ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Icon size={22} />
            {label}
            {!!badges[id] && (
              <span className="absolute right-1/4 top-1 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
