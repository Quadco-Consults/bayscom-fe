'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit, MapPin, Fuel, TrendingUp, User, Phone, Calendar, AlertTriangle, CheckCircle, Activity, DollarSign, BarChart, FileText, Settings } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

// Mock data for filling stations
const fillingStations = [
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
  {
    id: 'FS003',
    stationCode: 'BAY-KAN-003',
    name: 'Bayscom Energy Station - Sabon Gari',
    location: 'Katsina Road, Sabon Gari, Kano',
    state: 'Kano',
    city: 'Kano',
    manager: 'Hauwa Abdullahi',
    managerPhone: '+234-803-456-7890',
    status: 'Under Maintenance',
    operationalStatus: 'Temporary Closure',
    licenseNumber: 'DPR/FS/KAN/003/2024',
    licenseExpiry: '2025-10-15',
    totalPumps: 6,
    activePumps: 0,
    products: [
      { type: 'PMS', tanks: 2, capacity: 40000, currentLevel: 5000, price: 850 },
      { type: 'AGO', tanks: 1, capacity: 20000, currentLevel: 8000, price: 950 }
    ],
    dailySales: {
      pms: { volume: 0, revenue: 0 },
      ago: { volume: 0, revenue: 0 },
      dpk: { volume: 0, revenue: 0 },
      total: { volume: 0, revenue: 0 }
    },
    monthlySales: {
      pms: { volume: 285000, revenue: 242250000 },
      ago: { volume: 156000, revenue: 148200000 },
      dpk: { volume: 0, revenue: 0 },
      total: { volume: 441000, revenue: 390450000 }
    },
    lastDelivery: '2024-11-10',
    nextDelivery: '2024-11-20',
    staff: 8,
    shifts: ['Day Shift (8AM-8PM)', 'Night Shift (8PM-8AM)'],
    facilities: ['ATM', 'Restroom'],
    openingHours: 'Currently Closed for Maintenance',
    established: '2023-08-10',
    notes: 'Pump system upgrade and tank maintenance in progress'
  },
  {
    id: 'FS004',
    stationCode: 'BAY-PHC-004',
    name: 'Bayscom Energy Station - Port Harcourt',
    location: 'Aba Road, Port Harcourt, Rivers State',
    state: 'Rivers',
    city: 'Port Harcourt',
    manager: 'Emeka Nwosu',
    managerPhone: '+234-804-567-8901',
    status: 'Active',
    operationalStatus: 'Open',
    licenseNumber: 'DPR/FS/RIV/004/2024',
    licenseExpiry: '2025-06-30',
    totalPumps: 10,
    activePumps: 9,
    products: [
      { type: 'PMS', tanks: 2, capacity: 70000, currentLevel: 52000, price: 850 },
      { type: 'AGO', tanks: 2, capacity: 50000, currentLevel: 35000, price: 950 },
      { type: 'DPK', tanks: 1, capacity: 25000, currentLevel: 12000, price: 920 }
    ],
    dailySales: {
      pms: { volume: 15200, revenue: 12920000 },
      ago: { volume: 9800, revenue: 9310000 },
      dpk: { volume: 2800, revenue: 2576000 },
      total: { volume: 27800, revenue: 24806000 }
    },
    monthlySales: {
      pms: { volume: 456000, revenue: 387600000 },
      ago: { volume: 294000, revenue: 279300000 },
      dpk: { volume: 84000, revenue: 77280000 },
      total: { volume: 834000, revenue: 744180000 }
    },
    lastDelivery: '2024-11-14',
    nextDelivery: '2024-11-17',
    staff: 15,
    shifts: ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'],
    facilities: ['ATM', 'Convenience Store', 'Restroom', 'Tire Service'],
    openingHours: '24/7',
    established: '2022-11-05',
    notes: 'Strategic location serving oil industry workers and commercial vehicles'
  },
  {
    id: 'FS005',
    stationCode: 'BAY-KDN-005',
    name: 'Bayscom Energy Station - Kaduna',
    location: 'Constitution Road, Kaduna',
    state: 'Kaduna',
    city: 'Kaduna',
    manager: 'Yakubu Ibrahim',
    managerPhone: '+234-805-678-9012',
    status: 'Active',
    operationalStatus: 'Low Stock',
    licenseNumber: 'DPR/FS/KDN/005/2024',
    licenseExpiry: '2025-04-25',
    totalPumps: 8,
    activePumps: 6,
    products: [
      { type: 'PMS', tanks: 2, capacity: 50000, currentLevel: 8000, price: 850 },
      { type: 'AGO', tanks: 1, capacity: 25000, currentLevel: 15000, price: 950 },
      { type: 'DPK', tanks: 1, capacity: 15000, currentLevel: 3000, price: 920 }
    ],
    dailySales: {
      pms: { volume: 11500, revenue: 9775000 },
      ago: { volume: 7200, revenue: 6840000 },
      dpk: { volume: 1800, revenue: 1656000 },
      total: { volume: 20500, revenue: 18271000 }
    },
    monthlySales: {
      pms: { volume: 345000, revenue: 293250000 },
      ago: { volume: 216000, revenue: 205200000 },
      dpk: { volume: 54000, revenue: 49680000 },
      total: { volume: 615000, revenue: 548130000 }
    },
    lastDelivery: '2024-11-12',
    nextDelivery: '2024-11-17',
    staff: 10,
    shifts: ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'],
    facilities: ['ATM', 'Convenience Store', 'Restroom'],
    openingHours: '6AM - 12AM',
    established: '2023-04-15',
    notes: 'Urgent restocking needed - PMS and DPK levels critically low'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'text-green-600 bg-green-50'
    case 'Under Maintenance': return 'text-orange-600 bg-orange-50'
    case 'Inactive': return 'text-black bg-gray-50'
    case 'Suspended': return 'text-red-600 bg-red-50'
    default: return 'text-black bg-gray-50'
  }
}

const getOperationalStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'text-green-600 bg-green-50'
    case 'Low Stock': return 'text-yellow-600 bg-yellow-50'
    case 'Temporary Closure': return 'text-orange-600 bg-orange-50'
    case 'Closed': return 'text-red-600 bg-red-50'
    default: return 'text-black bg-gray-50'
  }
}

const getStockLevel = (current: number, capacity: number) => {
  const percentage = (current / capacity) * 100
  if (percentage >= 70) return { color: 'text-green-600', level: 'Good' }
  if (percentage >= 30) return { color: 'text-yellow-600', level: 'Medium' }
  return { color: 'text-red-600', level: 'Low' }
}

export default function FillingStationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterState, setFilterState] = useState('All')
  const [filterOperationalStatus, setFilterOperationalStatus] = useState('All')
  const [showNewStationModal, setShowNewStationModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStation, setSelectedStation] = useState<any>(null)

  const filteredStations = fillingStations.filter(station => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.stationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || station.status === filterStatus
    const matchesState = filterState === 'All' || station.state === filterState
    const matchesOperationalStatus = filterOperationalStatus === 'All' || station.operationalStatus === filterOperationalStatus

    return matchesSearch && matchesStatus && matchesState && matchesOperationalStatus
  })

  const stats = {
    total: fillingStations.length,
    active: fillingStations.filter(s => s.status === 'Active').length,
    maintenance: fillingStations.filter(s => s.status === 'Under Maintenance').length,
    lowStock: fillingStations.filter(s => s.operationalStatus === 'Low Stock').length,
    totalRevenue: fillingStations.reduce((sum, s) => sum + s.dailySales.total.revenue, 0),
    totalVolume: fillingStations.reduce((sum, s) => sum + s.dailySales.total.volume, 0),
    totalPumps: fillingStations.reduce((sum, s) => sum + s.totalPumps, 0),
    activePumps: fillingStations.reduce((sum, s) => sum + s.activePumps, 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Filling Stations</h1>
            <p className="text-black mt-1">Monitor and manage filling station operations across all locations</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowNewStationModal(true)}
              className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#7a1230] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Station
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Total Stations</p>
                <p className="text-lg font-bold text-black">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Active</p>
                <p className="text-lg font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Maintenance</p>
                <p className="text-lg font-bold text-orange-600">{stats.maintenance}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Low Stock</p>
                <p className="text-lg font-bold text-red-600">{stats.lowStock}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Daily Revenue</p>
                <p className="text-lg font-bold text-[#8B1538]">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-8 h-8 bg-[#8B1538]/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#8B1538]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Daily Volume</p>
                <p className="text-lg font-bold text-[#E67E22]">{(stats.totalVolume / 1000).toFixed(1)}K L</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Fuel className="w-4 h-4 text-[#E67E22]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Total Pumps</p>
                <p className="text-lg font-bold text-purple-600">{stats.totalPumps}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Active Pumps</p>
                <p className="text-lg font-bold text-green-600">{stats.activePumps}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by station name, code, location, manager, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>

              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All States</option>
                <option value="FCT">FCT</option>
                <option value="Lagos">Lagos</option>
                <option value="Kano">Kano</option>
                <option value="Rivers">Rivers</option>
                <option value="Kaduna">Kaduna</option>
              </select>

              <select
                value={filterOperationalStatus}
                onChange={(e) => setFilterOperationalStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Operations</option>
                <option value="Open">Open</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Temporary Closure">Temporary Closure</option>
                <option value="Closed">Closed</option>
              </select>

              <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 whitespace-nowrap">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filling Stations Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Location & Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Pumps & Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Stock Levels</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Daily Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Next Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map((station) => {
                  const totalCapacity = station.products.reduce((sum, p) => sum + p.capacity, 0)
                  const totalCurrent = station.products.reduce((sum, p) => sum + p.currentLevel, 0)
                  const overallStock = getStockLevel(totalCurrent, totalCapacity)

                  return (
                    <tr key={station.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">{station.name}</div>
                          <div className="text-sm text-black">{station.stationCode}</div>
                          <div className="text-xs text-black">Est. {station.established}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-black" />
                            {station.city}, {station.state}
                          </div>
                          <div className="text-sm text-black flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {station.manager}
                          </div>
                          <div className="text-xs text-black">{station.staff} staff</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                            {station.status}
                          </span>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationalStatusColor(station.operationalStatus)}`}>
                              {station.operationalStatus}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">
                            {station.activePumps}/{station.totalPumps} pumps
                          </div>
                          <div className="text-xs text-black">
                            {(totalCapacity / 1000).toFixed(0)}K L capacity
                          </div>
                          <div className="text-xs text-black">
                            {station.products.length} products
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${overallStock.color}`}>
                            {((totalCurrent / totalCapacity) * 100).toFixed(0)}% ({overallStock.level})
                          </div>
                          <div className="text-xs text-black">
                            {(totalCurrent / 1000).toFixed(0)}K / {(totalCapacity / 1000).toFixed(0)}K L
                          </div>
                          <div className="flex gap-1 mt-1">
                            {station.products.map((product, idx) => {
                              const stock = getStockLevel(product.currentLevel, product.capacity)
                              return (
                                <div key={idx} className={`w-2 h-2 rounded-full ${stock.color.includes('green') ? 'bg-green-500' : stock.color.includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              )
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">₦{(station.dailySales.total.revenue / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-black">{(station.dailySales.total.volume / 1000).toFixed(1)}K L sold</div>
                          <div className="text-xs text-black flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Today
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-black">{station.nextDelivery}</div>
                          <div className="text-xs text-black flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expected
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStation(station)
                              setShowDetailModal(true)
                            }}
                            className="text-[#8B1538] hover:text-[#7a1230]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-black hover:text-black">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-black">
          Showing {filteredStations.length} of {fillingStations.length} filling stations
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-black">Filling Station Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Station Code</label>
                  <p className="text-sm text-black">{selectedStation.stationCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStation.status)}`}>
                    {selectedStation.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Operational Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationalStatusColor(selectedStation.operationalStatus)}`}>
                    {selectedStation.operationalStatus}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Established</label>
                  <p className="text-sm text-black">{selectedStation.established}</p>
                </div>
              </div>

              {/* Station Details */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Station Information</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Station Name</label>
                    <p className="text-sm text-black">{selectedStation.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Location</label>
                    <p className="text-sm text-black">{selectedStation.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">License Number</label>
                    <p className="text-sm text-black">{selectedStation.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">License Expiry</label>
                    <p className="text-sm text-black">{selectedStation.licenseExpiry}</p>
                  </div>
                </div>
              </div>

              {/* Management */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Management Information</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Station Manager</label>
                    <p className="text-sm text-black">{selectedStation.manager}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Manager Phone</label>
                    <div className="flex items-center gap-1 text-sm text-black">
                      <Phone className="w-3 h-3" />
                      {selectedStation.managerPhone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Total Staff</label>
                    <p className="text-sm text-black">{selectedStation.staff} employees</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Opening Hours</label>
                    <p className="text-sm text-black">{selectedStation.openingHours}</p>
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Infrastructure & Equipment</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Total Pumps</label>
                    <p className="text-sm text-black">{selectedStation.totalPumps} pumps</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Active Pumps</label>
                    <p className="text-sm font-bold text-green-600">{selectedStation.activePumps} pumps</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Facilities</label>
                    <div className="flex flex-wrap gap-1">
                      {selectedStation.facilities.map((facility: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products & Stock */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Products & Stock Levels</h4>
                <div className="grid gap-4">
                  {selectedStation.products.map((product: any, index: number) => {
                    const stock = getStockLevel(product.currentLevel, product.capacity)
                    return (
                      <div key={index} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-black flex items-center gap-2">
                            <Fuel className="w-4 h-4 text-orange-600" />
                            {product.type}
                          </h5>
                          <span className={`text-sm font-medium ${stock.color}`}>
                            {((product.currentLevel / product.capacity) * 100).toFixed(0)}% - {stock.level}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-black">Tanks:</span>
                            <span className="font-medium text-black ml-1">{product.tanks}</span>
                          </div>
                          <div>
                            <span className="text-black">Capacity:</span>
                            <span className="font-medium text-black ml-1">{(product.capacity / 1000).toFixed(0)}K L</span>
                          </div>
                          <div>
                            <span className="text-black">Current:</span>
                            <span className="font-medium text-black ml-1">{(product.currentLevel / 1000).toFixed(0)}K L</span>
                          </div>
                          <div>
                            <span className="text-black">Price:</span>
                            <span className="font-medium text-black ml-1">₦{product.price}/L</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${stock.color.includes('green') ? 'bg-green-500' : stock.color.includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${(product.currentLevel / product.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sales Performance */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Sales Performance</h4>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-black mb-2">Daily Sales</h5>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#8B1538]">₦{(selectedStation.dailySales.total.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-black">Total Revenue</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#E67E22]">{(selectedStation.dailySales.total.volume / 1000).toFixed(1)}K L</div>
                      <div className="text-xs text-black">Total Volume</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-blue-600">{(selectedStation.dailySales.pms.volume / 1000).toFixed(1)}K L</div>
                      <div className="text-xs text-black">PMS Volume</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-green-600">{(selectedStation.dailySales.ago.volume / 1000).toFixed(1)}K L</div>
                      <div className="text-xs text-black">AGO Volume</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-black mb-2">Monthly Performance</h5>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#8B1538]">₦{(selectedStation.monthlySales.total.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-black">Monthly Revenue</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#E67E22]">{(selectedStation.monthlySales.total.volume / 1000).toFixed(0)}K L</div>
                      <div className="text-xs text-black">Monthly Volume</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Delivery Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Last Delivery</label>
                    <p className="text-sm text-black">{selectedStation.lastDelivery}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Next Delivery</label>
                    <p className="text-sm font-bold text-[#8B1538]">{selectedStation.nextDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Shifts */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Shift Information</h4>
                <div className="grid gap-2">
                  {selectedStation.shifts.map((shift: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-black">
                      <div className="w-2 h-2 bg-[#8B1538] rounded-full"></div>
                      {shift}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Notes</label>
                <p className="text-sm text-black bg-gray-50 p-3 rounded-lg">{selectedStation.notes}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                View Analytics
              </button>
              <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Sales Report
              </button>
              <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Station
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
