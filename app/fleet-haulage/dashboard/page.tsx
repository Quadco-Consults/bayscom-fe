'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ProductBadge, TripStatusBadge } from '@/components/fleet/shared'
import { useFleetConfig } from '@/contexts/FleetConfigContext'
import {
  Truck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  Activity,
  Plus,
  ArrowRight,
  FileText,
  BarChart3,
} from 'lucide-react'
import { formatNGN, formatRoute } from '@/utils/fleet-format'

interface DashboardKPIs {
  totalTrips: number
  tripsThisMonth: number
  totalRevenue: number
  totalExpenses: number
  netPL: number
  avgPLPerTrip: number
  profitableTrips: number
  activeTrucks: number
}

interface RecentTrip {
  id: string
  date: string
  truckRegNo: string
  product: 'PMS' | 'AGO' | 'DPK'
  loadingDepot: string
  dischargeLocation: string
  litresDelivered: number
  revenue: number
  expenses: number
  netPL: number
}

/**
 * Fleet & Haulage - Dashboard Page
 *
 * Overview of fleet operations with KPIs and recent activity
 */
export default function FleetHaulageDashboardPage() {
  const { config } = useFleetConfig()
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // Sample data (in production, this would come from API)
    const sampleKPIs: DashboardKPIs = {
      totalTrips: 145,
      tripsThisMonth: 12,
      totalRevenue: 48500000,
      totalExpenses: 42300000,
      netPL: 6200000,
      avgPLPerTrip: 516667,
      profitableTrips: 10,
      activeTrucks: config.trucks.filter((t) => t.active).length,
    }

    const sampleTrips: RecentTrip[] = [
      {
        id: 'TRIP-001',
        date: new Date().toISOString(),
        truckRegNo: 'T9829LA',
        product: 'PMS',
        loadingDepot: 'Warri Depot',
        dischargeLocation: 'Kano',
        litresDelivered: 31500,
        revenue: 1197000,
        expenses: 890000,
        netPL: 307000,
      },
      {
        id: 'TRIP-002',
        date: new Date(Date.now() - 86400000).toISOString(),
        truckRegNo: 'AA897HH',
        product: 'AGO',
        loadingDepot: 'Warri Depot',
        dischargeLocation: 'FCT',
        litresDelivered: 28000,
        revenue: 980000,
        expenses: 850000,
        netPL: 130000,
      },
      {
        id: 'TRIP-003',
        date: new Date(Date.now() - 172800000).toISOString(),
        truckRegNo: 'T9829LA',
        product: 'DPK',
        loadingDepot: 'Warri Depot',
        dischargeLocation: 'Kaduna',
        litresDelivered: 30000,
        revenue: 1080000,
        expenses: 920000,
        netPL: 160000,
      },
    ]

    setKpis(sampleKPIs)
    setRecentTrips(sampleTrips)
    setLoading(false)
  }, [config.trucks])

  const quickLinks = [
    {
      title: 'New Trip',
      href: '/fleet-haulage/new-trip',
      icon: Plus,
      description: 'Record a new haulage trip',
      color: 'blue',
    },
    {
      title: 'Trip Log',
      href: '/fleet-haulage/trip-log',
      icon: FileText,
      description: 'View all trips history',
      color: 'green',
    },
    {
      title: 'Truck Fleet',
      href: '/fleet-haulage/trucks',
      icon: Truck,
      description: 'Manage trucks and performance',
      color: 'orange',
    },
    {
      title: 'P&L Summary',
      href: '/fleet-haulage/pl-summary',
      icon: BarChart3,
      description: 'Financial performance',
      color: 'purple',
    },
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  if (loading || !kpis) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fleet dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const isProfitable = kpis.netPL > 0
  const profitMargin = (kpis.netPL / kpis.totalRevenue) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet & Haulage Dashboard</h1>
            <p className="text-sm text-gray-500">
              Overview of truck fleet operations and performance
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Total Trips */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Trips</span>
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpis.totalTrips}</div>
            <div className="text-xs text-gray-500 mt-1">{kpis.tripsThisMonth} this month</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNGN(kpis.totalRevenue)}</div>
            <div className="text-xs text-gray-500 mt-1">All-time earnings</div>
          </div>

          {/* Net P&L */}
          <div className={`border rounded-lg p-5 ${isProfitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Net P&L</span>
              {isProfitable ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
              {formatNGN(Math.abs(kpis.netPL))}
            </div>
            <div className="text-xs text-gray-600 mt-1">{profitMargin.toFixed(1)}% margin</div>
          </div>

          {/* Active Trucks */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Trucks</span>
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpis.activeTrucks}</div>
            <div className="text-xs text-gray-500 mt-1">
              {kpis.profitableTrips} / {kpis.tripsThisMonth} profitable
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div
                      className={`p-3 rounded-lg w-fit ${
                        colorClasses[link.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500">{link.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
            <Link
              href="/fleet-haulage/trip-log"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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
                    Litres
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Revenue
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
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      <Link href={`/fleet-haulage/trips/${trip.id}`}>{trip.id}</Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(trip.date).toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
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
                      {trip.litresDelivered.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {formatNGN(trip.revenue)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TripStatusBadge netPL={trip.netPL} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      <span className={trip.netPL > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatNGN(Math.abs(trip.netPL))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Trips</span>
                <span className="text-sm font-medium text-gray-900">{kpis.tripsThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profitable Trips</span>
                <span className="text-sm font-medium text-green-600">{kpis.profitableTrips}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg P&L per Trip</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNGN(kpis.avgPLPerTrip)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Fleet Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Trucks</span>
                <span className="text-sm font-medium text-gray-900">{config.trucks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Trucks</span>
                <span className="text-sm font-medium text-green-600">{kpis.activeTrucks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Decommissioned</span>
                <span className="text-sm font-medium text-gray-400">
                  {config.trucks.length - kpis.activeTrucks}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
