import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatNGN } from '@/utils/fleet-format'

interface TripStatusBadgeProps {
  netPL: number
  showAmount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * TripStatusBadge Component
 *
 * Displays gain/loss status for a trip with color coding
 * - Green: Gain (positive P&L)
 * - Red: Loss (negative P&L)
 */
export function TripStatusBadge({ netPL, showAmount = false, size = 'md' }: TripStatusBadgeProps) {
  const isGain = netPL > 0

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const bgClass = isGain ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size]} ${bgClass}`}
    >
      {isGain ? (
        <TrendingUp className={iconSizes[size]} />
      ) : (
        <TrendingDown className={iconSizes[size]} />
      )}
      <span>{isGain ? 'Gain' : 'Loss'}</span>
      {showAmount && (
        <span className="font-semibold">
          {formatNGN(Math.abs(netPL))}
        </span>
      )}
    </span>
  )
}
