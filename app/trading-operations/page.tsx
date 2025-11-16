'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  FileText,
  Users,
  MapPin,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Plus,
  ArrowUpDown,
  Briefcase,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

interface TradingOperation {
  id: string
  contractNumber: string
  trader: string
  counterparty: string
  product: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalValue: number
  deliveryLocation: string
  deliveryDate: string
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled' | 'On Hold'
  riskLevel: 'Low' | 'Medium' | 'High'
  marginRequirement: number
  currentMargin: number
  profitLoss: number
  createdDate: string
  lastUpdated: string
}

const mockTradingOperations: TradingOperation[] = [
  {
    id: '1',
    contractNumber: 'TC-2024-001',
    trader: 'John Smith',
    counterparty: 'Nigerian National Petroleum Corporation',
    product: 'Crude Oil (Bonny Light)',
    quantity: 50000,
    unit: 'Barrels',
    pricePerUnit: 85.50,
    totalValue: 4275000,
    deliveryLocation: 'Port Harcourt Terminal',
    deliveryDate: '2024-01-25',
    status: 'Active',
    riskLevel: 'Low',
    marginRequirement: 427500,
    currentMargin: 450000,
    profitLoss: 125000,
    createdDate: '2024-01-10',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    contractNumber: 'TC-2024-002',
    trader: 'Sarah Johnson',
    counterparty: 'Total Energies Nigeria',
    product: 'Premium Motor Spirit (PMS)',
    quantity: 30000,
    unit: 'Liters',
    pricePerUnit: 195.00,
    totalValue: 5850000,
    deliveryLocation: 'Lagos Depot',
    deliveryDate: '2024-01-20',
    status: 'Pending',
    riskLevel: 'Medium',
    marginRequirement: 585000,
    currentMargin: 600000,
    profitLoss: -15000,
    createdDate: '2024-01-12',
    lastUpdated: '2024-01-16'
  },
  {
    id: '3',
    contractNumber: 'TC-2024-003',
    trader: 'Michael Chen',
    counterparty: 'Chevron Nigeria Limited',
    product: 'Automotive Gas Oil (AGO)',
    quantity: 25000,
    unit: 'Liters',
    pricePerUnit: 210.00,
    totalValue: 5250000,
    deliveryLocation: 'Warri Refinery',
    deliveryDate: '2024-01-18',
    status: 'Completed',
    riskLevel: 'Low',
    marginRequirement: 525000,
    currentMargin: 525000,
    profitLoss: 75000,
    createdDate: '2024-01-08',
    lastUpdated: '2024-01-18'
  },
  {
    id: '4',
    contractNumber: 'TC-2024-004',
    trader: 'Emma Wilson',
    counterparty: 'Shell Petroleum Development Company',
    product: 'Liquefied Petroleum Gas (LPG)',
    quantity: 15000,
    unit: 'Kg',
    pricePerUnit: 450.00,
    totalValue: 6750000,
    deliveryLocation: 'Onne Port',
    deliveryDate: '2024-01-30',
    status: 'Active',
    riskLevel: 'High',
    marginRequirement: 675000,
    currentMargin: 700000,
    profitLoss: 200000,
    createdDate: '2024-01-14',
    lastUpdated: '2024-01-16'
  },
  {
    id: '5',
    contractNumber: 'TC-2024-005',
    trader: 'David Adebayo',
    counterparty: 'Mobil Producing Nigeria',
    product: 'Jet Fuel (ATK)',
    quantity: 40000,
    unit: 'Liters',
    pricePerUnit: 275.00,
    totalValue: 11000000,
    deliveryLocation: 'Murtala Mohammed Airport',
    deliveryDate: '2024-02-05',
    status: 'On Hold',
    riskLevel: 'Medium',
    marginRequirement: 1100000,
    currentMargin: 1050000,
    profitLoss: -50000,
    createdDate: '2024-01-16',
    lastUpdated: '2024-01-16'
  }
]

