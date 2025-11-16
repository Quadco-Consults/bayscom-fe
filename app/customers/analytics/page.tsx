'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, TrendingUp, TrendingDown, Users, DollarSign, Package, BarChart3, PieChart, MapPin, Star, Filter, Download } from 'lucide-react'

interface CustomerAnalytics {
  overview: {
    totalCustomers: number
    activeCustomers: number
    newCustomersThisMonth: number
    customerRetentionRate: number
    averageOrderValue: number
    totalRevenue: number
    customerLifetimeValue: number
  }
  salesByRegion: Array<{
    region: string
    customers: number
    revenue: number
    orders: number
    percentage: number
  }>
  topCustomers: Array<{
    id: string
    name: string
    code: string
    revenue: number
    orders: number
    lastOrderDate: string
    rating: number
  }>
  customerSegments: Array<{
    segment: string
    count: number
    revenue: number
    percentage: number
    color: string
  }>
  salesTrends: Array<{
    month: string
    newCustomers: number
    revenue: number
    orders: number
    averageOrderValue: number
  }>
  productPerformance: Array<{
    product: string
    customers: number
    revenue: number
    orders: number
    popularity: number
  }>
  paymentAnalysis: {
    onTime: number
    late: number
    overdue: number
    averagePaymentDays: number
  }
}

const mockAnalytics: CustomerAnalytics = {
  overview: {
    totalCustomers: 1847,
    activeCustomers: 1456,
    newCustomersThisMonth: 23,
    customerRetentionRate: 87.5,
    averageOrderValue: 2850000,
    totalRevenue: 12450000000,
    customerLifetimeValue: 8750000
  },
  salesByRegion: [
    { region: 'South West', customers: 654, revenue: 4850000000, orders: 1832, percentage: 38.9 },
    { region: 'North Central', customers: 412, revenue: 2650000000, orders: 1124, percentage: 21.3 },
    { region: 'North West', customers: 387, revenue: 2340000000, orders: 987, percentage: 18.8 },
    { region: 'South East', customers: 234, revenue: 1450000000, orders: 634, percentage: 11.6 },
    { region: 'South South', customers: 98, revenue: 780000000, orders: 412, percentage: 6.3 },
    { region: 'North East', customers: 62, revenue: 375000000, orders: 234, percentage: 3.0 }
  ],
  topCustomers: [
    {
      id: 'CUST003',
      name: 'Dangote Industries Limited',
      code: 'BC-003',
      revenue: 3850000000,
      orders: 234,
      lastOrderDate: '2024-11-13',
      rating: 5
    },
    {
      id: 'CUST001',
      name: 'Shell Nigeria Limited',
      code: 'BC-001',
      revenue: 2450000000,
      orders: 156,
      lastOrderDate: '2024-11-14',
      rating: 5
    },
    {
      id: 'CUST002',
      name: 'Federal Ministry of Transportation',
      code: 'BC-002',
      revenue: 1250000000,
      orders: 89,
      lastOrderDate: '2024-11-15',
      rating: 4
    },
    {
      id: 'CUST005',
      name: 'First Bank of Nigeria',
      code: 'BC-005',
      revenue: 850000000,
      orders: 45,
      lastOrderDate: '2024-11-10',
      rating: 5
    },
    {
      id: 'CUST004',
      name: 'Coscharis Motors',
      code: 'BC-004',
      revenue: 450000000,
      orders: 78,
      lastOrderDate: '2024-11-12',
      rating: 4
    }
  ],
  customerSegments: [
    { segment: 'Industrial', count: 287, revenue: 5650000000, percentage: 45.4, color: 'bg-orange-500' },
    { segment: 'Wholesale', count: 523, revenue: 3850000000, percentage: 30.9, color: 'bg-purple-500' },
    { segment: 'Government', count: 156, revenue: 1950000000, percentage: 15.7, color: 'bg-green-500' },
    { segment: 'Retail', count: 881, revenue: 995000000, percentage: 8.0, color: 'bg-blue-500' }
  ],
  salesTrends: [
    { month: 'May 2024', newCustomers: 18, revenue: 980000000, orders: 234, averageOrderValue: 4188000 },
    { month: 'Jun 2024', newCustomers: 22, revenue: 1120000000, orders: 267, averageOrderValue: 4194000 },
    { month: 'Jul 2024', newCustomers: 19, revenue: 1050000000, orders: 245, averageOrderValue: 4286000 },
    { month: 'Aug 2024', newCustomers: 25, revenue: 1180000000, orders: 278, averageOrderValue: 4244000 },
    { month: 'Sep 2024', newCustomers: 21, revenue: 1090000000, orders: 252, averageOrderValue: 4325000 },
    { month: 'Oct 2024', newCustomers: 27, revenue: 1250000000, orders: 289, averageOrderValue: 4326000 },
    { month: 'Nov 2024', newCustomers: 23, revenue: 1150000000, orders: 267, averageOrderValue: 4307000 }
  ],
  productPerformance: [
    { product: 'Premium Motor Spirit (PMS)', customers: 1245, revenue: 4850000000, orders: 1876, popularity: 67.4 },
    { product: 'Automotive Gas Oil (AGO)', customers: 987, revenue: 3650000000, orders: 1345, popularity: 53.4 },
    { product: 'LPG Cylinders', customers: 654, revenue: 1850000000, orders: 987, popularity: 35.4 },
    { product: 'Dual Purpose Kerosene (DPK)', customers: 567, revenue: 1450000000, orders: 876, popularity: 30.7 },
    { product: 'Engine Oils & Lubricants', customers: 456, revenue: 650000000, orders: 654, popularity: 24.7 },
    { product: 'Industrial Oils', customers: 234, revenue: 495000000, orders: 345, popularity: 12.7 }
  ],
  paymentAnalysis: {
    onTime: 78.5,
    late: 16.2,
    overdue: 5.3,
    averagePaymentDays: 32.7
  }
}

