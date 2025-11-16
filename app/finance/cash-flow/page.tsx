'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  PieChart,
  Calculator,
  Building,
  CreditCard,
  Receipt,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  RefreshCw
} from 'lucide-react'

interface CashFlowEntry {
  id: string
  date: string
  description: string
  category: 'Operating' | 'Investing' | 'Financing'
  type: 'Inflow' | 'Outflow'
  amount: number
  account: string
  reference: string
  source: string
  status: 'Completed' | 'Pending' | 'Scheduled'
  createdBy: string
  notes?: string
}

const mockCashFlowEntries: CashFlowEntry[] = [
  {
    id: '1',
    date: '2024-01-16',
    description: 'Fuel sales revenue - Dangote Industries',
    category: 'Operating',
    type: 'Inflow',
    amount: 17000000,
    account: 'Cash at Bank - First Bank',
    reference: 'SALE-2024-001',
    source: 'Customer Payment',
    status: 'Completed',
    createdBy: 'John Adebayo'
  },
  {
    id: '2',
    date: '2024-01-16',
    description: 'Fuel purchase from NNPC',
    category: 'Operating',
    type: 'Outflow',
    amount: 8500000,
    account: 'Cash at Bank - First Bank',
    reference: 'PUR-2024-012',
    source: 'Supplier Payment',
    status: 'Completed',
    createdBy: 'Sarah Ibrahim'
  },
  {
    id: '3',
    date: '2024-01-15',
    description: 'Monthly salary payments',
    category: 'Operating',
    type: 'Outflow',
    amount: 4500000,
    account: 'Payroll Account',
    reference: 'SAL-2024-001',
    source: 'Payroll',
    status: 'Completed',
    createdBy: 'Grace Nnenna'
  },
  {
    id: '4',
    date: '2024-01-14',
    description: 'LPG sales - BUA Cement',
    category: 'Operating',
    type: 'Inflow',
    amount: 4200000,
    account: 'Cash at Bank - Zenith Bank',
    reference: 'SALE-2024-003',
    source: 'Customer Payment',
    status: 'Completed',
    createdBy: 'Michael Okafor'
  },
  {
    id: '5',
    date: '2024-01-12',
    description: 'New storage tank purchase',
    category: 'Investing',
    type: 'Outflow',
    amount: 15000000,
    account: 'Capital Equipment Fund',
    reference: 'CAP-2024-001',
    source: 'Equipment Purchase',
    status: 'Completed',
    createdBy: 'John Adebayo'
  },
  {
    id: '6',
    date: '2024-01-10',
    description: 'Vehicle maintenance - Fleet',
    category: 'Operating',
    type: 'Outflow',
    amount: 750000,
    account: 'Cash at Bank - First Bank',
    reference: 'MAINT-2024-005',
    source: 'Maintenance',
    status: 'Completed',
    createdBy: 'Michael Okafor'
  },
  {
    id: '7',
    date: '2024-01-08',
    description: 'Bank loan disbursement',
    category: 'Financing',
    type: 'Inflow',
    amount: 25000000,
    account: 'Cash at Bank - Access Bank',
    reference: 'LOAN-2024-001',
    source: 'Bank Loan',
    status: 'Completed',
    createdBy: 'John Adebayo'
  },
  {
    id: '8',
    date: '2024-01-18',
    description: 'Upcoming fuel purchase - Total Energies',
    category: 'Operating',
    type: 'Outflow',
    amount: 6300000,
    account: 'Cash at Bank - First Bank',
    reference: 'PUR-2024-015',
    source: 'Supplier Payment',
    status: 'Scheduled',
    createdBy: 'Sarah Ibrahim',
    notes: 'Payment due in 3 days'
  },
  {
    id: '9',
    date: '2024-01-20',
    description: 'Expected payment - MTN Nigeria',
    category: 'Operating',
    type: 'Inflow',
    amount: 12500000,
    account: 'Cash at Bank - First Bank',
    reference: 'SALE-2024-006',
    source: 'Customer Payment',
    status: 'Pending',
    createdBy: 'John Adebayo',
    notes: 'Customer payment expected'
  }
]

