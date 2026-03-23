'use client'

import { useMemo } from 'react'
import { calc } from '@/utils/fuel-calcs'
import { formatNGN, formatLitres, formatKg } from '@/utils/fuel-format'
import { VarianceBadge } from './VarianceBadge'
import { AutoCalcField } from './AutoCalcField'
import { FileText, TrendingDown, TrendingUp, Activity } from 'lucide-react'

/**
 * Reconciliation Data Structure
 */
export interface ReconciliationData {
  /** Product code */
  product: string

  /** Opening stock */
  openingStock: number

  /** Total deliveries/receipts */
  totalDeliveries: number

  /** Total transit loss */
  totalTransitLoss: number

  /** Total sales */
  totalSales: number

  /** Closing stock (book) - auto-calculated */
  closingStockBook?: number

  /** Closing stock (physical) */
  closingStockPhysical: number

  /** Variance - auto-calculated */
  variance?: number

  /** Unit price for value calculation */
  unitPrice: number

  /** Variance value - auto-calculated */
  varianceValue?: number
}

export interface ReconciliationSummaryTableProps {
  /** Month and year being reconciled */
  month: number
  year: number

  /** Product reconciliations */
  products: ReconciliationData[]

  /** Unit of measurement */
  unit: 'Ltrs' | 'Kg'

  /** Optional: Show detailed formulas */
  showFormulas?: boolean

  /** Optional: Header action buttons */
  actions?: React.ReactNode
}

/**
 * ReconciliationSummaryTable Component
 *
 * Monthly reconciliation summary showing:
 * - Opening stock
 * - Total deliveries/receipts
 * - Total transit loss
 * - Total sales
 * - Closing stock (book vs physical)
 * - Variance analysis
 *
 * Used in:
 * - Filling Station → Monthly Reconciliation
 * - LPG Section → Monthly Reconciliation
 * - AGO Peddling → Monthly Reconciliation
 */
