'use client'

import { Calculator, Info } from 'lucide-react'
import { useState } from 'react'

export interface AutoCalcFieldProps {
  /** The calculated value to display */
  value: string | number

  /** Optional formula explanation */
  formula?: string

  /** Optional tooltip text */
  tooltip?: string

  /** Show calculator icon */
  showIcon?: boolean

  /** Text alignment */
  align?: 'left' | 'right' | 'center'

  /** Size variant */
  size?: 'sm' | 'md' | 'lg'

  /** Color variant based on value type */
  variant?: 'default' | 'success' | 'warning' | 'danger'

  /** Custom CSS classes */
  className?: string
}

/**
 * AutoCalcField Component
 *
 * Wrapper for auto-calculated fields with visual indicators.
 * Shows:
 * - Muted/italic styling to distinguish from user inputs
 * - Optional calculator icon
 * - Optional formula tooltip on hover
 *
 * Used in:
 * - DippingTable (actual receipt, closing stock, diff, etc.)
 * - LodgementTable (total lodged, difference)
 * - Summary cards
 * - P&L statements
 */
export function AutoCalcField({
  value,
  formula,
  tooltip,
  showIcon = false,
  align = 'left',
  size = 'md',
  variant = 'default',
  className = '',
}: AutoCalcFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getAlignmentClass = () => {
    switch (align) {
      case 'right':
        return 'text-right'
      case 'center':
        return 'text-center'
      case 'left':
      default:
        return 'text-left'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-base'
      case 'md':
      default:
        return 'text-sm'
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'text-green-700'
      case 'warning':
        return 'text-amber-700'
      case 'danger':
        return 'text-red-700'
      case 'default':
      default:
        return 'text-gray-500'
    }
  }

  const tooltipText = tooltip || formula

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Calculator Icon */}
      {showIcon && <Calculator className="w-3.5 h-3.5 text-gray-400" />}

      {/* Value */}
      <span
        className={`italic font-medium ${getAlignmentClass()} ${getSizeClass()} ${getVariantClass()}`}
      >
        {value}
      </span>

      {/* Info Icon with Tooltip */}
      {tooltipText && (
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
              {tooltipText}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * AutoCalcLabel Component
 *
 * Label wrapper for auto-calculated fields in forms
 */
export function AutoCalcLabel({
  label,
  value,
  formula,
  tooltip,
  size = 'md',
  variant = 'default',
}: {
  label: string
  value: string | number
  formula?: string
  tooltip?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <AutoCalcField
          value={value}
          formula={formula}
          tooltip={tooltip}
          showIcon={true}
          align="right"
          size={size}
          variant={variant}
        />
      </div>
    </div>
  )
}

/**
 * AutoCalcRow Component
 *
 * Row layout for auto-calculated fields in summary tables
 */
export function AutoCalcRow({
  label,
  value,
  formula,
  tooltip,
  variant = 'default',
}: {
  label: string
  value: string | number
  formula?: string
  tooltip?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <AutoCalcField
        value={value}
        formula={formula}
        tooltip={tooltip}
        showIcon={false}
        align="right"
        size="md"
        variant={variant}
      />
    </div>
  )
}
