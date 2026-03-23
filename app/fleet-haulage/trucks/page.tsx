'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useFleetConfig } from '@/contexts/FleetConfigContext'
import { Truck, TrendingUp, TrendingDown, Activity, DollarSign, Fuel } from 'lucide-react'
import { formatNGN, formatLitres } from '@/utils/fleet-format'
import { fleetCalc } from '@/utils/fleet-calcs'

interface TripRecord {
  id: string
  date: string
  truckId: string
  truckRegNo: string
  product: 'PMS' | 'AGO' | 'DPK'
  deliveredLitres: number
  revenue: number
  totalExpenses: number
  netPL: number
}

interface TruckPerformance {
  truckId: string
  regNo: string
  driver: string
  active: boolean
  tripCount: number
  totalRevenue: number
  totalExpenses: number
  netPL: number
  totalLitres: number
  gainfulTrips: number
  avgPLPerTrip: number
  utilizationRate: number
}

/**
 * Fleet & Haulage - Truck Fleet Page
 *
 * Per-truck performance analysis
 * - View all trucks with performance metrics
 * - Compare truck profitability
 * - Identify top and underperforming trucks
 * - Quick access to truck-specific trip history
 */
export default function TruckFleetPage() {
  const { config } = useFleetConfig()
  const [trips, setTrips] = useState<TripRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all') // 'all', 'active', 'inactive'

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

  // Calculate per-truck performance
  const truckPerformance = useMemo(() => {
    return config.trucks.map((truck): TruckPerformance => {
      const truckTrips = trips.filter((t) => t.truckId === truck.id)

      return {
        truckId: truck.id,
        regNo: truck.regNo,
        driver: truck.driver,
        active: truck.active,
        tripCount: fleetCalc.truckTripCount(truck.id, trips),
        totalRevenue: fleetCalc.truckRevenue(truck.id, trips),
        totalExpenses: fleetCalc.truckExpenses(truck.id, trips),
        netPL: fleetCalc.truckPL(truck.id, trips),
        totalLitres: fleetCalc.truckLitres(truck.id, trips),
        gainfulTrips: truckTrips.filter((t) => t.netPL >= 0).length,
        avgPLPerTrip: truckTrips.length > 0 ? fleetCalc.truckPL(truck.id, trips) / truckTrips.length : 0,
        utilizationRate: truckTrips.length > 0 ? (truckTrips.length / trips.length) * 100 : 0,
      }
    })
  }, [config.trucks, trips])

  // Filtered trucks
  const filteredTrucks = useMemo(() => {
    let filtered = truckPerformance

    if (filterStatus === 'active') {
      filtered = filtered.filter((t) => t.active)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((t) => !t.active)
    }

    // Sort by net P&L (descending)
    return filtered.sort((a, b) => b.netPL - a.netPL)
  }, [truckPerformance, filterStatus])

  // Fleet-wide summary
  const fleetSummary = useMemo(() => {
    const activeTrucks = truckPerformance.filter((t) => t.active)
    const totalPL = activeTrucks.reduce((sum, t) => sum + t.netPL, 0)
    const totalRevenue = activeTrucks.reduce((sum, t) => sum + t.totalRevenue, 0)
    const totalTrips = activeTrucks.reduce((sum, t) => sum + t.tripCount, 0)

    return {
      totalTrucks: config.trucks.length,
      activeTrucks: activeTrucks.length,
      totalPL,
      totalRevenue,
      totalTrips,
      topPerformer: activeTrucks.length > 0 ? activeTrucks.reduce((top, t) => t.netPL > top.netPL ? t : top) : null,
    }
  }, [truckPerformance, config.trucks.length])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading truck fleet...</p>
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
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Truck Fleet Performance</h1>
              <p className="text-sm text-gray-500">Per-truck analysis and metrics</p>
            </div>
          </div>
        </div>

        {/* Fleet Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Trucks</span>
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{fleetSummary.totalTrucks}</div>
            <div className="text-xs text-gray-500 mt-1">
              {fleetSummary.activeTrucks} active
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Trips</span>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{fleetSummary.totalTrips}</div>
            <div className="text-xs text-gray-500 mt-1">All-time completed</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fleet Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNGN(fleetSummary.totalRevenue)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Combined earnings</div>
          </div>

          <div
            className={`border rounded-lg p-5 ${
              fleetSummary.totalPL >= 0
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fleet Net P&L</span>
              {fleetSummary.totalPL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div
              className={`text-2xl font-bold ${
                fleetSummary.totalPL >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {formatNGN(Math.abs(fleetSummary.totalPL))}
            </div>
            <div className="text-xs text-gray-600 mt-1">Combined P&L</div>
          </div>
        </div>

        {/* Top Performer Highlight */}
        {fleetSummary.topPerformer && fleetSummary.topPerformer.tripCount > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">🏆 Top Performer</p>
                  <p className="text-xl font-bold text-green-900">
                    {fleetSummary.topPerformer.regNo}
                  </p>
                  <p className="text-sm text-green-700">
                    Driver: {fleetSummary.topPerformer.driver}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700 mb-1">Net P&L</p>
                <p className="text-3xl font-bold text-green-900">
                  {formatNGN(fleetSummary.topPerformer.netPL)}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {fleetSummary.topPerformer.tripCount} trips | {fleetSummary.topPerformer.gainfulTrips} gainful
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Trucks</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Truck Performance Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Truck
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Trips
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Litres Hauled
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
                    Avg P&L/Trip
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Gainful
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrucks.map((truck) => (
                  <tr
                    key={truck.truckId}
                    className={`hover:bg-gray-50 ${!truck.active ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{truck.regNo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{truck.driver}</td>
                    <td className="px-4 py-3 text-center">
                      {truck.active ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                      {truck.tripCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {truck.totalLitres > 0 ? formatLitres(truck.totalLitres) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {truck.totalRevenue > 0 ? formatNGN(truck.totalRevenue) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {truck.totalExpenses > 0 ? formatNGN(truck.totalExpenses) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      {truck.tripCount > 0 ? (
                        <span className={truck.netPL >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatNGN(Math.abs(truck.netPL))}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {truck.tripCount > 0 ? formatNGN(Math.abs(truck.avgPLPerTrip)) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {truck.tripCount > 0 ? (
                        <span className="text-green-600 font-medium">
                          {truck.gainfulTrips} / {truck.tripCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
