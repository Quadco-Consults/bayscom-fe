'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Download,
  Fuel,
  MapPin,
  User,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  FileText,
  Settings,
  Plus,
  Droplet,
  Gauge,
  Users,
  Clock,
  Package,
  ShoppingCart,
  CreditCard,
} from 'lucide-react'

interface FillingStation {
  id: string
  stationCode: string
  name: string
  location: string
  state: string
  city: string
  manager: string
  managerPhone: string
  status: string
  operationalStatus: string
  licenseNumber: string
  licenseExpiry: string
  totalPumps: number
  activePumps: number
  products: Product[]
  dailySales: SalesData
  monthlySales: SalesData
  lastDelivery: string
  nextDelivery: string
  staff: number
  shifts: string[]
  facilities: string[]
  openingHours: string
  established: string
  notes: string
}

interface Product {
  type: string
  tanks: number
  capacity: number
  currentLevel: number
  price: number
}

interface SalesData {
  pms?: { volume: number; revenue: number }
  ago?: { volume: number; revenue: number }
  dpk?: { volume: number; revenue: number }
  total: { volume: number; revenue: number }
}

const mockStations: FillingStation[] = [
  {
    id: 'FS001',
    stationCode: 'BAY-FCT-001',
    name: 'Bayscom Energy Station - Wuse',
    location: 'Plot 123, Wuse Zone 4, Abuja',
    state: 'FCT',
    city: 'Abuja',
    manager: 'Abubakar Sani',
    managerPhone: '+234-801-234-5678',
    status: 'Active',
    operationalStatus: 'Open',
    licenseNumber: 'DPR/FS/ABJ/001/2024',
    licenseExpiry: '2025-12-31',
    totalPumps: 8,
    activePumps: 7,
    products: [
      { type: 'PMS', tanks: 2, capacity: 60000, currentLevel: 45000, price: 850 },
      { type: 'AGO', tanks: 1, capacity: 30000, currentLevel: 22000, price: 950 },
      { type: 'DPK', tanks: 1, capacity: 20000, currentLevel: 15000, price: 920 }
    ],
    dailySales: {
      pms: { volume: 12500, revenue: 10625000 },
      ago: { volume: 8200, revenue: 7790000 },
      dpk: { volume: 2100, revenue: 1932000 },
      total: { volume: 22800, revenue: 20347000 }
    },
    monthlySales: {
      pms: { volume: 387500, revenue: 329375000 },
      ago: { volume: 254200, revenue: 241490000 },
      dpk: { volume: 65100, revenue: 59892000 },
      total: { volume: 706800, revenue: 630757000 }
    },
    lastDelivery: '2024-11-15',
    nextDelivery: '2024-11-18',
    staff: 12,
    shifts: ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'],
    facilities: ['ATM', 'Convenience Store', 'Restroom', 'Car Wash'],
    openingHours: '24/7',
    established: '2022-05-15',
    notes: 'High-traffic location with good visibility from main road'
  },
  {
    id: 'FS002',
    stationCode: 'BAY-LGS-002',
    name: 'Bayscom Energy Station - Victoria Island',
    location: '45 Ahmadu Bello Way, Victoria Island, Lagos',
    state: 'Lagos',
    city: 'Lagos',
    manager: 'Chidi Okonkwo',
    managerPhone: '+234-802-345-6789',
    status: 'Active',
    operationalStatus: 'Open',
    licenseNumber: 'DPR/FS/LGS/002/2024',
    licenseExpiry: '2025-08-20',
    totalPumps: 12,
    activePumps: 12,
    products: [
      { type: 'PMS', tanks: 3, capacity: 90000, currentLevel: 67000, price: 850 },
      { type: 'AGO', tanks: 2, capacity: 60000, currentLevel: 48000, price: 950 },
      { type: 'DPK', tanks: 1, capacity: 30000, currentLevel: 18000, price: 920 }
    ],
    dailySales: {
      pms: { volume: 18700, revenue: 15895000 },
      ago: { volume: 12800, revenue: 12160000 },
      dpk: { volume: 3200, revenue: 2944000 },
      total: { volume: 34700, revenue: 30999000 }
    },
    monthlySales: {
      pms: { volume: 561000, revenue: 476850000 },
      ago: { volume: 384000, revenue: 364800000 },
      dpk: { volume: 96000, revenue: 88320000 },
      total: { volume: 1041000, revenue: 929970000 }
    },
    lastDelivery: '2024-11-16',
    nextDelivery: '2024-11-19',
    staff: 18,
    shifts: ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'],
    facilities: ['ATM', 'Convenience Store', 'Restroom', 'Car Wash', 'Restaurant'],
    openingHours: '24/7',
    established: '2021-03-20',
    notes: 'Premium location serving corporate clients and high-end vehicles'
  },
]

