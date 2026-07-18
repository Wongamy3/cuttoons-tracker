import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/cuttoons-logo.png'
import Footer from './Footer'
import { InstagramIcon, FacebookIcon } from './SocialIcons'
import { INSTAGRAM_HANDLE, FACEBOOK_PAGE } from '../../lib/shopUtils'

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

const links = [
  { to: '/shop', label: 'Home', end: true },
  { to: '/shop/browse', label: 'Shop' },
  { to: '/shop/about', label: 'About' },
  { to: '/shop/contact', label: 'Contact Us' },
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)

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
          <img src={logo} alt="CutToons" className="h-10 w-auto justify-self-center" />
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
          </div>
        </header>

        {open && (
          <nav className="border-b border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {links.map((l) => (
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
              ))}
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
