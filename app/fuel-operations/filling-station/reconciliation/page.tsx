/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  ReconciliationSummaryTable,
  ReconciliationData,
  MonthScopeBar,
} from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { ClipboardCheck, Download, Printer, Lock } from 'lucide-react'

/**
 * Filling Station - Monthly Reconciliation Page
 *
 * Demonstrates:
 * - ReconciliationSummaryTable component
 * - Multi-product reconciliation
 * - Month-end variance analysis
 */
export default function MonthlyReconciliationPage() {
  const { config, getStation, getProductPrice, isMonthLocked, lockMonth } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [reconciliationData, setReconciliationData] = useState<ReconciliationData[]>([])
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Load reconciliation data for the month
  useEffect(() => {
    setLoading(true)

    // Get prices for each product
    const pmsPrice = getProductPrice('PMS', stationId, month, year)
    const agoPrice = getProductPrice('AGO', stationId, month, year)
    const dpkPrice = getProductPrice('DPK', stationId, month, year)

    // Sample reconciliation data (in production, this would come from API)
    const data: ReconciliationData[] = [
      {
        product: 'PMS',
        openingStock: 12000,
        totalDeliveries: 99000,
        totalTransitLoss: 465,
        totalSales: 95800,
        closingStockPhysical: 14650,
        unitPrice: pmsPrice,
      },
      {
        product: 'AGO',
        openingStock: 15000,
        totalDeliveries: 120000,
        totalTransitLoss: 550,
        totalSales: 112300,
        closingStockPhysical: 22050,
        unitPrice: agoPrice,
      },
      {
        product: 'DPK',
        openingStock: 8000,
        totalDeliveries: 33000,
        totalTransitLoss: 150,
        totalSales: 28900,
        closingStockPhysical: 11900,
        unitPrice: dpkPrice,
      },
    ]

    setReconciliationData(data)
    setLoading(false)
  }, [stationId, month, year, getProductPrice])

  const handleLockMonth = () => {
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

  const fillingStations = config.stations.filter((s) => s.type === 'filling-station')

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reconciliation...</p>
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
          stations={fillingStations}
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
                End-of-month stock variance analysis across all products
              </p>
            </div>
          </div>

          {!isLocked && (
            <button
              onClick={handleLockMonth}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Lock Month
            </button>
          )}
        </div>

        {/* Reconciliation Summary Table */}
        <ReconciliationSummaryTable
          month={month}
          year={year}
          products={reconciliationData}
          unit="Ltrs"
          showFormulas={true}
          actions={
            <div className="text-sm text-gray-600">
              <p>
                <strong>Note:</strong> All variance calculations are based on the book closing
                stock vs physical dipping.
              </p>
            </div>
          }
        />

        {/* Reconciliation Checklist */}
        {!isLocked && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Month-End Checklist
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  All daily dipping sheets verified and signed
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  All deliveries matched with waybills
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  Sales register totals verified
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  Bank lodgements reconciled with sales
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  All variances investigated and documented
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  Transit loss within acceptable thresholds (&lt;0.5%)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">
                  Station manager review and sign-off obtained
                </span>
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Once all checklist items are complete and variances are within acceptable
                limits, click "Lock Month" above to finalize this period.
              </p>
            </div>
          </div>
        )}

        {/* Variance Analysis Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">
            Variance Analysis Guidelines:
          </h3>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Acceptable variance:</strong> Within ±50 litres or ±0.2% of closing stock
            </li>
            <li>
              <strong>Investigate if:</strong> Variance exceeds ₦50,000 or 200 litres
            </li>
            <li>
              <strong>Common causes:</strong> Evaporation, temperature changes, measurement
              errors, theft
            </li>
            <li>
              <strong>Transit loss threshold:</strong> 0.5% for PMS/AGO, 0.3% for DPK
            </li>
            <li>
              <strong>Persistent shortages:</strong> May indicate pump calibration issues or
              pilfer age
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
