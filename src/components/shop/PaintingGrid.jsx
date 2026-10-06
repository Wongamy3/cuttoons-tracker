import { itemSubtitle } from '../../lib/shopUtils'

export default function PaintingGrid({ items, allItems, sold, showCategory, onSelect, emptyText }) {
  if (items === undefined) return <p className="mt-3 text-sm text-slate-400">Loading...</p>

  if (items.length === 0) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
        {emptyText}
      </div>
    )
  }

  const navList = allItems || items

  return (
    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(navList, navList.findIndex((i) => i.id === item.id), sold)}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0"
        >
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <img
              src={item.photo?.url || item.photos?.[0]?.url}
              alt={item.caption || ''}
              className="h-full w-full object-cover"
            />
            {sold && (
              <span className="font-comic absolute left-2 top-2 -rotate-[14deg] rounded-full border-2 border-white bg-comic-500 px-3 py-1 text-sm text-white shadow-md">
                Sold
              </span>
            )}
          </div>
          <div className="p-2">
            {showCategory && item.category && (
              <p className="text-[10px] font-bold uppercase tracking-wide text-comic-600">{item.category}</p>
            )}
            {itemSubtitle(item) && <p className="text-xs text-slate-500">{itemSubtitle(item)}</p>}
            {item.price && (
              <p className="mt-1">
                {sold && <span className="text-xs font-medium text-slate-400">Sold for </span>}
                <span
                  className={
                    'font-comic text-xl tracking-wide ' + (sold ? 'text-comic-600' : 'text-black')
                  }
                >
                  ${Number(item.price).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
