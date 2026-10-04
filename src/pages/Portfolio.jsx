import { useMemo, useRef, useState } from 'react'
import { addPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadPhoto, PORTFOLIO_CATEGORIES } from '../db'
import { useCollection } from '../lib/useCollection'
import { groupedPortfolio } from '../lib/shopUtils'
import { btnPrimary, btnDanger, btnSecondary } from '../components/buttonStyles'

const editInputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
const DEFAULT_CATEGORY = 'Other'

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
      {item.displayOrder !== '' && item.displayOrder != null && (
        <div className="pointer-events-none absolute left-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-black/70 px-1.5 text-[11px] font-bold text-white">
          #{item.displayOrder}
        </div>
      )}
      {item.showOnHome && (
        <div
          className="pointer-events-none absolute right-1 top-8 rounded-full bg-comic-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow"
          title="Shown on Home Page"
        >
          HOME
        </div>
      )}
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
  const groups = useMemo(() => groupedPortfolio(rawItems), [rawItems])
  const fileInputRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [sizeTag, setSizeTag] = useState('')
  const [price, setPrice] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [showOnHome, setShowOnHome] = useState(false)
  const [homePriority, setHomePriority] = useState('')
  const [uploading, setUploading] = useState(false)

  const [previewItem, setPreviewItem] = useState(null)
  const [editCaption, setEditCaption] = useState('')
  const [editSizeTag, setEditSizeTag] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDisplayOrder, setEditDisplayOrder] = useState('')
  const [editCategory, setEditCategory] = useState(DEFAULT_CATEGORY)
  const [editShowOnHome, setEditShowOnHome] = useState(false)
  const [editHomePriority, setEditHomePriority] = useState('')
  const [saving, setSaving] = useState(false)

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
          displayOrder: displayOrder.trim(),
          category,
          showOnHome,
          homePriority: showOnHome ? homePriority.trim() : '',
          createdAt: Date.now(),
        })
      }
      setCaption('')
      setSizeTag('')
      setPrice('')
      setDisplayOrder('')
      setCategory(DEFAULT_CATEGORY)
      setShowOnHome(false)
      setHomePriority('')
    } finally {
      setUploading(false)
    }
  }

  function openPreview(item) {
    setPreviewItem(item)
    setEditCaption(item.caption || '')
    setEditSizeTag(item.sizeTag || '')
    setEditPrice(item.price || '')
    setEditDisplayOrder(item.displayOrder || '')
    setEditCategory(item.category || DEFAULT_CATEGORY)
    setEditShowOnHome(!!item.showOnHome)
    setEditHomePriority(item.homePriority || '')
  }

  async function handleSaveEdit() {
    if (!previewItem) return
    setSaving(true)
    try {
      const data = {
        caption: editCaption.trim(),
        sizeTag: editSizeTag.trim(),
        price: editPrice.trim(),
        displayOrder: editDisplayOrder.trim(),
        category: editCategory,
        showOnHome: editShowOnHome,
        homePriority: editShowOnHome ? editHomePriority.trim() : '',
      }
      await updatePortfolioItem(previewItem.id, data)
      setPreviewItem(null)
    } finally {
      setSaving(false)
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
        <p className="text-sm font-medium text-slate-700">Add Painting to Portfolio</p>
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          {PORTFOLIO_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="1"
          placeholder="Display order (optional) — lower numbers show first within this category"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={showOnHome}
            onChange={(e) => setShowOnHome(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Show on Home Page
        </label>
        {showOnHome && (
          <input
            type="number"
            step="1"
            placeholder="Priority (optional) — lower numbers show first on Home"
            value={homePriority}
            onChange={(e) => setHomePriority(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        )}
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

      {groups && groups.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No portfolio photos yet.
        </div>
      )}

      {groups?.map((group) => (
        <div key={group.category} className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">{group.category}</p>
          <div className="grid grid-cols-3 gap-2">
            {group.items.map((item) => (
              <PortfolioThumb key={item.id} item={item} onPreview={() => openPreview(item)} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      ))}

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
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className={editInputCls}
              >
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="1"
                placeholder="Display order (optional) — lower numbers show first within this category"
                value={editDisplayOrder}
                onChange={(e) => setEditDisplayOrder(e.target.value)}
                className={editInputCls}
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editShowOnHome}
                  onChange={(e) => setEditShowOnHome(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Show on Home Page
              </label>
              {editShowOnHome && (
                <input
                  type="number"
                  step="1"
                  placeholder="Priority (optional) — lower numbers show first on Home"
                  value={editHomePriority}
                  onChange={(e) => setEditHomePriority(e.target.value)}
                  className={editInputCls}
                />
              )}
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
