import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addExpense, updateExpense, getExpense, deleteExpense, resolvePhotos, blankExpense, EXPENSE_CATEGORIES } from '../db'
import PhotoUploader from '../components/PhotoUploader'
import { btnPrimary, btnDanger } from '../components/buttonStyles'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none'

export default function ExpenseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const expenseId = isNew ? null : id

  const [form, setForm] = useState(blankExpense())
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isNew) return
    getExpense(expenseId).then((existing) => {
      if (existing) setForm(existing)
      setLoading(false)
    })
  }, [isNew, expenseId])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const receiptPhotos = await resolvePhotos(form.receiptPhotos, 'expenses/receipts')
      const data = { ...form, receiptPhotos }
      if (isNew) {
        await addExpense(data)
      } else {
        await updateExpense(expenseId, data)
      }
      navigate('/taxes')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this expense? This cannot be undone.')) return
    await deleteExpense(expenseId)
    navigate('/taxes')
  }

  if (loading) return <p className="text-sm text-slate-400">Loading...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input
            type="date"
            required
            className={inputCls}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </Field>
        <Field label="Amount ($)">
          <input
            type="number"
            min="0"
            step="0.01"
            required
            className={inputCls}
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Vendor / store">
        <input
          placeholder="e.g. Home Depot, Michaels..."
          className={inputCls}
          value={form.vendor}
          onChange={(e) => set('vendor', e.target.value)}
        />
      </Field>

      <Field label="What was purchased?">
        <input
          placeholder="e.g. Acrylic paint, MDF sheets, epoxy resin..."
          className={inputCls}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </Field>

      <Field label="Deduction category">
        <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-slate-400">
          Matches Schedule C (Form 1040) expense lines, for when you file
        </span>
      </Field>

      <PhotoUploader
        label="Receipt photo(s)"
        photos={form.receiptPhotos}
        onChange={(photos) => set('receiptPhotos', photos)}
      />

      <Field label="Notes">
        <textarea
          rows={2}
          className={inputCls}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className={'flex-1 disabled:opacity-60 ' + btnPrimary}>
          {submitting ? 'Saving...' : isNew ? 'Add expense' : 'Save changes'}
        </button>
        {!isNew && (
          <button type="button" onClick={handleDelete} disabled={submitting} className={btnDanger}>
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
