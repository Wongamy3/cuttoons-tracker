import { useState } from 'react'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'

export default function Merch() {
  const merchItems = sortedByNewest(useCollection('merch'))
  const [previewList, setPreviewList] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-comic text-4xl text-black">Merch</h1>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Online ordering coming soon
        </span>
      </div>
      <p className="font-comic mt-1 text-base tracking-wide text-slate-500">CutToons apparel and accessories.</p>
      <PaintingGrid
        items={merchItems}
        sold={false}
        showCategory
        onSelect={(list, index) => {
          setPreviewList(list)
          setPreviewIndex(index)
        }}
        emptyText="No merch available right now — check back soon!"
      />

      <PaintingPreview
        items={previewList}
        index={previewIndex}
        sold={false}
        hideInterest
        onNavigate={setPreviewIndex}
        onClose={() => setPreviewList(null)}
      />
    </main>
  )
}
