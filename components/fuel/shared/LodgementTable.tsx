'use client'

import { useState, useMemo } from 'react'
import { calc } from '@/utils/fuel-calcs'
import { formatNGN, formatDate, getVarianceStatus } from '@/utils/fuel-format'
import { Pencil, Check, X } from 'lucide-react'

/**
 * Lodgement Row Data Structure
 */
export interface LodgementRow {
  id: string
  date: string // YYYY-MM-DD format
  dayNumber: number // 1-31

  // Expected sales value (from sales register)
  expectedSales: number

  // Payment channels (user input)
  cash?: number
  pos?: number
  transfer?: number
  opay?: number
  palmpay?: number
  moniepoint?: number
  [key: string]: number | string | undefined // Allow custom payment channels

  // Auto-calculated fields
  totalLodged?: number // Sum of all channels
  difference?: number // totalLodged - expectedSales
}

export interface LodgementTableProps {
  /** Month and year scope */
  month: number
  year: number

  /** Daily rows for the month */
  rows: LodgementRow[]

  /** Payment channels to display (in order) */
  paymentChannels: string[]

  /** Callback when a row is updated */
  onRowUpdate?: (rowId: string, channel: string, value: number) => void

  /** Whether the month is locked (read-only) */
  isLocked?: boolean

  /** Variance threshold for balanced status (default: 0) */
  balanceThreshold?: number
}

/**
 * LodgementTable Component
 *
 * Bank lodgement register used across:
 * - Filling Station → Bank Lodgements
 * - LPG Section → Daily Sales (lodgement tracking)
 * - AGO Peddling → Cash Collections
 */
export function LodgementTable({
  month,
  year,
  rows,
  paymentChannels,
  onRowUpdate,
  isLocked = false,
  balanceThreshold = 0,
}: LodgementTableProps) {
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    channel: string
  } | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  // Calculate totals for each row
  const computedRows = useMemo(() => {
    return rows.map((row) => {
      const channels: Record<string, number> = {}

      // Collect all payment channel values
      paymentChannels.forEach((channel) => {
        channels[channel] = (row[channel] as number) || 0
      })

      const totalLodged = calc.totalLodged(channels)
      const difference = calc.lodgementDiff(totalLodged, row.expectedSales)

      return {
        ...row,
        totalLodged,
        difference,
      }
    })
  }, [rows, paymentChannels])

  // Calculate summary totals
  const summary = useMemo(() => {
    const channelTotals: Record<string, number> = {}

    paymentChannels.forEach((channel) => {
      channelTotals[channel] = computedRows.reduce(
        // @ts-ignore - Dynamic channel access intentional
        (sum, r) => sum + ((r[channel] as number) || 0),
        0
      )
    })

    const expectedSales = computedRows.reduce((sum, r) => sum + r.expectedSales, 0)
    const totalLodged = computedRows.reduce((sum, r) => sum + (r.totalLodged || 0), 0)
    const difference = totalLodged - expectedSales

    return {
      expectedSales,
      channelTotals,
      totalLodged,
      difference,
    }
  }, [computedRows, paymentChannels])

  const handleCellClick = (rowId: string, channel: string) => {
    if (isLocked) return

    const row = rows.find((r) => r.id === rowId)
    if (!row) return

    setEditingCell({ rowId, channel })
    setEditValue(String((row[channel] as number) || 0))
  }

  const handleCellSave = () => {
    if (!editingCell || !onRowUpdate) return

    const numValue = parseFloat(editValue)
    if (isNaN(numValue)) {
      setEditingCell(null)
      return
    }

    onRowUpdate(editingCell.rowId, editingCell.channel, numValue)
    setEditingCell(null)
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const getRowColor = (difference: number) => {
    if (Math.abs(difference) <= balanceThreshold) return 'bg-green-50'
    if (difference > balanceThreshold) return 'bg-amber-50' // Overlodged
    return 'bg-red-50' // Underlodged
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
              Date
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expected Sales
            </th>
            {paymentChannels.map((channel) => (
              <th
                key={channel}
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {channel}
              </th>
            ))}
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Total Lodged
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider italic">
              Difference
            </th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {computedRows.map((row) => {
            const rowColorClass = getRowColor(row.difference || 0)
            const status = getVarianceStatus(row.difference || 0, balanceThreshold)

            return (
              <tr key={row.id} className={rowColorClass}>
                {/* Date */}
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 sticky left-0 bg-white z-10">
                  {formatDate(row.date, 'short')}
                </td>

                {/* Expected Sales (read-only) */}
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                  {formatNGN(row.expectedSales, false)}
                </td>

                {/* Payment Channels */}
                {paymentChannels.map((channel) => (
                  <td
                    key={channel}
                    className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCellClick(row.id, channel)}
                  >
                    {editingCell?.rowId === row.id &&
                    editingCell?.channel === channel ? (
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-28 px-2 py-1 border rounded text-right"
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
                        {/* @ts-ignore - Dynamic channel access intentional */}
                        {formatNGN((row[channel] as number) || 0, false)}
                        {!isLocked && <Pencil className="w-3 h-3 text-gray-400" />}
                      </span>
                    )}
                  </td>
                ))}

                {/* Total Lodged (Auto-calculated) */}
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 italic font-medium">
                  {formatNGN(row.totalLodged || 0, false)}
                </td>

                {/* Difference (Auto-calculated) */}
                <td
                  className={`px-3 py-2 whitespace-nowrap text-sm text-right italic font-medium ${
                    (row.difference || 0) > balanceThreshold
                      ? 'text-amber-700'
                      : (row.difference || 0) < -balanceThreshold
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}
                >
                  {formatNGN(row.difference || 0, false)}
                </td>

                {/* Status Badge */}
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status.status === 'balanced'
                        ? 'bg-green-100 text-green-800'
                        : status.status === 'surplus'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {status.status === 'balanced'
                      ? 'Balanced'
                      : status.status === 'surplus'
                      ? 'Overlodged'
                      : 'Underlodged'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>

        {/* Summary Row */}
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="px-3 py-3 text-sm text-gray-900 sticky left-0 bg-gray-100 z-10">
              TOTAL
            </td>
            <td className="px-3 py-3 text-sm text-right text-gray-900">
              {formatNGN(summary.expectedSales, false)}
            </td>
            {paymentChannels.map((channel) => (
              <td key={channel} className="px-3 py-3 text-sm text-right text-gray-900">
                {formatNGN(summary.channelTotals[channel] || 0, false)}
              </td>
            ))}
            <td className="px-3 py-3 text-sm text-right text-gray-500 italic">
              {formatNGN(summary.totalLodged, false)}
            </td>
            <td
              className={`px-3 py-3 text-sm text-right italic ${
                summary.difference > balanceThreshold
                  ? 'text-amber-700'
                  : summary.difference < -balanceThreshold
                  ? 'text-red-700'
                  : 'text-green-700'
              }`}
            >
              {formatNGN(summary.difference, false)}
            </td>
            <td className="px-3 py-3"></td>
          </tr>
        </tfoot>
      </table>

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-600 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
          <span>Balanced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
          <span>Overlodged (Excess Cash)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
          <span>Underlodged (Missing Cash)</span>
        </div>
      </div>
    </div>
  )
}
