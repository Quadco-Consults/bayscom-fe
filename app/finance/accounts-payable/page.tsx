'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  CreditCard,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Banknote,
  Receipt,
  Calculator
} from 'lucide-react'

interface AccountsPayable {
  id: string
  invoiceNumber: string
  vendor: {
    name: string
    contact: string
    email: string
    phone: string
    address: string
  }
  description: string
  invoiceDate: string
  dueDate: string
  amount: number
  amountPaid: number
  balance: number
  status: 'Outstanding' | 'Overdue' | 'Paid' | 'Partial' | 'Disputed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  category: 'Fuel Purchase' | 'Maintenance' | 'Equipment' | 'Services' | 'Utilities' | 'Other'
  terms: string
  purchaseOrder: string
  approvedBy: string
  lastPayment: string | null
  createdDate: string
}

const mockAccountsPayable: AccountsPayable[] = [
  {
    id: '1',
    invoiceNumber: 'INV-NNPC-2024-001',
    vendor: {
      name: 'Nigerian National Petroleum Corporation',
      contact: 'Musa Bello',
      email: 'procurement@nnpc.gov.ng',
      phone: '+234 803 123 4567',
      address: 'NNPC Towers, Abuja'
    },
    description: 'Premium Motor Spirit (PMS) - 50,000 Liters',
    invoiceDate: '2024-01-15',
    dueDate: '2024-02-14',
    amount: 8500000,
    amountPaid: 0,
    balance: 8500000,
    status: 'Outstanding',
    priority: 'High',
    category: 'Fuel Purchase',
    terms: '30 Days',
    purchaseOrder: 'PO-2024-001',
    approvedBy: 'John Adebayo',
    lastPayment: null,
    createdDate: '2024-01-15'
  },
  {
    id: '2',
    invoiceNumber: 'INV-TECH-2024-005',
    vendor: {
      name: 'TechMaint Services Ltd',
      contact: 'Grace Okafor',
      email: 'billing@techmaint.ng',
      phone: '+234 701 234 5678',
      address: 'Industrial Estate, Lagos'
    },
    description: 'Fleet vehicle maintenance and repairs',
    invoiceDate: '2024-01-10',
    dueDate: '2024-01-25',
    amount: 750000,
    amountPaid: 300000,
    balance: 450000,
    status: 'Overdue',
    priority: 'Critical',
    category: 'Maintenance',
    terms: '15 Days',
    purchaseOrder: 'PO-2024-002',
    approvedBy: 'Sarah Ibrahim',
    lastPayment: '2024-01-20',
    createdDate: '2024-01-10'
  },
  {
    id: '3',
    invoiceNumber: 'INV-UTIL-2024-003',
    vendor: {
      name: 'NEPA Power Distribution',
      contact: 'Ahmed Yunusa',
      email: 'commercial@nepa.ng',
      phone: '+234 909 876 5432',
      address: 'Electricity House, Kaduna'
    },
    description: 'Electricity bill - January 2024',
    invoiceDate: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 285000,
    amountPaid: 285000,
    balance: 0,
    status: 'Paid',
    priority: 'Medium',
    category: 'Utilities',
    terms: 'Due on Receipt',
    purchaseOrder: 'N/A',
    approvedBy: 'Michael Okafor',
    lastPayment: '2024-01-28',
    createdDate: '2024-01-01'
  },
  {
    id: '4',
    invoiceNumber: 'INV-EQUIP-2024-007',
    vendor: {
      name: 'Industrial Equipment Co.',
      contact: 'Fatima Abdullahi',
      email: 'sales@indequip.com.ng',
      phone: '+234 802 345 6789',
      address: 'Trade Fair Complex, Lagos'
    },
    description: 'Storage tank monitoring system',
    invoiceDate: '2024-01-12',
    dueDate: '2024-02-11',
    amount: 3200000,
    amountPaid: 1600000,
    balance: 1600000,
    status: 'Partial',
    priority: 'Medium',
    category: 'Equipment',
    terms: '30 Days',
    purchaseOrder: 'PO-2024-004',
    approvedBy: 'John Adebayo',
    lastPayment: '2024-01-25',
    createdDate: '2024-01-12'
  },
  {
    id: '5',
    invoiceNumber: 'INV-SERV-2024-009',
    vendor: {
      name: 'Professional Security Services',
      contact: 'Ibrahim Suleiman',
      email: 'accounts@prosecurity.ng',
      phone: '+234 805 432 1098',
      address: 'Security Plaza, Abuja'
    },
    description: 'Security services - January 2024',
    invoiceDate: '2024-01-08',
    dueDate: '2024-01-23',
    amount: 425000,
    amountPaid: 0,
    balance: 425000,
    status: 'Disputed',
    priority: 'Low',
    category: 'Services',
    terms: '15 Days',
    purchaseOrder: 'PO-2024-003',
    approvedBy: 'Grace Nnenna',
    lastPayment: null,
    createdDate: '2024-01-08'
  },
  {
    id: '6',
    invoiceNumber: 'INV-FUEL-2024-011',
    vendor: {
      name: 'Total Energies Nigeria',
      contact: 'Jean-Paul Dubois',
      email: 'commercial@totalenergies.ng',
      phone: '+234 701 555 0123',
      address: 'Victoria Island, Lagos'
    },
    description: 'Automotive Gas Oil (AGO) - 30,000 Liters',
    invoiceDate: '2024-01-14',
    dueDate: '2024-02-13',
    amount: 6300000,
    amountPaid: 0,
    balance: 6300000,
    status: 'Outstanding',
    priority: 'High',
    category: 'Fuel Purchase',
    terms: '30 Days',
    purchaseOrder: 'PO-2024-005',
    approvedBy: 'John Adebayo',
    lastPayment: null,
    createdDate: '2024-01-14'
  }
]

