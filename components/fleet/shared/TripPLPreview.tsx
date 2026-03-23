'use client'

import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { formatNGN, formatLitres, formatMarginPct } from '@/utils/fleet-format'
import { fleetCalc } from '@/utils/fleet-calcs'
import { ExpenseItem } from './ExpenseLineItems'

interface TripPLPreviewProps {
  loadedLitres: number
  deliveredLitres: number
  ratePerLitre: number
  expenses: ExpenseItem[]
}

/**
 * TripPLPreview Component
 *
 * Real-time P&L calculation panel shown while creating/editing a trip
 * - Displays revenue, expenses, and net P&L
 * - Auto-updates as user enters data
 * - Shows margin percentage and transit loss
 */
export function TripPLPreview({
  loadedLitres,
  deliveredLitres,
  ratePerLitre,
  expenses,
}: TripPLPreviewProps) {
  // Calculations
  const revenue = fleetCalc.haulageRevenue(deliveredLitres, ratePerLitre)
  const totalExpenses = fleetCalc.totalExpenses(expenses)
  const netPL = fleetCalc.netTripPL(revenue, totalExpenses)
  const margin = fleetCalc.tripMarginPct(revenue, netPL)
  const transitLossLitres = fleetCalc.transitLoss(loadedLitres, deliveredLitres)
  const transitLossPct = fleetCalc.transitLossPct(loadedLitres, deliveredLitres)

  const isGain = netPL >= 0
  const hasData = deliveredLitres > 0 || expenses.length > 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-base font-semibold text-gray-900">Trip P&L Preview</h3>
      </div>

      {hasData ? (
        <div className="space-y-4">
          {/* Revenue Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Haulage Revenue</span>
              <span className="font-medium text-gray-900">{formatNGN(revenue)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Rate per Litre</span>
              <span>{formatNGN(ratePerLitre)}/L</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Delivered</span>
              <span>{formatLitres(deliveredLitres)}</span>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Expenses Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-medium text-gray-900">{formatNGN(totalExpenses)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Line Items</span>
              <span>{expenses.length} {expenses.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Net P&L Section */}
          <div
            className={`rounded-lg p-4 ${
              isGain ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Net P&L</span>
              {isGain ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className={`text-2xl font-bold ${isGain ? 'text-green-700' : 'text-red-700'}`}>
              {formatNGN(Math.abs(netPL))}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-600">Margin</span>
              <span className={`font-medium ${isGain ? 'text-green-700' : 'text-red-700'}`}>
                {formatMarginPct(margin)}
              </span>
            </div>
          </div>

          {/* Transit Loss Info (if applicable) */}
          {loadedLitres > 0 && (
            <>
              <div className="border-t border-gray-200"></div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Transit Loss</span>
                  <span
                    className={`font-medium ${
                      transitLossPct > 1 ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {formatLitres(transitLossLitres)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Loss Percentage</span>
                  <span
                    className={`font-medium ${
                      transitLossPct > 1 ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {transitLossPct.toFixed(2)}%
                  </span>
                </div>
                {transitLossPct > 1 && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">
                    ⚠️ Loss exceeds 1% threshold
                  </div>
                )}
              </div>
            </>
          )}

          {/* Status Badge */}
          <div className="pt-3 border-t border-gray-200">
            <div
              className={`text-center text-sm font-semibold py-2 rounded ${
                isGain ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isGain ? '✓ Gainful Trip' : '✗ Loss-Making Trip'}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Enter trip details to see P&L preview</p>
        </div>
      )}
    </div>
  )
}
