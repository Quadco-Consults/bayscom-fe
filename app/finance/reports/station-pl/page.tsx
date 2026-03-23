'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Download, Building2, TrendingUp, TrendingDown, DollarSign, Filter } from 'lucide-react'

interface StationPL {
  stationId: string
  stationName: string
  location: string
  // Revenue
  fuelRevenue: number
  lubricantRevenue: number
  otherRevenue: number
  totalRevenue: number
  // Direct Costs
  fuelCost: number
  lubricantCost: number
  operatingCost: number
  totalDirectCost: number
  // Gross Profit
  grossProfit: number
  grossMargin: number
  // Operating Expenses
  salaries: number
  utilities: number
  maintenance: number
  depreciation: number
  otherExpenses: number
  totalOperatingExpenses: number
  // Net Profit
  netProfit: number
  netMargin: number
}

const mockStationPL: StationPL[] = [
  {
    stationId: '1',
    stationName: 'Abuja Station',
    location: 'Wuse II, Abuja',
    fuelRevenue: 95000000,
    lubricantRevenue: 8500000,
    otherRevenue: 2500000,
    totalRevenue: 106000000,
    fuelCost: 78000000,
    lubricantCost: 6500000,
    operatingCost: 3000000,
    totalDirectCost: 87500000,
    grossProfit: 18500000,
    grossMargin: 17.5,
    salaries: 4500000,
    utilities: 1200000,
    maintenance: 800000,
    depreciation: 500000,
    otherExpenses: 1000000,
    totalOperatingExpenses: 8000000,
    netProfit: 10500000,
    netMargin: 9.9,
  },
  {
    stationId: '2',
    stationName: 'Lagos Station',
    location: 'Lagos Island',
    fuelRevenue: 125000000,
    lubricantRevenue: 12000000,
    otherRevenue: 3000000,
    totalRevenue: 140000000,
    fuelCost: 102000000,
    lubricantCost: 9000000,
    operatingCost: 4000000,
    totalDirectCost: 115000000,
    grossProfit: 25000000,
    grossMargin: 17.9,
    salaries: 6000000,
    utilities: 1500000,
    maintenance: 1000000,
    depreciation: 600000,
    otherExpenses: 1200000,
    totalOperatingExpenses: 10300000,
    netProfit: 14700000,
    netMargin: 10.5,
  },
  {
    stationId: '3',
    stationName: 'Kano Station',
    location: 'Kano Central',
    fuelRevenue: 72000000,
    lubricantRevenue: 6000000,
    otherRevenue: 1500000,
    totalRevenue: 79500000,
    fuelCost: 59000000,
    lubricantCost: 4500000,
    operatingCost: 2200000,
    totalDirectCost: 65700000,
    grossProfit: 13800000,
    grossMargin: 17.4,
    salaries: 3500000,
    utilities: 900000,
    maintenance: 600000,
    depreciation: 400000,
    otherExpenses: 800000,
    totalOperatingExpenses: 6200000,
    netProfit: 7600000,
    netMargin: 9.6,
  },
  {
    stationId: '4',
    stationName: 'Port Harcourt Station',
    location: 'Port Harcourt',
    fuelRevenue: 88000000,
    lubricantRevenue: 7500000,
    otherRevenue: 2000000,
    totalRevenue: 97500000,
    fuelCost: 72000000,
    lubricantCost: 5800000,
    operatingCost: 2800000,
    totalDirectCost: 80600000,
    grossProfit: 16900000,
    grossMargin: 17.3,
    salaries: 4000000,
    utilities: 1100000,
    maintenance: 700000,
    depreciation: 500000,
    otherExpenses: 900000,
    totalOperatingExpenses: 7200000,
    netProfit: 9700000,
    netMargin: 10.0,
  },
  {
    stationId: '5',
    stationName: 'Kaduna Station',
    location: 'Kaduna',
    fuelRevenue: 65000000,
    lubricantRevenue: 5000000,
    otherRevenue: 1200000,
    totalRevenue: 71200000,
    fuelCost: 53000000,
    lubricantCost: 3800000,
    operatingCost: 2000000,
    totalDirectCost: 58800000,
    grossProfit: 12400000,
    grossMargin: 17.4,
    salaries: 3200000,
    utilities: 800000,
    maintenance: 500000,
    depreciation: 350000,
    otherExpenses: 700000,
    totalOperatingExpenses: 5550000,
    netProfit: 6850000,
    netMargin: 9.6,
  },
]

