'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

/**
 * Payment Channel Configuration
 */
export interface PaymentChannel {
  id: string
  name: string
  enabled: boolean
  displayOrder: number
}

/**
 * Product Configuration
 */
export interface ProductConfig {
  code: string // PMS, AGO, DPK, LPG
  name: string
  defaultPrice: number
  unit: 'Ltrs' | 'Kg'
  tankCapacity?: number
  enabled: boolean
}

/**
 * Station Configuration
 */
export interface StationConfig {
  id: string
  name: string
  location: string
  type: 'filling-station' | 'lpg-section' | 'ago-peddling'
  products: ProductConfig[]
  paymentChannels: PaymentChannel[]
  transitLossThreshold: number // % allowed
}

/**
 * Expense Category Configuration
 */
export interface ExpenseCategory {
  id: string
  name: string
  type: 'filling-station' | 'lpg' | 'ago-peddling' | 'all'
  enabled: boolean
}

/**
 * Monthly Price Override
 */
export interface MonthlyPriceOverride {
  productCode: string
  month: number // 1-12
  year: number
  price: number
  approvedBy?: string
  approvedAt?: string
}

/**
 * Month Lock Status
 */
export interface MonthLockStatus {
  month: number
  year: number
  stationId: string
  isLocked: boolean
  lockedBy?: string
  lockedAt?: string
}

/**
 * Fuel Configuration State
 */
export interface FuelConfigState {
  stations: StationConfig[]
  expenseCategories: ExpenseCategory[]
  monthlyPriceOverrides: MonthlyPriceOverride[]
  monthLocks: MonthLockStatus[]
}

/**
 * Fuel Configuration Context
 */
interface FuelConfigContextType {
  config: FuelConfigState

  // Station operations
  getStation: (stationId: string) => StationConfig | undefined
  updateStation: (stationId: string, updates: Partial<StationConfig>) => void

  // Product operations
  getProductPrice: (
    productCode: string,
    stationId: string,
    month: number,
    year: number
  ) => number
  setMonthlyPriceOverride: (override: MonthlyPriceOverride) => void

  // Payment channel operations
  getPaymentChannels: (stationId: string) => PaymentChannel[]

  // Expense category operations
  getExpenseCategories: (
    type: 'filling-station' | 'lpg' | 'ago-peddling'
  ) => ExpenseCategory[]

  // Month lock operations
  isMonthLocked: (stationId: string, month: number, year: number) => boolean
  lockMonth: (stationId: string, month: number, year: number) => void
  unlockMonth: (stationId: string, month: number, year: number) => void

  // Config reload
  reloadConfig: () => Promise<void>
}

const FuelConfigContext = createContext<FuelConfigContextType | undefined>(undefined)

/**
 * Default Configuration Data
 */
const defaultConfig: FuelConfigState = {
  stations: [
    {
      id: 'STATION-001',
      name: 'Bayscom Energy - Main Station',
      location: 'Lagos',
      type: 'filling-station',
      transitLossThreshold: 0.5, // 0.5%
      products: [
        {
          code: 'PMS',
          name: 'Premium Motor Spirit (Petrol)',
          defaultPrice: 617,
          unit: 'Ltrs',
          tankCapacity: 50000,
          enabled: true,
        },
        {
          code: 'AGO',
          name: 'Automotive Gas Oil (Diesel)',
          defaultPrice: 1140,
          unit: 'Ltrs',
          tankCapacity: 40000,
          enabled: true,
        },
        {
          code: 'DPK',
          name: 'Dual Purpose Kerosene',
          defaultPrice: 950,
          unit: 'Ltrs',
          tankCapacity: 30000,
          enabled: true,
        },
      ],
      paymentChannels: [
        { id: 'cash', name: 'Cash', enabled: true, displayOrder: 1 },
        { id: 'pos', name: 'POS', enabled: true, displayOrder: 2 },
        { id: 'transfer', name: 'Transfer', enabled: true, displayOrder: 3 },
        { id: 'opay', name: 'OPay', enabled: true, displayOrder: 4 },
        { id: 'palmpay', name: 'PalmPay', enabled: true, displayOrder: 5 },
        { id: 'moniepoint', name: 'Moniepoint', enabled: true, displayOrder: 6 },
      ],
    },
    {
      id: 'LPG-001',
      name: 'Bayscom Energy - LPG Section',
      location: 'Lagos',
      type: 'lpg-section',
      transitLossThreshold: 0.3,
      products: [
        {
          code: 'LPG',
          name: 'Liquefied Petroleum Gas',
          defaultPrice: 850,
          unit: 'Kg',
          tankCapacity: 10000,
          enabled: true,
        },
      ],
      paymentChannels: [
        { id: 'cash', name: 'Cash', enabled: true, displayOrder: 1 },
        { id: 'pos', name: 'POS', enabled: true, displayOrder: 2 },
        { id: 'transfer', name: 'Transfer', enabled: true, displayOrder: 3 },
      ],
    },
    {
      id: 'AGO-PEDDLING-001',
      name: 'Bayscom Energy - AGO Peddling',
      location: 'Lagos',
      type: 'ago-peddling',
      transitLossThreshold: 0.5,
      products: [
        {
          code: 'AGO',
          name: 'Automotive Gas Oil (Diesel)',
          defaultPrice: 1140,
          unit: 'Ltrs',
          enabled: true,
        },
      ],
      paymentChannels: [
        { id: 'cash', name: 'Cash', enabled: true, displayOrder: 1 },
        { id: 'transfer', name: 'Transfer', enabled: true, displayOrder: 2 },
        { id: 'credit', name: 'Credit (Debtors)', enabled: true, displayOrder: 3 },
      ],
    },
  ],
  expenseCategories: [
    { id: 'EXP-001', name: 'Rent', type: 'all', enabled: true },
    { id: 'EXP-002', name: 'Salaries', type: 'all', enabled: true },
    { id: 'EXP-003', name: 'Electricity', type: 'all', enabled: true },
    { id: 'EXP-004', name: 'Security', type: 'all', enabled: true },
    { id: 'EXP-005', name: 'Maintenance', type: 'all', enabled: true },
    { id: 'EXP-006', name: 'Transport', type: 'all', enabled: true },
    { id: 'EXP-007', name: 'Bank Charges', type: 'all', enabled: true },
    { id: 'EXP-008', name: 'Staff Welfare', type: 'all', enabled: true },
    { id: 'EXP-009', name: 'Cylinder Refills', type: 'lpg', enabled: true },
    { id: 'EXP-010', name: 'Truck Fuel', type: 'ago-peddling', enabled: true },
  ],
  monthlyPriceOverrides: [],
  monthLocks: [],
}

