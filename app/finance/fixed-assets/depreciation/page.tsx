'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ArrowLeft, Calendar, Play, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { DepreciationSchedule } from '@/lib/types'
import Link from 'next/link'

const mockDepreciationSchedules: DepreciationSchedule[] = [
  {
    id: '1',
    assetId: '1',
    year: 2025,
    period: 3,
    periodStart: '2025-03-01',
    periodEnd: '2025-03-31',
    openingValue: 74365833,
    depreciationAmount: 715833,
    accumulatedDepreciation: 11350000,
    closingValue: 73650000,
    status: 'posted',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01',
  },
  {
    id: '2',
    assetId: '2',
    year: 2025,
    period: 3,
    periodStart: '2025-03-01',
    periodEnd: '2025-03-31',
    openingValue: 83712500,
    depreciationAmount: 712500,
    accumulatedDepreciation: 12000000,
    closingValue: 83000000,
    status: 'posted',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01',
  },
  {
    id: '3',
    assetId: '3',
    year: 2025,
    period: 3,
    periodStart: '2025-03-01',
    periodEnd: '2025-03-31',
    openingValue: 3187500,
    depreciationAmount: 37500,
    accumulatedDepreciation: 350000,
    closingValue: 3150000,
    status: 'posted',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01',
  },
  {
    id: '4',
    assetId: '1',
    year: 2025,
    period: 4,
    periodStart: '2025-04-01',
    periodEnd: '2025-04-30',
    openingValue: 73650000,
    depreciationAmount: 715833,
    accumulatedDepreciation: 12065833,
    closingValue: 72934167,
    status: 'scheduled',
    createdAt: '2025-03-22',
    updatedAt: '2025-03-22',
  },
  {
    id: '5',
    assetId: '2',
    year: 2025,
    period: 4,
    periodStart: '2025-04-01',
    periodEnd: '2025-04-30',
    openingValue: 83000000,
    depreciationAmount: 712500,
    accumulatedDepreciation: 12712500,
    closingValue: 82287500,
    status: 'scheduled',
    createdAt: '2025-03-22',
    updatedAt: '2025-03-22',
  },
]

export default function DepreciationSchedulePage() {
  const [schedules] = useState<DepreciationSchedule[]>(mockDepreciationSchedules)
  const [periodFilter, setPeriodFilter] = useState<string>('2025-03')

  const filteredSchedules = schedules.filter(s => {
    const periodKey = `${s.year}-${String(s.period).padStart(2, '0')}`
    return periodFilter === 'all' || periodKey === periodFilter
  })

  const totalDepreciation = filteredSchedules.reduce((sum, s) => sum + s.depreciationAmount, 0)
  const postedCount = filteredSchedules.filter(s => s.status === 'posted').length
  const scheduledCount = filteredSchedules.filter(s => s.status === 'scheduled').length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      posted: 'bg-green-50 text-green-700 border-green-200',
      scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
      adjusted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    }

    const icons = {
      posted: <CheckCircle className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />,
      adjusted: <AlertCircle className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${
          styles[status as keyof typeof styles] || styles.scheduled
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/finance/fixed-assets"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Depreciation Schedule</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage asset depreciation schedules
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link
              href="/finance/fixed-assets/depreciation/calculate"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
            >
              <Play className="w-4 h-4" />
              Run Depreciation
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Depreciation</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalDepreciation)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <Calendar className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Posted Entries</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{postedCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{scheduledCount}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average/Asset</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(filteredSchedules.length > 0 ? totalDepreciation / filteredSchedules.length : 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Periods</option>
              <option value="2025-03">March 2025</option>
              <option value="2025-04">April 2025</option>
              <option value="2025-05">May 2025</option>
            </select>
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredSchedules.length} schedule entries
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Opening Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Depreciation
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Accumulated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Closing Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map(schedule => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(schedule.periodStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(schedule.periodStart)} - {formatDate(schedule.periodEnd)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Asset #{schedule.assetId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(schedule.openingValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(schedule.depreciationAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(schedule.accumulatedDepreciation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(schedule.closingValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(schedule.status)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(totalDepreciation)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
