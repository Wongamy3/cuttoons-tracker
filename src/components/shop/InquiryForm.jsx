import { useState } from 'react'
import { addOrder, resolvePhotos, blankOrder, priceForSize, SIZE_OPTIONS, PICKUP_OPTIONS } from '../../db'
import PhotoUploader from '../PhotoUploader'

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-comic-500 focus:outline-none'

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-comic-500"> *</span>}
      </span>
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
  const [pickupPreference, setPickupPreference] = useState('')
  const [shippingZip, setShippingZip] = useState('')
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
        pickupPreference,
        shippingZip: pickupPreference === 'Ship' ? shippingZip.trim() : '',
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
      <Field label="Your name" required>
        <input
          required
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Phone or email" required>
        <input
          required
          className={inputCls}
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
        />
      </Field>

      <Field label="Painting idea / description" required>
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

      <Field label="Pickup Preference" required>
        <select
          required
          className={inputCls}
          value={pickupPreference}
          onChange={(e) => setPickupPreference(e.target.value)}
        >
          <option value="" disabled>
            Select an option...
          </option>
          {PICKUP_OPTIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>

      {pickupPreference === 'Ship' && (
        <Field label="Zip Code" required>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            title="5-digit ZIP code"
            maxLength={5}
            className={inputCls}
            value={shippingZip}
            onChange={(e) => setShippingZip(e.target.value)}
          />
        </Field>
      )}

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
