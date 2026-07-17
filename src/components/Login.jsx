import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import logo from '../assets/cuttoons-logo.png'
import { btnPrimary } from './buttonStyles'

const FALLBACK_TO_REDIRECT = ['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment']

async function handleSignIn() {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (err) {
    if (FALLBACK_TO_REDIRECT.includes(err.code)) {
      await signInWithRedirect(auth, googleProvider)
    } else if (err.code !== 'auth/popup-closed-by-user') {
      console.error(err)
    }
  }
}

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-50 px-8 text-center">
      <img src={logo} alt="CutToons Tracker" className="w-full max-w-xs" />
      <p className="text-sm text-slate-600">Sign in to view and sync your orders, portfolio, and expenses.</p>
      <button type="button" onClick={handleSignIn} className={btnPrimary}>
        Sign in with Google
      </button>
    </div>
  )
}
