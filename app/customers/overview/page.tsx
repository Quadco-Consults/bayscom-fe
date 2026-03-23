/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
export const dynamic = 'force-dynamic'


import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  Search, Download, Plus, Eye, Edit,
  ChevronLeft, ChevronRight, ArrowUpDown,
  Users, DollarSign, Star, CreditCard
} from 'lucide-react'
import Link from 'next/link'

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
  const [customers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'orders' | 'balance'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(customer => {
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

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.companyName.localeCompare(b.companyName)
          break
        case 'revenue':
          comparison = a.totalValue - b.totalValue
          break
        case 'orders':
          comparison = a.totalOrders - b.totalOrders
          break
        case 'balance':
          comparison = a.currentBalance - b.currentBalance
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [customers, searchTerm, filterType, filterStatus, filterRegion, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const totalCustomers = filteredAndSortedCustomers.length
  const activeCustomers = filteredAndSortedCustomers.filter(c => c.status === 'active').length
  const totalRevenue = filteredAndSortedCustomers.reduce((sum, customer) => sum + customer.totalValue, 0)
  const totalBalance = filteredAndSortedCustomers.reduce((sum, customer) => sum + customer.currentBalance, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      retail: 'bg-blue-100 text-blue-800 border-blue-200',
      wholesale: 'bg-purple-100 text-purple-800 border-purple-200',
      industrial: 'bg-orange-100 text-orange-800 border-orange-200',
      government: 'bg-teal-100 text-teal-800 border-teal-200'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const handleSort = (field: 'name' | 'revenue' | 'orders' | 'balance') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Customer Code', 'Company Name', 'Contact Person', 'Email', 'Phone',
      'Type', 'Status', 'Region', 'Total Orders', 'Total Value (₦)', 'Credit Limit (₦)',
      'Current Balance (₦)', 'Payment Terms', 'Sales Rep', 'Rating'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedCustomers.map(customer =>
        [
          customer.customerCode,
          `"${customer.companyName}"`,
          `"${customer.contactPerson}"`,
          customer.email,
          customer.phone,
          customer.customerType,
          customer.status,
          customer.region,
          customer.totalOrders,
          customer.totalValue,
          customer.creditLimit,
          customer.currentBalance,
          customer.paymentTerms,
          `"${customer.salesRepresentative}"`,
          customer.rating
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage customer relationships and accounts</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7A1230] transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
                <p className="text-xs text-green-600 mt-1">
                  {activeCustomers} active
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₦{(totalRevenue / 1000000000).toFixed(2)}B
                </p>
                <p className="text-xs text-gray-500 mt-1">All-time</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="h-6 w-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₦{(totalBalance / 1000000).toFixed(0)}M
                </p>
                <p className="text-xs text-gray-500 mt-1">To be collected</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(filteredAndSortedCustomers.reduce((sum, c) => sum + c.rating, 0) / filteredAndSortedCustomers.length || 0).toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 ml-1">Customer satisfaction</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, code, email, phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Types</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="industrial">Industrial</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterRegion}
                onChange={(e) => {
                  setFilterRegion(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Regions</option>
                <option value="South West">South West</option>
                <option value="South East">South East</option>
                <option value="South South">South South</option>
                <option value="North Central">North Central</option>
                <option value="North East">North East</option>
                <option value="North West">North West</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results and Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedCustomers.length)}
            </span> of{' '}
            <span className="font-medium text-gray-900">{filteredAndSortedCustomers.length}</span> customers
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="name">Name</option>
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="balance">Balance</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowUpDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show:</label>
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-[#8B1538] to-[#7A1230] rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {customer.companyName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{customer.companyName}</div>
                          <div className="text-xs text-gray-500">{customer.customerCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.contactPerson}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(customer.customerType)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                      ₦{(customer.totalValue / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{(customer.currentBalance / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-gray-500">
                        of ₦{(customer.creditLimit / 1000000).toFixed(0)}M
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-0.5">
                        {getRatingStars(customer.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/customers/overview/${customer.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] text-xs font-medium transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Link>
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-[#8B1538] border-[#8B1538] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
