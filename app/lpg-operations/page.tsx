'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit, MapPin, Fuel, TrendingUp, User, Phone, Calendar, AlertTriangle, CheckCircle, Activity, DollarSign, BarChart, FileText, Settings, Truck, Package, ShieldCheck } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

// Mock data for LPG operations
const lpgOperations = [
  {
    id: 'LPG001',
    operationNumber: 'LPG-2024-001',
    type: 'Cylinder Distribution',
    location: 'Abuja Distribution Center',
    state: 'FCT',
    manager: 'Amina Hassan',
    managerPhone: '+234-801-234-5678',
    status: 'Active',
    operationalStatus: 'In Progress',
    priority: 'High',
    startDate: '2024-11-16',
    expectedCompletion: '2024-11-18',
    cylinderDetails: {
      size: '12.5kg',
      quantity: 500,
      distributed: 320,
      remaining: 180,
      defective: 5,
      unitPrice: 8500,
      totalValue: 4250000
    },
    routes: [
      { area: 'Wuse', assigned: 120, delivered: 85, pending: 35 },
      { area: 'Garki', assigned: 100, delivered: 75, pending: 25 },
      { area: 'Maitama', assigned: 150, delivered: 110, pending: 40 },
      { area: 'Asokoro', assigned: 130, delivered: 50, pending: 80 }
    ],
    vehicles: [
      { plateNumber: 'ABC123NG', driver: 'Musa Ibrahim', capacity: 200, loaded: 150, status: 'On Route' },
      { plateNumber: 'XYZ789NG', driver: 'Ahmed Bello', capacity: 180, loaded: 170, status: 'Delivered' }
    ],
    safetyChecks: {
      lastInspection: '2024-11-15',
      nextInspection: '2024-11-22',
      certificateStatus: 'Valid',
      incidents: 0,
      complianceScore: 98
    },
    dailyMetrics: {
      revenue: 2720000,
      volume: 320,
      efficiency: 85,
      customerSatisfaction: 92
    },
    monthlyMetrics: {
      revenue: 67500000,
      volume: 7950,
      efficiency: 87,
      customerSatisfaction: 91
    },
    team: [
      { name: 'Ibrahim Hassan', role: 'Supervisor', phone: '+234-802-111-1111' },
      { name: 'Fatima Usman', role: 'Safety Officer', phone: '+234-803-222-2222' },
      { name: 'Yusuf Aliyu', role: 'Logistics Coordinator', phone: '+234-804-333-3333' }
    ],
    notes: 'Peak season distribution - high demand in residential areas'
  },
  {
    id: 'LPG002',
    operationNumber: 'LPG-2024-002',
    type: 'Refill Plant Operations',
    location: 'Lagos Refill Plant',
    state: 'Lagos',
    manager: 'Chidi Okonkwo',
    managerPhone: '+234-802-345-6789',
    status: 'Active',
    operationalStatus: 'Operational',
    priority: 'Medium',
    startDate: '2024-11-16',
    expectedCompletion: '2024-11-16',
    cylinderDetails: {
      size: '6kg',
      quantity: 800,
      distributed: 650,
      remaining: 150,
      defective: 8,
      unitPrice: 5200,
      totalValue: 4160000
    },
    routes: [
      { area: 'Victoria Island', assigned: 200, delivered: 180, pending: 20 },
      { area: 'Ikoyi', assigned: 150, delivered: 140, pending: 10 },
      { area: 'Lekki', assigned: 300, delivered: 250, pending: 50 },
      { area: 'Surulere', assigned: 150, delivered: 80, pending: 70 }
    ],
    vehicles: [
      { plateNumber: 'DEF456NG', driver: 'Emeka Nwosu', capacity: 300, loaded: 280, status: 'Loading' },
      { plateNumber: 'GHI789NG', driver: 'Kemi Adebayo', capacity: 250, loaded: 250, status: 'On Route' },
      { plateNumber: 'JKL012NG', driver: 'Tunde Ola', capacity: 200, loaded: 120, status: 'Delivered' }
    ],
    safetyChecks: {
      lastInspection: '2024-11-14',
      nextInspection: '2024-11-21',
      certificateStatus: 'Valid',
      incidents: 1,
      complianceScore: 95
    },
    dailyMetrics: {
      revenue: 3380000,
      volume: 650,
      efficiency: 81,
      customerSatisfaction: 89
    },
    monthlyMetrics: {
      revenue: 84500000,
      volume: 16250,
      efficiency: 83,
      customerSatisfaction: 88
    },
    team: [
      { name: 'Adunni Ogundimu', role: 'Plant Supervisor', phone: '+234-805-111-1111' },
      { name: 'Segun Adeniyi', role: 'Quality Control', phone: '+234-806-222-2222' },
      { name: 'Folake Adesina', role: 'Safety Coordinator', phone: '+234-807-333-3333' }
    ],
    notes: 'High-volume refill operations serving retail network'
  },
  {
    id: 'LPG003',
    operationNumber: 'LPG-2024-003',
    type: 'Cylinder Exchange',
    location: 'Kano Exchange Center',
    state: 'Kano',
    manager: 'Hauwa Abdullahi',
    managerPhone: '+234-803-456-7890',
    status: 'Under Maintenance',
    operationalStatus: 'Suspended',
    priority: 'Critical',
    startDate: '2024-11-14',
    expectedCompletion: '2024-11-19',
    cylinderDetails: {
      size: '50kg',
      quantity: 200,
      distributed: 45,
      remaining: 155,
      defective: 12,
      unitPrice: 28000,
      totalValue: 5600000
    },
    routes: [
      { area: 'Sabon Gari', assigned: 80, delivered: 20, pending: 60 },
      { area: 'Fagge', assigned: 60, delivered: 15, pending: 45 },
      { area: 'Nassarawa', assigned: 60, delivered: 10, pending: 50 }
    ],
    vehicles: [
      { plateNumber: 'MNO345NG', driver: 'Sani Garba', capacity: 100, loaded: 0, status: 'Maintenance' }
    ],
    safetyChecks: {
      lastInspection: '2024-11-10',
      nextInspection: '2024-11-20',
      certificateStatus: 'Pending Renewal',
      incidents: 2,
      complianceScore: 75
    },
    dailyMetrics: {
      revenue: 1260000,
      volume: 45,
      efficiency: 23,
      customerSatisfaction: 65
    },
    monthlyMetrics: {
      revenue: 31500000,
      volume: 1125,
      efficiency: 56,
      customerSatisfaction: 72
    },
    team: [
      { name: 'Aliyu Mohammed', role: 'Operations Lead', phone: '+234-808-111-1111' },
      { name: 'Zainab Ibrahim', role: 'Customer Service', phone: '+234-809-222-2222' }
    ],
    notes: 'Equipment maintenance required - safety compliance issues identified'
  },
  {
    id: 'LPG004',
    operationNumber: 'LPG-2024-004',
    type: 'Bulk Supply',
    location: 'Port Harcourt Depot',
    state: 'Rivers',
    manager: 'Emeka Nwosu',
    managerPhone: '+234-804-567-8901',
    status: 'Active',
    operationalStatus: 'High Demand',
    priority: 'High',
    startDate: '2024-11-15',
    expectedCompletion: '2024-11-20',
    cylinderDetails: {
      size: 'Mixed Sizes',
      quantity: 1200,
      distributed: 890,
      remaining: 310,
      defective: 15,
      unitPrice: 12500,
      totalValue: 15000000
    },
    routes: [
      { area: 'Trans Amadi', assigned: 400, delivered: 350, pending: 50 },
      { area: 'D-Line', assigned: 300, delivered: 280, pending: 20 },
      { area: 'Mile 3', assigned: 500, delivered: 260, pending: 240 }
    ],
    vehicles: [
      { plateNumber: 'PQR678NG', driver: 'Victor Okoro', capacity: 400, loaded: 380, status: 'On Route' },
      { plateNumber: 'STU901NG', driver: 'Grace Eze', capacity: 350, loaded: 350, status: 'Delivered' },
      { plateNumber: 'VWX234NG', driver: 'Peter Udo', capacity: 300, loaded: 160, status: 'Loading' }
    ],
    safetyChecks: {
      lastInspection: '2024-11-13',
      nextInspection: '2024-11-20',
      certificateStatus: 'Valid',
      incidents: 0,
      complianceScore: 97
    },
    dailyMetrics: {
      revenue: 11125000,
      volume: 890,
      efficiency: 74,
      customerSatisfaction: 94
    },
    monthlyMetrics: {
      revenue: 278125000,
      volume: 22250,
      efficiency: 76,
      customerSatisfaction: 93
    },
    team: [
      { name: 'Chioma Okwu', role: 'Depot Manager', phone: '+234-810-111-1111' },
      { name: 'Kingsley Nweke', role: 'Fleet Coordinator', phone: '+234-811-222-2222' },
      { name: 'Blessing Onu', role: 'Safety Inspector', phone: '+234-812-333-3333' }
    ],
    notes: 'Industrial and commercial bulk supply operations - high volume orders'
  },
  {
    id: 'LPG005',
    operationNumber: 'LPG-2024-005',
    type: 'Cylinder Maintenance',
    location: 'Kaduna Service Center',
    state: 'Kaduna',
    manager: 'Yakubu Ibrahim',
    managerPhone: '+234-805-678-9012',
    status: 'Active',
    operationalStatus: 'Scheduled',
    priority: 'Medium',
    startDate: '2024-11-16',
    expectedCompletion: '2024-11-18',
    cylinderDetails: {
      size: 'All Sizes',
      quantity: 350,
      distributed: 0,
      remaining: 350,
      defective: 45,
      unitPrice: 0,
      totalValue: 0
    },
    routes: [
      { area: 'Service Bay 1', assigned: 150, delivered: 80, pending: 70 },
      { area: 'Service Bay 2', assigned: 100, delivered: 60, pending: 40 },
      { area: 'Testing Area', assigned: 100, delivered: 40, pending: 60 }
    ],
    vehicles: [
      { plateNumber: 'YZA567NG', driver: 'Technician Team', capacity: 100, loaded: 50, status: 'Maintenance' }
    ],
    safetyChecks: {
      lastInspection: '2024-11-15',
      nextInspection: '2024-11-29',
      certificateStatus: 'Valid',
      incidents: 0,
      complianceScore: 99
    },
    dailyMetrics: {
      revenue: 0,
      volume: 180,
      efficiency: 51,
      customerSatisfaction: 0
    },
    monthlyMetrics: {
      revenue: 0,
      volume: 4500,
      efficiency: 64,
      customerSatisfaction: 0
    },
    team: [
      { name: 'Garba Shehu', role: 'Lead Technician', phone: '+234-813-111-1111' },
      { name: 'Amina Yusuf', role: 'Quality Inspector', phone: '+234-814-222-2222' },
      { name: 'Sadiq Umar', role: 'Safety Technician', phone: '+234-815-333-3333' }
    ],
    notes: 'Routine cylinder maintenance and safety testing - compliance certification'
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
    case 'Operational': return 'text-green-600 bg-green-50'
    case 'In Progress': return 'text-blue-600 bg-blue-50'
    case 'High Demand': return 'text-purple-600 bg-purple-50'
    case 'Scheduled': return 'text-yellow-600 bg-yellow-50'
    case 'Suspended': return 'text-red-600 bg-red-50'
    default: return 'text-black bg-gray-50'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'text-red-700 bg-red-100'
    case 'High': return 'text-red-600 bg-red-50'
    case 'Medium': return 'text-yellow-600 bg-yellow-50'
    case 'Low': return 'text-green-600 bg-green-50'
    default: return 'text-black bg-gray-50'
  }
}

