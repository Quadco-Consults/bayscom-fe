/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import {
  Calendar,
  Download,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Droplet,
} from 'lucide-react'
import { tankFormat } from '@/utils/tank-calcs'

interface ProductVarianceSummary {
  product: 'PMS' | 'AGO' | 'DPK'
  dischargeCount: number
  totalWaybillQty: number
  totalTruckQty: number
  totalTankReceived: number
  totalGrossShortage: number
  totalAllowedLoss: number
  totalNetShortage: number
  avgPricePerLitre: number
  shortageValue: number
}

export default function VarianceSummaryPage() {
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')

  // Mock variance summary data
  const productSummaries: ProductVarianceSummary[] = [
    {
      product: 'PMS',
      dischargeCount: 12,
      totalWaybillQty: 528000,
      totalTruckQty: 526450,
      totalTankReceived: 514820,
      totalGrossShortage: 11630,
      totalAllowedLoss: 1579, // 0.3%
      totalNetShortage: 10051,
      avgPricePerLitre: 750,
      shortageValue: 7538250,
    },
    {
      product: 'AGO',
      dischargeCount: 8,
      totalWaybillQty: 264000,
      totalTruckQty: 263750,
      totalTankReceived: 262980,
      totalGrossShortage: 770,
      totalAllowedLoss: 791, // 0.3%
      totalNetShortage: 0,
      avgPricePerLitre: 850,
      shortageValue: 0,
    },
    {
      product: 'DPK',
      dischargeCount: 4,
      totalWaybillQty: 78000,
      totalTruckQty: 77920,
      totalTankReceived: 77600,
      totalGrossShortage: 320,
      totalAllowedLoss: 234, // 0.3%
      totalNetShortage: 86,
      avgPricePerLitre: 680,
      shortageValue: 58480,
    },
  ]

  const overallSummary = {
    totalDischarges: productSummaries.reduce((sum, p) => sum + p.dischargeCount, 0),
    totalWaybillQty: productSummaries.reduce((sum, p) => sum + p.totalWaybillQty, 0),
    totalTruckQty: productSummaries.reduce((sum, p) => sum + p.totalTruckQty, 0),
    totalReceived: productSummaries.reduce((sum, p) => sum + p.totalTankReceived, 0),
    totalGrossShortage: productSummaries.reduce((sum, p) => sum + p.totalGrossShortage, 0),
    totalNetShortage: productSummaries.reduce((sum, p) => sum + p.totalNetShortage, 0),
    totalShortageValue: productSummaries.reduce((sum, p) => sum + p.shortageValue, 0),
  }

  const handleExportPDF = () => {
    alert('Export PDF functionality - in production, generate detailed variance report PDF')
  }

  const getProductColor = (prod: 'PMS' | 'AGO' | 'DPK') => {
    switch (prod) {
      case 'PMS':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100' }
      case 'AGO':
        return { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-100' }
      case 'DPK':
        return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-100' }
    }
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const getPeriodLabel = () => {
    if (periodType === 'custom') {
      if (customDateFrom && customDateTo) {
        return `${new Date(customDateFrom).toLocaleDateString('en-NG', { dateStyle: 'medium' })} - ${new Date(customDateTo).toLocaleDateString('en-NG', { dateStyle: 'medium' })}`
      }
      return 'Custom Period'
    }
    if (periodType === 'month') {
      return new Date(selectedYear, selectedMonth).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
    }
    if (periodType === 'year') {
      return selectedYear.toString()
    }
    return periodType.charAt(0).toUpperCase() + periodType.slice(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Variance Summary Report</h1>
          <p className="text-sm text-gray-500 mt-1">Aggregate discharge variance analysis by period</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF Report
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Report Period</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {periodType === 'month' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2026, i).toLocaleString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </>
          )}

          {periodType === 'year' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          )}

          {periodType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Reporting Period:</strong> {getPeriodLabel()}
          </p>
        </div>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Total Discharges</p>
              <p className="text-2xl font-bold text-gray-900">{overallSummary.totalDischarges}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Total Received</p>
              <p className="text-lg font-bold text-green-600">{tankFormat.litres(overallSummary.totalReceived)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Net Shortage</p>
              <p className="text-lg font-bold text-red-600">{tankFormat.litres(overallSummary.totalNetShortage)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Shortage Value</p>
              <p className="text-lg font-bold text-amber-600">{formatNaira(overallSummary.totalShortageValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Variance by Product */}
      <div className="space-y-4">
        {productSummaries.map((summary) => {
          const colors = getProductColor(summary.product)
          const shortageRate = ((summary.totalNetShortage / summary.totalTruckQty) * 100).toFixed(3)
          const hasExcessLoss = summary.totalNetShortage > 0

          return (
            <div
              key={summary.product}
              className={`border-2 ${colors.border} ${colors.bg} rounded-lg overflow-hidden`}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-white border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-bold ${colors.badge} ${colors.text} rounded`}>
                      {summary.product}
                    </span>
                    <span className="text-sm text-gray-600">{summary.dischargeCount} discharges</span>
                  </div>
                  {hasExcessLoss && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Excess Loss: {shortageRate}%</span>
                    </div>
                  )}
                  {!hasExcessLoss && (
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm font-semibold">Within Tolerance</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Data */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Waybill Qty</p>
                    <p className="text-lg font-semibold text-gray-900">{tankFormat.litres(summary.totalWaybillQty)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Truck Chart Total</p>
                    <p className="text-lg font-semibold text-gray-900">{tankFormat.litres(summary.totalTruckQty)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Tank Received</p>
                    <p className="text-lg font-semibold text-green-600">
                      {tankFormat.litres(summary.totalTankReceived)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Gross Shortage</p>
                    <p className="text-lg font-semibold text-amber-600">
                      {tankFormat.litres(summary.totalGrossShortage)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-xs text-gray-600 uppercase mb-1">Allowed Transit Loss (0.3%)</p>
                    <p className="text-base font-semibold text-green-600">
                      {tankFormat.litres(summary.totalAllowedLoss)}
                    </p>
                  </div>
                  <div className={`rounded-lg p-4 ${hasExcessLoss ? 'bg-red-50' : 'bg-green-50'}`}>
                    <p className={`text-xs uppercase mb-1 ${hasExcessLoss ? 'text-red-700' : 'text-green-700'}`}>
                      Net Chargeable Shortage
                    </p>
                    <p className={`text-xl font-bold ${hasExcessLoss ? 'text-red-600' : 'text-green-600'}`}>
                      {hasExcessLoss ? tankFormat.litres(summary.totalNetShortage) : 'None'}
                    </p>
                  </div>
                  <div className={`rounded-lg p-4 ${hasExcessLoss ? 'bg-amber-50' : 'bg-gray-50'}`}>
                    <p className={`text-xs uppercase mb-1 ${hasExcessLoss ? 'text-amber-700' : 'text-gray-600'}`}>
                      Financial Impact
                    </p>
                    <p className={`text-xl font-bold ${hasExcessLoss ? 'text-amber-600' : 'text-gray-900'}`}>
                      {formatNaira(summary.shortageValue)}
                    </p>
                    {hasExcessLoss && (
                      <p className="text-xs text-amber-600 mt-1">
                        @ {formatNaira(summary.avgPricePerLitre)}/L
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall Totals */}
      <div className="bg-gray-900 text-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Period Totals - {getPeriodLabel()}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Total Waybill Qty</p>
            <p className="text-xl font-bold">{tankFormat.litres(overallSummary.totalWaybillQty)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Total Truck Qty</p>
            <p className="text-xl font-bold">{tankFormat.litres(overallSummary.totalTruckQty)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Total Received</p>
            <p className="text-xl font-bold text-green-400">{tankFormat.litres(overallSummary.totalReceived)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Total Gross Shortage</p>
            <p className="text-xl font-bold text-amber-400">{tankFormat.litres(overallSummary.totalGrossShortage)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between bg-red-900/30 rounded-lg p-4">
            <div>
              <p className="text-sm text-red-300 mb-1">Total Net Chargeable Shortage</p>
              <p className="text-2xl font-bold text-red-400">{tankFormat.litres(overallSummary.totalNetShortage)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
          <div className="flex items-center justify-between bg-amber-900/30 rounded-lg p-4">
            <div>
              <p className="text-sm text-amber-300 mb-1">Total Financial Impact</p>
              <p className="text-2xl font-bold text-amber-400">{formatNaira(overallSummary.totalShortageValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Variance Calculation Notes</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>
                <strong>Gross Shortage</strong> = Truck Chart Total - Tank Received
              </li>
              <li>
                <strong>Allowed Transit Loss</strong> = 0.3% of Truck Chart Total (industry standard)
              </li>
              <li>
                <strong>Net Chargeable Shortage</strong> = Gross Shortage - Allowed Transit Loss (if positive)
              </li>
              <li>
                <strong>Financial Impact</strong> = Net Chargeable Shortage × Average Price per Litre
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
