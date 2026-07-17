import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCeIadv7Nak7vX8xuUC9-EefK3PLLKV9EQ',
  authDomain: 'cuttoons-tracker.firebaseapp.com',
  projectId: 'cuttoons-tracker',
  storageBucket: 'cuttoons-tracker.firebasestorage.app',
  messagingSenderId: '690836443388',
  appId: '1:690836443388:web:d114bc150fbd84df6c0779',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

export const ALLOWED_EMAILS = ['wong.amaymay@gmail.com', 'floressart92@gmail.com']
