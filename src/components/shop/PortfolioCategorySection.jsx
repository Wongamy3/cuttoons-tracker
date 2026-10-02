import { useState } from 'react'
import PaintingGrid from './PaintingGrid'
import { categorySlug } from '../../lib/shopUtils'

const PAGE_SIZE = 3

function ChevronIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function PortfolioCategorySection({ category, items, navItems, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? items : items.slice(0, PAGE_SIZE)
  const hiddenCount = items.length - PAGE_SIZE

  return (
    <div id={categorySlug(category)} className="mt-8 scroll-mt-24">
      <h3 className="font-comic text-xl text-black">{category}</h3>
      <PaintingGrid items={visibleItems} allItems={navItems || items} sold onSelect={onSelect} emptyText="" />
      {hiddenCount > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="font-comic inline-flex items-center gap-1.5 rounded-full border-2 border-comic-500 bg-white px-5 py-2 text-base tracking-wide text-comic-600 shadow-sm transition duration-150 hover:bg-comic-100 active:scale-95"
          >
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
            <ChevronIcon className={'h-4 w-4 transition-transform duration-200 ' + (expanded ? 'rotate-180' : '')} />
          </button>
        </div>
      )}
    </div>
  )
}
