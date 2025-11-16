'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, Users, Package, Truck, AlertTriangle, CheckCircle, BarChart3, PieChart, Activity, MapPin } from 'lucide-react'

interface BusinessMetrics {
  revenue: {
    current: number
    previous: number
    growth: number
    target: number
    monthly: Array<{ month: string; amount: number }>
  }
  sales: {
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    cancelledOrders: number
    averageOrderValue: number
    topProducts: Array<{ product: string; sales: number; revenue: number }>
  }
  inventory: {
    totalValue: number
    lowStockItems: number
    stockTurnover: number
    criticalStock: Array<{ product: string; currentStock: number; minStock: number; location: string }>
  }
  customers: {
    totalCustomers: number
    activeCustomers: number
    newCustomers: number
    customerRetention: number
    topCustomers: Array<{ name: string; revenue: number; orders: number }>
  }
  fleet: {
    totalVehicles: number
    activeVehicles: number
    maintenanceAlerts: number
    fuelEfficiency: number
    utilizationRate: number
  }
  hr: {
    totalEmployees: number
    activeEmployees: number
    onLeave: number
    vacancyRate: number
    averageSalary: number
    departmentDistribution: Array<{ department: string; count: number }>
  }
  financial: {
    grossProfit: number
    netProfit: number
    expenses: number
    cashFlow: number
    profitMargin: number
    accountsReceivable: number
    accountsPayable: number
  }
  operations: {
    deliveryPerformance: number
    safetyIncidents: number
    productionEfficiency: number
    qualityScore: number
    environmentalCompliance: number
  }
  regional: Array<{
    region: string
    revenue: number
    customers: number
    growth: number
    performance: number
  }>
}

