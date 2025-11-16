'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Download, Plus, Eye, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Users, CalendarDays } from 'lucide-react'

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'emergency' | 'study'
  startDate: string
  endDate: string
  duration: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  reason: string
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
  attachments?: string[]
  coveringEmployee?: string
  notes?: string
  isEmergency: boolean
}

interface LeaveBalance {
  employeeId: string
  employeeName: string
  annual: { allocated: number; used: number; remaining: number }
  sick: { allocated: number; used: number; remaining: number }
  personal: { allocated: number; used: number; remaining: number }
  maternity: { allocated: number; used: number; remaining: number }
  paternity: { allocated: number; used: number; remaining: number }
  study: { allocated: number; used: number; remaining: number }
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeId: 'BC-E001',
    employeeName: 'John Manager',
    department: 'Operations',
    position: 'Operations Manager',
    leaveType: 'annual',
    startDate: '2024-12-15',
    endDate: '2024-12-22',
    duration: 8,
    status: 'pending',
    reason: 'Family vacation during Christmas holidays',
    appliedDate: '2024-11-10',
    coveringEmployee: 'Ahmed Technician',
    isEmergency: false
  },
  {
    id: 'LR002',
    employeeId: 'BC-E003',
    employeeName: 'Ahmed Technician',
    department: 'Maintenance',
    position: 'Senior Technician',
    leaveType: 'sick',
    startDate: '2024-11-18',
    endDate: '2024-11-20',
    duration: 3,
    status: 'approved',
    reason: 'Flu and fever - doctor recommended rest',
    appliedDate: '2024-11-17',
    approvedBy: 'Mike Operations',
    approvedDate: '2024-11-17',
    attachments: ['Medical Certificate.pdf'],
    isEmergency: true
  },
  {
    id: 'LR003',
    employeeId: 'BC-E004',
    employeeName: 'Lisa Analyst',
    department: 'Finance',
    position: 'Financial Analyst',
    leaveType: 'study',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    duration: 5,
    status: 'approved',
    reason: 'Professional certification exam preparation and attendance',
    appliedDate: '2024-10-25',
    approvedBy: 'Finance Director',
    approvedDate: '2024-10-26',
    coveringEmployee: 'Finance Assistant',
    notes: 'CFA Level 2 Examination',
    isEmergency: false
  },
  {
    id: 'LR004',
    employeeId: 'BC-E005',
    employeeName: 'David Driver',
    department: 'Logistics',
    position: 'Truck Driver',
    leaveType: 'emergency',
    startDate: '2024-11-14',
    endDate: '2024-11-16',
    duration: 3,
    status: 'approved',
    reason: 'Family emergency - father hospitalized',
    appliedDate: '2024-11-14',
    approvedBy: 'Logistics Supervisor',
    approvedDate: '2024-11-14',
    isEmergency: true
  },
  {
    id: 'LR005',
    employeeId: 'BC-E006',
    employeeName: 'Grace Coordinator',
    department: 'Human Resources',
    position: 'HR Coordinator',
    leaveType: 'personal',
    startDate: '2024-11-25',
    endDate: '2024-11-29',
    duration: 5,
    status: 'rejected',
    reason: 'Personal matters and family obligations',
    appliedDate: '2024-11-08',
    approvedBy: 'HR Manager',
    approvedDate: '2024-11-09',
    rejectionReason: 'Too close to year-end busy period. Please reschedule to January.',
    isEmergency: false
  },
  {
    id: 'LR006',
    employeeId: 'BC-E002',
    employeeName: 'Sarah Director',
    department: 'Executive',
    position: 'Regional Director',
    leaveType: 'annual',
    startDate: '2024-12-23',
    endDate: '2025-01-02',
    duration: 11,
    status: 'approved',
    reason: 'Annual vacation and New Year holidays',
    appliedDate: '2024-10-15',
    approvedBy: 'CEO',
    approvedDate: '2024-10-16',
    coveringEmployee: 'John Manager',
    notes: 'Extended holiday break',
    isEmergency: false
  }
]

