import { useMemo, useRef, useState } from 'react'
import { addMerchItem, updateMerchItem, deleteMerchItem, uploadPhoto, MERCH_CATEGORIES, SHIRT_SIZES } from '../db'
import { useCollection } from '../lib/useCollection'
import { btnPrimary, btnDanger, btnSecondary } from '../components/buttonStyles'

const editInputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'

function toggleArrayValue(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

function itemSubtitle(item) {
  return [item.caption, item.sizeTag, item.price ? `$${Number(item.price).toFixed(2)}` : null]
    .filter(Boolean)
    .join(' · ')
}

function MerchThumb({ item, onPreview, onDelete }) {
  const subtitle = itemSubtitle(item)
  const photoCount = item.photos?.length || 0
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button type="button" onClick={onPreview} className="block h-full w-full" aria-label="Preview photo">
        <img src={item.photos?.[0]?.url} alt={item.caption || ''} className="h-full w-full object-cover" />
      </button>
      {photoCount > 1 && (
        <div className="pointer-events-none absolute left-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          {photoCount} photos
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

function SizePicker({ sizes, onToggle }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">Available sizes</p>
      <div className="flex flex-wrap gap-1.5">
        {SHIRT_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onToggle(size)}
            className={
              'rounded-full border-2 px-3 py-1 text-xs font-bold transition duration-150 active:scale-95 ' +
              (sizes.includes(size) ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-600')
            }
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorPicker({ colors, input, onInputChange, onAdd, onRemove }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">Available colors</p>
      <div className="flex gap-2">
        <input
          placeholder="e.g. Black"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAdd()
            }
          }}
          className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        />
        <button type="button" onClick={onAdd} className={btnSecondary}>
          Add
        </button>
      </div>
      {colors.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {colors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-black"
            >
              {color}
              <button type="button" onClick={() => onRemove(color)} className="text-slate-400" aria-label={`Remove ${color}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Merch() {
  const rawItems = useCollection('merch')
  const items = useMemo(
    () => (rawItems ? rawItems.slice().sort((a, b) => b.createdAt - a.createdAt) : rawItems),
    [rawItems]
  )
  const fileInputRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [sizeTag, setSizeTag] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [colorInput, setColorInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const [previewItem, setPreviewItem] = useState(null)
  const [editCaption, setEditCaption] = useState('')
  const [editSizeTag, setEditSizeTag] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editSizes, setEditSizes] = useState([])
  const [editColors, setEditColors] = useState([])
  const [editColorInput, setEditColorInput] = useState('')
  const [editPhotos, setEditPhotos] = useState([])
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [addingPhotos, setAddingPhotos] = useState(false)
  const addPhotosInputRef = useRef(null)

  function handleCategoryChange(value) {
    setCategory(value)
    if (value !== 'Shirt') setSizes([])
  }

  function handleAddColor() {
    const trimmed = colorInput.trim()
    if (!trimmed) return
    setColors((c) => (c.includes(trimmed) ? c : [...c, trimmed]))
    setColorInput('')
  }

  function handleEditCategoryChange(value) {
    setEditCategory(value)
    if (value !== 'Shirt') setEditSizes([])
  }

  function handleAddEditColor() {
    const trimmed = editColorInput.trim()
    if (!trimmed) return
    setEditColors((c) => (c.includes(trimmed) ? c : [...c, trimmed]))
    setEditColorInput('')
  }

  // All photos selected here become images on a single new merch item (e.g.
  // different angles of the same shirt), unlike For Sale where each file
  // becomes its own separate painting listing.
  async function handleAddItem(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    setUploading(true)
    try {
      const photos = []
      for (const file of files) {
        photos.push(await uploadPhoto(file, 'merch'))
      }
      await addMerchItem({
        photos,
        caption: caption.trim(),
        sizeTag: sizeTag.trim(),
        price: price.trim(),
        description: description.trim(),
        category,
        sizes: category === 'Shirt' ? sizes : [],
        colors,
        createdAt: Date.now(),
      })
      setCaption('')
      setSizeTag('')
      setPrice('')
      setDescription('')
      setCategory('')
      setSizes([])
      setColors([])
      setColorInput('')
    } finally {
      setUploading(false)
    }
  }

  function openPreview(item) {
    setPreviewItem(item)
    setEditCaption(item.caption || '')
    setEditSizeTag(item.sizeTag || '')
    setEditPrice(item.price || '')
    setEditDescription(item.description || '')
    setEditCategory(item.category || '')
    setEditSizes(item.sizes || [])
    setEditColors(item.colors || [])
    setEditColorInput('')
    setEditPhotos(item.photos || [])
    setSelectedPhotoIndex(0)
  }

  async function handleAddMorePhotos(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    setAddingPhotos(true)
    try {
      const uploaded = []
      for (const file of files) {
        uploaded.push(await uploadPhoto(file, 'merch'))
      }
      setEditPhotos((photos) => [...photos, ...uploaded])
    } finally {
      setAddingPhotos(false)
    }
  }

  function removeEditPhoto(i) {
    setEditPhotos((photos) => photos.filter((_, idx) => idx !== i))
    setSelectedPhotoIndex(0)
  }

  function makeEditPhotoCover(i) {
    setEditPhotos((photos) => {
      const next = [...photos]
      const [chosen] = next.splice(i, 1)
      next.unshift(chosen)
      return next
    })
    setSelectedPhotoIndex(0)
  }

  async function handleSaveEdit() {
    if (!previewItem) return
    setSaving(true)
    try {
      const data = {
        photos: editPhotos,
        caption: editCaption.trim(),
        sizeTag: editSizeTag.trim(),
        price: editPrice.trim(),
        description: editDescription.trim(),
        category: editCategory,
        sizes: editCategory === 'Shirt' ? editSizes : [],
        colors: editColors,
      }
      await updateMerchItem(previewItem.id, data)
      setPreviewItem(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this item from your Merch inventory?')) return
    if (previewItem?.id === id) setPreviewItem(null)
    await deleteMerchItem(id)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
        <p className="text-sm font-medium text-slate-700">Add Merch Item</p>
        <p className="text-xs text-slate-400">
          Selecting multiple photos adds them all to one item (e.g. different angles of the same shirt).
        </p>
        <input
          placeholder="Caption (e.g. CutToons Dad Hat)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        />
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">Select category...</option>
          {MERCH_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {category === 'Shirt' && (
          <SizePicker sizes={sizes} onToggle={(size) => setSizes((s) => toggleArrayValue(s, size))} />
        )}
        <ColorPicker
          colors={colors}
          input={colorInput}
          onInputChange={setColorInput}
          onAdd={handleAddColor}
          onRemove={(color) => setColors((c) => c.filter((x) => x !== color))}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Size note (optional, e.g. One Size)"
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
        <textarea
          placeholder="Description (optional)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        />
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
          onChange={handleAddItem}
        />
      </div>

      {items && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No merch items yet.
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {items?.map((item) => (
          <MerchThumb key={item.id} item={item} onPreview={() => openPreview(item)} onDelete={handleDelete} />
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
              src={editPhotos[selectedPhotoIndex]?.url}
              alt={previewItem.caption || ''}
              className="max-h-[40vh] w-full rounded-lg object-contain"
            />

            {editPhotos.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {editPhotos.map((photo, i) => (
                  <div key={photo.url} className="relative flex-shrink-0 pb-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndex(i)}
                      className={
                        'h-14 w-14 overflow-hidden rounded-lg border-2 ' +
                        (i === selectedPhotoIndex ? 'border-brand-500' : 'border-slate-200')
                      }
                    >
                      <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    </button>
                    {i === 0 ? (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeEditPhotoCover(i)}
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-600 shadow"
                      >
                        Set cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeEditPhoto(i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={addingPhotos}
              onClick={() => addPhotosInputRef.current?.click()}
              className={'mt-2 w-full disabled:opacity-60 ' + btnSecondary}
            >
              {addingPhotos ? 'Uploading...' : '+ Add more photos'}
            </button>
            <input
              ref={addPhotosInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddMorePhotos}
            />

            <div className="mt-3 space-y-2">
              <input
                placeholder="Caption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className={editInputCls}
              />
              <select
                value={editCategory}
                onChange={(e) => handleEditCategoryChange(e.target.value)}
                className={editInputCls}
              >
                <option value="">Select category...</option>
                {MERCH_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {editCategory === 'Shirt' && (
                <SizePicker sizes={editSizes} onToggle={(size) => setEditSizes((s) => toggleArrayValue(s, size))} />
              )}
              <ColorPicker
                colors={editColors}
                input={editColorInput}
                onInputChange={setEditColorInput}
                onAdd={handleAddEditColor}
                onRemove={(color) => setEditColors((c) => c.filter((x) => x !== color))}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Size note (optional)"
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
              <textarea
                placeholder="Description (optional)"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={editInputCls}
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving || editPhotos.length === 0}
                className={'w-full disabled:opacity-60 ' + btnPrimary}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>

            <div className="mt-3 flex justify-center gap-2">
              <a
                href={editPhotos[selectedPhotoIndex]?.url}
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
