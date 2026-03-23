/**
 * Fleet & Haulage - Formatting Utilities
 *
 * Consistent formatting for fleet-specific values.
 * Re-uses fuel-format utilities where appropriate.
 */

import {
  formatNGN,
  formatDate as fuelFormatDate,
  formatNumber,
} from './fuel-format'

/**
 * Format litres for fleet operations
 * @param value - Litres value
 * @param showUnit - Whether to show "L" suffix (default: true)
 * @returns Formatted litres string
 * @example formatLitres(32870) => "32,870 L"
 */
export function formatLitres(value: number, showUnit = true): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  return showUnit ? `${formatted} L` : formatted
}

/**
 * Format truck registration number
 * @param regNo - Registration number
 * @returns Uppercase, trimmed reg number
 * @example formatTruckReg("t9829la") => "T9829LA"
 */
export function formatTruckReg(regNo: string): string {
  return regNo.toUpperCase().trim()
}

/**
 * Format route display (Depot → State)
 * @param depot - Loading depot name
 * @param state - Destination state name
 * @returns Route string
 * @example formatRoute("Warri Depot", "Kano") => "Warri → Kano"
 */
export function formatRoute(depot: string, state: string): string {
  const cleanDepot = depot.replace(/\s+Depot$/i, '').trim()
  return `${cleanDepot} → ${state}`
}

/**
 * Format P&L value with color indication
 * @param value - P&L amount
 * @returns Object with formatted value and color class
 */
export function formatPL(value: number): {
  value: string
  colorClass: string
  bgClass: string
  isGain: boolean
} {
  const isGain = value >= 0

  return {
    value: formatNGN(Math.abs(value)),
    colorClass: isGain ? 'text-green-800' : 'text-red-800',
    bgClass: isGain ? 'bg-green-50' : 'bg-red-50',
    isGain,
  }
}

/**
 * Format P&L status badge
 * @param netPL - Net P&L value
 * @returns Status label
 */
export function formatPLStatus(netPL: number): 'Gain' | 'Loss' {
  return netPL >= 0 ? 'Gain' : 'Loss'
}

/**
 * Format product name for display
 * @param product - Product code (PMS, AGO, DPK)
 * @returns Full product name
 */
export function formatProductName(product: string): string {
  const names: Record<string, string> = {
    PMS: 'Premium Motor Spirit',
    AGO: 'Automotive Gas Oil',
    DPK: 'Dual Purpose Kerosene',
  }

  return names[product] || product
}

/**
 * Format transit loss with percentage
 * @param litres - Loss in litres
 * @param percentage - Loss percentage
 * @returns Formatted loss string
 * @example formatTransitLoss(100, 0.30) => "100 L (0.30%)"
 */
export function formatTransitLoss(litres: number, percentage: number): string {
  return `${formatLitres(litres)} (${percentage.toFixed(2)}%)`
}

/**
 * Format margin percentage
 * @param margin - Margin value
 * @returns Formatted percentage
 */
export function formatMarginPct(margin: number): string {
  return `${margin.toFixed(1)}%`
}

/**
 * Format distance in kilometers
 * @param km - Distance value
 * @returns Formatted distance
 */
export function formatDistance(km: number): string {
  return `${formatNumber(km, 0)} km`
}

/**
 * Format rate per litre
 * @param rate - Rate value
 * @returns Formatted rate
 */
export function formatRatePerLitre(rate: number): string {
  return `${formatNGN(rate, false)}/L`
}

/**
 * Get product badge colors
 * @param product - Product code
 * @returns Object with bg and text color classes
 */
export function getProductBadgeColors(product: string): {
  bg: string
  text: string
} {
  const colors: Record<string, { bg: string; text: string }> = {
    PMS: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
    },
    AGO: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
    },
    DPK: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
    },
  }

  return colors[product] || { bg: 'bg-gray-50', text: 'text-gray-800' }
}

/**
 * Get P&L status badge colors
 * @param status - 'gain' or 'loss'
 * @returns Object with bg and text color classes
 */
export function getPLBadgeColors(status: 'gain' | 'loss'): {
  bg: string
  text: string
} {
  return status === 'gain'
    ? { bg: 'bg-green-100', text: 'text-green-800' }
    : { bg: 'bg-red-100', text: 'text-red-800' }
}

/**
 * Format trip summary for display
 * @param trip - Trip object
 * @returns Summary string
 */
export function formatTripSummary(trip: {
  truckRegNo: string
  depot: string
  destinationStateName: string
  product: string
  deliveredLitres: number
}): string {
  return `${formatTruckReg(trip.truckRegNo)} · ${formatRoute(
    trip.depot,
    trip.destinationStateName
  )} · ${trip.product} · ${formatLitres(trip.deliveredLitres)}`
}

// Re-export commonly used fuel formatters for convenience
export { formatNGN, formatDate, formatNumber } from './fuel-format'

// Export type for use in components
export type PLStatus = 'gain' | 'loss'
export type ProductCode = 'PMS' | 'AGO' | 'DPK'
