'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Download, Plus, Eye, Edit, Phone, Mail, MapPin, Calendar, TrendingUp, Users, Building, DollarSign, Star } from 'lucide-react'

interface Customer {
  id: string
  customerCode: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  customerType: 'retail' | 'wholesale' | 'industrial' | 'government'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  registrationDate: string
  lastOrderDate: string
  totalOrders: number
  totalValue: number
  creditLimit: number
  currentBalance: number
  paymentTerms: string
  salesRepresentative: string
  rating: number
  notes?: string
  products: string[]
  region: string
}

const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    customerCode: 'BC-001',
    companyName: 'Shell Nigeria Limited',
    contactPerson: 'Mr. David Johnson',
    email: 'david.johnson@shell.ng',
    phone: '+234-803-123-4567',
    address: '123 Victoria Island Road',
    city: 'Lagos',
    state: 'Lagos',
    customerType: 'wholesale',
    status: 'active',
    registrationDate: '2023-01-15',
    lastOrderDate: '2024-11-14',
    totalOrders: 156,
    totalValue: 2450000000,
    creditLimit: 500000000,
    currentBalance: 125000000,
    paymentTerms: '30 Days',
    salesRepresentative: 'John Sales Manager',
    rating: 5,
    notes: 'Premium wholesale customer with excellent payment history',
    products: ['PMS', 'AGO', 'DPK', 'LPG'],
    region: 'South West'
  },
  {
    id: 'CUST002',
    customerCode: 'BC-002',
    companyName: 'Federal Ministry of Transportation',
    contactPerson: 'Mrs. Amina Bello',
    email: 'amina.bello@transportation.gov.ng',
    phone: '+234-809-876-5432',
    address: 'Federal Secretariat Complex',
    city: 'Abuja',
    state: 'FCT',
    customerType: 'government',
    status: 'active',
    registrationDate: '2023-03-22',
    lastOrderDate: '2024-11-15',
    totalOrders: 89,
    totalValue: 1250000000,
    creditLimit: 200000000,
    currentBalance: 45000000,
    paymentTerms: '45 Days',
    salesRepresentative: 'Sarah Government Relations',
    rating: 4,
    products: ['AGO', 'PMS'],
    region: 'North Central'
  },
  {
    id: 'CUST003',
    customerCode: 'BC-003',
    companyName: 'Dangote Industries Limited',
    contactPerson: 'Eng. Mohammed Hassan',
    email: 'mohammed.hassan@dangote.com',
    phone: '+234-812-345-6789',
    address: 'Dangote Industrial Complex',
    city: 'Kano',
    state: 'Kano',
    customerType: 'industrial',
    status: 'active',
    registrationDate: '2022-08-10',
    lastOrderDate: '2024-11-13',
    totalOrders: 234,
    totalValue: 3850000000,
    creditLimit: 800000000,
    currentBalance: 180000000,
    paymentTerms: '60 Days',
    salesRepresentative: 'Ahmed Industrial Sales',
    rating: 5,
    notes: 'Largest industrial customer - bulk fuel requirements for manufacturing operations',
    products: ['AGO', 'PMS', 'Industrial Oils'],
    region: 'North West'
  },
  {
    id: 'CUST004',
    customerCode: 'BC-004',
    companyName: 'Coscharis Motors',
    contactPerson: 'Mr. Chidi Okwu',
    email: 'chidi.okwu@coscharis.com',
    phone: '+234-807-234-5678',
    address: '234 Adeola Odeku Street',
    city: 'Lagos',
    state: 'Lagos',
    customerType: 'retail',
    status: 'active',
    registrationDate: '2023-06-18',
    lastOrderDate: '2024-11-12',
    totalOrders: 78,
    totalValue: 450000000,
    creditLimit: 100000000,
    currentBalance: 25000000,
    paymentTerms: '15 Days',
    salesRepresentative: 'Mike Retail Sales',
    rating: 4,
    products: ['PMS', 'Engine Oil', 'Lubricants'],
    region: 'South West'
  },
  {
    id: 'CUST005',
    customerCode: 'BC-005',
    companyName: 'First Bank of Nigeria',
    contactPerson: 'Dr. Fatima Aliyu',
    email: 'fatima.aliyu@firstbank.com.ng',
    phone: '+234-816-789-0123',
    address: 'Samuel Asabia House, Marina',
    city: 'Lagos',
    state: 'Lagos',
    customerType: 'wholesale',
    status: 'active',
    registrationDate: '2023-02-28',
    lastOrderDate: '2024-11-10',
    totalOrders: 45,
    totalValue: 850000000,
    creditLimit: 300000000,
    currentBalance: 75000000,
    paymentTerms: '30 Days',
    salesRepresentative: 'Lisa Corporate Sales',
    rating: 5,
    products: ['PMS', 'AGO'],
    region: 'South West'
  },
  {
    id: 'CUST006',
    customerCode: 'BC-006',
    companyName: 'Plateau State Government',
    contactPerson: 'Hon. Peter Mancha',
    email: 'peter.mancha@plateaustate.gov.ng',
    phone: '+234-813-456-7890',
    address: 'Government House',
    city: 'Jos',
    state: 'Plateau',
    customerType: 'government',
    status: 'suspended',
    registrationDate: '2023-05-12',
    lastOrderDate: '2024-09-20',
    totalOrders: 23,
    totalValue: 320000000,
    creditLimit: 150000000,
    currentBalance: 95000000,
    paymentTerms: '60 Days',
    salesRepresentative: 'Sarah Government Relations',
    rating: 2,
    notes: 'Account suspended due to overdue payments',
    products: ['AGO', 'PMS'],
    region: 'North Central'
  }
]

