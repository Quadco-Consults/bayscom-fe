'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

/**
 * Truck Configuration
 */
export interface TruckConfig {
  id: string
  regNo: string // e.g. "T9829LA" - display identifier
  driver: string // primary assigned driver name
  capacityLitres: number // max load capacity e.g. 33000, 45000
  active: boolean // false = decommissioned, hidden from dropdowns
  notes?: string
}

/**
 * Location Rate Configuration
 */
export interface LocationRate {
  id: string
  stateName: string // e.g. "Kano", "FCT / Abuja"
  distanceKm: number // approximate distance from primary depot
  ratePerLitre: number // ₦ per litre charged for delivery to this state
  active: boolean
  notes?: string
}

/**
 * Expense Category Configuration
 */
export interface ExpenseCategory {
  id: string
  label: string // e.g. "Fuel / diesel", "Driver allowance", "Repairs"
  active: boolean
  sortOrder: number
}

/**
 * Fleet Configuration State
 */
export interface FleetConfigState {
  trucks: TruckConfig[]
  locationRates: LocationRate[]
  expenseCategories: ExpenseCategory[]
}

/**
 * Fleet Configuration Context
 */
interface FleetConfigContextType {
  config: FleetConfigState

  // Truck operations
  getTruck: (truckId: string) => TruckConfig | undefined
  getActiveTrucks: () => TruckConfig[]
  updateTruck: (truckId: string, updates: Partial<TruckConfig>) => void
  addTruck: (truck: Omit<TruckConfig, 'id'>) => void

  // Location rate operations
  getLocationRate: (rateId: string) => LocationRate | undefined
  getActiveLocationRates: () => LocationRate[]
  updateLocationRate: (rateId: string, updates: Partial<LocationRate>) => void
  addLocationRate: (rate: Omit<LocationRate, 'id'>) => void

  // Expense category operations
  getExpenseCategory: (categoryId: string) => ExpenseCategory | undefined
  getActiveExpenseCategories: () => ExpenseCategory[]
  updateExpenseCategory: (categoryId: string, updates: Partial<ExpenseCategory>) => void
  addExpenseCategory: (category: Omit<ExpenseCategory, 'id'>) => void

  // Config reload
  reloadConfig: () => Promise<void>
}

const FleetConfigContext = createContext<FleetConfigContextType | undefined>(undefined)

/**
 * Default Configuration Data
 */
const defaultConfig: FleetConfigState = {
  trucks: [
    {
      id: 'TRUCK-001',
      regNo: 'T9829LA',
      driver: 'Ibrahim Musa',
      capacityLitres: 33000,
      active: true,
      notes: 'Primary PMS hauler',
    },
    {
      id: 'TRUCK-002',
      regNo: 'BDG482XA',
      driver: 'Aliyu Hassan',
      capacityLitres: 45000,
      active: true,
      notes: 'Long-distance AGO specialist',
    },
    {
      id: 'TRUCK-003',
      regNo: 'ABJ903KJ',
      driver: 'Chinedu Okafor',
      capacityLitres: 33000,
      active: true,
    },
    {
      id: 'TRUCK-004',
      regNo: 'LAG215TR',
      driver: 'Mohammed Bello',
      capacityLitres: 33000,
      active: false,
      notes: 'Decommissioned - engine issues',
    },
  ],
  locationRates: [
    {
      id: 'RATE-001',
      stateName: 'Kano',
      distanceKm: 850,
      ratePerLitre: 38,
      active: true,
    },
    {
      id: 'RATE-002',
      stateName: 'FCT / Abuja',
      distanceKm: 720,
      ratePerLitre: 35,
      active: true,
    },
    {
      id: 'RATE-003',
      stateName: 'Kaduna',
      distanceKm: 680,
      ratePerLitre: 32,
      active: true,
    },
    {
      id: 'RATE-004',
      stateName: 'Sokoto',
      distanceKm: 920,
      ratePerLitre: 42,
      active: true,
    },
    {
      id: 'RATE-005',
      stateName: 'Jos',
      distanceKm: 750,
      ratePerLitre: 36,
      active: true,
    },
    {
      id: 'RATE-006',
      stateName: 'Benue',
      distanceKm: 650,
      ratePerLitre: 30,
      active: true,
    },
    {
      id: 'RATE-007',
      stateName: 'Enugu',
      distanceKm: 450,
      ratePerLitre: 25,
      active: true,
    },
    {
      id: 'RATE-008',
      stateName: 'Ogun',
      distanceKm: 120,
      ratePerLitre: 15,
      active: true,
    },
  ],
  expenseCategories: [
    {
      id: 'CAT-001',
      label: 'Fuel / Diesel',
      active: true,
      sortOrder: 1,
    },
    {
      id: 'CAT-002',
      label: 'Driver Allowance',
      active: true,
      sortOrder: 2,
    },
    {
      id: 'CAT-003',
      label: 'Tolls',
      active: true,
      sortOrder: 3,
    },
    {
      id: 'CAT-004',
      label: 'Loader Fees',
      active: true,
      sortOrder: 4,
    },
    {
      id: 'CAT-005',
      label: 'Repairs',
      active: true,
      sortOrder: 5,
    },
    {
      id: 'CAT-006',
      label: 'Tyre',
      active: true,
      sortOrder: 6,
    },
    {
      id: 'CAT-007',
      label: 'Other',
      active: true,
      sortOrder: 7,
    },
  ],
}

