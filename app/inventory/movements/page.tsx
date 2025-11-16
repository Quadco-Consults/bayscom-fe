'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Search, Filter, Download, Plus, ArrowUpDown, ArrowUp, ArrowDown, Truck, MapPin, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react'

interface StockMovement {
  id: string
  date: string
  time: string
  type: 'transfer' | 'receipt' | 'dispatch' | 'adjustment' | 'return'
  product: string
  quantity: number
  unit: string
  sourceLocation: string
  destinationLocation: string
  reference: string
  status: 'completed' | 'in-transit' | 'pending' | 'cancelled'
  driverName?: string
  vehicleNumber?: string
  approvedBy: string
  notes?: string
  batchNumber?: string
  cost: number
  reason?: string
}

const mockMovements: StockMovement[] = [
  {
    id: 'MOV001',
    date: '2024-11-16',
    time: '08:30',
    type: 'transfer',
    product: 'Premium Motor Spirit (PMS)',
    quantity: 45000,
    unit: 'Liters',
    sourceLocation: 'Lagos Main Depot',
    destinationLocation: 'Abuja Filling Station',
    reference: 'TRF-2024-001',
    status: 'in-transit',
    driverName: 'Ahmed Bello',
    vehicleNumber: 'ABC-123-XY',
    approvedBy: 'John Manager',
    notes: 'Regular scheduled transfer',
    batchNumber: 'PMS240116001',
    cost: 31500000
  },
  {
    id: 'MOV002',
    date: '2024-11-16',
    time: '09:15',
    type: 'receipt',
    product: 'Automotive Gas Oil (AGO)',
    quantity: 30000,
    unit: 'Liters',
    sourceLocation: 'NNPC Depot',
    destinationLocation: 'Lagos Main Depot',
    reference: 'RCP-2024-015',
    status: 'completed',
    approvedBy: 'Sarah Operations',
    batchNumber: 'AGO240116002',
    cost: 24000000
  },
  {
    id: 'MOV003',
    date: '2024-11-16',
    time: '10:00',
    type: 'dispatch',
    product: 'Dual Purpose Kerosene (DPK)',
    quantity: 15000,
    unit: 'Liters',
    sourceLocation: 'Port Harcourt Depot',
    destinationLocation: 'Customer: Shell Nigeria',
    reference: 'DSP-2024-087',
    status: 'completed',
    driverName: 'Ibrahim Musa',
    vehicleNumber: 'XYZ-789-AB',
    approvedBy: 'Mike Sales',
    batchNumber: 'DPK240116001',
    cost: 12000000
  },
  {
    id: 'MOV004',
    date: '2024-11-15',
    time: '16:45',
    type: 'adjustment',
    product: 'LPG 12.5kg Cylinders',
    quantity: -50,
    unit: 'Cylinders',
    sourceLocation: 'Kano Distribution Center',
    destinationLocation: 'Stock Adjustment',
    reference: 'ADJ-2024-023',
    status: 'completed',
    approvedBy: 'David Inventory',
    reason: 'Physical count variance',
    cost: -1250000
  },
  {
    id: 'MOV005',
    date: '2024-11-15',
    time: '14:20',
    type: 'return',
    product: 'Engine Oil SAE 40',
    quantity: 200,
    unit: 'Liters',
    sourceLocation: 'Customer: Total Nigeria',
    destinationLocation: 'Lagos Main Depot',
    reference: 'RTN-2024-009',
    status: 'pending',
    approvedBy: 'Lisa Customer Service',
    notes: 'Quality issue return',
    cost: 400000
  },
  {
    id: 'MOV006',
    date: '2024-11-15',
    time: '11:30',
    type: 'transfer',
    product: 'Premium Motor Spirit (PMS)',
    quantity: 35000,
    unit: 'Liters',
    sourceLocation: 'Abuja Depot',
    destinationLocation: 'Kaduna Filling Station',
    reference: 'TRF-2024-002',
    status: 'cancelled',
    approvedBy: 'John Manager',
    reason: 'Vehicle breakdown',
    cost: 0
  }
]

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const movementTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'receipt', label: 'Receipt' },
    { value: 'dispatch', label: 'Dispatch' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'return', label: 'Return' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Lagos Main Depot', label: 'Lagos Main Depot' },
    { value: 'Abuja Depot', label: 'Abuja Depot' },
    { value: 'Port Harcourt Depot', label: 'Port Harcourt Depot' },
    { value: 'Kano Distribution Center', label: 'Kano Distribution Center' }
  ]

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'transfer': return <ArrowUpDown className="h-4 w-4" />
      case 'receipt': return <ArrowDown className="h-4 w-4" />
      case 'dispatch': return <ArrowUp className="h-4 w-4" />
      case 'adjustment': return <AlertTriangle className="h-4 w-4" />
      case 'return': return <ArrowDown className="h-4 w-4" />
      default: return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-transit': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transfer': return 'text-purple-600 bg-purple-100'
      case 'receipt': return 'text-green-600 bg-green-100'
      case 'dispatch': return 'text-blue-600 bg-blue-100'
      case 'adjustment': return 'text-orange-600 bg-orange-100'
      case 'return': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const filteredMovements = movements.filter(movement => {
    const matchesSearch =
      movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.sourceLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || movement.type === filterType
    const matchesStatus = filterStatus === 'all' || movement.status === filterStatus
    const matchesLocation = filterLocation === 'all' ||
      movement.sourceLocation === filterLocation ||
      movement.destinationLocation === filterLocation

    const matchesDateRange = (!dateRange.start || movement.date >= dateRange.start) &&
      (!dateRange.end || movement.date <= dateRange.end)

    return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesDateRange
  })

  const totalValue = filteredMovements.reduce((sum, movement) => sum + Math.abs(movement.cost), 0)
  const totalQuantity = filteredMovements.reduce((sum, movement) => sum + Math.abs(movement.quantity), 0)

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Type', 'Product', 'Quantity', 'Unit', 'Source', 'Destination', 'Reference', 'Status', 'Value (₦)']
    const csvContent = [
      headers.join(','),
      ...filteredMovements.map(movement =>
        [
          movement.date,
          movement.time,
          movement.type,
          movement.product,
          movement.quantity,
          movement.unit,
          movement.sourceLocation,
          movement.destinationLocation,
          movement.reference,
          movement.status,
          movement.cost.toLocaleString()
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stock-movements.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Stock Movements & Transfers</h1>
            <p className="text-black">Track all inventory movements and transfers</p>
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
              <span>New Movement</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Movements</p>
                <p className="text-2xl font-bold text-black">{filteredMovements.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">In Transit</p>
                <p className="text-2xl font-bold text-black">
                  {filteredMovements.filter(m => m.status === 'in-transit').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Quantity</p>
                <p className="text-2xl font-bold text-black">{totalQuantity.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-[#E67E22]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Value</p>
                <p className="text-2xl font-bold text-black">₦{totalValue.toLocaleString()}</p>
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
                  placeholder="Search movements..."
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
                {movementTypes.map(type => (
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

        {/* Movements Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Source → Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{movement.date}</div>
                      <div className="text-sm text-black">{movement.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(movement.type)}`}>
                        {getMovementIcon(movement.type)}
                        <span className="capitalize">{movement.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-black">{movement.product}</div>
                      <div className="text-sm text-black">{movement.reference}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity.toLocaleString()}
                      </div>
                      <div className="text-sm text-black">{movement.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div className="font-medium">{movement.sourceLocation}</div>
                        <div className="text-black">↓</div>
                        <div className="font-medium">{movement.destinationLocation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(movement.status)}`}>
                        {movement.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {movement.status === 'in-transit' && <Truck className="h-3 w-3 mr-1" />}
                        {movement.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {movement.status === 'cancelled' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        <span className="capitalize">{movement.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      ₦{movement.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <button
                        onClick={() => setSelectedMovement(movement)}
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

        {/* Movement Details Modal */}
        {selectedMovement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Movement Details</h2>
                <button
                  onClick={() => setSelectedMovement(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black">Reference</label>
                    <p className="text-sm text-black font-medium">{selectedMovement.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">Date & Time</label>
                    <p className="text-sm text-black">{selectedMovement.date} at {selectedMovement.time}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">Type</label>
                    <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedMovement.type)}`}>
                      {getMovementIcon(selectedMovement.type)}
                      <span className="capitalize">{selectedMovement.type}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">Status</label>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMovement.status)}`}>
                      <span className="capitalize">{selectedMovement.status}</span>
                    </span>
                  </div>
                </div>

                {/* Product Information */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-black mb-3">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black">Product</label>
                      <p className="text-sm text-black">{selectedMovement.product}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Quantity</label>
                      <p className="text-sm text-black font-medium">
                        {selectedMovement.quantity.toLocaleString()} {selectedMovement.unit}
                      </p>
                    </div>
                    {selectedMovement.batchNumber && (
                      <div>
                        <label className="block text-sm font-medium text-black">Batch Number</label>
                        <p className="text-sm text-black">{selectedMovement.batchNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-black">Value</label>
                      <p className="text-sm text-black font-medium">₦{selectedMovement.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-black mb-3">Location Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black">Source Location</label>
                      <p className="text-sm text-black">{selectedMovement.sourceLocation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Destination Location</label>
                      <p className="text-sm text-black">{selectedMovement.destinationLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Transportation Details */}
                {(selectedMovement.driverName || selectedMovement.vehicleNumber) && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-black mb-3">Transportation Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedMovement.driverName && (
                        <div>
                          <label className="block text-sm font-medium text-black">Driver</label>
                          <p className="text-sm text-black">{selectedMovement.driverName}</p>
                        </div>
                      )}
                      {selectedMovement.vehicleNumber && (
                        <div>
                          <label className="block text-sm font-medium text-black">Vehicle Number</label>
                          <p className="text-sm text-black">{selectedMovement.vehicleNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-black mb-3">Additional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-black">Approved By</label>
                      <p className="text-sm text-black">{selectedMovement.approvedBy}</p>
                    </div>
                    {selectedMovement.notes && (
                      <div>
                        <label className="block text-sm font-medium text-black">Notes</label>
                        <p className="text-sm text-black">{selectedMovement.notes}</p>
                      </div>
                    )}
                    {selectedMovement.reason && (
                      <div>
                        <label className="block text-sm font-medium text-black">Reason</label>
                        <p className="text-sm text-black">{selectedMovement.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}