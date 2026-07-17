const STATUS_COLORS = {
  'New Inquiry': 'bg-slate-100 text-slate-600',
  'Details Finalized': 'bg-teal-100 text-teal-700',
  'Deposit Received': 'bg-emerald-100 text-emerald-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Finishing (Epoxy)': 'bg-violet-100 text-violet-700',
  'Ready for Pickup/Delivery': 'bg-amber-100 text-amber-700',
  Completed: 'bg-black text-white',
}

export function DepositBadge({ received }) {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ' +
        (received ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
      }
    >
      {received ? '● Deposit Paid' : '○ Awaiting Deposit'}
    </span>
  )
}

export function StatusBadge({ status }) {
  const cls = STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'
  return (
    <span className={'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ' + cls}>
      {status}
    </span>
  )
}
