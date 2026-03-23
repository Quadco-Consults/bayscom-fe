'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  Plus,
  Building2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  ChevronRight,
  Upload,
} from 'lucide-react'
import { BankAccount } from '@/lib/types'
import Link from 'next/link'

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    accountCode: 'BNK-001',
    accountName: 'Operating Account - GTBank',
    bankName: 'Guaranty Trust Bank',
    branchName: 'Wuse II Branch',
    accountNumber: '0123456789',
    accountType: 'current',
    currency: 'NGN',
    currentBalance: 45000000,
    lastReconciledBalance: 43500000,
    lastReconciledDate: '2025-02-28',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '2',
    accountCode: 'BNK-002',
    accountName: 'Sales Collection - Access Bank',
    bankName: 'Access Bank',
    branchName: 'Victoria Island',
    accountNumber: '9876543210',
    accountType: 'current',
    currency: 'NGN',
    currentBalance: 28500000,
    lastReconciledBalance: 28500000,
    lastReconciledDate: '2025-03-15',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '3',
    accountCode: 'BNK-003',
    accountName: 'Payroll Account - Zenith Bank',
    bankName: 'Zenith Bank',
    branchName: 'Garki Branch',
    accountNumber: '1122334455',
    accountType: 'current',
    currency: 'NGN',
    currentBalance: 8500000,
    lastReconciledBalance: 8200000,
    lastReconciledDate: '2025-02-28',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '4',
    accountCode: 'BNK-004',
    accountName: 'Fixed Deposit - First Bank',
    bankName: 'First Bank of Nigeria',
    branchName: 'Kano Main',
    accountNumber: '5544332211',
    accountType: 'fixed-deposit',
    currency: 'NGN',
    currentBalance: 50000000,
    lastReconciledBalance: 50000000,
    lastReconciledDate: '2025-03-01',
    isActive: true,
    createdAt: '2023-06-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '5',
    accountCode: 'BNK-USD-001',
    accountName: 'USD Account - UBA',
    bankName: 'United Bank for Africa',
    branchName: 'Lagos Island',
    accountNumber: '6677889900',
    accountType: 'current',
    currency: 'USD',
    currentBalance: 125000,
    lastReconciledBalance: 120000,
    lastReconciledDate: '2025-02-28',
    isActive: true,
    createdAt: '2024-03-01',
    updatedAt: '2025-03-22',
  },
]

export default function BankReconciliationPage() {
  const [accounts] = useState<BankAccount[]>(mockBankAccounts)

  const totalAccounts = accounts.length
  const activeAccounts = accounts.filter(a => a.isActive).length
  const totalBalanceNGN = accounts
    .filter(a => a.currency === 'NGN')
    .reduce((sum, a) => sum + a.currentBalance, 0)
  const unreconciledCount = accounts.filter(a => {
    if (!a.lastReconciledDate) return true
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(a.lastReconciledDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSince > 30
  }).length

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
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

  const getDaysSinceReconciliation = (dateString?: string) => {
    if (!dateString) return null
    const days = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
    )
    return days
  }

  const getReconciliationStatus = (account: BankAccount) => {
    const days = getDaysSinceReconciliation(account.lastReconciledDate)

    if (!days) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full">
          <AlertCircle className="w-3 h-3" />
          Never Reconciled
        </span>
      )
    }

    if (days <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full">
          <CheckCircle className="w-3 h-3" />
          Up to Date
        </span>
      )
    }

    if (days <= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full">
          <AlertCircle className="w-3 h-3" />
          Due Soon ({days} days ago)
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full">
        <AlertCircle className="w-3 h-3" />
        Overdue ({days} days ago)
      </span>
    )
  }

  const getAccountTypeBadge = (type: string) => {
    const styles = {
      current: 'bg-blue-50 text-blue-700 border-blue-200',
      savings: 'bg-green-50 text-green-700 border-green-200',
      'fixed-deposit': 'bg-purple-50 text-purple-700 border-purple-200',
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${
          styles[type as keyof typeof styles] || styles.current
        }`}
      >
        {type
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bank Reconciliation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Reconcile bank accounts and manage cash balances
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Import Statement
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
            >
              <Plus className="w-4 h-4" />
              Add Bank Account
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{totalAccounts}</p>
                <p className="text-xs text-gray-500 mt-1">{activeAccounts} active</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance (NGN)</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalBalanceNGN)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reconciled</p>
                <p className="mt-2 text-2xl font-semibold text-green-600">
                  {totalAccounts - unreconciledCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Reconciliation</p>
                <p className="mt-2 text-2xl font-semibold text-orange-600">
                  {unreconciledCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">Over 30 days</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Bank Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bank & Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Current Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Reconciliation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map(account => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {account.accountName}
                          </div>
                          <div className="text-xs text-gray-500">{account.accountCode}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {account.accountNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{account.bankName}</div>
                      <div className="text-xs text-gray-500">{account.branchName}</div>
                    </td>
                    <td className="px-6 py-4">{getAccountTypeBadge(account.accountType)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(account.currentBalance, account.currency)}
                      </div>
                      {account.lastReconciledBalance !== account.currentBalance && (
                        <div className="text-xs text-orange-600 mt-0.5">
                          Variance: {formatCurrency(account.currentBalance - account.lastReconciledBalance, account.currency)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {account.lastReconciledDate ? formatDate(account.lastReconciledDate) : 'Never'}
                      </div>
                      {account.lastReconciledDate && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {getDaysSinceReconciliation(account.lastReconciledDate)} days ago
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{getReconciliationStatus(account)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/finance/bank-reconciliation/${account.id}/reconcile`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white rounded-lg"
                        style={{ backgroundColor: '#8B1538' }}
                      >
                        Reconcile
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
