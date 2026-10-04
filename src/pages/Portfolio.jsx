import { useEffect, useMemo, useRef, useState } from 'react'
import { addPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadPhoto, PORTFOLIO_CATEGORIES } from '../db'
import { useCollection } from '../lib/useCollection'
import { groupedPortfolio } from '../lib/shopUtils'
import { btnPrimary, btnDanger, btnSecondary } from '../components/buttonStyles'

const editInputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
const DEFAULT_CATEGORY = 'Other'

function ChevronIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

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
  const [collapsed, setCollapsed] = useState(() => new Set())
  const collapseInitialized = useRef(false)

  // Start every category collapsed the first time the data loads, without
  // re-collapsing sections the user has already expanded on later updates
  // (e.g. after adding/editing a photo triggers a fresh Firestore snapshot).
  useEffect(() => {
    if (groups && !collapseInitialized.current) {
      collapseInitialized.current = true
      setCollapsed(new Set(groups.map((g) => g.category)))
    }
  }, [groups])
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

  function toggleCategory(category) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const allCollapsed = !!groups && groups.length > 0 && groups.every((g) => collapsed.has(g.category))

  function toggleAll() {
    if (!groups) return
    setCollapsed(allCollapsed ? new Set() : new Set(groups.map((g) => g.category)))
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

      {groups && groups.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            {rawItems.length} item{rawItems.length === 1 ? '' : 's'} total
          </p>
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition duration-150 active:scale-95 hover:border-brand-300"
          >
            {allCollapsed ? 'Expand All' : 'Collapse All'}
            <ChevronIcon className={'h-3.5 w-3.5 transition-transform duration-200 ' + (allCollapsed ? '' : 'rotate-180')} />
          </button>
        </div>
      )}

      {groups?.map((group) => {
        const isCollapsed = collapsed.has(group.category)
        return (
          <div key={group.category} className="space-y-2">
            <button
              type="button"
              onClick={() => toggleCategory(group.category)}
              className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{group.category}</span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-500">
                  {group.items.length}
                </span>
              </span>
              <ChevronIcon
                className={'h-4 w-4 text-slate-400 transition-transform duration-200 ' + (isCollapsed ? '-rotate-90' : '')}
              />
            </button>
            {!isCollapsed && (
              <div className="grid grid-cols-3 gap-2">
                {group.items.map((item) => (
                  <PortfolioThumb key={item.id} item={item} onPreview={() => openPreview(item)} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )
      })}

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