export default function AccountsPayablePage() {
  const [payables, setPayables] = useState<AccountsPayable[]>(mockAccountsPayable)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedPayable, setSelectedPayable] = useState<AccountsPayable | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredPayables = payables.filter(payable => {
    const matchesSearch = payable.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payable.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payable.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || payable.status === statusFilter
    const matchesCategory = categoryFilter === 'All' || payable.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Outstanding': return 'text-blue-600 bg-blue-50'
      case 'Overdue': return 'text-red-600 bg-red-50'
      case 'Paid': return 'text-green-600 bg-green-50'
      case 'Partial': return 'text-yellow-600 bg-yellow-50'
      case 'Disputed': return 'text-orange-600 bg-orange-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Outstanding': return <Clock className="w-4 h-4" />
      case 'Overdue': return <AlertTriangle className="w-4 h-4" />
      case 'Paid': return <CheckCircle className="w-4 h-4" />
      case 'Partial': return <Clock className="w-4 h-4" />
      case 'Disputed': return <AlertTriangle className="w-4 h-4" />
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
    return filteredPayables.reduce((sum, payable) => sum + payable.balance, 0)
  }

  const getOverdueCount = () => {
    return filteredPayables.filter(payable => payable.status === 'Overdue').length
  }

  const getOutstandingCount = () => {
    return filteredPayables.filter(payable =>
      payable.status === 'Outstanding' || payable.status === 'Partial'
    ).length
  }

  const getTotalPaid = () => {
    return filteredPayables.reduce((sum, payable) => sum + payable.amountPaid, 0)
  }

  const openModal = (payable: AccountsPayable) => {
    setSelectedPayable(payable)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedPayable(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Vendor', 'Description', 'Invoice Date', 'Due Date', 'Amount', 'Balance', 'Status', 'Priority']
    const csvData = filteredPayables.map(payable => [
      payable.invoiceNumber,
      payable.vendor.name,
      payable.description,
      payable.invoiceDate,
      payable.dueDate,
      payable.amount,
      payable.balance,
      payable.status,
      payable.priority
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'accounts-payable.csv')
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
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Accounts Payable</h1>
              <p className="text-black">Manage vendor payments and outstanding bills</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Owed</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(calculateTotalOwed())}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Outstanding Bills</p>
                <p className="text-2xl font-bold text-blue-600">{getOutstandingCount()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Overdue Items</p>
                <p className="text-2xl font-bold text-orange-600">{getOverdueCount()}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalPaid())}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                  placeholder="Search vendors, invoices, descriptions..."
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
                <option value="Disputed">Disputed</option>
              </select>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Fuel Purchase">Fuel Purchase</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Equipment">Equipment</option>
                <option value="Services">Services</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
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
                New Bill
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Payable Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Vendor & Invoice
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
                {filteredPayables.map((payable) => (
                  <tr key={payable.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{payable.vendor.name}</div>
                        <div className="text-sm text-black">{payable.invoiceNumber}</div>
                        <div className="text-xs text-black">{payable.vendor.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black">{payable.description}</div>
                        <div className="text-xs text-black">{payable.category}</div>
                        <div className="text-xs text-black">PO: {payable.purchaseOrder}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Invoice: {payable.invoiceDate}
                        </div>
                        <div className="text-sm text-black">
                          Due: {payable.dueDate}
                        </div>
                        <div className="text-xs text-black">{payable.terms}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <div className="font-medium text-black">{formatCurrency(payable.amount)}</div>
                        <div className="text-sm text-black">Paid: {formatCurrency(payable.amountPaid)}</div>
                        <div className="text-sm font-medium text-red-600">Balance: {formatCurrency(payable.balance)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payable.status)}`}>
                          {getStatusIcon(payable.status)}
                          {payable.status}
                        </span>
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(payable.priority)}`}>
                            {payable.priority} Priority
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(payable)}
                          className="p-2 text-black hover:text-[#8B1538] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-black hover:text-[#E67E22] transition-colors"
                          title="Edit Bill"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-black hover:text-green-600 transition-colors"
                          title="Make Payment"
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
            Showing {filteredPayables.length} of {payables.length} payable items
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
        {showModal && selectedPayable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">{selectedPayable.invoiceNumber}</h2>
                    <p className="text-black">Accounts Payable Details</p>
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
                {/* Vendor Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Vendor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Company Name</label>
                        <p className="text-black">{selectedPayable.vendor.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Contact Person</label>
                        <p className="text-black">{selectedPayable.vendor.contact}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Email</label>
                        <p className="text-black">{selectedPayable.vendor.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Phone</label>
                        <p className="text-black">{selectedPayable.vendor.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Address</label>
                        <p className="text-black">{selectedPayable.vendor.address}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Purchase Order</label>
                        <p className="text-black">{selectedPayable.purchaseOrder}</p>
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
                        <p className="text-black">{selectedPayable.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Category</label>
                        <p className="text-black">{selectedPayable.category}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Payment Terms</label>
                        <p className="text-black">{selectedPayable.terms}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Invoice Date</label>
                        <p className="text-black">{selectedPayable.invoiceDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Due Date</label>
                        <p className="text-black">{selectedPayable.dueDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Approved By</label>
                        <p className="text-black">{selectedPayable.approvedBy}</p>
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
                          <p className="text-xl font-bold text-blue-900">{formatCurrency(selectedPayable.amount)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Amount Paid</p>
                          <p className="text-xl font-bold text-green-900">{formatCurrency(selectedPayable.amountPaid)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-700">Outstanding Balance</p>
                          <p className="text-xl font-bold text-red-900">{formatCurrency(selectedPayable.balance)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Status & Priority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Current Status</label>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayable.status)}`}>
                        {getStatusIcon(selectedPayable.status)}
                        {selectedPayable.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Priority Level</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedPayable.priority)}`}>
                        {selectedPayable.priority} Priority
                      </span>
                    </div>
                  </div>
                  {selectedPayable.lastPayment && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-black mb-1">Last Payment Date</label>
                      <p className="text-black">{selectedPayable.lastPayment}</p>
                    </div>
                  )}
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
                  Edit Bill
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Make Payment
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