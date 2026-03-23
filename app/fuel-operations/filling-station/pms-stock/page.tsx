/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  DippingTable,
  DippingRow,
  MonthScopeBar,
  InventorySummaryCard,
  SummaryItem,
} from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { FileText, Download, Printer } from 'lucide-react'

/**
 * Filling Station - PMS Stock Reconciliation Page
 *
 * Demonstrates the complete refactored architecture:
 * - MonthScopeBar for station/month selection
 * - DippingTable for daily stock reconciliation
 * - InventorySummaryCard for monthly totals
 * - Context providers for configuration and scope
 * - Auto-calculations using fuel-calcs utility
 */
export default function PMSStockReconciliationPage() {
  const { config, getStation, getProductPrice, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [dippingRows, setDippingRows] = useState<DippingRow[]>([])
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Get PMS price for current month
  const pmsPrice = getProductPrice('PMS', stationId, month, year)

  // Generate daily rows for the month
  useEffect(() => {
    setLoading(true)

    // Get number of days in month
    const daysInMonth = new Date(year, month, 0).getDate()

    // Generate rows for each day
    const rows: DippingRow[] = []
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = date.toISOString().split('T')[0]

      rows.push({
        id: `PMS-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        date: dateStr,
        dayNumber: day,
        openingStock: day === 1 ? 12000 : 0, // First day opening stock
        waybillQty: 0,
        transitLoss: 0,
        sales: 0,
        physicalDipping: 0,
        pumpPrice: pmsPrice,
      })
    }

    // Add some sample data for demonstration
    if (rows.length > 0) {
      rows[0].waybillQty = 33000
      rows[0].transitLoss = 150
      rows[0].sales = 14300
      rows[0].physicalDipping = 30500

      if (rows.length > 1) {
        rows[1].openingStock = 30500
        rows[1].waybillQty = 0
        rows[1].transitLoss = 0
        rows[1].sales = 12100
        rows[1].physicalDipping = 18400
      }

      if (rows.length > 2) {
        rows[2].openingStock = 18400
        rows[2].waybillQty = 33000
        rows[2].transitLoss = 165
        rows[2].sales = 15200
        rows[2].physicalDipping = 36000
      }
    }

    setDippingRows(rows)
    setLoading(false)
  }, [stationId, month, year, pmsPrice])

  // Handle row updates
  const handleRowUpdate = (rowId: string, field: keyof DippingRow, value: number) => {
    setDippingRows((prevRows) =>
      prevRows.map((row, index) => {
        if (row.id !== rowId) return row

        const updatedRow = { ...row, [field]: value }

        // If updating opening stock, propagate to next day if it's the physical dipping
        if (field === 'physicalDipping' && index < prevRows.length - 1) {
          // The next day's opening stock should be this day's physical dipping
          prevRows[index + 1].openingStock = value
        }

        return updatedRow
      })
    )
  }

  // Calculate monthly summary
  const monthlySummary = useMemo((): SummaryItem[] => {
    const totalWaybill = dippingRows.reduce((sum, r) => sum + r.waybillQty, 0)
    const totalTransitLoss = dippingRows.reduce((sum, r) => sum + r.transitLoss, 0)
    const totalSales = dippingRows.reduce((sum, r) => sum + r.sales, 0)

    // Calculate total overage/shortage
    let totalOverageShortage = 0
    dippingRows.forEach((row, index) => {
      const actualReceipt = row.waybillQty - row.transitLoss
      const closingBook = row.openingStock + actualReceipt - row.sales
      const diff = row.physicalDipping - closingBook

      const prevDiff =
        index > 0
          ? (() => {
              const prevRow = dippingRows[index - 1]
              const prevReceipt = prevRow.waybillQty - prevRow.transitLoss
              const prevClosingBook = prevRow.openingStock + prevReceipt - prevRow.sales
              return prevRow.physicalDipping - prevClosingBook
            })()
          : 0

      const dailyOverage = diff - prevDiff
      totalOverageShortage += dailyOverage
    })

    const totalOverageValue = totalOverageShortage * pmsPrice

    // Opening and closing stock
    const openingStock = dippingRows[0]?.openingStock || 0
    const closingStock = dippingRows[dippingRows.length - 1]?.physicalDipping || 0

    return [
      {
        label: 'Opening Stock',
        value: openingStock,
        format: 'litres',
        description: 'Stock at beginning of month',
      },
      {
        label: 'Total Deliveries',
        value: totalWaybill,
        format: 'litres',
        trend: 'neutral',
        description: 'Total waybill quantity received',
      },
      {
        label: 'Total Transit Loss',
        value: totalTransitLoss,
        format: 'litres',
        highlight: 'warning',
        description: 'Loss during transportation',
      },
      {
        label: 'Total Sales',
        value: totalSales,
        format: 'litres',
        description: 'Total volume sold',
      },
      {
        label: 'Closing Stock',
        value: closingStock,
        format: 'litres',
        description: 'Physical stock at end of month',
      },
      {
        label: 'Total Overage/Shortage',
        value: totalOverageShortage,
        format: 'litres',
        highlight:
          totalOverageShortage > 0
            ? 'success'
            : totalOverageShortage < 0
            ? 'danger'
            : undefined,
        description: 'Cumulative variance for the month',
      },
      {
        label: 'Overage/Shortage Value',
        value: totalOverageValue,
        format: 'currency',
        highlight:
          totalOverageValue > 0
            ? 'success'
            : totalOverageValue < 0
            ? 'danger'
            : undefined,
        description: 'Monetary value of variance',
      },
      {
        label: 'PMS Pump Price',
        value: pmsPrice,
        format: 'currency',
        description: 'Current selling price per litre',
      },
    ]
  }, [dippingRows, pmsPrice])

  // Get available stations for dropdown
  const fillingStations = config.stations.filter((s) => s.type === 'filling-station')

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stock reconciliation...</p>
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
          stations={fillingStations}
          onStationChange={setStation}
          onMonthChange={(m, y) => setMonthYear(m, y)}
          showLockToggle={false} // Set to true for admin users
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
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              PMS Stock Reconciliation
            </h1>
            <p className="text-sm text-gray-500">
              Daily dipping and stock movement tracking for Premium Motor Spirit
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Monthly Summary"
          subtitle="Computed totals for the selected month"
          items={monthlySummary}
          icon={<FileText className="w-6 h-6" />}
        />

        {/* Daily Dipping Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Daily Stock Reconciliation</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter daily opening stock, deliveries, sales, and physical dipping readings.
              Auto-calculated fields are shown in italic.
            </p>
          </div>

          <DippingTable
            product="PMS"
            unit="Ltrs"
            month={month}
            year={year}
            rows={dippingRows}
            onRowUpdate={handleRowUpdate}
            isLocked={isLocked}
            tankCapacity={station?.products.find((p) => p.code === 'PMS')?.tankCapacity}
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Click any editable field (with pencil icon) to update values</li>
            <li>Opening stock for each day = previous day's physical dipping</li>
            <li>Italic fields are auto-calculated and cannot be edited</li>
            <li>Green rows = overage (surplus stock), Red rows = shortage (deficit)</li>
            <li>Lock the month when reconciliation is complete and approved</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
