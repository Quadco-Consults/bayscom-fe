'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock, Unlock, MapPin, Calendar } from 'lucide-react'
import { formatMonthYear, getMonthName } from '@/utils/fuel-format'

export interface MonthScopeBarProps {
  /** Currently selected station ID */
  stationId: string

  /** Currently selected month (1-12) */
  month: number

  /** Currently selected year */
  year: number

  /** Whether the current month is locked/approved */
  isLocked: boolean

  /** List of available stations */
  stations: Array<{ id: string; name: string; location?: string }>

  /** Callback when station changes */
  onStationChange: (stationId: string) => void

  /** Callback when month/year changes */
  onMonthChange: (month: number, year: number) => void

  /** Optional: Show lock/unlock toggle button (admin only) */
  showLockToggle?: boolean

  /** Optional: Callback when lock status is toggled */
  onLockToggle?: () => void

  /** Optional: Additional actions or buttons */
  actions?: React.ReactNode
}

/**
 * MonthScopeBar Component
 *
 * Station + month/year selector with lock status indicator.
 * Used at the top of all fuel operations pages to set the context.
 *
 * Features:
 * - Station dropdown selection
 * - Month/year navigation with prev/next buttons
 * - Lock status indicator (approved months are read-only)
 * - Optional lock toggle for admins
 * - Optional action buttons slot
 */
export function MonthScopeBar({
  stationId,
  month,
  year,
  isLocked,
  stations,
  onStationChange,
  onMonthChange,
  showLockToggle = false,
  onLockToggle,
  actions,
}: MonthScopeBarProps) {
  const [showStationDropdown, setShowStationDropdown] = useState(false)

  const selectedStation = stations.find((s) => s.id === stationId)

  const handlePreviousMonth = () => {
    if (month === 1) {
      onMonthChange(12, year - 1)
    } else {
      onMonthChange(month - 1, year)
    }
  }

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(1, year + 1)
    } else {
      onMonthChange(month + 1, year)
    }
  }

  const canNavigateNext = () => {
    // Don't allow navigating into the future
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1 // 0-indexed to 1-indexed

    if (year > currentYear) return false
    if (year === currentYear && month >= currentMonth) return false

    return true
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Station Selector */}
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div className="relative">
            <button
              onClick={() => setShowStationDropdown(!showStationDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-900">
                {selectedStation?.name || 'Select Station'}
              </span>
              {selectedStation?.location && (
                <span className="text-sm text-gray-500">({selectedStation.location})</span>
              )}
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showStationDropdown ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Station Dropdown */}
            {showStationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-1 max-h-64 overflow-y-auto">
                  {stations.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => {
                        onStationChange(station.id)
                        setShowStationDropdown(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        station.id === stationId
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-900'
                      }`}
                    >
                      <div className="font-medium">{station.name}</div>
                      {station.location && (
                        <div className="text-sm text-gray-500">{station.location}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Month/Year Navigator */}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />

          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg min-w-[180px] text-center">
            <span className="text-lg font-semibold text-gray-900">
              {formatMonthYear(month, year)}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={!canNavigateNext()}
            className={`p-2 rounded-lg transition-colors ${
              canNavigateNext()
                ? 'hover:bg-gray-100 text-gray-600'
                : 'cursor-not-allowed text-gray-300'
            }`}
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Lock Status + Actions */}
        <div className="flex items-center gap-3">
          {/* Lock Status Indicator */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isLocked
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Locked (Approved)</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span className="text-sm font-medium">Unlocked (Editable)</span>
              </>
            )}
          </div>

          {/* Optional Lock Toggle (Admin Only) */}
          {showLockToggle && onLockToggle && (
            <button
              onClick={onLockToggle}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                isLocked
                  ? 'bg-green-600 text-white hover:bg-green-700 border-green-600'
                  : 'bg-red-600 text-white hover:bg-red-700 border-red-600'
              }`}
            >
              {isLocked ? 'Unlock Month' : 'Lock Month'}
            </button>
          )}

          {/* Custom Actions Slot */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Lock Warning Banner */}
      {isLocked && (
        <div className="mt-3 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This month has been locked and approved. All fields are
            read-only. Contact your administrator to unlock if changes are needed.
          </p>
        </div>
      )}

      {/* Click Outside Handler */}
      {showStationDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowStationDropdown(false)}
        ></div>
      )}
    </div>
  )
}
