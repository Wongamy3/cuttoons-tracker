import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export async function downloadBackup() {
  const collections = ['orders', 'expenses', 'portfolio']
  const data = {}
  for (const name of collections) {
    const snap = await getDocs(collection(db, name))
    data[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
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
