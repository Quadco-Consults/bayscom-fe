'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  DollarSign,
  Calculator,
  Building,
  CreditCard,
  Receipt,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react'

interface FinancialReport {
  id: string
  name: string
  description: string
  category: 'Financial Statements' | 'Cash Flow' | 'Budget Analysis' | 'Tax Reports' | 'Management Reports'
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'On-Demand'
  lastGenerated: string
  nextScheduled?: string
  status: 'Up to Date' | 'Pending' | 'Overdue' | 'In Progress'
  fileSize?: string
  format: 'PDF' | 'Excel' | 'CSV' | 'Word'
  icon: React.ComponentType<{ className?: string }>
}

const mockFinancialReports: FinancialReport[] = [
  {
    id: '1',
    name: 'Income Statement',
    description: 'Profit & Loss statement showing revenue, expenses, and net income',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-01-15',
    nextScheduled: '2024-02-15',
    status: 'Up to Date',
    fileSize: '2.3 MB',
    format: 'PDF',
    icon: TrendingUp
  },
  {
    id: '2',
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity at a specific point in time',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-01-15',
    nextScheduled: '2024-02-15',
    status: 'Up to Date',
    fileSize: '1.8 MB',
    format: 'PDF',
    icon: Calculator
  },
  {
    id: '3',
    name: 'Cash Flow Statement',
    description: 'Operating, investing, and financing cash flows',
    category: 'Cash Flow',
    frequency: 'Weekly',
    lastGenerated: '2024-01-12',
    nextScheduled: '2024-01-19',
    status: 'Overdue',
    fileSize: '1.2 MB',
    format: 'Excel',
    icon: DollarSign
  },
  {
    id: '4',
    name: 'Accounts Receivable Aging',
    description: 'Customer payment status and overdue analysis',
    category: 'Management Reports',
    frequency: 'Weekly',
    lastGenerated: '2024-01-16',
    status: 'Up to Date',
    fileSize: '856 KB',
    format: 'Excel',
    icon: Clock
  },
  {
    id: '5',
    name: 'Accounts Payable Summary',
    description: 'Vendor payment obligations and due dates',
    category: 'Management Reports',
    frequency: 'Weekly',
    lastGenerated: '2024-01-14',
    nextScheduled: '2024-01-21',
    status: 'Pending',
    fileSize: '1.1 MB',
    format: 'PDF',
    icon: CreditCard
  },
  {
    id: '6',
    name: 'Budget vs Actual',
    description: 'Comparison of budgeted vs actual performance',
    category: 'Budget Analysis',
    frequency: 'Monthly',
    lastGenerated: '2024-01-10',
    nextScheduled: '2024-02-10',
    status: 'Up to Date',
    fileSize: '3.2 MB',
    format: 'Excel',
    icon: Target
  },
  {
    id: '7',
    name: 'VAT Return',
    description: 'Value Added Tax return for regulatory compliance',
    category: 'Tax Reports',
    frequency: 'Monthly',
    lastGenerated: '2024-01-05',
    nextScheduled: '2024-02-05',
    status: 'In Progress',
    format: 'PDF',
    icon: Receipt
  },
  {
    id: '8',
    name: 'Trial Balance',
    description: 'All account balances to verify accounting accuracy',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-01-16',
    status: 'Up to Date',
    fileSize: '924 KB',
    format: 'Excel',
    icon: CheckCircle
  },
  {
    id: '9',
    name: 'Daily Sales Report',
    description: 'Daily revenue breakdown by product and location',
    category: 'Management Reports',
    frequency: 'Daily',
    lastGenerated: '2024-01-16',
    nextScheduled: '2024-01-17',
    status: 'Up to Date',
    fileSize: '445 KB',
    format: 'Excel',
    icon: BarChart3
  },
  {
    id: '10',
    name: 'Fixed Assets Register',
    description: 'Inventory and depreciation of fixed assets',
    category: 'Management Reports',
    frequency: 'Quarterly',
    lastGenerated: '2024-01-01',
    nextScheduled: '2024-04-01',
    status: 'Up to Date',
    fileSize: '2.7 MB',
    format: 'Excel',
    icon: Building
  }
]

const reportMetrics = {
  totalReports: mockFinancialReports.length,
  upToDate: mockFinancialReports.filter(r => r.status === 'Up to Date').length,
  overdue: mockFinancialReports.filter(r => r.status === 'Overdue').length,
  pending: mockFinancialReports.filter(r => r.status === 'Pending' || r.status === 'In Progress').length
}

