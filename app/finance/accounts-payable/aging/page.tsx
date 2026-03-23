'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Download, AlertCircle, Users, DollarSign } from 'lucide-react'

interface APAgingBucket {
  vendorId: string
  vendorName: string
  current: number
  days30: number
  days60: number
  days90: number
  total: number
}

const mockAPAging: APAgingBucket[] = [
  {
    vendorId: '1',
    vendorName: 'NNPC - Fuel Supplier',
    current: 35000000,
    days30: 15000000,
    days60: 0,
    days90: 0,
    total: 50000000,
  },
  {
    vendorId: '2',
    vendorName: 'Tokheim - Equipment Supplier',
    current: 0,
    days30: 2500000,
    days60: 0,
    days90: 0,
    total: 2500000,
  },
  {
    vendorId: '3',
    vendorName: 'Maintenance Services Ltd',
    current: 1500000,
    days30: 800000,
    days60: 500000,
    days90: 0,
    total: 2800000,
  },
]

export default function APAgingPage() {
  const [agingData] = useState<APAgingBucket[]>(mockAPAging)

  const totalCurrent = agingData.reduce((sum, d) => sum + d.current, 0)
  const total30 = agingData.reduce((sum, d) => sum + d.days30, 0)
  const total60 = agingData.reduce((sum, d) => sum + d.days60, 0)
  const total90 = agingData.reduce((sum, d) => sum + d.days90, 0)
  const grandTotal = agingData.reduce((sum, d) => sum + d.total, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (amount: number, total: number) => {
    if (total === 0) return '0%'
    return `${((amount / total) * 100).toFixed(1)}%`
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts Payable Aging Report</h1>
            <p className="mt-1 text-sm text-gray-600">Track vendor payment obligations by aging</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Current (0-30)</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalCurrent)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(totalCurrent, grandTotal)}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">31-60 Days</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(total30)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(total30, grandTotal)}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">61-90 Days</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(total60)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(total60, grandTotal)}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">90+ Days</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(total90)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(total90, grandTotal)}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Payable</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">{agingData.length} vendors</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">31-60</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">61-90</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">90+</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agingData.map(vendor => (
                <tr key={vendor.vendorId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.vendorName}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(vendor.current)}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(vendor.days30)}</td>
                  <td className="px-6 py-4 text-right text-sm text-orange-600">{formatCurrency(vendor.days60)}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-red-600">{formatCurrency(vendor.days90)}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{formatCurrency(vendor.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(totalCurrent)}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(total30)}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-orange-600">{formatCurrency(total60)}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-red-600">{formatCurrency(total90)}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Payment Planning</h4>
              <p className="text-sm text-blue-700 mt-1">
                Prioritize payments based on vendor terms and relationships. {formatCurrency(total30)} is due within 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
