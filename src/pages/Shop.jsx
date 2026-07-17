import { useMemo, useState } from 'react'
import { useCollection } from '../lib/useCollection'
import { btnSecondary } from '../components/buttonStyles'
import logo from '../assets/cuttoons-logo.png'

function itemSubtitle(item) {
  return [item.caption, item.sizeTag].filter(Boolean).join(' · ')
}

function sortedByNewest(items) {
  return items ? items.slice().sort((a, b) => b.createdAt - a.createdAt) : items
}

function Gallery({ items, sold, onSelect }) {
  if (items === undefined) return <p className="mt-3 text-sm text-slate-400">Loading...</p>

  if (items.length === 0) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
        {sold ? 'No past work to show yet.' : 'Nothing available right now — check back soon!'}
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition duration-150 active:scale-95"
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

export default function Shop() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const soldItems = sortedByNewest(useCollection('portfolio'))
  const [previewItem, setPreviewItem] = useState(null)

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-brand-50">
      <header className="border-b border-brand-100 bg-brand-50/95">
        <img src={logo} alt="CutToons" className="block w-full h-auto" />
      </header>

      <main className="space-y-6 px-4 pb-10 pt-4">
        <section>
          <h1 className="text-lg font-bold text-black">Currently For Sale</h1>
          <p className="mt-1 text-sm text-slate-500">Available paintings, ready to ship or pick up.</p>
          <Gallery items={forSaleItems} sold={false} onSelect={setPreviewItem} />
        </section>

        <section>
          <h1 className="text-lg font-bold text-black">Previously Sold</h1>
          <p className="mt-1 text-sm text-slate-500">A look at past work, for inspiration and sizing.</p>
          <Gallery items={soldItems} sold onSelect={setPreviewItem} />
        </section>
      </main>

      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="max-h-full w-full max-w-sm overflow-y-auto rounded-lg bg-white p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewItem.photo?.url}
              alt={previewItem.caption || ''}
              className="max-h-[60vh] w-full rounded-lg object-contain"
            />
            <div className="mt-3 text-center">
              {itemSubtitle(previewItem) && <p className="text-sm text-slate-500">{itemSubtitle(previewItem)}</p>}
              {previewItem.price && (
                <p className="text-xl font-bold text-black">${Number(previewItem.price).toFixed(2)}</p>
              )}
            </div>
            <div className="mt-3 flex justify-center">
              <button type="button" onClick={() => setPreviewItem(null)} className={btnSecondary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
