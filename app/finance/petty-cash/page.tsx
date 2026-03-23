'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { Wallet, Plus, TrendingDown, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PettyCashStatusBadge } from '@/components/finance'
import type { PettyCashStatus } from '@/utils/finance-state-machine'

interface PettyCashRequest {
  id: string
  refNumber: string
  requestedBy: string
  requestedById: string
  department: string
  purpose: string
  amount: number
  status: PettyCashStatus
  createdAt: string
  disbursedAt?: string
}

export default function PettyCashPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock current user
  const currentUserId = 'user-001'

  // Petty Cash Float Configuration
  const floatCeiling = 50000 // Maximum float amount
  const reorderLevel = 10000 // Trigger refill alert

  // Mock data
  const currentBalance = 8500
  const requests: PettyCashRequest[] = [
    {
      id: 'pc-001',
      refNumber: 'PC-2026-031',
      requestedBy: 'Aisha Mohammed',
      requestedById: 'user-002',
      department: 'Administration',
      purpose: 'Office cleaning supplies',
      amount: 3500,
      status: 'submitted',
      createdAt: '2026-03-22T09:00:00Z',
    },
    {
      id: 'pc-002',
      refNumber: 'PC-2026-032',
      requestedBy: 'Ibrahim Sani',
      requestedById: currentUserId,
      department: 'Fuel Operations',
      purpose: 'Minor equipment repairs',
      amount: 2800,
      status: 'approved',
      createdAt: '2026-03-21T14:30:00Z',
    },
    {
      id: 'pc-003',
      refNumber: 'PC-2026-033',
      requestedBy: 'Fatima Yusuf',
      requestedById: 'user-003',
      department: 'Fleet & Haulage',
      purpose: 'Emergency fuel purchase',
      amount: 5000,
      status: 'disbursed',
      createdAt: '2026-03-20T11:15:00Z',
      disbursedAt: '2026-03-20T13:45:00Z',
    },
    {
      id: 'pc-004',
      refNumber: 'PC-2026-034',
      requestedBy: 'Usman Ibrahim',
      requestedById: 'user-004',
      department: 'Human Resources',
      purpose: 'Staff refreshments',
      amount: 4200,
      status: 'disbursed',
      createdAt: '2026-03-19T10:00:00Z',
      disbursedAt: '2026-03-19T15:30:00Z',
    },
    {
      id: 'pc-005',
      refNumber: 'PC-2026-035',
      requestedBy: 'Amina Bello',
      requestedById: 'user-005',
      department: 'Administration',
      purpose: 'Stationery replenishment',
      amount: 1850,
      status: 'disbursed',
      createdAt: '2026-03-18T13:20:00Z',
      disbursedAt: '2026-03-18T16:00:00Z',
    },
  ]

  // Calculate balance percentage
  const balancePercentage = (currentBalance / floatCeiling) * 100
  const needsRefill = currentBalance < reorderLevel

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      req.refNumber.toLowerCase().includes(query) ||
      req.requestedBy.toLowerCase().includes(query) ||
      req.purpose.toLowerCase().includes(query) ||
      req.department.toLowerCase().includes(query)
    )
  })

  // Stats
  const pendingCount = requests.filter((r) => r.status === 'submitted').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const totalDisbursedThisMonth = requests
    .filter((r) => r.status === 'disbursed')
    .reduce((sum, r) => sum + r.amount, 0)

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Petty Cash Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage small cash disbursements and float</p>
        </div>
        <Link
          href="/finance/petty-cash/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Link>
      </div>

      {/* Refill Alert */}
      {needsRefill && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">Petty Cash Float Below Reorder Level</h3>
            <p className="text-sm text-red-700 mt-1">
              Current balance is {formatNaira(currentBalance)}, which is below the reorder threshold of{' '}
              {formatNaira(reorderLevel)}. Please arrange to refill the petty cash float.
            </p>
          </div>
        </div>
      )}

      {/* Float Status Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Float Balance</p>
              <p className="text-3xl font-bold text-gray-900">{formatNaira(currentBalance)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Float Ceiling</p>
            <p className="text-lg font-semibold text-gray-700">{formatNaira(floatCeiling)}</p>
          </div>
        </div>

        {/* Balance Bar */}
        <div className="relative">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                balancePercentage < 20
                  ? 'bg-red-600'
                  : balancePercentage < 40
                  ? 'bg-amber-500'
                  : 'bg-green-600'
              }`}
              style={{ width: `${balancePercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {balancePercentage.toFixed(1)}% of ceiling •{' '}
            {formatNaira(floatCeiling - currentBalance)} available to disburse
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved (Not Disbursed)</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{approvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Disbursed This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNaira(totalDisbursedThisMonth)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search requests by reference, requester, purpose, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No petty cash requests found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first petty cash request'}
          </p>
          {!searchQuery && (
            <Link
              href="/finance/petty-cash/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Request
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-gray-900">{request.refNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{request.requestedBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{request.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 max-w-xs truncate">{request.purpose}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{formatNaira(request.amount)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <PettyCashStatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        {request.disbursedAt ? formatDateTime(request.disbursedAt) : formatDate(request.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {filteredRequests.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-900">{filteredRequests.length}</span> request
            {filteredRequests.length !== 1 ? 's' : ''}
          </div>
          <div>
            Total amount:{' '}
            <span className="font-medium text-gray-900">
              {formatNaira(filteredRequests.reduce((sum, r) => sum + r.amount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
