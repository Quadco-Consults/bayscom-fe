'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  LodgementTable,
  LodgementRow,
  MonthScopeBar,
  InventorySummaryCard,
  SummaryItem,
} from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { Banknote, Download, Printer, AlertCircle } from 'lucide-react'
import { calc } from '@/utils/fuel-calcs'

/**
 * Filling Station - Bank Lodgements Page
 *
 * Demonstrates:
 * - LodgementTable component
 * - Payment channel management
 * - Overlodged/Underlodged tracking
 * - Monthly summary calculations
 */
export default function BankLodgementsPage() {
  const { config, getStation, getPaymentChannels, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [lodgementRows, setLodgementRows] = useState<LodgementRow[]>([])
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)
  const paymentChannels = getPaymentChannels(stationId).map((c) => c.name)

  // Generate daily rows for the month
  useEffect(() => {
    setLoading(true)

    const daysInMonth = new Date(year, month, 0).getDate()
    const rows: LodgementRow[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = date.toISOString().split('T')[0]

      rows.push({
        id: `LOD-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        date: dateStr,
        dayNumber: day,
        expectedSales: 0, // Would come from sales register
        cash: 0,
        pos: 0,
        transfer: 0,
        opay: 0,
        palmpay: 0,
        moniepoint: 0,
      })
    }

    // Add sample data for demonstration
    if (rows.length > 0) {
      rows[0].expectedSales = 1249060
      rows[0].cash = 450000
      rows[0].pos = 380000
      rows[0].transfer = 220000
      rows[0].opay = 120000
      rows[0].palmpay = 80000

      if (rows.length > 1) {
        rows[1].expectedSales = 1105200
        rows[1].cash = 500000
        rows[1].pos = 350000
        rows[1].transfer = 250000
        rows[1].opay = 0
        rows[1].palmpay = 5200

        if (rows.length > 2) {
          rows[2].expectedSales = 987500
          rows[2].cash = 380000
          rows[2].pos = 290000
          rows[2].transfer = 200000
          rows[2].opay = 90000
          rows[2].palmpay = 30000
        }
      }
    }

    setLodgementRows(rows)
    setLoading(false)
  }, [stationId, month, year])

  // Handle row updates
  const handleRowUpdate = (rowId: string, channel: string, value: number) => {
    setLodgementRows((prevRows) =>
      prevRows.map((row) => (row.id === rowId ? { ...row, [channel]: value } : row))
    )
  }

  // Calculate monthly summary
  const monthlySummary = useMemo((): SummaryItem[] => {
    const totalExpectedSales = lodgementRows.reduce((sum, r) => sum + r.expectedSales, 0)

    // Calculate totals for each channel
    const channelTotals: Record<string, number> = {}
    paymentChannels.forEach((channel) => {
      const channelKey = channel.toLowerCase().replace(/\s+/g, '')
      channelTotals[channel] = lodgementRows.reduce(
        (sum, r) => sum + ((r[channelKey] as number) || 0),
        0
      )
    })

    // Total lodged across all channels
    const totalLodged = Object.values(channelTotals).reduce((sum, amt) => sum + amt, 0)

    // Difference (overlodged/underlodged)
    const difference = calc.lodgementDiff(totalLodged, totalExpectedSales)

    // Days with data
    const daysWithLodgements = lodgementRows.filter((r) =>
      paymentChannels.some((ch) => {
        const key = ch.toLowerCase().replace(/\s+/g, '')
        return (r[key] as number) > 0
      })
    ).length

    return [
      {
        label: 'Expected Sales (from register)',
        value: totalExpectedSales,
        format: 'currency',
        description: 'Total sales value for the period',
      },
      {
        label: 'Total Amount Lodged',
        value: totalLodged,
        format: 'currency',
        description: 'Sum of all payment channels',
      },
      {
        label: 'Lodgement Difference',
        value: Math.abs(difference),
        format: 'currency',
        highlight:
          Math.abs(difference) < 1000
            ? 'success'
            : difference > 0
            ? 'warning'
            : 'danger',
        description:
          difference > 0
            ? `Overlodged by ${Math.abs(difference).toLocaleString()}`
            : difference < 0
            ? `Underlodged by ${Math.abs(difference).toLocaleString()}`
            : 'Balanced',
      },
      {
        label: 'Days with Lodgements',
        value: daysWithLodgements,
        format: 'number',
        description: `Out of ${lodgementRows.length} days`,
      },
      ...Object.entries(channelTotals).map(([channel, total]) => ({
        label: channel,
        value: total,
        format: 'currency' as const,
        description: `${((total / totalLodged) * 100 || 0).toFixed(1)}% of total`,
      })),
    ]
  }, [lodgementRows, paymentChannels])

  // Get available stations
  const fillingStations = config.stations.filter((s) => s.type === 'filling-station')

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lodgements...</p>
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
          <Banknote className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bank Lodgements</h1>
            <p className="text-sm text-gray-500">
              Daily cash and electronic payment tracking
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Lodgement Summary"
          subtitle="Computed totals for the selected month"
          items={monthlySummary}
          icon={<Banknote className="w-6 h-6" />}
        />

        {/* Lodgement Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Daily Lodgement Register</h2>
            <p className="text-sm text-gray-500 mt-1">
              Record all bank deposits and electronic payments. Expected sales values come
              from the sales register.
            </p>
          </div>

          <LodgementTable
            month={month}
            year={year}
            rows={lodgementRows}
            paymentChannels={paymentChannels}
            onRowUpdate={handleRowUpdate}
            isLocked={isLocked}
            balanceThreshold={1000}
          />
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>
                  Expected sales values are automatically populated from the sales register
                </li>
                <li>
                  Green rows = Balanced (within ₦1,000), Amber = Overlodged, Red =
                  Underlodged
                </li>
                <li>
                  All lodgements must be reconciled before month-end closure
                </li>
                <li>
                  Large discrepancies (over ₦50,000) should be investigated immediately
                </li>
                <li>Payment channels can be configured in station settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
