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
import {
  Package,
  Download,
  Printer,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
} from 'lucide-react'
import { formatNGN } from '@/utils/fuel-format'

interface AccessoryStockItem {
  id: string
  name: string
  category: 'cylinder' | 'accessory'
  currentStock: number
  reorderLevel: number
  unitCost: number

  // Monthly movements
  openingStock: number
  purchases: number
  sales: number
  adjustments: number // +/- for gains/losses

  // Status
  status: 'adequate' | 'low' | 'critical'
}

/**
 * LPG Section - Accessories Inventory Page
 *
 * Demonstrates:
 * - Cylinder stock tracking (12.5kg, 6kg, 3kg - empty/filled)
 * - Accessory stock tracking (regulators, hoses)
 * - Reorder level monitoring with alerts
 * - Monthly stock movements
 * - Stock reconciliation
 */
export default function LPGAccessoriesInventoryPage() {
  const { config, getStation, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [stockItems, setStockItems] = useState<AccessoryStockItem[]>([])
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Load inventory for the month
  useEffect(() => {
    setLoading(true)

    // Sample data (in production, this would come from API)
    const sampleStock: AccessoryStockItem[] = [
      {
        id: 'CYL-12.5-EMPTY',
        name: '12.5kg Cylinders (Empty)',
        category: 'cylinder',
        openingStock: 45,
        purchases: 35,
        sales: 28,
        adjustments: -2, // Lost/damaged
        currentStock: 50,
        reorderLevel: 30,
        unitCost: 12000,
        status: 'adequate',
      },
      {
        id: 'CYL-12.5-FILLED',
        name: '12.5kg Cylinders (Filled)',
        category: 'cylinder',
        openingStock: 120,
        purchases: 0, // Filled internally
        sales: 85,
        adjustments: 85, // Refilled from empty stock
        currentStock: 120,
        reorderLevel: 50,
        unitCost: 0, // Cost is in LPG
        status: 'adequate',
      },
      {
        id: 'CYL-6-EMPTY',
        name: '6kg Cylinders (Empty)',
        category: 'cylinder',
        openingStock: 38,
        purchases: 23,
        sales: 32,
        adjustments: 0,
        currentStock: 29,
        reorderLevel: 25,
        unitCost: 7000,
        status: 'low',
      },
      {
        id: 'CYL-6-FILLED',
        name: '6kg Cylinders (Filled)',
        category: 'cylinder',
        openingStock: 75,
        purchases: 0,
        sales: 58,
        adjustments: 58,
        currentStock: 75,
        reorderLevel: 30,
        unitCost: 0,
        status: 'adequate',
      },
      {
        id: 'CYL-3-EMPTY',
        name: '3kg Cylinders (Empty)',
        category: 'cylinder',
        openingStock: 25,
        purchases: 23,
        sales: 18,
        adjustments: -1,
        currentStock: 29,
        reorderLevel: 20,
        unitCost: 4000,
        status: 'adequate',
      },
      {
        id: 'CYL-3-FILLED',
        name: '3kg Cylinders (Filled)',
        category: 'cylinder',
        openingStock: 42,
        purchases: 0,
        sales: 35,
        adjustments: 35,
        currentStock: 42,
        reorderLevel: 20,
        unitCost: 0,
        status: 'adequate',
      },
      {
        id: 'REG-STANDARD',
        name: 'Gas Regulators',
        category: 'accessory',
        openingStock: 55,
        purchases: 55,
        sales: 45,
        adjustments: -3, // Faulty
        currentStock: 62,
        reorderLevel: 40,
        unitCost: 2800,
        status: 'adequate',
      },
      {
        id: 'HOSE-STANDARD',
        name: 'Gas Hoses',
        category: 'accessory',
        openingStock: 48,
        purchases: 45,
        sales: 38,
        adjustments: -2,
        currentStock: 53,
        reorderLevel: 35,
        unitCost: 1200,
        status: 'adequate',
      },
    ]

    // Update stock status based on reorder levels
    sampleStock.forEach((item) => {
      if (item.currentStock <= item.reorderLevel * 0.5) {
        item.status = 'critical'
      } else if (item.currentStock <= item.reorderLevel) {
        item.status = 'low'
      } else {
        item.status = 'adequate'
      }
    })

    setStockItems(sampleStock)
    setLoading(false)
  }, [stationId, month, year])

  // Calculate monthly summary
  const monthlySummary = useMemo((): SummaryItem[] => {
    const cylinderItems = stockItems.filter((item) => item.category === 'cylinder')
    const accessoryItems = stockItems.filter((item) => item.category === 'accessory')

    const criticalItems = stockItems.filter((item) => item.status === 'critical')
    const lowItems = stockItems.filter((item) => item.status === 'low')

    const totalPurchaseValue = stockItems.reduce(
      (sum, item) => sum + item.purchases * item.unitCost,
      0
    )

    const totalStockValue = stockItems.reduce(
      (sum, item) => sum + item.currentStock * item.unitCost,
      0
    )

    return [
      {
        label: 'Total Items Tracked',
        value: stockItems.length,
        format: 'number',
        description: `${cylinderItems.length} cylinder types, ${accessoryItems.length} accessories`,
      },
      {
        label: 'Items Needing Reorder',
        value: criticalItems.length + lowItems.length,
        format: 'number',
        highlight: criticalItems.length > 0 ? 'danger' : lowItems.length > 0 ? 'warning' : 'success',
        description: `${criticalItems.length} critical, ${lowItems.length} low`,
      },
      {
        label: 'Total Purchases This Month',
        value: totalPurchaseValue,
        format: 'currency',
        description: 'Value of accessories purchased',
      },
      {
        label: 'Current Stock Value',
        value: totalStockValue,
        format: 'currency',
        description: 'Total value of inventory on hand',
      },
    ]
  }, [stockItems])

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  const getStatusBadge = (status: AccessoryStockItem['status']) => {
    const styles = {
      adequate: 'bg-green-100 text-green-800',
      low: 'bg-amber-100 text-amber-800',
      critical: 'bg-red-100 text-red-800',
    }

    const labels = {
      adequate: 'Adequate',
      low: 'Low Stock',
      critical: 'Critical',
    }

    const icons = {
      adequate: null,
      low: <AlertTriangle className="w-3 h-3" />,
      critical: <AlertTriangle className="w-3 h-3" />,
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    )
  }

  const getStockChangeIndicator = (opening: number, current: number) => {
    const change = current - opening
    if (change === 0) return null

    return change > 0 ? (
      <span className="inline-flex items-center gap-1 text-xs text-green-600">
        <TrendingUp className="w-3 h-3" />
        +{change}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs text-red-600">
        <TrendingDown className="w-3 h-3" />
        {change}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
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
          <Package className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accessories Inventory</h1>
            <p className="text-sm text-gray-500">
              Cylinder and accessory stock levels and movements
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Inventory Summary"
          subtitle="Stock levels and alerts for the month"
          items={monthlySummary}
          icon={<Package className="w-6 h-6" />}
        />

        {/* Critical/Low Stock Alerts */}
        {stockItems.filter((item) => item.status !== 'adequate').length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">
                  Stock Reorder Alerts:
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  {stockItems
                    .filter((item) => item.status !== 'adequate')
                    .map((item) => (
                      <li key={item.id}>
                        <strong>{item.name}</strong>: {item.currentStock} units (Reorder at:{' '}
                        {item.reorderLevel})
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Stock Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Stock Levels</h2>
            <p className="text-sm text-gray-500 mt-1">
              Current inventory levels and monthly movements
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Item
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Opening
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Purchases
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Sales
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Adjustments
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase bg-blue-50">
                    Current Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Reorder Level
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockItems.map((item) => {
                  const stockValue = item.currentStock * item.unitCost

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{item.category}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.openingStock}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.purchases > 0 ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Plus className="w-3 h-3" />
                            {item.purchases}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.sales > 0 ? (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <Minus className="w-3 h-3" />
                            {item.sales}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.adjustments !== 0 ? (
                          <span
                            className={`inline-flex items-center gap-1 ${
                              item.adjustments > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {item.adjustments > 0 ? (
                              <Plus className="w-3 h-3" />
                            ) : (
                              <Minus className="w-3 h-3" />
                            )}
                            {Math.abs(item.adjustments)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center bg-blue-50">
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-semibold text-blue-900">
                            {item.currentStock}
                          </div>
                          {getStockChangeIndicator(item.openingStock, item.currentStock)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {item.reorderLevel}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {item.unitCost > 0 ? formatNGN(item.unitCost) : '—'}
                        </div>
                        {stockValue > 0 && (
                          <div className="text-xs text-gray-500">{formatNGN(stockValue)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">Inventory Guidelines:</h3>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Empty Cylinders:</strong> Track separately from filled cylinders for accurate
              inventory
            </li>
            <li>
              <strong>Filled Cylinders:</strong> Represent customer-ready inventory (empty cylinders
              + LPG)
            </li>
            <li>
              <strong>Adjustments:</strong> Record gains (+) from refilling, losses (-) from
              damage/spoilage
            </li>
            <li>
              <strong>Reorder Alerts:</strong> Place orders when stock reaches reorder level to
              avoid stockouts
            </li>
            <li>Regular physical counts should match system records for accurate reconciliation</li>
            <li>Damaged or faulty items should be recorded as adjustments with notes</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