export function ReconciliationSummaryTable({
  month,
  year,
  products,
  unit,
  showFormulas = false,
  actions,
}: ReconciliationSummaryTableProps) {
  const formatQuantity = unit === 'Ltrs' ? formatLitres : formatKg

  // Calculate all auto-fields
  const computedProducts = useMemo(() => {
    return products.map((product) => {
      const actualReceipt = calc.receipt(product.totalDeliveries, product.totalTransitLoss)
      const closingStockBook = calc.closingStock(
        product.openingStock,
        actualReceipt,
        product.totalSales
      )
      const variance = calc.diff(product.closingStockPhysical, closingStockBook)
      const varianceValue = calc.value(variance, product.unitPrice)

      return {
        ...product,
        actualReceipt,
        closingStockBook,
        variance,
        varianceValue,
      }
    })
  }, [products])

  // Calculate totals
  const totals = useMemo(() => {
    return {
      openingStock: computedProducts.reduce((sum, p) => sum + p.openingStock, 0),
      totalDeliveries: computedProducts.reduce((sum, p) => sum + p.totalDeliveries, 0),
      totalTransitLoss: computedProducts.reduce((sum, p) => sum + p.totalTransitLoss, 0),
      actualReceipt: computedProducts.reduce((sum, p) => sum + (p.actualReceipt || 0), 0),
      totalSales: computedProducts.reduce((sum, p) => sum + p.totalSales, 0),
      closingStockBook: computedProducts.reduce((sum, p) => sum + (p.closingStockBook || 0), 0),
      closingStockPhysical: computedProducts.reduce((sum, p) => sum + p.closingStockPhysical, 0),
      variance: computedProducts.reduce((sum, p) => sum + (p.variance || 0), 0),
      varianceValue: computedProducts.reduce((sum, p) => sum + (p.varianceValue || 0), 0),
    }
  }, [computedProducts])

  const getStatusIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-5 h-5 text-green-600" />
    if (variance < 0) return <TrendingDown className="w-5 h-5 text-red-600" />
    return <Activity className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Reconciliation Summary
            </h3>
            <p className="text-sm text-gray-500">
              {new Intl.DateTimeFormat('en-NG', { month: 'long', year: 'numeric' }).format(
                new Date(year, month - 1, 1)
              )}
            </p>
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {/* Reconciliation Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Opening Stock
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Deliveries
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Transit Loss
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase italic">
                Actual Receipt
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Sales
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase italic">
                Closing (Book)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Closing (Physical)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase italic">
                Variance
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase italic">
                Value
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {computedProducts.map((product) => (
              <tr key={product.product} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {product.product}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {formatQuantity(product.openingStock, false)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {formatQuantity(product.totalDeliveries, false)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-red-600">
                  {formatQuantity(product.totalTransitLoss, false)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <AutoCalcField
                    value={formatQuantity(product.actualReceipt || 0, false)}
                    formula={showFormulas ? 'Deliveries - Transit Loss' : undefined}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {formatQuantity(product.totalSales, false)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <AutoCalcField
                    value={formatQuantity(product.closingStockBook || 0, false)}
                    formula={
                      showFormulas ? 'Opening + Actual Receipt - Sales' : undefined
                    }
                  />
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                  {formatQuantity(product.closingStockPhysical, false)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <AutoCalcField
                    value={formatQuantity(product.variance || 0, false)}
                    formula={showFormulas ? 'Physical - Book' : undefined}
                    variant={
                      (product.variance || 0) > 0
                        ? 'success'
                        : (product.variance || 0) < 0
                        ? 'danger'
                        : 'default'
                    }
                  />
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <AutoCalcField
                    value={formatNGN(product.varianceValue || 0, false)}
                    formula={showFormulas ? 'Variance × Unit Price' : undefined}
                    variant={
                      (product.varianceValue || 0) > 0
                        ? 'success'
                        : (product.varianceValue || 0) < 0
                        ? 'danger'
                        : 'default'
                    }
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <VarianceBadge
                      value={product.variance || 0}
                      unit={unit === 'Ltrs' ? 'litres' : 'kg'}
                      size="sm"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Totals Row */}
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
              <td className="px-4 py-3 text-sm text-right text-gray-900">
                {formatQuantity(totals.openingStock, false)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900">
                {formatQuantity(totals.totalDeliveries, false)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-red-700">
                {formatQuantity(totals.totalTransitLoss, false)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-500 italic">
                {formatQuantity(totals.actualReceipt, false)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900">
                {formatQuantity(totals.totalSales, false)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-500 italic">
                {formatQuantity(totals.closingStockBook, false)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900">
                {formatQuantity(totals.closingStockPhysical, false)}
              </td>
              <td
                className={`px-4 py-3 text-sm text-right italic ${
                  totals.variance > 0
                    ? 'text-green-700'
                    : totals.variance < 0
                    ? 'text-red-700'
                    : 'text-gray-500'
                }`}
              >
                {formatQuantity(totals.variance, false)}
              </td>
              <td
                className={`px-4 py-3 text-sm text-right italic ${
                  totals.varianceValue > 0
                    ? 'text-green-700'
                    : totals.varianceValue < 0
                    ? 'text-red-700'
                    : 'text-gray-500'
                }`}
              >
                {formatNGN(totals.varianceValue, false)}
              </td>
              <td className="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(totals.variance)}
            <div className="flex-1">
              <p className="text-sm text-gray-500">Total Variance</p>
              <p
                className={`text-2xl font-bold ${
                  totals.variance > 0
                    ? 'text-green-700'
                    : totals.variance < 0
                    ? 'text-red-700'
                    : 'text-gray-700'
                }`}
              >
                {formatQuantity(totals.variance)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(totals.varianceValue)}
            <div className="flex-1">
              <p className="text-sm text-gray-500">Variance Value</p>
              <p
                className={`text-2xl font-bold ${
                  totals.varianceValue > 0
                    ? 'text-green-700'
                    : totals.varianceValue < 0
                    ? 'text-red-700'
                    : 'text-gray-700'
                }`}
              >
                {formatNGN(totals.varianceValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Total Transit Loss</p>
              <p className="text-2xl font-bold text-amber-700">
                {formatQuantity(totals.totalTransitLoss)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
