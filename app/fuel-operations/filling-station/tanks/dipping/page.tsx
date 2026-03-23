'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { Save, Clock, Droplet, Info } from 'lucide-react'
import { tankCalc, tankFormat } from '@/utils/tank-calcs'
import type { ChartEntry } from '@/utils/tank-calcs'

interface TankDipReading {
  tankId: string
  tankLabel: string
  product: 'PMS' | 'AGO' | 'DPK'
  dipReadingCm: string
  volumeLitres: number
  waterDipCm: string
  waterLitres: number
  netFuelLitres: number
  temperatureC: string
  readBy: string
}

export default function DailyDippingPage() {
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0])
  const [readingType, setReadingType] = useState<'morning' | 'evening'>('morning')

  // Mock calibration charts (in production, fetch from config)
  const tankCharts: Record<string, ChartEntry[]> = {
    'PMS-T1': [
      { dipCm: 0, litres: 0 },
      { dipCm: 50, litres: 5500 },
      { dipCm: 100, litres: 12000 },
      { dipCm: 150, litres: 19500 },
      { dipCm: 200, litres: 28000 },
      { dipCm: 250, litres: 37500 },
      { dipCm: 280, litres: 45000 },
    ],
    'AGO-T1': [
      { dipCm: 0, litres: 0 },
      { dipCm: 40, litres: 4200 },
      { dipCm: 80, litres: 9500 },
      { dipCm: 120, litres: 15800 },
      { dipCm: 160, litres: 22500 },
      { dipCm: 200, litres: 29800 },
      { dipCm: 220, litres: 33000 },
    ],
    'DPK-T1': [
      { dipCm: 0, litres: 0 },
      { dipCm: 30, litres: 2800 },
      { dipCm: 60, litres: 6200 },
      { dipCm: 90, litres: 10100 },
      { dipCm: 120, litres: 14500 },
      { dipCm: 150, litres: 19200 },
      { dipCm: 160, litres: 20000 },
    ],
  }

  const [readings, setReadings] = useState<TankDipReading[]>([
    {
      tankId: 'PMS-T1',
      tankLabel: 'PMS Tank 1',
      product: 'PMS',
      dipReadingCm: '195',
      volumeLitres: 0,
      waterDipCm: '2',
      waterLitres: 0,
      netFuelLitres: 0,
      temperatureC: '',
      readBy: '',
    },
    {
      tankId: 'AGO-T1',
      tankLabel: 'AGO Tank 1',
      product: 'AGO',
      dipReadingCm: '48',
      volumeLitres: 0,
      waterDipCm: '1.5',
      waterLitres: 0,
      netFuelLitres: 0,
      temperatureC: '',
      readBy: '',
    },
    {
      tankId: 'DPK-T1',
      tankLabel: 'DPK Tank 1',
      product: 'DPK',
      dipReadingCm: '112',
      volumeLitres: 0,
      waterDipCm: '1',
      waterLitres: 0,
      netFuelLitres: 0,
      temperatureC: '',
      readBy: '',
    },
  ])

  const updateReading = (tankId: string, field: keyof TankDipReading, value: string) => {
    setReadings(
      readings.map((reading) => {
        if (reading.tankId !== tankId) return reading

        const updated = { ...reading, [field]: value }
        const chart = tankCharts[tankId]

        // Auto-calculate volume from chart when dip reading changes
        if (field === 'dipReadingCm') {
          const dipCm = parseFloat(value) || 0
          const litres = tankCalc.chartLookup(chart, dipCm) ?? 0
          updated.volumeLitres = litres
        }

        // Auto-calculate water litres when water dip changes
        if (field === 'waterDipCm') {
          const waterCm = parseFloat(value) || 0
          const waterLitres = tankCalc.chartLookup(chart, waterCm) ?? 0
          updated.waterLitres = waterLitres
        }

        // Calculate net fuel
        updated.netFuelLitres = Math.max(0, updated.volumeLitres - updated.waterLitres)

        return updated
      })
    )
  }

  // Initialize calculations on mount
  useState(() => {
    setReadings(
      readings.map((reading) => {
        const chart = tankCharts[reading.tankId]
        const dipCm = parseFloat(reading.dipReadingCm) || 0
        const waterCm = parseFloat(reading.waterDipCm) || 0

        const volumeLitres = tankCalc.chartLookup(chart, dipCm) ?? 0
        const waterLitres = tankCalc.chartLookup(chart, waterCm) ?? 0
        const netFuelLitres = Math.max(0, volumeLitres - waterLitres)

        return {
          ...reading,
          volumeLitres,
          waterLitres,
          netFuelLitres,
        }
      })
    )
  })

  const handleSave = async () => {
    // In production, save to API and update stock reconciliation PHYSICAL column
    console.log('Saving dip readings:', { readingDate, readingType, readings })
    alert('Dip readings saved successfully!')
  }

  const getProductColor = (product: 'PMS' | 'AGO' | 'DPK') => {
    switch (product) {
      case 'PMS':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' }
      case 'AGO':
        return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' }
      case 'DPK':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
    }
  }

  const defaultTime = readingType === 'morning' ? '06:00' : '18:00'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Tank Dipping</h1>
          <p className="text-sm text-gray-500 mt-1">Record morning and evening tank dip readings</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Readings
        </button>
      </div>

      {/* Reading Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={readingDate}
              onChange={(e) => setReadingDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reading Type</label>
            <select
              value={readingType}
              onChange={(e) => setReadingType(e.target.value as 'morning' | 'evening')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="morning">Morning (06:00)</option>
              <option value="evening">Evening (18:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{defaultTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Dip Reading Method (Nigerian Standard)</h3>
          <p className="text-sm text-blue-800">
            Lower the dip rod to the tank floor, hold for 3-5 seconds, then pull straight up. Read the wetted mark
            in centimetres. <strong>Larger cm = more fuel</strong> (bottom-up reading method).
          </p>
        </div>
      </div>

      {/* Tank Dip Entry Panels */}
      <div className="space-y-4">
        {readings.map((reading) => {
          const productColor = getProductColor(reading.product)

          return (
            <div key={reading.tankId} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Tank Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Droplet className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{reading.tankLabel}</h2>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium border rounded ${productColor.bg} ${productColor.text} ${productColor.border}`}>
                    {reading.product}
                  </span>
                </div>
              </div>

              {/* Reading Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Dip Reading */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dip Reading (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={reading.dipReadingCm}
                    onChange={(e) => updateReading(reading.tankId, 'dipReadingCm', e.target.value)}
                    step="0.1"
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Volume from Chart (Auto-calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume from Chart (L)</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold">
                    {tankFormat.litres(reading.volumeLitres)}
                  </div>
                </div>

                {/* Water Dip */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Water Dip (cm)</label>
                  <input
                    type="number"
                    value={reading.waterDipCm}
                    onChange={(e) => updateReading(reading.tankId, 'waterDipCm', e.target.value)}
                    step="0.1"
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Temperature (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                  <input
                    type="number"
                    value={reading.temperatureC}
                    onChange={(e) => updateReading(reading.tankId, 'temperatureC', e.target.value)}
                    step="0.1"
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Calculated Results */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Gross Volume (from chart)</p>
                    <p className="text-lg font-semibold text-gray-900">{tankFormat.litres(reading.volumeLitres)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Less: Water Volume</p>
                    <p className="text-lg font-semibold text-amber-600">
                      {reading.waterLitres > 0 ? `−${tankFormat.litres(reading.waterLitres)}` : '—'}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-700 mb-1">Net Fuel Volume</p>
                    <p className="text-xl font-bold text-blue-900">{tankFormat.litres(reading.netFuelLitres)}</p>
                  </div>
                </div>
              </div>

              {/* Read By */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reading.readBy}
                  onChange={(e) => updateReading(reading.tankId, 'readBy', e.target.value)}
                  placeholder="Officer name"
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Auto-Update Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-900 mb-1">Auto-Updates Stock Reconciliation</h3>
          <p className="text-sm text-green-800">
            When you save these readings, the <strong>PHYSICAL</strong> column on the stock reconciliation sheet
            for {new Date(readingDate).toLocaleDateString('en-NG', { month: 'long', day: 'numeric' })} will be
            automatically updated. No manual entry required.
          </p>
        </div>
      </div>
    </div>
  )
}