export default function CustomersOverviewPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const customerTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'government', label: 'Government' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' }
  ]

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'South West', label: 'South West' },
    { value: 'South East', label: 'South East' },
    { value: 'South South', label: 'South South' },
    { value: 'North Central', label: 'North Central' },
    { value: 'North East', label: 'North East' },
    { value: 'North West', label: 'North West' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-black bg-gray-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'text-blue-600 bg-blue-100'
      case 'wholesale': return 'text-purple-600 bg-purple-100'
      case 'industrial': return 'text-orange-600 bg-orange-100'
      case 'government': return 'text-green-600 bg-green-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)

    const matchesType = filterType === 'all' || customer.customerType === filterType
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    const matchesRegion = filterRegion === 'all' || customer.region === filterRegion

    return matchesSearch && matchesType && matchesStatus && matchesRegion
  })

  const totalCustomers = filteredCustomers.length
  const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length
  const totalRevenue = filteredCustomers.reduce((sum, customer) => sum + customer.totalValue, 0)
  const averageOrderValue = totalRevenue / filteredCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0) || 0

  const exportToCSV = () => {
    const headers = [
      'Customer Code', 'Company Name', 'Contact Person', 'Email', 'Phone',
      'Type', 'Status', 'Region', 'Total Orders', 'Total Value (₦)', 'Credit Limit (₦)',
      'Current Balance (₦)', 'Payment Terms', 'Sales Rep', 'Rating'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map(customer =>
        [
          customer.customerCode,
          customer.companyName,
          customer.contactPerson,
          customer.email,
          customer.phone,
          customer.customerType,
          customer.status,
          customer.region,
          customer.totalOrders,
          customer.totalValue.toLocaleString(),
          customer.creditLimit.toLocaleString(),
          customer.currentBalance.toLocaleString(),
          customer.paymentTerms,
          customer.salesRepresentative,
          customer.rating
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customers-overview.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Customer Management</h1>
            <p className="text-black">Manage your customer relationships and accounts</p>
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
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Customers</p>
                <p className="text-2xl font-bold text-black">{totalCustomers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Active Customers</p>
                <p className="text-2xl font-bold text-black">{activeCustomers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Revenue</p>
                <p className="text-2xl font-bold text-black">₦{(totalRevenue / 1000000).toFixed(0)}M</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#E67E22]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Avg Order Value</p>
                <p className="text-2xl font-bold text-black">₦{(averageOrderValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Customer Type</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {customerTypes.map(type => (
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
              <label className="block text-sm font-medium text-black mb-2">Region</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Business Metrics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Financial Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{customer.companyName}</div>
                        <div className="text-sm text-black">{customer.customerCode}</div>
                        <div className="text-sm text-black">{customer.contactPerson}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-black">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-black">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-black">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.city}, {customer.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(customer.customerType)}`}>
                          <span className="capitalize">{customer.customerType}</span>
                        </span>
                        <br />
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          <span className="capitalize">{customer.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div>Orders: <span className="font-medium">{customer.totalOrders}</span></div>
                        <div>Revenue: <span className="font-medium">₦{(customer.totalValue / 1000000).toFixed(1)}M</span></div>
                        <div>Region: <span className="text-black">{customer.region}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div>Credit: <span className="font-medium">₦{(customer.creditLimit / 1000000).toFixed(0)}M</span></div>
                        <div>Balance: <span className="font-medium">₦{(customer.currentBalance / 1000000).toFixed(1)}M</span></div>
                        <div>Terms: <span className="text-black">{customer.paymentTerms}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(customer.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
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

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Customer Details - {selectedCustomer.companyName}
                </h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Company Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Customer Code</label>
                        <p className="text-sm text-black font-medium">{selectedCustomer.customerCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Company Name</label>
                        <p className="text-sm text-black font-medium">{selectedCustomer.companyName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Contact Person</label>
                        <p className="text-sm text-black">{selectedCustomer.contactPerson}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Customer Type</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedCustomer.customerType)}`}>
                          <span className="capitalize">{selectedCustomer.customerType}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Status</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                          <span className="capitalize">{selectedCustomer.status}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Rating</label>
                        <div className="flex items-center space-x-1">
                          {getRatingStars(selectedCustomer.rating)}
                          <span className="text-sm text-black ml-2">({selectedCustomer.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Email</label>
                        <p className="text-sm text-black">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Phone</label>
                        <p className="text-sm text-black">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Address</label>
                        <p className="text-sm text-black">{selectedCustomer.address}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">City, State</label>
                        <p className="text-sm text-black">{selectedCustomer.city}, {selectedCustomer.state}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Region</label>
                        <p className="text-sm text-black">{selectedCustomer.region}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Metrics */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Business Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                      <div className="text-sm text-black">Total Orders</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">₦{(selectedCustomer.totalValue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-black">Total Revenue</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">₦{((selectedCustomer.totalValue / selectedCustomer.totalOrders) / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-black">Avg Order Value</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{Math.round((Date.now() - new Date(selectedCustomer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))}</div>
                      <div className="text-sm text-black">Days Since Last Order</div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black">Credit Limit</label>
                      <p className="text-lg font-bold text-black">₦{selectedCustomer.creditLimit.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Current Balance</label>
                      <p className="text-lg font-bold text-black">₦{selectedCustomer.currentBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Payment Terms</label>
                      <p className="text-lg font-bold text-black">{selectedCustomer.paymentTerms}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Credit Utilization</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${selectedCustomer.currentBalance / selectedCustomer.creditLimit > 0.8 ? 'bg-red-500' : selectedCustomer.currentBalance / selectedCustomer.creditLimit > 0.5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((selectedCustomer.currentBalance / selectedCustomer.creditLimit) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-black">
                          {Math.round((selectedCustomer.currentBalance / selectedCustomer.creditLimit) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products and Sales Rep */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black">Products Purchased</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCustomer.products.map((product, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Sales Representative</label>
                      <p className="text-sm text-black">{selectedCustomer.salesRepresentative}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Registration Date</label>
                      <p className="text-sm text-black">{selectedCustomer.registrationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Last Order Date</label>
                      <p className="text-sm text-black">{selectedCustomer.lastOrderDate}</p>
                    </div>
                    {selectedCustomer.notes && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black">Notes</label>
                        <p className="text-sm text-black">{selectedCustomer.notes}</p>
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