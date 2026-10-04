import { PORTFOLIO_CATEGORIES } from '../db'

export const INSTAGRAM_HANDLE = 'cuttoonsja'
export const FACEBOOK_PAGE = 'cuttoons'
export const YOUTUBE_HANDLE = 'cut-toons7607'

export function itemSubtitle(item) {
  return [item.caption, item.sizeTag].filter(Boolean).join(' · ')
}

// Turns a category name into a DOM-safe id for scroll-to-section jump links.
export function categorySlug(category) {
  return 'category-' + category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function sortedByNewest(items) {
  return items ? items.slice().sort((a, b) => b.createdAt - a.createdAt) : items
}

// Items with a value in `field` show first (lowest number first); everything
// else falls back to newest-first, same as sortedByNewest.
function sortByPriorityField(items, field) {
  return items.slice().sort((a, b) => {
    const aOrder = a[field] !== '' && a[field] != null ? Number(a[field]) : null
    const bOrder = b[field] !== '' && b[field] != null ? Number(b[field]) : null
    if (aOrder !== null && bOrder !== null) return aOrder - bOrder
    if (aOrder !== null) return -1
    if (bOrder !== null) return 1
    return b.createdAt - a.createdAt
  })
}

function sortByDisplayOrder(items) {
  return sortByPriorityField(items, 'displayOrder')
}

// Portfolio items explicitly checked "Show on Home Page", ordered by their
// optional homePriority number (lower first), falling back to newest-first.
export function homePageItems(items) {
  if (!items) return items
  return sortByPriorityField(
    items.filter((i) => i.showOnHome),
    'homePriority'
  )
}

// Buckets portfolio items by category (unrecognized/missing category falls
// back to "Other"), sorting each bucket independently by displayOrder so the
// number only ever competes against other items in the same category.
// Returns [{ category, items }], omitting empty categories, in
// PORTFOLIO_CATEGORIES order.
export function groupedPortfolio(items) {
  if (!items) return items
  const byCategory = new Map(PORTFOLIO_CATEGORIES.map((c) => [c, []]))
  for (const item of items) {
    const category = PORTFOLIO_CATEGORIES.includes(item.category) ? item.category : 'Other'
    byCategory.get(category).push(item)
  }
  return PORTFOLIO_CATEGORIES.filter((c) => byCategory.get(c).length > 0).map((category) => ({
    category,
    items: sortByDisplayOrder(byCategory.get(category)),
  }))
}
