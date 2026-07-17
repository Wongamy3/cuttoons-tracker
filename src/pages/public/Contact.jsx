const INSTAGRAM_HANDLE = 'cuttoonsja'
const FACEBOOK_PAGE = 'cuttoons'

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export default function Contact() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">Contact Us</h1>
      <p className="mt-2 text-sm text-slate-600">
        Interested in a custom commission, or have a question about a piece? Reach out any time.
      </p>

      <div className="mt-6 space-y-3">
        <a
          href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition duration-150 hover:bg-slate-50 active:scale-[0.98]"
        >
          <InstagramIcon className="h-6 w-6 text-black" />
          <span className="font-medium text-black">@{INSTAGRAM_HANDLE}</span>
        </a>
        <a
          href={`https://facebook.com/${FACEBOOK_PAGE}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition duration-150 hover:bg-slate-50 active:scale-[0.98]"
        >
          <FacebookIcon className="h-6 w-6 text-black" />
          <span className="font-medium text-black">CutToons</span>
        </a>
      </div>
    </main>
  )
}
