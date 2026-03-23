'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, Edit, CheckCircle, XCircle } from 'lucide-react'
import { ChartOfAccount } from '@/lib/types'

const mockAccounts: ChartOfAccount[] = [
  {
    id: '1',
    accountCode: '1000',
    accountName: 'Assets',
    accountType: 'Asset',
    accountSubType: 'Control Account',
    level: 1,
    isActive: true,
    allowPosting: false,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 250000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '2',
    accountCode: '1010',
    accountName: 'Current Assets',
    accountType: 'Asset',
    accountSubType: 'Current Asset',
    parentAccountId: '1',
    level: 2,
    isActive: true,
    allowPosting: false,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 180000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '3',
    accountCode: '1011',
    accountName: 'Cash and Bank',
    accountType: 'Asset',
    accountSubType: 'Current Asset',
    parentAccountId: '2',
    level: 3,
    isActive: true,
    allowPosting: true,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 82000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '4',
    accountCode: '1012',
    accountName: 'Accounts Receivable',
    accountType: 'Asset',
    accountSubType: 'Current Asset',
    parentAccountId: '2',
    level: 3,
    isActive: true,
    allowPosting: true,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 58000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '5',
    accountCode: '1013',
    accountName: 'Inventory',
    accountType: 'Asset',
    accountSubType: 'Current Asset',
    parentAccountId: '2',
    level: 3,
    isActive: true,
    allowPosting: true,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 40000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '6',
    accountCode: '2000',
    accountName: 'Liabilities',
    accountType: 'Liability',
    accountSubType: 'Control Account',
    level: 1,
    isActive: true,
    allowPosting: false,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 95000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '7',
    accountCode: '2010',
    accountName: 'Accounts Payable',
    accountType: 'Liability',
    accountSubType: 'Current Liability',
    parentAccountId: '6',
    level: 2,
    isActive: true,
    allowPosting: true,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 45000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '8',
    accountCode: '4000',
    accountName: 'Revenue',
    accountType: 'Revenue',
    accountSubType: 'Sales Revenue',
    level: 1,
    isActive: true,
    allowPosting: true,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 450000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '9',
    accountCode: '5000',
    accountName: 'Cost of Goods Sold',
    accountType: 'Expense',
    accountSubType: 'Direct Cost',
    level: 1,
    isActive: true,
    allowPosting: true,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 280000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '10',
    accountCode: '6000',
    accountName: 'Operating Expenses',
    accountType: 'Expense',
    accountSubType: 'Operating Expense',
    level: 1,
    isActive: true,
    allowPosting: false,
    currency: 'NGN',
    openingBalance: 0,
    currentBalance: 95000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
]

export default function ChartOfAccountsPage() {
  const [accounts] = useState<ChartOfAccount[]>(mockAccounts)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getIndentation = (level: number) => {
    return `${level * 1.5}rem`
  }

  const getAccountTypeBadge = (type: string) => {
    const styles = {
      Asset: 'bg-blue-50 text-blue-700 border-blue-200',
      Liability: 'bg-red-50 text-red-700 border-red-200',
      Equity: 'bg-purple-50 text-purple-700 border-purple-200',
      Revenue: 'bg-green-50 text-green-700 border-green-200',
      Expense: 'bg-orange-50 text-orange-700 border-orange-200',
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${
          styles[type as keyof typeof styles]
        }`}
      >
        {type}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your accounting structure and GL accounts
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Account Code & Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sub-Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Current Balance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Posting
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
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
                    <div style={{ paddingLeft: getIndentation(account.level - 1) }}>
                      <div className="text-sm font-medium text-gray-900">
                        {account.accountCode} - {account.accountName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getAccountTypeBadge(account.accountType)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{account.accountSubType}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(account.currentBalance)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {account.allowPosting ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {account.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
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
