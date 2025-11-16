'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Download, Plus, Eye, Calendar, DollarSign, Calculator, TrendingUp, Users, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  payPeriod: string
  payDate: string
  status: 'draft' | 'processed' | 'paid' | 'cancelled'
  basicSalary: number
  allowances: {
    housing: number
    transport: number
    meals: number
    medical: number
    other: number
  }
  deductions: {
    tax: number
    pension: number
    nhis: number
    loan: number
    other: number
  }
  overtime: {
    hours: number
    rate: number
    amount: number
  }
  bonus: number
  grossPay: number
  totalDeductions: number
  netPay: number
  bankAccount: string
  paymentMethod: 'bank-transfer' | 'cash' | 'cheque'
}

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: 'PAY001',
    employeeId: 'BC-E001',
    employeeName: 'John Manager',
    department: 'Operations',
    position: 'Operations Manager',
    payPeriod: 'November 2024',
    payDate: '2024-11-30',
    status: 'processed',
    basicSalary: 2500000,
    allowances: {
      housing: 500000,
      transport: 200000,
      meals: 100000,
      medical: 50000,
      other: 0
    },
    deductions: {
      tax: 450000,
      pension: 200000,
      nhis: 35000,
      loan: 100000,
      other: 0
    },
    overtime: {
      hours: 8,
      rate: 15000,
      amount: 120000
    },
    bonus: 250000,
    grossPay: 3720000,
    totalDeductions: 785000,
    netPay: 2935000,
    bankAccount: 'First Bank - 1234567890',
    paymentMethod: 'bank-transfer'
  },
  {
    id: 'PAY002',
    employeeId: 'BC-E002',
    employeeName: 'Sarah Director',
    department: 'Executive',
    position: 'Regional Director',
    payPeriod: 'November 2024',
    payDate: '2024-11-30',
    status: 'paid',
    basicSalary: 5000000,
    allowances: {
      housing: 1000000,
      transport: 400000,
      meals: 200000,
      medical: 100000,
      other: 150000
    },
    deductions: {
      tax: 1125000,
      pension: 500000,
      nhis: 68500,
      loan: 0,
      other: 50000
    },
    overtime: {
      hours: 0,
      rate: 0,
      amount: 0
    },
    bonus: 500000,
    grossPay: 7350000,
    totalDeductions: 1743500,
    netPay: 5606500,
    bankAccount: 'Access Bank - 0987654321',
    paymentMethod: 'bank-transfer'
  },
  {
    id: 'PAY003',
    employeeId: 'BC-E003',
    employeeName: 'Ahmed Technician',
    department: 'Maintenance',
    position: 'Senior Technician',
    payPeriod: 'November 2024',
    payDate: '2024-11-30',
    status: 'processed',
    basicSalary: 800000,
    allowances: {
      housing: 160000,
      transport: 80000,
      meals: 40000,
      medical: 20000,
      other: 25000
    },
    deductions: {
      tax: 95000,
      pension: 64000,
      nhis: 11000,
      loan: 50000,
      other: 0
    },
    overtime: {
      hours: 15,
      rate: 5000,
      amount: 75000
    },
    bonus: 50000,
    grossPay: 1250000,
    totalDeductions: 220000,
    netPay: 1030000,
    bankAccount: 'UBA - 1122334455',
    paymentMethod: 'bank-transfer'
  },
  {
    id: 'PAY004',
    employeeId: 'BC-E004',
    employeeName: 'Lisa Analyst',
    department: 'Finance',
    position: 'Financial Analyst',
    payPeriod: 'November 2024',
    payDate: '2024-11-30',
    status: 'draft',
    basicSalary: 1200000,
    allowances: {
      housing: 240000,
      transport: 120000,
      meals: 60000,
      medical: 30000,
      other: 0
    },
    deductions: {
      tax: 162000,
      pension: 96000,
      nhis: 16500,
      loan: 75000,
      other: 0
    },
    overtime: {
      hours: 10,
      rate: 8000,
      amount: 80000
    },
    bonus: 100000,
    grossPay: 1830000,
    totalDeductions: 349500,
    netPay: 1480500,
    bankAccount: 'GTBank - 5566778899',
    paymentMethod: 'bank-transfer'
  },
  {
    id: 'PAY005',
    employeeId: 'BC-E005',
    employeeName: 'David Driver',
    department: 'Logistics',
    position: 'Truck Driver',
    payPeriod: 'October 2024',
    payDate: '2024-10-31',
    status: 'paid',
    basicSalary: 450000,
    allowances: {
      housing: 90000,
      transport: 45000,
      meals: 30000,
      medical: 15000,
      other: 10000
    },
    deductions: {
      tax: 45000,
      pension: 36000,
      nhis: 6500,
      loan: 25000,
      other: 0
    },
    overtime: {
      hours: 20,
      rate: 3000,
      amount: 60000
    },
    bonus: 25000,
    grossPay: 715000,
    totalDeductions: 112500,
    netPay: 602500,
    bankAccount: 'Zenith Bank - 9988776655',
    paymentMethod: 'bank-transfer'
  },
  {
    id: 'PAY006',
    employeeId: 'BC-E006',
    employeeName: 'Grace Coordinator',
    department: 'Human Resources',
    position: 'HR Coordinator',
    payPeriod: 'November 2024',
    payDate: '2024-11-30',
    status: 'processed',
    basicSalary: 650000,
    allowances: {
      housing: 130000,
      transport: 65000,
      meals: 32500,
      medical: 16250,
      other: 0
    },
    deductions: {
      tax: 71500,
      pension: 52000,
      nhis: 9000,
      loan: 40000,
      other: 0
    },
    overtime: {
      hours: 5,
      rate: 4000,
      amount: 20000
    },
    bonus: 40000,
    grossPay: 953750,
    totalDeductions: 172500,
    netPay: 781250,
    bankAccount: 'Stanbic IBTC - 4455667788',
    paymentMethod: 'bank-transfer'
  }
]

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterPeriod, setFilterPeriod] = useState<string>('all')
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'processed', label: 'Processed' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' }
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

  const periods = [
    { value: 'all', label: 'All Periods' },
    { value: 'November 2024', label: 'November 2024' },
    { value: 'October 2024', label: 'October 2024' },
    { value: 'September 2024', label: 'September 2024' },
    { value: 'August 2024', label: 'August 2024' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-black bg-gray-100'
      case 'processed': return 'text-blue-600 bg-blue-100'
      case 'paid': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-black bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />
      case 'processed': return <Calculator className="h-4 w-4" />
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment
    const matchesPeriod = filterPeriod === 'all' || record.payPeriod === filterPeriod

    return matchesSearch && matchesStatus && matchesDepartment && matchesPeriod
  })

  const totalEmployees = filteredRecords.length
  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + record.grossPay, 0)
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netPay, 0)
  const totalDeductions = filteredRecords.reduce((sum, record) => sum + record.totalDeductions, 0)
  const paidRecords = filteredRecords.filter(record => record.status === 'paid').length
  const pendingRecords = filteredRecords.filter(record => record.status === 'processed').length

  const exportToCSV = () => {
    const headers = [
      'Employee ID', 'Employee Name', 'Department', 'Position', 'Pay Period',
      'Basic Salary (₦)', 'Gross Pay (₦)', 'Total Deductions (₦)', 'Net Pay (₦)', 'Status'
    ]
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record =>
        [
          record.employeeId,
          record.employeeName,
          record.department,
          record.position,
          record.payPeriod,
          record.basicSalary.toLocaleString(),
          record.grossPay.toLocaleString(),
          record.totalDeductions.toLocaleString(),
          record.netPay.toLocaleString(),
          record.status
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payroll-records.csv'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Payroll Management</h1>
            <p className="text-black">Manage employee compensation and salary processing</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Run Payroll</span>
            </button>
            <button className="px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Pay Record</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Gross Pay</p>
                <p className="text-2xl font-bold text-black">₦{(totalGrossPay / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Net Pay</p>
                <p className="text-2xl font-bold text-black">₦{(totalNetPay / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Paid</p>
                <p className="text-2xl font-bold text-black">{paidRecords}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Pending</p>
                <p className="text-2xl font-bold text-black">{pendingRecords}</p>
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
              <label className="block text-sm font-medium text-black mb-2">Pay Period</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Pay Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{record.employeeName}</div>
                        <div className="text-sm text-black">{record.employeeId}</div>
                        <div className="text-sm text-black">{record.department} - {record.position}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{record.payPeriod}</div>
                      <div className="text-sm text-black">{record.payDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      ₦{record.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">₦{record.grossPay.toLocaleString()}</div>
                      {record.overtime.hours > 0 && (
                        <div className="text-xs text-blue-600">+{record.overtime.hours}h OT</div>
                      )}
                      {record.bonus > 0 && (
                        <div className="text-xs text-green-600">+₦{record.bonus.toLocaleString()} bonus</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      ₦{record.totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">
                      ₦{record.netPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <button
                        onClick={() => setSelectedRecord(record)}
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

        {/* Payroll Details Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Payroll Details - {selectedRecord.employeeName}
                </h2>
                <button
                  onClick={() => setSelectedRecord(null)}
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
                        <label className="block text-sm font-medium text-black">Employee ID</label>
                        <p className="text-sm text-black font-medium">{selectedRecord.employeeId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Employee Name</label>
                        <p className="text-sm text-black">{selectedRecord.employeeName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Department</label>
                        <p className="text-sm text-black">{selectedRecord.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Position</label>
                        <p className="text-sm text-black">{selectedRecord.position}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black">Pay Period Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-black">Pay Period</label>
                        <p className="text-sm text-black font-medium">{selectedRecord.payPeriod}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Pay Date</label>
                        <p className="text-sm text-black">{selectedRecord.payDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Status</label>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                          {getStatusIcon(selectedRecord.status)}
                          <span className="capitalize">{selectedRecord.status}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Payment Method</label>
                        <p className="text-sm text-black capitalize">{selectedRecord.paymentMethod.replace('-', ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Salary Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earnings */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-3">Earnings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Basic Salary</span>
                          <span className="text-sm font-medium">₦{selectedRecord.basicSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Housing Allowance</span>
                          <span className="text-sm font-medium">₦{selectedRecord.allowances.housing.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Transport Allowance</span>
                          <span className="text-sm font-medium">₦{selectedRecord.allowances.transport.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Meals Allowance</span>
                          <span className="text-sm font-medium">₦{selectedRecord.allowances.meals.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Medical Allowance</span>
                          <span className="text-sm font-medium">₦{selectedRecord.allowances.medical.toLocaleString()}</span>
                        </div>
                        {selectedRecord.allowances.other > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-black">Other Allowances</span>
                            <span className="text-sm font-medium">₦{selectedRecord.allowances.other.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedRecord.overtime.hours > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-black">Overtime ({selectedRecord.overtime.hours}h)</span>
                            <span className="text-sm font-medium">₦{selectedRecord.overtime.amount.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedRecord.bonus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-black">Bonus</span>
                            <span className="text-sm font-medium">₦{selectedRecord.bonus.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span className="text-sm">Total Gross Pay</span>
                            <span className="text-sm">₦{selectedRecord.grossPay.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-3">Deductions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Income Tax</span>
                          <span className="text-sm font-medium">₦{selectedRecord.deductions.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">Pension Contribution</span>
                          <span className="text-sm font-medium">₦{selectedRecord.deductions.pension.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">NHIS</span>
                          <span className="text-sm font-medium">₦{selectedRecord.deductions.nhis.toLocaleString()}</span>
                        </div>
                        {selectedRecord.deductions.loan > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-black">Loan Deduction</span>
                            <span className="text-sm font-medium">₦{selectedRecord.deductions.loan.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedRecord.deductions.other > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-black">Other Deductions</span>
                            <span className="text-sm font-medium">₦{selectedRecord.deductions.other.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span className="text-sm">Total Deductions</span>
                            <span className="text-sm">₦{selectedRecord.totalDeductions.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Pay Summary */}
                <div className="border-t pt-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-black mb-2">Net Pay Summary</h3>
                      <div className="text-3xl font-bold text-[#8B1538] mb-4">
                        ₦{selectedRecord.netPay.toLocaleString()}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-black">Gross Pay</div>
                          <div className="font-medium">₦{selectedRecord.grossPay.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-black">Less: Deductions</div>
                          <div className="font-medium">₦{selectedRecord.totalDeductions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-black">Net Pay</div>
                          <div className="font-bold">₦{selectedRecord.netPay.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black">Bank Account</label>
                      <p className="text-sm text-black">{selectedRecord.bankAccount}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black">Payment Method</label>
                      <p className="text-sm text-black capitalize">{selectedRecord.paymentMethod.replace('-', ' ')}</p>
                    </div>
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