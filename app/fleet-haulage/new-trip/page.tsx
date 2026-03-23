'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ExpenseLineItems, TripPLPreview, ProductBadge } from '@/components/fleet/shared'
import type { ExpenseItem } from '@/components/fleet/shared'
import { useFleetConfig } from '@/contexts/FleetConfigContext'
import { Truck, Save, X } from 'lucide-react'
import { fleetCalc } from '@/utils/fleet-calcs'
import { formatNGN } from '@/utils/fleet-format'

interface TripFormData {
  truckId: string
  product: 'PMS' | 'AGO' | 'DPK'
  loadingDepot: string
  dischargeLocationId: string
  loadedLitres: number
  deliveredLitres: number
  ratePerLitre: number
  expenses: ExpenseItem[]
  tripDate: string
  notes: string
}

/**
 * Fleet & Haulage - New Trip Form
 *
 * Primary data entry page for recording haulage trips
 * - Select truck, product, and route
 * - Enter loaded and delivered litres
 * - Add expense line items
 * - Real-time P&L preview
 * - Auto-rate selection based on destination
 */
export default function NewTripPage() {
  const router = useRouter()
  const { config, getActiveTrucks, getActiveLocationRates, getActiveExpenseCategories } =
    useFleetConfig()

  const activeTrucks = getActiveTrucks()
  const activeLocations = getActiveLocationRates()
  const expenseCategories = getActiveExpenseCategories().map((c) => c.label)

  const [formData, setFormData] = useState<TripFormData>({
    truckId: activeTrucks[0]?.id || '',
    product: 'PMS',
    loadingDepot: 'Warri Depot',
    dischargeLocationId: activeLocations[0]?.id || '',
    loadedLitres: 0,
    deliveredLitres: 0,
    ratePerLitre: activeLocations[0]?.ratePerLitre || 0,
    expenses: [],
    tripDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  // Update rate when location changes
  const handleLocationChange = (locationId: string) => {
    const location = config.locationRates.find((l) => l.id === locationId)
    setFormData((prev) => ({
      ...prev,
      dischargeLocationId: locationId,
      ratePerLitre: location?.ratePerLitre || 0,
    }))
  }

  const handleExpensesChange = (expenses: ExpenseItem[]) => {
    setFormData((prev) => ({ ...prev, expenses }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Calculate trip P&L
      const revenue = fleetCalc.haulageRevenue(formData.deliveredLitres, formData.ratePerLitre)
      const totalExpenses = fleetCalc.totalExpenses(formData.expenses)
      const netPL = fleetCalc.netTripPL(revenue, totalExpenses)
      const transitLoss = fleetCalc.transitLoss(formData.loadedLitres, formData.deliveredLitres)
      const transitLossPct = fleetCalc.transitLossPct(
        formData.loadedLitres,
        formData.deliveredLitres
      )

      // Get truck and location details
      const truck = config.trucks.find((t) => t.id === formData.truckId)
      const location = config.locationRates.find((l) => l.id === formData.dischargeLocationId)

      // Create trip record
      const tripRecord = {
        id: `TRIP-${Date.now()}`,
        date: formData.tripDate,
        truckId: formData.truckId,
        truckRegNo: truck?.regNo || '',
        product: formData.product,
        loadingDepot: formData.loadingDepot,
        dischargeLocationId: formData.dischargeLocationId,
        dischargeLocation: location?.stateName || '',
        loadedLitres: formData.loadedLitres,
        deliveredLitres: formData.deliveredLitres,
        transitLossLitres: transitLoss,
        transitLossPct: transitLossPct,
        ratePerLitre: formData.ratePerLitre,
        revenue,
        expenses: formData.expenses,
        totalExpenses,
        netPL,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage (in production, this would be an API call)
      const existingTrips = JSON.parse(localStorage.getItem('fleet-trips') || '[]')
      existingTrips.push(tripRecord)
      localStorage.setItem('fleet-trips', JSON.stringify(existingTrips))

      // Redirect to trip log
      router.push('/fleet-haulage/trip-log')
    } catch (error) {
      console.error('Failed to save trip:', error)
      alert('Failed to save trip. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedLocation = config.locationRates.find(
    (l) => l.id === formData.dischargeLocationId
  )
  const selectedTruck = config.trucks.find((t) => t.id === formData.truckId)

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Record New Trip</h1>
              <p className="text-sm text-gray-500">Enter haulage trip details and expenses</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6">
            {/* Main Form (2 columns) */}
            <div className="col-span-2 space-y-6">
              {/* Trip Details Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Trip Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trip Date *
                    </label>
                    <input
                      type="date"
                      value={formData.tripDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, tripDate: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Truck Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Truck *
                    </label>
                    <select
                      value={formData.truckId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, truckId: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {activeTrucks.map((truck) => (
                        <option key={truck.id} value={truck.id}>
                          {truck.regNo} - {truck.driver} ({truck.capacityLitres.toLocaleString()}L)
                        </option>
                      ))}
                    </select>
                    {selectedTruck && (
                      <p className="text-xs text-gray-500 mt-1">
                        Driver: {selectedTruck.driver} | Capacity:{' '}
                        {selectedTruck.capacityLitres.toLocaleString()}L
                      </p>
                    )}
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product *
                    </label>
                    <div className="flex gap-3">
                      {(['PMS', 'AGO', 'DPK'] as const).map((product) => (
                        <button
                          key={product}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, product }))}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                            formData.product === product
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {product}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loading Depot */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loading Depot *
                    </label>
                    <input
                      type="text"
                      value={formData.loadingDepot}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, loadingDepot: e.target.value }))
                      }
                      placeholder="e.g., Warri Depot"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Discharge Location */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discharge Location *
                    </label>
                    <select
                      value={formData.dischargeLocationId}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {activeLocations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.stateName} - {formatNGN(location.ratePerLitre)}/L (~
                          {location.distanceKm}km)
                        </option>
                      ))}
                    </select>
                    {selectedLocation && (
                      <p className="text-xs text-gray-500 mt-1">
                        Rate: {formatNGN(selectedLocation.ratePerLitre)}/L | Distance: ~
                        {selectedLocation.distanceKm}km
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Details Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quantity Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Loaded Litres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loaded Litres *
                    </label>
                    <input
                      type="number"
                      value={formData.loadedLitres || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          loadedLitres: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Delivered Litres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivered Litres *
                    </label>
                    <input
                      type="number"
                      value={formData.deliveredLitres || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveredLitres: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Transit Loss Display */}
                  {formData.loadedLitres > 0 && formData.deliveredLitres > 0 && (
                    <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Transit Loss</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {fleetCalc
                              .transitLoss(formData.loadedLitres, formData.deliveredLitres)
                              .toLocaleString()}{' '}
                            L
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Loss Percentage</p>
                          <p
                            className={`text-lg font-semibold ${
                              fleetCalc.transitLossPct(
                                formData.loadedLitres,
                                formData.deliveredLitres
                              ) > 1
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {fleetCalc
                              .transitLossPct(formData.loadedLitres, formData.deliveredLitres)
                              .toFixed(2)}
                            %
                          </p>
                        </div>
                      </div>
                      {fleetCalc.transitLossPct(formData.loadedLitres, formData.deliveredLitres) >
                        1 && (
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ Transit loss exceeds 1% threshold
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <ExpenseLineItems
                  items={formData.expenses}
                  onChange={handleExpensesChange}
                  categories={expenseCategories}
                />
              </div>

              {/* Notes Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional trip notes or remarks..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Trip'}
                </button>
              </div>
            </div>

            {/* P&L Preview Panel (1 column) */}
            <div className="col-span-1">
              <TripPLPreview
                loadedLitres={formData.loadedLitres}
                deliveredLitres={formData.deliveredLitres}
                ratePerLitre={formData.ratePerLitre}
                expenses={formData.expenses}
              />
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
