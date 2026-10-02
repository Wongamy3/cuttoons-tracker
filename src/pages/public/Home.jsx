import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest, groupedPortfolio, categorySlug } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'
import PortfolioCategorySection from '../../components/shop/PortfolioCategorySection'
import teamPhoto from '../../assets/team-photo.jpg'
import AnimatedSignature from '../../components/shop/AnimatedSignature'

export default function Home() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const soldGroups = groupedPortfolio(useCollection('portfolio'))
  const [previewItem, setPreviewItem] = useState(null)

  function scrollToCategory(category) {
    document.getElementById(categorySlug(category))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

      <section className="mt-10 rounded-2xl border-2 border-dotted border-slate-300 bg-slate-100 p-6 text-center">
        <h2 className="font-comic text-2xl text-black">Ready to place an order?</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
          We'd love to bring your idea to life — reach out and let's get started.
        </p>
        <Link
          to="/shop/contact"
          className="font-comic mt-4 inline-flex items-center gap-1.5 rounded-full bg-comic-500 px-6 py-2.5 text-base tracking-wide text-white shadow-sm transition duration-150 hover:bg-comic-600 active:scale-95"
        >
          Contact Us →
        </Link>
      </section>

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

      <div className="my-12 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300" />
        <span className="h-2 w-2 rounded-full bg-comic-500" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300" />
      </div>

      <section>
        <h2 className="font-comic text-2xl text-black">Sold</h2>
        <p className="font-comic mt-1 text-base tracking-wide text-slate-500">A look at past work, for inspiration and sizing.</p>

        {soldGroups && soldGroups.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {soldGroups.map((group) => (
              <button
                key={group.category}
                type="button"
                onClick={() => scrollToCategory(group.category)}
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm ring-1 ring-slate-200 transition duration-150 hover:-translate-y-0.5 hover:shadow-md hover:ring-comic-300 active:scale-95 active:translate-y-0"
              >
                {group.category}
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-500 transition duration-150 group-hover:bg-comic-100 group-hover:text-comic-600">
                  {group.items.length}
                </span>
              </button>
            ))}
          </div>
        )}

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
