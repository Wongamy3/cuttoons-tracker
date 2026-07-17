import { InstagramIcon, FacebookIcon } from '../../components/shop/SocialIcons'
import { INSTAGRAM_HANDLE, FACEBOOK_PAGE } from '../../lib/shopUtils'

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
