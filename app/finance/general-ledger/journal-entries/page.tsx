'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { JournalEntry } from '@/lib/types'
import Link from 'next/link'

const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    journalNumber: 'JE-2025-0312',
    entryDate: '2025-03-12',
    postingDate: '2025-03-12',
    reference: 'Fuel Purchase - PH Depot',
    description: 'Fuel purchase from PH Depot - 50,000L AGO',
    type: 'manual',
    source: 'AP',
    status: 'posted',
    lines: [],
    totalDebit: 45000000,
    totalCredit: 45000000,
    isBalanced: true,
    createdById: 'user-1',
    submittedDate: '2025-03-12',
    approvedById: 'user-2',
    approvedDate: '2025-03-12',
    createdAt: '2025-03-12',
    updatedAt: '2025-03-12',
  },
  {
    id: '2',
    journalNumber: 'JE-2025-0315',
    entryDate: '2025-03-15',
    postingDate: '2025-03-15',
    reference: 'Depreciation - March 2025',
    description: 'Monthly depreciation for fixed assets',
    type: 'auto',
    source: 'GL',
    status: 'posted',
    lines: [],
    totalDebit: 715833,
    totalCredit: 715833,
    isBalanced: true,
    createdById: 'system',
    approvedById: 'user-2',
    approvedDate: '2025-03-15',
    createdAt: '2025-03-15',
    updatedAt: '2025-03-15',
  },
  {
    id: '3',
    journalNumber: 'JE-2025-0320',
    entryDate: '2025-03-20',
    postingDate: '2025-03-20',
    reference: 'Period-end Accrual',
    description: 'Accrued expenses for March 2025',
    type: 'adjustment',
    source: 'GL',
    status: 'pending-approval',
    lines: [],
    totalDebit: 2500000,
    totalCredit: 2500000,
    isBalanced: true,
    createdById: 'user-3',
    submittedDate: '2025-03-20',
    createdAt: '2025-03-20',
    updatedAt: '2025-03-20',
  },
  {
    id: '4',
    journalNumber: 'JE-2025-0322',
    entryDate: '2025-03-22',
    postingDate: '2025-03-22',
    reference: 'Reclassification Entry',
    description: 'Reclassify expense to correct account',
    type: 'manual',
    source: 'GL',
    status: 'draft',
    lines: [],
    totalDebit: 850000,
    totalCredit: 850000,
    isBalanced: true,
    createdById: 'user-1',
    createdAt: '2025-03-22',
    updatedAt: '2025-03-22',
  },
]

export default function JournalEntriesPage() {
  const [entries] = useState<JournalEntry[]>(mockJournalEntries)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
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
      draft: 'bg-gray-50 text-gray-700 border-gray-200',
      'pending-approval': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      approved: 'bg-blue-50 text-blue-700 border-blue-200',
      posted: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      reversed: 'bg-purple-50 text-purple-700 border-purple-200',
    }

    const icons = {
      draft: <FileText className="w-3 h-3" />,
      'pending-approval': <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      posted: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      reversed: <AlertCircle className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      manual: 'bg-blue-100 text-blue-800',
      auto: 'bg-green-100 text-green-800',
      recurring: 'bg-purple-100 text-purple-800',
      adjustment: 'bg-orange-100 text-orange-800',
      reversing: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[type as keyof typeof styles]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage general ledger journal entries with approval workflow
            </p>
          </div>
          <Link
            href="/finance/general-ledger/journal-entries/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            New Journal Entry
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Journal Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type/Source
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Debit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Credit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{entry.journalNumber}</div>
                    <div className="text-xs text-gray-500">{formatDate(entry.entryDate)}</div>
                    <div className="text-xs text-gray-600 mt-1">{entry.description}</div>
                    <div className="text-xs text-gray-500">Ref: {entry.reference}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getTypeBadge(entry.type)}
                      <div className="text-xs text-gray-500">{entry.source}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(entry.totalDebit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(entry.totalCredit)}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(entry.status)}</td>
                  <td className="px-6 py-4">
                    {entry.approvedDate ? (
                      <div className="text-xs text-green-600">
                        Approved {formatDate(entry.approvedDate)}
                      </div>
                    ) : entry.status === 'pending-approval' ? (
                      <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100">
                          Approve
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
