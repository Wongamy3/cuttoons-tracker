import { useState } from 'react'
import PaintingGrid from './PaintingGrid'

const PAGE_SIZE = 5

export default function PortfolioCategorySection({ category, items, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? items : items.slice(0, PAGE_SIZE)
  const hiddenCount = items.length - PAGE_SIZE

  return (
    <div className="mt-8">
      <h3 className="font-comic text-xl text-black">{category}</h3>
      <PaintingGrid items={visibleItems} sold onSelect={onSelect} emptyText="" />
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 text-sm font-semibold text-comic-600 underline underline-offset-2"
        >
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  )
}