export default function CashFlowPage() {
  const [cashFlowEntries, setCashFlowEntries] = useState<CashFlowEntry[]>(mockCashFlowEntries)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [dateRange, setDateRange] = useState('This Month')
  const [selectedEntry, setSelectedEntry] = useState<CashFlowEntry | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredEntries = cashFlowEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || entry.category === categoryFilter
    const matchesType = typeFilter === 'All' || entry.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Operating': return 'text-green-600 bg-green-50'
      case 'Investing': return 'text-blue-600 bg-blue-50'
      case 'Financing': return 'text-purple-600 bg-purple-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50'
      case 'Pending': return 'text-yellow-600 bg-yellow-50'
      case 'Scheduled': return 'text-blue-600 bg-blue-50'
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

  const calculateTotalInflows = () => {
    return filteredEntries
      .filter(entry => entry.type === 'Inflow' && entry.status === 'Completed')
      .reduce((sum, entry) => sum + entry.amount, 0)
  }

  const calculateTotalOutflows = () => {
    return filteredEntries
      .filter(entry => entry.type === 'Outflow' && entry.status === 'Completed')
      .reduce((sum, entry) => sum + entry.amount, 0)
  }

  const calculateNetCashFlow = () => {
    return calculateTotalInflows() - calculateTotalOutflows()
  }

  const calculateOperatingCashFlow = () => {
    return filteredEntries
      .filter(entry => entry.category === 'Operating' && entry.status === 'Completed')
      .reduce((sum, entry) => entry.type === 'Inflow' ? sum + entry.amount : sum - entry.amount, 0)
  }

  const calculateInvestingCashFlow = () => {
    return filteredEntries
      .filter(entry => entry.category === 'Investing' && entry.status === 'Completed')
      .reduce((sum, entry) => entry.type === 'Inflow' ? sum + entry.amount : sum - entry.amount, 0)
  }

  const calculateFinancingCashFlow = () => {
    return filteredEntries
      .filter(entry => entry.category === 'Financing' && entry.status === 'Completed')
      .reduce((sum, entry) => entry.type === 'Inflow' ? sum + entry.amount : sum - entry.amount, 0)
  }

  const getPendingInflows = () => {
    return filteredEntries
      .filter(entry => entry.type === 'Inflow' && (entry.status === 'Pending' || entry.status === 'Scheduled'))
      .reduce((sum, entry) => sum + entry.amount, 0)
  }

  const getPendingOutflows = () => {
    return filteredEntries
      .filter(entry => entry.type === 'Outflow' && (entry.status === 'Pending' || entry.status === 'Scheduled'))
      .reduce((sum, entry) => sum + entry.amount, 0)
  }

  const openModal = (entry: CashFlowEntry) => {
    setSelectedEntry(entry)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedEntry(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Account', 'Reference', 'Status']
    const csvData = filteredEntries.map(entry => [
      entry.date,
      entry.description,
      entry.category,
      entry.type,
      entry.amount,
      entry.account,
      entry.reference,
      entry.status
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'cash-flow-statement.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8B1538] rounded-lg">
              <Banknote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Cash Flow Management</h1>
              <p className="text-black">Monitor cash inflows and outflows across all activities</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Inflows</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotalInflows())}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ArrowUpCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Outflows</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(calculateTotalOutflows())}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <ArrowDownCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${calculateNetCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculateNetCashFlow())}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Operating Cash Flow</p>
                <p className={`text-2xl font-bold ${calculateOperatingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculateOperatingCashFlow())}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Operating Activities</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${calculateOperatingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(calculateOperatingCashFlow())}
            </div>
            <p className="text-sm text-black">Day-to-day business operations</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Investing Activities</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${calculateInvestingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(calculateInvestingCashFlow())}
            </div>
            <p className="text-sm text-black">Equipment and asset purchases</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Financing Activities</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${calculateFinancingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(calculateFinancingCashFlow())}
            </div>
            <p className="text-sm text-black">Loans and equity transactions</p>
          </div>
        </div>

        {/* Pending Cash Flows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Pending Inflows</h3>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {formatCurrency(getPendingInflows())}
            </div>
            <p className="text-sm text-black">Expected receipts</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Pending Outflows</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <ArrowDownCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {formatCurrency(getPendingOutflows())}
            </div>
            <p className="text-sm text-black">Scheduled payments</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search transactions, accounts, sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Operating">Operating</option>
                <option value="Investing">Investing</option>
                <option value="Financing">Financing</option>
              </select>
            </div>

            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Inflow">Inflows</option>
                <option value="Outflow">Outflows</option>
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
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Cash Flow Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Date & Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Category & Type
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-black uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Account & Reference
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status & Source
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
                        <div className="font-medium text-black">{entry.description}</div>
                        <div className="text-sm text-black flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </span>
                        <div className={`flex items-center gap-1 text-sm ${entry.type === 'Inflow' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.type === 'Inflow' ?
                            <ArrowUpCircle className="w-4 h-4" /> :
                            <ArrowDownCircle className="w-4 h-4" />
                          }
                          {entry.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`text-lg font-medium ${entry.type === 'Inflow' ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.type === 'Inflow' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black">{entry.account}</div>
                        <div className="text-xs text-black">{entry.reference}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                        <div className="text-xs text-black">{entry.source}</div>
                      </div>
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
            Showing {filteredEntries.length} of {cashFlowEntries.length} cash flow entries
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
                    <h2 className="text-2xl font-bold text-black">Cash Flow Entry Details</h2>
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
                      <label className="block text-sm font-medium text-black mb-1">Category</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedEntry.category)}`}>
                        {selectedEntry.category}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Type</label>
                      <div className={`flex items-center gap-1 ${selectedEntry.type === 'Inflow' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedEntry.type === 'Inflow' ?
                          <ArrowUpCircle className="w-4 h-4" /> :
                          <ArrowDownCircle className="w-4 h-4" />
                        }
                        {selectedEntry.type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Financial Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-black">Amount</p>
                        <p className={`text-2xl font-bold ${selectedEntry.type === 'Inflow' ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedEntry.type === 'Inflow' ? '+' : '-'}{formatCurrency(selectedEntry.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account & Source */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Account & Source</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Account</label>
                      <p className="text-black">{selectedEntry.account}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Source</label>
                      <p className="text-black">{selectedEntry.source}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Description</h3>
                  <p className="text-black">{selectedEntry.description}</p>
                  {selectedEntry.notes && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-black mb-1">Notes</label>
                      <p className="text-black text-sm">{selectedEntry.notes}</p>
                    </div>
                  )}
                </div>

                {/* Status & Audit */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Status & Audit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Status</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEntry.status)}`}>
                        {selectedEntry.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Created By</label>
                      <p className="text-black">{selectedEntry.createdBy}</p>
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
                <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}