/**
 * FleetConfigProvider Component
 */
export function FleetConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FleetConfigState>(defaultConfig)

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = typeof window !== 'undefined' ? localStorage.getItem('fleet-config') : null
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error('Failed to parse saved fleet config:', error)
      }
    }
  }, [])

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('fleet-config', JSON.stringify(config))
  }, [config])

  // Truck operations
  const getTruck = (truckId: string) => {
    return config.trucks.find((t) => t.id === truckId)
  }

  const getActiveTrucks = () => {
    return config.trucks.filter((t) => t.active)
  }

  const updateTruck = (truckId: string, updates: Partial<TruckConfig>) => {
    setConfig((prev) => ({
      ...prev,
      trucks: prev.trucks.map((t) => (t.id === truckId ? { ...t, ...updates } : t)),
    }))
  }

  const addTruck = (truck: Omit<TruckConfig, 'id'>) => {
    const id = `TRUCK-${String(config.trucks.length + 1).padStart(3, '0')}`
    setConfig((prev) => ({
      ...prev,
      trucks: [...prev.trucks, { ...truck, id }],
    }))
  }

  // Location rate operations
  const getLocationRate = (rateId: string) => {
    return config.locationRates.find((r) => r.id === rateId)
  }

  const getActiveLocationRates = () => {
    return config.locationRates.filter((r) => r.active)
  }

  const updateLocationRate = (rateId: string, updates: Partial<LocationRate>) => {
    setConfig((prev) => ({
      ...prev,
      locationRates: prev.locationRates.map((r) =>
        r.id === rateId ? { ...r, ...updates } : r
      ),
    }))
  }

  const addLocationRate = (rate: Omit<LocationRate, 'id'>) => {
    const id = `RATE-${String(config.locationRates.length + 1).padStart(3, '0')}`
    setConfig((prev) => ({
      ...prev,
      locationRates: [...prev.locationRates, { ...rate, id }],
    }))
  }

  // Expense category operations
  const getExpenseCategory = (categoryId: string) => {
    return config.expenseCategories.find((c) => c.id === categoryId)
  }

  const getActiveExpenseCategories = () => {
    return config.expenseCategories
      .filter((c) => c.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const updateExpenseCategory = (
    categoryId: string,
    updates: Partial<ExpenseCategory>
  ) => {
    setConfig((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.map((c) =>
        c.id === categoryId ? { ...c, ...updates } : c
      ),
    }))
  }

  const addExpenseCategory = (category: Omit<ExpenseCategory, 'id'>) => {
    const id = `CAT-${String(config.expenseCategories.length + 1).padStart(3, '0')}`
    setConfig((prev) => ({
      ...prev,
      expenseCategories: [...prev.expenseCategories, { ...category, id }],
    }))
  }

  const reloadConfig = async () => {
    // In a real app, this would fetch from API
    // For now, just reload from localStorage
    const savedConfig = typeof window !== 'undefined' ? localStorage.getItem('fleet-config') : null
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }

  return (
    <FleetConfigContext.Provider
      value={{
        config,
        getTruck,
        getActiveTrucks,
        updateTruck,
        addTruck,
        getLocationRate,
        getActiveLocationRates,
        updateLocationRate,
        addLocationRate,
        getExpenseCategory,
        getActiveExpenseCategories,
        updateExpenseCategory,
        addExpenseCategory,
        reloadConfig,
      }}
    >
      {children}
    </FleetConfigContext.Provider>
  )
}

/**
 * useFleetConfig Hook
 */
export function useFleetConfig() {
  const context = useContext(FleetConfigContext)
  if (context === undefined) {
    throw new Error('useFleetConfig must be used within a FleetConfigProvider')
  }
  return context
}