const mockBusinessMetrics: BusinessMetrics = {
  revenue: {
    current: 12450000000,
    previous: 10980000000,
    growth: 13.4,
    target: 15000000000,
    monthly: [
      { month: 'Jan 2024', amount: 980000000 },
      { month: 'Feb 2024', amount: 1120000000 },
      { month: 'Mar 2024', amount: 1050000000 },
      { month: 'Apr 2024', amount: 1180000000 },
      { month: 'May 2024', amount: 1090000000 },
      { month: 'Jun 2024', amount: 1250000000 },
      { month: 'Jul 2024', amount: 1150000000 },
      { month: 'Aug 2024', amount: 1280000000 },
      { month: 'Sep 2024', amount: 1190000000 },
      { month: 'Oct 2024', amount: 1340000000 },
      { month: 'Nov 2024', amount: 1230000000 }
    ]
  },
  sales: {
    totalOrders: 2847,
    completedOrders: 2456,
    pendingOrders: 234,
    cancelledOrders: 157,
    averageOrderValue: 4375000,
    topProducts: [
      { product: 'Premium Motor Spirit (PMS)', sales: 1876, revenue: 4850000000 },
      { product: 'Automotive Gas Oil (AGO)', sales: 1345, revenue: 3650000000 },
      { product: 'LPG Cylinders', sales: 987, revenue: 1850000000 },
      { product: 'Dual Purpose Kerosene (DPK)', sales: 876, revenue: 1450000000 },
      { product: 'Engine Oils & Lubricants', sales: 654, revenue: 650000000 }
    ]
  },
  inventory: {
    totalValue: 8750000000,
    lowStockItems: 23,
    stockTurnover: 8.5,
    criticalStock: [
      { product: 'Premium Motor Spirit (PMS)', currentStock: 15000, minStock: 20000, location: 'Lagos Main Depot' },
      { product: 'Engine Oil SAE 40', currentStock: 450, minStock: 500, location: 'Abuja Depot' },
      { product: 'LPG 12.5kg Cylinders', currentStock: 180, minStock: 200, location: 'Port Harcourt Depot' },
      { product: 'Brake Fluid DOT 4', currentStock: 75, minStock: 100, location: 'Kano Distribution Center' }
    ]
  },
  customers: {
    totalCustomers: 1847,
    activeCustomers: 1456,
    newCustomers: 23,
    customerRetention: 87.5,
    topCustomers: [
      { name: 'Dangote Industries Limited', revenue: 3850000000, orders: 234 },
      { name: 'Shell Nigeria Limited', revenue: 2450000000, orders: 156 },
      { name: 'Federal Ministry of Transportation', revenue: 1250000000, orders: 89 },
      { name: 'First Bank of Nigeria', revenue: 850000000, orders: 45 },
      { name: 'Coscharis Motors', revenue: 450000000, orders: 78 }
    ]
  },
  fleet: {
    totalVehicles: 156,
    activeVehicles: 142,
    maintenanceAlerts: 8,
    fuelEfficiency: 8.5,
    utilizationRate: 91.0
  },
  hr: {
    totalEmployees: 247,
    activeEmployees: 231,
    onLeave: 12,
    vacancyRate: 6.5,
    averageSalary: 1250000,
    departmentDistribution: [
      { department: 'Operations', count: 89 },
      { department: 'Logistics', count: 67 },
      { department: 'Sales', count: 34 },
      { department: 'Finance', count: 23 },
      { department: 'HR', count: 15 },
      { department: 'Maintenance', count: 12 },
      { department: 'Executive', count: 7 }
    ]
  },
  financial: {
    grossProfit: 3650000000,
    netProfit: 1850000000,
    expenses: 1800000000,
    cashFlow: 2450000000,
    profitMargin: 14.9,
    accountsReceivable: 1250000000,
    accountsPayable: 980000000
  },
  operations: {
    deliveryPerformance: 94.5,
    safetyIncidents: 2,
    productionEfficiency: 87.8,
    qualityScore: 96.2,
    environmentalCompliance: 98.7
  },
  regional: [
    { region: 'South West', revenue: 4850000000, customers: 654, growth: 15.2, performance: 92.5 },
    { region: 'North Central', revenue: 2650000000, customers: 412, growth: 12.8, performance: 89.3 },
    { region: 'North West', revenue: 2340000000, customers: 387, growth: 8.9, performance: 85.7 },
    { region: 'South East', revenue: 1450000000, customers: 234, growth: 18.3, performance: 94.1 },
    { region: 'South South', revenue: 780000000, customers: 98, growth: 22.1, performance: 91.8 },
    { region: 'North East', revenue: 375000000, customers: 62, growth: 6.4, performance: 82.3 }
  ]
}

