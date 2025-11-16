'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Download, Filter, FileText, BarChart3, TrendingUp, TrendingDown, DollarSign, Calculator, PieChart, Activity, CreditCard, Banknote, Target, AlertTriangle } from 'lucide-react'

interface FinancialReports {
  profitLoss: {
    period: string
    revenue: number
    costOfGoodsSold: number
    grossProfit: number
    operatingExpenses: number
    operatingIncome: number
    netIncome: number
    margins: {
      gross: number
      operating: number
      net: number
    }
  }
  balanceSheet: {
    assets: {
      currentAssets: number
      fixedAssets: number
      totalAssets: number
    }
    liabilities: {
      currentLiabilities: number
      longTermLiabilities: number
      totalLiabilities: number
    }
    equity: number
  }
  cashFlow: {
    operatingCashFlow: number
    investingCashFlow: number
    financingCashFlow: number
    netCashFlow: number
    cashAtBeginning: number
    cashAtEnd: number
  }
  kpis: {
    roi: number
    roa: number
    currentRatio: number
    quickRatio: number
    debtToEquity: number
    assetTurnover: number
    receivablesTurnover: number
    inventoryTurnover: number
  }
  monthlyTrends: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
    cashFlow: number
  }>
  departmentProfitability: Array<{
    department: string
    revenue: number
    expenses: number
    profit: number
    margin: number
  }>
  productProfitability: Array<{
    product: string
    revenue: number
    cost: number
    profit: number
    margin: number
    volume: number
  }>
}

