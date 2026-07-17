import { useState } from 'react'
import { totalPaid } from '../db'

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none'

export default function PaymentsSection({ payments, onChange }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [date, setDate] = useState('')

  function addPayment() {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return
    onChange([...payments, { amount: amt, method: method.trim(), date }])
    setAmount('')
    setMethod('')
    setDate('')
  }

  function removeAt(index) {
    onChange(payments.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-sm font-medium text-slate-700">Payments</p>

      {payments.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {payments.map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span>
                <span className="font-semibold text-black">${Number(p.amount).toFixed(2)}</span>
                {p.method && <span className="text-slate-500"> · {p.method}</span>}
                {p.date && <span className="text-slate-400"> · {p.date}</span>}
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 transition duration-150 active:scale-90"
                aria-label="Remove payment"
              >
                ×
              </button>
            </li>
          ))}
          <li className="pt-1 text-sm font-semibold text-black">
            Total received: ${totalPaid(payments).toFixed(2)}
          </li>
        </ul>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount ($)"
          className={inputCls}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          className={inputCls}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          placeholder="How received? (Venmo, Cash...)"
          className={inputCls + ' col-span-2'}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <button
          type="button"
          onClick={addPayment}
          className="col-span-2 rounded-full border-2 border-dashed border-slate-300 py-2 text-sm font-bold text-slate-500 transition duration-150 active:scale-95 hover:border-brand-400 hover:text-brand-600"
        >
          + Add payment
        </button>
      </div>
    </div>
  )
}
