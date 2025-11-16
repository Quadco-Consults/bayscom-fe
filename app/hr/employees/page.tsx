'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Download, Plus, Eye, Edit, Mail, Phone, MapPin, Calendar, Users, Building, Award, AlertTriangle, CheckCircle } from 'lucide-react'

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  location: string
  hireDate: string
  status: 'active' | 'inactive' | 'terminated' | 'on-leave'
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern'
  salary: number
  manager: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string
    country: string
  }
  dateOfBirth: string
  nationalId: string
  bankAccount: {
    bankName: string
    accountNumber: string
  }
  leaveBalance: {
    annual: number
    sick: number
    personal: number
  }
  performance: {
    rating: number
    lastReview: string
  }
  documents: string[]
  skills: string[]
}

const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    employeeId: 'BC-E001',
    firstName: 'John',
    lastName: 'Manager',
    email: 'john.manager@bayscom.ng',
    phone: '+234-803-123-4567',
    position: 'Operations Manager',
    department: 'Operations',
    location: 'Lagos Main Office',
    hireDate: '2022-03-15',
    status: 'active',
    employmentType: 'full-time',
    salary: 2500000,
    manager: 'Sarah Director',
    emergencyContact: {
      name: 'Jane Manager',
      relationship: 'Spouse',
      phone: '+234-803-123-4568'
    },
    address: {
      street: '45 Victoria Island Road',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria'
    },
    dateOfBirth: '1985-08-20',
    nationalId: '12345678901',
    bankAccount: {
      bankName: 'First Bank',
      accountNumber: '1234567890'
    },
    leaveBalance: {
      annual: 18,
      sick: 10,
      personal: 5
    },
    performance: {
      rating: 4.5,
      lastReview: '2024-09-15'
    },
    documents: ['CV', 'Certificates', 'ID Copy', 'Contract'],
    skills: ['Operations Management', 'Team Leadership', 'Strategic Planning']
  },
  {
    id: 'EMP002',
    employeeId: 'BC-E002',
    firstName: 'Sarah',
    lastName: 'Director',
    email: 'sarah.director@bayscom.ng',
    phone: '+234-809-876-5432',
    position: 'Regional Director',
    department: 'Executive',
    location: 'Lagos Main Office',
    hireDate: '2020-01-10',
    status: 'active',
    employmentType: 'full-time',
    salary: 5000000,
    manager: 'CEO',
    emergencyContact: {
      name: 'Michael Director',
      relationship: 'Brother',
      phone: '+234-809-876-5433'
    },
    address: {
      street: '12 Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria'
    },
    dateOfBirth: '1980-12-05',
    nationalId: '09876543210',
    bankAccount: {
      bankName: 'Access Bank',
      accountNumber: '0987654321'
    },
    leaveBalance: {
      annual: 25,
      sick: 15,
      personal: 7
    },
    performance: {
      rating: 5.0,
      lastReview: '2024-08-20'
    },
    documents: ['CV', 'MBA Certificate', 'ID Copy', 'Contract', 'Medical Report'],
    skills: ['Strategic Leadership', 'Business Development', 'Financial Management']
  },
  {
    id: 'EMP003',
    employeeId: 'BC-E003',
    firstName: 'Ahmed',
    lastName: 'Technician',
    email: 'ahmed.technician@bayscom.ng',
    phone: '+234-812-345-6789',
    position: 'Senior Technician',
    department: 'Maintenance',
    location: 'Port Harcourt Depot',
    hireDate: '2023-06-01',
    status: 'active',
    employmentType: 'full-time',
    salary: 800000,
    manager: 'Mike Operations',
    emergencyContact: {
      name: 'Fatima Ahmed',
      relationship: 'Wife',
      phone: '+234-812-345-6790'
    },
    address: {
      street: '78 Trans Amadi Road',
      city: 'Port Harcourt',
      state: 'Rivers',
      country: 'Nigeria'
    },
    dateOfBirth: '1990-04-15',
    nationalId: '11223344556',
    bankAccount: {
      bankName: 'UBA',
      accountNumber: '1122334455'
    },
    leaveBalance: {
      annual: 12,
      sick: 8,
      personal: 3
    },
    performance: {
      rating: 4.0,
      lastReview: '2024-06-01'
    },
    documents: ['CV', 'Technical Certificates', 'ID Copy', 'Contract'],
    skills: ['Equipment Maintenance', 'Safety Protocols', 'Technical Repair']
  },
  {
    id: 'EMP004',
    employeeId: 'BC-E004',
    firstName: 'Lisa',
    lastName: 'Analyst',
    email: 'lisa.analyst@bayscom.ng',
    phone: '+234-807-234-5678',
    position: 'Financial Analyst',
    department: 'Finance',
    location: 'Abuja Office',
    hireDate: '2023-09-15',
    status: 'active',
    employmentType: 'full-time',
    salary: 1200000,
    manager: 'Finance Director',
    emergencyContact: {
      name: 'Peter Analyst',
      relationship: 'Father',
      phone: '+234-807-234-5679'
    },
    address: {
      street: '23 Maitama District',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria'
    },
    dateOfBirth: '1992-11-22',
    nationalId: '55667788990',
    bankAccount: {
      bankName: 'GTBank',
      accountNumber: '5566778899'
    },
    leaveBalance: {
      annual: 15,
      sick: 12,
      personal: 4
    },
    performance: {
      rating: 4.2,
      lastReview: '2024-09-15'
    },
    documents: ['CV', 'Degree Certificate', 'ID Copy', 'Contract'],
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Reporting']
  },
  {
    id: 'EMP005',
    employeeId: 'BC-E005',
    firstName: 'David',
    lastName: 'Driver',
    email: 'david.driver@bayscom.ng',
    phone: '+234-816-789-0123',
    position: 'Truck Driver',
    department: 'Logistics',
    location: 'Kano Distribution Center',
    hireDate: '2021-11-20',
    status: 'on-leave',
    employmentType: 'full-time',
    salary: 450000,
    manager: 'Logistics Supervisor',
    emergencyContact: {
      name: 'Mary Driver',
      relationship: 'Sister',
      phone: '+234-816-789-0124'
    },
    address: {
      street: '56 Fagge Road',
      city: 'Kano',
      state: 'Kano',
      country: 'Nigeria'
    },
    dateOfBirth: '1988-03-10',
    nationalId: '99887766554',
    bankAccount: {
      bankName: 'Zenith Bank',
      accountNumber: '9988776655'
    },
    leaveBalance: {
      annual: 8,
      sick: 5,
      personal: 2
    },
    performance: {
      rating: 3.8,
      lastReview: '2024-05-20'
    },
    documents: ['CV', 'Driving License', 'ID Copy', 'Contract'],
    skills: ['Safe Driving', 'Vehicle Maintenance', 'Route Planning']
  },
  {
    id: 'EMP006',
    employeeId: 'BC-E006',
    firstName: 'Grace',
    lastName: 'Coordinator',
    email: 'grace.coordinator@bayscom.ng',
    phone: '+234-813-456-7890',
    position: 'HR Coordinator',
    department: 'Human Resources',
    location: 'Lagos Main Office',
    hireDate: '2024-02-01',
    status: 'active',
    employmentType: 'contract',
    salary: 650000,
    manager: 'HR Manager',
    emergencyContact: {
      name: 'Emmanuel Grace',
      relationship: 'Husband',
      phone: '+234-813-456-7891'
    },
    address: {
      street: '34 Ikeja GRA',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria'
    },
    dateOfBirth: '1987-07-14',
    nationalId: '44556677889',
    bankAccount: {
      bankName: 'Stanbic IBTC',
      accountNumber: '4455667788'
    },
    leaveBalance: {
      annual: 10,
      sick: 7,
      personal: 3
    },
    performance: {
      rating: 4.1,
      lastReview: '2024-08-01'
    },
    documents: ['CV', 'HR Certificate', 'ID Copy', 'Contract'],
    skills: ['HR Management', 'Recruitment', 'Employee Relations', 'Policy Development']
  }
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Executive', label: 'Executive' },
    { value: 'Sales', label: 'Sales' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' }
  ]

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Lagos Main Office', label: 'Lagos Main Office' },
    { value: 'Abuja Office', label: 'Abuja Office' },
    { value: 'Port Harcourt Depot', label: 'Port Harcourt Depot' },
    { value: 'Kano Distribution Center', label: 'Kano Distribution Center' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-black bg-gray-100'
      case 'on-leave': return 'text-yellow-600 bg-yellow-100'
      case 'terminated': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'text-blue-600 bg-blue-100'
      case 'part-time': return 'text-purple-600 bg-purple-100'
      case 'contract': return 'text-orange-600 bg-orange-100'
      case 'intern': return 'text-green-600 bg-green-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getPerformanceStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm)

    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus
    const matchesLocation = filterLocation === 'all' || employee.location === filterLocation

    return matchesSearch && matchesDepartment && matchesStatus && matchesLocation
  })

  const totalEmployees = filteredEmployees.length
  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'active').length
  const onLeaveEmployees = filteredEmployees.filter(emp => emp.status === 'on-leave').length
  const averageSalary = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0) / filteredEmployees.length || 0

  const exportToCSV = () => {
    const headers = [
      'Employee ID', 'Name', 'Email', 'Phone', 'Position', 'Department',
      'Location', 'Status', 'Employment Type', 'Hire Date', 'Salary (₦)'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(employee =>
        [
          employee.employeeId,
          `${employee.firstName} ${employee.lastName}`,
          employee.email,
          employee.phone,
          employee.position,
          employee.department,
          employee.location,
          employee.status,
          employee.employmentType,
          employee.hireDate,
          employee.salary.toLocaleString()
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employees.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Employee Management</h1>
            <p className="text-black">Manage your workforce and employee information</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#8B1538]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Employees</p>
                <p className="text-2xl font-bold text-black">{totalEmployees}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Active Employees</p>
                <p className="text-2xl font-bold text-black">{activeEmployees}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">On Leave</p>
                <p className="text-2xl font-bold text-black">{onLeaveEmployees}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Avg Salary</p>
                <p className="text-2xl font-bold text-black">₦{(averageSalary / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              <label className="block text-sm font-medium text-black mb-2">Location</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Position & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Employment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#8B1538] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-black">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-black">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {employee.email}
                        </div>
                        <div className="flex items-center text-sm text-black">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center text-sm text-black">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {employee.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div className="font-medium">{employee.position}</div>
                        <div className="text-black">{employee.department}</div>
                        <div className="text-xs text-black mt-1">Manager: {employee.manager}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          <span className="capitalize">{employee.status.replace('-', ' ')}</span>
                        </span>
                        <br />
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(employee.employmentType)}`}>
                          <span className="capitalize">{employee.employmentType.replace('-', ' ')}</span>
                        </span>
                        <div className="text-xs text-black">Hired: {employee.hireDate}</div>
                        <div className="text-xs text-black font-medium">₦{employee.salary.toLocaleString()}/month</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">
                        <div className="flex items-center space-x-1">
                          {getPerformanceStars(employee.performance.rating)}
                          <span className="ml-1 text-xs">({employee.performance.rating})</span>
                        </div>
                        <div className="text-xs text-black mt-1">
                          Last Review: {employee.performance.lastReview}
                        </div>
                        <div className="text-xs text-black">
                          Leave: {employee.leaveBalance.annual}A | {employee.leaveBalance.sick}S
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="text-[#8B1538] hover:text-[#7A1230]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Details Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Employee Details - {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Employee ID</label>
                        <p className="text-sm text-black font-medium">{selectedEmployee.employeeId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Full Name</label>
                        <p className="text-sm text-black">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Date of Birth</label>
                        <p className="text-sm text-black">{selectedEmployee.dateOfBirth}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">National ID</label>
                        <p className="text-sm text-black">{selectedEmployee.nationalId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Email</label>
                        <p className="text-sm text-black">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Phone</label>
                        <p className="text-sm text-black">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Employment Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Position</label>
                        <p className="text-sm text-black font-medium">{selectedEmployee.position}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Department</label>
                        <p className="text-sm text-black">{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Location</label>
                        <p className="text-sm text-black">{selectedEmployee.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Manager</label>
                        <p className="text-sm text-black">{selectedEmployee.manager}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Hire Date</label>
                        <p className="text-sm text-black">{selectedEmployee.hireDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Status</label>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEmployee.status)}`}>
                          <span className="capitalize">{selectedEmployee.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black">Street Address</label>
                      <p className="text-sm text-black">{selectedEmployee.address.street}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">City, State</label>
                      <p className="text-sm text-black">{selectedEmployee.address.city}, {selectedEmployee.address.state}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black">Name</label>
                      <p className="text-sm text-black">{selectedEmployee.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Relationship</label>
                      <p className="text-sm text-black">{selectedEmployee.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Phone</label>
                      <p className="text-sm text-black">{selectedEmployee.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black">Monthly Salary</label>
                      <p className="text-lg font-bold text-black">₦{selectedEmployee.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Bank Name</label>
                      <p className="text-sm text-black">{selectedEmployee.bankAccount.bankName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Account Number</label>
                      <p className="text-sm text-black">{selectedEmployee.bankAccount.accountNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Leave Balance */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Leave Balance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedEmployee.leaveBalance.annual}</div>
                      <div className="text-sm text-black">Annual Leave</div>
                    </div>
                    <div className="text-center bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedEmployee.leaveBalance.sick}</div>
                      <div className="text-sm text-black">Sick Leave</div>
                    </div>
                    <div className="text-center bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedEmployee.leaveBalance.personal}</div>
                      <div className="text-sm text-black">Personal Leave</div>
                    </div>
                  </div>
                </div>

                {/* Performance & Skills */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Performance & Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Performance Rating</label>
                      <div className="flex items-center space-x-2">
                        {getPerformanceStars(selectedEmployee.performance.rating)}
                        <span className="text-lg font-medium">({selectedEmployee.performance.rating}/5)</span>
                      </div>
                      <p className="text-sm text-black mt-1">
                        Last Review: {selectedEmployee.performance.lastReview}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Documents</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.documents.map((doc, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}