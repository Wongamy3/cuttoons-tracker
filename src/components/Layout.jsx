import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logo from '../assets/cuttoons-logo.png'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5V19a1 1 0 0 0 1 1H9.5v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h3a1 1 0 0 0 1-1V9.5" />
    </svg>
  )
}

function PortfolioIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 4.5-4.5a1.5 1.5 0 0 1 2.12 0L15 16.88" />
      <path d="m13.5 15.5 1.88-1.88a1.5 1.5 0 0 1 2.12 0L20 16.12" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
}

function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function TaxesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  )
}

const tabs = [
  { to: '/', label: 'Home', end: true, Icon: HomeIcon },
  { to: '/portfolio', label: 'Portfolio', Icon: PortfolioIcon },
  { to: '/for-sale', label: 'For Sale', Icon: TagIcon },
  { to: '/taxes', label: 'Taxes', Icon: TaxesIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

function pageTitle(pathname) {
  if (pathname.startsWith('/orders/')) return pathname.endsWith('/new') ? 'New Order' : 'Edit Order'
  if (pathname.startsWith('/taxes/')) return pathname.endsWith('/new') ? 'New Expense' : 'Edit Expense'
  const tab = tabs.find((t) => (t.end ? pathname === t.to : pathname.startsWith(t.to)))
  return tab?.label || ''
}

export default function Layout() {
  useDocumentTitle('CutToons Tracker')
  const location = useLocation()
  const title = pageTitle(location.pathname)

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-brand-50">
      <header className="sticky top-0 z-10 border-b border-brand-100 bg-brand-50/95 backdrop-blur">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <img src={logo} alt="CutToons Tracker" className="h-8 w-auto flex-shrink-0" />
          <nav className="flex gap-1">
            {tabs.map(({ to, label, end, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                aria-label={label}
                title={label}
                className={({ isActive }) =>
                  'flex h-10 w-10 items-center justify-center rounded-xl transition duration-150 active:scale-95 ' +
                  (isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-400')
                }
              >
                <Icon className="h-5 w-5" />
              </NavLink>
            ))}
          </nav>
        </div>
        {title && <p className="px-3 pb-2 text-sm font-bold text-slate-600">{title}</p>}
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <Outlet />
      </main>
    </div>
  )
}
