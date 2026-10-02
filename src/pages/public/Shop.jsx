import { useState } from 'react'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'

export default function Shop() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const [previewList, setPreviewList] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">Shop</h1>
      <p className="mt-1 text-sm text-slate-500">Everything currently available, ready to ship or pick up.</p>
      <PaintingGrid
        items={forSaleItems}
        sold={false}
        onSelect={(list, index) => {
          setPreviewList(list)
          setPreviewIndex(index)
        }}
        emptyText="Nothing available right now — check back soon!"
      />
      <PaintingPreview
        items={previewList}
        index={previewIndex}
        onNavigate={setPreviewIndex}
        onClose={() => setPreviewList(null)}
      />
    </main>
  )
}
