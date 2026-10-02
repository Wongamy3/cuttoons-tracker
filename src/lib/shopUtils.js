export const INSTAGRAM_HANDLE = 'cuttoonsja'
export const FACEBOOK_PAGE = 'cuttoons'

export function itemSubtitle(item) {
  return [item.caption, item.sizeTag].filter(Boolean).join(' · ')
}

export function sortedByNewest(items) {
  return items ? items.slice().sort((a, b) => b.createdAt - a.createdAt) : items
}

// Portfolio items with a displayOrder show first (lowest number first);
// everything else falls back to newest-first, same as sortedByNewest.
export function sortedPortfolio(items) {
  if (!items) return items
  return items.slice().sort((a, b) => {
    const aOrder = a.displayOrder !== '' && a.displayOrder != null ? Number(a.displayOrder) : null
    const bOrder = b.displayOrder !== '' && b.displayOrder != null ? Number(b.displayOrder) : null
    if (aOrder !== null && bOrder !== null) return aOrder - bOrder
    if (aOrder !== null) return -1
    if (bOrder !== null) return 1
    return b.createdAt - a.createdAt
  })
}
