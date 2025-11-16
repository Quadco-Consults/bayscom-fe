'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Fuel,
  Thermometer,
  Gauge,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  Truck,
  Building
} from 'lucide-react'

interface InventoryItem {
  id: string
  productName: string
  productCode: string
  category: 'Premium Motor Spirit (PMS)' | 'Automotive Gas Oil (AGO)' | 'Dual Purpose Kerosene (DPK)' | 'Liquefied Petroleum Gas (LPG)' | 'Lubricants' | 'Additives'
  location: string
  tankNumber?: string
  currentStock: number
  maxCapacity: number
  minThreshold: number
  reorderPoint: number
  unit: 'Liters' | 'Kilograms' | 'Metric Tons'
  costPerUnit: number
  totalValue: number
  lastUpdated: string
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstocked' | 'Critical'
  temperature?: number
  density?: number
  qualityGrade: 'A' | 'B' | 'C'
  supplier: string
  batchNumber?: string
  expiryDate?: string
  lastDelivery: string
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    productName: 'Premium Motor Spirit (PMS)',
    productCode: 'PMS-001',
    category: 'Premium Motor Spirit (PMS)',
    location: 'Lagos Depot - Tank A1',
    tankNumber: 'TANK-A1',
    currentStock: 850000,
    maxCapacity: 1000000,
    minThreshold: 200000,
    reorderPoint: 300000,
    unit: 'Liters',
    costPerUnit: 168.50,
    totalValue: 143225000,
    lastUpdated: '2024-01-16 14:30:00',
    status: 'In Stock',
    temperature: 28,
    density: 0.745,
    qualityGrade: 'A',
    supplier: 'Nigerian National Petroleum Corporation',
    batchNumber: 'NNPC-PMS-240116',
    lastDelivery: '2024-01-14'
  },
  {
    id: '2',
    productName: 'Automotive Gas Oil (AGO)',
    productCode: 'AGO-001',
    category: 'Automotive Gas Oil (AGO)',
    location: 'Lagos Depot - Tank B2',
    tankNumber: 'TANK-B2',
    currentStock: 420000,
    maxCapacity: 750000,
    minThreshold: 150000,
    reorderPoint: 225000,
    unit: 'Liters',
    costPerUnit: 195.00,
    totalValue: 81900000,
    lastUpdated: '2024-01-16 13:45:00',
    status: 'In Stock',
    temperature: 26,
    density: 0.840,
    qualityGrade: 'A',
    supplier: 'Total Energies Nigeria',
    batchNumber: 'TOT-AGO-240115',
    lastDelivery: '2024-01-15'
  },
  {
    id: '3',
    productName: 'Liquefied Petroleum Gas (LPG)',
    productCode: 'LPG-001',
    category: 'Liquefied Petroleum Gas (LPG)',
    location: 'Abuja Terminal - Storage Unit C',
    currentStock: 45000,
    maxCapacity: 80000,
    minThreshold: 10000,
    reorderPoint: 20000,
    unit: 'Kilograms',
    costPerUnit: 420.00,
    totalValue: 18900000,
    lastUpdated: '2024-01-16 12:20:00',
    status: 'In Stock',
    temperature: -5,
    density: 0.515,
    qualityGrade: 'A',
    supplier: 'Chevron Nigeria Limited',
    batchNumber: 'CHV-LPG-240113',
    lastDelivery: '2024-01-13'
  },
  {
    id: '4',
    productName: 'Dual Purpose Kerosene (DPK)',
    productCode: 'DPK-001',
    category: 'Dual Purpose Kerosene (DPK)',
    location: 'Kano Depot - Tank D1',
    tankNumber: 'TANK-D1',
    currentStock: 125000,
    maxCapacity: 500000,
    minThreshold: 100000,
    reorderPoint: 150000,
    unit: 'Liters',
    costPerUnit: 225.00,
    totalValue: 28125000,
    lastUpdated: '2024-01-16 11:15:00',
    status: 'Low Stock',
    temperature: 30,
    density: 0.800,
    qualityGrade: 'B',
    supplier: 'Shell Petroleum Development Company',
    batchNumber: 'SHL-DPK-240112',
    lastDelivery: '2024-01-12'
  },
  {
    id: '5',
    productName: 'Engine Oil SAE 20W-50',
    productCode: 'LUB-001',
    category: 'Lubricants',
    location: 'Lagos Warehouse - Section E',
    currentStock: 2500,
    maxCapacity: 5000,
    minThreshold: 500,
    reorderPoint: 1000,
    unit: 'Liters',
    costPerUnit: 1850.00,
    totalValue: 4625000,
    lastUpdated: '2024-01-16 10:30:00',
    status: 'In Stock',
    qualityGrade: 'A',
    supplier: 'Mobil Producing Nigeria',
    batchNumber: 'MOB-ENG-240110',
    expiryDate: '2026-01-10',
    lastDelivery: '2024-01-10'
  },
  {
    id: '6',
    productName: 'Fuel Additive - Anti-Gel',
    productCode: 'ADD-001',
    category: 'Additives',
    location: 'Port Harcourt Warehouse',
    currentStock: 450,
    maxCapacity: 1000,
    minThreshold: 100,
    reorderPoint: 200,
    unit: 'Liters',
    costPerUnit: 3200.00,
    totalValue: 1440000,
    lastUpdated: '2024-01-16 09:45:00',
    status: 'Critical',
    qualityGrade: 'A',
    supplier: 'International Chemical Industries',
    batchNumber: 'ICI-ADD-240108',
    expiryDate: '2025-01-08',
    lastDelivery: '2024-01-08'
  }
]

