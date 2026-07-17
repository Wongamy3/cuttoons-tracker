export function itemSubtitle(item) {
  return [item.caption, item.sizeTag].filter(Boolean).join(' · ')
}

export function sortedByNewest(items) {
  return items ? items.slice().sort((a, b) => b.createdAt - a.createdAt) : items
}
