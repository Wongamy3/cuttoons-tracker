import { useState } from 'react'
import { addOrder, resolvePhotos, blankOrder, priceForSize, SIZE_OPTIONS } from '../../db'
import PhotoUploader from '../PhotoUploader'

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-comic-500 focus:outline-none'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

export default function InquiryForm() {
  const [name, setName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [ideaDescription, setIdeaDescription] = useState('')
  const [referencePhotos, setReferencePhotos] = useState([])
  const [size, setSize] = useState(SIZE_OPTIONS[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const uploadedPhotos = await resolvePhotos(referencePhotos, 'orders/reference')
      await addOrder({
        ...blankOrder(),
        customerName: name.trim(),
        contactMethod: 'Website',
        contactInfo: contactInfo.trim(),
        ideaDescription: ideaDescription.trim(),
        referencePhotos: uploadedPhotos,
        size,
        totalPrice: priceForSize(size),
        createdAt: Date.now(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError("Something went wrong sending that — please try again, or reach out on Instagram/Facebook above.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="font-comic text-xl text-black">Thanks!</p>
        <p className="mt-1 text-sm text-slate-600">
          We've got your inquiry and will reach out soon at the contact info you provided.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Your name">
        <input
          required
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Phone or email">
        <input
          required
          className={inputCls}
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
        />
      </Field>

      <Field label="Painting idea / description">
        <textarea
          required
          rows={4}
          className={inputCls}
          value={ideaDescription}
          onChange={(e) => setIdeaDescription(e.target.value)}
        />
      </Field>

      <PhotoUploader label="Reference photos (optional)" photos={referencePhotos} onChange={setReferencePhotos} />

      <Field label="Size">
        <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
          {SIZE_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="font-comic w-full rounded-full bg-comic-500 px-5 py-2.5 text-lg tracking-wide text-white shadow-md transition duration-150 hover:bg-comic-600 active:scale-95 disabled:opacity-60"
      >
        {submitting ? 'Sending...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
