import { BottomNav, Sidebar, type Page } from './components/Navigation'
import { homework } from './data/demo'
import { useStoredState } from './lib/utils'
import { Dashboard } from './pages/Dashboard'
import { Hausaufgaben } from './pages/Hausaufgaben'
import { initialKomm, Kommunikation, unreadCount, type KommState } from './pages/Kommunikation'
import { Noten } from './pages/Noten'
import { Stundenplan } from './pages/Stundenplan'

export default function App() {
  const [page, setPage] = useStoredState<Page>('page', 'start')
  const [done, setDone] = useStoredState<string[]>('homework-done', [])
  const [komm, setKomm] = useStoredState<KommState>('komm', initialKomm)

  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))
  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0 })
  }
  const badges = { hausaufgaben: homework.filter((h) => !done.includes(h.id)).length, nachrichten: unreadCount(komm) }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar page={page} onChange={navigate} badges={badges} />
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
        <div className="mx-auto max-w-6xl">
          {page === 'start' && <Dashboard done={done} onNavigate={navigate} />}
          {page === 'stundenplan' && <Stundenplan />}
          {page === 'hausaufgaben' && <Hausaufgaben done={done} toggle={toggle} />}
          {page === 'noten' && <Noten />}
          {page === 'nachrichten' && <Kommunikation state={komm} setState={setKomm} />}
        </div>
      </main>
      <BottomNav page={page} onChange={navigate} badges={badges} />
    </div>
  )
}
