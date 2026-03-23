'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { Lock, Unlock, CheckCircle, AlertTriangle, Calendar, Save } from 'lucide-react'

export default function AGOReconciliationPage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [isLocked, setIsLocked] = useState(false)

  // Mock reconciliation data
  const inventoryData = {
    openingStock: 12500,
    purchases: 66000,
    sales: 57250,
    adjustments: -150,
    calculatedClosing: 21100,
    physicalClosing: 21100,
    variance: 0,
  }

  const financialData = {
    revenue: 48622500,
    cogs: 41181000,
    grossProfit: 7441500,
    expenses: 1243000,
    netProfit: 6198500,
    expenseConfirmed: 985000,
    expensePending: 258000,
  }

  // Month-end checklist
  const [checklist, setChecklist] = useState([
    { id: 1, item: 'All daily sales records entered and verified', checked: true },
    { id: 2, item: 'All purchase invoices recorded and matched', checked: true },
    { id: 3, item: 'Physical stock count completed', checked: true },
    { id: 4, item: 'All expenses recorded with receipts', checked: true },
    { id: 5, item: 'Cash and credit sales reconciled', checked: false },
    { id: 6, item: 'Manager approval obtained', checked: false },
  ])

  const toggleChecklistItem = (id: number) => {
    if (isLocked) return
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const allChecklistComplete = checklist.every((item) => item.checked)

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
  const formatLitres = (litres: number) => `${litres.toLocaleString('en-NG')} L`

  const getVarianceStatus = () => {
    if (inventoryData.variance === 0) {
      return { status: 'balanced', color: 'green', message: 'No variance detected - inventory balanced' }
    } else if (Math.abs(inventoryData.variance) <= 100) {
      return { status: 'acceptable', color: 'amber', message: 'Minor variance within acceptable range' }
    } else {
      return { status: 'requires_attention', color: 'red', message: 'Significant variance - investigation required' }
    }
  }

  const varianceStatus = getVarianceStatus()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AGO Reconciliation</h1>
          <p className="text-sm text-gray-500 mt-1">Month-end inventory and financial reconciliation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
          <button
            onClick={() => setIsLocked(!isLocked)}
            disabled={!allChecklistComplete && !isLocked}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
              isLocked
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : allChecklistComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Locked
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                {allChecklistComplete ? 'Lock Month' : 'Complete Checklist to Lock'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              disabled={isLocked}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2026, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={isLocked}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Variance Status Alert */}
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border ${
          varianceStatus.color === 'green'
            ? 'bg-green-50 border-green-200'
            : varianceStatus.color === 'amber'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        {varianceStatus.color === 'green' ? (
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        ) : (
          <AlertTriangle
            className={`h-5 w-5 mt-0.5 ${
              varianceStatus.color === 'amber' ? 'text-amber-600' : 'text-red-600'
            }`}
          />
        )}
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold ${
              varianceStatus.color === 'green'
                ? 'text-green-900'
                : varianceStatus.color === 'amber'
                ? 'text-amber-900'
                : 'text-red-900'
            }`}
          >
            {varianceStatus.status === 'balanced'
              ? 'Inventory Balanced'
              : varianceStatus.status === 'acceptable'
              ? 'Minor Variance Detected'
              : 'Variance Requires Attention'}
          </h3>
          <p
            className={`text-sm mt-1 ${
              varianceStatus.color === 'green'
                ? 'text-green-700'
                : varianceStatus.color === 'amber'
                ? 'text-amber-700'
                : 'text-red-700'
            }`}
          >
            {varianceStatus.message}
          </p>
        </div>
      </div>

      {/* Inventory Reconciliation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AGO Inventory Reconciliation</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Opening Stock</p>
              <p className="text-xl font-semibold text-gray-900">{formatLitres(inventoryData.openingStock)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Purchases</p>
              <p className="text-xl font-semibold text-green-600">{formatLitres(inventoryData.purchases)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Sales</p>
              <p className="text-xl font-semibold text-blue-600">{formatLitres(inventoryData.sales)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Adjustments</p>
              <p className={`text-xl font-semibold ${inventoryData.adjustments < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {inventoryData.adjustments > 0 ? '+' : ''}
                {formatLitres(Math.abs(inventoryData.adjustments))}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Calculated Closing Stock:</span>
              <span className="font-semibold text-gray-900">{formatLitres(inventoryData.calculatedClosing)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Physical Closing Stock:</span>
              <span className="font-semibold text-gray-900">{formatLitres(inventoryData.physicalClosing)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Variance:</span>
              <span
                className={`font-bold ${
                  inventoryData.variance === 0
                    ? 'text-green-600'
                    : inventoryData.variance < 0
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}
              >
                {inventoryData.variance === 0 ? 'Nil' : formatLitres(Math.abs(inventoryData.variance))}
                {inventoryData.variance !== 0 && (inventoryData.variance < 0 ? ' (shortage)' : ' (overage)')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <span className="font-semibold text-gray-900">{formatNaira(financialData.revenue)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Cost of Goods Sold</span>
            <span className="font-semibold text-gray-900">{formatNaira(financialData.cogs)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-900">Gross Profit</span>
            <span className="font-bold text-teal-600">{formatNaira(financialData.grossProfit)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Operating Expenses</span>
            <span className="font-semibold text-gray-900">{formatNaira(financialData.expenses)}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t-2 border-gray-300 bg-green-50 px-4 rounded-lg">
            <span className="text-base font-bold text-gray-900">Net Profit</span>
            <span className="text-xl font-bold text-green-600">{formatNaira(financialData.netProfit)}</span>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Expense Payment Status</p>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Confirmed Payments</span>
              <span className="text-sm font-semibold text-green-600">{formatNaira(financialData.expenseConfirmed)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Pending Payments</span>
              <span className="text-sm font-semibold text-amber-600">{formatNaira(financialData.expensePending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Month-End Checklist */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Month-End Checklist</h2>
        <p className="text-sm text-gray-500 mb-4">Complete all items before locking the month</p>

        <div className="space-y-3">
          {checklist.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.checked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                disabled={isLocked}
                className="h-5 w-5 rounded text-green-600 focus:ring-green-500"
              />
              <span className={`text-sm ${item.checked ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                {item.item}
              </span>
              {item.checked && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
            </label>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            {allChecklistComplete
              ? '✓ All checklist items complete. You can now lock this month.'
              : `${checklist.filter((i) => !i.checked).length} item(s) remaining`}
          </p>
        </div>
      </div>
    </div>
  )
}
