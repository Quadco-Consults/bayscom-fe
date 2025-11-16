'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Receipt,
  Calculator,
  Banknote
} from 'lucide-react'

interface AccountsReceivable {
  id: string
  invoiceNumber: string
  customer: {
    name: string
    contact: string
    email: string
    phone: string
    address: string
    creditLimit: number
    creditRating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  }
  description: string
  salesOrder: string
  invoiceDate: string
  dueDate: string
  amount: number
  amountReceived: number
  balance: number
  status: 'Outstanding' | 'Overdue' | 'Paid' | 'Partial' | 'Written Off'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  category: 'Fuel Sales' | 'LPG Sales' | 'Equipment Rental' | 'Services' | 'Transport' | 'Other'
  terms: string
  salesPerson: string
  lastPayment: string | null
  daysPastDue: number
  createdDate: string
}

const mockAccountsReceivable: AccountsReceivable[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customer: {
      name: 'Dangote Industries Limited',
      contact: 'Aliko Dangote',
      email: 'procurement@dangote.com',
      phone: '+234 803 123 4567',
      address: '1 Alfred Rewane Road, Ikoyi, Lagos',
      creditLimit: 50000000,
      creditRating: 'Excellent'
    },
    description: 'Premium Motor Spirit (PMS) - 100,000 Liters',
    salesOrder: 'SO-2024-001',
    invoiceDate: '2024-01-10',
    dueDate: '2024-02-09',
    amount: 17000000,
    amountReceived: 0,
    balance: 17000000,
    status: 'Outstanding',
    priority: 'High',
    category: 'Fuel Sales',
    terms: '30 Days',
    salesPerson: 'John Adebayo',
    lastPayment: null,
    daysPastDue: 0,
    createdDate: '2024-01-10'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customer: {
      name: 'Lagos State Government',
      contact: 'Commissioner of Transport',
      email: 'transport@lagosstate.gov.ng',
      phone: '+234 701 234 5678',
      address: 'Secretariat, Alausa, Ikeja, Lagos',
      creditLimit: 25000000,
      creditRating: 'Good'
    },
    description: 'Automotive Gas Oil (AGO) - Fleet Refueling',
    salesOrder: 'SO-2024-002',
    invoiceDate: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 8500000,
    amountReceived: 3000000,
    balance: 5500000,
    status: 'Overdue',
    priority: 'Critical',
    category: 'Fuel Sales',
    terms: '15 Days',
    salesPerson: 'Sarah Ibrahim',
    lastPayment: '2024-01-25',
    daysPastDue: 12,
    createdDate: '2024-01-05'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customer: {
      name: 'BUA Cement Plc',
      contact: 'Abdul Samad Rabiu',
      email: 'logistics@buacement.com',
      phone: '+234 909 876 5432',
      address: 'BUA House, Abuja',
      creditLimit: 30000000,
      creditRating: 'Excellent'
    },
    description: 'LPG Supply - Industrial Use',
    salesOrder: 'SO-2024-003',
    invoiceDate: '2024-01-15',
    dueDate: '2024-01-30',
    amount: 4200000,
    amountReceived: 4200000,
    balance: 0,
    status: 'Paid',
    priority: 'Medium',
    category: 'LPG Sales',
    terms: '15 Days',
    salesPerson: 'Michael Okafor',
    lastPayment: '2024-01-28',
    daysPastDue: 0,
    createdDate: '2024-01-15'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customer: {
      name: 'Nigerian Breweries Plc',
      contact: 'Hans Essaadi',
      email: 'procurement@nbplc.com',
      phone: '+234 802 345 6789',
      address: 'Iganmu, Lagos',
      creditLimit: 20000000,
      creditRating: 'Good'
    },
    description: 'Equipment Rental - Fuel Dispensing Units',
    salesOrder: 'SO-2024-004',
    invoiceDate: '2024-01-12',
    dueDate: '2024-02-11',
    amount: 1800000,
    amountReceived: 900000,
    balance: 900000,
    status: 'Partial',
    priority: 'Medium',
    category: 'Equipment Rental',
    terms: '30 Days',
    salesPerson: 'Grace Nnenna',
    lastPayment: '2024-01-20',
    daysPastDue: 0,
    createdDate: '2024-01-12'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    customer: {
      name: 'First Bank of Nigeria',
      contact: 'Adesola Adeduntan',
      email: 'fleet@firstbanknigeria.com',
      phone: '+234 805 432 1098',
      address: 'Samuel Asabia House, Marina, Lagos',
      creditLimit: 15000000,
      creditRating: 'Excellent'
    },
    description: 'Fleet Fuel Cards - Monthly Supply',
    salesOrder: 'SO-2024-005',
    invoiceDate: '2024-01-08',
    dueDate: '2024-01-23',
    amount: 3600000,
    amountReceived: 0,
    balance: 3600000,
    status: 'Overdue',
    priority: 'High',
    category: 'Fuel Sales',
    terms: '15 Days',
    salesPerson: 'David Adebayo',
    lastPayment: null,
    daysPastDue: 8,
    createdDate: '2024-01-08'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    customer: {
      name: 'MTN Nigeria Communications',
      contact: 'Karl Toriola',
      email: 'procurement@mtnnigeria.net',
      phone: '+234 701 555 0123',
      address: 'Falomo, Ikoyi, Lagos',
      creditLimit: 25000000,
      creditRating: 'Good'
    },
    description: 'Generator Fuel Supply - Base Stations',
    salesOrder: 'SO-2024-006',
    invoiceDate: '2024-01-14',
    dueDate: '2024-02-13',
    amount: 12500000,
    amountReceived: 0,
    balance: 12500000,
    status: 'Outstanding',
    priority: 'High',
    category: 'Fuel Sales',
    terms: '30 Days',
    salesPerson: 'John Adebayo',
    lastPayment: null,
    daysPastDue: 0,
    createdDate: '2024-01-14'
  }
]

