import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCollection } from '../../lib/useCollection'
import { sortedByNewest, homePageItems } from '../../lib/shopUtils'
import PaintingGrid from '../../components/shop/PaintingGrid'
import PaintingPreview from '../../components/shop/PaintingPreview'
import teamPhoto from '../../assets/team-photo.jpg'
import AnimatedSignature from '../../components/shop/AnimatedSignature'

export default function Home() {
  const forSaleItems = sortedByNewest(useCollection('forSale'))
  const rawMerch = useCollection('merch')
  const merchItems = sortedByNewest(rawMerch)
  const hasMerchItems = !!rawMerch && rawMerch.length > 0
  const rawPortfolio = useCollection('portfolio')
  const soldPreviewItems = homePageItems(rawPortfolio)
  const hasSoldItems = !!rawPortfolio && rawPortfolio.length > 0
  const [previewList, setPreviewList] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previewSold, setPreviewSold] = useState(false)
  const [previewHideInterest, setPreviewHideInterest] = useState(false)

  function openPreview(list, index, sold, hideInterest = false) {
    setPreviewList(list)
    setPreviewIndex(index)
    setPreviewSold(sold)
    setPreviewHideInterest(hideInterest)
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
            We're Jeremy and Amy — two San Antonio locals who turned a Covid-era hobby into CutToons. Every
            piece starts with your idea: a photo, a character, a memory — hand-painted in acrylic on a
            custom-cut MDF panel and finished with a glossy epoxy coat. No two pieces are ever quite the
            same, and we still get excited about every one.
          </p>
          <Link
            to="/about"
            className="mx-auto mt-2 inline-block text-sm font-semibold text-comic-600 underline underline-offset-2 sm:mx-0"
          >
            Read more about us →
          </Link>
          <AnimatedSignature className="mx-auto mt-4 h-16 w-auto" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-comic text-2xl text-black">Currently For Sale</h2>
        <p className="font-comic mt-1 text-base tracking-wide text-slate-500">Available paintings, ready to ship or pick up.</p>
        <PaintingGrid
          items={forSaleItems}
          sold={false}
          onSelect={openPreview}
          emptyText="Nothing available right now — check back soon!"
        />
      </section>

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

      <section className="mt-10">
        <h2 className="font-comic text-2xl text-black">Merch</h2>
        <p className="font-comic mt-1 text-base tracking-wide text-slate-500">CutToons apparel and accessories.</p>
        <PaintingGrid
          items={merchItems}
          sold={false}
          showCategory
          onSelect={(list, index) => openPreview(list, index, false, true)}
          emptyText="No merch available right now — check back soon!"
        />

        {hasMerchItems && (
          <div className="mt-5 flex justify-center">
            <Link
              to="/merch"
              className="font-comic inline-flex items-center gap-1.5 rounded-full border-2 border-comic-500 bg-white px-5 py-2 text-base tracking-wide text-comic-600 shadow-sm transition duration-150 hover:bg-comic-100 active:scale-95"
            >
              See All →
            </Link>
          </div>
        )}
      </section>

      <div className="my-12 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300" />
        <span className="h-2 w-2 rounded-full bg-comic-500" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300" />
      </div>

      <section>
        <h2 className="font-comic text-2xl text-black">Sold</h2>
        <p className="font-comic mt-1 text-base tracking-wide text-slate-500">A look at past work, for inspiration and sizing.</p>

        {rawPortfolio === undefined && <p className="mt-3 text-sm text-slate-400">Loading...</p>}
        {rawPortfolio && rawPortfolio.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No past work to show yet.
          </div>
        )}
        {soldPreviewItems && soldPreviewItems.length > 0 && (
          <PaintingGrid items={soldPreviewItems} sold showCategory onSelect={openPreview} emptyText="" />
        )}

        {hasSoldItems && (
          <div className="mt-5 flex justify-center">
            <Link
              to="/sold"
              className="font-comic inline-flex items-center gap-1.5 rounded-full border-2 border-comic-500 bg-white px-5 py-2 text-base tracking-wide text-comic-600 shadow-sm transition duration-150 hover:bg-comic-100 active:scale-95"
            >
              See All →
            </Link>
          </div>
        )}
      </section>

      <PaintingPreview
        items={previewList}
        index={previewIndex}
        sold={previewSold}
        hideInterest={previewHideInterest}
        onNavigate={setPreviewIndex}
        onClose={() => setPreviewList(null)}
      />
    </main>
  )
}
