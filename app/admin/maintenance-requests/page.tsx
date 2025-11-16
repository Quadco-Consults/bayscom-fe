'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit, CheckCircle, Clock, AlertTriangle, Wrench, Calendar, MapPin, User, Phone, Mail } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

// Mock data for maintenance requests
const maintenanceRequests = [
  {
    id: 'MR001',
    title: 'Generator 1 Service',
    type: 'Preventive',
    priority: 'High',
    status: 'Pending',
    requestedBy: 'John Adamu',
    department: 'Operations',
    equipment: 'Caterpillar Generator 1',
    location: 'Main Plant',
    description: 'Routine maintenance service for main generator',
    requestDate: '2024-11-15',
    scheduledDate: '2024-11-20',
    estimatedCost: '₦150,000',
    assignedTechnician: 'Ibrahim Hassan',
    phone: '+234-801-234-5678',
    email: 'ibrahim.hassan@bayscom.ng'
  },
  {
    id: 'MR002',
    title: 'Air Conditioning Repair',
    type: 'Corrective',
    priority: 'Medium',
    status: 'In Progress',
    requestedBy: 'Sarah Musa',
    department: 'Admin',
    equipment: 'Central AC Unit 2',
    location: 'Head Office - Floor 2',
    description: 'AC unit not cooling properly, possible refrigerant leak',
    requestDate: '2024-11-14',
    scheduledDate: '2024-11-16',
    estimatedCost: '₦75,000',
    assignedTechnician: 'Ahmed Bello',
    phone: '+234-802-345-6789',
    email: 'ahmed.bello@bayscom.ng'
  },
  {
    id: 'MR003',
    title: 'Fire Safety System Check',
    type: 'Preventive',
    priority: 'High',
    status: 'Scheduled',
    requestedBy: 'Mike Johnson',
    department: 'Safety',
    equipment: 'Fire Alarm System',
    location: 'All Locations',
    description: 'Monthly fire safety equipment inspection and testing',
    requestDate: '2024-11-13',
    scheduledDate: '2024-11-25',
    estimatedCost: '₦50,000',
    assignedTechnician: 'Fatima Usman',
    phone: '+234-803-456-7890',
    email: 'fatima.usman@bayscom.ng'
  },
  {
    id: 'MR004',
    title: 'Vehicle Fleet Servicing',
    type: 'Preventive',
    priority: 'Medium',
    status: 'Completed',
    requestedBy: 'David Okafor',
    department: 'Fleet',
    equipment: 'Toyota Hilux - ABC123',
    location: 'Workshop',
    description: 'Routine vehicle maintenance and oil change',
    requestDate: '2024-11-10',
    scheduledDate: '2024-11-12',
    estimatedCost: '₦25,000',
    assignedTechnician: 'Musa Abdullahi',
    phone: '+234-804-567-8901',
    email: 'musa.abdullahi@bayscom.ng'
  },
  {
    id: 'MR005',
    title: 'IT Server Maintenance',
    type: 'Preventive',
    priority: 'High',
    status: 'Overdue',
    requestedBy: 'Tech Support',
    department: 'IT',
    equipment: 'Dell Server Rack',
    location: 'Server Room',
    description: 'Server hardware cleaning and software updates',
    requestDate: '2024-11-08',
    scheduledDate: '2024-11-15',
    estimatedCost: '₦100,000',
    assignedTechnician: 'Aisha Yakubu',
    phone: '+234-805-678-9012',
    email: 'aisha.yakubu@bayscom.ng'
  },
  {
    id: 'MR006',
    title: 'Pump Station Repair',
    type: 'Emergency',
    priority: 'Critical',
    status: 'Urgent',
    requestedBy: 'Operations Team',
    department: 'Operations',
    equipment: 'Water Pump Station 3',
    location: 'Kano Facility',
    description: 'Pump failure affecting water supply to facility',
    requestDate: '2024-11-16',
    scheduledDate: '2024-11-16',
    estimatedCost: '₦200,000',
    assignedTechnician: 'Yusuf Ibrahim',
    phone: '+234-806-789-0123',
    email: 'yusuf.ibrahim@bayscom.ng'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'text-yellow-600 bg-yellow-50'
    case 'Scheduled': return 'text-blue-600 bg-blue-50'
    case 'In Progress': return 'text-purple-600 bg-purple-50'
    case 'Completed': return 'text-green-600 bg-green-50'
    case 'Overdue': return 'text-red-600 bg-red-50'
    case 'Urgent': return 'text-red-700 bg-red-100'
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Preventive': return <Calendar className="w-4 h-4 text-blue-600" />
    case 'Corrective': return <Wrench className="w-4 h-4 text-orange-600" />
    case 'Emergency': return <AlertTriangle className="w-4 h-4 text-red-600" />
    default: return <Clock className="w-4 h-4 text-gray-600" />
  }
}

export default function MaintenanceRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || request.status === filterStatus
    const matchesPriority = filterPriority === 'All' || request.priority === filterPriority
    const matchesType = filterType === 'All' || request.type === filterType

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const stats = {
    total: maintenanceRequests.length,
    pending: maintenanceRequests.filter(r => r.status === 'Pending').length,
    inProgress: maintenanceRequests.filter(r => r.status === 'In Progress').length,
    overdue: maintenanceRequests.filter(r => r.status === 'Overdue' || r.status === 'Urgent').length,
    completed: maintenanceRequests.filter(r => r.status === 'Completed').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600 mt-1">Manage equipment and facility maintenance scheduling</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                  placeholder="Search by title, equipment, requester, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
                <option value="Urgent">Urgent</option>
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

              <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.id}</div>
                        <div className="text-sm text-gray-600">{request.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {request.requestedBy} ({request.department})
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="text-sm text-gray-900">{request.type}</span>
                      </div>
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
                        <div className="text-sm font-medium text-gray-900">{request.equipment}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.scheduledDate}</div>
                      <div className="text-xs text-gray-500">
                        Est. {request.estimatedCost}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.assignedTechnician}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.phone}
                        </div>
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
          Showing {filteredRequests.length} of {maintenanceRequests.length} maintenance requests
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Maintenance Request Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                  <p className="text-sm text-gray-900">{selectedRequest.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-sm text-gray-900">{selectedRequest.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedRequest.type)}
                    <span className="text-sm text-gray-900">{selectedRequest.type}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                  <p className="text-sm text-gray-900">{selectedRequest.equipment}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-sm text-gray-900">{selectedRequest.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested By</label>
                  <p className="text-sm text-gray-900">{selectedRequest.requestedBy}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                  <p className="text-sm text-gray-900">{selectedRequest.requestDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <p className="text-sm text-gray-900">{selectedRequest.scheduledDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <p className="text-sm text-gray-900">{selectedRequest.estimatedCost}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.assignedTechnician}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedRequest.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedRequest.email}
                    </div>
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