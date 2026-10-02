import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest, groupedPortfolio } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'
import PortfolioCategorySection from '../../components/shop/PortfolioCategorySection'
import teamPhoto from '../../assets/team-photo.jpg'
import AnimatedSignature from '../../components/shop/AnimatedSignature'

export default function Home() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const soldGroups = groupedPortfolio(useCollection('portfolio'))
  const [previewItem, setPreviewItem] = useState(null)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <section className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
        <img
          src={teamPhoto}
          alt="The CutToons team"
          className="w-full rounded-lg border border-slate-200 shadow-xl sm:w-1/2 sm:flex-shrink-0"
        />
        <div className="sm:w-1/2">
          <h1 className="font-comic text-4xl text-black sm:text-5xl">Welcome to CutToons Shop</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:mx-0">
            CutToons creates one-of-a-kind paintings on custom-cut MDF panels — hand-painted in acrylic and
            finished with a glossy epoxy coat. Every piece starts with your idea: a photo, a character, a
            memory. Panels are cut to shape with a jigsaw and finished with routed edge detailing, so no two
            pieces are ever quite the same.
          </p>
          <AnimatedSignature className="mx-auto mt-4 h-16 w-auto" />
        </div>
      </section>

      <Link
        to="/shop/contact"
        className="font-comic mt-10 block rounded-xl bg-comic-500 px-5 py-4 text-center text-xl tracking-wide text-white shadow-md transition duration-150 hover:bg-comic-600 active:scale-[0.98]"
      >
        Ready to place an order? →
      </Link>

      <section className="mt-10">
        <h2 className="font-comic text-2xl text-black">Currently For Sale</h2>
        <p className="font-comic mt-1 text-base tracking-wide text-slate-500">Available paintings, ready to ship or pick up.</p>
        <PaintingGrid
          items={forSaleItems}
          sold={false}
          onSelect={setPreviewItem}
          emptyText="Nothing available right now — check back soon!"
        />
      </section>

      <section className="mt-10">
        <h2 className="font-comic text-2xl text-black">Sold</h2>
        <p className="font-comic mt-1 text-base tracking-wide text-slate-500">A look at past work, for inspiration and sizing.</p>
        {soldGroups === undefined && <p className="mt-3 text-sm text-slate-400">Loading...</p>}
        {soldGroups && soldGroups.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No past work to show yet.
          </div>
        )}
        {soldGroups?.map((group) => (
          <PortfolioCategorySection
            key={group.category}
            category={group.category}
            items={group.items}
            onSelect={setPreviewItem}
          />
        ))}
      </section>

      <PaintingPreview item={previewItem} onClose={() => setPreviewItem(null)} />
    </main>
  )
}
