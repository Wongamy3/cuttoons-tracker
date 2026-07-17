import { Routes, Route } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import Layout from './components/Layout'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import OrderForm from './pages/OrderForm'
import Portfolio from './pages/Portfolio'
import ForSale from './pages/ForSale'
import Taxes from './pages/Taxes'
import ExpenseForm from './pages/ExpenseForm'
import Settings from './pages/Settings'
import { useAuth } from './hooks/useAuth'
import { auth, ALLOWED_EMAILS } from './firebase'
import { btnSecondary } from './components/buttonStyles'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-brand-50 text-slate-400">Loading...</div>
  }

  if (!user) return <Login />

  if (!ALLOWED_EMAILS.includes(user.email)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-50 px-8 text-center">
        <p className="text-sm text-slate-600">
          This app is private. You're signed in as {user.email}, which isn't on the allowed list.
        </p>
        <button type="button" onClick={() => signOut(auth)} className={btnSecondary}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders/:id" element={<OrderForm />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="for-sale" element={<ForSale />} />
        <Route path="taxes" element={<Taxes />} />
        <Route path="taxes/:id" element={<ExpenseForm />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
