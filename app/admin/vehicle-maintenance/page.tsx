'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit, CheckCircle, Clock, AlertTriangle, Car, Wrench, Calendar, MapPin, User, Phone, DollarSign, FileText, Settings } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

// Mock data for vehicle maintenance
const vehicleMaintenances = [
  {
    id: 'VM001',
    maintenanceNumber: 'MAINT-2024-001',
    vehicle: 'Toyota Hilux',
    plateNumber: 'ABC123NG',
    chassisNumber: 'JTFGN80E50N234567',
    engineNumber: 'ENG12345',
    fleetNumber: 'FL-001',
    driver: 'Musa Ibrahim',
    department: 'Operations',
    currentMileage: '45,230 km',
    maintenanceType: 'Preventive',
    category: 'Engine Service',
    status: 'Scheduled',
    priority: 'Medium',
    scheduledDate: '2024-11-20',
    estimatedDuration: '4 hours',
    estimatedCost: '₦75,000',
    actualCost: '',
    serviceProvider: 'Bayscom Auto Workshop',
    technician: 'Ahmed Hassan',
    technicianPhone: '+234-801-234-5678',
    lastServiceDate: '2024-08-15',
    nextServiceDue: '2024-02-15',
    serviceItems: [
      'Engine oil change',
      'Oil filter replacement',
      'Air filter check',
      'Brake fluid top-up'
    ],
    notes: 'Routine 15,000km service maintenance',
    workOrder: 'WO-2024-045',
    approved: true,
    approvedBy: 'Fleet Manager',
    requestedBy: 'John Adamu',
    requestDate: '2024-11-15'
  },
  {
    id: 'VM002',
    maintenanceNumber: 'MAINT-2024-002',
    vehicle: 'Honda Accord',
    plateNumber: 'XYZ789NG',
    chassisNumber: 'JHMCM56557C012345',
    engineNumber: 'ENG67890',
    fleetNumber: 'FL-002',
    driver: 'Sarah Musa',
    department: 'Sales',
    currentMileage: '32,150 km',
    maintenanceType: 'Corrective',
    category: 'Transmission Repair',
    status: 'In Progress',
    priority: 'High',
    scheduledDate: '2024-11-16',
    estimatedDuration: '8 hours',
    estimatedCost: '₦120,000',
    actualCost: '₦115,000',
    serviceProvider: 'Honda Service Center',
    technician: 'Ibrahim Bello',
    technicianPhone: '+234-802-345-6789',
    lastServiceDate: '2024-06-10',
    nextServiceDue: '2024-12-10',
    serviceItems: [
      'Transmission fluid replacement',
      'Transmission filter change',
      'Gear box inspection',
      'Test drive evaluation'
    ],
    notes: 'Transmission slipping issue reported by driver',
    workOrder: 'WO-2024-046',
    approved: true,
    approvedBy: 'Operations Manager',
    requestedBy: 'Sarah Musa',
    requestDate: '2024-11-14'
  },
  {
    id: 'VM003',
    maintenanceNumber: 'MAINT-2024-003',
    vehicle: 'Mercedes Truck',
    plateNumber: 'DEF456NG',
    chassisNumber: 'WDB9352651L123456',
    engineNumber: 'ENG11111',
    fleetNumber: 'FL-003',
    driver: 'Ibrahim Hassan',
    department: 'Logistics',
    currentMileage: '78,900 km',
    maintenanceType: 'Emergency',
    category: 'Brake System',
    status: 'Completed',
    priority: 'Critical',
    scheduledDate: '2024-11-12',
    estimatedDuration: '6 hours',
    estimatedCost: '₦95,000',
    actualCost: '₦98,500',
    serviceProvider: 'Mercedes Service Point',
    technician: 'Yusuf Mohammed',
    technicianPhone: '+234-803-456-7890',
    lastServiceDate: '2024-09-05',
    nextServiceDue: '2025-03-05',
    serviceItems: [
      'Brake pad replacement (all wheels)',
      'Brake disc resurfacing',
      'Brake fluid flush',
      'Brake system pressure test'
    ],
    notes: 'Emergency brake failure - immediate attention required',
    workOrder: 'WO-2024-047',
    approved: true,
    approvedBy: 'Safety Manager',
    requestedBy: 'Safety Team',
    requestDate: '2024-11-11'
  },
  {
    id: 'VM004',
    maintenanceNumber: 'MAINT-2024-004',
    vehicle: 'Toyota Camry',
    plateNumber: 'GHI012NG',
    chassisNumber: 'JTJHY7AX8J4012345',
    engineNumber: 'ENG22222',
    fleetNumber: 'FL-004',
    driver: 'Fatima Usman',
    department: 'Admin',
    currentMileage: '25,400 km',
    maintenanceType: 'Preventive',
    category: 'General Service',
    status: 'Pending Approval',
    priority: 'Low',
    scheduledDate: '2024-11-25',
    estimatedDuration: '3 hours',
    estimatedCost: '₦45,000',
    actualCost: '',
    serviceProvider: 'Toyota Service Center',
    technician: 'Aisha Yakubu',
    technicianPhone: '+234-804-567-8901',
    lastServiceDate: '2024-08-20',
    nextServiceDue: '2024-02-20',
    serviceItems: [
      'Engine oil and filter change',
      'Tire rotation and balancing',
      'Battery check and clean',
      'AC system inspection'
    ],
    notes: '10,000km scheduled maintenance service',
    workOrder: 'WO-2024-048',
    approved: false,
    approvedBy: '',
    requestedBy: 'Fatima Usman',
    requestDate: '2024-11-16'
  },
  {
    id: 'VM005',
    maintenanceNumber: 'MAINT-2024-005',
    vehicle: 'Ford Transit',
    plateNumber: 'JKL345NG',
    chassisNumber: 'WF0XXXTTGXFW123456',
    engineNumber: 'ENG33333',
    fleetNumber: 'FL-005',
    driver: 'Mike Johnson',
    department: 'Operations',
    currentMileage: '56,780 km',
    maintenanceType: 'Corrective',
    category: 'Electrical System',
    status: 'Overdue',
    priority: 'High',
    scheduledDate: '2024-11-10',
    estimatedDuration: '5 hours',
    estimatedCost: '₦85,000',
    actualCost: '',
    serviceProvider: 'Ford Service Center',
    technician: 'Musa Abdullahi',
    technicianPhone: '+234-805-678-9012',
    lastServiceDate: '2024-07-15',
    nextServiceDue: '2025-01-15',
    serviceItems: [
      'Alternator replacement',
      'Battery replacement',
      'Wiring harness inspection',
      'Electrical system diagnostic'
    ],
    notes: 'Vehicle electrical issues - intermittent starting problems',
    workOrder: 'WO-2024-049',
    approved: true,
    approvedBy: 'Fleet Manager',
    requestedBy: 'Mike Johnson',
    requestDate: '2024-11-08'
  },
  {
    id: 'VM006',
    maintenanceNumber: 'MAINT-2024-006',
    vehicle: 'Toyota Hilux',
    plateNumber: 'MNO678NG',
    chassisNumber: 'JTFGN80E60N234568',
    engineNumber: 'ENG44444',
    fleetNumber: 'FL-006',
    driver: 'Security Team',
    department: 'Security',
    currentMileage: '42,100 km',
    maintenanceType: 'Preventive',
    category: 'Suspension System',
    status: 'Parts Pending',
    priority: 'Medium',
    scheduledDate: '2024-11-22',
    estimatedDuration: '6 hours',
    estimatedCost: '₦110,000',
    actualCost: '',
    serviceProvider: 'Bayscom Auto Workshop',
    technician: 'Hassan Aliyu',
    technicianPhone: '+234-806-789-0123',
    lastServiceDate: '2024-05-20',
    nextServiceDue: '2024-11-20',
    serviceItems: [
      'Shock absorber replacement (rear)',
      'Suspension bush replacement',
      'Wheel alignment',
      'Suspension system check'
    ],
    notes: 'Rough ride reported - suspension system inspection required',
    workOrder: 'WO-2024-050',
    approved: true,
    approvedBy: 'Security Manager',
    requestedBy: 'Security Team',
    requestDate: '2024-11-13'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending Approval': return 'text-yellow-600 bg-yellow-50'
    case 'Scheduled': return 'text-blue-600 bg-blue-50'
    case 'In Progress': return 'text-purple-600 bg-purple-50'
    case 'Parts Pending': return 'text-orange-600 bg-orange-50'
    case 'Completed': return 'text-green-600 bg-green-50'
    case 'Overdue': return 'text-red-600 bg-red-50'
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

const getMaintenanceTypeIcon = (type: string) => {
  switch (type) {
    case 'Preventive': return <Calendar className="w-4 h-4 text-blue-600" />
    case 'Corrective': return <Wrench className="w-4 h-4 text-orange-600" />
    case 'Emergency': return <AlertTriangle className="w-4 h-4 text-red-600" />
    default: return <Settings className="w-4 h-4 text-gray-600" />
  }
}

export default function VehicleMaintenancePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [showNewMaintenanceModal, setShowNewMaintenanceModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null)

  const filteredMaintenances = vehicleMaintenances.filter(maintenance => {
    const matchesSearch =
      maintenance.maintenanceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || maintenance.status === filterStatus
    const matchesPriority = filterPriority === 'All' || maintenance.priority === filterPriority
    const matchesType = filterType === 'All' || maintenance.maintenanceType === filterType
    const matchesDepartment = filterDepartment === 'All' || maintenance.department === filterDepartment

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesDepartment
  })

  const stats = {
    total: vehicleMaintenances.length,
    pending: vehicleMaintenances.filter(m => m.status === 'Pending Approval').length,
    scheduled: vehicleMaintenances.filter(m => m.status === 'Scheduled').length,
    inProgress: vehicleMaintenances.filter(m => m.status === 'In Progress').length,
    completed: vehicleMaintenances.filter(m => m.status === 'Completed').length,
    overdue: vehicleMaintenances.filter(m => m.status === 'Overdue').length,
    totalCost: vehicleMaintenances.reduce((sum, m) => {
      const cost = m.actualCost ? parseInt(m.actualCost.replace(/[^\d]/g, '')) : parseInt(m.estimatedCost.replace(/[^\d]/g, ''))
      return sum + cost
    }, 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Maintenance</h1>
            <p className="text-gray-600 mt-1">Manage fleet maintenance scheduling and tracking system</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowNewMaintenanceModal(true)}
              className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#7a1230] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Records</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-blue-600" />
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
                <p className="text-xs text-gray-600">Scheduled</p>
                <p className="text-lg font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-lg font-bold text-purple-600">{stats.inProgress}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Wrench className="w-4 h-4 text-purple-600" />
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
                <p className="text-xs text-gray-600">Overdue</p>
                <p className="text-lg font-bold text-red-600">{stats.overdue}</p>
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
                <DollarSign className="w-4 h-4 text-[#8B1538]" />
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
                  placeholder="Search by maintenance number, vehicle, plate number, driver, category..."
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
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Parts Pending">Parts Pending</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Emergency">Emergency</option>
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

        {/* Vehicle Maintenance Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaintenances.map((maintenance) => (
                  <tr key={maintenance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{maintenance.maintenanceNumber}</div>
                        <div className="text-sm text-gray-600">{maintenance.workOrder}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {maintenance.requestedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-600" />
                          {maintenance.vehicle}
                        </div>
                        <div className="text-sm text-gray-600">{maintenance.plateNumber}</div>
                        <div className="text-xs text-gray-500">{maintenance.fleetNumber} • {maintenance.currentMileage}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getMaintenanceTypeIcon(maintenance.maintenanceType)}
                          <span className="text-sm font-medium text-gray-900">{maintenance.maintenanceType}</span>
                        </div>
                        <div className="text-sm text-gray-600">{maintenance.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
                        {maintenance.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                        {maintenance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{maintenance.scheduledDate}</div>
                        <div className="text-xs text-gray-500">{maintenance.estimatedDuration}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {maintenance.actualCost || maintenance.estimatedCost}
                        </div>
                        {maintenance.actualCost && (
                          <div className="text-xs text-gray-500">Est: {maintenance.estimatedCost}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{maintenance.technician}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {maintenance.technicianPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedMaintenance(maintenance)
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
          Showing {filteredMaintenances.length} of {vehicleMaintenances.length} maintenance records
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Vehicle Maintenance Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Number</label>
                  <p className="text-sm text-gray-900">{selectedMaintenance.maintenanceNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Order</label>
                  <p className="text-sm text-gray-900">{selectedMaintenance.workOrder}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMaintenance.status)}`}>
                    {selectedMaintenance.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedMaintenance.priority)}`}>
                    {selectedMaintenance.priority}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Vehicle Information</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.vehicle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.plateNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Number</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.fleetNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.currentMileage}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.driver}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.department}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.chassisNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.engineNumber}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Maintenance Information</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className="flex items-center gap-2">
                      {getMaintenanceTypeIcon(selectedMaintenance.maintenanceType)}
                      <span className="text-sm text-gray-900">{selectedMaintenance.maintenanceType}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.scheduledDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.estimatedDuration}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Service</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.lastServiceDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Due</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.nextServiceDue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Service Provider & Cost</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.serviceProvider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.estimatedCost}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                    <p className="text-sm font-bold text-[#8B1538]">
                      {selectedMaintenance.actualCost || 'Not finalized'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approved</label>
                    <p className="text-sm text-gray-900">
                      {selectedMaintenance.approved ? 'Yes' : 'No'}
                      {selectedMaintenance.approvedBy && ` (${selectedMaintenance.approvedBy})`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Technician Information</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.technician}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Phone className="w-3 h-3" />
                      {selectedMaintenance.technicianPhone}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Items</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <ul className="space-y-1">
                    {selectedMaintenance.serviceItems.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-900">
                        <div className="w-1.5 h-1.5 bg-[#8B1538] rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedMaintenance.notes}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Request Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested By</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.requestedBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                    <p className="text-sm text-gray-900">{selectedMaintenance.requestDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedMaintenance.status === 'Pending Approval' && (
                <>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                </>
              )}
              <button className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#7a1230] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Service Report
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}