import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'

export default function Shop() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const [previewList, setPreviewList] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 lg:max-w-5xl xl:max-w-6xl">
      <h1 className="font-comic text-4xl text-black">Available Paintings</h1>
      <p className="font-comic mt-1 text-base tracking-wide text-slate-500">Ready to ship or pick up.</p>
      <PaintingGrid
        items={forSaleItems}
        sold={false}
        onSelect={(list, index) => {
          setPreviewList(list)
          setPreviewIndex(index)
        }}
        emptyText="Nothing available right now — check back soon!"
      />

      <section className="mt-10 rounded-2xl border-2 border-dotted border-slate-300 bg-slate-100 p-6 text-center">
        <h2 className="font-comic text-2xl text-black">Want a Custom Piece?</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
          We'd love to bring your idea to life — reach out and let's get started.
        </p>
        <Link
          to="/contact"
          className="font-comic mt-4 inline-flex items-center gap-1.5 rounded-full bg-comic-500 px-6 py-2.5 text-base tracking-wide text-white shadow-sm transition duration-150 hover:bg-comic-600 active:scale-95"
        >
          Contact Us →
        </Link>
      </section>

      <PaintingPreview
        items={previewList}
        index={previewIndex}
        sold={false}
        onNavigate={setPreviewIndex}
        onClose={() => setPreviewList(null)}
      />
    </main>
  )
}
