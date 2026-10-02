import { useEffect } from 'react'
import { itemSubtitle } from '../../lib/shopUtils'
import { btnSecondary } from '../buttonStyles'

function ChevronLeftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function PaintingPreview({ items, index, onNavigate, onClose }) {
  const item = items?.[index]
  const hasMultiple = !!items && items.length > 1

  function goPrev() {
    onNavigate((index - 1 + items.length) % items.length)
  }

  function goNext() {
    onNavigate((index + 1) % items.length)
  }

  useEffect(() => {
    if (!item) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (hasMultiple && e.key === 'ArrowLeft') goPrev()
      if (hasMultiple && e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, index, hasMultiple])

  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          aria-label="Previous painting"
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition duration-150 hover:bg-black/80 active:scale-90 sm:left-4"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      )}

      <div
        className="max-h-full w-full max-w-sm overflow-y-auto rounded-lg bg-white p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.photo?.url}
          alt={item.caption || ''}
          className="max-h-[60vh] w-full rounded-lg object-contain"
        />
        <div className="mt-3 text-center">
          {itemSubtitle(item) && <p className="text-sm text-slate-500">{itemSubtitle(item)}</p>}
          {item.description && (
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{item.description}</p>
          )}
          {item.price && <p className="mt-2 text-xl font-bold text-comic-600">${Number(item.price).toFixed(2)}</p>}
        </div>
        <div className="mt-3 flex justify-center">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Close
          </button>
        </div>
      </div>

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          aria-label="Next painting"
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition duration-150 hover:bg-black/80 active:scale-90 sm:right-4"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
