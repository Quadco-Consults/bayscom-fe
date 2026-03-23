'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { Save, AlertTriangle, Calendar } from 'lucide-react'

interface InventoryRecord {
  date: string
  openingStock: number
  purchases: number
  sales: number
  adjustments: number
  closingStock: number
  variance: number
}

export default function AGOInventoryPage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  // Storage capacity
  const tankCapacity = 33000 // litres
  const reorderLevel = 8000 // litres

  // Mock inventory data
  const [inventory] = useState<InventoryRecord>({
    date: new Date().toISOString().split('T')[0],
    openingStock: 12500,
    purchases: 66000, // 2 refills this month
    sales: 57250,
    adjustments: -150, // evaporation/spillage
    closingStock: 21100,
    variance: 0,
  })

  // Calculate metrics
  const fillPercentage = (inventory.closingStock / tankCapacity) * 100
  const daysOfStock = inventory.closingStock / (inventory.sales / 30) // Approx days remaining

  const getStockStatus = () => {
    if (inventory.closingStock < reorderLevel) {
      return { status: 'critical', color: 'red', message: 'Stock below reorder level - urgent refill needed' }
    } else if (inventory.closingStock < reorderLevel * 1.5) {
      return { status: 'low', color: 'amber', message: 'Stock running low - plan refill soon' }
    } else {
      return { status: 'adequate', color: 'green', message: 'Stock level adequate' }
    }
  }

  const stockStatus = getStockStatus()

  const formatLitres = (litres: number) => `${litres.toLocaleString('en-NG')} L`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AGO Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor diesel stock levels and movements</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Month Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2026, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Status Alert */}
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border ${
          stockStatus.color === 'red'
            ? 'bg-red-50 border-red-200'
            : stockStatus.color === 'amber'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-green-50 border-green-200'
        }`}
      >
        <AlertTriangle
          className={`h-5 w-5 mt-0.5 ${
            stockStatus.color === 'red'
              ? 'text-red-600'
              : stockStatus.color === 'amber'
              ? 'text-amber-600'
              : 'text-green-600'
          }`}
        />
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold ${
              stockStatus.color === 'red'
                ? 'text-red-900'
                : stockStatus.color === 'amber'
                ? 'text-amber-900'
                : 'text-green-900'
            }`}
          >
            {stockStatus.status === 'critical'
              ? 'Critical Stock Level'
              : stockStatus.status === 'low'
              ? 'Low Stock Level'
              : 'Adequate Stock Level'}
          </h3>
          <p
            className={`text-sm mt-1 ${
              stockStatus.color === 'red'
                ? 'text-red-700'
                : stockStatus.color === 'amber'
                ? 'text-amber-700'
                : 'text-green-700'
            }`}
          >
            {stockStatus.message}
          </p>
        </div>
      </div>

      {/* Current Stock Card */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Current AGO Stock</p>
            <p className="text-4xl font-bold">{formatLitres(inventory.closingStock)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Tank Capacity</p>
            <p className="text-2xl font-semibold">{formatLitres(tankCapacity)}</p>
          </div>
        </div>

        {/* Fill Bar */}
        <div className="relative">
          <div className="h-4 bg-teal-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm opacity-90">
            <span>{fillPercentage.toFixed(1)}% full</span>
            <span>~{daysOfStock.toFixed(0)} days remaining</span>
          </div>
        </div>
      </div>

      {/* Stock Movement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Opening Stock</p>
          <p className="text-2xl font-bold text-gray-900">{formatLitres(inventory.openingStock)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Purchases</p>
          <p className="text-2xl font-bold text-green-600">{formatLitres(inventory.purchases)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Sales</p>
          <p className="text-2xl font-bold text-blue-600">{formatLitres(inventory.sales)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Adjustments</p>
          <p className={`text-2xl font-bold ${inventory.adjustments < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {inventory.adjustments > 0 ? '+' : ''}
            {formatLitres(Math.abs(inventory.adjustments))}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Closing Stock</p>
          <p className="text-2xl font-bold text-teal-600">{formatLitres(inventory.closingStock)}</p>
        </div>
      </div>

      {/* Stock Movement Formula */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement Formula</h2>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500 mb-1">Opening Stock</p>
            <p className="font-semibold text-gray-900">{formatLitres(inventory.openingStock)}</p>
          </div>
          <span className="text-2xl text-gray-400">+</span>
          <div className="text-center">
            <p className="text-gray-500 mb-1">Purchases</p>
            <p className="font-semibold text-green-600">{formatLitres(inventory.purchases)}</p>
          </div>
          <span className="text-2xl text-gray-400">−</span>
          <div className="text-center">
            <p className="text-gray-500 mb-1">Sales</p>
            <p className="font-semibold text-blue-600">{formatLitres(inventory.sales)}</p>
          </div>
          <span className="text-2xl text-gray-400">+</span>
          <div className="text-center">
            <p className="text-gray-500 mb-1">Adjustments</p>
            <p className={`font-semibold ${inventory.adjustments < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatLitres(inventory.adjustments)}
            </p>
          </div>
          <span className="text-2xl text-gray-400">=</span>
          <div className="text-center">
            <p className="text-gray-500 mb-1">Closing Stock</p>
            <p className="font-semibold text-teal-600">{formatLitres(inventory.closingStock)}</p>
          </div>
        </div>

        {/* Variance Check */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Calculated Closing Stock:</span>
            <span className="font-semibold text-gray-900">
              {formatLitres(inventory.openingStock + inventory.purchases - inventory.sales + inventory.adjustments)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">Physical Closing Stock:</span>
            <span className="font-semibold text-gray-900">{formatLitres(inventory.closingStock)}</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Variance:</span>
            <span
              className={`font-semibold ${
                inventory.variance === 0
                  ? 'text-green-600'
                  : inventory.variance < 0
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`}
            >
              {inventory.variance === 0 ? 'No variance' : formatLitres(Math.abs(inventory.variance))}
              {inventory.variance !== 0 && (inventory.variance < 0 ? ' (shortage)' : ' (overage)')}
            </span>
          </div>
        </div>
      </div>

      {/* Reorder Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reorder Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tank Capacity (L)</label>
            <input
              type="number"
              value={tankCapacity}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level (L)</label>
            <input
              type="number"
              value={reorderLevel}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typical Refill Size (L)</label>
            <input
              type="number"
              value={33000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
