'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit, CheckCircle, Clock, AlertTriangle, Fuel, Car, Calendar, MapPin, User, CreditCard, BarChart } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

// Mock data for fuel requests
const fuelRequests = [
  {
    id: 'FR001',
    requestNumber: 'FUEL-2024-001',
    requestedBy: 'John Adamu',
    department: 'Operations',
    vehicle: 'Toyota Hilux - ABC123',
    plateNumber: 'ABC123NG',
    driverName: 'Musa Ibrahim',
    fuelType: 'Diesel',
    requestedQuantity: '50',
    approvedQuantity: '50',
    unitPrice: '₦950',
    totalCost: '₦47,500',
    purpose: 'Field operations - site inspection',
    destination: 'Kano Industrial Area',
    estimatedDistance: '150 km',
    currentMileage: '45,230 km',
    requestDate: '2024-11-15',
    requiredDate: '2024-11-16',
    status: 'Pending Approval',
    priority: 'Medium',
    approvedBy: '',
    fillingStation: '',
    remarks: 'Routine field inspection trip'
  },
  {
    id: 'FR002',
    requestNumber: 'FUEL-2024-002',
    requestedBy: 'Sarah Musa',
    department: 'Sales',
    vehicle: 'Honda Accord - XYZ789',
    plateNumber: 'XYZ789NG',
    driverName: 'Ahmed Bello',
    fuelType: 'Petrol',
    requestedQuantity: '40',
    approvedQuantity: '40',
    unitPrice: '₦850',
    totalCost: '₦34,000',
    purpose: 'Client meeting and business development',
    destination: 'Lagos State',
    estimatedDistance: '850 km',
    currentMileage: '32,150 km',
    requestDate: '2024-11-14',
    requiredDate: '2024-11-15',
    status: 'Approved',
    priority: 'High',
    approvedBy: 'David Okafor',
    fillingStation: 'Total Station - Wuse',
    remarks: 'Important client presentation meeting'
  },
  {
    id: 'FR003',
    requestNumber: 'FUEL-2024-003',
    requestedBy: 'Mike Johnson',
    department: 'Logistics',
    vehicle: 'Mercedes Truck - DEF456',
    plateNumber: 'DEF456NG',
    driverName: 'Ibrahim Hassan',
    fuelType: 'Diesel',
    requestedQuantity: '200',
    approvedQuantity: '180',
    unitPrice: '₦950',
    totalCost: '₦171,000',
    purpose: 'Product delivery to retail outlets',
    destination: 'Multiple locations in Kaduna',
    estimatedDistance: '300 km',
    currentMileage: '78,900 km',
    requestDate: '2024-11-13',
    requiredDate: '2024-11-14',
    status: 'Dispensed',
    priority: 'High',
    approvedBy: 'Operations Manager',
    fillingStation: 'Bayscom Station - Kaduna',
    remarks: 'Weekly product distribution run'
  },
  {
    id: 'FR004',
    requestNumber: 'FUEL-2024-004',
    requestedBy: 'Fatima Usman',
    department: 'Admin',
    vehicle: 'Toyota Camry - GHI012',
    plateNumber: 'GHI012NG',
    driverName: 'Yusuf Ibrahim',
    fuelType: 'Petrol',
    requestedQuantity: '30',
    approvedQuantity: '25',
    unitPrice: '₦850',
    totalCost: '₦21,250',
    purpose: 'Bank transactions and official errands',
    destination: 'Abuja City Center',
    estimatedDistance: '80 km',
    currentMileage: '25,400 km',
    requestDate: '2024-11-12',
    requiredDate: '2024-11-13',
    status: 'Completed',
    priority: 'Low',
    approvedBy: 'Admin Manager',
    fillingStation: 'NNPC Station - Central Area',
    remarks: 'Routine administrative tasks'
  },
  {
    id: 'FR005',
    requestNumber: 'FUEL-2024-005',
    requestedBy: 'Operations Team',
    department: 'Operations',
    vehicle: 'Ford Transit - JKL345',
    plateNumber: 'JKL345NG',
    driverName: 'Aisha Yakubu',
    fuelType: 'Diesel',
    requestedQuantity: '80',
    approvedQuantity: '0',
    unitPrice: '₦950',
    totalCost: '₦0',
    purpose: 'Emergency response and maintenance',
    destination: 'Port Harcourt Facility',
    estimatedDistance: '600 km',
    currentMileage: '56,780 km',
    requestDate: '2024-11-16',
    requiredDate: '2024-11-16',
    status: 'Rejected',
    priority: 'Critical',
    approvedBy: '',
    fillingStation: '',
    remarks: 'Insufficient budget allocation for emergency travel'
  },
  {
    id: 'FR006',
    requestNumber: 'FUEL-2024-006',
    requestedBy: 'Security Team',
    department: 'Security',
    vehicle: 'Toyota Hilux - MNO678',
    plateNumber: 'MNO678NG',
    driverName: 'Security Officer',
    fuelType: 'Diesel',
    requestedQuantity: '60',
    approvedQuantity: '60',
    unitPrice: '₦950',
    totalCost: '₦57,000',
    purpose: 'Security patrol and facility monitoring',
    destination: 'Multiple facility locations',
    estimatedDistance: '200 km',
    currentMileage: '42,100 km',
    requestDate: '2024-11-15',
    requiredDate: '2024-11-17',
    status: 'In Transit',
    priority: 'Medium',
    approvedBy: 'Security Manager',
    fillingStation: 'Mobil Station - Garki',
    remarks: 'Weekly security patrol schedule'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending Approval': return 'text-yellow-600 bg-yellow-50'
    case 'Approved': return 'text-blue-600 bg-blue-50'
    case 'In Transit': return 'text-purple-600 bg-purple-50'
    case 'Dispensed': return 'text-orange-600 bg-orange-50'
    case 'Completed': return 'text-green-600 bg-green-50'
    case 'Rejected': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'text-red-700 bg-red-100'
    case 'High': return 'text-red-600 bg-red-50'
    case 'Medium': return 'text-yellow-600 bg-yellow-50'
    case 'Low': return 'text-green-600 bg-green-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getFuelTypeIcon = (fuelType: string) => {
  switch (fuelType) {
    case 'Diesel': return <Fuel className="w-4 h-4 text-blue-600" />
    case 'Petrol': return <Fuel className="w-4 h-4 text-green-600" />
    case 'LPG': return <Fuel className="w-4 h-4 text-orange-600" />
    default: return <Fuel className="w-4 h-4 text-gray-600" />
  }
}

export default function FuelRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterFuelType, setFilterFuelType] = useState('All')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const filteredRequests = fuelRequests.filter(request => {
    const matchesSearch =
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || request.status === filterStatus
    const matchesPriority = filterPriority === 'All' || request.priority === filterPriority
    const matchesFuelType = filterFuelType === 'All' || request.fuelType === filterFuelType
    const matchesDepartment = filterDepartment === 'All' || request.department === filterDepartment

    return matchesSearch && matchesStatus && matchesPriority && matchesFuelType && matchesDepartment
  })

  const stats = {
    total: fuelRequests.length,
    pending: fuelRequests.filter(r => r.status === 'Pending Approval').length,
    approved: fuelRequests.filter(r => r.status === 'Approved' || r.status === 'In Transit' || r.status === 'Dispensed').length,
    completed: fuelRequests.filter(r => r.status === 'Completed').length,
    rejected: fuelRequests.filter(r => r.status === 'Rejected').length,
    totalCost: fuelRequests.reduce((sum, r) => {
      const cost = parseInt(r.totalCost.replace(/[^\d]/g, ''))
      return sum + (r.status !== 'Rejected' ? cost : 0)
    }, 0),
    totalLiters: fuelRequests.reduce((sum, r) => {
      return sum + (r.status !== 'Rejected' ? parseInt(r.approvedQuantity || '0') : 0)
    }, 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fuel Requests</h1>
            <p className="text-gray-600 mt-1">Manage vehicle fuel allocation and distribution system</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#7a1230] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Requests</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Fuel className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Approved</p>
                <p className="text-lg font-bold text-blue-600">{stats.approved}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-lg font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Rejected</p>
                <p className="text-lg font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Cost</p>
                <p className="text-lg font-bold text-[#8B1538]">₦{stats.totalCost.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-[#8B1538]/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#8B1538]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Liters</p>
                <p className="text-lg font-bold text-[#E67E22]">{stats.totalLiters}L</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart className="w-4 h-4 text-[#E67E22]" />
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
                  placeholder="Search by request number, requester, vehicle, plate number..."
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
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="In Transit">In Transit</option>
                <option value="Dispensed">Dispensed</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
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

              <select
                value={filterFuelType}
                onChange={(e) => setFilterFuelType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Fuel Types</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="LPG">LPG</option>
              </select>

              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Logistics">Logistics</option>
                <option value="Admin">Admin</option>
                <option value="Security">Security</option>
              </select>

              <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 whitespace-nowrap">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Fuel Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.requestNumber}</div>
                        <div className="text-sm text-gray-600">{request.requestedBy}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {request.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-600" />
                          {request.vehicle}
                        </div>
                        <div className="text-sm text-gray-600">{request.plateNumber}</div>
                        <div className="text-xs text-gray-500">Driver: {request.driverName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-2">
                          {getFuelTypeIcon(request.fuelType)}
                          <span className="text-sm font-medium text-gray-900">{request.fuelType}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {request.approvedQuantity}L (req: {request.requestedQuantity}L)
                        </div>
                        <div className="text-xs text-gray-500">@ {request.unitPrice}/L</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.totalCost}</div>
                      <div className="text-xs text-gray-500">{request.estimatedDistance}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">Req: {request.requestDate}</div>
                        <div className="text-sm text-gray-600">Need: {request.requiredDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowDetailModal(true)
                          }}
                          className="text-[#8B1538] hover:text-[#7a1230]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Showing {filteredRequests.length} of {fuelRequests.length} fuel requests
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Fuel Request Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Number</label>
                  <p className="text-sm text-gray-900">{selectedRequest.requestNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Request Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested By</label>
                    <p className="text-sm text-gray-900">{selectedRequest.requestedBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-sm text-gray-900">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                    <p className="text-sm text-gray-900">{selectedRequest.requestDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Date</label>
                    <p className="text-sm text-gray-900">{selectedRequest.requiredDate}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Vehicle Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                    <p className="text-sm text-gray-900">{selectedRequest.vehicle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                    <p className="text-sm text-gray-900">{selectedRequest.plateNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                    <p className="text-sm text-gray-900">{selectedRequest.driverName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage</label>
                    <p className="text-sm text-gray-900">{selectedRequest.currentMileage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Fuel Information</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <div className="flex items-center gap-2">
                      {getFuelTypeIcon(selectedRequest.fuelType)}
                      <span className="text-sm text-gray-900">{selectedRequest.fuelType}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested Quantity</label>
                    <p className="text-sm text-gray-900">{selectedRequest.requestedQuantity} Liters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approved Quantity</label>
                    <p className="text-sm text-gray-900">{selectedRequest.approvedQuantity} Liters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                    <p className="text-sm text-gray-900">{selectedRequest.unitPrice}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                  <p className="text-lg font-bold text-[#8B1538]">{selectedRequest.totalCost}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Trip Information</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <p className="text-sm text-gray-900">{selectedRequest.purpose}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <p className="text-sm text-gray-900">{selectedRequest.destination}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Distance</label>
                    <p className="text-sm text-gray-900">{selectedRequest.estimatedDistance}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filling Station</label>
                    <p className="text-sm text-gray-900">{selectedRequest.fillingStation || 'Not assigned'}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.approvedBy && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Approval Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                      <p className="text-sm text-gray-900">{selectedRequest.approvedBy}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.remarks}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedRequest.status === 'Pending Approval' && (
                <>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                </>
              )}
              <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230]">
                Edit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}