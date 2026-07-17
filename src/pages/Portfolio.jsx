import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { btnPrimary } from '../components/buttonStyles'

function PortfolioThumb({ item, onDelete }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(item.photo)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [item.photo])

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white">
      {url && <img src={url} alt={item.caption || ''} className="h-full w-full object-cover" />}
      {(item.caption || item.sizeTag) && (
        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[11px] text-white">
          {item.caption} {item.sizeTag && <span className="opacity-75">· {item.sizeTag}</span>}
        </div>
      )}
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition duration-150 active:scale-90 group-hover:opacity-100"
        aria-label="Delete"
      >
        ×
      </button>
    </div>
  )
}

export default function Portfolio() {
  const items = useLiveQuery(() => db.portfolio.orderBy('createdAt').reverse().toArray(), [])
  const fileInputRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [sizeTag, setSizeTag] = useState('')

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    for (const photo of files) {
      await db.portfolio.add({
        photo,
        caption: caption.trim(),
        sizeTag: sizeTag.trim(),
        createdAt: Date.now(),
      })
    }
    setCaption('')
    setSizeTag('')
    e.target.value = ''
  }

  async function handleDelete(id) {
    if (!confirm('Delete this photo from your portfolio?')) return
    await db.portfolio.delete(id)
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
            className="w-28 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <button type="button" onClick={() => fileInputRef.current?.click()} className={'w-full ' + btnPrimary}>
          + Upload photo(s)
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
          <PortfolioThumb key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
