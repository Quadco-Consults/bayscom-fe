'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  TrendingUp,
  Droplet,
  DollarSign,
  Package,
  FileText,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react'

export default function AGOPeddlingDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Mock KPI data
  const kpis = {
    revenue: 4850000,
    agoSold: 12450, // litres
    stockLevel: 8200, // litres
    netProfit: 285000,
  }

  // Progress tracking
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
  const recordedDays = 22
  const progress = (recordedDays / daysInMonth) * 100

  // Reorder alerts
  const alerts = [
    { type: 'stock', message: 'AGO stock at 45% capacity - consider reorder', severity: 'warning' },
  ]

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
  const formatLitres = (litres: number) => `${litres.toLocaleString('en-NG')} L`

  const modules = [
    {
      title: 'Daily Sales',
      description: 'Record daily AGO sales to vendors and customers',
      href: '/fuel-operations/ago-peddling/daily-sales',
      icon: Droplet,
      color: 'teal',
    },
    {
      title: 'Purchases',
      description: 'Track AGO refills and supplier payments',
      href: '/fuel-operations/ago-peddling/purchases',
      icon: Truck,
      color: 'blue',
    },
    {
      title: 'Inventory',
      description: 'Monitor AGO stock levels and movements',
      href: '/fuel-operations/ago-peddling/inventory',
      icon: Package,
      color: 'purple',
    },
    {
      title: 'Expenses',
      description: 'Manage operating expenses',
      href: '/fuel-operations/ago-peddling/expenses',
      icon: DollarSign,
      color: 'orange',
    },
    {
      title: 'P&L Statement',
      description: 'View profit and loss analysis',
      href: '/fuel-operations/ago-peddling/pl-statement',
      icon: FileText,
      color: 'green',
    },
    {
      title: 'Reconciliation',
      description: 'Month-end stock and financial reconciliation',
      href: '/fuel-operations/ago-peddling/reconciliation',
      icon: FileText,
      color: 'indigo',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AGO Peddling Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage diesel peddling operations and stock</p>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2026, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* Recording Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Monthly Recording Progress</h3>
            <p className="text-xs text-gray-500 mt-1">
              {recordedDays} of {daysInMonth} days recorded
            </p>
          </div>
          <span className="text-2xl font-bold text-teal-600">{progress.toFixed(0)}%</span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ${
              progress >= 90 ? 'bg-green-600' : progress >= 70 ? 'bg-blue-600' : 'bg-amber-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                alert.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 mt-0.5 ${
                  alert.severity === 'warning' ? 'text-amber-600' : 'text-red-600'
                }`}
              />
              <p
                className={`text-sm ${
                  alert.severity === 'warning' ? 'text-amber-900' : 'text-red-900'
                }`}
              >
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-teal-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatNaira(kpis.revenue)}</p>
          <p className="text-xs text-gray-500 mt-2">Month to date</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">AGO Sold</p>
          <p className="text-2xl font-bold text-gray-900">{formatLitres(kpis.agoSold)}</p>
          <p className="text-xs text-gray-500 mt-2">Month to date</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Current Stock</p>
          <p className="text-2xl font-bold text-gray-900">{formatLitres(kpis.stockLevel)}</p>
          <p className="text-xs text-gray-500 mt-2">45% of capacity</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-green-600">{formatNaira(kpis.netProfit)}</p>
          <p className="text-xs text-gray-500 mt-2">5.9% margin</p>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link
                key={module.title}
                href={module.href}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-teal-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 bg-${module.color}-100 rounded-lg`}>
                    <Icon className={`h-6 w-6 text-${module.color}-600`} />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-500">{module.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