export default function TradingOperationsPage() {
  const [operations, setOperations] = useState<TradingOperation[]>(mockTradingOperations)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [selectedOperation, setSelectedOperation] = useState<TradingOperation | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.trader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || operation.status === statusFilter
    const matchesRisk = riskFilter === 'All' || operation.riskLevel === riskFilter

    return matchesSearch && matchesStatus && matchesRisk
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50'
      case 'Pending': return 'text-yellow-600 bg-yellow-50'
      case 'Completed': return 'text-blue-600 bg-blue-50'
      case 'Cancelled': return 'text-red-600 bg-red-50'
      case 'On Hold': return 'text-orange-600 bg-orange-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'High': return 'text-red-600 bg-red-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />
      case 'Pending': return <Clock className="w-4 h-4" />
      case 'Completed': return <Target className="w-4 h-4" />
      case 'Cancelled': return <AlertTriangle className="w-4 h-4" />
      case 'On Hold': return <Clock className="w-4 h-4" />
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const calculateTotalValue = () => {
    return filteredOperations.reduce((sum, operation) => sum + operation.totalValue, 0)
  }

  const calculateTotalProfitLoss = () => {
    return filteredOperations.reduce((sum, operation) => sum + operation.profitLoss, 0)
  }

  const getActiveContracts = () => {
    return filteredOperations.filter(op => op.status === 'Active').length
  }

  const openModal = (operation: TradingOperation) => {
    setSelectedOperation(operation)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedOperation(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Contract Number', 'Trader', 'Counterparty', 'Product', 'Quantity', 'Unit', 'Price/Unit', 'Total Value', 'Status', 'Risk Level', 'P&L']
    const csvData = filteredOperations.map(op => [
      op.contractNumber,
      op.trader,
      op.counterparty,
      op.product,
      op.quantity,
      op.unit,
      op.pricePerUnit,
      op.totalValue,
      op.status,
      op.riskLevel,
      op.profitLoss
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'trading-operations.csv')
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
              <h1 className="text-2xl font-bold text-black">Trading Operations</h1>
              <p className="text-black">Manage commodity trading and market operations</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Value</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(calculateTotalValue())}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Active Contracts</p>
                <p className="text-2xl font-bold text-black">{getActiveContracts()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total P&L</p>
                <p className={`text-2xl font-bold ${calculateTotalProfitLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculateTotalProfitLoss())}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Operations</p>
                <p className="text-2xl font-bold text-black">{filteredOperations.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search contracts, traders, counterparties..."
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
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
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
                New Contract
              </button>
            </div>
          </div>
        </div>

        {/* Trading Operations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Contract Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Product & Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Financial Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status & Risk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Delivery Info
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOperations.map((operation) => (
                  <tr key={operation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{operation.contractNumber}</div>
                        <div className="text-sm text-black">{operation.trader}</div>
                        <div className="text-xs text-black">{operation.counterparty}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{operation.product}</div>
                        <div className="text-sm text-black">
                          {formatNumber(operation.quantity)} {operation.unit}
                        </div>
                        <div className="text-xs text-black">
                          {formatCurrency(operation.pricePerUnit)}/{operation.unit}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{formatCurrency(operation.totalValue)}</div>
                        <div className={`text-sm ${operation.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          P&L: {formatCurrency(operation.profitLoss)}
                        </div>
                        <div className="text-xs text-black">
                          Margin: {formatCurrency(operation.currentMargin)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                          {getStatusIcon(operation.status)}
                          {operation.status}
                        </span>
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(operation.riskLevel)}`}>
                            {operation.riskLevel} Risk
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {operation.deliveryLocation}
                        </div>
                        <div className="text-sm text-black flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {operation.deliveryDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(operation)}
                          className="p-2 text-black hover:text-[#8B1538] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-black hover:text-[#E67E22] transition-colors"
                          title="Edit Contract"
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
            Showing {filteredOperations.length} of {operations.length} trading operations
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
        {showModal && selectedOperation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">{selectedOperation.contractNumber}</h2>
                    <p className="text-black">Trading Contract Details</p>
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
                {/* Contract Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Contract Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Contract Number</label>
                        <p className="text-black">{selectedOperation.contractNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Trader</label>
                        <p className="text-black">{selectedOperation.trader}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Counterparty</label>
                        <p className="text-black">{selectedOperation.counterparty}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Status</label>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOperation.status)}`}>
                          {getStatusIcon(selectedOperation.status)}
                          {selectedOperation.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Product</label>
                        <p className="text-black">{selectedOperation.product}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Quantity</label>
                        <p className="text-black">{formatNumber(selectedOperation.quantity)} {selectedOperation.unit}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Price per Unit</label>
                        <p className="text-black">{formatCurrency(selectedOperation.pricePerUnit)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Risk Level</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedOperation.riskLevel)}`}>
                          {selectedOperation.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Total Contract Value</p>
                          <p className="text-xl font-bold text-blue-900">{formatCurrency(selectedOperation.totalValue)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Profit & Loss</p>
                          <p className={`text-xl font-bold ${selectedOperation.profitLoss >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                            {formatCurrency(selectedOperation.profitLoss)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Current Margin</p>
                          <p className="text-xl font-bold text-orange-900">{formatCurrency(selectedOperation.currentMargin)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Delivery Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Delivery Location</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-black">{selectedOperation.deliveryLocation}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Delivery Date</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-black">{selectedOperation.deliveryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Contract Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Created Date</label>
                      <p className="text-black">{selectedOperation.createdDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Last Updated</label>
                      <p className="text-black">{selectedOperation.lastUpdated}</p>
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
                  Edit Contract
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