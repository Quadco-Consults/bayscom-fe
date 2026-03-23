/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const, react/no-unescaped-entities, @typescript-eslint/no-empty-object-type */
'use client'
export const dynamic = 'force-dynamic'


import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Link from 'next/link'
import {
  Truck,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  MapPin,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface TruckData {
  id: string
  plateNumber: string
  make: string
  model: string
  year: number
  chassisNumber: string
  capacity: number
  currentOdometer: number
  purchaseCost: number
  depreciationRate: number
  status: 'active' | 'maintenance' | 'retired' | 'out-of-service'
  registrationDate: string
  lastServiceDate?: string
  nextServiceDue?: string
  assignedDriver?: string
  driverPhone?: string
  totalTrips: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  lastTripDate?: string
  totalDistanceCovered: number
  averageProfitPerTrip: number
}

interface Location {
  id: string
  name: string
  address: string
  state: string
  ratePerLiter: number
  type: 'loading' | 'discharge' | 'both'
  isActive: boolean
  contactPerson?: string
  contactPhone?: string
}

const mockTrucks: TruckData[] = [
  {
    id: 'T001',
    plateNumber: 'FT-001-NG',
    make: 'Mercedes',
    model: 'Actros 2542',
    year: 2020,
    chassisNumber: 'WDB9440321L123456',
    capacity: 33000,
    currentOdometer: 125000,
    purchaseCost: 45000000,
    depreciationRate: 15,
    status: 'active',
    registrationDate: '2020-01-15',
    lastServiceDate: '2024-10-01',
    nextServiceDue: '2024-12-01',
    assignedDriver: 'Musa Ibrahim',
    driverPhone: '+234-803-123-4567',
    totalTrips: 245,
    totalRevenue: 98500000,
    totalExpenses: 52200000,
    netProfit: 46300000,
    lastTripDate: '2024-11-14',
    totalDistanceCovered: 125000,
    averageProfitPerTrip: 189000,
  },
  {
    id: 'T002',
    plateNumber: 'FT-002-NG',
    make: 'Volvo',
    model: 'FH16',
    year: 2019,
    chassisNumber: 'YV2R6400JKA123789',
    capacity: 40000,
    currentOdometer: 180000,
    purchaseCost: 52000000,
    depreciationRate: 15,
    status: 'active',
    registrationDate: '2019-03-10',
    lastServiceDate: '2024-09-15',
    nextServiceDue: '2024-11-25',
    assignedDriver: 'Ahmed Hassan',
    driverPhone: '+234-804-234-5678',
    totalTrips: 312,
    totalRevenue: 142800000,
    totalExpenses: 76500000,
    netProfit: 66300000,
    lastTripDate: '2024-11-13',
    totalDistanceCovered: 180000,
    averageProfitPerTrip: 212500,
  },
  {
    id: 'T003',
    plateNumber: 'FT-003-NG',
    make: 'Scania',
    model: 'R500',
    year: 2021,
    chassisNumber: 'XLBTE45G0EG123456',
    capacity: 35000,
    currentOdometer: 95000,
    purchaseCost: 48000000,
    depreciationRate: 15,
    status: 'maintenance',
    registrationDate: '2021-06-20',
    lastServiceDate: '2024-11-10',
    nextServiceDue: '2025-01-10',
    assignedDriver: 'Fatima Usman',
    driverPhone: '+234-805-345-6789',
    totalTrips: 189,
    totalRevenue: 84400000,
    totalExpenses: 42800000,
    netProfit: 41600000,
    lastTripDate: '2024-11-09',
    totalDistanceCovered: 95000,
    averageProfitPerTrip: 220000,
  },
]

const mockLocations: Location[] = [
  {
    id: 'L001',
    name: 'Lagos Terminal',
    address: 'Apapa Wharf, Lagos',
    state: 'Lagos',
    ratePerLiter: 850,
    type: 'loading',
    isActive: true,
    contactPerson: 'Mr. Adebayo',
    contactPhone: '+234-801-111-2222',
  },
  {
    id: 'L002',
    name: 'Kano Depot',
    address: 'Industrial Area, Kano',
    state: 'Kano',
    ratePerLiter: 920,
    type: 'discharge',
    isActive: true,
    contactPerson: 'Alhaji Musa',
    contactPhone: '+234-802-222-3333',
  },
  {
    id: 'L003',
    name: 'Port Harcourt Hub',
    address: 'Trans Amadi, PH',
    state: 'Rivers',
    ratePerLiter: 880,
    type: 'loading',
    isActive: true,
    contactPerson: 'Mr. Emmanuel',
    contactPhone: '+234-803-333-4444',
  },
  {
    id: 'L004',
    name: 'Abuja Station',
    address: 'Wuse Zone, Abuja',
    state: 'FCT',
    ratePerLiter: 900,
    type: 'discharge',
    isActive: true,
    contactPerson: 'Mrs. Sarah',
    contactPhone: '+234-804-444-5555',
  },
  {
    id: 'L005',
    name: 'Kaduna Filling Point',
    address: 'Kudenden, Kaduna',
    state: 'Kaduna',
    ratePerLiter: 910,
    type: 'discharge',
    isActive: true,
    contactPerson: 'Mr. Ibrahim',
    contactPhone: '+234-805-555-6666',
  },
  {
    id: 'L006',
    name: 'Warri Loading Bay',
    address: 'Warri, Delta',
    state: 'Delta',
    ratePerLiter: 870,
    type: 'loading',
    isActive: true,
    contactPerson: 'Mr. John',
    contactPhone: '+234-806-666-7777',
  },
]

export default function TrucksPage() {
  const [trucks] = useState<TruckData[]>(mockTrucks)
  const [locations] = useState<Location[]>(mockLocations)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMake, setFilterMake] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('plateNumber')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showLocationSection, setShowLocationSection] = useState(false)

  const calculateDepreciatedValue = (truck: TruckData) => {
    const currentYear = new Date().getFullYear()
    const registrationYear = new Date(truck.registrationDate).getFullYear()
    const yearsOwned = currentYear - registrationYear
    const depreciation = truck.purchaseCost * (truck.depreciationRate / 100) * yearsOwned
    return Math.max(truck.purchaseCost - depreciation, truck.purchaseCost * 0.1)
  }

  const totalFleetValue = trucks.reduce((sum, truck) => sum + calculateDepreciatedValue(truck), 0)
  const activeTrucks = trucks.filter(t => t.status === 'active').length
  const totalRevenue = trucks.reduce((sum, truck) => sum + truck.totalRevenue, 0)
  const totalProfit = trucks.reduce((sum, truck) => sum + truck.netProfit, 0)
  const totalExpenses = trucks.reduce((sum, truck) => sum + truck.totalExpenses, 0)
  const averageProfitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0

  const makes = ['all', ...Array.from(new Set(trucks.map(t => t.make)))]

  const filteredAndSortedTrucks = useMemo(() => {
    let filtered = trucks.filter(truck => {
      const matchesSearch =
        truck.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.assignedDriver?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || truck.status === filterStatus
      const matchesMake = filterMake === 'all' || truck.make === filterMake

      return matchesSearch && matchesStatus && matchesMake
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'plateNumber':
          comparison = a.plateNumber.localeCompare(b.plateNumber)
          break
        case 'make':
          comparison = a.make.localeCompare(b.make)
          break
        case 'revenue':
          comparison = a.totalRevenue - b.totalRevenue
          break
        case 'profit':
          comparison = a.netProfit - b.netProfit
          break
        case 'trips':
          comparison = a.totalTrips - b.totalTrips
          break
        case 'odometer':
          comparison = a.currentOdometer - b.currentOdometer
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [trucks, searchTerm, filterStatus, filterMake, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedTrucks.length / itemsPerPage)
  const paginatedTrucks = filteredAndSortedTrucks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      retired: 'bg-red-100 text-red-800 border-red-200',
      'out-of-service': 'bg-gray-100 text-gray-800 border-gray-200',
    }

    const icons = {
      active: CheckCircle,
      maintenance: AlertTriangle,
      retired: Clock,
      'out-of-service': Clock,
    }

    const Icon = icons[status as keyof typeof icons]

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="w-3 h-3" />
        {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your fuel transportation fleet with comprehensive trip tracking and financial accounting
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLocationSection(!showLocationSection)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <MapPin className="w-4 h-4" />
              {showLocationSection ? 'Hide Locations' : 'Manage Locations'}
            </button>
            <Link
              href="/trucks/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
            >
              <Plus className="w-4 h-4" />
              Add New Truck
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trucks</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{activeTrucks}</p>
                <p className="text-xs text-gray-500 mt-1">of {trucks.length} total</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1">+15.2% vs last month</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalProfit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{averageProfitMargin.toFixed(1)}% margin</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fleet Value</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalFleetValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Depreciated value</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section (Collapsible) */}
        {showLocationSection && (
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Loading & Discharge Locations</h3>
              <Link
                href="/trucks/locations/new"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg"
                style={{ backgroundColor: '#8B1538' }}
              >
                <Plus className="w-4 h-4" />
                Add Location
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map(location => (
                <div key={location.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{location.name}</h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        location.type === 'loading'
                          ? 'bg-blue-100 text-blue-800'
                          : location.type === 'discharge'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-xs text-gray-500">{location.state} State</p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Rate per Liter:</span>
                      <span className="text-sm font-semibold text-green-600">₦{location.ratePerLiter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by plate number, make, model, or driver..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
                <option value="out-of-service">Out of Service</option>
              </select>
            </div>

            <div>
              <select
                value={filterMake}
                onChange={e => setFilterMake(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {makes.map(make => (
                  <option key={make} value={make}>
                    {make === 'all' ? 'All Makes' : make}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="plateNumber">Plate Number</option>
                <option value="make">Make</option>
                <option value="revenue">Revenue</option>
                <option value="profit">Profit</option>
                <option value="trips">Total Trips</option>
                <option value="odometer">Odometer</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {paginatedTrucks.length} of {filteredAndSortedTrucks.length} trucks
            </div>
          </div>
        </div>

        {/* Trucks Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Truck Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Odometer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trips
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTrucks.map(truck => (
                  <tr key={truck.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{truck.plateNumber}</div>
                          <div className="text-sm text-gray-500">
                            {truck.make} {truck.model} ({truck.year})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{truck.assignedDriver || 'Unassigned'}</div>
                      {truck.driverPhone && (
                        <div className="text-xs text-gray-500">{truck.driverPhone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{truck.capacity.toLocaleString()}L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{truck.currentOdometer.toLocaleString()}km</div>
                      <div className="text-xs text-gray-500">{truck.totalDistanceCovered.toLocaleString()}km total</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{truck.totalTrips}</div>
                      <div className="text-xs text-gray-500">
                        Avg: {formatCurrency(truck.averageProfitPerTrip)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(truck.netProfit)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((truck.netProfit / truck.totalRevenue) * 100).toFixed(1)}% margin
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(truck.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/trucks/${truck.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] text-xs font-medium transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Link>
                        <button className="inline-flex items-center px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-xs font-medium transition-colors">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Export and Actions */}
        <div className="flex items-center justify-end gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
