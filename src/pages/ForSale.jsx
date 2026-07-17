import { useMemo, useRef, useState } from 'react'
import { addForSaleItem, updateForSaleItem, deleteForSaleItem, uploadPhoto } from '../db'
import { useCollection } from '../lib/useCollection'
import { btnPrimary, btnDanger, btnSecondary } from '../components/buttonStyles'

const editInputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'

function itemSubtitle(item) {
  return [item.caption, item.sizeTag, item.price ? `$${Number(item.price).toFixed(2)}` : null]
    .filter(Boolean)
    .join(' · ')
}

function ForSaleThumb({ item, onPreview, onDelete }) {
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

export default function ForSale() {
  const rawItems = useCollection('forSale')
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
  const [editCaption, setEditCaption] = useState('')
  const [editSizeTag, setEditSizeTag] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const photo = await uploadPhoto(file, 'forSale')
        await addForSaleItem({
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

  function openPreview(item) {
    setPreviewItem(item)
    setEditCaption(item.caption || '')
    setEditSizeTag(item.sizeTag || '')
    setEditPrice(item.price || '')
  }

  async function handleSaveEdit() {
    if (!previewItem) return
    setSaving(true)
    try {
      const data = { caption: editCaption.trim(), sizeTag: editSizeTag.trim(), price: editPrice.trim() }
      await updateForSaleItem(previewItem.id, data)
      setPreviewItem((p) => (p ? { ...p, ...data } : p))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this painting from your For Sale inventory? (e.g. once it sells)')) return
    if (previewItem?.id === id) setPreviewItem(null)
    await deleteForSaleItem(id)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
        <p className="text-sm font-medium text-slate-700">Add Painting for Sale</p>
        <input
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Size (optional)"
            value={sizeTag}
            onChange={(e) => setSizeTag(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price (optional)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
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
          No paintings for sale yet.
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {items?.map((item) => (
          <ForSaleThumb key={item.id} item={item} onPreview={() => openPreview(item)} onDelete={handleDelete} />
        ))}
      </div>

      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="max-h-full w-full max-w-sm overflow-y-auto rounded-lg bg-white p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewItem.photo?.url}
              alt={previewItem.caption || ''}
              className="max-h-[45vh] w-full rounded-lg object-contain"
            />

            <div className="mt-3 space-y-2">
              <input
                placeholder="Caption (optional)"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className={editInputCls}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Size (optional)"
                  value={editSizeTag}
                  onChange={(e) => setEditSizeTag(e.target.value)}
                  className={editInputCls}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price (optional)"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className={editInputCls}
                />
              </div>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className={'w-full disabled:opacity-60 ' + btnPrimary}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>

            <div className="mt-3 flex justify-center gap-2">
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
