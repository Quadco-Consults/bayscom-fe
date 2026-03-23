'use client'
export const dynamic = 'force-dynamic'


import { useState, useMemo } from 'react'
import { DollarSign, Plus, Search, Filter, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { AdvanceStatusBadge } from '@/components/finance'
import type { AdvanceStatus } from '@/utils/finance-state-machine'

interface CashAdvance {
  id: string
  refNumber: string
  employeeName: string
  employeeId: string
  department: string
  purpose: string
  amount: number
  status: AdvanceStatus
  anticipatedExpenses: number
  actualExpenses: number
  retirementBalance: number
  createdAt: string
  disbursedAt?: string
  retirementSubmittedAt?: string
  fullyRetiredAt?: string
}

type FilterTab = 'all' | 'mine' | 'needs_retirement'

export default function CashAdvancesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdvanceStatus | 'all'>('all')

  // Mock current user
  const currentUserId = 'user-001'

  // Mock data
  const advances: CashAdvance[] = [
    {
      id: 'adv-001',
      refNumber: 'ADV-2026-015',
      employeeName: 'Usman Ibrahim',
      employeeId: currentUserId,
      department: 'Fleet & Haulage',
      purpose: 'Emergency fuel purchase and minor truck repairs - Route to Lagos',
      amount: 150000,
      status: 'disbursed',
      anticipatedExpenses: 150000,
      actualExpenses: 0,
      retirementBalance: 150000,
      createdAt: '2026-03-20T09:00:00Z',
      disbursedAt: '2026-03-20T14:30:00Z',
    },
    {
      id: 'adv-002',
      refNumber: 'ADV-2026-016',
      employeeName: 'Aisha Mohammed',
      employeeId: 'user-002',
      department: 'Procurement',
      purpose: 'Market survey and supplier negotiations in Abuja',
      amount: 85000,
      status: 'retirement_submitted',
      anticipatedExpenses: 85000,
      actualExpenses: 78500,
      retirementBalance: 6500,
      createdAt: '2026-03-18T10:30:00Z',
      disbursedAt: '2026-03-18T15:00:00Z',
      retirementSubmittedAt: '2026-03-22T08:15:00Z',
    },
    {
      id: 'adv-003',
      refNumber: 'ADV-2026-017',
      employeeName: 'Fatima Yusuf',
      employeeId: 'user-003',
      department: 'Human Resources',
      purpose: 'Recruitment drive - Kano and Kaduna',
      amount: 120000,
      status: 'fully_retired',
      anticipatedExpenses: 120000,
      actualExpenses: 118200,
      retirementBalance: 1800,
      createdAt: '2026-03-15T11:00:00Z',
      disbursedAt: '2026-03-15T16:45:00Z',
      retirementSubmittedAt: '2026-03-19T09:30:00Z',
      fullyRetiredAt: '2026-03-20T14:00:00Z',
    },
    {
      id: 'adv-004',
      refNumber: 'ADV-2026-018',
      employeeName: 'Ibrahim Sani',
      employeeId: currentUserId,
      department: 'Fuel Operations',
      purpose: 'LPG supplier visit and equipment inspection - Port Harcourt',
      amount: 95000,
      status: 'approved',
      anticipatedExpenses: 95000,
      actualExpenses: 0,
      retirementBalance: 0,
      createdAt: '2026-03-22T09:00:00Z',
    },
    {
      id: 'adv-005',
      refNumber: 'ADV-2026-019',
      employeeName: 'Amina Bello',
      employeeId: 'user-005',
      department: 'Administration',
      purpose: 'Office equipment procurement - Lagos',
      amount: 200000,
      status: 'disbursed',
      anticipatedExpenses: 200000,
      actualExpenses: 0,
      retirementBalance: 200000,
      createdAt: '2026-03-21T13:00:00Z',
      disbursedAt: '2026-03-22T10:00:00Z',
    },
  ]

  // Calculate overdue advances (disbursed > 7 days without retirement)
  const getOverdueAdvances = () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return advances.filter((adv) => {
      if (!adv.disbursedAt || adv.status === 'fully_retired') return false
      return new Date(adv.disbursedAt) < sevenDaysAgo && adv.status === 'disbursed'
    })
  }

  const overdueAdvances = getOverdueAdvances()

  // Filter advances
  const filteredAdvances = useMemo(() => {
    let filtered = advances

    // Tab filtering
    if (activeTab === 'mine') {
      filtered = filtered.filter((adv) => adv.employeeId === currentUserId)
    } else if (activeTab === 'needs_retirement') {
      filtered = filtered.filter((adv) => adv.employeeId === currentUserId && adv.status === 'disbursed')
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter((adv) => adv.status === statusFilter)
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (adv) =>
          adv.refNumber.toLowerCase().includes(query) ||
          adv.employeeName.toLowerCase().includes(query) ||
          adv.purpose.toLowerCase().includes(query) ||
          adv.department.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [activeTab, statusFilter, searchQuery, advances])

  // Stats
  const totalDisbursed = advances
    .filter((adv) => ['disbursed', 'retirement_submitted', 'fully_retired'].includes(adv.status))
    .reduce((sum, adv) => sum + adv.amount, 0)

  const totalOutstanding = advances
    .filter((adv) => ['disbursed', 'retirement_submitted'].includes(adv.status))
    .reduce((sum, adv) => sum + adv.retirementBalance, 0)

  const pendingRetirement = advances.filter((adv) => adv.status === 'retirement_submitted').length

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
          <h1 className="text-2xl font-bold text-gray-900">Cash Advances</h1>
          <p className="text-sm text-gray-500 mt-1">Manage staff cash advances and retirements</p>
        </div>
        <Link
          href="/finance/advances/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Advance
        </Link>
      </div>

      {/* Overdue Alert */}
      {overdueAdvances.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">Overdue Retirements</h3>
            <p className="text-sm text-red-700 mt-1">
              {overdueAdvances.length} advance{overdueAdvances.length !== 1 ? 's' : ''} disbursed over 7 days ago
              without retirement. Please follow up with staff.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Disbursed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNaira(totalDisbursed)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatNaira(totalOutstanding)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Retirement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingRetirement}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
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
            All Advances
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {advances.length}
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
            My Advances
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {advances.filter((adv) => adv.employeeId === currentUserId).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('needs_retirement')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'needs_retirement'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Needs My Retirement
            <span
              className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                advances.filter((adv) => adv.employeeId === currentUserId && adv.status === 'disbursed').length > 0
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {advances.filter((adv) => adv.employeeId === currentUserId && adv.status === 'disbursed').length}
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
            placeholder="Search by reference, employee, purpose, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdvanceStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="disbursed">Disbursed</option>
            <option value="retirement_submitted">Retirement Submitted</option>
            <option value="fully_retired">Fully Retired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Advances Table */}
      {filteredAdvances.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cash advances found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : activeTab === 'mine'
              ? "You haven't requested any advances yet"
              : activeTab === 'needs_retirement'
              ? 'No advances require your retirement at this time'
              : 'Get started by creating your first cash advance'}
          </p>
          {activeTab === 'all' && !searchQuery && statusFilter === 'all' && (
            <Link
              href="/finance/advances/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Advance
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
                    Employee
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
                    Balance
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
                {filteredAdvances.map((advance) => (
                  <tr key={advance.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/finance/advances/${advance.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {advance.refNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{advance.employeeName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{advance.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 max-w-xs truncate">{advance.purpose}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{formatNaira(advance.amount)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`text-sm font-medium ${
                          advance.retirementBalance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatNaira(advance.retirementBalance)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AdvanceStatusBadge status={advance.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">{formatDate(advance.createdAt)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {filteredAdvances.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-900">{filteredAdvances.length}</span> advance
            {filteredAdvances.length !== 1 ? 's' : ''}
          </div>
          <div>
            Total value:{' '}
            <span className="font-medium text-gray-900">
              {formatNaira(filteredAdvances.reduce((sum, adv) => sum + adv.amount, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
