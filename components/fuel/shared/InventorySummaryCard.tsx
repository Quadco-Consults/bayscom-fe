'use client'

import { formatNGN, formatLitres, formatKg } from '@/utils/fuel-format'
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react'

export interface SummaryItem {
  label: string
  value: number
  format: 'currency' | 'litres' | 'kg' | 'number' | 'percent'
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  trendFormat?: 'currency' | 'litres' | 'kg' | 'number' | 'percent'
  highlight?: 'success' | 'warning' | 'danger' | 'info'
  description?: string
}

export interface InventorySummaryCardProps {
  /** Card title */
  title: string

  /** Card subtitle or description */
  subtitle?: string

  /** Summary items to display */
  items: SummaryItem[]

  /** Optional icon component */
  icon?: React.ReactNode

  /** Optional footer content */
  footer?: React.ReactNode

  /** Card variant */
  variant?: 'default' | 'compact'
}

/**
 * InventorySummaryCard Component
 *
 * Read-only computed summary card used across:
 * - Filling Station → Monthly Sales Summary
 * - LPG Section → P&L Summary
 * - AGO Peddling → Debtors Summary
 * - All modules → Reconciliation summaries
 */
export function InventorySummaryCard({
  title,
  subtitle,
  items,
  icon,
  footer,
  variant = 'default',
}: InventorySummaryCardProps) {
  const formatValue = (value: number, format: SummaryItem['format']): string => {
    switch (format) {
      case 'currency':
        return formatNGN(value)
      case 'litres':
        return formatLitres(value)
      case 'kg':
        return formatKg(value)
      case 'percent':
        return `${value.toFixed(1)}%`
      case 'number':
      default:
        return new Intl.NumberFormat('en-NG', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value)
    }
  }

  const getHighlightClasses = (highlight?: SummaryItem['highlight']) => {
    switch (highlight) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-amber-200 bg-amber-50'
      case 'danger':
        return 'border-red-200 bg-red-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getHighlightTextColor = (highlight?: SummaryItem['highlight']) => {
    switch (highlight) {
      case 'success':
        return 'text-green-700'
      case 'warning':
        return 'text-amber-700'
      case 'danger':
        return 'text-red-700'
      case 'info':
        return 'text-blue-700'
      default:
        return 'text-gray-900'
    }
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'neutral':
        return <Activity className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {icon && <div className="text-gray-400">{icon}</div>}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>

        {/* Items - Compact Grid */}
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">{item.label}</span>
              <span className={`text-lg font-semibold ${getHighlightTextColor(item.highlight)}`}>
                {formatValue(item.value, item.format)}
              </span>
              {item.trend && item.trendValue !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(item.trend)}
                  <span className="text-xs text-gray-500">
                    {formatValue(item.trendValue, item.trendFormat || item.format)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {footer && <div className="mt-4 pt-4 border-t border-gray-200">{footer}</div>}
      </div>
    )
  }

  // Default variant - full size
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          {icon && <div className="text-gray-400">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getHighlightClasses(item.highlight)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                {item.highlight === 'warning' && (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                {item.highlight === 'danger' && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>

              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${getHighlightTextColor(item.highlight)}`}>
                  {formatValue(item.value, item.format)}
                </span>

                {item.trend && item.trendValue !== undefined && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span
                      className={`text-sm font-medium ${
                        item.trend === 'up'
                          ? 'text-green-600'
                          : item.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatValue(item.trendValue, item.trendFormat || item.format)}
                    </span>
                  </div>
                )}
              </div>

              {item.description && (
                <p className="text-xs text-gray-500 mt-2">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>
      )}
    </div>
  )
}
