/**
 * Fleet & Haulage - Auto-Calculation Utilities
 *
 * All trip P&L calculations are pure functions.
 * These are used for:
 * - Live P&L preview in the new trip form
 * - Server-side P&L computation on save
 * - Dashboard and report aggregations
 */

/**
 * Calculate transit loss (litres)
 */
export const transitLoss = (loaded: number, delivered: number): number => {
  return loaded - delivered
}

/**
 * Calculate transit loss as percentage
 */
export const transitLossPct = (loaded: number, delivered: number): number => {
  if (loaded === 0) return 0
  return ((loaded - delivered) / loaded) * 100
}

/**
 * Calculate haulage revenue
 * Revenue = Delivered litres × Rate per litre
 */
export const haulageRevenue = (deliveredLitres: number, ratePerLitre: number): number => {
  return deliveredLitres * ratePerLitre
}

/**
 * Calculate total trip expenses from line items
 */
export const totalExpenses = (items: { amt: number }[]): number => {
  return items.reduce((sum, e) => sum + (e.amt || 0), 0)
}

/**
 * Calculate net trip P&L
 * Net P&L = Revenue - Total Expenses
 */
export const netTripPL = (revenue: number, totalExpenses: number): number => {
  return revenue - totalExpenses
}

/**
 * Calculate trip margin percentage
 * Margin % = (Net P&L / Revenue) × 100
 */
export const tripMarginPct = (revenue: number, netPL: number): number => {
  if (revenue === 0) return 0
  return (netPL / revenue) * 100
}

/**
 * Calculate fleet-level total revenue
 */
export const fleetRevenue = (trips: { revenue: number }[]): number => {
  return trips.reduce((sum, t) => sum + t.revenue, 0)
}

/**
 * Calculate fleet-level total expenses
 */
export const fleetExpenses = (trips: { totalExpenses: number }[]): number => {
  return trips.reduce((sum, t) => sum + t.totalExpenses, 0)
}

/**
 * Calculate fleet-level net P&L
 */
export const fleetNetPL = (trips: { netPL: number }[]): number => {
  return trips.reduce((sum, t) => sum + t.netPL, 0)
}

/**
 * Calculate fleet-level total litres hauled
 */
export const fleetLitres = (trips: { deliveredLitres: number }[]): number => {
  return trips.reduce((sum, t) => sum + t.deliveredLitres, 0)
}

/**
 * Calculate per-truck P&L
 */
export const truckPL = (
  truckId: string,
  trips: { truckId: string; netPL: number }[]
): number => {
  return trips
    .filter((t) => t.truckId === truckId)
    .reduce((sum, t) => sum + t.netPL, 0)
}

/**
 * Calculate per-truck revenue
 */
export const truckRevenue = (
  truckId: string,
  trips: { truckId: string; revenue: number }[]
): number => {
  return trips
    .filter((t) => t.truckId === truckId)
    .reduce((sum, t) => sum + t.revenue, 0)
}

/**
 * Calculate per-truck expenses
 */
export const truckExpenses = (
  truckId: string,
  trips: { truckId: string; totalExpenses: number }[]
): number => {
  return trips
    .filter((t) => t.truckId === truckId)
    .reduce((sum, t) => sum + t.totalExpenses, 0)
}

/**
 * Calculate per-truck litres hauled
 */
export const truckLitres = (
  truckId: string,
  trips: { truckId: string; deliveredLitres: number }[]
): number => {
  return trips
    .filter((t) => t.truckId === truckId)
    .reduce((sum, t) => sum + t.deliveredLitres, 0)
}

/**
 * Count trips for a truck
 */
export const truckTripCount = (
  truckId: string,
  trips: { truckId: string }[]
): number => {
  return trips.filter((t) => t.truckId === truckId).length
}

/**
 * Check if a trip is gainful (profitable)
 */
export const isGain = (netPL: number): boolean => {
  return netPL >= 0
}

/**
 * Get trip status label
 */
export const plStatus = (netPL: number): 'gain' | 'loss' => {
  return netPL >= 0 ? 'gain' : 'loss'
}

/**
 * Calculate expense breakdown by category
 */
export const expensesByCategory = (
  trips: { expenses: { category: string; amount: number }[] }[]
): Record<string, number> => {
  const breakdown: Record<string, number> = {}

  trips.forEach((trip) => {
    trip.expenses.forEach((expense) => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount
    })
  })

  return breakdown
}

/**
 * Calculate average P&L per trip
 */
export const avgTripPL = (trips: { netPL: number }[]): number => {
  if (trips.length === 0) return 0
  return fleetNetPL(trips) / trips.length
}

/**
 * Calculate average revenue per litre
 */
export const avgRevenuePerLitre = (
  trips: { revenue: number; deliveredLitres: number }[]
): number => {
  const totalRevenue = fleetRevenue(trips)
  const totalLitres = fleetLitres(trips)

  if (totalLitres === 0) return 0
  return totalRevenue / totalLitres
}

/**
 * Centralized calculation object (same pattern as fuel-calcs)
 */
export const fleetCalc = {
  // Core trip P&L
  transitLoss,
  transitLossPct,
  haulageRevenue,
  totalExpenses,
  netTripPL,
  tripMarginPct,

  // Fleet-level aggregations
  fleetRevenue,
  fleetExpenses,
  fleetNetPL,
  fleetLitres,

  // Per-truck aggregations
  truckPL,
  truckRevenue,
  truckExpenses,
  truckLitres,
  truckTripCount,

  // Helpers
  isGain,
  plStatus,
  expensesByCategory,
  avgTripPL,
  avgRevenuePerLitre,
}
