import Dexie from 'dexie'

export const db = new Dexie('cuttoonsTracker')

db.version(1).stores({
  orders: '++id, customerName, depositReceived, status, createdAt',
  portfolio: '++id, createdAt',
})

db.version(2).stores({
  orders: '++id, customerName, status, createdAt',
  portfolio: '++id, createdAt',
})

db.version(3).stores({
  orders: '++id, customerName, status, createdAt',
  portfolio: '++id, createdAt',
  expenses: '++id, date, category, createdAt',
})

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

// Normalizes orders saved before multi-payment support existed
export function normalizeOrder(order) {
  if (order.payments) return order
  const legacyPayment =
    order.depositReceived && order.depositAmount
      ? [{ amount: order.depositAmount, method: order.depositMethod || '', date: order.depositDate || '' }]
      : []
  return { ...order, payments: legacyPayment }
}

export function totalPaid(payments) {
  return (payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
}

export function hasDeposit(order) {
  return (order.payments && order.payments.length > 0) || !!order.depositReceived
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
