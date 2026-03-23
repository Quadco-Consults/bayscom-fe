'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Download, AlertCircle, TrendingUp, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface AgingBucket {
  customerId: string
  customerName: string
  creditRating: 'excellent' | 'good' | 'fair' | 'poor'
  current: number  // 0-30 days
  days30: number   // 31-60 days
  days60: number   // 61-90 days
  days90: number   // 91+ days
  total: number
}

const mockAgingData: AgingBucket[] = [
  {
    customerId: '1',
    customerName: 'ABC Transport Ltd',
    creditRating: 'excellent',
    current: 15000000,
    days30: 8000000,
    days60: 0,
    days90: 0,
    total: 23000000,
  },
  {
    customerId: '2',
    customerName: 'XYZ Logistics',
    creditRating: 'good',
    current: 5000000,
    days30: 3000000,
    days60: 2000000,
    days90: 500000,
    total: 10500000,
  },
  {
    customerId: '3',
    customerName: 'Delta Haulage Co.',
    creditRating: 'fair',
    current: 8000000,
    days30: 5000000,
    days60: 3000000,
    days90: 2000000,
    total: 18000000,
  },
  {
    customerId: '4',
    customerName: 'Quick Delivery Services',
    creditRating: 'good',
    current: 2000000,
    days30: 1500000,
    days60: 0,
    days90: 0,
    total: 3500000,
  },
  {
    customerId: '5',
    customerName: 'Northern Express',
    creditRating: 'poor',
    current: 0,
    days30: 1000000,
    days60: 1500000,
    days90: 1000000,
    total: 3500000,
  },
]

export default function ARAgingPage() {
  const [agingData] = useState<AgingBucket[]>(mockAgingData)

  // Calculate totals
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

  const getCreditRatingBadge = (rating: string) => {
    const styles = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[rating as keyof typeof styles]}`}>
        {rating.charAt(0).toUpperCase() + rating.slice(1)}
      </span>
    )
  }

  const exportToCSV = () => {
    const headers = ['Customer', 'Current', '31-60 Days', '61-90 Days', '90+ Days', 'Total']
    const rows = agingData.map(d => [
      d.customerName,
      d.current,
      d.days30,
      d.days60,
      d.days90,
      d.total,
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ar-aging-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts Receivable Aging Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Analyze overdue customer balances by aging periods
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Current (0-30)</p>
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalCurrent)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(totalCurrent, grandTotal)}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">31-60 Days</p>
              <div className="p-2 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(total30)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(total30, grandTotal)}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">61-90 Days</p>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(total60)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(total60, grandTotal)}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">90+ Days</p>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-600">{formatCurrency(total90)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatPercentage(total90, grandTotal)}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-4 h-4" style={{ color: '#8B1538' }} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">{agingData.length} customers</p>
          </div>
        </div>

        {/* Aging Chart Visual */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Current (0-30 days)</span>
                <span className="font-medium text-gray-900">{formatCurrency(totalCurrent)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: formatPercentage(totalCurrent, grandTotal) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">31-60 days</span>
                <span className="font-medium text-gray-900">{formatCurrency(total30)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{ width: formatPercentage(total30, grandTotal) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">61-90 days</span>
                <span className="font-medium text-gray-900">{formatCurrency(total60)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-orange-500"
                  style={{ width: formatPercentage(total60, grandTotal) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">90+ days (Critical)</span>
                <span className="font-medium text-red-600">{formatCurrency(total90)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{ width: formatPercentage(total90, grandTotal) }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Aging Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Current
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    31-60 Days
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    61-90 Days
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    90+ Days
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agingData.map(customer => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/finance/accounts-receivable/customers/${customer.customerId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {customer.customerName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(customer.current)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(customer.days30)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-orange-600">
                      {formatCurrency(customer.days60)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-red-600">
                      {formatCurrency(customer.days90)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(customer.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getCreditRatingBadge(customer.creditRating)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(totalCurrent)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(total30)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-orange-600">
                    {formatCurrency(total60)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                    {formatCurrency(total90)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(grandTotal)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Items */}
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-orange-900">Collections Required</h4>
              <p className="text-sm text-orange-700 mt-1">
                {formatCurrency(total60 + total90)} is over 60 days old and requires immediate attention.
                Consider sending dunning letters to customers with overdue balances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
