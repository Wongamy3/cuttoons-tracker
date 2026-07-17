import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useCollection(collectionName) {
  const [items, setItems] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.error(err)
        setItems([])
      }
    )
    return unsubscribe
  }, [collectionName])

  return items
}
