import { useState } from 'react'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'

export default function Shop() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const [previewItem, setPreviewItem] = useState(null)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">Shop</h1>
      <p className="mt-1 text-sm text-slate-500">Everything currently available, ready to ship or pick up.</p>
      <PaintingGrid
        items={forSaleItems}
        sold={false}
        onSelect={setPreviewItem}
        emptyText="Nothing available right now — check back soon!"
      />
      <PaintingPreview item={previewItem} onClose={() => setPreviewItem(null)} />
    </main>
  )
}