const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: 'BC-E001',
    employeeName: 'John Manager',
    annual: { allocated: 25, used: 12, remaining: 13 },
    sick: { allocated: 15, used: 3, remaining: 12 },
    personal: { allocated: 10, used: 2, remaining: 8 },
    maternity: { allocated: 0, used: 0, remaining: 0 },
    paternity: { allocated: 5, used: 0, remaining: 5 },
    study: { allocated: 5, used: 1, remaining: 4 }
  },
  {
    employeeId: 'BC-E002',
    employeeName: 'Sarah Director',
    annual: { allocated: 30, used: 8, remaining: 22 },
    sick: { allocated: 20, used: 1, remaining: 19 },
    personal: { allocated: 15, used: 0, remaining: 15 },
    maternity: { allocated: 0, used: 0, remaining: 0 },
    paternity: { allocated: 0, used: 0, remaining: 0 },
    study: { allocated: 10, used: 2, remaining: 8 }
  },
  {
    employeeId: 'BC-E003',
    employeeName: 'Ahmed Technician',
    annual: { allocated: 20, used: 8, remaining: 12 },
    sick: { allocated: 12, used: 6, remaining: 6 },
    personal: { allocated: 7, used: 2, remaining: 5 },
    maternity: { allocated: 0, used: 0, remaining: 0 },
    paternity: { allocated: 3, used: 0, remaining: 3 },
    study: { allocated: 3, used: 0, remaining: 3 }
  }
]

