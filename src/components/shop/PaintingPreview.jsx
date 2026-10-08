import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { itemSubtitle } from '../../lib/shopUtils'

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

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

export default function PaintingPreview({ items, index, sold, hideInterest, onNavigate, onClose }) {
  const item = items?.[index]
  const hasMultiple = !!items && items.length > 1
  const photos = item?.photos?.length ? item.photos : item?.photo ? [item.photo] : []
  const [activePhoto, setActivePhoto] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  function goPrev() {
    onNavigate((index - 1 + items.length) % items.length)
  }

  function goNext() {
    onNavigate((index + 1) % items.length)
  }

  useEffect(() => {
    setActivePhoto(0)
    setSelectedSize(null)
    setSelectedColor(null)
  }, [item])

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
        className="relative max-h-full w-full max-w-sm overflow-y-auto rounded-lg bg-white p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 pb-2">
          <p className="font-comic text-lg text-black">{item.category || ' '}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition duration-150 hover:bg-slate-200 active:scale-90"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <img
          src={photos[activePhoto]?.url}
          alt={item.caption || ''}
          className="max-h-[60vh] w-full rounded-lg object-contain"
        />
        {photos.length > 1 && (
          <div className="mt-2 flex justify-center gap-2 overflow-x-auto pb-1">
            {photos.map((photo, i) => (
              <button
                key={photo.url}
                type="button"
                onClick={() => setActivePhoto(i)}
                aria-label={`View photo ${i + 1}`}
                className={
                  'h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition duration-150 ' +
                  (i === activePhoto ? 'border-comic-500' : 'border-slate-200')
                }
              >
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 text-center">
          {itemSubtitle(item) && <p className="text-sm text-slate-500">{itemSubtitle(item)}</p>}
          {item.description && (
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{item.description}</p>
          )}
          {item.category === 'Shirt' && item.sizes?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500">Size</p>
              <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                {item.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={
                      'rounded-full border-2 px-3 py-1 text-xs font-bold transition duration-150 active:scale-95 ' +
                      (selectedSize === size ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-600')
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {item.colors?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-500">Color</p>
              <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                {item.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={
                      'rounded-full border-2 px-3 py-1 text-xs font-bold transition duration-150 active:scale-95 ' +
                      (selectedColor === color ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-600')
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          {item.price && (
            <p className={'mt-2 text-xl font-bold ' + (sold ? 'text-comic-600' : 'text-black')}>
              ${Number(item.price).toFixed(2)}
            </p>
          )}
          {!sold && !hideInterest && (
            <p className="mt-3 text-sm text-slate-600">
              Interested in this piece?{' '}
              <Link
                to="/contact"
                onClick={onClose}
                className="font-semibold text-comic-600 underline underline-offset-2"
              >
                Contact us to purchase
              </Link>
            </p>
          )}
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
