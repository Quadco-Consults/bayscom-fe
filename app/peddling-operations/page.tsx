'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ShoppingCart,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Fuel,
  BarChart3,
  User
} from 'lucide-react'

interface PeddlingOperation {
  id: string
  operationId: string
  vendorName: string
  vendorType: 'Mobile Vendor' | 'Fixed Kiosk' | 'Roadside Station' | 'Market Stall'
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  products: string[]
  dailySalesTarget: number
  actualSales: number
  salesDate: string
  operatingHours: string
  status: 'Active' | 'Closed' | 'Suspended' | 'Maintenance'
  performanceRating: number
  territory: string
  supervisor: string
  stockLevel: number
  revenueToday: number
  customersServed: number
  lastRestockDate: string
  nextScheduledRestock: string
  licensesValid: boolean
  complianceScore: number
}

const mockPeddlingOperations: PeddlingOperation[] = [
  {
    id: '1',
    operationId: 'PO-2024-001',
    vendorName: 'Mallam Sani Petrol Point',
    vendorType: 'Mobile Vendor',
    location: 'Kano Central Market',
    coordinates: { lat: 12.0022, lng: 8.5920 },
    products: ['Premium Motor Spirit (PMS)', 'Automotive Gas Oil (AGO)', 'Kerosene'],
    dailySalesTarget: 150000,
    actualSales: 165000,
    salesDate: '2024-01-16',
    operatingHours: '6:00 AM - 8:00 PM',
    status: 'Active',
    performanceRating: 4.8,
    territory: 'Kano Central',
    supervisor: 'Ahmed Bello',
    stockLevel: 85,
    revenueToday: 165000,
    customersServed: 45,
    lastRestockDate: '2024-01-15',
    nextScheduledRestock: '2024-01-18',
    licensesValid: true,
    complianceScore: 95
  },
  {
    id: '2',
    operationId: 'PO-2024-002',
    vendorName: 'Mama Kemi Fuel Station',
    vendorType: 'Fixed Kiosk',
    location: 'Lagos Island Commercial District',
    coordinates: { lat: 6.4541, lng: 3.3947 },
    products: ['Premium Motor Spirit (PMS)', 'Lubricants', 'Vehicle Accessories'],
    dailySalesTarget: 200000,
    actualSales: 185000,
    salesDate: '2024-01-16',
    operatingHours: '5:30 AM - 10:00 PM',
    status: 'Active',
    performanceRating: 4.5,
    territory: 'Lagos Island',
    supervisor: 'Funmi Adebayo',
    stockLevel: 70,
    revenueToday: 185000,
    customersServed: 62,
    lastRestockDate: '2024-01-14',
    nextScheduledRestock: '2024-01-17',
    licensesValid: true,
    complianceScore: 88
  },
  {
    id: '3',
    operationId: 'PO-2024-003',
    vendorName: 'Sunny Petroleum Corner',
    vendorType: 'Roadside Station',
    location: 'Abuja-Kaduna Expressway, Km 45',
    coordinates: { lat: 10.5264, lng: 7.4388 },
    products: ['Premium Motor Spirit (PMS)', 'Automotive Gas Oil (AGO)', 'Snacks & Beverages'],
    dailySalesTarget: 180000,
    actualSales: 195000,
    salesDate: '2024-01-16',
    operatingHours: '24/7',
    status: 'Active',
    performanceRating: 4.9,
    territory: 'FCT Expressway',
    supervisor: 'John Okoro',
    stockLevel: 92,
    revenueToday: 195000,
    customersServed: 78,
    lastRestockDate: '2024-01-16',
    nextScheduledRestock: '2024-01-19',
    licensesValid: true,
    complianceScore: 98
  },
  {
    id: '4',
    operationId: 'PO-2024-004',
    vendorName: 'Oga Tunde Mobile Sales',
    vendorType: 'Mobile Vendor',
    location: 'Port Harcourt Industrial Area',
    coordinates: { lat: 4.8156, lng: 7.0498 },
    products: ['Automotive Gas Oil (AGO)', 'Engine Oil', 'Battery Water'],
    dailySalesTarget: 120000,
    actualSales: 98000,
    salesDate: '2024-01-16',
    operatingHours: '7:00 AM - 6:00 PM',
    status: 'Maintenance',
    performanceRating: 4.2,
    territory: 'Rivers Industrial',
    supervisor: 'Grace Ogbonna',
    stockLevel: 45,
    revenueToday: 98000,
    customersServed: 28,
    lastRestockDate: '2024-01-13',
    nextScheduledRestock: '2024-01-17',
    licensesValid: false,
    complianceScore: 75
  },
  {
    id: '5',
    operationId: 'PO-2024-005',
    vendorName: 'Hadiza Market Stall',
    vendorType: 'Market Stall',
    location: 'Garki Market, Abuja',
    coordinates: { lat: 9.0765, lng: 7.3986 },
    products: ['Kerosene', 'Cooking Gas (3kg)', 'Matches & Lighters'],
    dailySalesTarget: 80000,
    actualSales: 72000,
    salesDate: '2024-01-16',
    operatingHours: '6:00 AM - 7:00 PM',
    status: 'Active',
    performanceRating: 4.0,
    territory: 'FCT Markets',
    supervisor: 'Musa Ibrahim',
    stockLevel: 65,
    revenueToday: 72000,
    customersServed: 35,
    lastRestockDate: '2024-01-15',
    nextScheduledRestock: '2024-01-18',
    licensesValid: true,
    complianceScore: 82
  },
  {
    id: '6',
    operationId: 'PO-2024-006',
    vendorName: 'Express Fuel Stop',
    vendorType: 'Fixed Kiosk',
    location: 'Ibadan Ring Road Junction',
    coordinates: { lat: 7.3775, lng: 3.9470 },
    products: ['Premium Motor Spirit (PMS)', 'Automotive Gas Oil (AGO)', 'Brake Fluid'],
    dailySalesTarget: 160000,
    actualSales: 142000,
    salesDate: '2024-01-16',
    operatingHours: '5:00 AM - 11:00 PM',
    status: 'Suspended',
    performanceRating: 3.8,
    territory: 'Oyo Central',
    supervisor: 'Biodun Afolabi',
    stockLevel: 30,
    revenueToday: 142000,
    customersServed: 38,
    lastRestockDate: '2024-01-12',
    nextScheduledRestock: '2024-01-20',
    licensesValid: true,
    complianceScore: 68
  }
]