export default function CustomerAnalyticsPage() {
  const [analytics] = useState<CustomerAnalytics>(mockAnalytics)
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedSegment, setSelectedSegment] = useState('all')

  const periodOptions = [
    { value: '1month', label: 'Last 1 Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last 1 Year' },
    { value: 'ytd', label: 'Year to Date' }
  ]

  const segmentOptions = [
    { value: 'all', label: 'All Segments' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'government', label: 'Government' },
    { value: 'retail', label: 'Retail' }
  ]

  const exportAnalytics = () => {
    const data = {
      overview: analytics.overview,
      salesByRegion: analytics.salesByRegion,
      topCustomers: analytics.topCustomers,
      customerSegments: analytics.customerSegments,
      generatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer-analytics.json'
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Customer Analytics</h1>
            <p className="text-black">Insights into customer behavior and sales performance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportAnalytics}
              className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <div className="flex space-x-2">
              <select
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
              >
                {segmentOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Customers</p>
                <p className="text-2xl font-bold text-black">{analytics.overview.totalCustomers.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +{analytics.overview.newCustomersThisMonth} this month
                </p>
              </div>
              <Users className="h-8 w-8 text-[#8B1538]" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active Customers</p>
                <p className="text-2xl font-bold text-black">{analytics.overview.activeCustomers.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {analytics.overview.customerRetentionRate}% retention rate
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Revenue</p>
                <p className="text-2xl font-bold text-black">₦{(analytics.overview.totalRevenue / 1000000000).toFixed(1)}B</p>
                <p className="text-sm text-black mt-1">
                  CLV: ₦{(analytics.overview.customerLifetimeValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Avg Order Value</p>
                <p className="text-2xl font-bold text-black">₦{(analytics.overview.averageOrderValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +8.2% vs last month
                </p>
              </div>
              <Package className="h-8 w-8 text-[#E67E22]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Region */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Sales by Region</h3>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.salesByRegion.map((region) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-black">{region.region}</span>
                      <span className="text-sm text-black">₦{(region.revenue / 1000000000).toFixed(1)}B</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#8B1538] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-black mt-1">
                      <span>{region.customers} customers</span>
                      <span>{region.orders} orders</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Customer Segments</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.customerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${segment.color}`}></div>
                    <span className="text-sm font-medium text-black">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-black">₦{(segment.revenue / 1000000000).toFixed(1)}B</div>
                    <div className="text-xs text-black">{segment.count} customers ({segment.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Top Performing Customers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Avg Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Last Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topCustomers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-[#8B1538] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">#{index + 1}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">{customer.name}</div>
                          <div className="text-sm text-black">{customer.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      ₦{(customer.revenue / 1000000000).toFixed(2)}B
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      ₦{((customer.revenue / customer.orders) / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {customer.lastOrderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < customer.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-black">({customer.rating})</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Product Performance</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.productPerformance.map((product) => (
                <div key={product.product} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black">{product.product}</span>
                    <span className="text-sm text-black">{product.popularity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#8B1538] to-[#E67E22] h-2 rounded-full"
                      style={{ width: `${product.popularity}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-black">
                    <span>{product.customers} customers</span>
                    <span>₦{(product.revenue / 1000000000).toFixed(1)}B revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Payment Analysis</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">{analytics.paymentAnalysis.averagePaymentDays}</div>
                <div className="text-sm text-black">Average Payment Days</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-black">On Time</span>
                  </div>
                  <span className="text-sm font-medium text-black">{analytics.paymentAnalysis.onTime}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analytics.paymentAnalysis.onTime}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-black">Late</span>
                  </div>
                  <span className="text-sm font-medium text-black">{analytics.paymentAnalysis.late}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${analytics.paymentAnalysis.late}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-black">Overdue</span>
                  </div>
                  <span className="text-sm font-medium text-black">{analytics.paymentAnalysis.overdue}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${analytics.paymentAnalysis.overdue}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Sales Trends</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-black">Month</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-black">New Customers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-black">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-black">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-black">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {analytics.salesTrends.map((trend, index) => (
                  <tr key={trend.month} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-black">{trend.month}</td>
                    <td className="py-3 px-4 text-sm text-black">{trend.newCustomers}</td>
                    <td className="py-3 px-4 text-sm text-black">₦{(trend.revenue / 1000000000).toFixed(2)}B</td>
                    <td className="py-3 px-4 text-sm text-black">{trend.orders}</td>
                    <td className="py-3 px-4 text-sm text-black">₦{(trend.averageOrderValue / 1000000).toFixed(1)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}