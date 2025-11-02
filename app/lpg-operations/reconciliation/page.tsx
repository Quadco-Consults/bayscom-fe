'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, DollarSign, FileText, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface MonthlyReconciliation {
  id: string
  month: string // Format: YYYY-MM
  year: number
  stationId: string
  stationName: string

  // Inventory Reconciliation (Kg)
  openingStock: number
  proposedAddedQty: number
  actualAddedQty: number
  agreedInTransitLoss: number
  stockAvailable: number
  totalSales: number
  closingStockBook: number
  overage: number
  totalShortage: number

  // Revenue
  lpgSales: number
  accessoriesSales: number
  totalRevenue: number

  // Cost of Goods Sold
  lpgPurchase: number
  accessoriesPurchase: number
  totalCost: number

  // Financial Summary
  grossMargin: number
  totalExpenses: number
  netProfit: number
  profitMarginPercentage: number

  createdAt: string
}

export default function LPGReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<MonthlyReconciliation[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedStation, setSelectedStation] = useState('')
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])
  const [currentReconciliation, setCurrentReconciliation] = useState<MonthlyReconciliation | null>(null)

  // Load stations
  useEffect(() => {
    const activeStations = getActiveStations().filter(s => s.productsAvailable.includes('LPG'))
    setStations(activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName })))

    // Set default to current month
    const now = new Date()
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    if (activeStations.length > 0) {
      setSelectedStation(activeStations[0].id)
    }
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lpgReconciliations')
    if (savedData) {
      setReconciliations(JSON.parse(savedData))
    }
  }, [])

  // Generate reconciliation when month/station changes
  useEffect(() => {
    if (selectedMonth && selectedStation) {
      generateReconciliation()
    }
  }, [selectedMonth, selectedStation])

  const generateReconciliation = () => {
    const station = stations.find(s => s.id === selectedStation)
    if (!station) return

    // Load data from all modules for the selected month and station
    const dailySalesData = JSON.parse(localStorage.getItem('lpgDailySales') || '[]')
    const cylindersData = JSON.parse(localStorage.getItem('lpgCylindersAccessories') || '[]')
    const purchasesData = JSON.parse(localStorage.getItem('lpgProductPurchases') || '[]')
    const expensesData = JSON.parse(localStorage.getItem('lpgExpenses') || '[]')

    // Filter by month and station
    const monthSales = dailySalesData.filter((s: any) =>
      s.date.startsWith(selectedMonth) && s.stationId === selectedStation
    )
    const monthPurchases = purchasesData.filter((p: any) =>
      p.date.startsWith(selectedMonth) && p.stationId === selectedStation
    )
    const monthExpenses = expensesData.filter((e: any) =>
      e.date.startsWith(selectedMonth) && e.stationId === selectedStation
    )

    // Calculate inventory reconciliation
    const openingStock = monthSales.length > 0 ? monthSales[0].openingStock : 0
    const actualAddedQty = monthPurchases.reduce((sum: number, p: any) => sum + p.purchaseVolumeKg, 0)
    const proposedAddedQty = actualAddedQty
    const totalInTransitLoss = monthPurchases.reduce((sum: number, p: any) => sum + p.inTransitLoss, 0)
    const stockAvailable = openingStock + actualAddedQty
    const totalSales = monthSales.reduce((sum: number, s: any) => sum + s.qtySold, 0)
    const closingStockBook = stockAvailable - totalSales
    const totalOverage = monthSales.reduce((sum: number, s: any) =>
      sum + (s.overageShortage > 0 ? s.overageShortage : 0), 0
    )
    const totalShortage = monthSales.reduce((sum: number, s: any) =>
      sum + (s.overageShortage < 0 ? Math.abs(s.overageShortage) : 0), 0
    )

    // Calculate revenue
    const lpgSales = monthSales.reduce((sum: number, s: any) => sum + s.totalValue, 0)
    const accessoriesSales = cylindersData.reduce((sum: number, c: any) => sum + c.salesAmount, 0)
    const totalRevenue = lpgSales + accessoriesSales

    // Calculate cost of goods sold
    const lpgPurchase = monthPurchases.reduce((sum: number, p: any) => sum + p.totalPurchasePrice, 0)
    const accessoriesPurchase = cylindersData.reduce((sum: number, c: any) => sum + c.costPriceInQtySold, 0)
    const totalCost = lpgPurchase + accessoriesPurchase

    // Calculate financial summary
    const grossMargin = totalRevenue - totalCost
    const totalExpenses = monthExpenses.reduce((sum: number, e: any) => sum + e.amount, 0)
    const netProfit = grossMargin - totalExpenses
    const profitMarginPercentage = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    const reconciliation: MonthlyReconciliation = {
      id: `${selectedMonth}-${selectedStation}`,
      month: selectedMonth,
      year: parseInt(selectedMonth.split('-')[0]),
      stationId: selectedStation,
      stationName: station.stationName,
      openingStock,
      proposedAddedQty,
      actualAddedQty,
      agreedInTransitLoss: totalInTransitLoss,
      stockAvailable,
      totalSales,
      closingStockBook,
      overage: totalOverage,
      totalShortage,
      lpgSales,
      accessoriesSales,
      totalRevenue,
      lpgPurchase,
      accessoriesPurchase,
      totalCost,
      grossMargin,
      totalExpenses,
      netProfit,
      profitMarginPercentage,
      createdAt: new Date().toISOString()
    }

    setCurrentReconciliation(reconciliation)

    // Save to localStorage
    const existingIndex = reconciliations.findIndex(r =>
      r.month === selectedMonth && r.stationId === selectedStation
    )

    let updatedReconciliations
    if (existingIndex >= 0) {
      updatedReconciliations = reconciliations.map((r, i) =>
        i === existingIndex ? reconciliation : r
      )
    } else {
      updatedReconciliations = [...reconciliations, reconciliation]
    }

    setReconciliations(updatedReconciliations)
    localStorage.setItem('lpgReconciliations', JSON.stringify(updatedReconciliations))
  }

  const handleExport = () => {
    if (!currentReconciliation) return

    const csv = `BAYSCOM ENERGY - LPG MONTHLY RECONCILIATION
Station: ${currentReconciliation.stationName}
Month: ${new Date(currentReconciliation.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}

INVENTORY RECONCILIATION (Kg)
Opening Stock,${currentReconciliation.openingStock}
Proposed Added Qty,${currentReconciliation.proposedAddedQty}
Actual Added Qty,${currentReconciliation.actualAddedQty}
Agreed In-Transit Loss,${currentReconciliation.agreedInTransitLoss}
Stock Available,${currentReconciliation.stockAvailable}
Total Sales,${currentReconciliation.totalSales}
Closing Stock (Book),${currentReconciliation.closingStockBook}
Overage,${currentReconciliation.overage}
Total Shortage,${currentReconciliation.totalShortage}

PROFIT & LOSS STATEMENT
REVENUE
LPG Sales,₦${currentReconciliation.lpgSales.toLocaleString()}
Accessories Sales,₦${currentReconciliation.accessoriesSales.toLocaleString()}
Total Revenue,₦${currentReconciliation.totalRevenue.toLocaleString()}

COST OF GOODS SOLD
LPG Purchase,₦${currentReconciliation.lpgPurchase.toLocaleString()}
Accessories Purchase,₦${currentReconciliation.accessoriesPurchase.toLocaleString()}
Total COGS,₦${currentReconciliation.totalCost.toLocaleString()}

GROSS MARGIN,₦${currentReconciliation.grossMargin.toLocaleString()}
LESS: EXPENSES,₦${currentReconciliation.totalExpenses.toLocaleString()}
NET PROFIT,₦${currentReconciliation.netProfit.toLocaleString()}
Profit Margin %,${currentReconciliation.profitMarginPercentage.toFixed(2)}%
`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LPG_Reconciliation_${currentReconciliation.stationName}_${currentReconciliation.month}.csv`
    a.click()
  }

  if (!currentReconciliation) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p>Loading reconciliation...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly LPG Reconciliation & P&L</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive monthly financial and inventory reconciliation</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Month & Station Selector */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Station</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {stations.map(station => (
                <option key={station.id} value={station.id}>{station.stationName}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Report Header */}
      <Card className="p-6 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">BAYSCOM ENERGY LIMITED</h2>
          <h3 className="text-lg font-medium text-gray-700 mt-1">LPG MONTHLY RECONCILIATION</h3>
          <p className="text-sm text-gray-600 mt-2">
            {currentReconciliation.stationName} - {new Date(currentReconciliation.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦{currentReconciliation.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gross Margin</p>
              <p className="text-2xl font-bold text-blue-600">₦{currentReconciliation.grossMargin.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${currentReconciliation.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{currentReconciliation.netProfit.toLocaleString()}
              </p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profit Margin</p>
              <p className={`text-2xl font-bold ${currentReconciliation.profitMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentReconciliation.profitMarginPercentage.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Inventory Reconciliation */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium">INVENTORY RECONCILIATION (Kg)</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Opening Stock:</span>
              <span className="font-bold">{currentReconciliation.openingStock.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Proposed Added Quantity:</span>
              <span className="font-bold">{currentReconciliation.proposedAddedQty.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Actual Added Qty:</span>
              <span className="font-bold text-blue-600">{currentReconciliation.actualAddedQty.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Agreed In-Transit-Loss:</span>
              <span className="font-bold text-red-600">{currentReconciliation.agreedInTransitLoss.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b bg-blue-50">
              <span className="font-bold text-gray-900">Stock Available:</span>
              <span className="font-bold text-blue-600">{currentReconciliation.stockAvailable.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Total Product Sales:</span>
              <span className="font-bold">{currentReconciliation.totalSales.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b bg-gray-50">
              <span className="font-bold text-gray-900">Closing Stock (Book):</span>
              <span className="font-bold">{currentReconciliation.closingStockBook.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-700">Overage:</span>
              <span className="font-bold text-green-600">+{currentReconciliation.overage.toLocaleString()} Kg</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Total Shortage:</span>
              <span className="font-bold text-red-600">-{currentReconciliation.totalShortage.toLocaleString()} Kg</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Profit & Loss Statement */}
      <Card>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium">PROFIT & LOSS STATEMENT</h3>
        </div>
        <div className="p-6">
          {/* Revenue Section */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">REVENUE</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">LPG Sales:</span>
                <span className="font-medium">₦{currentReconciliation.lpgSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Accessories Sales:</span>
                <span className="font-medium">₦{currentReconciliation.accessoriesSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 bg-green-50 px-2 rounded">
                <span className="font-bold text-gray-900">Total Revenue:</span>
                <span className="font-bold text-green-600">₦{currentReconciliation.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cost of Goods Sold Section */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">COST OF GOODS SOLD</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">LPG Purchase:</span>
                <span className="font-medium">₦{currentReconciliation.lpgPurchase.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Accessories Purchase:</span>
                <span className="font-medium">₦{currentReconciliation.accessoriesPurchase.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 bg-red-50 px-2 rounded">
                <span className="font-bold text-gray-900">Total COGS:</span>
                <span className="font-bold text-red-600">₦{currentReconciliation.totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="border-t-2 border-gray-300 pt-6 space-y-3">
            <div className="flex justify-between py-3 bg-blue-50 px-4 rounded">
              <span className="font-bold text-gray-900 text-lg">GROSS MARGIN:</span>
              <span className="font-bold text-blue-600 text-lg">₦{currentReconciliation.grossMargin.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3 px-4">
              <span className="font-bold text-gray-900 text-lg">LESS: EXPENSES:</span>
              <span className="font-bold text-red-600 text-lg">₦{currentReconciliation.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-4 bg-gradient-to-r from-green-50 to-green-100 px-4 rounded-lg border-2 border-green-300">
              <span className="font-bold text-gray-900 text-xl">NET PROFIT:</span>
              <span className={`font-bold text-xl ${currentReconciliation.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{currentReconciliation.netProfit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-end py-2 px-4">
              <span className="text-sm text-gray-600">
                Profit Margin: <span className={`font-bold ${currentReconciliation.profitMarginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentReconciliation.profitMarginPercentage.toFixed(2)}%
                </span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Footer */}
      <Card className="mt-6 p-4 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Generated on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date().toLocaleTimeString()}
        </p>
      </Card>
    </div>
  )
}
