import { Jimp } from 'jimp'

const SOURCE = 'src/assets/cuttoons-logo.png'
const THRESHOLD = 235

async function cutoutBackground(img) {
  const { width, height, data } = img.bitmap
  const visited = new Uint8Array(width * height)
  const stack = []

  const idx = (x, y) => y * width + x
  const isBg = (o) => data[o] >= THRESHOLD && data[o + 1] >= THRESHOLD && data[o + 2] >= THRESHOLD

  function tryPush(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const i = idx(x, y)
    if (visited[i]) return
    const o = i * 4
    if (!isBg(o)) return
    visited[i] = 1
    stack.push(i)
  }

  for (let x = 0; x < width; x++) {
    tryPush(x, 0)
    tryPush(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y)
    tryPush(width - 1, y)
  }

  while (stack.length) {
    const i = stack.pop()
    const x = i % width
    const y = Math.floor(i / width)
    data[i * 4 + 3] = 0
    tryPush(x + 1, y)
    tryPush(x - 1, y)
    tryPush(x, y + 1)
    tryPush(x, y - 1)
  }

  return img
}

async function composite(logo, size, { transparent, widthFraction }) {
  const canvas = new Jimp({ width: size, height: size, color: transparent ? 0x00000000 : 0xffffffff })
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
const cutout = await cutoutBackground(original.clone())
cutout.autocrop()

// Transparent, larger — used for Android/manifest icons
const transparentTargets = [
  ['public/pwa-64x64.png', 64, 0.9],
  ['public/pwa-192x192.png', 192, 0.9],
  ['public/pwa-512x512.png', 512, 0.9],
  ['public/maskable-icon-512x512.png', 512, 0.72],
]
for (const [path, size, frac] of transparentTargets) {
  const img = await composite(cutout, size, { transparent: true, widthFraction: frac })
  await img.write(path)
  console.log('wrote', path)
}

// Opaque white, but still larger than before — iOS safe (transparency renders black on iOS)
const appleIcon = await composite(original, 180, { transparent: false, widthFraction: 0.9 })
await appleIcon.write('public/apple-touch-icon-180x180.png')
console.log('wrote public/apple-touch-icon-180x180.png')
