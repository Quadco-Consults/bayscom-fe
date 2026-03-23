'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ProductBadge, TripStatusBadge } from '@/components/fleet/shared'
import { useFleetConfig } from '@/contexts/FleetConfigContext'
import {
  FileText,
  Plus,
  Filter,
  Download,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { formatNGN, formatLitres, formatRoute } from '@/utils/fleet-format'
import { fleetCalc } from '@/utils/fleet-calcs'

interface TripRecord {
  id: string
  date: string
  truckId: string
  truckRegNo: string
  product: 'PMS' | 'AGO' | 'DPK'
  loadingDepot: string
  dischargeLocation: string
  loadedLitres: number
  deliveredLitres: number
  transitLossLitres: number
  transitLossPct: number
  ratePerLitre: number
  revenue: number
  totalExpenses: number
  netPL: number
  notes?: string
  createdAt: string
}

/**
 * Fleet & Haulage - Trip Log Page
 *
 * Comprehensive log of all haulage trips with filtering
 * - Filter by truck, product, date range, and P&L status
 * - Summary statistics
 * - Export functionality
 * - Click to view trip details
 */
export default function TripLogPage() {
  const { config } = useFleetConfig()
  const [trips, setTrips] = useState<TripRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [filterTruck, setFilterTruck] = useState<string>('all')
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all') // 'all', 'gain', 'loss'
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')

  // Load trips from localStorage
  useEffect(() => {
    setLoading(true)
    const savedTrips = localStorage.getItem('fleet-trips')
    if (savedTrips) {
      try {
        const parsedTrips = JSON.parse(savedTrips)
        setTrips(parsedTrips.sort((a: TripRecord, b: TripRecord) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      } catch (error) {
        console.error('Failed to parse saved trips:', error)
      }
    }
    setLoading(false)
  }, [])

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Truck filter
      if (filterTruck !== 'all' && trip.truckId !== filterTruck) return false

      // Product filter
      if (filterProduct !== 'all' && trip.product !== filterProduct) return false

      // Status filter
      if (filterStatus === 'gain' && trip.netPL < 0) return false
      if (filterStatus === 'loss' && trip.netPL >= 0) return false

      // Date range filter
      if (filterDateFrom && trip.date < filterDateFrom) return false
      if (filterDateTo && trip.date > filterDateTo) return false

      return true
    })
  }, [trips, filterTruck, filterProduct, filterStatus, filterDateFrom, filterDateTo])

  // Summary statistics
  const summary = useMemo(() => {
    const totalTrips = filteredTrips.length
    const totalRevenue = fleetCalc.fleetRevenue(filteredTrips)
    const totalExpenses = fleetCalc.fleetExpenses(filteredTrips)
    const netPL = fleetCalc.fleetNetPL(filteredTrips)
    const totalLitres = fleetCalc.fleetLitres(filteredTrips)
    const gainfulTrips = filteredTrips.filter((t) => t.netPL >= 0).length

    return {
      totalTrips,
      totalRevenue,
      totalExpenses,
      netPL,
      totalLitres,
      gainfulTrips,
      avgPL: totalTrips > 0 ? netPL / totalTrips : 0,
    }
  }, [filteredTrips])

  const handleExport = () => {
    // Convert to CSV
    const headers = [
      'Trip ID',
      'Date',
      'Truck',
      'Product',
      'Route',
      'Loaded (L)',
      'Delivered (L)',
      'Loss (%)',
      'Revenue',
      'Expenses',
      'Net P&L',
    ]

    const rows = filteredTrips.map((trip) => [
      trip.id,
      trip.date,
      trip.truckRegNo,
      trip.product,
      formatRoute(trip.loadingDepot, trip.dischargeLocation),
      trip.loadedLitres,
      trip.deliveredLitres,
      trip.transitLossPct.toFixed(2),
      trip.revenue,
      trip.totalExpenses,
      trip.netPL,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleet-trip-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilterTruck('all')
    setFilterProduct('all')
    setFilterStatus('all')
    setFilterDateFrom('')
    setFilterDateTo('')
  }

  const hasActiveFilters =
    filterTruck !== 'all' ||
    filterProduct !== 'all' ||
    filterStatus !== 'all' ||
    filterDateFrom ||
    filterDateTo

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip log...</p>
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
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trip Log</h1>
              <p className="text-sm text-gray-500">Complete history of all haulage trips</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <Link
              href="/fleet-haulage/new-trip"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Trips</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalTrips}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatNGN(summary.totalRevenue)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatNGN(summary.totalExpenses)}</p>
          </div>
          <div
            className={`border rounded-lg p-4 ${
              summary.netPL >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Net P&L</p>
            <p
              className={`text-2xl font-bold ${
                summary.netPL >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {formatNGN(Math.abs(summary.netPL))}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Gainful Trips</p>
            <p className="text-2xl font-bold text-green-600">
              {summary.gainfulTrips} / {summary.totalTrips}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {/* Truck Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Truck</label>
              <select
                value={filterTruck}
                onChange={(e) => setFilterTruck(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Trucks</option>
                {config.trucks.map((truck) => (
                  <option key={truck.id} value={truck.id}>
                    {truck.regNo}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Products</option>
                <option value="PMS">PMS</option>
                <option value="AGO">AGO</option>
                <option value="DPK">DPK</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Trips</option>
                <option value="gain">Gainful Only</option>
                <option value="loss">Loss Only</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Trip Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {filteredTrips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Trip ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Truck
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Route
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Delivered
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Expenses
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Net P&L
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        <Link href={`/fleet-haulage/trips/${trip.id}`}>{trip.id}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(trip.date).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {trip.truckRegNo}
                      </td>
                      <td className="px-4 py-3">
                        <ProductBadge product={trip.product} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {formatRoute(trip.loadingDepot, trip.dischargeLocation)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {trip.deliveredLitres.toLocaleString()}L
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatNGN(trip.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatNGN(trip.totalExpenses)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <TripStatusBadge netPL={trip.netPL} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        <span className={trip.netPL >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatNGN(Math.abs(trip.netPL))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">
                {hasActiveFilters ? 'No trips match your filters' : 'No trips recorded yet'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {hasActiveFilters
                  ? 'Try adjusting your filter criteria'
                  : 'Get started by recording your first haulage trip'}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/fleet-haulage/new-trip"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Record First Trip
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
