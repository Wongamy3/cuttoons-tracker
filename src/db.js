import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { db as firestore } from './firebase'

// --- Photo upload (Cloudinary, unsigned upload preset — no billing account needed) ---
const CLOUDINARY_CLOUD_NAME = 'bhkm1h1v'
const CLOUDINARY_UPLOAD_PRESET = 'cuttoons_unsigned'

// Each photo in a form is either a pending local File (not yet uploaded) or
// an already-uploaded { url, path } object. resolvePhotos uploads whichever
// are still File instances and leaves already-uploaded ones untouched.
export async function uploadPhoto(file, folder) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Photo upload failed')
  const data = await res.json()
  return { url: data.secure_url, path: data.public_id }
}

export async function resolvePhotos(photos, folder) {
  return Promise.all((photos || []).map((p) => (p instanceof File ? uploadPhoto(p, folder) : p)))
}

// --- Orders ---
export async function addOrder(data) {
  const ref = await addDoc(collection(firestore, 'orders'), data)
  return ref.id
}
export async function updateOrder(id, data) {
  await updateDoc(doc(firestore, 'orders', id), data)
}
export async function getOrder(id) {
  const snap = await getDoc(doc(firestore, 'orders', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export async function deleteOrder(id) {
  await deleteDoc(doc(firestore, 'orders', id))
}

// --- Expenses ---
export async function addExpense(data) {
  const ref = await addDoc(collection(firestore, 'expenses'), data)
  return ref.id
}
export async function updateExpense(id, data) {
  await updateDoc(doc(firestore, 'expenses', id), data)
}
export async function getExpense(id) {
  const snap = await getDoc(doc(firestore, 'expenses', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
export async function deleteExpense(id) {
  await deleteDoc(doc(firestore, 'expenses', id))
}

// --- Portfolio ---
export async function addPortfolioItem(data) {
  const ref = await addDoc(collection(firestore, 'portfolio'), data)
  return ref.id
}
export async function updatePortfolioItem(id, data) {
  await updateDoc(doc(firestore, 'portfolio', id), data)
}
export async function deletePortfolioItem(id) {
  await deleteDoc(doc(firestore, 'portfolio', id))
}

// --- For Sale (current inventory) ---
export async function addForSaleItem(data) {
  const ref = await addDoc(collection(firestore, 'forSale'), data)
  return ref.id
}
export async function updateForSaleItem(id, data) {
  await updateDoc(doc(firestore, 'forSale', id), data)
}
export async function deleteForSaleItem(id) {
  await deleteDoc(doc(firestore, 'forSale', id))
}

export const CONTACT_METHODS = [
  'Instagram DM',
  'Facebook Message',
  'In person',
  'Text',
  'Email',
  'Other',
]

export const SIZE_OPTIONS = Array.from({ length: 8 }, (_, i) => `${i + 1}ft`)

// 1ft = $50, 2ft = $200, then +$100 per foot beyond 2ft
export function priceForSize(size) {
  const feet = parseInt(size, 10)
  if (!feet) return ''
  if (feet === 1) return 50
  if (feet === 2) return 200
  return 200 + (feet - 2) * 100
}

export const STATUS_STAGES = [
  'New Inquiry',
  'Details Finalized',
  'Deposit Received',
  'In Progress',
  'Finishing (Epoxy)',
  'Ready for Pickup/Delivery',
  'Completed',
]

export function blankOrder() {
  return {
    customerName: '',
    contactMethod: CONTACT_METHODS[0],
    contactInfo: '',
    orderPlacedDate: new Date().toISOString().slice(0, 10),
    ideaDescription: '',
    referencePhotos: [],
    size: SIZE_OPTIONS[0],
    payments: [],
    totalPrice: priceForSize(SIZE_OPTIONS[0]),
    status: STATUS_STAGES[0],
    dueDate: '',
    notes: '',
    progressPhotos: [],
    createdAt: Date.now(),
  }
}

export function normalizeOrder(order) {
  return order.payments ? order : { ...order, payments: [] }
}

export function totalPaid(payments) {
  return (payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
}

export function hasDeposit(order) {
  return !!(order.payments && order.payments.length > 0)
}

const STARTED_STAGES = ['In Progress', 'Finishing (Epoxy)', 'Ready for Pickup/Delivery']

export function buildUpdateMessage(order, activeCount) {
  const name = order.customerName || 'there'
  const started = STARTED_STAGES.includes(order.status)
  const queueLine = `I currently have ${activeCount} order${activeCount === 1 ? '' : 's'} lined up right now`

  if (started) {
    return `Hi ${name}! Just wanted to send a quick update on your CutToons painting — ${queueLine}, and yours is coming right along! It'll be completed soon. Thanks so much for your patience! 🎨`
  }
  return `Hi ${name}! Just wanted to send a quick update — ${queueLine}, but I wanted to let you know yours will be getting started soon. Thanks so much for your patience! 🎨`
}

// Schedule C (Form 1040) Part II expense categories, trimmed to what a solo
// sole-proprietor handmade-goods business is likely to actually use.
export const EXPENSE_CATEGORIES = [
  'Advertising (Line 8)',
  'Car & Truck Expenses (Line 9)',
  'Commissions & Fees (Line 10)',
  'Contract Labor (Line 11)',
  'Depreciation & Section 179 (Line 13)',
  'Insurance (Line 15)',
  'Interest Paid (Line 16)',
  'Legal & Professional Services (Line 17)',
  'Office Expense (Line 18)',
  'Rent or Lease (Line 20)',
  'Repairs & Maintenance (Line 21)',
  'Supplies & Materials (Line 22)',
  'Taxes & Licenses (Line 23)',
  'Travel (Line 24a)',
  'Meals (Line 24b)',
  'Utilities (Line 25)',
  'Other Expenses (Line 27a)',
]

export function blankExpense() {
  return {
    date: new Date().toISOString().slice(0, 10),
    vendor: '',
    description: '',
    amount: '',
    category: 'Supplies & Materials (Line 22)',
    receiptPhotos: [],
    notes: '',
    createdAt: Date.now(),
  }
}
