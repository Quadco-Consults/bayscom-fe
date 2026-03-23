'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MonthScopeBar } from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { ClipboardCheck, Download, Printer, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatNGN, formatKg } from '@/utils/fuel-format'

interface ReconciliationSummary {
  // LPG Inventory
  lpgOpeningStock: number
  lpgPurchases: number
  lpgSold: number
  lpgClosingStock: number
  lpgVariance: number

  // Cylinder Inventory
  cylinders12_5Opening: number
  cylinders12_5Closing: number
  cylinders6Opening: number
  cylinders6Closing: number
  cylinders3Opening: number
  cylinders3Closing: number

  // Financial Summary
  totalRevenue: number
  totalCOGS: number
  grossProfit: number
  totalExpenses: number
  netProfit: number

  // Reconciliation Status
  allSalesRecorded: boolean
  allPurchasesRecorded: boolean
  inventoryVerified: boolean
  expensesRecorded: boolean
  financialsReviewed: boolean
}

/**
 * LPG Section - Monthly Reconciliation Page
 *
 * Demonstrates:
 * - Month-end reconciliation summary
 * - LPG inventory reconciliation
 * - Cylinder inventory status
 * - Financial performance recap
 * - Month-end checklist
 * - Lock/unlock functionality
 */
export default function LPGReconciliationPage() {
  const { config, getStation, isMonthLocked, lockMonth } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [summary, setSummary] = useState<ReconciliationSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({})

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Load reconciliation summary
  useEffect(() => {
    setLoading(true)

    // Sample data (in production, this would aggregate from all modules)
    const data: ReconciliationSummary = {
      // LPG Inventory (Kg)
      lpgOpeningStock: 2500,
      lpgPurchases: 10500,
      lpgSold: 7250,
      lpgClosingStock: 5750,
      lpgVariance: 0, // Closing should equal (Opening + Purchases - Sold)

      // Cylinder Inventory (units)
      cylinders12_5Opening: 120,
      cylinders12_5Closing: 120,
      cylinders6Opening: 75,
      cylinders6Closing: 75,
      cylinders3Opening: 42,
      cylinders3Closing: 42,

      // Financial Summary
      totalRevenue: 6095000,
      totalCOGS: 7542600,
      grossProfit: -1447600, // Loss on COGS
      totalExpenses: 910000,
      netProfit: -2357600, // Net loss

      // Reconciliation Status
      allSalesRecorded: true,
      allPurchasesRecorded: true,
      inventoryVerified: true,
      expensesRecorded: true,
      financialsReviewed: false,
    }

    // Calculate variance
    data.lpgVariance = data.lpgClosingStock - (data.lpgOpeningStock + data.lpgPurchases - data.lpgSold)

    setSummary(data)
    setLoading(false)

    // Initialize checklist
    setChecklistItems({
      dailySales: true,
      purchases: true,
      inventory: true,
      expenses: true,
      financials: false,
      managerReview: false,
    })
  }, [stationId, month, year])

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklistItems((prev) => ({ ...prev, [key]: checked }))
  }

  const handleLockMonth = () => {
    const allChecked = Object.values(checklistItems).every((checked) => checked)

    if (!allChecked) {
      alert('Please complete all checklist items before locking the month.')
      return
    }

    if (
      confirm(
        `Are you sure you want to lock ${new Intl.DateTimeFormat('en-NG', {
          month: 'long',
          year: 'numeric',
        }).format(new Date(year, month - 1, 1))}? This will make all data read-only.`
      )
    ) {
      lockMonth(stationId, month, year)
      alert('Month has been locked successfully.')
    }
  }

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  if (loading || !summary) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reconciliation...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const allChecklistComplete = Object.values(checklistItems).every((checked) => checked)

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
          showLockToggle={true}
          onLockToggle={handleLockMonth}
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
            <ClipboardCheck className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monthly Reconciliation</h1>
              <p className="text-sm text-gray-500">
                End-of-month inventory and financial reconciliation
              </p>
            </div>
          </div>

          {!isLocked && (
            <button
              onClick={handleLockMonth}
              disabled={!allChecklistComplete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              Lock Month
            </button>
          )}
        </div>

        {/* LPG Inventory Reconciliation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">LPG Inventory Reconciliation</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Opening Stock</div>
              <div className="text-xl font-bold text-gray-900">{formatKg(summary.lpgOpeningStock)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">+ Purchases</div>
              <div className="text-xl font-bold text-green-600">{formatKg(summary.lpgPurchases)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">- Sales</div>
              <div className="text-xl font-bold text-red-600">{formatKg(summary.lpgSold)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Expected Closing</div>
              <div className="text-xl font-bold text-gray-900">
                {formatKg(summary.lpgOpeningStock + summary.lpgPurchases - summary.lpgSold)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Actual Closing</div>
              <div className="text-xl font-bold text-blue-600">
                {formatKg(summary.lpgClosingStock)}
              </div>
            </div>
          </div>

          {summary.lpgVariance !== 0 && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              Math.abs(summary.lpgVariance) > 50 ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">
                Variance Detected: {summary.lpgVariance > 0 ? '+' : ''}{formatKg(summary.lpgVariance)}
                {Math.abs(summary.lpgVariance) > 50 && ' - Requires investigation'}
              </span>
            </div>
          )}
        </div>

        {/* Cylinder Inventory Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cylinder Inventory Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">12.5kg Cylinders (Filled)</div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{summary.cylinders12_5Closing}</span>
                <span className="text-xs text-gray-500">
                  {summary.cylinders12_5Closing === summary.cylinders12_5Opening ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">6kg Cylinders (Filled)</div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{summary.cylinders6Closing}</span>
                <span className="text-xs text-gray-500">
                  {summary.cylinders6Closing === summary.cylinders6Opening ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">3kg Cylinders (Filled)</div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{summary.cylinders3Closing}</span>
                <span className="text-xs text-gray-500">
                  {summary.cylinders3Closing === summary.cylinders3Opening ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-700">Total Revenue</span>
              <span className="text-base font-semibold text-green-700">{formatNGN(summary.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-700">Cost of Goods Sold</span>
              <span className="text-base font-semibold text-red-700">({formatNGN(summary.totalCOGS)})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Gross Profit</span>
              <span className={`text-base font-bold ${summary.grossProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {summary.grossProfit > 0 ? formatNGN(summary.grossProfit) : `(${formatNGN(Math.abs(summary.grossProfit))})`}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-700">Operating Expenses</span>
              <span className="text-base font-semibold text-red-700">({formatNGN(summary.totalExpenses)})</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-gray-50 px-3 rounded-lg">
              <span className="text-base font-bold text-gray-900">Net Profit (Loss)</span>
              <span className={`text-xl font-bold ${summary.netProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {summary.netProfit > 0 ? formatNGN(summary.netProfit) : `(${formatNGN(Math.abs(summary.netProfit))})`}
              </span>
            </div>
          </div>
        </div>

        {/* Month-End Checklist */}
        {!isLocked && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Month-End Checklist</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistItems.dailySales || false}
                  onChange={(e) => handleChecklistChange('dailySales', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  All daily sales records verified and pump meter readings match
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistItems.purchases || false}
                  onChange={(e) => handleChecklistChange('purchases', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  All purchases recorded with supplier invoices attached
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistItems.inventory || false}
                  onChange={(e) => handleChecklistChange('inventory', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Physical inventory count matches system records (LPG + cylinders + accessories)
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistItems.expenses || false}
                  onChange={(e) => handleChecklistChange('expenses', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  All operating expenses recorded with receipts
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistItems.financials || false}
                  onChange={(e) => handleChecklistChange('financials', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  P&L statement reviewed and variances investigated
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistItems.managerReview || false}
                  onChange={(e) => handleChecklistChange('managerReview', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Station manager review and sign-off obtained
                </span>
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {allChecklistComplete ? (
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    All checklist items complete. You can now lock this month.
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Complete all checklist items before locking the month.
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">Reconciliation Notes:</h3>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>LPG variance within ±50 Kg is acceptable due to temperature and measurement variations</li>
            <li>Cylinder counts should match exactly - investigate any discrepancies immediately</li>
            <li>Gross profit margins below 20% may indicate pricing or purchasing issues</li>
            <li>Operating expenses should not exceed 25% of revenue for healthy operations</li>
            <li>All outstanding supplier payments should be noted for next month</li>
            <li>Once locked, the month cannot be edited without manager authorization</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