export default function LeaveManagementPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [leaveBalances] = useState<LeaveBalance[]>(mockLeaveBalances)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [showBalances, setShowBalances] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const leaveTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'study', label: 'Study Leave' }
  ]

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Executive', label: 'Executive' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-black bg-gray-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'text-blue-600 bg-blue-100'
      case 'sick': return 'text-red-600 bg-red-100'
      case 'personal': return 'text-purple-600 bg-purple-100'
      case 'maternity': return 'text-pink-600 bg-pink-100'
      case 'paternity': return 'text-green-600 bg-green-100'
      case 'emergency': return 'text-orange-600 bg-orange-100'
      case 'study': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesType = filterType === 'all' || request.leaveType === filterType
    const matchesDepartment = filterDepartment === 'all' || request.department === filterDepartment

    return matchesSearch && matchesStatus && matchesType && matchesDepartment
  })

  const totalRequests = filteredRequests.length
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending').length
  const approvedRequests = filteredRequests.filter(req => req.status === 'approved').length
  const totalLeaveDays = filteredRequests.filter(req => req.status === 'approved').reduce((sum, req) => sum + req.duration, 0)

  const exportToCSV = () => {
    const headers = [
      'Employee ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date',
      'Duration (Days)', 'Status', 'Reason', 'Applied Date', 'Approved By'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredRequests.map(request =>
        [
          request.employeeId,
          request.employeeName,
          request.department,
          request.leaveType,
          request.startDate,
          request.endDate,
          request.duration,
          request.status,
          `"${request.reason}"`,
          request.appliedDate,
          request.approvedBy || 'N/A'
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leave-requests.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Leave Management</h1>
            <p className="text-black">Manage employee leave requests and track balances</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>{showBalances ? 'Show Requests' : 'Show Balances'}</span>
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Leave Request</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Requests</p>
                <p className="text-2xl font-bold text-black">{totalRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Pending Approval</p>
                <p className="text-2xl font-bold text-black">{pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Approved</p>
                <p className="text-2xl font-bold text-black">{approvedRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Leave Days</p>
                <p className="text-2xl font-bold text-black">{totalLeaveDays}</p>
              </div>
            </div>
          </div>
        </div>

        {!showBalances ? (
          <>
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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
                  <label className="block text-sm font-medium text-black mb-2">Leave Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    {leaveTypeOptions.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Department</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Leave Requests Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Leave Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-black">{request.employeeName}</div>
                            <div className="text-sm text-black">{request.employeeId}</div>
                            <div className="text-sm text-black">{request.department} - {request.position}</div>
                            {request.isEmergency && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full mt-1">
                                Emergency
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}>
                            <span className="capitalize">{request.leaveType}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">
                            <div>{request.startDate}</div>
                            <div className="text-black">to {request.endDate}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {request.duration} {request.duration === 1 ? 'day' : 'days'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {request.appliedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-[#8B1538] hover:text-[#7A1230]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Leave Balances View */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">Leave Balances</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Annual Leave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Sick Leave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Personal Leave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Study Leave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Other Leave
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveBalances.map((balance) => (
                    <tr key={balance.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-black">{balance.employeeName}</div>
                          <div className="text-sm text-black">{balance.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          <div className="font-medium">{balance.annual.remaining} remaining</div>
                          <div className="text-xs text-black">
                            {balance.annual.used} used / {balance.annual.allocated} allocated
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${(balance.annual.used / balance.annual.allocated) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          <div className="font-medium">{balance.sick.remaining} remaining</div>
                          <div className="text-xs text-black">
                            {balance.sick.used} used / {balance.sick.allocated} allocated
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-red-600 h-1.5 rounded-full"
                              style={{ width: `${(balance.sick.used / balance.sick.allocated) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          <div className="font-medium">{balance.personal.remaining} remaining</div>
                          <div className="text-xs text-black">
                            {balance.personal.used} used / {balance.personal.allocated} allocated
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{ width: `${(balance.personal.used / balance.personal.allocated) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          <div className="font-medium">{balance.study.remaining} remaining</div>
                          <div className="text-xs text-black">
                            {balance.study.used} used / {balance.study.allocated} allocated
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${balance.study.allocated > 0 ? (balance.study.used / balance.study.allocated) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          <div className="space-y-1">
                            {balance.paternity.allocated > 0 && (
                              <div className="text-xs">
                                <span className="font-medium">Paternity:</span> {balance.paternity.remaining} remaining
                              </div>
                            )}
                            {balance.maternity.allocated > 0 && (
                              <div className="text-xs">
                                <span className="font-medium">Maternity:</span> {balance.maternity.remaining} remaining
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leave Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Leave Request Details - {selectedRequest.employeeName}
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Employee Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Employee</label>
                        <p className="text-sm text-black">{selectedRequest.employeeName} ({selectedRequest.employeeId})</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Department</label>
                        <p className="text-sm text-black">{selectedRequest.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Position</label>
                        <p className="text-sm text-black">{selectedRequest.position}</p>
                      </div>
                      {selectedRequest.coveringEmployee && (
                        <div>
                          <label className="block text-sm font-medium text-black">Covering Employee</label>
                          <p className="text-sm text-black">{selectedRequest.coveringEmployee}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Leave Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Leave Type</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(selectedRequest.leaveType)}`}>
                          <span className="capitalize">{selectedRequest.leaveType}</span>
                        </span>
                        {selectedRequest.isEmergency && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Emergency
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Start Date</label>
                        <p className="text-sm text-black">{selectedRequest.startDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">End Date</label>
                        <p className="text-sm text-black">{selectedRequest.endDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Duration</label>
                        <p className="text-sm text-black font-medium">
                          {selectedRequest.duration} {selectedRequest.duration === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Reason for Leave</h3>
                  <p className="text-sm text-black bg-gray-50 p-3 rounded-md">{selectedRequest.reason}</p>
                </div>

                {/* Status Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Status Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Current Status</label>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusIcon(selectedRequest.status)}
                        <span className="capitalize">{selectedRequest.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Applied Date</label>
                      <p className="text-sm text-black">{selectedRequest.appliedDate}</p>
                    </div>
                    {selectedRequest.approvedBy && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-black">Approved By</label>
                          <p className="text-sm text-black">{selectedRequest.approvedBy}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black">Approved Date</label>
                          <p className="text-sm text-black">{selectedRequest.approvedDate}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Rejection Reason */}
                {selectedRequest.rejectionReason && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-black mb-4">Rejection Reason</h3>
                    <p className="text-sm text-black bg-red-50 p-3 rounded-md border-l-4 border-red-400">
                      {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedRequest.notes && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-black mb-4">Additional Notes</h3>
                    <p className="text-sm text-black bg-blue-50 p-3 rounded-md">{selectedRequest.notes}</p>
                  </div>
                )}

                {/* Attachments */}
                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-black mb-4">Attachments</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.attachments.map((attachment, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                          📎 {attachment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && (
                  <div className="border-t pt-6 flex space-x-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}