import { Link } from 'react-router-dom'
import { InstagramIcon, FacebookIcon } from './SocialIcons'
import { INSTAGRAM_HANDLE, FACEBOOK_PAGE } from '../../lib/shopUtils'

const links = [
  { to: '/shop', label: 'Home' },
  { to: '/shop/browse', label: 'Shop' },
  { to: '/shop/about', label: 'About' },
  { to: '/shop/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white px-4 py-10 text-center">
      <p className="font-comic text-2xl text-black">CutToons</p>
      <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
        Handmade custom paintings, cut and painted with love.
      </p>

      <nav className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="transition hover:text-comic-500">
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-5 flex justify-center gap-4">
        <a
          href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="text-black transition hover:text-comic-500"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
        <a
          href={`https://facebook.com/${FACEBOOK_PAGE}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="text-black transition hover:text-comic-500"
        >
          <FacebookIcon className="h-5 w-5" />
        </a>
      </div>

      <p className="mt-6 text-[11px] text-slate-400">© {new Date().getFullYear()} CutToons</p>
    </footer>
  )
}
