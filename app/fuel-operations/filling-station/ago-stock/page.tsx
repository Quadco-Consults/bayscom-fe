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
import { Droplet, Download, Printer } from 'lucide-react'

/**
 * Filling Station - AGO Stock Reconciliation Page
 *
 * Demonstrates DippingTable reusability for different products.
 * Same component, different product code and configuration.
 */
export default function AGOStockReconciliationPage() {
  const { config, getStation, getProductPrice, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [dippingRows, setDippingRows] = useState<DippingRow[]>([])
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Get AGO price for current month
  const agoPrice = getProductPrice('AGO', stationId, month, year)

  // Generate daily rows for the month
  useEffect(() => {
    setLoading(true)

    const daysInMonth = new Date(year, month, 0).getDate()
    const rows: DippingRow[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = date.toISOString().split('T')[0]

      rows.push({
        id: `AGO-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        date: dateStr,
        dayNumber: day,
        openingStock: day === 1 ? 15000 : 0,
        waybillQty: 0,
        transitLoss: 0,
        sales: 0,
        physicalDipping: 0,
        pumpPrice: agoPrice,
      })
    }

    // Add sample data for demonstration (AGO typically has different volumes than PMS)
    if (rows.length > 0) {
      rows[0].waybillQty = 40000
      rows[0].transitLoss = 180
      rows[0].sales = 18200
      rows[0].physicalDipping = 36600

      if (rows.length > 1) {
        rows[1].openingStock = 36600
        rows[1].waybillQty = 0
        rows[1].transitLoss = 0
        rows[1].sales = 14800
        rows[1].physicalDipping = 21800

        if (rows.length > 2) {
          rows[2].openingStock = 21800
          rows[2].waybillQty = 40000
          rows[2].transitLoss = 190
          rows[2].sales = 16500
          rows[2].physicalDipping = 45100
        }
      }
    }

    setDippingRows(rows)
    setLoading(false)
  }, [stationId, month, year, agoPrice])

  // Handle row updates
  const handleRowUpdate = (rowId: string, field: keyof DippingRow, value: number) => {
    setDippingRows((prevRows) =>
      prevRows.map((row, index) => {
        if (row.id !== rowId) return row

        const updatedRow = { ...row, [field]: value }

        // If updating physical dipping, propagate to next day's opening stock
        if (field === 'physicalDipping' && index < prevRows.length - 1) {
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

    const totalOverageValue = totalOverageShortage * agoPrice

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
        label: 'AGO Pump Price',
        value: agoPrice,
        format: 'currency',
        description: 'Current selling price per litre',
      },
    ]
  }, [dippingRows, agoPrice])

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
          <Droplet className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AGO Stock Reconciliation</h1>
            <p className="text-sm text-gray-500">
              Daily dipping and stock movement tracking for Automotive Gas Oil (Diesel)
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Monthly Summary"
          subtitle="Computed totals for the selected month"
          items={monthlySummary}
          icon={<Droplet className="w-6 h-6" />}
        />

        {/* Daily Dipping Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Daily Stock Reconciliation
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter daily opening stock, deliveries, sales, and physical dipping readings.
              Auto-calculated fields are shown in italic.
            </p>
          </div>

          <DippingTable
            product="AGO"
            unit="Ltrs"
            month={month}
            year={year}
            rows={dippingRows}
            onRowUpdate={handleRowUpdate}
            isLocked={isLocked}
            tankCapacity={station?.products.find((p) => p.code === 'AGO')?.tankCapacity}
          />
        </div>

        {/* Instructions */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-teal-900 mb-2">AGO-Specific Notes:</h3>
          <ul className="text-sm text-teal-800 space-y-1 list-disc list-inside">
            <li>
              AGO typically has higher delivery volumes than PMS due to commercial demand
            </li>
            <li>Monitor transit loss carefully - diesel is prone to theft during transport</li>
            <li>
              Daily sales fluctuate based on generator fuel demand and peddling operations
            </li>
            <li>
              Some AGO may be transferred to the peddling pool - record this as internal
              transfer, not sales
            </li>
            <li>Tank capacity for AGO is typically 40,000 litres at this station</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
