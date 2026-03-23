'use client'
export const dynamic = 'force-dynamic'


import { useState, useMemo } from 'react'
import { FileText, Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { MemoStatusBadge } from '@/components/finance'
import type { MemoStatus } from '@/utils/finance-state-machine'

interface Memo {
  id: string
  refNumber: string
  subject: string
  raisedBy: string
  raisedById: string
  department: string
  amount: number
  route: 'coo' | 'cfo' | 'both' // Approval route
  status: MemoStatus
  createdAt: string
  updatedAt: string
}

type FilterTab = 'all' | 'mine' | 'needs_action'

export default function MemosPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<MemoStatus | 'all'>('all')

  // Mock current user (in production, get from auth context)
  const currentUserId = 'user-001'
  const currentUserRole: 'coo' | 'cfo' | 'md' | 'finance_officer' = 'coo'

  // Mock data - in production, fetch from API
  const memos: Memo[] = [
    {
      id: 'memo-001',
      refNumber: 'MEM-031',
      subject: 'LPG Cylinder Purchase - March 2026',
      raisedBy: 'Aisha Mohammed',
      raisedById: 'user-002',
      department: 'Fuel Operations',
      amount: 450000,
      route: 'coo',
      status: 'awaiting_coo',
      createdAt: '2026-03-20T09:30:00Z',
      updatedAt: '2026-03-20T09:30:00Z',
    },
    {
      id: 'memo-002',
      refNumber: 'MEM-032',
      subject: 'Fleet Maintenance - Truck BAY-456',
      raisedBy: 'Usman Ibrahim',
      raisedById: 'user-003',
      department: 'Fleet & Haulage',
      amount: 125000,
      route: 'both',
      status: 'awaiting_cfo',
      createdAt: '2026-03-19T14:15:00Z',
      updatedAt: '2026-03-21T10:45:00Z',
    },
    {
      id: 'memo-003',
      refNumber: 'MEM-033',
      subject: 'Office Supplies - Q1 2026',
      raisedBy: 'Fatima Yusuf',
      raisedById: currentUserId,
      department: 'Administration',
      amount: 85000,
      route: 'coo',
      status: 'md_approved',
      createdAt: '2026-03-18T11:20:00Z',
      updatedAt: '2026-03-22T08:10:00Z',
    },
    {
      id: 'memo-004',
      refNumber: 'MEM-034',
      subject: 'Peddling Operations - Vendor Refills',
      raisedBy: 'Bello Musa',
      raisedById: 'user-004',
      department: 'Peddling Operations',
      amount: 680000,
      route: 'both',
      status: 'awaiting_md',
      createdAt: '2026-03-21T16:00:00Z',
      updatedAt: '2026-03-22T07:30:00Z',
    },
    {
      id: 'memo-005',
      refNumber: 'MEM-035',
      subject: 'Staff Training Program - Safety',
      raisedBy: 'Amina Abdullahi',
      raisedById: 'user-005',
      department: 'Human Resources',
      amount: 320000,
      route: 'cfo',
      status: 'pv_raised',
      createdAt: '2026-03-17T13:45:00Z',
      updatedAt: '2026-03-22T09:00:00Z',
    },
    {
      id: 'memo-006',
      refNumber: 'MEM-036',
      subject: 'LPG Accessories Stock Replenishment',
      raisedBy: 'Ibrahim Sani',
      raisedById: 'user-006',
      department: 'Fuel Operations',
      amount: 215000,
      route: 'coo',
      status: 'paid',
      createdAt: '2026-03-15T10:00:00Z',
      updatedAt: '2026-03-21T15:30:00Z',
    },
  ]

  // Helper to determine if memo needs current user's action
  const needsMyAction = (memo: Memo): boolean => {
    if (currentUserRole === 'coo' && memo.status === 'awaiting_coo') return true
    // @ts-ignore - Type comparison intentional
    if (currentUserRole === 'cfo' && memo.status === 'awaiting_cfo') return true
    // @ts-ignore - Type comparison intentional
    if (currentUserRole === 'md' && memo.status === 'awaiting_md') return true
    return false
  }

  // Filter memos based on active tab
  const filteredMemos = useMemo(() => {
    let filtered = memos

    // Tab filtering
    if (activeTab === 'mine') {
      filtered = filtered.filter((m) => m.raisedById === currentUserId)
    } else if (activeTab === 'needs_action') {
      filtered = filtered.filter((m) => needsMyAction(m))
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter((m) => m.status === statusFilter)
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.refNumber.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query) ||
          m.raisedBy.toLowerCase().includes(query) ||
          m.department.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [activeTab, statusFilter, searchQuery, memos])

  // Format currency
  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Get route label
  const getRouteLabel = (route: Memo['route']) => {
    if (route === 'coo') return 'COO → MD'
    if (route === 'cfo') return 'CFO → MD'
    return 'COO → CFO → MD'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Memos</h1>
          <p className="text-sm text-gray-500 mt-1">Manage spending authorization requests</p>
        </div>
        <Link
          href="/finance/memos/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Memo
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
            All Memos
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {memos.length}
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
            My Memos
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {memos.filter((m) => m.raisedById === currentUserId).length}
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
                memos.filter((m) => needsMyAction(m)).length > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {memos.filter((m) => needsMyAction(m)).length}
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
            placeholder="Search by reference, subject, raised by, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MemoStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="awaiting_coo">Awaiting COO</option>
            <option value="awaiting_cfo">Awaiting CFO</option>
            <option value="awaiting_md">Awaiting MD</option>
            <option value="md_approved">MD Approved</option>
            <option value="pv_raised">PV Raised</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Memos Table */}
      {filteredMemos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memos found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : activeTab === 'mine'
              ? "You haven't raised any memos yet"
              : activeTab === 'needs_action'
              ? 'No memos require your action at this time'
              : 'Get started by creating your first memo'}
          </p>
          {activeTab === 'all' && !searchQuery && statusFilter === 'all' && (
            <Link
              href="/finance/memos/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Memo
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
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raised By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
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
                {filteredMemos.map((memo) => (
                  <tr key={memo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/finance/memos/${memo.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {memo.refNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 max-w-md truncate">{memo.subject}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{memo.raisedBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{memo.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{formatNaira(memo.amount)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600">{getRouteLabel(memo.route)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <MemoStatusBadge status={memo.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">{formatDate(memo.createdAt)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {filteredMemos.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-900">{filteredMemos.length}</span> memo
            {filteredMemos.length !== 1 ? 's' : ''}
          </div>
          <div>
            Total value:{' '}
            <span className="font-medium text-gray-900">
              {formatNaira(filteredMemos.reduce((sum, m) => sum + m.amount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
