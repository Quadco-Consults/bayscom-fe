'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, Building2, MapPin, Users, DollarSign, TrendingUp, Edit, CheckCircle, XCircle } from 'lucide-react'
import { CostCenter } from '@/lib/types'

const mockCostCenters: CostCenter[] = [
  {
    id: '1',
    code: 'CC-ABJ-001',
    name: 'Abuja Filling Station',
    description: 'Main filling station in Abuja - Wuse II',
    type: 'filling-station',
    isActive: true,
    managerId: 'user-1',
    budget: 25000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '2',
    code: 'CC-LAG-001',
    name: 'Lagos Filling Station',
    description: 'Lagos Island filling station',
    type: 'filling-station',
    isActive: true,
    managerId: 'user-2',
    budget: 30000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '3',
    code: 'CC-KAN-001',
    name: 'Kano Filling Station',
    description: 'Kano main branch',
    type: 'filling-station',
    isActive: true,
    managerId: 'user-3',
    budget: 20000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '4',
    code: 'CC-PH-001',
    name: 'Port Harcourt Filling Station',
    description: 'Port Harcourt depot and station',
    type: 'filling-station',
    isActive: true,
    managerId: 'user-4',
    budget: 28000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '5',
    code: 'CC-KAD-001',
    name: 'Kaduna Filling Station',
    description: 'Kaduna branch',
    type: 'filling-station',
    isActive: true,
    managerId: 'user-5',
    budget: 18000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '6',
    code: 'CC-HQ-ADMIN',
    name: 'Head Office - Administration',
    description: 'Corporate headquarters administrative costs',
    type: 'department',
    isActive: true,
    managerId: 'user-6',
    budget: 15000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '7',
    code: 'CC-FLEET',
    name: 'Fleet Operations',
    description: 'Truck fleet and haulage operations',
    type: 'project',
    isActive: true,
    managerId: 'user-7',
    budget: 35000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '8',
    code: 'CC-PEDDLING',
    name: 'Peddling Operations',
    description: 'AGO and LPG door-to-door sales',
    type: 'project',
    isActive: true,
    managerId: 'user-8',
    budget: 12000000,
    createdAt: '2024-01-01',
    updatedAt: '2025-03-22',
  },
]

export default function CostCentersPage() {
  const [costCenters] = useState<CostCenter[]>(mockCostCenters)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredCostCenters = costCenters.filter(cc =>
    typeFilter === 'all' || cc.type === typeFilter
  )

  const totalBudget = costCenters.reduce((sum, cc) => sum + (cc.budget || 0), 0)
  const activeCostCenters = costCenters.filter(cc => cc.isActive).length
  const fillingStations = costCenters.filter(cc => cc.type === 'filling-station').length
  const projects = costCenters.filter(cc => cc.type === 'project').length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      'filling-station': 'bg-blue-50 text-blue-700 border-blue-200',
      'department': 'bg-green-50 text-green-700 border-green-200',
      'project': 'bg-purple-50 text-purple-700 border-purple-200',
      'other': 'bg-gray-50 text-gray-700 border-gray-200',
    }

    const labels = {
      'filling-station': 'Filling Station',
      'department': 'Department',
      'project': 'Project',
      'other': 'Other',
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${
          styles[type as keyof typeof styles]
        }`}
      >
        {labels[type as keyof typeof labels]}
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'filling-station':
        return <Building2 className="w-5 h-5 text-blue-600" />
      case 'department':
        return <Users className="w-5 h-5 text-green-600" />
      case 'project':
        return <TrendingUp className="w-5 h-5 text-purple-600" />
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cost Centers</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage cost centers for multi-dimensional financial tracking
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            Add Cost Center
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost Centers</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{costCenters.length}</p>
                <p className="text-xs text-gray-500 mt-1">{activeCostCenters} active</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filling Stations</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{fillingStations}</p>
                <p className="text-xs text-gray-500 mt-1">Primary locations</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <Building2 className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{projects}</p>
                <p className="text-xs text-gray-500 mt-1">Active projects</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalBudget)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Annual budget</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="filling-station">Filling Stations</option>
              <option value="department">Departments</option>
              <option value="project">Projects</option>
              <option value="other">Other</option>
            </select>
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredCostCenters.length} of {costCenters.length} cost centers
            </div>
          </div>
        </div>

        {/* Cost Centers Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCostCenters.map(cc => (
            <div key={cc.id} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(cc.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cc.name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{cc.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cc.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <button className="p-1 text-gray-600 hover:text-gray-900">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{cc.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  {getTypeBadge(cc.type)}
                </div>

                {cc.budget && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Annual Budget</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(cc.budget)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Manager</span>
                  <span className="text-sm text-gray-900">
                    {cc.managerId ? `User ${cc.managerId}` : 'Unassigned'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${cc.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                    {cc.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg"
                  style={{ backgroundColor: '#8B1538' }}
                >
                  View Financial Performance
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">What are Cost Centers?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Cost centers allow you to track revenues, expenses, and profitability for different parts of your business.
                Tag transactions to filling stations, departments, or projects to analyze performance and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
