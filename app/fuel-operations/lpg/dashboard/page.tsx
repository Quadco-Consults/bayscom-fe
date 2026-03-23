'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MonthScopeBar } from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import {
  Flame,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Receipt,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
} from 'lucide-react'
import { formatNGN, formatKg } from '@/utils/fuel-format'

interface DashboardKPIs {
  // Sales
  totalRevenue: number
  lpgSold: number
  accessoriesSold: number

  // Inventory
  lpgStock: number
  cylinderStock: number
  lowStockItems: number

  // Financial
  netProfit: number
  profitMargin: number
  totalExpenses: number

  // Status
  daysInMonth: number
  daysRecorded: number
  pendingPurchases: number
}

/**
 * LPG Section - Dashboard Page
 *
 * Demonstrates:
 * - Key performance indicators (KPIs)
 * - Quick stats and metrics
 * - Recent activity summary
 * - Navigation to all LPG modules
 * - Visual performance indicators
 */
export default function LPGDashboardPage() {
  const { config, getStation, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Load dashboard KPIs
  useEffect(() => {
    setLoading(true)

    // Sample data (in production, this would aggregate from all modules)
    const daysInMonth = new Date(year, month, 0).getDate()
    const data: DashboardKPIs = {
      // Sales
      totalRevenue: 6095000,
      lpgSold: 7250,
      accessoriesSold: 125, // Total accessories

      // Inventory
      lpgStock: 5750,
      cylinderStock: 237, // Total cylinders (filled)
      lowStockItems: 2,

      // Financial
      netProfit: -2357600, // Loss
      profitMargin: -38.7,
      totalExpenses: 910000,

      // Status
      daysInMonth,
      daysRecorded: 3, // Sample data for 3 days
      pendingPurchases: 2,
    }

    setKpis(data)
    setLoading(false)
  }, [stationId, month, year])

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  // Quick links to modules
  const quickLinks = [
    {
      title: 'Daily Sales',
      href: '/fuel-operations/lpg/daily-sales',
      icon: Flame,
      description: 'Record daily pump readings',
      color: 'orange',
    },
    {
      title: 'Purchases',
      href: '/fuel-operations/lpg/purchases',
      icon: ShoppingCart,
      description: 'Track LPG & accessory purchases',
      color: 'blue',
    },
    {
      title: 'Inventory',
      href: '/fuel-operations/lpg/accessories',
      icon: Package,
      description: 'Cylinder & accessory stock',
      color: 'purple',
    },
    {
      title: 'Expenses',
      href: '/fuel-operations/lpg/expenses',
      icon: Receipt,
      description: 'Operating expenses',
      color: 'red',
    },
    {
      title: 'P&L Statement',
      href: '/fuel-operations/lpg/pl-statement',
      icon: DollarSign,
      description: 'Profit & loss analysis',
      color: 'green',
    },
    {
      title: 'Reconciliation',
      href: '/fuel-operations/lpg/reconciliation',
      icon: ClipboardCheck,
      description: 'Month-end reconciliation',
      color: 'teal',
    },
  ]

  const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    teal: 'bg-teal-100 text-teal-600',
  }

  if (loading || !kpis) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const completionPercentage = (kpis.daysRecorded / kpis.daysInMonth) * 100
  const isProfitable = kpis.netProfit > 0

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
        />

        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LPG Operations Dashboard</h1>
            <p className="text-sm text-gray-500">
              Overview of LPG section performance for{' '}
              {new Intl.DateTimeFormat('en-NG', { month: 'long', year: 'numeric' }).format(
                new Date(year, month - 1, 1)
              )}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {(kpis.lowStockItems > 0 || kpis.pendingPurchases > 0 || !isProfitable) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">Attention Required:</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  {kpis.lowStockItems > 0 && (
                    <li>
                      {kpis.lowStockItems} inventory item{kpis.lowStockItems > 1 ? 's' : ''} need
                      reordering
                    </li>
                  )}
                  {kpis.pendingPurchases > 0 && (
                    <li>
                      {kpis.pendingPurchases} pending purchase{kpis.pendingPurchases > 1 ? 's' : ''}{' '}
                      with outstanding payments
                    </li>
                  )}
                  {!isProfitable && (
                    <li>
                      Operating at a loss this month ({kpis.profitMargin.toFixed(1)}% margin) -
                      review pricing and expenses
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNGN(kpis.totalRevenue)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {completionPercentage.toFixed(0)}% of month recorded
            </div>
          </div>

          {/* LPG Sold */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">LPG Sold</span>
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatKg(kpis.lpgSold)}</div>
            <div className="text-xs text-gray-500 mt-1">{kpis.accessoriesSold} accessories sold</div>
          </div>

          {/* Current Stock */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Stock</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatKg(kpis.lpgStock)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {kpis.cylinderStock} cylinders available
              {kpis.lowStockItems > 0 && ` · ${kpis.lowStockItems} low`}
            </div>
          </div>

          {/* Net Profit */}
          <div className={`border rounded-lg p-5 ${isProfitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Net Profit</span>
              {isProfitable ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
              {isProfitable ? formatNGN(kpis.netProfit) : `(${formatNGN(Math.abs(kpis.netProfit))})`}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {kpis.profitMargin.toFixed(1)}% margin
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Month Recording Progress</span>
            <span className="text-sm text-gray-600">
              {kpis.daysRecorded} / {kpis.daysInMonth} days
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-600 h-3 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        colorClasses[link.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500">{link.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-medium text-green-600">
                  {formatNGN(kpis.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Operating Expenses</span>
                <span className="text-sm font-medium text-red-600">
                  {formatNGN(kpis.totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Net Result</span>
                <span className={`text-sm font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                  {isProfitable ? formatNGN(kpis.netProfit) : `(${formatNGN(Math.abs(kpis.netProfit))})`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Inventory Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">LPG in Stock</span>
                <span className="text-sm font-medium text-gray-900">{formatKg(kpis.lpgStock)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cylinders (Filled)</span>
                <span className="text-sm font-medium text-gray-900">{kpis.cylinderStock} units</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Items Need Reorder</span>
                <span className={`text-sm font-bold ${kpis.lowStockItems > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {kpis.lowStockItems > 0 ? `${kpis.lowStockItems} items` : 'All adequate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        {kpis.daysRecorded === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-blue-900 mb-3">Getting Started</h3>
            <p className="text-sm text-blue-800 mb-3">
              No records found for this month. Start by recording daily sales and purchases:
            </p>
            <div className="flex gap-3">
              <Link
                href="/fuel-operations/lpg/daily-sales"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
              >
                Record Daily Sales
              </Link>
              <Link
                href="/fuel-operations/lpg/purchases"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Add Purchase
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
