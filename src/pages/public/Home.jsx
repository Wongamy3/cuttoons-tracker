import { useState } from 'react'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'

export default function Home() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const soldItems = sortedByNewest(useCollection('portfolio'))
  const [previewItem, setPreviewItem] = useState(null)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-black">Handmade Custom Paintings</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
          CutToons creates one-of-a-kind paintings on custom-cut MDF panels — hand-painted in acrylic and
          finished with a glossy epoxy coat. Every piece starts with your idea: a photo, a character, a
          memory. Panels are cut to shape with a jigsaw and finished with routed edge detailing, so no two
          pieces are ever quite the same.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-black">Currently For Sale</h2>
        <p className="mt-1 text-sm text-slate-500">Available paintings, ready to ship or pick up.</p>
        <PaintingGrid
          items={forSaleItems}
          sold={false}
          onSelect={setPreviewItem}
          emptyText="Nothing available right now — check back soon!"
        />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-black">Sold</h2>
        <p className="mt-1 text-sm text-slate-500">A look at past work, for inspiration and sizing.</p>
        <PaintingGrid
          items={soldItems}
          sold
          onSelect={setPreviewItem}
          emptyText="No past work to show yet."
        />
      </section>

      <PaintingPreview item={previewItem} onClose={() => setPreviewItem(null)} />
    </main>
  )
}
