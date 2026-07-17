import { useRef, useState } from 'react'
import { downloadBackup, restoreBackup } from '../lib/backup'
import { btnPrimary, btnSecondary } from '../components/buttonStyles'

export default function Settings() {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('')

  async function handleExport() {
    setStatus('Preparing backup...')
    try {
      await downloadBackup()
      setStatus('Backup downloaded. Save it somewhere safe, like Google Drive or email it to yourself.')
    } catch (err) {
      setStatus('Something went wrong creating the backup: ' + err.message)
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (
      !confirm(
        'Restoring a backup will replace ALL current orders and portfolio photos on this device. Continue?'
      )
    )
      return
    setStatus('Restoring backup...')
    try {
      await restoreBackup(file)
      setStatus('Backup restored successfully.')
    } catch (err) {
      setStatus('Restore failed: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
        <h2 className="font-medium text-black">Backup your data</h2>
        <p className="text-sm text-slate-500">
          All your orders and photos live only on this device's browser. Export a backup regularly and
          save it to Google Drive, email, or your computer — if you lose or reset this device without a
          backup, this data can't be recovered.
        </p>
        <button onClick={handleExport} className={'w-full ' + btnPrimary}>
          Export backup
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
        <h2 className="font-medium text-black">Restore from backup</h2>
        <p className="text-sm text-slate-500">
          Restoring will replace everything currently on this device with the contents of the backup
          file.
        </p>
        <button onClick={() => fileInputRef.current?.click()} className={'w-full ' + btnSecondary}>
          Choose backup file...
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
      </section>

      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  )
}
