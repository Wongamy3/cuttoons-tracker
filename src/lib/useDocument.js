import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useDocument(collectionName, docId) {
  const [data, setData] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (snapshot) => setData(snapshot.exists() ? snapshot.data() : null),
      (err) => {
        console.error(err)
        setData(null)
      }
    )
    return unsubscribe
  }, [collectionName, docId])

  return data
}
