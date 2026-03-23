'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react'

export default function AGOPLStatementPage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  // Mock P&L data
  const plData = {
    revenue: {
      agoSales: 48622500,
      total: 48622500,
    },
    cogs: {
      openingStock: 9000000,
      purchases: 47355000,
      closingStock: 15174000,
      total: 41181000,
    },
    grossProfit: 7441500,
    operatingExpenses: {
      driverSalaries: 450000,
      vehicleMaintenance: 280000,
      fuel: 185000,
      rentUtilities: 120000,
      marketingPromotion: 95000,
      administrative: 65000,
      miscellaneous: 48000,
      total: 1243000,
    },
    netProfit: 6198500,
  }

  const grossProfitMargin = (plData.grossProfit / plData.revenue.total) * 100
  const netProfitMargin = (plData.netProfit / plData.revenue.total) * 100

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AGO P&L Statement</h1>
          <p className="text-sm text-gray-500 mt-1">Profit and loss analysis for diesel peddling operations</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>

      {/* Month Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2026, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm opacity-90">Gross Profit</p>
          </div>
          <p className="text-3xl font-bold mb-1">{formatNaira(plData.grossProfit)}</p>
          <p className="text-sm opacity-90">{grossProfitMargin.toFixed(1)}% margin</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm opacity-90">Net Profit</p>
          </div>
          <p className="text-3xl font-bold mb-1">{formatNaira(plData.netProfit)}</p>
          <p className="text-sm opacity-90">{netProfitMargin.toFixed(1)}% margin</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-5 w-5" />
            <p className="text-sm opacity-90">Total Expenses</p>
          </div>
          <p className="text-3xl font-bold mb-1">{formatNaira(plData.operatingExpenses.total)}</p>
          <p className="text-sm opacity-90">Operating costs</p>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Profit & Loss Statement - {new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Revenue Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Revenue</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">AGO Sales</span>
                <span className="text-sm font-medium text-gray-900">{formatNaira(plData.revenue.agoSales)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Total Revenue</span>
                <span className="text-base font-bold text-teal-600">{formatNaira(plData.revenue.total)}</span>
              </div>
            </div>
          </div>

          {/* COGS Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Cost of Goods Sold</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Opening Stock</span>
                <span className="text-sm font-medium text-gray-900">{formatNaira(plData.cogs.openingStock)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Add: Purchases</span>
                <span className="text-sm font-medium text-gray-900">{formatNaira(plData.cogs.purchases)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Less: Closing Stock</span>
                <span className="text-sm font-medium text-gray-900">({formatNaira(plData.cogs.closingStock)})</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Total COGS</span>
                <span className="text-base font-bold text-red-600">{formatNaira(plData.cogs.total)}</span>
              </div>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex items-center justify-between py-2 bg-teal-50 px-4 rounded-lg">
              <span className="text-base font-bold text-gray-900">Gross Profit</span>
              <div className="text-right">
                <span className="text-xl font-bold text-teal-600">{formatNaira(plData.grossProfit)}</span>
                <p className="text-xs text-teal-700 mt-1">{grossProfitMargin.toFixed(1)}% margin</p>
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Operating Expenses</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Driver Salaries</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.driverSalaries)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Vehicle Maintenance</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.vehicleMaintenance)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Fuel (for delivery vehicle)</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.fuel)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Rent & Utilities</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.rentUtilities)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Marketing & Promotion</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.marketingPromotion)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Administrative Costs</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.administrative)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Miscellaneous</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNaira(plData.operatingExpenses.miscellaneous)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Total Operating Expenses</span>
                <span className="text-base font-bold text-red-600">
                  {formatNaira(plData.operatingExpenses.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex items-center justify-between py-3 bg-green-50 px-4 rounded-lg">
              <span className="text-lg font-bold text-gray-900">Net Profit</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">{formatNaira(plData.netProfit)}</span>
                <p className="text-sm text-green-700 mt-1">{netProfitMargin.toFixed(1)}% net margin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
