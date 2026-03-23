'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, Truck, Clock, CheckCircle, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { Project } from '@/lib/types'

const mockProjects: Project[] = [
  {
    id: '1',
    code: 'PRJ-TRK-001',
    name: 'Mercedes Actros FT-001-NG Operations',
    description: 'Fuel haulage operations for Mercedes Actros truck',
    type: 'truck-operation',
    status: 'active',
    startDate: '2023-01-15',
    budget: 85000000,
    actualCost: 73650000,
    projectManagerId: 'user-1',
    createdAt: '2023-01-15',
    updatedAt: '2025-03-22',
  },
  {
    id: '2',
    code: 'PRJ-TRK-002',
    name: 'Volvo FH16 FT-002-NG Operations',
    description: 'Fuel haulage operations for Volvo FH16 truck',
    type: 'truck-operation',
    status: 'active',
    startDate: '2023-06-20',
    budget: 95000000,
    actualCost: 83000000,
    projectManagerId: 'user-1',
    createdAt: '2023-06-20',
    updatedAt: '2025-03-22',
  },
  {
    id: '3',
    code: 'PRJ-TRK-003',
    name: 'Scania R500 FT-003-NG Operations',
    description: 'Fuel haulage operations for Scania R500 truck',
    type: 'truck-operation',
    status: 'active',
    startDate: '2024-11-01',
    budget: 92000000,
    actualCost: 89500000,
    projectManagerId: 'user-1',
    createdAt: '2024-11-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '4',
    code: 'PRJ-EXP-001',
    name: 'Kaduna Branch Expansion',
    description: 'New filling station construction in Kaduna',
    type: 'expansion',
    status: 'active',
    startDate: '2025-01-10',
    endDate: '2025-09-30',
    budget: 45000000,
    actualCost: 12000000,
    projectManagerId: 'user-2',
    createdAt: '2025-01-10',
    updatedAt: '2025-03-22',
  },
  {
    id: '5',
    code: 'PRJ-MAINT-001',
    name: 'Q1 2025 Equipment Maintenance',
    description: 'Quarterly maintenance for all pumps and tanks',
    type: 'maintenance',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    budget: 8000000,
    actualCost: 7500000,
    projectManagerId: 'user-3',
    createdAt: '2025-01-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '6',
    code: 'PRJ-EXP-002',
    name: 'Enugu Market Entry',
    description: 'New market expansion into Enugu state',
    type: 'expansion',
    status: 'planning',
    startDate: '2025-06-01',
    endDate: '2026-03-31',
    budget: 65000000,
    actualCost: 0,
    projectManagerId: 'user-2',
    createdAt: '2025-02-15',
    updatedAt: '2025-03-22',
  },
]

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(mockProjects)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    const matchesType = typeFilter === 'all' || p.type === typeFilter
    return matchesStatus && matchesType
  })

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      planning: 'bg-gray-50 text-gray-700 border-gray-200',
      active: 'bg-green-50 text-green-700 border-green-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      'on-hold': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    }

    const icons = {
      planning: <Clock className="w-3 h-3" />,
      active: <TrendingUp className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      'on-hold': <Clock className="w-3 h-3" />,
      cancelled: <Clock className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const styles = {
      'truck-operation': 'bg-purple-100 text-purple-800',
      'expansion': 'bg-blue-100 text-blue-800',
      'maintenance': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800',
    }

    const labels = {
      'truck-operation': 'Truck Operation',
      'expansion': 'Expansion',
      'maintenance': 'Maintenance',
      'other': 'Other',
    }

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    )
  }

  const getBudgetUtilization = (budget: number, actual: number) => {
    const percentage = (actual / budget) * 100
    return percentage.toFixed(1)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track project costs, budgets, and performance
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{activeProjects}</p>
                <p className="text-xs text-gray-500 mt-1">{completedProjects} completed</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
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
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actual Costs</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalActualCost)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {getBudgetUtilization(totalBudget, totalActualCost)}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="truck-operation">Truck Operations</option>
              <option value="expansion">Expansion</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <div key={project.id} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Truck className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {getTypeBadge(project.type)}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{project.code}</p>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                </div>
                {getStatusBadge(project.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(project.startDate)}</p>
                </div>
                {project.endDate && (
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(project.endDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Actual Cost</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(project.actualCost)}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Budget Utilization</span>
                  <span className="font-medium text-gray-900">
                    {getBudgetUtilization(project.budget, project.actualCost)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(parseFloat(getBudgetUtilization(project.budget, project.actualCost)), 100)}%`,
                      backgroundColor: parseFloat(getBudgetUtilization(project.budget, project.actualCost)) > 100 ? '#EF4444' : '#8B1538',
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg"
                  style={{ backgroundColor: '#8B1538' }}
                >
                  View Details
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Financial Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