/**
 * FuelConfigProvider Component
 */
export function FuelConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FuelConfigState>(defaultConfig)

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = typeof window !== 'undefined' ? localStorage.getItem('fuel-config') : null
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error('Failed to parse saved config:', error)
      }
    }
  }, [])

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('fuel-config', JSON.stringify(config))
  }, [config])

  const getStation = (stationId: string) => {
    return config.stations.find((s) => s.id === stationId)
  }

  const updateStation = (stationId: string, updates: Partial<StationConfig>) => {
    setConfig((prev) => ({
      ...prev,
      stations: prev.stations.map((s) =>
        s.id === stationId ? { ...s, ...updates } : s
      ),
    }))
  }

  const getProductPrice = (
    productCode: string,
    stationId: string,
    month: number,
    year: number
  ): number => {
    // Check for monthly price override first
    const override = config.monthlyPriceOverrides.find(
      (o) => o.productCode === productCode && o.month === month && o.year === year
    )

    if (override) {
      return override.price
    }

    // Fall back to station default price
    const station = getStation(stationId)
    const product = station?.products.find((p) => p.code === productCode)

    return product?.defaultPrice || 0
  }

  const setMonthlyPriceOverride = (override: MonthlyPriceOverride) => {
    setConfig((prev) => {
      // Remove existing override for same product/month/year
      const filtered = prev.monthlyPriceOverrides.filter(
        (o) =>
          !(
            o.productCode === override.productCode &&
            o.month === override.month &&
            o.year === override.year
          )
      )

      return {
        ...prev,
        monthlyPriceOverrides: [...filtered, override],
      }
    })
  }

  const getPaymentChannels = (stationId: string): PaymentChannel[] => {
    const station = getStation(stationId)
    return station?.paymentChannels.filter((c) => c.enabled).sort((a, b) => a.displayOrder - b.displayOrder) || []
  }

  const getExpenseCategories = (
    type: 'filling-station' | 'lpg' | 'ago-peddling'
  ): ExpenseCategory[] => {
    return config.expenseCategories
      .filter((c) => c.enabled && (c.type === type || c.type === 'all'))
      .map((c) => c)
  }

  const isMonthLocked = (stationId: string, month: number, year: number): boolean => {
    const lock = config.monthLocks.find(
      (l) => l.stationId === stationId && l.month === month && l.year === year
    )
    return lock?.isLocked || false
  }

  const lockMonth = (stationId: string, month: number, year: number) => {
    setConfig((prev) => {
      const existing = prev.monthLocks.find(
        (l) => l.stationId === stationId && l.month === month && l.year === year
      )

      if (existing) {
        return {
          ...prev,
          monthLocks: prev.monthLocks.map((l) =>
            l === existing
              ? { ...l, isLocked: true, lockedAt: new Date().toISOString() }
              : l
          ),
        }
      }

      return {
        ...prev,
        monthLocks: [
          ...prev.monthLocks,
          {
            stationId,
            month,
            year,
            isLocked: true,
            lockedAt: new Date().toISOString(),
          },
        ],
      }
    })
  }

  const unlockMonth = (stationId: string, month: number, year: number) => {
    setConfig((prev) => ({
      ...prev,
      monthLocks: prev.monthLocks.map((l) =>
        l.stationId === stationId && l.month === month && l.year === year
          ? { ...l, isLocked: false }
          : l
      ),
    }))
  }

  const reloadConfig = async () => {
    // In a real app, this would fetch from API
    // For now, just reload from localStorage
    const savedConfig = typeof window !== 'undefined' ? localStorage.getItem('fuel-config') : null
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }

  return (
    <FuelConfigContext.Provider
      value={{
        config,
        getStation,
        updateStation,
        getProductPrice,
        setMonthlyPriceOverride,
        getPaymentChannels,
        getExpenseCategories,
        isMonthLocked,
        lockMonth,
        unlockMonth,
        reloadConfig,
      }}
    >
      {children}
    </FuelConfigContext.Provider>
  )
}

/**
 * useFuelConfig Hook
 */
export function useFuelConfig() {
  const context = useContext(FuelConfigContext)
  if (context === undefined) {
    throw new Error('useFuelConfig must be used within a FuelConfigProvider')
  }
  return context
}
