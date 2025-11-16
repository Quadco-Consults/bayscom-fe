'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Search, Filter, Download, Plus, AlertTriangle, CheckCircle, Clock, XCircle, Eye, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface InventoryAdjustment {
  id: string
  adjustmentNumber: string
  date: string
  time: string
  type: 'increase' | 'decrease' | 'correction' | 'damage' | 'theft' | 'write-off'
  reason: string
  location: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  items: AdjustmentItem[]
  totalValue: number
  initiatedBy: string
  approvedBy?: string
  notes?: string
  supportingDoc?: string
}

interface AdjustmentItem {
  id: string
  product: string
  currentStock: number
  adjustedStock: number
  difference: number
  unit: string
  unitCost: number
  totalCost: number
  reason: string
  batchNumber?: string
}

const mockAdjustments: InventoryAdjustment[] = [
  {
    id: 'ADJ001',
    adjustmentNumber: 'ADJ-2024-001',
    date: '2024-11-16',
    time: '09:30',
    type: 'correction',
    reason: 'Physical count variance',
    location: 'Lagos Main Depot',
    status: 'pending',
    totalValue: -450000,
    initiatedBy: 'David Inventory',
    notes: 'Discrepancy found during monthly stock count',
    supportingDoc: 'Stock_Count_Report_Nov2024.pdf',
    items: [
      {
        id: 'ADJI001',
        product: 'Premium Motor Spirit (PMS)',
        currentStock: 45000,
        adjustedStock: 44500,
        difference: -500,
        unit: 'Liters',
        unitCost: 750,
        totalCost: -375000,
        reason: 'Evaporation loss',
        batchNumber: 'PMS241115001'
      },
      {
        id: 'ADJI002',
        product: 'Engine Oil SAE 40',
        currentStock: 2000,
        adjustedStock: 1975,
        difference: -25,
        unit: 'Liters',
        unitCost: 3000,
        totalCost: -75000,
        reason: 'Spillage during transfer'
      }
    ]
  },
  {
    id: 'ADJ002',
    adjustmentNumber: 'ADJ-2024-002',
    date: '2024-11-15',
    time: '14:15',
    type: 'damage',
    reason: 'Product contamination',
    location: 'Abuja Depot',
    status: 'completed',
    totalValue: -1200000,
    initiatedBy: 'Mike Operations',
    approvedBy: 'Sarah Director',
    notes: 'Diesel contaminated with water - entire batch written off',
    items: [
      {
        id: 'ADJI003',
        product: 'Automotive Gas Oil (AGO)',
        currentStock: 30000,
        adjustedStock: 28500,
        difference: -1500,
        unit: 'Liters',
        unitCost: 800,
        totalCost: -1200000,
        reason: 'Water contamination',
        batchNumber: 'AGO241114001'
      }
    ]
  },
  {
    id: 'ADJ003',
    adjustmentNumber: 'ADJ-2024-003',
    date: '2024-11-14',
    time: '11:45',
    type: 'increase',
    reason: 'Found stock during reorganization',
    location: 'Port Harcourt Depot',
    status: 'approved',
    totalValue: 600000,
    initiatedBy: 'Ahmed Supply',
    approvedBy: 'John Manager',
    notes: 'Additional stock found in secondary storage area',
    items: [
      {
        id: 'ADJI004',
        product: 'LPG 12.5kg Cylinders',
        currentStock: 1500,
        adjustedStock: 1700,
        difference: 200,
        unit: 'Cylinders',
        unitCost: 3000,
        totalCost: 600000,
        reason: 'Misplaced inventory found'
      }
    ]
  },
  {
    id: 'ADJ004',
    adjustmentNumber: 'ADJ-2024-004',
    date: '2024-11-13',
    time: '16:20',
    type: 'theft',
    reason: 'Security breach',
    location: 'Kano Distribution Center',
    status: 'completed',
    totalValue: -850000,
    initiatedBy: 'Security Team',
    approvedBy: 'Sarah Director',
    notes: 'Theft discovered during security audit - police report filed',
    supportingDoc: 'Police_Report_KN2024001.pdf',
    items: [
      {
        id: 'ADJI005',
        product: 'Dual Purpose Kerosene (DPK)',
        currentStock: 25000,
        adjustedStock: 24000,
        difference: -1000,
        unit: 'Liters',
        unitCost: 650,
        totalCost: -650000,
        reason: 'Theft'
      },
      {
        id: 'ADJI006',
        product: 'Hydraulic Oil ISO 68',
        currentStock: 500,
        adjustedStock: 450,
        difference: -50,
        unit: 'Liters',
        unitCost: 4000,
        totalCost: -200000,
        reason: 'Theft'
      }
    ]
  },
  {
    id: 'ADJ005',
    adjustmentNumber: 'ADJ-2024-005',
    date: '2024-11-12',
    time: '13:10',
    type: 'write-off',
    reason: 'Expired product',
    location: 'Lagos Main Depot',
    status: 'rejected',
    totalValue: -300000,
    initiatedBy: 'Lisa Quality',
    notes: 'Rejected - product within acceptable shelf life',
    items: [
      {
        id: 'ADJI007',
        product: 'Brake Fluid DOT 4',
        currentStock: 800,
        adjustedStock: 700,
        difference: -100,
        unit: 'Liters',
        unitCost: 3000,
        totalCost: -300000,
        reason: 'Shelf life concern'
      }
    ]
  },
  {
    id: 'ADJ006',
    adjustmentNumber: 'ADJ-2024-006',
    date: '2024-11-11',
    time: '08:45',
    type: 'correction',
    reason: 'System error correction',
    location: 'Abuja Depot',
    status: 'completed',
    totalValue: 0,
    initiatedBy: 'IT Support',
    approvedBy: 'John Manager',
    notes: 'Correcting duplicate entries in system',
    items: [
      {
        id: 'ADJI008',
        product: 'Premium Motor Spirit (PMS)',
        currentStock: 52000,
        adjustedStock: 50000,
        difference: -2000,
        unit: 'Liters',
        unitCost: 750,
        totalCost: 0,
        reason: 'Duplicate entry removal'
      }
    ]
  }
]

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>(mockAdjustments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')
  const [selectedAdjustment, setSelectedAdjustment] = useState<InventoryAdjustment | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const adjustmentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'increase', label: 'Increase' },
    { value: 'decrease', label: 'Decrease' },
    { value: 'correction', label: 'Correction' },
    { value: 'damage', label: 'Damage' },
    { value: 'theft', label: 'Theft' },
    { value: 'write-off', label: 'Write-off' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' }
  ]

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Lagos Main Depot', label: 'Lagos Main Depot' },
    { value: 'Abuja Depot', label: 'Abuja Depot' },
    { value: 'Port Harcourt Depot', label: 'Port Harcourt Depot' },
    { value: 'Kano Distribution Center', label: 'Kano Distribution Center' }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'increase': return 'text-green-600 bg-green-100'
      case 'decrease': return 'text-red-600 bg-red-100'
      case 'correction': return 'text-blue-600 bg-blue-100'
      case 'damage': return 'text-orange-600 bg-orange-100'
      case 'theft': return 'text-red-700 bg-red-200'
      case 'write-off': return 'text-black bg-gray-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-blue-600 bg-blue-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-green-600 bg-green-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'increase': return <TrendingUp className="h-4 w-4" />
      case 'decrease': return <TrendingDown className="h-4 w-4" />
      case 'correction': return <BarChart3 className="h-4 w-4" />
      case 'damage': return <AlertTriangle className="h-4 w-4" />
      case 'theft': return <XCircle className="h-4 w-4" />
      case 'write-off': return <XCircle className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch =
      adjustment.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.initiatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.items.some(item => item.product.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === 'all' || adjustment.type === filterType
    const matchesStatus = filterStatus === 'all' || adjustment.status === filterStatus
    const matchesLocation = filterLocation === 'all' || adjustment.location === filterLocation

    const matchesDateRange = (!dateRange.start || adjustment.date >= dateRange.start) &&
      (!dateRange.end || adjustment.date <= dateRange.end)

    return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesDateRange
  })

  const totalValue = filteredAdjustments.reduce((sum, adj) => sum + adj.totalValue, 0)
  const pendingAdjustments = filteredAdjustments.filter(adj => adj.status === 'pending').length
  const positiveAdjustments = filteredAdjustments.filter(adj => adj.totalValue > 0).length
  const negativeAdjustments = filteredAdjustments.filter(adj => adj.totalValue < 0).length

  const exportToCSV = () => {
    const headers = ['Adjustment Number', 'Date', 'Type', 'Reason', 'Location', 'Status', 'Total Value (₦)', 'Initiated By']
    const csvContent = [
      headers.join(','),
      ...filteredAdjustments.map(adj =>
        [
          adj.adjustmentNumber,
          adj.date,
          adj.type,
          adj.reason,
          adj.location,
          adj.status,
          adj.totalValue.toLocaleString(),
          adj.initiatedBy
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory-adjustments.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Inventory Adjustments</h1>
            <p className="text-black">Manage stock corrections and adjustments</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Adjustment</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Adjustments</p>
                <p className="text-2xl font-bold text-black">{filteredAdjustments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Pending</p>
                <p className="text-2xl font-bold text-black">{pendingAdjustments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Positive Adj.</p>
                <p className="text-2xl font-bold text-black">{positiveAdjustments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Impact</p>
                <p className={`text-2xl font-bold ${totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{Math.abs(totalValue).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search adjustments..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {adjustmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Location</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Adjustments Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Adjustment Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Value Impact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{adjustment.adjustmentNumber}</div>
                      <div className="text-sm text-black">Items: {adjustment.items.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{adjustment.date}</div>
                      <div className="text-sm text-black">{adjustment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(adjustment.type)}`}>
                        {getTypeIcon(adjustment.type)}
                        <span className="capitalize">{adjustment.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">{adjustment.reason}</div>
                      <div className="text-sm text-black">By: {adjustment.initiatedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {adjustment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(adjustment.status)}`}>
                        {getStatusIcon(adjustment.status)}
                        <span className="capitalize">{adjustment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${adjustment.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adjustment.totalValue >= 0 ? '+' : ''}₦{adjustment.totalValue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <button
                        onClick={() => setSelectedAdjustment(adjustment)}
                        className="text-[#8B1538] hover:text-[#7A1230]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjustment Details Modal */}
        {selectedAdjustment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Adjustment Details - {selectedAdjustment.adjustmentNumber}
                </h2>
                <button
                  onClick={() => setSelectedAdjustment(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Adjustment Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Adjustment Number</label>
                        <p className="text-sm text-black font-medium">{selectedAdjustment.adjustmentNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Date & Time</label>
                        <p className="text-sm text-black">{selectedAdjustment.date} at {selectedAdjustment.time}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Type</label>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedAdjustment.type)}`}>
                          {getTypeIcon(selectedAdjustment.type)}
                          <span className="capitalize">{selectedAdjustment.type}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Status</label>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAdjustment.status)}`}>
                          {getStatusIcon(selectedAdjustment.status)}
                          <span className="capitalize">{selectedAdjustment.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Additional Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Reason</label>
                        <p className="text-sm text-black">{selectedAdjustment.reason}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Location</label>
                        <p className="text-sm text-black">{selectedAdjustment.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Initiated By</label>
                        <p className="text-sm text-black">{selectedAdjustment.initiatedBy}</p>
                      </div>
                      {selectedAdjustment.approvedBy && (
                        <div>
                          <label className="block text-sm font-medium text-black">Approved By</label>
                          <p className="text-sm text-black">{selectedAdjustment.approvedBy}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-black">Total Value Impact</label>
                        <p className={`text-sm font-bold ${selectedAdjustment.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAdjustment.totalValue >= 0 ? '+' : ''}₦{selectedAdjustment.totalValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adjustment Items */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Adjustment Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Current Stock
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Adjusted Stock
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Difference
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Value Impact
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedAdjustment.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-black">{item.product}</div>
                              {item.batchNumber && (
                                <div className="text-sm text-black">Batch: {item.batchNumber}</div>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-black">
                              {item.currentStock.toLocaleString()} {item.unit}
                            </td>
                            <td className="px-4 py-4 text-sm text-black">
                              {item.adjustedStock.toLocaleString()} {item.unit}
                            </td>
                            <td className="px-4 py-4">
                              <div className={`text-sm font-medium ${item.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.difference >= 0 ? '+' : ''}{item.difference.toLocaleString()} {item.unit}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className={`text-sm font-medium ${item.totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.totalCost >= 0 ? '+' : ''}₦{item.totalCost.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-black">
                              {item.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes and Documents */}
                {(selectedAdjustment.notes || selectedAdjustment.supportingDoc) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-black mb-4">Additional Information</h3>
                    <div className="space-y-3">
                      {selectedAdjustment.notes && (
                        <div>
                          <label className="block text-sm font-medium text-black">Notes</label>
                          <p className="text-sm text-black">{selectedAdjustment.notes}</p>
                        </div>
                      )}
                      {selectedAdjustment.supportingDoc && (
                        <div>
                          <label className="block text-sm font-medium text-black">Supporting Document</label>
                          <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            {selectedAdjustment.supportingDoc}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}