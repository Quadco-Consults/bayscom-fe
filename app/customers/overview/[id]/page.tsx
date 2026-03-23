'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, TrendingUp, Building,
  DollarSign, Star, Edit, ShoppingCart, Clock, AlertCircle,
  CreditCard, FileText, Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'orders'>('overview')

  const customer = mockCustomers.find(c => c.id === customerId)

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Customer not found</p>
            <Link href="/customers/overview" className="text-[#8B1538] hover:underline mt-4 inline-block">
              Return to customer list
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[type as keyof typeof styles]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/customers/overview"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-[#8B1538] to-[#7A1230] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {customer.companyName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{customer.companyName}</h1>
                <p className="text-sm text-gray-500">{customer.customerCode}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7A1230] transition-colors">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Create Order
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#8B1538] text-[#8B1538]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'financial'
                  ? 'border-[#8B1538] text-[#8B1538]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-[#8B1538] text-[#8B1538]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-sm font-medium">Total Orders</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{customer.totalOrders}</div>
                <p className="text-sm text-gray-500 mt-1">All-time</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Total Revenue</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₦{(customer.totalValue / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-500 mt-1">Lifetime value</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">Avg Order Value</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₦{((customer.totalValue / customer.totalOrders) / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-500 mt-1">Per order</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Last Order</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))}d
                </div>
                <p className="text-sm text-gray-500 mt-1">Days ago</p>
              </div>
            </div>

            {/* Company & Contact Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-[#8B1538]" />
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Contact Person</span>
                    <span className="text-sm text-gray-900 font-medium">{customer.contactPerson}</span>
                  </div>
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Customer Type</span>
                    {getTypeBadge(customer.customerType)}
                  </div>
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    {getStatusBadge(customer.status)}
                  </div>
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Region</span>
                    <span className="text-sm text-gray-900 font-medium">{customer.region}</span>
                  </div>
                  <div className="flex items-start justify-between py-3">
                    <span className="text-sm font-medium text-gray-500">Rating</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {getRatingStars(customer.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({customer.rating}/5)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-[#8B1538]" />
                  Contact Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <a href={`mailto:${customer.email}`} className="text-sm text-[#8B1538] hover:underline">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <a href={`tel:${customer.phone}`} className="text-sm text-[#8B1538] hover:underline">
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                      <p className="text-sm text-gray-900">{customer.address}</p>
                      <p className="text-sm text-gray-600">{customer.city}, {customer.state}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products & Sales Rep */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Products Purchased</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.products.map((product, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg border border-gray-200">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Sales Representative</h3>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {customer.salesRepresentative.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{customer.salesRepresentative}</p>
                    <p className="text-xs text-gray-500">Account Manager</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Registration Date</label>
                    <p className="text-sm font-medium text-gray-900">{formatDate(customer.registrationDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Last Order Date</label>
                    <p className="text-sm font-medium text-gray-900">{formatDate(customer.lastOrderDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-yellow-600" />
                  Notes
                </h3>
                <p className="text-sm text-gray-700">{customer.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-900">Credit Limit</span>
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(customer.creditLimit)}</p>
                <p className="text-sm text-blue-700 mt-1">Maximum allowed</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-orange-900">Current Balance</span>
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-orange-900">{formatCurrency(customer.currentBalance)}</p>
                <p className="text-sm text-orange-700 mt-1">Outstanding</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-900">Available Credit</span>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(customer.creditLimit - customer.currentBalance)}
                </p>
                <p className="text-sm text-green-700 mt-1">Can be used</p>
              </div>
            </div>

            {/* Credit Utilization */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Utilization</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Usage</span>
                  <span className="font-semibold text-gray-900 text-lg">
                    {Math.round((customer.currentBalance / customer.creditLimit) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      (customer.currentBalance / customer.creditLimit) > 0.8
                        ? 'bg-red-500'
                        : (customer.currentBalance / customer.creditLimit) > 0.5
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((customer.currentBalance / customer.creditLimit) * 100, 100)}%` }}
                  ></div>
                </div>
                {(customer.currentBalance / customer.creditLimit) > 0.8 && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">High credit utilization - approaching limit</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Payment Terms</span>
                    <span className="text-sm font-bold text-gray-900">{customer.paymentTerms}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(customer.totalValue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500">Registration Date</label>
                      <p className="text-sm font-medium text-gray-900">{formatDate(customer.registrationDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500">Last Transaction</label>
                      <p className="text-sm font-medium text-gray-900">{formatDate(customer.lastOrderDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Order Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-900">Total Orders</span>
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{customer.totalOrders}</p>
                <p className="text-sm text-gray-500 mt-1">All-time orders</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-900">Average Order Value</span>
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ₦{((customer.totalValue / customer.totalOrders) / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-500 mt-1">Per order</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-purple-900">Last Order</span>
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
                <p className="text-sm text-gray-500 mt-1">ago</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-12 rounded-lg text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">Order History</p>
              <p className="text-sm text-gray-500">Integration with order management system required</p>
              <button className="mt-6 inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg hover:bg-[#7A1230] transition-colors">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Create New Order
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
