import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import OrderForm from './pages/OrderForm'
import Portfolio from './pages/Portfolio'
import Taxes from './pages/Taxes'
import ExpenseForm from './pages/ExpenseForm'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders/:id" element={<OrderForm />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="taxes" element={<Taxes />} />
        <Route path="taxes/:id" element={<ExpenseForm />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
