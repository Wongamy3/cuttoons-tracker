import { Jimp } from 'jimp'

const SOURCE = 'src/assets/cuttoons-logo.png'

// Pale blue tint (matches the app's own background) instead of pure white —
// not white, but still light enough that the plain black "TOONS" text (which
// has no enclosing shape, unlike "CUT") stays legible. True transparency was
// tried first, but both iOS and Android fall back to filling transparent
// space with BLACK, which made "TOONS" invisible against it.
const BG = 0xeef4fcff

async function composite(logo, size, widthFraction) {
  const canvas = new Jimp({ width: size, height: size, color: BG })
  const targetW = Math.round(size * widthFraction)
  const scale = targetW / logo.bitmap.width
  const targetH = Math.round(logo.bitmap.height * scale)
  const resized = logo.clone().resize({ w: targetW, h: targetH })
  const x = Math.round((size - targetW) / 2)
  const y = Math.round((size - targetH) / 2)
  canvas.composite(resized, x, y)
  return canvas
}

const original = await Jimp.read(SOURCE)

const targets = [
  ['public/pwa-64x64.png', 64, 0.9],
  ['public/pwa-192x192.png', 192, 0.9],
  ['public/pwa-512x512.png', 512, 0.9],
  ['public/maskable-icon-512x512.png', 512, 0.72],
  ['public/apple-touch-icon-180x180.png', 180, 0.9],
]
for (const [path, size, frac] of targets) {
  const img = await composite(original, size, frac)
  await img.write(path)
  console.log('wrote', path)
}