export default function AccountsReceivablePage() {
  const [receivables, setReceivables] = useState<AccountsReceivable[]>(mockAccountsReceivable)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedReceivable, setSelectedReceivable] = useState<AccountsReceivable | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredReceivables = receivables.filter(receivable => {
    const matchesSearch = receivable.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receivable.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receivable.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || receivable.status === statusFilter
    const matchesCategory = categoryFilter === 'All' || receivable.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Outstanding': return 'text-blue-600 bg-blue-50'
      case 'Overdue': return 'text-red-600 bg-red-50'
      case 'Paid': return 'text-green-600 bg-green-50'
      case 'Partial': return 'text-yellow-600 bg-yellow-50'
      case 'Written Off': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCreditRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'text-green-600 bg-green-50'
      case 'Good': return 'text-blue-600 bg-blue-50'
      case 'Fair': return 'text-yellow-600 bg-yellow-50'
      case 'Poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Outstanding': return <Clock className="w-4 h-4" />
      case 'Overdue': return <AlertTriangle className="w-4 h-4" />
      case 'Paid': return <CheckCircle className="w-4 h-4" />
      case 'Partial': return <Clock className="w-4 h-4" />
      case 'Written Off': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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

  const calculateTotalOwed = () => {
    return filteredReceivables.reduce((sum, receivable) => sum + receivable.balance, 0)
  }

  const getOverdueCount = () => {
    return filteredReceivables.filter(receivable => receivable.status === 'Overdue').length
  }

  const getOutstandingCount = () => {
    return filteredReceivables.filter(receivable =>
      receivable.status === 'Outstanding' || receivable.status === 'Partial'
    ).length
  }

  const getTotalReceived = () => {
    return filteredReceivables.reduce((sum, receivable) => sum + receivable.amountReceived, 0)
  }

  const getAverageDaysPastDue = () => {
    const overdueItems = filteredReceivables.filter(r => r.status === 'Overdue')
    if (overdueItems.length === 0) return 0
    const totalDays = overdueItems.reduce((sum, item) => sum + item.daysPastDue, 0)
    return Math.round(totalDays / overdueItems.length)
  }

  const openModal = (receivable: AccountsReceivable) => {
    setSelectedReceivable(receivable)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedReceivable(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Customer', 'Description', 'Invoice Date', 'Due Date', 'Amount', 'Balance', 'Status', 'Priority']
    const csvData = filteredReceivables.map(receivable => [
      receivable.invoiceNumber,
      receivable.customer.name,
      receivable.description,
      receivable.invoiceDate,
      receivable.dueDate,
      receivable.amount,
      receivable.balance,
      receivable.status,
      receivable.priority
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'accounts-receivable.csv')
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
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Accounts Receivable</h1>
              <p className="text-black">Track customer payments and outstanding invoices</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Outstanding</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculateTotalOwed())}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Outstanding Invoices</p>
                <p className="text-2xl font-bold text-orange-600">{getOutstandingCount()}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">{getOverdueCount()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Received</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalReceived())}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Avg Days Overdue</p>
                <p className="text-2xl font-bold text-black">{getAverageDaysPastDue()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
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
                  placeholder="Search customers, invoices, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Outstanding">Outstanding</option>
                <option value="Overdue">Overdue</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Written Off">Written Off</option>
              </select>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Fuel Sales">Fuel Sales</option>
                <option value="LPG Sales">LPG Sales</option>
                <option value="Equipment Rental">Equipment Rental</option>
                <option value="Services">Services</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors">
                <Plus className="w-4 h-4" />
                New Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Receivable Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Customer & Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Description & Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Dates & Terms
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-black uppercase tracking-wider">
                    Financial Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status & Priority
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReceivables.map((receivable) => (
                  <tr key={receivable.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{receivable.customer.name}</div>
                        <div className="text-sm text-black">{receivable.invoiceNumber}</div>
                        <div className="text-xs text-black flex items-center gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCreditRatingColor(receivable.customer.creditRating)}`}>
                            {receivable.customer.creditRating}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black">{receivable.description}</div>
                        <div className="text-xs text-black">{receivable.category}</div>
                        <div className="text-xs text-black">SO: {receivable.salesOrder}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Invoice: {receivable.invoiceDate}
                        </div>
                        <div className="text-sm text-black">
                          Due: {receivable.dueDate}
                        </div>
                        <div className="text-xs text-black">{receivable.terms}</div>
                        {receivable.daysPastDue > 0 && (
                          <div className="text-xs text-red-600 font-medium">
                            {receivable.daysPastDue} days overdue
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <div className="font-medium text-black">{formatCurrency(receivable.amount)}</div>
                        <div className="text-sm text-black">Received: {formatCurrency(receivable.amountReceived)}</div>
                        <div className="text-sm font-medium text-blue-600">Balance: {formatCurrency(receivable.balance)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(receivable.status)}`}>
                          {getStatusIcon(receivable.status)}
                          {receivable.status}
                        </span>
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(receivable.priority)}`}>
                            {receivable.priority} Priority
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(receivable)}
                          className="p-2 text-gray-600 hover:text-[#8B1538] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-[#E67E22] transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                          title="Record Payment"
                        >
                          <Banknote className="w-4 h-4" />
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
            Showing {filteredReceivables.length} of {receivables.length} receivable items
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
        {showModal && selectedReceivable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">{selectedReceivable.invoiceNumber}</h2>
                    <p className="text-black">Accounts Receivable Details</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 transform rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Company Name</label>
                        <p className="text-black">{selectedReceivable.customer.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Contact Person</label>
                        <p className="text-black">{selectedReceivable.customer.contact}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Email</label>
                        <p className="text-black">{selectedReceivable.customer.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Phone</label>
                        <p className="text-black">{selectedReceivable.customer.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Address</label>
                        <p className="text-black">{selectedReceivable.customer.address}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Credit Limit</label>
                        <p className="text-black">{formatCurrency(selectedReceivable.customer.creditLimit)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Credit Rating</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCreditRatingColor(selectedReceivable.customer.creditRating)}`}>
                          {selectedReceivable.customer.creditRating}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Sales Person</label>
                        <p className="text-black">{selectedReceivable.salesPerson}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Invoice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Description</label>
                        <p className="text-black">{selectedReceivable.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Category</label>
                        <p className="text-black">{selectedReceivable.category}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Payment Terms</label>
                        <p className="text-black">{selectedReceivable.terms}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Invoice Date</label>
                        <p className="text-black">{selectedReceivable.invoiceDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Due Date</label>
                        <p className="text-black">{selectedReceivable.dueDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Sales Order</label>
                        <p className="text-black">{selectedReceivable.salesOrder}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Receipt className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Invoice Amount</p>
                          <p className="text-xl font-bold text-blue-900">{formatCurrency(selectedReceivable.amount)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Amount Received</p>
                          <p className="text-xl font-bold text-green-900">{formatCurrency(selectedReceivable.amountReceived)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Outstanding Balance</p>
                          <p className="text-xl font-bold text-orange-900">{formatCurrency(selectedReceivable.balance)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Status & Priority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Current Status</label>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReceivable.status)}`}>
                        {getStatusIcon(selectedReceivable.status)}
                        {selectedReceivable.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Priority Level</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedReceivable.priority)}`}>
                        {selectedReceivable.priority} Priority
                      </span>
                    </div>
                    {selectedReceivable.daysPastDue > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Days Past Due</label>
                        <p className="text-red-600 font-medium">{selectedReceivable.daysPastDue} days</p>
                      </div>
                    )}
                  </div>
                  {selectedReceivable.lastPayment && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-black mb-1">Last Payment Date</label>
                      <p className="text-black">{selectedReceivable.lastPayment}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#d86613] transition-colors">
                  Edit Invoice
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Record Payment
                </button>
                <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors">
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}