export default function ReportsDashboardPage() {
  const [metrics] = useState<BusinessMetrics>(mockBusinessMetrics)
  const [selectedPeriod, setSelectedPeriod] = useState('ytd')
  const [selectedView, setSelectedView] = useState('overview')

  const periodOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: '1year', label: 'Last Year' }
  ]

  const viewOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'financial', label: 'Financial' },
    { value: 'operations', label: 'Operations' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' }
  ]

  const exportDashboard = () => {
    const dashboardData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      view: selectedView,
      metrics: metrics
    }

    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`
    }
    return `₦${amount.toLocaleString()}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Business Intelligence Dashboard</h1>
            <p className="text-black">Comprehensive business analytics and performance insights</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportDashboard}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <select
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
            >
              {viewOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Revenue</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(metrics.revenue.current)}</p>
                <p className={`text-sm mt-1 flex items-center ${metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.revenue.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(metrics.revenue.growth)}% vs last period
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[#8B1538]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Net Profit</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(metrics.financial.netProfit)}</p>
                <p className="text-sm text-black mt-1">
                  Margin: {metrics.financial.profitMargin}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active Customers</p>
                <p className="text-2xl font-bold text-black">{metrics.customers.activeCustomers.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">
                  +{metrics.customers.newCustomers} new this month
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Inventory Value</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(metrics.inventory.totalValue)}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {metrics.inventory.lowStockItems} low stock items
                </p>
              </div>
              <Package className="h-8 w-8 text-[#E67E22]" />
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Target: {formatCurrency(metrics.revenue.target)}</span>
              <span>Achievement: {((metrics.revenue.current / metrics.revenue.target) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#8B1538] to-[#E67E22] h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((metrics.revenue.current / metrics.revenue.target) * 100, 100)}%` }}
              ></div>
            </div>
            {/* Monthly Revenue Chart */}
            <div className="grid grid-cols-6 gap-2 mt-6">
              {metrics.revenue.monthly.slice(-6).map((month, index) => {
                const maxRevenue = Math.max(...metrics.revenue.monthly.map(m => m.amount))
                const height = (month.amount / maxRevenue) * 100
                return (
                  <div key={month.month} className="text-center">
                    <div className="flex items-end justify-center h-20 mb-2">
                      <div
                        className="bg-[#8B1538] rounded-t transition-all duration-500"
                        style={{ height: `${height}%`, width: '20px' }}
                      ></div>
                    </div>
                    <div className="text-xs text-black">{month.month.split(' ')[0]}</div>
                    <div className="text-xs font-medium">{formatCurrency(month.amount)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Top Selling Products</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {metrics.sales.topProducts.map((product, index) => (
                <div key={product.product} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#8B1538] rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">{product.product}</div>
                      <div className="text-xs text-black">{product.sales} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-black">{formatCurrency(product.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Stock Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Critical Stock Alerts</h3>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-4">
              {metrics.inventory.criticalStock.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-black">{item.product}</div>
                    <div className="text-xs text-black">{item.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">{item.currentStock.toLocaleString()}</div>
                    <div className="text-xs text-black">Min: {item.minStock.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Regional Performance</h3>
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.regional.map((region) => (
              <div key={region.region} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-black">{region.region}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${region.performance >= 90 ? 'bg-green-100 text-green-800' : region.performance >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {region.performance}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Revenue:</span>
                    <span className="font-medium">{formatCurrency(region.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Customers:</span>
                    <span className="font-medium">{region.customers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Growth:</span>
                    <span className={`font-medium ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {region.growth >= 0 ? '+' : ''}{region.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operational Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Operational Excellence</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">Delivery Performance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${metrics.operations.deliveryPerformance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.operations.deliveryPerformance}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">Quality Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${metrics.operations.qualityScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.operations.qualityScore}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">Production Efficiency</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${metrics.operations.productionEfficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.operations.productionEfficiency}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">Environmental Compliance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${metrics.operations.environmentalCompliance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.operations.environmentalCompliance}%</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-800">Safety Incidents: {metrics.operations.safetyIncidents} this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* HR Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Human Resources</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{metrics.hr.activeEmployees}</div>
                  <div className="text-sm text-black">Active Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{metrics.hr.onLeave}</div>
                  <div className="text-sm text-black">On Leave</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black">Average Salary:</span>
                  <span className="font-medium">{formatCurrency(metrics.hr.averageSalary)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Vacancy Rate:</span>
                  <span className="font-medium">{metrics.hr.vacancyRate}%</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-black mb-2">Department Distribution</h4>
                <div className="space-y-1">
                  {metrics.hr.departmentDistribution.slice(0, 4).map((dept) => (
                    <div key={dept.department} className="flex justify-between text-xs">
                      <span className="text-black">{dept.department}:</span>
                      <span className="font-medium">{dept.count} employees</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Management Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Fleet Management</h3>
            <Truck className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{metrics.fleet.activeVehicles}</div>
              <div className="text-sm text-black">Active Vehicles</div>
              <div className="text-xs text-black">of {metrics.fleet.totalVehicles} total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E67E22]">{metrics.fleet.maintenanceAlerts}</div>
              <div className="text-sm text-black">Maintenance Alerts</div>
              <div className="text-xs text-red-500">Requires attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.fleet.fuelEfficiency}</div>
              <div className="text-sm text-black">Fuel Efficiency</div>
              <div className="text-xs text-black">km/liter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.fleet.utilizationRate}%</div>
              <div className="text-sm text-black">Utilization Rate</div>
              <div className="text-xs text-black">Above target</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}