const getVehicleStatusColor = (status: string) => {
  switch (status) {
    case 'On Route': return 'text-blue-600 bg-blue-50'
    case 'Delivered': return 'text-green-600 bg-green-50'
    case 'Loading': return 'text-yellow-600 bg-yellow-50'
    case 'Maintenance': return 'text-red-600 bg-red-50'
    default: return 'text-black bg-gray-50'
  }
}

export default function LPGOperationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterState, setFilterState] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [showNewOperationModal, setShowNewOperationModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<any>(null)

  const filteredOperations = lpgOperations.filter(operation => {
    const matchesSearch =
      operation.operationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.manager.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || operation.status === filterStatus
    const matchesType = filterType === 'All' || operation.type === filterType
    const matchesState = filterState === 'All' || operation.state === filterState
    const matchesPriority = filterPriority === 'All' || operation.priority === filterPriority

    return matchesSearch && matchesStatus && matchesType && matchesState && matchesPriority
  })

  const stats = {
    total: lpgOperations.length,
    active: lpgOperations.filter(op => op.status === 'Active').length,
    maintenance: lpgOperations.filter(op => op.status === 'Under Maintenance').length,
    critical: lpgOperations.filter(op => op.priority === 'Critical').length,
    totalRevenue: lpgOperations.reduce((sum, op) => sum + op.dailyMetrics.revenue, 0),
    totalVolume: lpgOperations.reduce((sum, op) => sum + op.dailyMetrics.volume, 0),
    avgEfficiency: lpgOperations.reduce((sum, op) => sum + op.dailyMetrics.efficiency, 0) / lpgOperations.length,
    avgSatisfaction: lpgOperations.reduce((sum, op) => sum + op.dailyMetrics.customerSatisfaction, 0) / lpgOperations.length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">LPG Operations</h1>
            <p className="text-black mt-1">Manage LPG cylinder distribution, refill operations, and safety compliance</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowNewOperationModal(true)}
              className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#7a1230] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Operation
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Total Operations</p>
                <p className="text-lg font-bold text-black">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
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
                <p className="text-xs text-black">Critical</p>
                <p className="text-lg font-bold text-red-600">{stats.critical}</p>
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
                <p className="text-lg font-bold text-[#E67E22]">{stats.totalVolume}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Fuel className="w-4 h-4 text-[#E67E22]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Avg Efficiency</p>
                <p className="text-lg font-bold text-purple-600">{stats.avgEfficiency.toFixed(0)}%</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black">Satisfaction</p>
                <p className="text-lg font-bold text-green-600">{stats.avgSatisfaction.toFixed(0)}%</p>
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
                  placeholder="Search by operation number, type, location, or manager..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Cylinder Distribution">Distribution</option>
                <option value="Refill Plant Operations">Refill Plant</option>
                <option value="Cylinder Exchange">Exchange</option>
                <option value="Bulk Supply">Bulk Supply</option>
                <option value="Cylinder Maintenance">Maintenance</option>
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
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 whitespace-nowrap">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* LPG Operations Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Operation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Location & Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status & Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Cylinders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Daily Metrics</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Safety Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOperations.map((operation) => {
                  const progressPercentage = operation.cylinderDetails.quantity > 0
                    ? (operation.cylinderDetails.distributed / operation.cylinderDetails.quantity) * 100
                    : 0

                  return (
                    <tr key={operation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">{operation.operationNumber}</div>
                          <div className="text-sm text-black">{operation.type}</div>
                          <div className="text-xs text-black">{operation.startDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-black" />
                            {operation.location}
                          </div>
                          <div className="text-sm text-black flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {operation.manager}
                          </div>
                          <div className="text-xs text-black">{operation.state}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                            {operation.status}
                          </span>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationalStatusColor(operation.operationalStatus)}`}>
                              {operation.operationalStatus}
                            </span>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(operation.priority)}`}>
                              {operation.priority}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black flex items-center gap-2">
                            <Package className="w-4 h-4 text-black" />
                            {operation.cylinderDetails.size}
                          </div>
                          <div className="text-sm text-black">
                            {operation.cylinderDetails.quantity} total
                          </div>
                          <div className="text-xs text-black">
                            ₦{operation.cylinderDetails.unitPrice.toLocaleString()}/unit
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">
                            {operation.cylinderDetails.distributed} / {operation.cylinderDetails.quantity}
                          </div>
                          <div className="text-xs text-black">{progressPercentage.toFixed(0)}% complete</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">₦{(operation.dailyMetrics.revenue / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-black">{operation.dailyMetrics.volume} cylinders</div>
                          <div className="text-xs text-black">
                            {operation.dailyMetrics.efficiency}% efficiency
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`w-4 h-4 ${operation.safetyChecks.complianceScore >= 95 ? 'text-green-600' : operation.safetyChecks.complianceScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`} />
                            <span className={`text-sm font-medium ${operation.safetyChecks.complianceScore >= 95 ? 'text-green-600' : operation.safetyChecks.complianceScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {operation.safetyChecks.complianceScore}%
                            </span>
                          </div>
                          <div className="text-xs text-black">
                            {operation.safetyChecks.incidents} incidents
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOperation(operation)
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
          Showing {filteredOperations.length} of {lpgOperations.length} LPG operations
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-black">LPG Operation Details</h3>
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
                  <label className="block text-sm font-medium text-black mb-1">Operation Number</label>
                  <p className="text-sm text-black">{selectedOperation.operationNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Type</label>
                  <p className="text-sm text-black">{selectedOperation.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOperation.status)}`}>
                    {selectedOperation.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedOperation.priority)}`}>
                    {selectedOperation.priority}
                  </span>
                </div>
              </div>

              {/* Location & Management */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Location & Management</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Location</label>
                    <p className="text-sm text-black">{selectedOperation.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">State</label>
                    <p className="text-sm text-black">{selectedOperation.state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Manager</label>
                    <p className="text-sm text-black">{selectedOperation.manager}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Manager Phone</label>
                    <div className="flex items-center gap-1 text-sm text-black">
                      <Phone className="w-3 h-3" />
                      {selectedOperation.managerPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Schedule Information</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Start Date</label>
                    <p className="text-sm text-black">{selectedOperation.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Expected Completion</label>
                    <p className="text-sm text-black">{selectedOperation.expectedCompletion}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Operational Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationalStatusColor(selectedOperation.operationalStatus)}`}>
                      {selectedOperation.operationalStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cylinder Details */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Cylinder Information</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Cylinder Size</label>
                    <p className="text-sm font-bold text-black">{selectedOperation.cylinderDetails.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Total Quantity</label>
                    <p className="text-sm text-black">{selectedOperation.cylinderDetails.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Distributed</label>
                    <p className="text-sm font-bold text-green-600">{selectedOperation.cylinderDetails.distributed}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Remaining</label>
                    <p className="text-sm text-yellow-600">{selectedOperation.cylinderDetails.remaining}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Defective</label>
                    <p className="text-sm text-red-600">{selectedOperation.cylinderDetails.defective}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Unit Price</label>
                    <p className="text-sm text-black">₦{selectedOperation.cylinderDetails.unitPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Total Value</label>
                    <p className="text-sm font-bold text-[#8B1538]">₦{selectedOperation.cylinderDetails.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Routes Distribution */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Route Distribution</h4>
                <div className="grid gap-4">
                  {selectedOperation.routes.map((route: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-black flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          {route.area}
                        </h5>
                        <span className="text-sm font-medium text-black">
                          {((route.delivered / route.assigned) * 100).toFixed(0)}% complete
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-black">Assigned:</span>
                          <span className="font-medium text-black ml-1">{route.assigned}</span>
                        </div>
                        <div>
                          <span className="text-black">Delivered:</span>
                          <span className="font-medium text-green-600 ml-1">{route.delivered}</span>
                        </div>
                        <div>
                          <span className="text-black">Pending:</span>
                          <span className="font-medium text-yellow-600 ml-1">{route.pending}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(route.delivered / route.assigned) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Fleet */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Vehicle Fleet</h4>
                <div className="grid gap-4">
                  {selectedOperation.vehicles.map((vehicle: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-black flex items-center gap-2">
                          <Truck className="w-4 h-4 text-yellow-600" />
                          {vehicle.plateNumber}
                        </h5>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-black">Driver:</span>
                          <span className="font-medium text-black ml-1">{vehicle.driver}</span>
                        </div>
                        <div>
                          <span className="text-black">Capacity:</span>
                          <span className="font-medium text-black ml-1">{vehicle.capacity}</span>
                        </div>
                        <div>
                          <span className="text-black">Loaded:</span>
                          <span className="font-medium text-blue-600 ml-1">{vehicle.loaded}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Information */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Safety & Compliance</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Last Inspection</label>
                    <p className="text-sm text-black">{selectedOperation.safetyChecks.lastInspection}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Next Inspection</label>
                    <p className="text-sm text-black">{selectedOperation.safetyChecks.nextInspection}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Certificate Status</label>
                    <p className={`text-sm font-medium ${selectedOperation.safetyChecks.certificateStatus === 'Valid' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedOperation.safetyChecks.certificateStatus}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Compliance Score</label>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${selectedOperation.safetyChecks.complianceScore >= 95 ? 'text-green-600' : selectedOperation.safetyChecks.complianceScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`} />
                      <span className={`text-lg font-bold ${selectedOperation.safetyChecks.complianceScore >= 95 ? 'text-green-600' : selectedOperation.safetyChecks.complianceScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {selectedOperation.safetyChecks.complianceScore}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Safety Incidents</label>
                    <p className={`text-lg font-bold ${selectedOperation.safetyChecks.incidents === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedOperation.safetyChecks.incidents}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Performance Metrics</h4>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-black mb-2">Daily Performance</h5>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#8B1538]">₦{(selectedOperation.dailyMetrics.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-black">Revenue</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#E67E22]">{selectedOperation.dailyMetrics.volume}</div>
                      <div className="text-xs text-black">Volume</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-blue-600">{selectedOperation.dailyMetrics.efficiency}%</div>
                      <div className="text-xs text-black">Efficiency</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-green-600">{selectedOperation.dailyMetrics.customerSatisfaction}%</div>
                      <div className="text-xs text-black">Satisfaction</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-black mb-2">Monthly Performance</h5>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#8B1538]">₦{(selectedOperation.monthlyMetrics.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-black">Revenue</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-[#E67E22]">{(selectedOperation.monthlyMetrics.volume / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-black">Volume</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-blue-600">{selectedOperation.monthlyMetrics.efficiency}%</div>
                      <div className="text-xs text-black">Efficiency</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-lg font-bold text-green-600">{selectedOperation.monthlyMetrics.customerSatisfaction}%</div>
                      <div className="text-xs text-black">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-black mb-3">Team Members</h4>
                <div className="grid gap-3">
                  {selectedOperation.team.map((member: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-lg border flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-black">{member.name}</h5>
                        <p className="text-sm text-black">{member.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-black">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Operation Notes</label>
                <p className="text-sm text-black bg-gray-50 p-3 rounded-lg">{selectedOperation.notes}</p>
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
                <ShieldCheck className="w-4 h-4" />
                Safety Report
              </button>
              <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Operation
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}