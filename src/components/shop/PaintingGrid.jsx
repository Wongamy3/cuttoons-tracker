import { itemSubtitle } from '../../lib/shopUtils'

export default function PaintingGrid({ items, sold, onSelect, emptyText }) {
  if (items === undefined) return <p className="mt-3 text-sm text-slate-400">Loading...</p>

  if (items.length === 0) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition duration-150 hover:shadow-md active:scale-95"
        >
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <img src={item.photo?.url} alt={item.caption || ''} className="h-full w-full object-cover" />
            {sold && (
              <span className="absolute left-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                SOLD
              </span>
            )}
          </div>
          <div className="p-2">
            {itemSubtitle(item) && <p className="text-xs text-slate-500">{itemSubtitle(item)}</p>}
            {item.price && (
              <p className="font-semibold text-black">
                {sold ? 'Sold for ' : ''}${Number(item.price).toFixed(2)}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
