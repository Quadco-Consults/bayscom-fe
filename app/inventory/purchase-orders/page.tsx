'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Search, Filter, Download, Plus, Eye, Edit, FileText, Truck, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'

interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  supplierCode: string
  orderDate: string
  deliveryDate: string
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  items: PurchaseOrderItem[]
  totalAmount: number
  currency: string
  paymentTerms: string
  deliveryLocation: string
  requestedBy: string
  approvedBy?: string
  notes?: string
  expectedDelivery: string
}

interface PurchaseOrderItem {
  id: string
  product: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  specifications?: string
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    poNumber: 'PO-2024-001',
    supplier: 'NNPC Limited',
    supplierCode: 'NNPC001',
    orderDate: '2024-11-16',
    deliveryDate: '2024-11-20',
    status: 'approved',
    priority: 'high',
    totalAmount: 125000000,
    currency: 'NGN',
    paymentTerms: '30 Days',
    deliveryLocation: 'Lagos Main Depot',
    requestedBy: 'John Manager',
    approvedBy: 'Sarah Director',
    expectedDelivery: '2024-11-20',
    items: [
      {
        id: 'POI001',
        product: 'Premium Motor Spirit (PMS)',
        quantity: 100000,
        unit: 'Liters',
        unitPrice: 750,
        totalPrice: 75000000,
        specifications: 'RON 91, API Grade'
      },
      {
        id: 'POI002',
        product: 'Automotive Gas Oil (AGO)',
        quantity: 50000,
        unit: 'Liters',
        unitPrice: 1000,
        totalPrice: 50000000,
        specifications: 'Cetane Number 45+'
      }
    ]
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    supplier: 'Total Nigeria Plc',
    supplierCode: 'TOT001',
    orderDate: '2024-11-15',
    deliveryDate: '2024-11-22',
    status: 'ordered',
    priority: 'medium',
    totalAmount: 45000000,
    currency: 'NGN',
    paymentTerms: '45 Days',
    deliveryLocation: 'Abuja Depot',
    requestedBy: 'Mike Operations',
    approvedBy: 'John Manager',
    expectedDelivery: '2024-11-22',
    items: [
      {
        id: 'POI003',
        product: 'LPG 12.5kg Cylinders',
        quantity: 2000,
        unit: 'Cylinders',
        unitPrice: 15000,
        totalPrice: 30000000
      },
      {
        id: 'POI004',
        product: 'Engine Oil SAE 40',
        quantity: 5000,
        unit: 'Liters',
        unitPrice: 3000,
        totalPrice: 15000000
      }
    ]
  },
  {
    id: 'PO003',
    poNumber: 'PO-2024-003',
    supplier: 'Shell Nigeria',
    supplierCode: 'SHL001',
    orderDate: '2024-11-14',
    deliveryDate: '2024-11-25',
    status: 'pending',
    priority: 'low',
    totalAmount: 28000000,
    currency: 'NGN',
    paymentTerms: '60 Days',
    deliveryLocation: 'Port Harcourt Depot',
    requestedBy: 'Lisa Procurement',
    expectedDelivery: '2024-11-25',
    items: [
      {
        id: 'POI005',
        product: 'Dual Purpose Kerosene (DPK)',
        quantity: 35000,
        unit: 'Liters',
        unitPrice: 800,
        totalPrice: 28000000,
        specifications: 'Flash Point 38°C min'
      }
    ]
  },
  {
    id: 'PO004',
    poNumber: 'PO-2024-004',
    supplier: 'Mobil Oil Nigeria',
    supplierCode: 'MOB001',
    orderDate: '2024-11-13',
    deliveryDate: '2024-11-18',
    status: 'partial',
    priority: 'urgent',
    totalAmount: 18500000,
    currency: 'NGN',
    paymentTerms: '15 Days',
    deliveryLocation: 'Kano Distribution Center',
    requestedBy: 'Ahmed Supply',
    approvedBy: 'Sarah Director',
    notes: 'Partial delivery received - 60% complete',
    expectedDelivery: '2024-11-18',
    items: [
      {
        id: 'POI006',
        product: 'Hydraulic Oil ISO 68',
        quantity: 3000,
        unit: 'Liters',
        unitPrice: 3500,
        totalPrice: 10500000
      },
      {
        id: 'POI007',
        product: 'Brake Fluid DOT 4',
        quantity: 2000,
        unit: 'Liters',
        unitPrice: 4000,
        totalPrice: 8000000
      }
    ]
  },
  {
    id: 'PO005',
    poNumber: 'PO-2024-005',
    supplier: 'Conoil Plc',
    supplierCode: 'CON001',
    orderDate: '2024-11-12',
    deliveryDate: '2024-11-19',
    status: 'cancelled',
    priority: 'medium',
    totalAmount: 65000000,
    currency: 'NGN',
    paymentTerms: '30 Days',
    deliveryLocation: 'Lagos Main Depot',
    requestedBy: 'David Inventory',
    notes: 'Cancelled due to supplier capacity issues',
    expectedDelivery: '2024-11-19',
    items: [
      {
        id: 'POI008',
        product: 'Premium Motor Spirit (PMS)',
        quantity: 80000,
        unit: 'Liters',
        unitPrice: 750,
        totalPrice: 60000000
      },
      {
        id: 'POI009',
        product: 'Gear Oil SAE 90',
        quantity: 1000,
        unit: 'Liters',
        unitPrice: 5000,
        totalPrice: 5000000
      }
    ]
  }
]

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterSupplier, setFilterSupplier] = useState<string>('all')
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'ordered', label: 'Ordered' },
    { value: 'partial', label: 'Partially Delivered' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const suppliers = [
    { value: 'all', label: 'All Suppliers' },
    { value: 'NNPC Limited', label: 'NNPC Limited' },
    { value: 'Total Nigeria Plc', label: 'Total Nigeria Plc' },
    { value: 'Shell Nigeria', label: 'Shell Nigeria' },
    { value: 'Mobil Oil Nigeria', label: 'Mobil Oil Nigeria' },
    { value: 'Conoil Plc', label: 'Conoil Plc' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-black bg-gray-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-blue-600 bg-blue-100'
      case 'ordered': return 'text-purple-600 bg-purple-100'
      case 'partial': return 'text-orange-600 bg-orange-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'urgent': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'ordered': return <Truck className="h-4 w-4" />
      case 'partial': return <AlertTriangle className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.items.some(item => item.product.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === 'all' || po.status === filterStatus
    const matchesPriority = filterPriority === 'all' || po.priority === filterPriority
    const matchesSupplier = filterSupplier === 'all' || po.supplier === filterSupplier

    const matchesDateRange = (!dateRange.start || po.orderDate >= dateRange.start) &&
      (!dateRange.end || po.orderDate <= dateRange.end)

    return matchesSearch && matchesStatus && matchesPriority && matchesSupplier && matchesDateRange
  })

  const totalValue = filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0)
  const pendingOrders = filteredPOs.filter(po => ['pending', 'approved', 'ordered'].includes(po.status)).length

  const exportToCSV = () => {
    const headers = ['PO Number', 'Supplier', 'Order Date', 'Delivery Date', 'Status', 'Priority', 'Total Amount (₦)', 'Requested By']
    const csvContent = [
      headers.join(','),
      ...filteredPOs.map(po =>
        [
          po.poNumber,
          po.supplier,
          po.orderDate,
          po.deliveryDate,
          po.status,
          po.priority,
          po.totalAmount.toLocaleString(),
          po.requestedBy
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'purchase-orders.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Purchase Orders</h1>
            <p className="text-black">Manage procurement and supplier orders</p>
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
              <span>New Purchase Order</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Orders</p>
                <p className="text-2xl font-bold text-black">{filteredPOs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Pending Orders</p>
                <p className="text-2xl font-bold text-black">{pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">This Month</p>
                <p className="text-2xl font-bold text-black">
                  {filteredPOs.filter(po => po.orderDate.startsWith('2024-11')).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              <label className="block text-sm font-medium text-black mb-2">Priority</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                {priorityOptions.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Supplier</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
              >
                {suppliers.map(supplier => (
                  <option key={supplier.value} value={supplier.value}>{supplier.label}</option>
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

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{po.poNumber}</div>
                      <div className="text-sm text-black">Items: {po.items.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{po.supplier}</div>
                      <div className="text-sm text-black">{po.supplierCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {po.orderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {po.deliveryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                        {getStatusIcon(po.status)}
                        <span className="capitalize">{po.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(po.priority)}`}>
                        <span className="capitalize">{po.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">₦{po.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-black">{po.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPO(po)}
                          className="text-[#8B1538] hover:text-[#7A1230]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase Order Details Modal */}
        {selectedPO && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Purchase Order Details - {selectedPO.poNumber}</h2>
                <button
                  onClick={() => setSelectedPO(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Order Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">PO Number</label>
                        <p className="text-sm text-black font-medium">{selectedPO.poNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Order Date</label>
                        <p className="text-sm text-black">{selectedPO.orderDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Expected Delivery</label>
                        <p className="text-sm text-black">{selectedPO.expectedDelivery}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Status</label>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPO.status)}`}>
                          {getStatusIcon(selectedPO.status)}
                          <span className="capitalize">{selectedPO.status}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Priority</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedPO.priority)}`}>
                          <span className="capitalize">{selectedPO.priority}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Supplier Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Supplier</label>
                        <p className="text-sm text-black font-medium">{selectedPO.supplier}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Supplier Code</label>
                        <p className="text-sm text-black">{selectedPO.supplierCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Payment Terms</label>
                        <p className="text-sm text-black">{selectedPO.paymentTerms}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Delivery Location</label>
                        <p className="text-sm text-black">{selectedPO.deliveryLocation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Total Amount</label>
                        <p className="text-sm text-black font-bold">₦{selectedPO.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Order Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Total Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Specifications
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPO.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4 text-sm font-medium text-black">
                              {item.product}
                            </td>
                            <td className="px-4 py-4 text-sm text-black">
                              {item.quantity.toLocaleString()} {item.unit}
                            </td>
                            <td className="px-4 py-4 text-sm text-black">
                              ₦{item.unitPrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-black">
                              ₦{item.totalPrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-black">
                              {item.specifications || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black">Requested By</label>
                      <p className="text-sm text-black">{selectedPO.requestedBy}</p>
                    </div>
                    {selectedPO.approvedBy && (
                      <div>
                        <label className="block text-sm font-medium text-black">Approved By</label>
                        <p className="text-sm text-black">{selectedPO.approvedBy}</p>
                      </div>
                    )}
                    {selectedPO.notes && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black">Notes</label>
                        <p className="text-sm text-black">{selectedPO.notes}</p>
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