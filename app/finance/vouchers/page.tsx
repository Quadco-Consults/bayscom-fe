'use client'
export const dynamic = 'force-dynamic'


import { useState, useMemo } from 'react'
import { CreditCard, Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { PVStatusBadge } from '@/components/finance'
import type { PVStatus } from '@/utils/finance-state-machine'

interface PaymentVoucher {
  id: string
  refNumber: string
  memoRef?: string
  payeeName: string
  amount: number
  purpose: string
  status: PVStatus
  createdBy: string
  createdById: string
  createdAt: string
  updatedAt: string
  bankAccount?: string
}

type FilterTab = 'all' | 'mine' | 'needs_action'

export default function PaymentVouchersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PVStatus | 'all'>('all')

  // Mock current user
  const currentUserId = 'user-001'
  const currentUserRole: 'finance_officer' | 'coo' | 'cfo' | 'md' = 'finance_officer'

  // Mock data
  const vouchers: PaymentVoucher[] = [
    {
      id: 'pv-001',
      refNumber: 'PV-0041',
      memoRef: 'MEM-031',
      payeeName: 'Nasara Gas Cylinders Ltd',
      amount: 450000,
      purpose: 'LPG Cylinder Purchase - March 2026',
      status: 'awaiting_review',
      createdBy: 'Ibrahim Sani',
      createdById: currentUserId,
      createdAt: '2026-03-22T10:00:00Z',
      updatedAt: '2026-03-22T10:00:00Z',
      bankAccount: '0123456789 - GTBank',
    },
    {
      id: 'pv-002',
      refNumber: 'PV-0042',
      memoRef: 'MEM-033',
      payeeName: 'Office Mart Nigeria',
      amount: 85000,
      purpose: 'Office Supplies - Q1 2026',
      status: 'reviewed',
      createdBy: 'Amina Yusuf',
      createdById: 'user-002',
      createdAt: '2026-03-21T14:30:00Z',
      updatedAt: '2026-03-22T08:15:00Z',
      bankAccount: '9876543210 - First Bank',
    },
    {
      id: 'pv-003',
      refNumber: 'PV-0043',
      payeeName: 'SafetyFirst Training Ltd',
      amount: 320000,
      purpose: 'Staff Training Program - Safety',
      status: 'approved',
      createdBy: 'Fatima Mohammed',
      createdById: 'user-003',
      createdAt: '2026-03-20T11:00:00Z',
      updatedAt: '2026-03-22T09:30:00Z',
      bankAccount: '1357924680 - Zenith Bank',
    },
    {
      id: 'pv-004',
      refNumber: 'PV-0044',
      memoRef: 'MEM-036',
      payeeName: 'AutoParts Warehouse',
      amount: 215000,
      purpose: 'LPG Accessories Stock Replenishment',
      status: 'transferred',
      createdBy: 'Usman Ibrahim',
      createdById: 'user-004',
      createdAt: '2026-03-19T09:15:00Z',
      updatedAt: '2026-03-21T16:45:00Z',
      bankAccount: '2468013579 - Access Bank',
    },
    {
      id: 'pv-005',
      refNumber: 'PV-0045',
      payeeName: 'PHCN - Kano District',
      amount: 45000,
      purpose: 'Monthly Electricity Bill - February 2026',
      status: 'paid',
      createdBy: 'Aisha Bello',
      createdById: 'user-005',
      createdAt: '2026-03-18T13:20:00Z',
      updatedAt: '2026-03-22T07:00:00Z',
      bankAccount: 'Direct Debit',
    },
    {
      id: 'pv-006',
      refNumber: 'PV-0046',
      memoRef: 'MEM-032',
      payeeName: 'Mega Motors Ltd',
      amount: 125000,
      purpose: 'Fleet Maintenance - Truck BAY-456',
      status: 'draft',
      createdBy: 'Ibrahim Sani',
      createdById: currentUserId,
      createdAt: '2026-03-22T15:00:00Z',
      updatedAt: '2026-03-22T15:00:00Z',
      bankAccount: '0011223344 - UBA',
    },
  ]

  // Helper to determine if PV needs current user's action
  const needsMyAction = (pv: PaymentVoucher): boolean => {
    if (currentUserRole === 'finance_officer' && pv.status === 'awaiting_review') return true
    // @ts-ignore - Type comparison intentional
    if (currentUserRole === 'coo' && pv.status === 'reviewed') return true
    // @ts-ignore - Type comparison intentional
    if (currentUserRole === 'cfo' && pv.status === 'reviewed') return true
    // @ts-ignore - Type comparison intentional
    if (currentUserRole === 'md' && pv.status === 'reviewed') return true
    return false
  }

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    let filtered = vouchers

    // Tab filtering
    if (activeTab === 'mine') {
      filtered = filtered.filter((pv) => pv.createdById === currentUserId)
    } else if (activeTab === 'needs_action') {
      filtered = filtered.filter((pv) => needsMyAction(pv))
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter((pv) => pv.status === statusFilter)
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (pv) =>
          pv.refNumber.toLowerCase().includes(query) ||
          pv.memoRef?.toLowerCase().includes(query) ||
          pv.payeeName.toLowerCase().includes(query) ||
          pv.purpose.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [activeTab, statusFilter, searchQuery, vouchers])

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Vouchers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage bank transfer authorizations</p>
        </div>
        <Link
          href="/finance/vouchers/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Payment Voucher
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Vouchers
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {vouchers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'mine'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Vouchers
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {vouchers.filter((pv) => pv.createdById === currentUserId).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('needs_action')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'needs_action'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Needs My Action
            <span
              className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                vouchers.filter((pv) => needsMyAction(pv)).length > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {vouchers.filter((pv) => needsMyAction(pv)).length}
            </span>
          </button>
        </nav>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PV ref, memo ref, payee, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PVStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="awaiting_review">Awaiting Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="transferred">Transferred</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      {filteredVouchers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment vouchers found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : activeTab === 'mine'
              ? "You haven't created any vouchers yet"
              : activeTab === 'needs_action'
              ? 'No vouchers require your action at this time'
              : 'Get started by creating your first payment voucher'}
          </p>
          {activeTab === 'all' && !searchQuery && statusFilter === 'all' && (
            <Link
              href="/finance/vouchers/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Voucher
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
                    PV Ref
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Memo Ref
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payee
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
                {filteredVouchers.map((pv) => (
                  <tr key={pv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/finance/vouchers/${pv.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {pv.refNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {pv.memoRef ? (
                        <Link
                          href={`/finance/memos/${pv.memoRef}`}
                          className="font-mono text-xs text-gray-600 hover:text-blue-600"
                        >
                          {pv.memoRef}
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{pv.payeeName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 max-w-md truncate">{pv.purpose}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{formatNaira(pv.amount)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <PVStatusBadge status={pv.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">{formatDate(pv.createdAt)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {filteredVouchers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-900">{filteredVouchers.length}</span> voucher
            {filteredVouchers.length !== 1 ? 's' : ''}
          </div>
          <div>
            Total value:{' '}
            <span className="font-medium text-gray-900">
              {formatNaira(filteredVouchers.reduce((sum, pv) => sum + pv.amount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
