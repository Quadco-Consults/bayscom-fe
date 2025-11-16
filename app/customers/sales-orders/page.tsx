'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Download, Plus, Eye, Edit, Calendar, Truck, CheckCircle, Clock, XCircle, AlertTriangle, Package, DollarSign } from 'lucide-react'

interface SalesOrder {
  id: string
  orderNumber: string
  customerCode: string
  customerName: string
  orderDate: string
  deliveryDate: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  items: SalesOrderItem[]
  totalQuantity: number
  totalAmount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  paymentTerms: string
  deliveryLocation: string
  salesRep: string
  notes?: string
  discount: number
  taxAmount: number
  shippingCost: number
  grandTotal: number
}

interface SalesOrderItem {
  id: string
  product: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  specifications?: string
}

const mockSalesOrders: SalesOrder[] = [
  {
    id: 'SO001',
    orderNumber: 'SO-2024-001',
    customerCode: 'BC-001',
    customerName: 'Shell Nigeria Limited',
    orderDate: '2024-11-16',
    deliveryDate: '2024-11-20',
    status: 'confirmed',
    priority: 'high',
    totalQuantity: 75000,
    totalAmount: 67500000,
    paymentStatus: 'pending',
    paymentTerms: '30 Days',
    deliveryLocation: 'Victoria Island Depot, Lagos',
    salesRep: 'John Sales Manager',
    discount: 2500000,
    taxAmount: 4725000,
    shippingCost: 500000,
    grandTotal: 70225000,
    items: [
      {
        id: 'SOI001',
        product: 'Premium Motor Spirit (PMS)',
        quantity: 50000,
        unit: 'Liters',
        unitPrice: 750,
        totalPrice: 37500000,
        specifications: 'RON 91, API Grade'
      },
      {
        id: 'SOI002',
        product: 'Automotive Gas Oil (AGO)',
        quantity: 25000,
        unit: 'Liters',
        unitPrice: 1200,
        totalPrice: 30000000,
        specifications: 'Cetane Number 45+'
      }
    ]
  },
  {
    id: 'SO002',
    orderNumber: 'SO-2024-002',
    customerCode: 'BC-003',
    customerName: 'Dangote Industries Limited',
    orderDate: '2024-11-15',
    deliveryDate: '2024-11-22',
    status: 'processing',
    priority: 'urgent',
    totalQuantity: 100000,
    totalAmount: 125000000,
    paymentStatus: 'partial',
    paymentTerms: '60 Days',
    deliveryLocation: 'Dangote Industrial Complex, Kano',
    salesRep: 'Ahmed Industrial Sales',
    notes: 'Bulk order for manufacturing operations',
    discount: 5000000,
    taxAmount: 8750000,
    shippingCost: 1200000,
    grandTotal: 129950000,
    items: [
      {
        id: 'SOI003',
        product: 'Automotive Gas Oil (AGO)',
        quantity: 80000,
        unit: 'Liters',
        unitPrice: 1200,
        totalPrice: 96000000
      },
      {
        id: 'SOI004',
        product: 'Industrial Lubricants',
        quantity: 20000,
        unit: 'Liters',
        unitPrice: 1450,
        totalPrice: 29000000
      }
    ]
  },
  {
    id: 'SO003',
    orderNumber: 'SO-2024-003',
    customerCode: 'BC-002',
    customerName: 'Federal Ministry of Transportation',
    orderDate: '2024-11-14',
    deliveryDate: '2024-11-25',
    status: 'shipped',
    priority: 'medium',
    totalQuantity: 40000,
    totalAmount: 42000000,
    paymentStatus: 'paid',
    paymentTerms: '45 Days',
    deliveryLocation: 'Federal Secretariat Complex, Abuja',
    salesRep: 'Sarah Government Relations',
    discount: 1000000,
    taxAmount: 2940000,
    shippingCost: 300000,
    grandTotal: 44240000,
    items: [
      {
        id: 'SOI005',
        product: 'Automotive Gas Oil (AGO)',
        quantity: 30000,
        unit: 'Liters',
        unitPrice: 1200,
        totalPrice: 36000000
      },
      {
        id: 'SOI006',
        product: 'Premium Motor Spirit (PMS)',
        quantity: 10000,
        unit: 'Liters',
        unitPrice: 600,
        totalPrice: 6000000
      }
    ]
  },
  {
    id: 'SO004',
    orderNumber: 'SO-2024-004',
    customerCode: 'BC-004',
    customerName: 'Coscharis Motors',
    orderDate: '2024-11-13',
    deliveryDate: '2024-11-18',
    status: 'delivered',
    priority: 'low',
    totalQuantity: 15000,
    totalAmount: 18750000,
    paymentStatus: 'paid',
    paymentTerms: '15 Days',
    deliveryLocation: 'Coscharis Service Center, Lagos',
    salesRep: 'Mike Retail Sales',
    discount: 500000,
    taxAmount: 1312500,
    shippingCost: 150000,
    grandTotal: 19712500,
    items: [
      {
        id: 'SOI007',
        product: 'Premium Motor Spirit (PMS)',
        quantity: 10000,
        unit: 'Liters',
        unitPrice: 750,
        totalPrice: 7500000
      },
      {
        id: 'SOI008',
        product: 'Engine Oil SAE 40',
        quantity: 5000,
        unit: 'Liters',
        unitPrice: 2250,
        totalPrice: 11250000
      }
    ]
  },
  {
    id: 'SO005',
    orderNumber: 'SO-2024-005',
    customerCode: 'BC-005',
    customerName: 'First Bank of Nigeria',
    orderDate: '2024-11-12',
    deliveryDate: '2024-11-19',
    status: 'cancelled',
    priority: 'medium',
    totalQuantity: 20000,
    totalAmount: 22000000,
    paymentStatus: 'pending',
    paymentTerms: '30 Days',
    deliveryLocation: 'Marina Head Office, Lagos',
    salesRep: 'Lisa Corporate Sales',
    notes: 'Cancelled due to budget constraints',
    discount: 500000,
    taxAmount: 1540000,
    shippingCost: 200000,
    grandTotal: 23240000,
    items: [
      {
        id: 'SOI009',
        product: 'Premium Motor Spirit (PMS)',
        quantity: 15000,
        unit: 'Liters',
        unitPrice: 750,
        totalPrice: 11250000
      },
      {
        id: 'SOI010',
        product: 'Automotive Gas Oil (AGO)',
        quantity: 5000,
        unit: 'Liters',
        unitPrice: 2150,
        totalPrice: 10750000
      }
    ]
  },
  {
    id: 'SO006',
    orderNumber: 'SO-2024-006',
    customerCode: 'BC-001',
    customerName: 'Shell Nigeria Limited',
    orderDate: '2024-11-11',
    deliveryDate: '2024-11-16',
    status: 'delivered',
    priority: 'high',
    totalQuantity: 60000,
    totalAmount: 54000000,
    paymentStatus: 'overdue',
    paymentTerms: '30 Days',
    deliveryLocation: 'Apapa Depot, Lagos',
    salesRep: 'John Sales Manager',
    notes: 'Payment overdue by 5 days',
    discount: 2000000,
    taxAmount: 3780000,
    shippingCost: 400000,
    grandTotal: 56180000,
    items: [
      {
        id: 'SOI011',
        product: 'Dual Purpose Kerosene (DPK)',
        quantity: 35000,
        unit: 'Liters',
        unitPrice: 900,
        totalPrice: 31500000
      },
      {
        id: 'SOI012',
        product: 'LPG 12.5kg Cylinders',
        quantity: 1500,
        unit: 'Cylinders',
        unitPrice: 15000,
        totalPrice: 22500000
      }
    ]
  }
]