export default function StationPLReportPage() {
  const [stations] = useState<StationPL[]>(mockStationPL)
  const [period, setPeriod] = useState('2025-Q1')

  // Calculate totals
  const totals: StationPL = {
    stationId: 'total',
    stationName: 'Total - All Stations',
    location: '',
    fuelRevenue: stations.reduce((s, st) => s + st.fuelRevenue, 0),
    lubricantRevenue: stations.reduce((s, st) => s + st.lubricantRevenue, 0),
    otherRevenue: stations.reduce((s, st) => s + st.otherRevenue, 0),
    totalRevenue: stations.reduce((s, st) => s + st.totalRevenue, 0),
    fuelCost: stations.reduce((s, st) => s + st.fuelCost, 0),
    lubricantCost: stations.reduce((s, st) => s + st.lubricantCost, 0),
    operatingCost: stations.reduce((s, st) => s + st.operatingCost, 0),
    totalDirectCost: stations.reduce((s, st) => s + st.totalDirectCost, 0),
    grossProfit: stations.reduce((s, st) => s + st.grossProfit, 0),
    grossMargin: 0,
    salaries: stations.reduce((s, st) => s + st.salaries, 0),
    utilities: stations.reduce((s, st) => s + st.utilities, 0),
    maintenance: stations.reduce((s, st) => s + st.maintenance, 0),
    depreciation: stations.reduce((s, st) => s + st.depreciation, 0),
    otherExpenses: stations.reduce((s, st) => s + st.otherExpenses, 0),
    totalOperatingExpenses: stations.reduce((s, st) => s + st.totalOperatingExpenses, 0),
    netProfit: stations.reduce((s, st) => s + st.netProfit, 0),
    netMargin: 0,
  }

  totals.grossMargin = (totals.grossProfit / totals.totalRevenue) * 100
  totals.netMargin = (totals.netProfit / totals.totalRevenue) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const exportToCSV = () => {
    const headers = [
      'Station', 'Location', 'Revenue', 'Direct Costs', 'Gross Profit', 'Gross Margin %',
      'Operating Expenses', 'Net Profit', 'Net Margin %'
    ]
    const rows = stations.map(s => [
      s.stationName, s.location, s.totalRevenue, s.totalDirectCost, s.grossProfit, s.grossMargin,
      s.totalOperatingExpenses, s.netProfit, s.netMargin
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `station-pl-${period}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Filling Station P&L Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Profit & Loss analysis by filling station location
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2025-Q1">Q1 2025</option>
              <option value="2024-Q4">Q4 2024</option>
              <option value="2024-Q3">Q3 2024</option>
            </select>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">{stations.length} stations</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Gross Profit</p>
              <DollarSign className="w-5 h-5" style={{ color: '#8B1538' }} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.grossProfit)}</p>
            <p className="text-xs text-gray-500 mt-1">{totals.grossMargin.toFixed(1)}% margin</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Operating Expenses</p>
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalOperatingExpenses)}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.netProfit)}</p>
            <p className="text-xs text-gray-500 mt-1">{totals.netMargin.toFixed(1)}% margin</p>
          </div>
        </div>

        {/* P&L Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Direct Costs</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">GP %</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">OPEX</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">NP %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map(station => (
                  <tr key={station.stationId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{station.stationName}</div>
                          <div className="text-xs text-gray-500">{station.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(station.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(station.totalDirectCost)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(station.grossProfit)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {station.grossMargin.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(station.totalOperatingExpenses)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                      {formatCurrency(station.netProfit)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                      {station.netMargin.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">TOTAL</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(totals.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(totals.totalDirectCost)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(totals.grossProfit)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {totals.grossMargin.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(totals.totalOperatingExpenses)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                    {formatCurrency(totals.netProfit)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                    {totals.netMargin.toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Performance Ranking */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Ranking</h3>
          <div className="space-y-3">
            {[...stations]
              .sort((a, b) => b.netProfit - a.netProfit)
              .map((station, index) => (
                <div key={station.stationId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{station.stationName}</div>
                      <div className="text-xs text-gray-500">{station.netMargin.toFixed(1)}% net margin</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(station.netProfit)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
