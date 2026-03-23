/**
 * Tank & Discharge Calculation Utilities
 * For Filling Station Underground Tank Management
 *
 * Uses Nigerian industry standard: DIP READING method
 * (wetted dipstick from bottom up - larger cm = more fuel)
 */

export interface ChartEntry {
  dipCm: number      // Depth reading from bottom - LARGER = MORE FUEL
  litres: number
}

export interface CalibrationChart {
  id: string
  type: 'truck_compartment' | 'tank_dip'
  label: string
  capacityLitres: number
  entries: ChartEntry[]
}

export interface CompartmentReading {
  compartmentNo: number
  dipReadingCm: number
  grossLitresFromChart: number
  waterDipCm: number
  waterLitres: number
  netFuelLitres: number
  temperatureC?: number
  temperatureCorrectedLitres?: number
  note?: string
}

export const tankCalc = {
  /**
   * Linear interpolation between two rows in a calibration chart.
   * Works for both truck compartment charts and tank dip charts.
   * Large cm = more fuel (Nigerian dip method — bottom-up reading).
   */
  chartLookup: (
    chart: ChartEntry[],
    dipReadingCm: number
  ): number | null => {
    if (!chart || chart.length === 0) return null

    const sorted = [...chart].sort((a, b) => a.dipCm - b.dipCm)
    const clamped = Math.max(
      sorted[0].dipCm,
      Math.min(sorted[sorted.length - 1].dipCm, dipReadingCm)
    )

    for (let i = 0; i < sorted.length - 1; i++) {
      if (clamped >= sorted[i].dipCm && clamped <= sorted[i + 1].dipCm) {
        const ratio =
          (clamped - sorted[i].dipCm) / (sorted[i + 1].dipCm - sorted[i].dipCm)
        return Math.round(
          sorted[i].litres + (sorted[i + 1].litres - sorted[i].litres) * ratio
        )
      }
    }

    return null
  },

  /**
   * Temperature correction (optional)
   * Reference temp is typically 15°C
   */
  temperatureCorrection: (
    rawLitres: number,
    observedTempC: number,
    referenceTempC = 15
  ): number =>
    Math.round(rawLitres * (1 - (observedTempC - referenceTempC) * 0.00035)),

  /**
   * Water bottom deduction
   * Calculates net fuel volume after subtracting water
   */
  netFuelVolume: (
    grossLitres: number,
    waterDipCm: number,
    chart: ChartEntry[]
  ): number => {
    const waterLitres = tankCalc.chartLookup(chart, waterDipCm) ?? 0
    return Math.max(0, grossLitres - waterLitres)
  },

  /**
   * Truck total — sum all compartment net fuel volumes
   */
  truckTotal: (compartments: CompartmentReading[]): number =>
    compartments.reduce((sum, c) => sum + c.netFuelLitres, 0),

  /**
   * Pre-discharge comparison
   * Difference between truck chart total and waybill quantity
   */
  preDischargeVariance: (truckTotal: number, waybillQty: number): number =>
    truckTotal - waybillQty,

  /**
   * Post-discharge variance
   * How much actually entered the tank
   */
  tankReceived: (postDipLitres: number, preDipLitres: number): number =>
    postDipLitres - preDipLitres,

  /**
   * Gross shortage
   * Difference between what truck had and what tank received
   */
  grossShortage: (truckTotal: number, tankReceived: number): number =>
    truckTotal - tankReceived,

  /**
   * Allowed transit loss
   * Typically 0.3% in Nigeria
   */
  allowedTransitLoss: (truckTotal: number, allowedPct: number): number =>
    Math.round(truckTotal * allowedPct),

  /**
   * Net shortage (chargeable)
   * Gross shortage minus allowed transit loss
   */
  netShortage: (grossShortage: number, allowedLoss: number): number =>
    Math.max(0, grossShortage - allowedLoss),

  /**
   * Shortage value in Naira
   */
  shortageValue: (netShortage: number, pricePerLitre: number): number =>
    Math.round(netShortage * pricePerLitre),

  /**
   * Variance status classification
   */
  varianceStatus: (
    grossShortage: number,
    allowedLoss: number
  ): 'excess_loss' | 'within_tolerance' | 'overage' => {
    if (grossShortage < 0) return 'overage'
    if (grossShortage <= allowedLoss) return 'within_tolerance'
    return 'excess_loss'
  },

  /**
   * Calculate fill percentage
   */
  fillPercentage: (currentLitres: number, capacityLitres: number): number => {
    if (capacityLitres === 0) return 0
    return Math.round((currentLitres / capacityLitres) * 100)
  },

  /**
   * Validate calibration chart entries
   * Returns array of validation errors, empty if valid
   */
  validateChartEntries: (entries: ChartEntry[]): string[] => {
    const errors: string[] = []

    if (entries.length < 2) {
      errors.push('Chart must have at least 2 entries')
      return errors
    }

    // Check monotonic increasing
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].dipCm <= entries[i - 1].dipCm) {
        errors.push(`Dip reading at row ${i + 1} must be greater than previous row`)
      }
      if (entries[i].litres <= entries[i - 1].litres) {
        errors.push(`Litres at row ${i + 1} must be greater than previous row`)
      }
    }

    // Check duplicates
    const dipCms = entries.map((e) => e.dipCm)
    if (new Set(dipCms).size !== dipCms.length) {
      errors.push('Duplicate dip readings found')
    }

    // Check first row
    if (entries[0].dipCm < 0) {
      errors.push('First dip reading must be >= 0 cm')
    }

    return errors
  },
}

/**
 * Format helpers
 */
export const tankFormat = {
  litres: (litres: number): string => `${litres.toLocaleString('en-NG')} L`,

  dipReading: (cm: number): string => `${cm.toFixed(1)} cm`,

  percentage: (pct: number): string => `${pct.toFixed(1)}%`,

  temperature: (tempC: number): string => `${tempC.toFixed(1)}°C`,

  naira: (amount: number): string => `₦${amount.toLocaleString('en-NG')}`,
}
