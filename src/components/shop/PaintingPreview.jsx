import { itemSubtitle } from '../../lib/shopUtils'
import { btnSecondary } from '../buttonStyles'

export default function PaintingPreview({ item, onClose }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
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
    </div>
  )
}
