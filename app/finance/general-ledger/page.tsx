'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  ArrowUpDown,
  Calculator,
  PieChart,
  Receipt
} from 'lucide-react'

interface LedgerEntry {
  id: string
  date: string
  account: string
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
  description: string
  reference: string
  debit: number
  credit: number
  balance: number
  createdBy: string
  updatedAt: string
}

const mockLedgerEntries: LedgerEntry[] = [
  {
    id: '1',
    date: '2024-01-16',
    account: 'Cash at Bank - First Bank',
    accountType: 'Asset',
    description: 'Fuel sales revenue - Lagos depot',
    reference: 'SALE-2024-001',
    debit: 2500000,
    credit: 0,
    balance: 15750000,
    createdBy: 'John Adebayo',
    updatedAt: '2024-01-16 09:30:00'
  },
  {
    id: '2',
    date: '2024-01-16',
    account: 'Sales Revenue',
    accountType: 'Revenue',
    description: 'Fuel sales revenue - Lagos depot',
    reference: 'SALE-2024-001',
    debit: 0,
    credit: 2500000,
    balance: 18650000,
    createdBy: 'John Adebayo',
    updatedAt: '2024-01-16 09:30:00'
  },
  {
    id: '3',
    date: '2024-01-16',
    account: 'Inventory - Premium Motor Spirit',
    accountType: 'Asset',
    description: 'Fuel purchase from NNPC',
    reference: 'PUR-2024-012',
    debit: 1800000,
    credit: 0,
    balance: 8900000,
    createdBy: 'Sarah Ibrahim',
    updatedAt: '2024-01-16 11:15:00'
  },
  {
    id: '4',
    date: '2024-01-16',
    account: 'Accounts Payable - NNPC',
    accountType: 'Liability',
    description: 'Fuel purchase from NNPC',
    reference: 'PUR-2024-012',
    debit: 0,
    credit: 1800000,
    balance: 5600000,
    createdBy: 'Sarah Ibrahim',
    updatedAt: '2024-01-16 11:15:00'
  },
  {
    id: '5',
    date: '2024-01-15',
    account: 'Vehicle Maintenance Expense',
    accountType: 'Expense',
    description: 'Truck maintenance - FL001',
    reference: 'MAINT-2024-005',
    debit: 350000,
    credit: 0,
    balance: 1850000,
    createdBy: 'Michael Okafor',
    updatedAt: '2024-01-15 16:45:00'
  },
  {
    id: '6',
    date: '2024-01-15',
    account: 'Cash at Bank - First Bank',
    accountType: 'Asset',
    description: 'Vehicle maintenance payment',
    reference: 'MAINT-2024-005',
    debit: 0,
    credit: 350000,
    balance: 13250000,
    createdBy: 'Michael Okafor',
    updatedAt: '2024-01-15 16:45:00'
  },
  {
    id: '7',
    date: '2024-01-15',
    account: 'Salary Expense',
    accountType: 'Expense',
    description: 'Monthly salary payment - January',
    reference: 'SAL-2024-001',
    debit: 4500000,
    credit: 0,
    balance: 4500000,
    createdBy: 'Grace Nnenna',
    updatedAt: '2024-01-15 14:20:00'
  },
  {
    id: '8',
    date: '2024-01-15',
    account: 'Salaries Payable',
    accountType: 'Liability',
    description: 'Monthly salary accrual - January',
    reference: 'SAL-2024-001',
    debit: 0,
    credit: 4500000,
    balance: 4500000,
    createdBy: 'Grace Nnenna',
    updatedAt: '2024-01-15 14:20:00'
  }
]

