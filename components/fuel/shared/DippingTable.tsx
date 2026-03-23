'use client'

import { useState, useMemo } from 'react'
import { calc } from '@/utils/fuel-calcs'
import {
  formatNGN,
  formatLitres,
  formatKg,
  formatDate,
  getVarianceColor,
} from '@/utils/fuel-format'
import { Pencil, Check, X } from 'lucide-react'

/**
 * Dipping Table Row Data Structure
 */
export interface DippingRow {
  id: string
  date: string // YYYY-MM-DD format
  dayNumber: number // 1-31

  // User Input Fields
  openingStock: number
  waybillQty: number
  transitLoss: number
  sales: number
  physicalDipping: number
  pumpPrice: number

  // Auto-Calculated Fields (derived from above)
  actualReceipt?: number // waybill - transitLoss
  closingStockBook?: number // opening + receipt - sales
  diff?: number // physical - book
  dailyOverageShortage?: number // today's diff - yesterday's diff
  value?: number // overage * price
}

export interface DippingTableProps {
  /** Product code (PMS, AGO, DPK, or LPG) */
  product: string

  /** Unit of measurement (Ltrs or Kg) */
  unit: 'Ltrs' | 'Kg'

  /** Month and year scope */
  month: number
  year: number

  /** Daily rows for the month */
  rows: DippingRow[]

  /** Callback when a row is updated */
  onRowUpdate?: (rowId: string, field: keyof DippingRow, value: number) => void

  /** Whether the month is locked (read-only) */
  isLocked?: boolean

  /** Tank capacity for validation */
  tankCapacity?: number
}

/**
 * DippingTable Component
 *
 * Daily stock reconciliation table used across:
 * - Filling Station → PMS/AGO/DPK Stock Reconciliation
 * - LPG Section → Daily Sales
 * - AGO Peddling → Stock AGO
 */