const mockFinancialData: FinancialReports = {
  profitLoss: {
    period: 'Year to Date 2024',
    revenue: 12450000000,
    costOfGoodsSold: 8750000000,
    grossProfit: 3700000000,
    operatingExpenses: 1850000000,
    operatingIncome: 1850000000,
    netIncome: 1650000000,
    margins: {
      gross: 29.7,
      operating: 14.9,
      net: 13.3
    }
  },
  balanceSheet: {
    assets: {
      currentAssets: 5650000000,
      fixedAssets: 8450000000,
      totalAssets: 14100000000
    },
    liabilities: {
      currentLiabilities: 2350000000,
      longTermLiabilities: 4250000000,
      totalLiabilities: 6600000000
    },
    equity: 7500000000
  },
  cashFlow: {
    operatingCashFlow: 2450000000,
    investingCashFlow: -850000000,
    financingCashFlow: -650000000,
    netCashFlow: 950000000,
    cashAtBeginning: 1800000000,
    cashAtEnd: 2750000000
  },
  kpis: {
    roi: 22.0,
    roa: 11.7,
    currentRatio: 2.4,
    quickRatio: 1.8,
    debtToEquity: 0.88,
    assetTurnover: 0.88,
    receivablesTurnover: 9.5,
    inventoryTurnover: 8.2
  },
  monthlyTrends: [
    { month: 'Jan 2024', revenue: 980000000, expenses: 720000000, profit: 260000000, cashFlow: 185000000 },
    { month: 'Feb 2024', revenue: 1120000000, expenses: 810000000, profit: 310000000, cashFlow: 225000000 },
    { month: 'Mar 2024', revenue: 1050000000, expenses: 780000000, profit: 270000000, cashFlow: 195000000 },
    { month: 'Apr 2024', revenue: 1180000000, expenses: 850000000, profit: 330000000, cashFlow: 245000000 },
    { month: 'May 2024', revenue: 1090000000, expenses: 800000000, profit: 290000000, cashFlow: 210000000 },
    { month: 'Jun 2024', revenue: 1250000000, expenses: 900000000, profit: 350000000, cashFlow: 285000000 },
    { month: 'Jul 2024', revenue: 1150000000, expenses: 840000000, profit: 310000000, cashFlow: 230000000 },
    { month: 'Aug 2024', revenue: 1280000000, expenses: 920000000, profit: 360000000, cashFlow: 290000000 },
    { month: 'Sep 2024', revenue: 1190000000, expenses: 870000000, profit: 320000000, cashFlow: 245000000 },
    { month: 'Oct 2024', revenue: 1340000000, expenses: 960000000, profit: 380000000, cashFlow: 315000000 },
    { month: 'Nov 2024', revenue: 1230000000, expenses: 890000000, profit: 340000000, cashFlow: 270000000 }
  ],
  departmentProfitability: [
    { department: 'Operations', revenue: 4850000000, expenses: 3450000000, profit: 1400000000, margin: 28.9 },
    { department: 'Sales', revenue: 3650000000, expenses: 2890000000, profit: 760000000, margin: 20.8 },
    { department: 'Trading', revenue: 2340000000, expenses: 1980000000, profit: 360000000, margin: 15.4 },
    { department: 'Retail', revenue: 1610000000, expenses: 1250000000, profit: 360000000, margin: 22.4 }
  ],
  productProfitability: [
    { product: 'Premium Motor Spirit (PMS)', revenue: 4850000000, cost: 3450000000, profit: 1400000000, margin: 28.9, volume: 6500000 },
    { product: 'Automotive Gas Oil (AGO)', revenue: 3650000000, cost: 2750000000, profit: 900000000, margin: 24.7, volume: 4200000 },
    { product: 'LPG Cylinders', revenue: 1850000000, cost: 1450000000, profit: 400000000, margin: 21.6, volume: 125000 },
    { product: 'Dual Purpose Kerosene (DPK)', revenue: 1450000000, cost: 1150000000, profit: 300000000, margin: 20.7, volume: 1800000 },
    { product: 'Lubricants & Oils', revenue: 650000000, cost: 480000000, profit: 170000000, margin: 26.2, volume: 85000 }
  ]
}

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('ytd')
  const [selectedView, setSelectedView] = useState('summary')
  const [data] = useState<FinancialReports>(mockFinancialData)

  const periodOptions = [
    { value: 'mtd', label: 'Month to Date' },
    { value: 'qtd', label: 'Quarter to Date' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const viewOptions = [
    { value: 'summary', label: 'Financial Summary' },
    { value: 'detailed', label: 'Detailed Analysis' },
    { value: 'trends', label: 'Trends & Forecasts' },
    { value: 'ratios', label: 'Financial Ratios' }
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`
    }
    return `₦${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      view: selectedView,
      data: data
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Financial Reports</h1>
            <p className="text-black">Comprehensive financial analysis and reporting</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
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

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Revenue</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(data.profitLoss.revenue)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +13.4% vs last period
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[#8B1538]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Net Profit</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(data.profitLoss.netIncome)}</p>
                <p className="text-sm text-black mt-1">
                  Margin: {formatPercentage(data.profitLoss.margins.net)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Operating Cash Flow</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(data.cashFlow.operatingCashFlow)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Strong cash position
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">ROI</p>
                <p className="text-2xl font-bold text-black">{formatPercentage(data.kpis.roi)}</p>
                <p className="text-sm text-green-600 mt-1">
                  Above industry average
                </p>
              </div>
              <Target className="h-8 w-8 text-[#E67E22]" />
            </div>
          </div>
        </div>

        {/* Profit & Loss Statement */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Profit & Loss Statement</h3>
            <p className="text-sm text-black">{data.profitLoss.period}</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-black mb-3">Revenue & Costs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-black">Total Revenue</span>
                      <span className="font-medium">{formatCurrency(data.profitLoss.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Cost of Goods Sold</span>
                      <span className="font-medium text-red-600">({formatCurrency(data.profitLoss.costOfGoodsSold)})</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-black">Gross Profit</span>
                      <span className="font-medium text-green-600">{formatCurrency(data.profitLoss.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Operating Expenses</span>
                      <span className="font-medium text-red-600">({formatCurrency(data.profitLoss.operatingExpenses)})</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-black">Net Income</span>
                      <span className="font-medium text-green-600">{formatCurrency(data.profitLoss.netIncome)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-3">Profit Margins</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Gross Margin', value: data.profitLoss.margins.gross, color: 'bg-blue-500' },
                      { label: 'Operating Margin', value: data.profitLoss.margins.operating, color: 'bg-purple-500' },
                      { label: 'Net Margin', value: data.profitLoss.margins.net, color: 'bg-green-500' }
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-black">{label}</span>
                          <span className="text-sm font-medium">{formatPercentage(value)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Sheet Summary */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">Balance Sheet Summary</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-black mb-3">Assets</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-black">Current Assets</span>
                      <span className="font-medium">{formatCurrency(data.balanceSheet.assets.currentAssets)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Fixed Assets</span>
                      <span className="font-medium">{formatCurrency(data.balanceSheet.assets.fixedAssets)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-black">Total Assets</span>
                      <span className="font-bold text-black">{formatCurrency(data.balanceSheet.assets.totalAssets)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-3">Liabilities & Equity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-black">Current Liabilities</span>
                      <span className="font-medium">{formatCurrency(data.balanceSheet.liabilities.currentLiabilities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Long-term Liabilities</span>
                      <span className="font-medium">{formatCurrency(data.balanceSheet.liabilities.longTermLiabilities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Total Equity</span>
                      <span className="font-medium">{formatCurrency(data.balanceSheet.equity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Statement */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">Cash Flow Statement</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black">Operating Activities</span>
                    <span className={`font-medium ${data.cashFlow.operatingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.cashFlow.operatingCashFlow)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Investing Activities</span>
                    <span className={`font-medium ${data.cashFlow.investingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.cashFlow.investingCashFlow)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Financing Activities</span>
                    <span className={`font-medium ${data.cashFlow.financingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.cashFlow.financingCashFlow)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-black">Net Cash Flow</span>
                    <span className={`font-bold ${data.cashFlow.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.cashFlow.netCashFlow)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Cash at End of Period</span>
                    <span className="text-lg font-bold text-black">{formatCurrency(data.cashFlow.cashAtEnd)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Ratios */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Key Financial Ratios</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Current Ratio', value: data.kpis.currentRatio, format: (v: number) => v.toFixed(2), benchmark: 2.0 },
                { label: 'Quick Ratio', value: data.kpis.quickRatio, format: (v: number) => v.toFixed(2), benchmark: 1.0 },
                { label: 'Debt to Equity', value: data.kpis.debtToEquity, format: (v: number) => v.toFixed(2), benchmark: 1.0 },
                { label: 'Asset Turnover', value: data.kpis.assetTurnover, format: (v: number) => v.toFixed(2), benchmark: 1.0 },
                { label: 'ROA (%)', value: data.kpis.roa, format: (v: number) => `${v.toFixed(1)}%`, benchmark: 10.0 },
                { label: 'Receivables Turnover', value: data.kpis.receivablesTurnover, format: (v: number) => v.toFixed(1), benchmark: 8.0 },
                { label: 'Inventory Turnover', value: data.kpis.inventoryTurnover, format: (v: number) => v.toFixed(1), benchmark: 6.0 },
                { label: 'ROI (%)', value: data.kpis.roi, format: (v: number) => `${v.toFixed(1)}%`, benchmark: 15.0 }
              ].map(({ label, value, format, benchmark }) => (
                <div key={label} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-black">{format(value)}</div>
                  <div className="text-sm text-black">{label}</div>
                  <div className={`text-xs mt-1 ${value >= benchmark ? 'text-green-600' : 'text-red-600'}`}>
                    {value >= benchmark ? '✓ Above benchmark' : '⚠ Below benchmark'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Monthly Financial Trends</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-6 gap-2">
              {data.monthlyTrends.slice(-6).map((month, index) => {
                const maxRevenue = Math.max(...data.monthlyTrends.map(m => m.revenue))
                const revenueHeight = (month.revenue / maxRevenue) * 100
                const maxProfit = Math.max(...data.monthlyTrends.map(m => m.profit))
                const profitHeight = (month.profit / maxProfit) * 100

                return (
                  <div key={month.month} className="text-center">
                    <div className="flex items-end justify-center h-24 mb-2 space-x-1">
                      <div
                        className="bg-[#8B1538] rounded-t"
                        style={{ height: `${revenueHeight}%`, width: '12px' }}
                        title={`Revenue: ${formatCurrency(month.revenue)}`}
                      ></div>
                      <div
                        className="bg-green-500 rounded-t"
                        style={{ height: `${profitHeight}%`, width: '12px' }}
                        title={`Profit: ${formatCurrency(month.profit)}`}
                      ></div>
                    </div>
                    <div className="text-xs text-black">{month.month.split(' ')[0]}</div>
                    <div className="text-xs font-medium">{formatCurrency(month.revenue)}</div>
                    <div className="text-xs text-green-600">{formatCurrency(month.profit)}</div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#8B1538] rounded"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Profit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Profitability Analysis */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Product Profitability Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Margin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Volume</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.productProfitability.map((product) => (
                  <tr key={product.product} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {product.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatCurrency(product.cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(product.profit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.margin >= 25 ? 'bg-green-100 text-green-800' : product.margin >= 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {formatPercentage(product.margin)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {product.volume.toLocaleString()}
                    </td>
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