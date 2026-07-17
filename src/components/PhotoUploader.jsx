import { useEffect, useState } from 'react'

export default function PhotoUploader({ label, photos, onChange }) {
  const [urls, setUrls] = useState([])
  const [previewIndex, setPreviewIndex] = useState(null)

  useEffect(() => {
    const next = photos.map((blob) => URL.createObjectURL(blob))
    setUrls(next)
    return () => next.forEach((url) => URL.revokeObjectURL(url))
  }, [photos])

  function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (files.length) onChange([...photos, ...files])
    e.target.value = ''
  }

  function removeAt(index) {
    onChange(photos.filter((_, i) => i !== index))
  }

  const previewPhoto = previewIndex !== null ? photos[previewIndex] : null
  const previewUrl = previewIndex !== null ? urls[previewIndex] : null

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={i} className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setPreviewIndex(i)}
              className="block h-full w-full"
              aria-label="Preview photo"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white transition duration-150 active:scale-90"
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
        ))}
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition duration-150 active:scale-95 hover:border-brand-400 hover:text-brand-500">
          <span className="text-2xl leading-none">+</span>
          <span className="text-[10px]">Add photo</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </label>
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewIndex(null)}
        >
          <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="" className="max-h-[80vh] max-w-full rounded-lg object-contain" />
            <div className="mt-3 flex justify-center gap-3">
              <a
                href={previewUrl}
                download={previewPhoto?.name || 'photo.jpg'}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition duration-150 active:scale-95"
              >
                Download
              </a>
              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition duration-150 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