export default function GeneralLedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>(mockLedgerEntries)
  const [searchTerm, setSearchTerm] = useState('')
  const [accountFilter, setAccountFilter] = useState('All')
  const [dateRange, setDateRange] = useState('This Month')
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAccount = accountFilter === 'All' || entry.accountType === accountFilter

    return matchesSearch && matchesAccount
  })

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'text-green-600 bg-green-50'
      case 'Liability': return 'text-red-600 bg-red-50'
      case 'Equity': return 'text-blue-600 bg-blue-50'
      case 'Revenue': return 'text-purple-600 bg-purple-50'
      case 'Expense': return 'text-orange-600 bg-orange-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTotalDebits = () => {
    return filteredEntries.reduce((sum, entry) => sum + entry.debit, 0)
  }

  const calculateTotalCredits = () => {
    return filteredEntries.reduce((sum, entry) => sum + entry.credit, 0)
  }

  const getTrialBalanceSummary = () => {
    const summary = {
      assets: entries.filter(e => e.accountType === 'Asset').reduce((sum, e) => sum + e.debit - e.credit, 0),
      liabilities: entries.filter(e => e.accountType === 'Liability').reduce((sum, e) => sum + e.credit - e.debit, 0),
      equity: entries.filter(e => e.accountType === 'Equity').reduce((sum, e) => sum + e.credit - e.debit, 0),
      revenue: entries.filter(e => e.accountType === 'Revenue').reduce((sum, e) => sum + e.credit - e.debit, 0),
      expenses: entries.filter(e => e.accountType === 'Expense').reduce((sum, e) => sum + e.debit - e.credit, 0)
    }

    return summary
  }

  const openModal = (entry: LedgerEntry) => {
    setSelectedEntry(entry)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedEntry(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Account', 'Type', 'Description', 'Reference', 'Debit', 'Credit', 'Balance']
    const csvData = filteredEntries.map(entry => [
      entry.date,
      entry.account,
      entry.accountType,
      entry.description,
      entry.reference,
      entry.debit,
      entry.credit,
      entry.balance
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'general-ledger.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const trialBalance = getTrialBalanceSummary()

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8B1538] rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">General Ledger</h1>
              <p className="text-black">Complete record of all financial transactions</p>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Assets</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(trialBalance.assets)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Liabilities</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(trialBalance.liabilities)}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(trialBalance.revenue)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Expenses</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(trialBalance.expenses)}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Net Income</p>
                <p className={`text-2xl font-bold ${(trialBalance.revenue - trialBalance.expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(trialBalance.revenue - trialBalance.expenses)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search accounts, descriptions, references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Account Types</option>
                <option value="Asset">Assets</option>
                <option value="Liability">Liabilities</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expenses</option>
              </select>
            </div>

            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
                <option value="Custom">Custom Range</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors">
                <Plus className="w-4 h-4" />
                New Entry
              </button>
            </div>
          </div>
        </div>

        {/* Trial Balance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Trial Balance</h3>
            <div className="flex items-center gap-4 text-sm text-black">
              <span>Total Debits: {formatCurrency(calculateTotalDebits())}</span>
              <span>Total Credits: {formatCurrency(calculateTotalCredits())}</span>
              <span className={calculateTotalDebits() === calculateTotalCredits() ? 'text-green-600' : 'text-red-600'}>
                {calculateTotalDebits() === calculateTotalCredits() ? 'Balanced' : 'Out of Balance'}
              </span>
            </div>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Date & Reference
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-black uppercase tracking-wider">
                    Debit
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-black uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-black uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{entry.date}</div>
                        <div className="text-sm text-black">{entry.reference}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{entry.account}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(entry.accountType)}`}>
                          {entry.accountType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">{entry.description}</div>
                      <div className="text-xs text-black">
                        by {entry.createdBy} • {entry.updatedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-medium ${entry.debit > 0 ? 'text-black' : 'text-gray-400'}`}>
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-medium ${entry.credit > 0 ? 'text-black' : 'text-gray-400'}`}>
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-black">{formatCurrency(entry.balance)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(entry)}
                          className="p-2 text-black hover:text-[#8B1538] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-black hover:text-[#E67E22] transition-colors"
                          title="Edit Entry"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-black">
            Showing {filteredEntries.length} of {entries.length} ledger entries
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#8B1538] text-white rounded hover:bg-[#7a1230] transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">Ledger Entry Details</h2>
                    <p className="text-black">{selectedEntry.reference}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 transform rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Transaction Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Date</label>
                      <p className="text-black">{selectedEntry.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Reference</label>
                      <p className="text-black">{selectedEntry.reference}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Account</label>
                      <p className="text-black">{selectedEntry.account}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Account Type</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(selectedEntry.accountType)}`}>
                        {selectedEntry.accountType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Debit</p>
                          <p className="text-xl font-bold text-green-900">{formatCurrency(selectedEntry.debit)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-700">Credit</p>
                          <p className="text-xl font-bold text-red-900">{formatCurrency(selectedEntry.credit)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Balance</p>
                          <p className="text-xl font-bold text-blue-900">{formatCurrency(selectedEntry.balance)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Description</h3>
                  <p className="text-black">{selectedEntry.description}</p>
                </div>

                {/* Audit Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Audit Trail</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Created By</label>
                      <p className="text-black">{selectedEntry.createdBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Last Updated</label>
                      <p className="text-black">{selectedEntry.updatedAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#d86613] transition-colors">
                  Edit Entry
                </button>
                <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors">
                  Journal Voucher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}