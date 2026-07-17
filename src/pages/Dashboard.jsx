import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, hasDeposit, totalPaid, buildUpdateMessage } from '../db'
import { DepositBadge, StatusBadge } from '../components/Badges'
import { btnPrimary } from '../components/buttonStyles'
import { copyToClipboard } from '../lib/clipboard'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'deposit', label: 'Deposit Paid' },
  { key: 'awaiting', label: 'Awaiting Deposit' },
  { key: 'completed', label: 'Completed' },
]

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  )
}

export default function Dashboard() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  const orders = useLiveQuery(() => db.orders.toArray(), [])
  const activeCount = orders ? orders.filter((o) => o.status !== 'Completed').length : 0

  async function handleCopyUpdate(order) {
    const ok = await copyToClipboard(buildUpdateMessage(order, activeCount))
    if (ok) {
      setCopiedId(order.id)
      setTimeout(() => setCopiedId((id) => (id === order.id ? null : id)), 1800)
    }
  }

  const visible = useMemo(() => {
    if (!orders) return []
    let list = orders
    if (filter === 'deposit') list = list.filter((o) => hasDeposit(o))
    if (filter === 'awaiting') list = list.filter((o) => !hasDeposit(o))
    if (filter === 'completed') list = list.filter((o) => o.status === 'Completed')
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((o) => o.customerName.toLowerCase().includes(q))
    }
    return list.slice().sort((a, b) => {
      if (hasDeposit(a) !== hasDeposit(b)) return hasDeposit(a) ? -1 : 1
      return a.createdAt - b.createdAt
    })
  }, [orders, filter, search])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="search"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
        />
        <Link to="/orders/new" className={'whitespace-nowrap ' + btnPrimary}>
          + New Order
        </Link>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={
              'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition duration-150 active:scale-95 ' +
              (filter === f.key
                ? 'bg-black text-white shadow-md shadow-black/25'
                : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-brand-300')
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders === undefined && <p className="text-sm text-slate-400">Loading...</p>}

      {orders && orders.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No orders yet. Tap "+ New Order" when a customer reaches out.
        </div>
      )}

      {orders && orders.length > 0 && visible.length === 0 && (
        <p className="text-sm text-slate-400">No orders match this filter.</p>
      )}

      <ul className="space-y-2">
        {visible.map((order) => {
          const paid = totalPaid(order.payments)
          const balance =
            order.totalPrice !== '' && order.totalPrice != null
              ? Math.max(0, (parseFloat(order.totalPrice) || 0) - paid)
              : null
          const dueDateLabel = order.dueDate
            ? new Date(order.dueDate + 'T00:00:00').toLocaleDateString()
            : null

          return (
            <li key={order.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Link to={`/orders/${order.id}`} className="block p-3 transition duration-150 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-black">{order.customerName || 'Unnamed customer'}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{order.contactMethod}</p>
                  </div>
                  <DepositBadge received={hasDeposit(order)} />
                </div>
                <div className="mt-2">
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-slate-50 px-2 py-1.5 text-center text-[11px]">
                  <div>
                    <p className="text-slate-400">Payments Made</p>
                    <p className="font-semibold text-black">${paid.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Balance Due</p>
                    <p className="font-semibold text-black">{balance !== null ? `$${balance.toFixed(2)}` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Target Due</p>
                    <p className="font-semibold text-black">{dueDateLabel || '—'}</p>
                  </div>
                </div>
              </Link>

              {order.status !== 'Completed' && (
                <div className="border-t border-slate-100 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUpdate(order)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-slate-200 py-1.5 text-xs font-bold text-slate-600 transition duration-150 active:scale-95 hover:border-brand-300"
                  >
                    <ChatIcon className="h-3.5 w-3.5" />
                    {copiedId === order.id ? 'Copied!' : 'Copy update for customer'}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