export default function PeddlingOperationsPage() {
  const [operations, setOperations] = useState<PeddlingOperation[]>(mockPeddlingOperations)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [vendorTypeFilter, setVendorTypeFilter] = useState('All')
  const [selectedOperation, setSelectedOperation] = useState<PeddlingOperation | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.territory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || operation.status === statusFilter
    const matchesVendorType = vendorTypeFilter === 'All' || operation.vendorType === vendorTypeFilter

    return matchesSearch && matchesStatus && matchesVendorType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50'
      case 'Closed': return 'text-black bg-gray-50'
      case 'Suspended': return 'text-red-600 bg-red-50'
      case 'Maintenance': return 'text-orange-600 bg-orange-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getVendorTypeColor = (type: string) => {
    switch (type) {
      case 'Mobile Vendor': return 'text-blue-600 bg-blue-50'
      case 'Fixed Kiosk': return 'text-purple-600 bg-purple-50'
      case 'Roadside Station': return 'text-green-600 bg-green-50'
      case 'Market Stall': return 'text-orange-600 bg-orange-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />
      case 'Closed': return <Clock className="w-4 h-4" />
      case 'Suspended': return <AlertTriangle className="w-4 h-4" />
      case 'Maintenance': return <AlertTriangle className="w-4 h-4" />
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

  const calculateTotalRevenue = () => {
    return filteredOperations.reduce((sum, operation) => sum + operation.revenueToday, 0)
  }

  const calculateTotalCustomers = () => {
    return filteredOperations.reduce((sum, operation) => sum + operation.customersServed, 0)
  }

  const getActiveOperations = () => {
    return filteredOperations.filter(op => op.status === 'Active').length
  }

  const getAveragePerformance = () => {
    const total = filteredOperations.reduce((sum, op) => sum + op.performanceRating, 0)
    return (total / filteredOperations.length).toFixed(1)
  }

  const openModal = (operation: PeddlingOperation) => {
    setSelectedOperation(operation)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedOperation(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Operation ID', 'Vendor Name', 'Vendor Type', 'Location', 'Status', 'Daily Target', 'Actual Sales', 'Performance Rating', 'Customers Served']
    const csvData = filteredOperations.map(op => [
      op.operationId,
      op.vendorName,
      op.vendorType,
      op.location,
      op.status,
      op.dailySalesTarget,
      op.actualSales,
      op.performanceRating,
      op.customersServed
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'peddling-operations.csv')
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
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Peddling Operations</h1>
              <p className="text-black">Manage retail petroleum sales and mobile vendors</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(calculateTotalRevenue())}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Active Operations</p>
                <p className="text-2xl font-bold text-black">{getActiveOperations()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Customers Served</p>
                <p className="text-2xl font-bold text-black">{calculateTotalCustomers()}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Avg Performance</p>
                <p className="text-2xl font-bold text-black">{getAveragePerformance()}/5.0</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
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
                  placeholder="Search vendors, locations, territories..."
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
                <option value="Closed">Closed</option>
                <option value="Suspended">Suspended</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <select
                value={vendorTypeFilter}
                onChange={(e) => setVendorTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Vendor Types</option>
                <option value="Mobile Vendor">Mobile Vendor</option>
                <option value="Fixed Kiosk">Fixed Kiosk</option>
                <option value="Roadside Station">Roadside Station</option>
                <option value="Market Stall">Market Stall</option>
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
                New Operation
              </button>
            </div>
          </div>
        </div>

        {/* Peddling Operations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Vendor Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Location & Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Sales Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status & Compliance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Operations
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
                        <div className="font-medium text-black">{operation.vendorName}</div>
                        <div className="text-sm text-black">{operation.operationId}</div>
                        <div className="text-xs text-black flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {operation.supervisor}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {operation.location}
                        </div>
                        <div className="text-xs text-black">{operation.territory}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVendorTypeColor(operation.vendorType)}`}>
                          {operation.vendorType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-black">{formatCurrency(operation.actualSales)}</div>
                        <div className="text-sm text-black">Target: {formatCurrency(operation.dailySalesTarget)}</div>
                        <div className={`text-xs ${operation.actualSales >= operation.dailySalesTarget ? 'text-green-600' : 'text-red-600'}`}>
                          {operation.actualSales >= operation.dailySalesTarget ? '↗' : '↘'} {((operation.actualSales / operation.dailySalesTarget) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-black">
                          {operation.customersServed} customers
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                          {getStatusIcon(operation.status)}
                          {operation.status}
                        </span>
                        <div className="text-xs text-black">
                          Compliance: {operation.complianceScore}%
                        </div>
                        <div className="text-xs">
                          {operation.licensesValid ? (
                            <span className="text-green-600">✓ Licensed</span>
                          ) : (
                            <span className="text-red-600">✗ License Issue</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-black">{operation.operatingHours}</div>
                        <div className="text-xs text-black">
                          Stock: {operation.stockLevel}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-black">
                          <BarChart3 className="w-3 h-3" />
                          Rating: {operation.performanceRating}/5.0
                        </div>
                        <div className="text-xs text-black">
                          Next restock: {operation.nextScheduledRestock}
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
                          title="Edit Operation"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-black hover:text-blue-600 transition-colors"
                          title="Track Location"
                        >
                          <Navigation className="w-4 h-4" />
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
            Showing {filteredOperations.length} of {operations.length} peddling operations
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
                    <h2 className="text-2xl font-bold text-black">{selectedOperation.vendorName}</h2>
                    <p className="text-black">Peddling Operation Details - {selectedOperation.operationId}</p>
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
                {/* Operation Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Operation Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Operation ID</label>
                        <p className="text-black">{selectedOperation.operationId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Vendor Name</label>
                        <p className="text-black">{selectedOperation.vendorName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Vendor Type</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVendorTypeColor(selectedOperation.vendorType)}`}>
                          {selectedOperation.vendorType}
                        </span>
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
                        <label className="block text-sm font-medium text-black mb-1">Location</label>
                        <p className="text-black">{selectedOperation.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Territory</label>
                        <p className="text-black">{selectedOperation.territory}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Supervisor</label>
                        <p className="text-black">{selectedOperation.supervisor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Operating Hours</label>
                        <p className="text-black">{selectedOperation.operatingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Today's Revenue</p>
                          <p className="text-xl font-bold text-green-900">{formatCurrency(selectedOperation.revenueToday)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Customers Served</p>
                          <p className="text-xl font-bold text-blue-900">{selectedOperation.customersServed}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Performance Rating</p>
                          <p className="text-xl font-bold text-orange-900">{selectedOperation.performanceRating}/5.0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products & Inventory */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Products & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-3">Available Products</label>
                      <div className="space-y-2">
                        {selectedOperation.products.map((product, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Fuel className="w-4 h-4 text-black" />
                            <span className="text-sm text-black">{product}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Current Stock Level</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedOperation.stockLevel >= 80 ? 'bg-green-500' :
                                selectedOperation.stockLevel >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${selectedOperation.stockLevel}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-black">{selectedOperation.stockLevel}%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Last Restock Date</label>
                        <p className="text-black">{selectedOperation.lastRestockDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Next Scheduled Restock</label>
                        <p className="text-black">{selectedOperation.nextScheduledRestock}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Sales Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Daily Sales Target</label>
                      <p className="text-black">{formatCurrency(selectedOperation.dailySalesTarget)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Actual Sales</label>
                      <p className={`font-medium ${selectedOperation.actualSales >= selectedOperation.dailySalesTarget ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedOperation.actualSales)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black mb-2">Target Achievement</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            (selectedOperation.actualSales / selectedOperation.dailySalesTarget) * 100 >= 100 ? 'bg-green-500' :
                            (selectedOperation.actualSales / selectedOperation.dailySalesTarget) * 100 >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (selectedOperation.actualSales / selectedOperation.dailySalesTarget) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-black">
                        {((selectedOperation.actualSales / selectedOperation.dailySalesTarget) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compliance & Licensing */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Compliance & Licensing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">License Status</label>
                      <p className={`font-medium ${selectedOperation.licensesValid ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedOperation.licensesValid ? '✓ Valid & Active' : '✗ License Issues'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Compliance Score</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedOperation.complianceScore >= 90 ? 'bg-green-500' :
                              selectedOperation.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedOperation.complianceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-black">{selectedOperation.complianceScore}%</span>
                      </div>
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
                  Edit Operation
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Track Location
                </button>
                <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors">
                  Performance Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}