export function DippingTable({
  product,
  unit,
  month,
  year,
  rows,
  onRowUpdate,
  isLocked = false,
  tankCapacity,
}: DippingTableProps) {
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    field: keyof DippingRow
  } | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  // Calculate all auto-fields for each row
  const computedRows = useMemo(() => {
    return rows.map((row, index) => {
      const actualReceipt = calc.receipt(row.waybillQty, row.transitLoss)
      const closingStockBook = calc.closingStock(
        row.openingStock,
        actualReceipt,
        row.sales
      )
      const diff = calc.diff(row.physicalDipping, closingStockBook)

      // Daily overage = today's diff - yesterday's diff
      const previousDiff = index > 0
        ? calc.diff(
            rows[index - 1].physicalDipping,
            calc.closingStock(
              rows[index - 1].openingStock,
              calc.receipt(rows[index - 1].waybillQty, rows[index - 1].transitLoss),
              rows[index - 1].sales
            )
          )
        : 0

      const dailyOverageShortage = calc.dailyOverage(diff, previousDiff)
      const value = calc.value(dailyOverageShortage, row.pumpPrice)

      return {
        ...row,
        actualReceipt,
        closingStockBook,
        diff,
        dailyOverageShortage,
        value,
      }
    })
  }, [rows])

  // Calculate summary totals
  const summary = useMemo(() => {
    return {
      waybillQty: computedRows.reduce((sum, r) => sum + r.waybillQty, 0),
      transitLoss: computedRows.reduce((sum, r) => sum + r.transitLoss, 0),
      actualReceipt: computedRows.reduce((sum, r) => sum + (r.actualReceipt || 0), 0),
      sales: computedRows.reduce((sum, r) => sum + r.sales, 0),
      dailyOverageShortage: computedRows.reduce(
        (sum, r) => sum + (r.dailyOverageShortage || 0),
        0
      ),
      value: computedRows.reduce((sum, r) => sum + (r.value || 0), 0),
    }
  }, [computedRows])

  const formatQuantity = unit === 'Ltrs' ? formatLitres : formatKg

  const handleCellClick = (rowId: string, field: keyof DippingRow) => {
    if (isLocked) return

    // Only allow editing user-input fields
    const editableFields: (keyof DippingRow)[] = [
      'openingStock',
      'waybillQty',
      'transitLoss',
      'sales',
      'physicalDipping',
      'pumpPrice',
    ]

    if (!editableFields.includes(field)) return

    const row = rows.find((r) => r.id === rowId)
    if (!row) return

    setEditingCell({ rowId, field })
    setEditValue(String(row[field]))
  }

  const handleCellSave = () => {
    if (!editingCell || !onRowUpdate) return

    const numValue = parseFloat(editValue)
    if (isNaN(numValue)) {
      setEditingCell(null)
      return
    }

    onRowUpdate(editingCell.rowId, editingCell.field, numValue)
    setEditingCell(null)
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const getRowColor = (diff: number) => {
    if (Math.abs(diff) < 10) return '' // Balanced - no color
    if (diff > 0) return 'bg-green-50' // Overage
    return 'bg-red-50' // Shortage
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opening Stock
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Waybill
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transit Loss
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Actual Receipt
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sales
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Closing (Book)
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Physical Dipping
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Diff
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Daily O/S
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pump Price
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {computedRows.map((row) => {
            const rowColorClass = getRowColor(row.diff || 0)

            return (
              <tr key={row.id} className={rowColorClass}>
                {/* Date */}
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(row.date, 'short')}
                </td>

                {/* Opening Stock */}
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCellClick(row.id, 'openingStock')}
                >
                  {editingCell?.rowId === row.id &&
                  editingCell?.field === 'openingStock' ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellSave()
                          if (e.key === 'Escape') handleCellCancel()
                        }}
                      />
                      <button
                        onClick={handleCellSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCellCancel}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center justify-end gap-1">
                      {formatQuantity(row.openingStock, false)}
                      {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                    </span>
                  )}
                </td>

                {/* Waybill */}
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCellClick(row.id, 'waybillQty')}
                >
                  {editingCell?.rowId === row.id &&
                  editingCell?.field === 'waybillQty' ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellSave()
                          if (e.key === 'Escape') handleCellCancel()
                        }}
                      />
                      <button onClick={handleCellSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleCellCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center justify-end gap-1">
                      {formatQuantity(row.waybillQty, false)}
                      {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                    </span>
                  )}
                </td>

                {/* Transit Loss */}
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCellClick(row.id, 'transitLoss')}
                >
                  {editingCell?.rowId === row.id &&
                  editingCell?.field === 'transitLoss' ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellSave()
                          if (e.key === 'Escape') handleCellCancel()
                        }}
                      />
                      <button onClick={handleCellSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleCellCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center justify-end gap-1">
                      {formatQuantity(row.transitLoss, false)}
                      {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                    </span>
                  )}
                </td>

                {/* Actual Receipt (Auto-calculated) */}
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 italic">
                  {formatQuantity(row.actualReceipt || 0, false)}
                </td>

                {/* Sales */}
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCellClick(row.id, 'sales')}
                >
                  {editingCell?.rowId === row.id && editingCell?.field === 'sales' ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellSave()
                          if (e.key === 'Escape') handleCellCancel()
                        }}
                      />
                      <button onClick={handleCellSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleCellCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center justify-end gap-1">
                      {formatQuantity(row.sales, false)}
                      {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                    </span>
                  )}
                </td>

                {/* Closing Stock Book (Auto-calculated) */}
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 italic">
                  {formatQuantity(row.closingStockBook || 0, false)}
                </td>

                {/* Physical Dipping */}
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCellClick(row.id, 'physicalDipping')}
                >
                  {editingCell?.rowId === row.id &&
                  editingCell?.field === 'physicalDipping' ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellSave()
                          if (e.key === 'Escape') handleCellCancel()
                        }}
                      />
                      <button onClick={handleCellSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleCellCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center justify-end gap-1">
                      {formatQuantity(row.physicalDipping, false)}
                      {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                    </span>
                  )}
                </td>

                {/* Diff (Auto-calculated) */}
                <td className={`px-3 py-2 whitespace-nowrap text-sm text-right italic ${
                  (row.diff || 0) > 0 ? 'text-green-700 font-medium' :
                  (row.diff || 0) < 0 ? 'text-red-700 font-medium' :
                  'text-gray-500'
                }`}>
                  {formatQuantity(row.diff || 0, false)}
                </td>

                {/* Daily Overage/Shortage (Auto-calculated) */}
                <td className={`px-3 py-2 whitespace-nowrap text-sm text-right italic ${
                  (row.dailyOverageShortage || 0) > 0 ? 'text-green-700 font-medium' :
                  (row.dailyOverageShortage || 0) < 0 ? 'text-red-700 font-medium' :
                  'text-gray-500'
                }`}>
                  {formatQuantity(row.dailyOverageShortage || 0, false)}
                </td>

                {/* Pump Price */}
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCellClick(row.id, 'pumpPrice')}
                >
                  {editingCell?.rowId === row.id &&
                  editingCell?.field === 'pumpPrice' ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellSave()
                          if (e.key === 'Escape') handleCellCancel()
                        }}
                      />
                      <button onClick={handleCellSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleCellCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center justify-end gap-1">
                      {formatNGN(row.pumpPrice, false)}
                      {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                    </span>
                  )}
                </td>

                {/* Value (Auto-calculated) */}
                <td className={`px-3 py-2 whitespace-nowrap text-sm text-right italic ${
                  (row.value || 0) > 0 ? 'text-green-700 font-medium' :
                  (row.value || 0) < 0 ? 'text-red-700 font-medium' :
                  'text-gray-500'
                }`}>
                  {formatNGN(row.value || 0, false)}
                </td>
              </tr>
            )
          })}
        </tbody>

        {/* Summary Row */}
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="px-3 py-3 text-sm text-gray-900">TOTAL</td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">—</td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">
              {formatQuantity(summary.waybillQty, false)}
            </td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">
              {formatQuantity(summary.transitLoss, false)}
            </td>
            <td className="px-3 py-3 text-sm text-right text-gray-500 italic">
              {formatQuantity(summary.actualReceipt, false)}
            </td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">
              {formatQuantity(summary.sales, false)}
            </td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">—</td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">—</td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">—</td>
            <td className={`px-3 py-3 text-sm text-right italic ${
              summary.dailyOverageShortage > 0 ? 'text-green-700' :
              summary.dailyOverageShortage < 0 ? 'text-red-700' :
              'text-gray-500'
            }`}>
              {formatQuantity(summary.dailyOverageShortage, false)}
            </td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">—</td>
            <td className={`px-3 py-3 text-sm text-right italic ${
              summary.value > 0 ? 'text-green-700' :
              summary.value < 0 ? 'text-red-700' :
              'text-gray-500'
            }`}>
              {formatNGN(summary.value, false)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
