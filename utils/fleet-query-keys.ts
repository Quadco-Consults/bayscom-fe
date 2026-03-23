/**
 * Fleet & Haulage - React Query Key Factory
 *
 * Centralized query key definitions for consistent cache management.
 * Follows the React Query best practices for key structure.
 */

export const fleetKeys = {
  // Root key for all fleet queries
  all: ['fleet'] as const,

  // Trips
  trips: (month: number, year: number) =>
    [...fleetKeys.all, 'trips', month, year] as const,

  tripsForTruck: (truckId: string, month: number, year: number) =>
    [...fleetKeys.all, 'trips', truckId, month, year] as const,

  trip: (tripId: string) => [...fleetKeys.all, 'trip', tripId] as const,

  tripsAll: () => [...fleetKeys.all, 'trips'] as const,

  // Trucks
  trucks: () => [...fleetKeys.all, 'config', 'trucks'] as const,

  truck: (truckId: string) =>
    [...fleetKeys.all, 'config', 'trucks', truckId] as const,

  activeTrucks: () =>
    [...fleetKeys.all, 'config', 'trucks', 'active'] as const,

  // Location Rates
  rates: () => [...fleetKeys.all, 'config', 'rates'] as const,

  rate: (rateId: string) =>
    [...fleetKeys.all, 'config', 'rates', rateId] as const,

  activeRates: () =>
    [...fleetKeys.all, 'config', 'rates', 'active'] as const,

  // Expense Categories
  expenseCategories: () =>
    [...fleetKeys.all, 'config', 'expense-categories'] as const,

  activeExpenseCategories: () =>
    [...fleetKeys.all, 'config', 'expense-categories', 'active'] as const,

  // Dashboard / Reports
  dashboard: (month: number, year: number) =>
    [...fleetKeys.all, 'dashboard', month, year] as const,

  plSummary: (month: number, year: number) =>
    [...fleetKeys.all, 'reports', 'pl', month, year] as const,

  truckPerformance: (month: number, year: number) =>
    [...fleetKeys.all, 'reports', 'truck-performance', month, year] as const,
}

/**
 * Helper to invalidate all fleet data
 */
export const invalidateAllFleetData = () => fleetKeys.all

/**
 * Helper to invalidate trips for a specific period
 */
export const invalidateTripsForPeriod = (month: number, year: number) =>
  fleetKeys.trips(month, year)

/**
 * Helper to invalidate configuration data
 */
export const invalidateFleetConfig = () =>
  [fleetKeys.trucks(), fleetKeys.rates(), fleetKeys.expenseCategories()] as const
