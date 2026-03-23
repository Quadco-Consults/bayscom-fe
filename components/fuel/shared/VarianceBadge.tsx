'use client'

import { formatNGN, formatLitres, formatKg, formatVariance } from '@/utils/fuel-format'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface VarianceBadgeProps {
  /** Variance value (positive = surplus, negative = deficit) */
  value: number

  /** Unit of measurement */
  unit?: 'currency' | 'litres' | 'kg' | 'number'

  /** Show icon indicator */
  showIcon?: boolean

  /** Size variant */
  size?: 'sm' | 'md' | 'lg'

  /** Custom label (overrides formatted value) */
  customLabel?: string

  /** Threshold for "balanced" status (default: 0) */
  balanceThreshold?: number
}

/**
 * VarianceBadge Component
 *
 * Color-coded badge for displaying variances across all modules:
 * - Green = Surplus/Overage (positive variance)
 * - Red = Deficit/Shortage (negative variance)
 * - Gray = Balanced (within threshold)
 *
 * Used in:
 * - DippingTable (daily overage/shortage)
 * - LodgementTable (lodgement difference)
 * - Reconciliation summaries
 * - P&L statements
 */
export function VarianceBadge({
  value,
  unit = 'currency',
  showIcon = true,
  size = 'md',
  customLabel,
  balanceThreshold = 0,
}: VarianceBadgeProps) {
  const isBalanced = Math.abs(value) <= balanceThreshold
  const isSurplus = value > balanceThreshold
  const isDeficit = value < -balanceThreshold

  const formatValue = () => {
    if (customLabel) return customLabel

    switch (unit) {
      case 'currency':
        return formatNGN(Math.abs(value))
      case 'litres':
        return formatLitres(Math.abs(value))
      case 'kg':
        return formatKg(Math.abs(value))
      case 'number':
      default:
        return new Intl.NumberFormat('en-NG', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(Math.abs(value))
    }
  }

  const getColorClasses = () => {
    if (isBalanced) {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
      }
    }
    if (isSurplus) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
      }
    }
    // isDeficit
    return {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs'
      case 'lg':
        return 'px-4 py-2 text-base'
      case 'md':
      default:
        return 'px-3 py-1 text-sm'
    }
  }

  const getIcon = () => {
    if (!showIcon) return null

    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'

    if (isBalanced) {
      return <Minus className={iconSize} />
    }
    if (isSurplus) {
      return <TrendingUp className={iconSize} />
    }
    return <TrendingDown className={iconSize} />
  }

  const colors = getColorClasses()
  const sizeClass = getSizeClasses()

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      {getIcon()}
      <span>
        {isBalanced && 'Balanced'}
        {isSurplus && `+${formatValue()}`}
        {isDeficit && `-${formatValue()}`}
      </span>
    </span>
  )
}

/**
 * VarianceText Component
 *
 * Simple text variant without badge styling
 */
export function VarianceText({
  value,
  unit = 'currency',
  showIcon = true,
  balanceThreshold = 0,
}: Omit<VarianceBadgeProps, 'size' | 'customLabel'>) {
  const isBalanced = Math.abs(value) <= balanceThreshold
  const isSurplus = value > balanceThreshold

  const getTextColor = () => {
    if (isBalanced) return 'text-gray-600'
    if (isSurplus) return 'text-green-600'
    return 'text-red-600'
  }

  const getIcon = () => {
    if (!showIcon) return null

    if (isBalanced) return <Minus className="w-4 h-4" />
    if (isSurplus) return <TrendingUp className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const formatValue = () => {
    switch (unit) {
      case 'currency':
        return formatVariance(value, '₦')
      case 'litres':
        return formatVariance(value, 'Ltrs')
      case 'kg':
        return formatVariance(value, 'Kg')
      case 'number':
      default:
        return formatVariance(value, '')
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${getTextColor()}`}>
      {getIcon()}
      <span>{formatValue()}</span>
    </span>
  )
}
