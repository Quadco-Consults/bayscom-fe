'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  MonthScopeBar,
  InventorySummaryCard,
  SummaryItem,
} from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { Flame, Download, Printer, Edit, Check, X } from 'lucide-react'
import { calc } from '@/utils/fuel-calcs'
import { formatNGN, formatKg } from '@/utils/fuel-format'

interface LPGDailySalesRow {
  id: string
  date: string
  dayNumber: number

  // Pump 1 Meter Readings (Kg)
  pump1Opening: number
  pump1Closing: number

  // Pump 2 Meter Readings (Kg)
  pump2Opening: number
  pump2Closing: number

  // Accessories Sales
  cylinders12_5kg: number
  cylinders6kg: number
  cylinders3kg: number
  regulators: number
  hoses: number

  // Pricing
  pricePerKg: number
  cylinderPrice12_5: number
  cylinderPrice6: number
  cylinderPrice3: number
  regulatorPrice: number
  hosePrice: number
}

/**
 * LPG Section - Daily Sales Page
 *
 * Demonstrates:
 * - Pump meter tracking (2 pumps)
 * - LPG quantity calculations (Kg)
 * - Accessories sales tracking
 * - Daily revenue calculations
 * - Monthly summary metrics
 */
export default function LPGDailySalesPage() {
  const { config, getStation, getProductPrice, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [salesRows, setSalesRows] = useState<LPGDailySalesRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Get LPG price for current month
  const lpgPricePerKg = getProductPrice('LPG', stationId, month, year)

  // Default accessory prices (could come from config)
  const defaultPrices = {
    cylinder12_5kg: 15000,
    cylinder6kg: 8500,
    cylinder3kg: 5000,
    regulator: 3500,
    hose: 1500,
  }

  // Generate daily rows for the month
  useEffect(() => {
    setLoading(true)

    const daysInMonth = new Date(year, month, 0).getDate()
    const rows: LPGDailySalesRow[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = date.toISOString().split('T')[0]

      rows.push({
        id: `LPG-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        date: dateStr,
        dayNumber: day,
        pump1Opening: day === 1 ? 5000 : 0,
        pump1Closing: 0,
        pump2Opening: day === 1 ? 3200 : 0,
        pump2Closing: 0,
        cylinders12_5kg: 0,
        cylinders6kg: 0,
        cylinders3kg: 0,
        regulators: 0,
        hoses: 0,
        pricePerKg: lpgPricePerKg,
        cylinderPrice12_5: defaultPrices.cylinder12_5kg,
        cylinderPrice6: defaultPrices.cylinder6kg,
        cylinderPrice3: defaultPrices.cylinder3kg,
        regulatorPrice: defaultPrices.regulator,
        hosePrice: defaultPrices.hose,
      })
    }

    // Add sample data for demonstration
    if (rows.length > 0) {
      rows[0].pump1Closing = 5187.5
      rows[0].pump2Closing = 3325.0
      rows[0].cylinders12_5kg = 5
      rows[0].cylinders6kg = 3
      rows[0].cylinders3kg = 2
      rows[0].regulators = 4
      rows[0].hoses = 2

      if (rows.length > 1) {
        rows[1].pump1Opening = 5187.5
        rows[1].pump1Closing = 5320.0
        rows[1].pump2Opening = 3325.0
        rows[1].pump2Closing = 3450.0
        rows[1].cylinders12_5kg = 3
        rows[1].cylinders6kg = 4
        rows[1].cylinders3kg = 1
        rows[1].regulators = 2
        rows[1].hoses = 3

        if (rows.length > 2) {
          rows[2].pump1Opening = 5320.0
          rows[2].pump1Closing = 5488.5
          rows[2].pump2Opening = 3450.0
          rows[2].pump2Closing = 3562.0
          rows[2].cylinders12_5kg = 4
          rows[2].cylinders6kg = 2
          rows[2].cylinders3kg = 3
          rows[2].regulators = 3
          rows[2].hoses = 1
        }
      }
    }

    setSalesRows(rows)
    setLoading(false)
  }, [stationId, month, year, lpgPricePerKg])

  // Calculate LPG quantities sold
  const calculateQuantitySold = (row: LPGDailySalesRow) => {
    const pump1Diff = calc.pumpDiff(row.pump1Closing, row.pump1Opening)
    const pump2Diff = calc.pumpDiff(row.pump2Closing, row.pump2Opening)
    return calc.qtySold(pump1Diff, pump2Diff)
  }

  // Calculate daily revenue
  const calculateDailyRevenue = (row: LPGDailySalesRow) => {
    const lpgQty = calculateQuantitySold(row)
    const lpgRevenue = lpgQty * row.pricePerKg

    const accessoryRevenue =
      row.cylinders12_5kg * row.cylinderPrice12_5 +
      row.cylinders6kg * row.cylinderPrice6 +
      row.cylinders3kg * row.cylinderPrice3 +
      row.regulators * row.regulatorPrice +
      row.hoses * row.hosePrice

    return {
      lpgRevenue,
      accessoryRevenue,
      totalRevenue: lpgRevenue + accessoryRevenue,
    }
  }

  // Handle cell editing
  const handleCellClick = (rowId: string, field: string, currentValue: number) => {
    if (isLocked) return
    setEditingCell({ rowId, field })
    setEditValue(currentValue.toString())
  }

  const handleSaveEdit = () => {
    if (!editingCell) return

    const value = parseFloat(editValue) || 0
    const { rowId, field } = editingCell

    setSalesRows((prevRows) =>
      prevRows.map((row, index) => {
        if (row.id !== rowId) return row

        const updatedRow = { ...row, [field]: value }

        // Propagate closing readings to next day's opening readings
        if (index < prevRows.length - 1) {
          if (field === 'pump1Closing') {
            prevRows[index + 1].pump1Opening = value
          } else if (field === 'pump2Closing') {
            prevRows[index + 1].pump2Opening = value
          }
        }

        return updatedRow
      })
    )

    setEditingCell(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  // Calculate monthly summary
  const monthlySummary = useMemo((): SummaryItem[] => {
    let totalLPGQty = 0
    let totalLPGRevenue = 0
    let totalAccessoryRevenue = 0
    let totalCylinders12_5 = 0
    let totalCylinders6 = 0
    let totalCylinders3 = 0
    let totalRegulators = 0
    let totalHoses = 0

    salesRows.forEach((row) => {
      const qty = calculateQuantitySold(row)
      const { lpgRevenue, accessoryRevenue } = calculateDailyRevenue(row)

      totalLPGQty += qty
      totalLPGRevenue += lpgRevenue
      totalAccessoryRevenue += accessoryRevenue

      totalCylinders12_5 += row.cylinders12_5kg
      totalCylinders6 += row.cylinders6kg
      totalCylinders3 += row.cylinders3kg
      totalRegulators += row.regulators
      totalHoses += row.hoses
    })

    const totalRevenue = totalLPGRevenue + totalAccessoryRevenue
    const daysWithSales = salesRows.filter((r) => calculateQuantitySold(r) > 0).length

    return [
      {
        label: 'Total LPG Sold',
        value: totalLPGQty,
        format: 'number',
        description: `${formatKg(totalLPGQty)} across ${daysWithSales} days`,
      },
      {
        label: 'LPG Revenue',
        value: totalLPGRevenue,
        format: 'currency',
        highlight: 'success',
        description: 'Revenue from LPG sales',
      },
      {
        label: 'Accessories Revenue',
        value: totalAccessoryRevenue,
        format: 'currency',
        description: 'Revenue from cylinders and accessories',
      },
      {
        label: 'Total Revenue',
        value: totalRevenue,
        format: 'currency',
        highlight: 'success',
        description: 'Combined LPG + accessories revenue',
      },
      {
        label: '12.5kg Cylinders Sold',
        value: totalCylinders12_5,
        format: 'number',
        description: `${totalCylinders12_5} units`,
      },
      {
        label: '6kg Cylinders Sold',
        value: totalCylinders6,
        format: 'number',
        description: `${totalCylinders6} units`,
      },
      {
        label: '3kg Cylinders Sold',
        value: totalCylinders3,
        format: 'number',
        description: `${totalCylinders3} units`,
      },
      {
        label: 'Regulators Sold',
        value: totalRegulators,
        format: 'number',
        description: `${totalRegulators} units`,
      },
      {
        label: 'Hoses Sold',
        value: totalHoses,
        format: 'number',
        description: `${totalHoses} units`,
      },
    ]
  }, [salesRows])

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading LPG sales...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Month Scope Bar */}
        <MonthScopeBar
          stationId={stationId}
          month={month}
          year={year}
          isLocked={isLocked}
          stations={lpgStations}
          onStationChange={setStation}
          onMonthChange={(m, y) => setMonthYear(m, y)}
          showLockToggle={false}
          actions={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          }
        />

        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LPG Daily Sales</h1>
            <p className="text-sm text-gray-500">
              Daily pump meter readings and accessories sales tracking
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Monthly Summary"
          subtitle="Computed totals for the selected month"
          items={monthlySummary}
          icon={<Flame className="w-6 h-6" />}
        />

        {/* Daily Sales Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Daily Sales Register</h2>
            <p className="text-sm text-gray-500 mt-1">
              Record daily pump meter readings (Kg) and accessories sold. Auto-calculated fields
              are shown in italic.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-300"
                  >
                    Pump 1 (Kg)
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-300"
                  >
                    Pump 2 (Kg)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-300 bg-blue-50">
                    Total Qty (Kg)
                  </th>
                  <th
                    colSpan={5}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-300"
                  >
                    Accessories Sold
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-300 bg-green-50">
                    Daily Revenue
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  <th colSpan={2}></th>
                  <th className="px-2 py-2 text-xs text-gray-600 border-l border-gray-300">
                    Opening
                  </th>
                  <th className="px-2 py-2 text-xs text-gray-600">Closing</th>
                  <th className="px-2 py-2 text-xs text-gray-600 border-l border-gray-300">
                    Opening
                  </th>
                  <th className="px-2 py-2 text-xs text-gray-600">Closing</th>
                  <th className="px-2 py-2 text-xs text-gray-600 border-l border-gray-300"></th>
                  <th className="px-2 py-2 text-xs text-gray-600 border-l border-gray-300">
                    12.5kg
                  </th>
                  <th className="px-2 py-2 text-xs text-gray-600">6kg</th>
                  <th className="px-2 py-2 text-xs text-gray-600">3kg</th>
                  <th className="px-2 py-2 text-xs text-gray-600">Reg.</th>
                  <th className="px-2 py-2 text-xs text-gray-600">Hose</th>
                  <th className="px-2 py-2 text-xs text-gray-600 border-l border-gray-300"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesRows.map((row) => {
                  const qtySold = calculateQuantitySold(row)
                  const { totalRevenue } = calculateDailyRevenue(row)

                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                        {row.dayNumber}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(row.date).toLocaleDateString('en-NG', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Pump 1 */}
                      <td className="px-2 py-2 text-sm text-right border-l border-gray-200">
                        {row.pump1Opening.toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-sm border-r border-gray-200">
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === 'pump1Closing' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-24 px-2 py-1 border border-blue-500 rounded text-right"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit()
                                if (e.key === 'Escape') handleCancelEdit()
                              }}
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleCellClick(row.id, 'pump1Closing', row.pump1Closing)
                            }
                            className="w-full text-right hover:bg-blue-50 px-2 py-1 rounded group"
                            disabled={isLocked}
                          >
                            <span className="inline-flex items-center gap-1">
                              {row.pump1Closing.toLocaleString()}
                              {!isLocked && (
                                <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600" />
                              )}
                            </span>
                          </button>
                        )}
                      </td>

                      {/* Pump 2 */}
                      <td className="px-2 py-2 text-sm text-right border-l border-gray-200">
                        {row.pump2Opening.toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-sm">
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === 'pump2Closing' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-24 px-2 py-1 border border-blue-500 rounded text-right"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit()
                                if (e.key === 'Escape') handleCancelEdit()
                              }}
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleCellClick(row.id, 'pump2Closing', row.pump2Closing)
                            }
                            className="w-full text-right hover:bg-blue-50 px-2 py-1 rounded group"
                            disabled={isLocked}
                          >
                            <span className="inline-flex items-center gap-1">
                              {row.pump2Closing.toLocaleString()}
                              {!isLocked && (
                                <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600" />
                              )}
                            </span>
                          </button>
                        )}
                      </td>

                      {/* Total Quantity (Auto-calculated) */}
                      <td className="px-2 py-2 text-sm text-right font-medium text-blue-900 border-l border-gray-200 bg-blue-50 italic">
                        {qtySold.toLocaleString()}
                      </td>

                      {/* Accessories - Similar pattern for each */}
                      {['cylinders12_5kg', 'cylinders6kg', 'cylinders3kg', 'regulators', 'hoses'].map(
                        (field, idx) => (
                          <td
                            key={field}
                            className={`px-2 py-2 text-sm ${idx === 0 ? 'border-l border-gray-200' : ''}`}
                          >
                            {editingCell?.rowId === row.id && editingCell?.field === field ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-16 px-2 py-1 border border-blue-500 rounded text-right"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit()
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                />
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleCellClick(row.id, field, row[field as keyof LPGDailySalesRow] as number)
                                }
                                className="w-full text-right hover:bg-blue-50 px-2 py-1 rounded group"
                                disabled={isLocked}
                              >
                                <span className="inline-flex items-center gap-1">
                                  {(row[field as keyof LPGDailySalesRow] as number).toLocaleString()}
                                  {!isLocked && (
                                    <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600" />
                                  )}
                                </span>
                              </button>
                            )}
                          </td>
                        )
                      )}

                      {/* Daily Revenue (Auto-calculated) */}
                      <td className="px-2 py-2 text-sm text-right font-semibold text-green-700 border-l border-gray-200 bg-green-50 italic">
                        {formatNGN(totalRevenue)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">LPG Sales Guidelines:</h3>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>Record pump meter readings at start and end of each day (in Kg)</li>
            <li>
              Total quantity sold is auto-calculated: (Pump 1 difference) + (Pump 2 difference)
            </li>
            <li>Record all accessories sold: cylinders, regulators, and hoses</li>
            <li>Daily revenue includes both LPG sales and accessories sales</li>
            <li>LPG price per Kg: {formatNGN(lpgPricePerKg)}</li>
            <li>Verify pump meter readings match physical inventory counts</li>
            <li>Cylinder sales should match inventory depletion in accessories module</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
