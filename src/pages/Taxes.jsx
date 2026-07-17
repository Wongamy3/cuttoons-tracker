import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../lib/useCollection'
import { btnPrimary } from '../components/buttonStyles'

function yearOf(dateStr) {
  return dateStr ? new Date(dateStr + 'T00:00:00').getFullYear() : null
}

export default function Taxes() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const expenses = useCollection('expenses')

  const { yearExpenses, total, byCategory } = useMemo(() => {
    if (!expenses) return { yearExpenses: [], total: 0, byCategory: [] }
    const filtered = expenses
      .filter((e) => yearOf(e.date) === selectedYear)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const totals = new Map()
    let sum = 0
    for (const e of filtered) {
      const amt = parseFloat(e.amount) || 0
      sum += amt
      totals.set(e.category, (totals.get(e.category) || 0) + amt)
    }
    const byCategory = [...totals.entries()].sort((a, b) => b[1] - a[1])

    return { yearExpenses: filtered, total: sum, byCategory }
  }, [expenses, selectedYear])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSelectedYear((y) => y - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-500 transition active:scale-95"
          aria-label="Previous year"
        >
          ‹
        </button>
        <p className="text-lg font-bold text-black">{selectedYear} Expenses</p>
        <button
          type="button"
          onClick={() => setSelectedYear((y) => y + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-500 transition active:scale-95"
          aria-label="Next year"
        >
          ›
        </button>
      </div>

      <Link to="/taxes/new" className={'block text-center ' + btnPrimary}>
        + Add Expense
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-sm font-medium text-slate-700">Total for {selectedYear}</p>
        <p className="text-2xl font-bold text-black">${total.toFixed(2)}</p>

        {byCategory.length > 0 && (
          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
            {byCategory.map(([category, amt]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{category}</span>
                <span className="font-semibold text-black">${amt.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {expenses === undefined && <p className="text-sm text-slate-400">Loading...</p>}

      {expenses && yearExpenses.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No expenses logged for {selectedYear} yet.
        </div>
      )}

      <ul className="space-y-2">
        {yearExpenses.map((e) => (
          <li key={e.id}>
            <Link
              to={`/taxes/${e.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-150 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-black">{e.vendor || 'Unnamed purchase'}</p>
                  {e.description && <p className="mt-0.5 text-xs text-slate-500">{e.description}</p>}
                </div>
                <p className="font-semibold text-black">${(parseFloat(e.amount) || 0).toFixed(2)}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {e.category}
                </span>
                <span className="text-xs text-slate-400">
                  {e.date ? new Date(e.date + 'T00:00:00').toLocaleDateString() : ''}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
