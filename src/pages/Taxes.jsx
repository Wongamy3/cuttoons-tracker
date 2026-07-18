import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import { useCollection } from '../lib/useCollection'
import { btnPrimary, btnSecondary } from '../components/buttonStyles'

function yearOf(dateStr) {
  return dateStr ? new Date(dateStr + 'T00:00:00').getFullYear() : null
}

function exportExpensesToExcel(year, yearExpenses) {
  const rows = yearExpenses.map((e) => ({
    Date: e.date ? new Date(e.date + 'T00:00:00').toLocaleDateString() : '',
    Vendor: e.vendor || '',
    Description: e.description || '',
    Category: e.category || '',
    Amount: parseFloat(e.amount) || 0,
    Notes: e.notes || '',
    'Receipt Photo(s)': (e.receiptPhotos || []).map((p) => p.url).join(', '),
  }))

  const sheet = XLSX.utils.json_to_sheet(rows)
  sheet['!cols'] = [
    { wch: 12 },
    { wch: 20 },
    { wch: 28 },
    { wch: 30 },
    { wch: 12 },
    { wch: 30 },
    { wch: 40 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, `${year}`)
  XLSX.writeFile(workbook, `CutToons-Expenses-${year}.xlsx`)
}

function fetchImageAsDataUrl(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }),
    )
}

async function exportExpensesToPDF(year, yearExpenses, total, byCategory) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 40
  const contentWidth = pageWidth - margin * 2
  let y = margin

  function ensureSpace(height) {
    if (y + height > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(`CutToons Expenses — ${year}`, margin, y)
  y += 26

  doc.setFontSize(13)
  doc.text(`Total: $${total.toFixed(2)}`, margin, y)
  y += 18

  if (byCategory.length > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    for (const [category, amt] of byCategory) {
      ensureSpace(14)
      doc.text(category, margin, y)
      doc.text(`$${amt.toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
      y += 14
    }
  }
  y += 8
  doc.setDrawColor(200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 22

  for (const e of yearExpenses) {
    const dateStr = e.date ? new Date(e.date + 'T00:00:00').toLocaleDateString() : ''

    ensureSpace(46)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(e.vendor || 'Unnamed purchase', margin, y)
    doc.text(`$${(parseFloat(e.amount) || 0).toFixed(2)}`, pageWidth - margin, y, { align: 'right' })
    y += 16

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(110)
    doc.text(`${dateStr}   •   ${e.category || ''}`, margin, y)
    doc.setTextColor(0)
    y += 16

    if (e.description) {
      const lines = doc.splitTextToSize(`Description: ${e.description}`, contentWidth)
      ensureSpace(lines.length * 12)
      doc.text(lines, margin, y)
      y += lines.length * 12 + 4
    }

    if (e.notes) {
      const lines = doc.splitTextToSize(`Notes: ${e.notes}`, contentWidth)
      ensureSpace(lines.length * 12)
      doc.text(lines, margin, y)
      y += lines.length * 12 + 4
    }

    for (const photo of e.receiptPhotos || []) {
      try {
        const dataUrl = await fetchImageAsDataUrl(photo.url)
        const props = doc.getImageProperties(dataUrl)
        const maxSize = 200
        const scale = Math.min(maxSize / props.width, maxSize / props.height, 1)
        const w = props.width * scale
        const h = props.height * scale
        ensureSpace(h + 10)
        doc.addImage(dataUrl, props.fileType, margin, y, w, h)
        y += h + 10
      } catch {
        ensureSpace(14)
        doc.setFontSize(9)
        doc.setTextColor(150)
        doc.text('(Receipt image could not be loaded)', margin, y)
        doc.setTextColor(0)
        y += 14
      }
    }

    y += 8
    doc.setDrawColor(230)
    doc.line(margin, y, pageWidth - margin, y)
    y += 18
  }

  doc.save(`CutToons-Expenses-${year}.pdf`)
}

export default function Taxes() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [pdfExporting, setPdfExporting] = useState(false)
  const expenses = useCollection('expenses')

  const { yearExpenses, total, byCategory } = useMemo(() => {
    if (!expenses) return { yearExpenses: [], total: 0, byCategory: [] }
    const filtered = expenses
      .filter((e) => yearOf(e.date) === selectedYear)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const totals = new Map()
    let sum = 0
    for (const e of filtered) {
      const amt = parseFloat(e.amount) || 0
      sum += amt
      totals.set(e.category, (totals.get(e.category) || 0) + amt)
    }
    const byCategory = [...totals.entries()].sort((a, b) => b[1] - a[1])

    return { yearExpenses: filtered, total: sum, byCategory }
  }, [expenses, selectedYear])

  async function handleExportPDF() {
    setPdfExporting(true)
    try {
      await exportExpensesToPDF(selectedYear, yearExpenses, total, byCategory)
    } finally {
      setPdfExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSelectedYear((y) => y - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-500 transition active:scale-95"
          aria-label="Previous year"
        >
          ‹
        </button>
        <p className="text-lg font-bold text-black">{selectedYear} Expenses</p>
        <button
          type="button"
          onClick={() => setSelectedYear((y) => y + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-500 transition active:scale-95"
          aria-label="Next year"
        >
          ›
        </button>
      </div>

      <Link to="/taxes/new" className={'block text-center ' + btnPrimary}>
        + Add Expense
      </Link>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => exportExpensesToExcel(selectedYear, yearExpenses)}
          disabled={yearExpenses.length === 0}
          className={'flex-1 ' + btnSecondary + ' disabled:cursor-not-allowed disabled:opacity-40'}
        >
          Export to Excel
        </button>
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={yearExpenses.length === 0 || pdfExporting}
          className={'flex-1 ' + btnSecondary + ' disabled:cursor-not-allowed disabled:opacity-40'}
        >
          {pdfExporting ? 'Exporting…' : 'Export to PDF'}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-sm font-medium text-slate-700">Total for {selectedYear}</p>
        <p className="text-2xl font-bold text-black">${total.toFixed(2)}</p>

        {byCategory.length > 0 && (
          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
            {byCategory.map(([category, amt]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{category}</span>
                <span className="font-semibold text-black">${amt.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {expenses === undefined && <p className="text-sm text-slate-400">Loading...</p>}

      {expenses && yearExpenses.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No expenses logged for {selectedYear} yet.
        </div>
      )}

      <ul className="space-y-2">
        {yearExpenses.map((e) => (
          <li key={e.id}>
            <Link
              to={`/taxes/${e.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-150 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-black">{e.vendor || 'Unnamed purchase'}</p>
                  {e.description && <p className="mt-0.5 text-xs text-slate-500">{e.description}</p>}
                </div>
                <p className="font-semibold text-black">${(parseFloat(e.amount) || 0).toFixed(2)}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {e.category}
                </span>
                <span className="text-xs text-slate-400">
                  {e.date ? new Date(e.date + 'T00:00:00').toLocaleDateString() : ''}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
