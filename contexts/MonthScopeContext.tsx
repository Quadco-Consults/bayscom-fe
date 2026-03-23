'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useFuelConfig } from './FuelConfigContext'

/**
 * Month Scope State
 */
interface MonthScopeState {
  /** Currently selected station ID */
  stationId: string

  /** Currently selected month (1-12) */
  month: number

  /** Currently selected year */
  year: number

  /** Whether the current month is locked */
  isLocked: boolean
}

/**
 * Month Scope Context
 */
interface MonthScopeContextType extends MonthScopeState {
  /** Set the active station */
  setStation: (stationId: string) => void

  /** Set the active month/year */
  setMonthYear: (month: number, year: number) => void

  /** Navigate to previous month */
  previousMonth: () => void

  /** Navigate to next month */
  nextMonth: () => void

  /** Check if can navigate to next month (don't go into future) */
  canNavigateNext: () => boolean

  /** Reset to current month */
  resetToCurrentMonth: () => void
}

const MonthScopeContext = createContext<MonthScopeContextType | undefined>(undefined)

/**
 * MonthScopeProvider Component
 *
 * Manages the active station and month/year scope for fuel operations.
 * Persists selection in localStorage and syncs with month lock status.
 */
export function MonthScopeProvider({ children }: { children: ReactNode }) {
  const { isMonthLocked, config } = useFuelConfig()

  // Get current month/year
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 0-indexed to 1-indexed
  const currentYear = now.getFullYear()

  // Initialize state from localStorage or defaults
  const [state, setState] = useState<MonthScopeState>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('month-scope') : null
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          stationId: parsed.stationId || config.stations[0]?.id || '',
          month: parsed.month || currentMonth,
          year: parsed.year || currentYear,
          isLocked: false, // Will be updated in useEffect
        }
      } catch (error) {
        console.error('Failed to parse saved month scope:', error)
      }
    }

    return {
      stationId: config.stations[0]?.id || '',
      month: currentMonth,
      year: currentYear,
      isLocked: false,
    }
  })

  // Update lock status whenever month/year/station changes
  useEffect(() => {
    const locked = isMonthLocked(state.stationId, state.month, state.year)
    setState((prev) => ({ ...prev, isLocked: locked }))
  }, [state.stationId, state.month, state.year, isMonthLocked])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(
      'month-scope',
      JSON.stringify({
        stationId: state.stationId,
        month: state.month,
        year: state.year,
      })
    )
  }, [state])

  const setStation = (stationId: string) => {
    setState((prev) => ({ ...prev, stationId }))
  }

  const setMonthYear = (month: number, year: number) => {
    setState((prev) => ({ ...prev, month, year }))
  }

  const previousMonth = () => {
    setState((prev) => {
      if (prev.month === 1) {
        return { ...prev, month: 12, year: prev.year - 1 }
      }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setState((prev) => {
      // Don't navigate into the future
      if (prev.year > currentYear) return prev
      if (prev.year === currentYear && prev.month >= currentMonth) return prev

      if (prev.month === 12) {
        return { ...prev, month: 1, year: prev.year + 1 }
      }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const canNavigateNext = (): boolean => {
    if (state.year > currentYear) return false
    if (state.year === currentYear && state.month >= currentMonth) return false
    return true
  }

  const resetToCurrentMonth = () => {
    setState((prev) => ({
      ...prev,
      month: currentMonth,
      year: currentYear,
    }))
  }

  return (
    <MonthScopeContext.Provider
      value={{
        ...state,
        setStation,
        setMonthYear,
        previousMonth,
        nextMonth,
        canNavigateNext,
        resetToCurrentMonth,
      }}
    >
      {children}
    </MonthScopeContext.Provider>
  )
}

/**
 * useMonthScope Hook
 */
export function useMonthScope() {
  const context = useContext(MonthScopeContext)
  if (context === undefined) {
    throw new Error('useMonthScope must be used within a MonthScopeProvider')
  }
  return context
}
