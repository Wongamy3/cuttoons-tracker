import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addOrder,
  updateOrder,
  getOrder,
  deleteOrder,
  resolvePhotos,
  blankOrder,
  normalizeOrder,
  totalPaid,
  CONTACT_METHODS,
  SIZE_OPTIONS,
  STATUS_STAGES,
  priceForSize,
} from '../db'
import PhotoUploader from '../components/PhotoUploader'
import PaymentsSection from '../components/PaymentsSection'
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

export default function OrderForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const orderId = isNew ? null : id

  const [form, setForm] = useState(blankOrder())
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isNew) return
    getOrder(orderId).then((existing) => {
      if (existing) setForm(normalizeOrder(existing))
      setLoading(false)
    })
  }, [isNew, orderId])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSizeChange(size) {
    setForm((f) => ({ ...f, size, totalPrice: priceForSize(size) }))
  }

  function handlePaymentsChange(payments) {
    setForm((f) => {
      const paymentAdded = payments.length > f.payments.length
      const shouldAdvance = paymentAdded && f.status === 'New Inquiry'
      return { ...f, payments, status: shouldAdvance ? 'Deposit Received' : f.status }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const [referencePhotos, progressPhotos] = await Promise.all([
        resolvePhotos(form.referencePhotos, 'orders/reference'),
        resolvePhotos(form.progressPhotos, 'orders/progress'),
      ])
      const data = { ...form, referencePhotos, progressPhotos }
      if (isNew) {
        await addOrder(data)
      } else {
        await updateOrder(orderId, data)
      }
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this order? This cannot be undone.')) return
    await deleteOrder(orderId)
    navigate('/')
  }

  if (loading) return <p className="text-sm text-slate-400">Loading...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <Field label="Customer name">
        <input
          required
          className={inputCls}
          value={form.customerName}
          onChange={(e) => set('customerName', e.target.value)}
        />
      </Field>

      <Field label="How did they contact you?">
        <select
          className={inputCls}
          value={form.contactMethod}
          onChange={(e) => set('contactMethod', e.target.value)}
        >
          {CONTACT_METHODS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </Field>

      <Field label="Contact info (phone, @handle, email...)">
        <input
          className={inputCls}
          value={form.contactInfo}
          onChange={(e) => set('contactInfo', e.target.value)}
        />
      </Field>

      <Field label="Painting idea / description">
        <textarea
          rows={3}
          className={inputCls}
          value={form.ideaDescription}
          onChange={(e) => set('ideaDescription', e.target.value)}
        />
      </Field>

      <PhotoUploader
        label="Reference photos"
        photos={form.referencePhotos}
        onChange={(photos) => set('referencePhotos', photos)}
      />

      <Field label="Size">
        <select className={inputCls} value={form.size} onChange={(e) => handleSizeChange(e.target.value)}>
          {SIZE_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>

      <PaymentsSection payments={form.payments} onChange={handlePaymentsChange} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Total price ($)">
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={form.totalPrice}
            onChange={(e) => set('totalPrice', e.target.value)}
          />
          <span className="mt-1 block text-xs text-slate-400">Auto-filled by size, editable</span>
        </Field>
        <Field label="Target/due date">
          <input
            type="date"
            className={inputCls}
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
          />
        </Field>
      </div>

      {form.totalPrice !== '' && (
        <p className="text-sm font-semibold text-black">
          Balance due: ${Math.max(0, (parseFloat(form.totalPrice) || 0) - totalPaid(form.payments)).toFixed(2)}
        </p>
      )}

      <Field label="Status">
        <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
          {STATUS_STAGES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Notes">
        <textarea
          rows={3}
          className={inputCls}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </Field>

      <PhotoUploader
        label="Progress / final photos"
        photos={form.progressPhotos}
        onChange={(photos) => set('progressPhotos', photos)}
      />

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className={'flex-1 disabled:opacity-60 ' + btnPrimary}>
          {submitting ? 'Saving...' : isNew ? 'Add order' : 'Save changes'}
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
