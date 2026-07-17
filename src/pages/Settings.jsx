import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { downloadBackup } from '../lib/backup'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { btnPrimary, btnSecondary } from '../components/buttonStyles'

function ExternalLinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [status, setStatus] = useState('')

  async function handleExport() {
    setStatus('Preparing export...')
    try {
      await downloadBackup()
      setStatus('Export downloaded — a snapshot copy of your orders, expenses, and portfolio.')
    } catch (err) {
      setStatus('Something went wrong creating the export: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
        <h2 className="font-medium text-black">Your data</h2>
        <p className="text-sm text-slate-500">
          Your orders, expenses, portfolio, and photos are stored securely in the cloud and sync
          automatically across every device you sign into. You don't need to manually back anything up —
          but you can download a snapshot copy any time for your own records.
        </p>
        <button onClick={handleExport} className={'w-full ' + btnPrimary}>
          Download a copy
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
        <h2 className="font-medium text-black">Customer Shop Page</h2>
        <p className="text-sm text-slate-500">
          A public page anyone can view without signing in — shows only what's currently for sale and
          your previously sold work. Good for sharing on Instagram or sending to a customer.
        </p>
        <a
          href="#/shop"
          target="_blank"
          rel="noopener noreferrer"
          className={'flex w-full items-center justify-center gap-1.5 ' + btnSecondary}
        >
          <ExternalLinkIcon className="h-4 w-4" />
          Open Customer View
        </a>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
        <h2 className="font-medium text-black">Signed in</h2>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <button onClick={() => signOut(auth)} className={'w-full ' + btnSecondary}>
          Sign out
        </button>
      </section>

      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  )
}
