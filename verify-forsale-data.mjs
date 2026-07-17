import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const app = initializeApp({
  apiKey: 'AIzaSyCeIadv7Nak7vX8xuUC9-EefK3PLLKV9EQ',
  authDomain: 'cuttoons-tracker.firebaseapp.com',
  projectId: 'cuttoons-tracker',
})
const db = getFirestore(app)

const snap = await getDocs(collection(db, 'forSale'))
console.log(`docs: ${snap.size}`)
snap.forEach((d) => console.log(JSON.stringify({ id: d.id, ...d.data() }, null, 2)))
process.exit(0)
