import { exportDB, importInto } from 'dexie-export-import'
import { db } from '../db'

export async function downloadBackup() {
  const blob = await exportDB(db, { prettyJson: false })
  const stamp = new Date().toISOString().slice(0, 10)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cuttoons-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function restoreBackup(file) {
  await importInto(db, file, {
    clearTablesBeforeImport: true,
    overwriteValues: true,
  })
}