export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
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

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-purple-600 bg-purple-100'
      case 'shipped': return 'text-orange-600 bg-orange-100'
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'partial': return 'text-blue-600 bg-blue-100'
      case 'paid': return 'text-green-600 bg-green-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.salesRep.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.product.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority
    const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus

    const matchesDateRange = (!dateRange.start || order.orderDate >= dateRange.start) &&
      (!dateRange.end || order.orderDate <= dateRange.end)

    return matchesSearch && matchesStatus && matchesPriority && matchesPaymentStatus && matchesDateRange
  })

  const totalOrders = filteredOrders.length
  const totalValue = filteredOrders.reduce((sum, order) => sum + order.grandTotal, 0)
  const pendingOrders = filteredOrders.filter(order => ['pending', 'confirmed', 'processing'].includes(order.status)).length
  const overduePayments = filteredOrders.filter(order => order.paymentStatus === 'overdue').length

  const exportToCSV = () => {
    const headers = [
      'Order Number', 'Customer', 'Order Date', 'Delivery Date', 'Status', 'Priority',
      'Payment Status', 'Total Quantity', 'Total Amount (₦)', 'Sales Rep'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order =>
        [
          order.orderNumber,
          order.customerName,
          order.orderDate,
          order.deliveryDate,
          order.status,
          order.priority,
          order.paymentStatus,
          order.totalQuantity,
          order.grandTotal.toLocaleString(),
          order.salesRep
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sales-orders.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Sales Orders</h1>
            <p className="text-black">Manage customer orders and sales performance</p>
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
              <span>New Sales Order</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Orders</p>
                <p className="text-2xl font-bold text-black">{totalOrders}</p>
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
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Value</p>
                <p className="text-2xl font-bold text-black">₦{(totalValue / 1000000).toFixed(0)}M</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Overdue Payments</p>
                <p className="text-2xl font-bold text-black">{overduePayments}</p>
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
              <label className="block text-sm font-medium text-black mb-2">Payment</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
              >
                {paymentStatusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
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

        {/* Sales Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Order Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{order.orderNumber}</div>
                        <div className="text-sm text-black">Items: {order.items.length}</div>
                        <div className="text-sm text-black">Rep: {order.salesRep}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{order.customerName}</div>
                        <div className="text-sm text-black">{order.customerCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">
                        <div>Order: {order.orderDate}</div>
                        <div>Delivery: {order.deliveryDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                        <br />
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          <span className="capitalize">{order.priority}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div>Qty: <span className="font-medium">{order.totalQuantity.toLocaleString()}</span></div>
                        <div>Amount: <span className="font-medium">₦{(order.grandTotal / 1000000).toFixed(1)}M</span></div>
                        <div>Terms: <span className="text-black">{order.paymentTerms}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        <span className="capitalize">{order.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
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

        {/* Sales Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Sales Order Details - {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
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
                        <label className="block text-sm font-medium text-black">Order Number</label>
                        <p className="text-sm text-black font-medium">{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Order Date</label>
                        <p className="text-sm text-black">{selectedOrder.orderDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Delivery Date</label>
                        <p className="text-sm text-black">{selectedOrder.deliveryDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Status</label>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="capitalize">{selectedOrder.status}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Priority</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.priority)}`}>
                          <span className="capitalize">{selectedOrder.priority}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Customer</label>
                        <p className="text-sm text-black font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Customer Code</label>
                        <p className="text-sm text-black">{selectedOrder.customerCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Delivery Location</label>
                        <p className="text-sm text-black">{selectedOrder.deliveryLocation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Sales Representative</label>
                        <p className="text-sm text-black">{selectedOrder.salesRep}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Payment Status</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          <span className="capitalize">{selectedOrder.paymentStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
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
                        {selectedOrder.items.map((item) => (
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

                {/* Financial Summary */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Financial Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Subtotal:</span>
                          <span className="text-sm font-medium">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Discount:</span>
                          <span className="text-sm text-red-600">-₦{selectedOrder.discount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Tax (7%):</span>
                          <span className="text-sm font-medium">₦{selectedOrder.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Shipping:</span>
                          <span className="text-sm font-medium">₦{selectedOrder.shippingCost.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-l pl-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-black">Grand Total:</span>
                          <span className="text-lg font-bold text-[#8B1538]">₦{selectedOrder.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-black">Payment Terms: {selectedOrder.paymentTerms}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-black mb-2">Notes</h3>
                    <p className="text-sm text-black">{selectedOrder.notes}</p>
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