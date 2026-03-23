/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { Plus, Save, Lock, Unlock, Calendar } from 'lucide-react'

interface DailySale {
  date: string
  openingMeter: number
  closingMeter: number
  litresSold: number
  pricePerLitre: number
  revenue: number
  cashSales: number
  creditSales: number
  note: string
}

export default function AGODailySalesPage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [isLocked, setIsLocked] = useState(false)

  // Mock sales data
  const [sales, setSales] = useState<DailySale[]>(
    Array.from({ length: 31 }, (_, i) => ({
      date: new Date(year, month, i + 1).toISOString().split('T')[0],
      openingMeter: i === 0 ? 125000 : 125000 + i * 1850,
      closingMeter: 125000 + (i + 1) * 1850,
      litresSold: 1850,
      pricePerLitre: 850,
      revenue: 1850 * 850,
      cashSales: 1850 * 850 * 0.7,
      creditSales: 1850 * 850 * 0.3,
      note: '',
    }))
  )

  const updateSale = (index: number, field: keyof DailySale, value: any) => {
    if (isLocked) return

    const updated = [...sales]
    updated[index] = { ...updated[index], [field]: value }

    // Auto-calculate litres sold
    if (field === 'openingMeter' || field === 'closingMeter') {
      updated[index].litresSold = updated[index].closingMeter - updated[index].openingMeter
    }

    // Auto-calculate revenue
    if (field === 'litresSold' || field === 'pricePerLitre') {
      updated[index].revenue = updated[index].litresSold * updated[index].pricePerLitre
    }

    setSales(updated)
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
  const formatLitres = (litres: number) => `${litres.toLocaleString('en-NG')} L`

  // Calculate totals
  const totals = sales.reduce(
    (acc, sale) => ({
      litresSold: acc.litresSold + sale.litresSold,
      revenue: acc.revenue + sale.revenue,
      cashSales: acc.cashSales + sale.cashSales,
      creditSales: acc.creditSales + sale.creditSales,
    }),
    { litresSold: 0, revenue: 0, cashSales: 0, creditSales: 0 }
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AGO Daily Sales</h1>
          <p className="text-sm text-gray-500 mt-1">Record daily diesel sales and meter readings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Month Scope Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                disabled={isLocked}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
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
                disabled={isLocked}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
              isLocked
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Locked
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unlocked
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total AGO Sold</p>
          <p className="text-2xl font-bold text-teal-600">{formatLitres(totals.litresSold)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatNaira(totals.revenue)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Cash Sales</p>
          <p className="text-2xl font-bold text-green-600">{formatNaira(totals.cashSales)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Credit Sales</p>
          <p className="text-2xl font-bold text-amber-600">{formatNaira(totals.creditSales)}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opening Meter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Meter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Litres Sold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/L</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale, index) => (
                <tr key={index} className={isLocked ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {new Date(sale.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sale.openingMeter}
                      onChange={(e) => updateSale(index, 'openingMeter', Number(e.target.value))}
                      disabled={isLocked}
                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sale.closingMeter}
                      onChange={(e) => updateSale(index, 'closingMeter', Number(e.target.value))}
                      disabled={isLocked}
                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-teal-600">{formatLitres(sale.litresSold)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sale.pricePerLitre}
                      onChange={(e) => updateSale(index, 'pricePerLitre', Number(e.target.value))}
                      disabled={isLocked}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatNaira(sale.revenue)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sale.cashSales}
                      onChange={(e) => updateSale(index, 'cashSales', Number(e.target.value))}
                      disabled={isLocked}
                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sale.creditSales}
                      onChange={(e) => updateSale(index, 'creditSales', Number(e.target.value))}
                      disabled={isLocked}
                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={sale.note}
                      onChange={(e) => updateSale(index, 'note', e.target.value)}
                      disabled={isLocked}
                      placeholder="Optional"
                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">
                  TOTALS
                </td>
                <td className="px-4 py-3 text-sm font-bold text-teal-600">{formatLitres(totals.litresSold)}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{formatNaira(totals.revenue)}</td>
                <td className="px-4 py-3 text-sm font-bold text-green-600">{formatNaira(totals.cashSales)}</td>
                <td className="px-4 py-3 text-sm font-bold text-amber-600">{formatNaira(totals.creditSales)}</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
