'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useFleetConfig } from '@/contexts/FleetConfigContext'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react'
import { formatNGN } from '@/utils/fleet-format'
import { fleetCalc } from '@/utils/fleet-calcs'

interface TripRecord {
  id: string
  date: string
  truckId: string
  product: 'PMS' | 'AGO' | 'DPK'
  revenue: number
  totalExpenses: number
  netPL: number
  expenses: { category: string; amount: number; description: string }[]
}

interface MonthlyPL {
  month: string
  year: number
  tripCount: number
  totalRevenue: number
  totalExpenses: number
  netPL: number
  margin: number
  gainfulTrips: number
  expensesByCategory: Record<string, number>
}

/**
 * Fleet & Haulage - P&L Summary Page
 *
 * Monthly Profit & Loss summary with expense breakdown
 * - Monthly aggregated P&L
 * - Expense breakdown by category
 * - Revenue and margin trends
 * - Export capability
 */
export default function FleetPLSummaryPage() {
  const { config } = useFleetConfig()
  const [trips, setTrips] = useState<TripRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  // Load trips from localStorage
  useEffect(() => {
    setLoading(true)
    const savedTrips = localStorage.getItem('fleet-trips')
    if (savedTrips) {
      try {
        setTrips(JSON.parse(savedTrips))
      } catch (error) {
        console.error('Failed to parse saved trips:', error)
      }
    }
    setLoading(false)
  }, [])

  // Get available years
  const availableYears = useMemo(() => {
    const years = new Set(trips.map((t) => new Date(t.date).getFullYear()))
    return Array.from(years).sort((a, b) => b - a)
  }, [trips])

  // Calculate monthly P&L
  const monthlyPL = useMemo(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    return months.map((month, index): MonthlyPL => {
      const monthTrips = trips.filter((t) => {
        const tripDate = new Date(t.date)
        return tripDate.getFullYear() === selectedYear && tripDate.getMonth() === index
      })

      const totalRevenue = fleetCalc.fleetRevenue(monthTrips)
      const totalExpenses = fleetCalc.fleetExpenses(monthTrips)
      const netPL = fleetCalc.fleetNetPL(monthTrips)

      // Calculate expense breakdown by category
      const expensesByCategory: Record<string, number> = {}
      monthTrips.forEach((trip) => {
        trip.expenses?.forEach((expense) => {
          expensesByCategory[expense.category] =
            (expensesByCategory[expense.category] || 0) + (expense.amount || 0)
        })
      })

      return {
        month,
        year: selectedYear,
        tripCount: monthTrips.length,
        totalRevenue,
        totalExpenses,
        netPL,
        margin: totalRevenue > 0 ? (netPL / totalRevenue) * 100 : 0,
        gainfulTrips: monthTrips.filter((t) => t.netPL >= 0).length,
        expensesByCategory,
      }
    })
  }, [trips, selectedYear])

  // Yearly totals
  const yearlyTotals = useMemo(() => {
    const yearTrips = trips.filter((t) => new Date(t.date).getFullYear() === selectedYear)
    const totalRevenue = fleetCalc.fleetRevenue(yearTrips)
    const totalExpenses = fleetCalc.fleetExpenses(yearTrips)
    const netPL = fleetCalc.fleetNetPL(yearTrips)

    return {
      tripCount: yearTrips.length,
      totalRevenue,
      totalExpenses,
      netPL,
      margin: totalRevenue > 0 ? (netPL / totalRevenue) * 100 : 0,
      gainfulTrips: yearTrips.filter((t) => t.netPL >= 0).length,
    }
  }, [trips, selectedYear])

  // Get top expense categories for the year
  const topExpenseCategories = useMemo(() => {
    const yearExpenses: Record<string, number> = {}

    monthlyPL.forEach((month) => {
      Object.entries(month.expensesByCategory).forEach(([category, amount]) => {
        yearExpenses[category] = (yearExpenses[category] || 0) + amount
      })
    })

    return Object.entries(yearExpenses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }, [monthlyPL])

  const handleExport = () => {
    const headers = [
      'Month',
      'Trips',
      'Revenue',
      'Expenses',
      'Net P&L',
      'Margin %',
      'Gainful Trips',
    ]

    const rows = monthlyPL.map((m) => [
      m.month,
      m.tripCount,
      m.totalRevenue,
      m.totalExpenses,
      m.netPL,
      m.margin.toFixed(2),
      `${m.gainfulTrips}/${m.tripCount}`,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleet-pl-summary-${selectedYear}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading P&L summary...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fleet P&L Summary</h1>
              <p className="text-sm text-gray-500">Monthly financial performance overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              )}
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Yearly Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600 mb-1">Total Trips ({selectedYear})</p>
            <p className="text-2xl font-bold text-gray-900">{yearlyTotals.tripCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {yearlyTotals.gainfulTrips} gainful ({yearlyTotals.tripCount > 0 ? ((yearlyTotals.gainfulTrips / yearlyTotals.tripCount) * 100).toFixed(0) : 0}%)
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNGN(yearlyTotals.totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Year-to-date earnings</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNGN(yearlyTotals.totalExpenses)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Year-to-date costs</p>
          </div>

          <div
            className={`border rounded-lg p-5 ${
              yearlyTotals.netPL >= 0
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Net P&L</p>
            <p
              className={`text-2xl font-bold ${
                yearlyTotals.netPL >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {formatNGN(Math.abs(yearlyTotals.netPL))}
            </p>
            <p className="text-xs text-gray-600 mt-1">{yearlyTotals.margin.toFixed(1)}% margin</p>
          </div>
        </div>

        {/* Top Expense Categories */}
        {topExpenseCategories.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top Expense Categories ({selectedYear})
            </h2>
            <div className="space-y-3">
              {topExpenseCategories.map(([category, amount]) => {
                const percentage =
                  yearlyTotals.totalExpenses > 0
                    ? (amount / yearlyTotals.totalExpenses) * 100
                    : 0
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatNGN(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Monthly P&L Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Month
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Trips
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Expenses
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Net P&L
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Margin
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Gainful
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyPL.map((month, index) => {
                  const prevMonth = index > 0 ? monthlyPL[index - 1] : null
                  const plTrend =
                    prevMonth && prevMonth.netPL !== 0
                      ? ((month.netPL - prevMonth.netPL) / Math.abs(prevMonth.netPL)) * 100
                      : 0

                  return (
                    <tr
                      key={month.month}
                      className={`hover:bg-gray-50 ${month.tripCount === 0 ? 'opacity-50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {month.tripCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {month.totalRevenue > 0 ? formatNGN(month.totalRevenue) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {month.totalExpenses > 0 ? formatNGN(month.totalExpenses) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {month.tripCount > 0 ? (
                          <span className={month.netPL >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatNGN(Math.abs(month.netPL))}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {month.tripCount > 0 ? `${month.margin.toFixed(1)}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {month.tripCount > 0 ? (
                          <span className="text-green-600 font-medium">
                            {month.gainfulTrips} / {month.tripCount}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {prevMonth && prevMonth.tripCount > 0 && month.tripCount > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            {plTrend > 0 ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">
                                  +{plTrend.toFixed(0)}%
                                </span>
                              </>
                            ) : plTrend < 0 ? (
                              <>
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-xs text-red-600 font-medium">
                                  {plTrend.toFixed(0)}%
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
