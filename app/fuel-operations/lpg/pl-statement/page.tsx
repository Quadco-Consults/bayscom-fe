'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MonthScopeBar } from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { TrendingUp, TrendingDown, Download, Printer, DollarSign } from 'lucide-react'
import { formatNGN } from '@/utils/fuel-format'

interface PLData {
  // Revenue
  lpgSalesRevenue: number
  accessorySalesRevenue: number

  // Cost of Goods Sold
  lpgPurchaseCost: number
  cylinderPurchaseCost: number
  accessoryPurchaseCost: number

  // Operating Expenses
  salaries: number
  transport: number
  utilities: number
  maintenance: number
  supplies: number
  security: number
  miscExpenses: number
}

/**
 * LPG Section - P&L Statement Page
 *
 * Demonstrates:
 * - Revenue calculation (LPG + accessories)
 * - Cost of Goods Sold tracking
 * - Gross Profit calculation
 * - Operating Expenses breakdown
 * - Net Profit/Loss calculation
 * - Financial performance metrics
 */
export default function LPGPLStatementPage() {
  const { config, getStation, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [plData, setPlData] = useState<PLData | null>(null)
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Load P&L data for the month
  useEffect(() => {
    setLoading(true)

    // Sample data (in production, this would aggregate from all modules)
    const data: PLData = {
      // Revenue (from Daily Sales page)
      lpgSalesRevenue: 4850000, // 7250kg * ₦670/kg
      accessorySalesRevenue: 1245000, // Cylinders + regulators + hoses

      // Cost of Goods Sold (from Purchases page)
      lpgPurchaseCost: 6825000, // 10500kg * ₦650/kg
      cylinderPurchaseCost: 549000, // Various cylinder purchases
      accessoryPurchaseCost: 168600, // Regulators and hoses

      // Operating Expenses (from Expenses page)
      salaries: 465000,
      transport: 68500,
      utilities: 125000,
      maintenance: 85000,
      supplies: 45000,
      security: 93000,
      miscExpenses: 28500,
    }

    setPlData(data)
    setLoading(false)
  }, [stationId, month, year])

  // Calculate P&L metrics
  const plMetrics = useMemo(() => {
    if (!plData) return null

    // Revenue
    const totalRevenue = plData.lpgSalesRevenue + plData.accessorySalesRevenue

    // Cost of Goods Sold
    const totalCOGS =
      plData.lpgPurchaseCost + plData.cylinderPurchaseCost + plData.accessoryPurchaseCost

    // Gross Profit
    const grossProfit = totalRevenue - totalCOGS
    const grossProfitMargin = (grossProfit / totalRevenue) * 100

    // Operating Expenses
    const totalOpEx =
      plData.salaries +
      plData.transport +
      plData.utilities +
      plData.maintenance +
      plData.supplies +
      plData.security +
      plData.miscExpenses

    // Net Profit
    const netProfit = grossProfit - totalOpEx
    const netProfitMargin = (netProfit / totalRevenue) * 100

    return {
      totalRevenue,
      totalCOGS,
      grossProfit,
      grossProfitMargin,
      totalOpEx,
      netProfit,
      netProfitMargin,
      isProfit: netProfit > 0,
    }
  }, [plData])

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  if (loading || !plData || !plMetrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading P&L statement...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Month Scope Bar */}
        <MonthScopeBar
          stationId={stationId}
          month={month}
          year={year}
          isLocked={isLocked}
          stations={lpgStations}
          onStationChange={setStation}
          onMonthChange={(m, y) => setMonthYear(m, y)}
          showLockToggle={false}
          actions={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          }
        />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">P&L Statement</h1>
              <p className="text-sm text-gray-500">
                Profit & Loss statement for{' '}
                {new Intl.DateTimeFormat('en-NG', { month: 'long', year: 'numeric' }).format(
                  new Date(year, month - 1, 1)
                )}
              </p>
            </div>
          </div>

          {/* Net Profit Badge */}
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              plMetrics.isProfit ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {plMetrics.isProfit ? (
              <TrendingUp className="w-6 h-6 text-green-700" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-700" />
            )}
            <div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Net Profit</div>
              <div
                className={`text-2xl font-bold ${
                  plMetrics.isProfit ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {formatNGN(Math.abs(plMetrics.netProfit))}
              </div>
              <div className="text-xs text-gray-600">{plMetrics.netProfitMargin.toFixed(1)}% margin</div>
            </div>
          </div>
        </div>

        {/* P&L Statement Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Financial Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Complete income statement for the period</p>
          </div>

          <div className="divide-y divide-gray-200">
            {/* REVENUE SECTION */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Revenue
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">LPG Sales</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.lpgSalesRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Accessory Sales (Cylinders, Regulators, Hoses)</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.accessorySalesRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-3 mt-2">
                  <span className="text-base font-semibold text-gray-900">Total Revenue</span>
                  <span className="text-base font-bold text-green-700">
                    {formatNGN(plMetrics.totalRevenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* COST OF GOODS SOLD SECTION */}
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Cost of Goods Sold
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">LPG Purchases</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.lpgPurchaseCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Cylinder Purchases</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.cylinderPurchaseCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Accessory Purchases</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.accessoryPurchaseCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-300 pt-3 mt-2">
                  <span className="text-base font-semibold text-gray-900">Total COGS</span>
                  <span className="text-base font-bold text-red-700">
                    ({formatNGN(plMetrics.totalCOGS)})
                  </span>
                </div>
              </div>
            </div>

            {/* GROSS PROFIT */}
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-gray-900">Gross Profit</span>
                  <div className="text-xs text-gray-500">
                    {plMetrics.grossProfitMargin.toFixed(1)}% margin
                  </div>
                </div>
                <span
                  className={`text-lg font-bold ${
                    plMetrics.grossProfit > 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatNGN(plMetrics.grossProfit)}
                </span>
              </div>
            </div>

            {/* OPERATING EXPENSES SECTION */}
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Operating Expenses
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Salaries & Wages</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.salaries)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Transport & Logistics</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.transport)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Utilities</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.utilities)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Maintenance & Repairs</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.maintenance)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Supplies & Consumables</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.supplies)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Security</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.security)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">Miscellaneous</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNGN(plData.miscExpenses)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-300 pt-3 mt-2">
                  <span className="text-base font-semibold text-gray-900">Total Operating Expenses</span>
                  <span className="text-base font-bold text-red-700">
                    ({formatNGN(plMetrics.totalOpEx)})
                  </span>
                </div>
              </div>
            </div>

            {/* NET PROFIT */}
            <div className={`px-6 py-5 ${plMetrics.isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-gray-900">Net Profit (Loss)</span>
                  <div className="text-sm text-gray-600">
                    {plMetrics.netProfitMargin.toFixed(1)}% of revenue
                  </div>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    plMetrics.isProfit ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {plMetrics.isProfit ? '' : '('}
                  {formatNGN(Math.abs(plMetrics.netProfit))}
                  {plMetrics.isProfit ? '' : ')'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Gross Profit Margin</div>
            <div className="text-2xl font-bold text-gray-900">
              {plMetrics.grossProfitMargin.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Gross profit ÷ revenue</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Operating Expense Ratio</div>
            <div className="text-2xl font-bold text-gray-900">
              {((plMetrics.totalOpEx / plMetrics.totalRevenue) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">OpEx ÷ revenue</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Net Profit Margin</div>
            <div
              className={`text-2xl font-bold ${
                plMetrics.isProfit ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {plMetrics.netProfitMargin.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Net profit ÷ revenue</div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">P&L Statement Notes:</h3>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>Revenue includes both LPG sales and accessory sales (cylinders, regulators, hoses)</li>
            <li>COGS represents direct costs of purchasing inventory items</li>
            <li>Gross Profit = Revenue - COGS (before operating expenses)</li>
            <li>Operating Expenses are indirect costs of running the business</li>
            <li>Net Profit = Gross Profit - Operating Expenses (bottom line)</li>
            <li>
              Healthy margins: Gross Profit &gt; 30%, Net Profit &gt; 15% (industry dependent)
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