export default function FinancialReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>(mockFinancialReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [frequencyFilter, setFrequencyFilter] = useState('All')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || report.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter
    const matchesFrequency = frequencyFilter === 'All' || report.frequency === frequencyFilter

    return matchesSearch && matchesCategory && matchesStatus && matchesFrequency
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Up to Date': return 'text-green-600 bg-green-50'
      case 'Pending': return 'text-yellow-600 bg-yellow-50'
      case 'Overdue': return 'text-red-600 bg-red-50'
      case 'In Progress': return 'text-blue-600 bg-blue-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial Statements': return 'text-blue-600 bg-blue-50'
      case 'Cash Flow': return 'text-green-600 bg-green-50'
      case 'Budget Analysis': return 'text-purple-600 bg-purple-50'
      case 'Tax Reports': return 'text-red-600 bg-red-50'
      case 'Management Reports': return 'text-orange-600 bg-orange-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'text-green-600 bg-green-50'
      case 'Weekly': return 'text-blue-600 bg-blue-50'
      case 'Monthly': return 'text-purple-600 bg-purple-50'
      case 'Quarterly': return 'text-orange-600 bg-orange-50'
      case 'Annually': return 'text-red-600 bg-red-50'
      case 'On-Demand': return 'text-black bg-gray-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const generateReport = (reportId: string) => {
    setReports(reports.map(report =>
      report.id === reportId
        ? { ...report, status: 'In Progress' as const }
        : report
    ))

    // Simulate report generation
    setTimeout(() => {
      setReports(reports.map(report =>
        report.id === reportId
          ? {
              ...report,
              status: 'Up to Date' as const,
              lastGenerated: new Date().toISOString().split('T')[0],
              fileSize: `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}MB`
            }
          : report
      ))
    }, 2000)
  }

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
              <h1 className="text-2xl font-bold text-black">Financial Reports</h1>
              <p className="text-black">Generate and manage financial reports and statements</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-black">{reportMetrics.totalReports}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Up to Date</p>
                <p className="text-2xl font-bold text-green-600">{reportMetrics.upToDate}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{reportMetrics.overdue}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{reportMetrics.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
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
                  placeholder="Search reports by name or description..."
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
                <option value="Financial Statements">Financial Statements</option>
                <option value="Cash Flow">Cash Flow</option>
                <option value="Budget Analysis">Budget Analysis</option>
                <option value="Tax Reports">Tax Reports</option>
                <option value="Management Reports">Management Reports</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Up to Date">Up to Date</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div>
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Frequencies</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
                <option value="On-Demand">On-Demand</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const IconComponent = report.icon
            return (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#8B1538] bg-opacity-10 rounded-lg">
                      <IconComponent className="w-5 h-5 text-[#8B1538]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{report.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-black mb-4">{report.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Category</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                      {report.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Frequency</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(report.frequency)}`}>
                      {report.frequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Last Generated</span>
                    <span className="text-black">{report.lastGenerated}</span>
                  </div>

                  {report.nextScheduled && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Next Due</span>
                      <span className="text-black">{report.nextScheduled}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Format</span>
                    <span className="text-black font-medium">{report.format}</span>
                  </div>

                  {report.fileSize && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black">File Size</span>
                      <span className="text-black">{report.fileSize}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => generateReport(report.id)}
                    disabled={report.status === 'In Progress'}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      report.status === 'In Progress'
                        ? 'bg-gray-300 text-black cursor-not-allowed'
                        : 'bg-[#8B1538] text-white hover:bg-[#7a1230]'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    {report.status === 'In Progress' ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-black mb-6">Quick Report Generation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#8B1538] hover:bg-[#8B1538] hover:bg-opacity-5 transition-colors group">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-[#8B1538] group-hover:bg-opacity-10">
                <TrendingUp className="w-5 h-5 text-blue-600 group-hover:text-[#8B1538]" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-black">Monthly Financial Package</h4>
                <p className="text-sm text-black">Income Statement, Balance Sheet, Cash Flow</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#8B1538] hover:bg-[#8B1538] hover:bg-opacity-5 transition-colors group">
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-[#8B1538] group-hover:bg-opacity-10">
                <BarChart3 className="w-5 h-5 text-green-600 group-hover:text-[#8B1538]" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-black">Management Dashboard</h4>
                <p className="text-sm text-black">KPIs, Budget Analysis, Performance Metrics</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#8B1538] hover:bg-[#8B1538] hover:bg-opacity-5 transition-colors group">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-[#8B1538] group-hover:bg-opacity-10">
                <Receipt className="w-5 h-5 text-purple-600 group-hover:text-[#8B1538]" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-black">Tax Compliance Pack</h4>
                <p className="text-sm text-black">VAT Returns, Tax Reports, Audit Trail</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}