export default function FillingStationDetailPage() {
  const params = useParams()
  const stationId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales' | 'transactions' | 'staff'>('overview')

  const station = mockStations.find(s => s.id === stationId)

  if (!station) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <Fuel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Station Not Found</h3>
            <p className="text-gray-600 mb-4">The filling station you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/filling-stations"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Stations
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
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Under Maintenance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Inactive': 'bg-red-100 text-red-800 border-red-200',
    }

    const icons = {
      'Active': CheckCircle,
      'Under Maintenance': AlertTriangle,
      'Inactive': AlertTriangle,
    }

    const Icon = icons[status as keyof typeof icons] || CheckCircle

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="w-4 h-4" />
        {status}
      </span>
    )
  }

  const getOperationalBadge = (status: string) => {
    const isOpen = status === 'Open'
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border rounded-full ${
          isOpen ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        <Activity className="w-4 h-4" />
        {status}
      </span>
    )
  }

  const getStockLevel = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage > 70) return { color: 'bg-green-600', text: 'Good' }
    if (percentage > 30) return { color: 'bg-yellow-600', text: 'Medium' }
    return { color: 'bg-red-600', text: 'Low' }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/filling-stations"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{station.name}</h1>
                {getStatusBadge(station.status)}
                {getOperationalBadge(station.operationalStatus)}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {station.location}
                </span>
                <span>•</span>
                <span>{station.stationCode}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}>
              <Edit className="w-4 h-4" />
              Edit Station
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="mt-2 text-xl font-semibold text-green-600">
                  {formatCurrency(station.dailySales.total.revenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {station.dailySales.total.volume.toLocaleString()}L sold
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(station.monthlySales.total.revenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {station.monthlySales.total.volume.toLocaleString()}L
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Pumps</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {station.activePumps}/{station.totalPumps}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((station.activePumps / station.totalPumps) * 100).toFixed(0)}% operational
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Gauge className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{station.staff}</p>
                <p className="text-xs text-gray-500 mt-1">{station.shifts.length} shifts</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'inventory'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sales'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sales & Financials
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'staff'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Staff & Operations
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Station Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Station Code:</span>
                        <span className="text-sm font-medium text-gray-900">{station.stationCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm font-medium text-gray-900">{station.city}, {station.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Established:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(station.established)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">License Number:</span>
                        <span className="text-sm font-medium text-gray-900">{station.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">License Expiry:</span>
                        <span className="text-sm font-medium text-orange-600">{formatDate(station.licenseExpiry)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Opening Hours:</span>
                        <span className="text-sm font-medium text-gray-900">{station.openingHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Manager Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Manager Name:</span>
                        <span className="text-sm font-medium text-gray-900">{station.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium text-gray-900">{station.managerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Staff:</span>
                        <span className="text-sm font-medium text-gray-900">{station.staff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Pumps:</span>
                        <span className="text-sm font-medium text-gray-900">{station.totalPumps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Pumps:</span>
                        <span className="text-sm font-medium text-green-600">{station.activePumps}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {station.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-gray-700 text-sm font-medium border border-gray-200 rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Schedule */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Schedule</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Delivery</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(station.lastDelivery)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Next Delivery</p>
                      <p className="text-lg font-semibold text-orange-600">{formatDate(station.nextDelivery)}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {station.notes && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900">Notes</h4>
                        <p className="text-sm text-blue-700 mt-1">{station.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    <Plus className="w-4 h-4" />
                    Record Delivery
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {station.products.map((product, index) => {
                    const stockLevel = getStockLevel(product.currentLevel, product.capacity)
                    const percentage = (product.currentLevel / product.capacity) * 100

                    return (
                      <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <Droplet className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{product.type}</h4>
                              <p className="text-sm text-gray-600">{product.tanks} tank(s)</p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              stockLevel.text === 'Good'
                                ? 'bg-green-100 text-green-800'
                                : stockLevel.text === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {stockLevel.text} Stock
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Current Level</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {product.currentLevel.toLocaleString()}L
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Capacity</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {product.capacity.toLocaleString()}L
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Current Price</p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₦{product.price}/L
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Tank Level</span>
                            <span className="font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${stockLevel.color}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg"
                            style={{ backgroundColor: '#8B1538' }}
                          >
                            Update Price
                          </button>
                          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            View History
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sales Tab */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>

                {/* Daily Sales Breakdown */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Today's Sales by Product</h4>
                  <div className="space-y-4">
                    {station.dailySales.pms && (
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Fuel className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">PMS (Premium Motor Spirit)</p>
                            <p className="text-sm text-gray-600">{station.dailySales.pms.volume.toLocaleString()}L sold</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(station.dailySales.pms.revenue)}
                        </p>
                      </div>
                    )}
                    {station.dailySales.ago && (
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Fuel className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">AGO (Automotive Gas Oil)</p>
                            <p className="text-sm text-gray-600">{station.dailySales.ago.volume.toLocaleString()}L sold</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(station.dailySales.ago.revenue)}
                        </p>
                      </div>
                    )}
                    {station.dailySales.dpk && station.dailySales.dpk.volume > 0 && (
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Fuel className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">DPK (Dual Purpose Kerosene)</p>
                            <p className="text-sm text-gray-600">{station.dailySales.dpk.volume.toLocaleString()}L sold</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(station.dailySales.dpk.revenue)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Monthly Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Total Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(station.monthlySales.total.revenue)}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Total Volume Sold</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {station.monthlySales.total.volume.toLocaleString()}L
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 mb-1">Avg Daily Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(station.monthlySales.total.revenue / 30)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    <Plus className="w-4 h-4" />
                    New Transaction
                  </button>
                </div>

                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Transaction history will appear here</p>
                  <p className="text-sm text-gray-500 mt-1">Record sales and track all transactions</p>
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Staff & Operations</h3>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Staff
                  </button>
                </div>

                {/* Staff Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Staff</p>
                    <p className="text-2xl font-semibold text-gray-900">{station.staff}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">Shifts</p>
                    <p className="text-2xl font-semibold text-gray-900">{station.shifts.length}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">Station Manager</p>
                    <p className="text-lg font-semibold text-gray-900">{station.manager}</p>
                  </div>
                </div>

                {/* Shifts */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Work Shifts</h4>
                  <div className="space-y-3">
                    {station.shifts.map((shift, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{shift}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
