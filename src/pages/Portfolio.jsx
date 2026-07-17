import { useMemo, useRef, useState } from 'react'
import { addPortfolioItem, deletePortfolioItem, uploadPhoto } from '../db'
import { useCollection } from '../lib/useCollection'
import { btnPrimary, btnDanger, btnSecondary } from '../components/buttonStyles'

function itemSubtitle(item) {
  return [item.caption, item.sizeTag, item.price ? `$${Number(item.price).toFixed(2)}` : null]
    .filter(Boolean)
    .join(' · ')
}

function PortfolioThumb({ item, onPreview, onDelete }) {
  const subtitle = itemSubtitle(item)
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button type="button" onClick={onPreview} className="block h-full w-full" aria-label="Preview photo">
        <img src={item.photo?.url} alt={item.caption || ''} className="h-full w-full object-cover" />
      </button>
      {subtitle && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[11px] text-white">
          {subtitle}
        </div>
      )}
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white transition duration-150 active:scale-90"
        aria-label="Delete"
      >
        ×
      </button>
    </div>
  )
}

export default function Portfolio() {
  const rawItems = useCollection('portfolio')
  const items = useMemo(
    () => (rawItems ? rawItems.slice().sort((a, b) => b.createdAt - a.createdAt) : rawItems),
    [rawItems]
  )
  const fileInputRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [sizeTag, setSizeTag] = useState('')
  const [price, setPrice] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const photo = await uploadPhoto(file, 'portfolio')
        await addPortfolioItem({
          photo,
          caption: caption.trim(),
          sizeTag: sizeTag.trim(),
          price: price.trim(),
          createdAt: Date.now(),
        })
      }
      setCaption('')
      setSizeTag('')
      setPrice('')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this photo from your portfolio?')) return
    if (previewItem?.id === id) setPreviewItem(null)
    await deletePortfolioItem(id)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
        <p className="text-sm font-medium text-slate-700">Add a past painting</p>
        <div className="flex gap-2">
          <input
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <input
            placeholder="Size (optional)"
            value={sizeTag}
            onChange={(e) => setSizeTag(e.target.value)}
            className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={'w-full disabled:opacity-60 ' + btnPrimary}
        >
          {uploading ? 'Uploading...' : '+ Upload photo(s)'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {items && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No portfolio photos yet.
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {items?.map((item) => (
          <PortfolioThumb
            key={item.id}
            item={item}
            onPreview={() => setPreviewItem(item)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewItem.photo?.url}
              alt={previewItem.caption || ''}
              className="max-h-[70vh] max-w-full rounded-lg object-contain"
            />
            {itemSubtitle(previewItem) && (
              <p className="mt-2 text-center text-sm text-white">{itemSubtitle(previewItem)}</p>
            )}
            <div className="mt-3 flex justify-center gap-3">
              <a
                href={previewItem.photo?.url}
                download
                target="_blank"
                rel="noreferrer"
                className={btnSecondary}
              >
                Download
              </a>
              <button type="button" onClick={() => handleDelete(previewItem.id)} className={btnDanger}>
                Delete
              </button>
              <button type="button" onClick={() => setPreviewItem(null)} className={btnSecondary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
