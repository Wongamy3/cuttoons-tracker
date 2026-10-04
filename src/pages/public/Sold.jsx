import { useState } from 'react'
import { useCollection } from '../../lib/useCollection'
import { groupedPortfolio, categorySlug } from '../../lib/shopUtils'
import PaintingPreview from '../../components/shop/PaintingPreview'
import PortfolioCategorySection from '../../components/shop/PortfolioCategorySection'

export default function Sold() {
  const soldGroups = groupedPortfolio(useCollection('portfolio'))
  const allSoldItems = soldGroups ? soldGroups.flatMap((g) => g.items) : soldGroups
  const [previewList, setPreviewList] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  function openPreview(list, index) {
    setPreviewList(list)
    setPreviewIndex(index)
  }

  function scrollToCategory(category) {
    document.getElementById(categorySlug(category))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <h1 className="font-comic text-4xl text-black">Sold</h1>
      <p className="mt-1 text-sm text-slate-500">A look at past work, for inspiration and sizing.</p>

      {soldGroups && soldGroups.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {soldGroups.map((group) => (
            <button
              key={group.category}
              type="button"
              onClick={() => scrollToCategory(group.category)}
              className="group inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black shadow-sm ring-1 ring-slate-200 transition duration-150 hover:-translate-y-0.5 hover:shadow-md hover:ring-comic-300 active:scale-95 active:translate-y-0"
            >
              {group.category}
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 transition duration-150 group-hover:bg-comic-100 group-hover:text-comic-600">
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
          navItems={allSoldItems}
          onSelect={openPreview}
        />
      ))}

      <PaintingPreview
        items={previewList}
        index={previewIndex}
        sold={true}
        onNavigate={setPreviewIndex}
        onClose={() => setPreviewList(null)}
      />
    </main>
  )
}