export default function InventoryOverviewPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    const matchesLocation = locationFilter === 'All' || item.location.includes(locationFilter)

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-50'
      case 'Low Stock': return 'text-yellow-600 bg-yellow-50'
      case 'Out of Stock': return 'text-red-600 bg-red-50'
      case 'Overstocked': return 'text-blue-600 bg-blue-50'
      case 'Critical': return 'text-red-600 bg-red-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getQualityGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50'
      case 'B': return 'text-yellow-600 bg-yellow-50'
      case 'C': return 'text-red-600 bg-red-50'
      default: return 'text-black bg-gray-50'
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
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
    return filteredItems.reduce((sum, item) => sum + item.totalValue, 0)
  }

  const getLowStockCount = () => {
    return filteredItems.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length
  }

  const getInStockCount = () => {
    return filteredItems.filter(item => item.status === 'In Stock').length
  }

  const getOutOfStockCount = () => {
    return filteredItems.filter(item => item.status === 'Out of Stock').length
  }

  const openModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setShowModal(false)
  }

  const exportToCSV = () => {
    const headers = ['Product Name', 'Code', 'Category', 'Location', 'Current Stock', 'Max Capacity', 'Unit', 'Status', 'Value']
    const csvData = filteredItems.map(item => [
      item.productName,
      item.productCode,
      item.category,
      item.location,
      item.currentStock,
      item.maxCapacity,
      item.unit,
      item.status,
      item.totalValue
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'inventory-overview.csv')
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
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Inventory Overview</h1>
              <p className="text-black">Monitor stock levels and inventory across all locations</p>
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
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{getInStockCount()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Low/Critical Stock</p>
                <p className="text-2xl font-bold text-red-600">{getLowStockCount()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-orange-600">{getOutOfStockCount()}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
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
                  placeholder="Search products, codes, locations..."
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
                <option value="Premium Motor Spirit (PMS)">PMS</option>
                <option value="Automotive Gas Oil (AGO)">AGO</option>
                <option value="Dual Purpose Kerosene (DPK)">DPK</option>
                <option value="Liquefied Petroleum Gas (LPG)">LPG</option>
                <option value="Lubricants">Lubricants</option>
                <option value="Additives">Additives</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Overstocked">Overstocked</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
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

        {/* Inventory Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const stockPercentage = getStockPercentage(item.currentStock, item.maxCapacity)
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#8B1538] bg-opacity-10 rounded-lg">
                      <Fuel className="w-5 h-5 text-[#8B1538]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{item.productName}</h3>
                      <p className="text-sm text-black">{item.productCode}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-black">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black">Stock Level</span>
                      <span className="font-medium">{stockPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          stockPercentage >= 50 ? 'bg-green-500' :
                          stockPercentage >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>{formatNumber(item.currentStock)} {item.unit}</span>
                      <span>{formatNumber(item.maxCapacity)} {item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Total Value</span>
                    <span className="font-semibold text-black">{formatCurrency(item.totalValue)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Quality Grade</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityGradeColor(item.qualityGrade)}`}>
                      Grade {item.qualityGrade}
                    </span>
                  </div>

                  {item.temperature !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        Temperature
                      </span>
                      <span className="text-black">{item.temperature}°C</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black">Last Updated</span>
                    <span className="text-black">{item.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => openModal(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                    Update Stock
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">{selectedItem.productName}</h2>
                    <p className="text-black">{selectedItem.productCode}</p>
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
                {/* Product Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Product Name</label>
                        <p className="text-black">{selectedItem.productName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Product Code</label>
                        <p className="text-black">{selectedItem.productCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Category</label>
                        <p className="text-black">{selectedItem.category}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Location</label>
                        <p className="text-black">{selectedItem.location}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Tank Number</label>
                        <p className="text-black">{selectedItem.tankNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Supplier</label>
                        <p className="text-black">{selectedItem.supplier}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Batch Number</label>
                        <p className="text-black">{selectedItem.batchNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Quality Grade</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityGradeColor(selectedItem.qualityGrade)}`}>
                          Grade {selectedItem.qualityGrade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Stock Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Current Stock</p>
                          <p className="text-xl font-bold text-blue-900">{formatNumber(selectedItem.currentStock)} {selectedItem.unit}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Gauge className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Max Capacity</p>
                          <p className="text-xl font-bold text-green-900">{formatNumber(selectedItem.maxCapacity)} {selectedItem.unit}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Reorder Point</p>
                          <p className="text-xl font-bold text-orange-900">{formatNumber(selectedItem.reorderPoint)} {selectedItem.unit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedItem.temperature !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Temperature</label>
                        <p className="text-black">{selectedItem.temperature}°C</p>
                      </div>
                    )}
                    {selectedItem.density && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Density</label>
                        <p className="text-black">{selectedItem.density} kg/L</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Cost per Unit</label>
                      <p className="text-black">{formatCurrency(selectedItem.costPerUnit)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Total Value</label>
                      <p className="text-black font-semibold">{formatCurrency(selectedItem.totalValue)}</p>
                    </div>
                  </div>
                </div>

                {/* Dates & History */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Dates & History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Last Delivery</label>
                      <p className="text-black">{selectedItem.lastDelivery}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Last Updated</label>
                      <p className="text-black">{selectedItem.lastUpdated}</p>
                    </div>
                    {selectedItem.expiryDate && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Expiry Date</label>
                        <p className="text-black">{selectedItem.expiryDate}</p>
                      </div>
                    )}
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
                  Update Stock
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