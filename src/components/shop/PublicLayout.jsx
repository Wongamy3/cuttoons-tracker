import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import logo from '../../assets/cuttoons-logo.png'
import Footer from './Footer'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons'
import { INSTAGRAM_HANDLE, FACEBOOK_PAGE, YOUTUBE_HANDLE } from '../../lib/shopUtils'
import { useDocumentTitle } from '../../lib/useDocumentTitle'

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const links = [
  { to: '/', label: 'Home', end: true },
  {
    label: 'Shop',
    children: [
      { to: '/browse', label: 'Available Paintings' },
      { to: '/merch', label: 'Merch' },
    ],
  },
  { to: '/sold', label: 'Sold Paintings' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact Us' },
]

export default function PublicLayout() {
  useDocumentTitle('CutToons Shop')
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [shopExpanded, setShopExpanded] = useState(false)
  const isShopActive = location.pathname === '/browse' || location.pathname === '/merch'

  useEffect(() => {
    if (open) setShopExpanded(isShopActive)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div className="font-shop-body flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur">
        <header className="grid grid-cols-3 items-center border-b border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center justify-self-start text-black"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          <Link to="/" className="justify-self-center">
            <img src={logo} alt="CutToons" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center justify-self-end gap-2">
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition duration-150 active:scale-90"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={`https://facebook.com/${FACEBOOK_PAGE}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition duration-150 active:scale-90"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={`https://www.youtube.com/@${YOUTUBE_HANDLE}`}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition duration-150 active:scale-90"
            >
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </header>

        {open && (
          <nav className="border-b border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {links.map((l) =>
                l.children ? (
                  <li key={l.label}>
                    <button
                      type="button"
                      onClick={() => setShopExpanded((e) => !e)}
                      className={
                        'font-comic flex w-full items-center justify-between px-4 py-3 text-xl tracking-wide ' +
                        (isShopActive ? 'text-black' : 'text-slate-400')
                      }
                    >
                      {l.label}
                      <ChevronIcon
                        className={'h-4 w-4 transition-transform duration-200 ' + (shopExpanded ? 'rotate-180' : '')}
                      />
                    </button>
                    {shopExpanded && (
                      <ul className="divide-y divide-slate-100 bg-slate-50">
                        {l.children.map((c) => (
                          <li key={c.to}>
                            <NavLink
                              to={c.to}
                              onClick={() => setOpen(false)}
                              className={({ isActive }) =>
                                'font-comic block px-8 py-2.5 text-lg tracking-wide ' +
                                (isActive ? 'text-black' : 'text-slate-400')
                              }
                            >
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        'font-comic block px-4 py-3 text-xl tracking-wide ' +
                        (isActive ? 'text-black' : 'text-slate-400')
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>
        )}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
