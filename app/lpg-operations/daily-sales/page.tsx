'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Flame, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface LPGDailySales {
  id: string
  date: string
  stationId: string
  stationName: string

  // Inventory (in Kg)
  openingStock: number
  closingStock: number // Can be negative
  qtyReceived: number
  qtySold: number

  // Pump 1 Readings (in Kg)
  pump1Opening: number
  pump1Closing: number
  pump1Diff: number

  // Pump 2 Readings (in Kg)
  pump2Opening: number
  pump2Closing: number
  pump2Diff: number

  // Variance Analysis
  totalMeterReading: number
  percentageReading: number
  expectedReading: number
  percentageOverageShortage: number
  overageShortage: number

  // Financial
  unitPricePerKg: number
  totalValue: number

  // Payment Breakdown
  posSystem: string
  tajBank: number
  payrep: number
  moniepoint: number
  cash: number
  totalPayments: number

  // Status
  status: 'normal' | 'warning' | 'critical'
  remarks: string
  createdAt: string
}

export default function LPGDailySalesPage() {
  const [sales, setSales] = useState<LPGDailySales[]>([])
  const [filteredSales, setFilteredSales] = useState<LPGDailySales[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSale, setSelectedSale] = useState<LPGDailySales | null>(null)
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    openingStock: '',
    qtyReceived: '',
    closingStock: '',
    pump1Opening: '',
    pump1Closing: '',
    pump2Opening: '',
    pump2Closing: '',
    unitPricePerKg: '1250',
    posSystem: '',
    tajBank: '',
    payrep: '',
    moniepoint: '',
    cash: '',
    remarks: ''
  })

  // Load stations
  useEffect(() => {
    const activeStations = getActiveStations().filter(s => s.productsAvailable.includes('LPG'))
    setStations(activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName })))
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lpgDailySales')
    if (savedData) {
      setSales(JSON.parse(savedData))
    } else {
      // Sample data from GARKI Excel document (June 1, 2025)
      const sampleData: LPGDailySales[] = [
        {
          id: '1',
          date: '2025-06-01',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          openingStock: 2877,
          closingStock: -175,
          qtyReceived: 4001,
          qtySold: 3052,
          pump1Opening: 632807,
          pump1Closing: 634232,
          pump1Diff: 1425,
          pump2Opening: 621923,
          pump2Closing: 623550,
          pump2Diff: 1627,
          totalMeterReading: 3052,
          percentageReading: 43,
          expectedReading: 2331.33,
          percentageOverageShortage: 0.43,
          overageShortage: 13,
          unitPricePerKg: 1250,
          totalValue: 3815000,
          posSystem: 'Multi-POS',
          tajBank: 0,
          payrep: 1540925,
          moniepoint: 1887875,
          cash: 386200,
          totalPayments: 3815000,
          status: 'normal',
          remarks: 'Normal operations - slight overage',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: '2025-06-02',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          openingStock: -175,
          closingStock: 1488,
          qtyReceived: 5122,
          qtySold: 3459,
          pump1Opening: 634232,
          pump1Closing: 635889,
          pump1Diff: 1657,
          pump2Opening: 623550,
          pump2Closing: 625352,
          pump2Diff: 1802,
          totalMeterReading: 3459,
          percentageReading: 46,
          expectedReading: 2549.27,
          percentageOverageShortage: 0.35,
          overageShortage: 0,
          unitPricePerKg: 1250,
          totalValue: 4323750,
          posSystem: 'Multi-POS',
          tajBank: 0,
          payrep: 1850375,
          moniepoint: 2123875,
          cash: 349500,
          totalPayments: 4323750,
          status: 'normal',
          remarks: 'Perfect reconciliation',
          createdAt: new Date().toISOString()
        }
      ]
      setSales(sampleData)
      localStorage.setItem('lpgDailySales', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (sales.length > 0) {
      localStorage.setItem('lpgDailySales', JSON.stringify(sales))
    }
  }, [sales])

  // Filter sales based on search
  useEffect(() => {
    const filtered = sales.filter(sale =>
      sale.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.date.includes(searchTerm)
    )
    setFilteredSales(filtered)
  }, [searchTerm, sales])

  const calculateFields = () => {
    const opening = parseFloat(formData.openingStock) || 0
    const received = parseFloat(formData.qtyReceived) || 0
    const closing = parseFloat(formData.closingStock) || 0
    const qtySold = opening + received - closing

    const pump1Open = parseFloat(formData.pump1Opening) || 0
    const pump1Close = parseFloat(formData.pump1Closing) || 0
    const pump1Diff = pump1Close - pump1Open

    const pump2Open = parseFloat(formData.pump2Opening) || 0
    const pump2Close = parseFloat(formData.pump2Closing) || 0
    const pump2Diff = pump2Close - pump2Open

    const totalMeter = pump1Diff + pump2Diff
    const overageShortage = totalMeter - qtySold
    const percentageReading = qtySold > 0 ? (totalMeter / qtySold) * 100 : 0
    const expectedReading = qtySold * 0.764 // Based on Excel formula
    const percentageOverageShortage = qtySold > 0 ? (overageShortage / qtySold) * 100 : 0

    const unitPrice = parseFloat(formData.unitPricePerKg) || 1250
    const totalValue = qtySold * unitPrice

    const tajBank = parseFloat(formData.tajBank) || 0
    const payrep = parseFloat(formData.payrep) || 0
    const moniepoint = parseFloat(formData.moniepoint) || 0
    const cash = parseFloat(formData.cash) || 0
    const totalPayments = tajBank + payrep + moniepoint + cash

    return {
      qtySold,
      pump1Diff,
      pump2Diff,
      totalMeter,
      overageShortage,
      percentageReading,
      expectedReading,
      percentageOverageShortage,
      totalValue,
      totalPayments
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.stationId || !formData.openingStock) {
      alert('Please fill in all required fields!')
      return
    }

    const calculated = calculateFields()

    // Determine status based on variance
    let status: 'normal' | 'warning' | 'critical' = 'normal'
    if (Math.abs(calculated.percentageOverageShortage) > 5) {
      status = 'critical'
    } else if (Math.abs(calculated.percentageOverageShortage) > 2) {
      status = 'warning'
    }

    // Alert for significant variance
    if (Math.abs(calculated.percentageOverageShortage) > 2) {
      const confirmSave = confirm(
        `⚠️ SIGNIFICANT VARIANCE DETECTED!\n\n` +
        `Quantity Sold: ${calculated.qtySold.toLocaleString()} Kg\n` +
        `Total Meter Reading: ${calculated.totalMeter.toLocaleString()} Kg\n` +
        `Overage/Shortage: ${calculated.overageShortage.toLocaleString()} Kg (${calculated.percentageOverageShortage.toFixed(2)}%)\n\n` +
        `Do you want to proceed?`
      )
      if (!confirmSave) return
    }

    // Alert for payment mismatch
    const paymentVariance = calculated.totalPayments - calculated.totalValue
    if (Math.abs(paymentVariance) > 100) {
      const confirmPayment = confirm(
        `⚠️ PAYMENT MISMATCH!\n\n` +
        `Expected: ₦${calculated.totalValue.toLocaleString()}\n` +
        `Received: ₦${calculated.totalPayments.toLocaleString()}\n` +
        `Difference: ₦${paymentVariance.toLocaleString()}\n\n` +
        `Do you want to proceed?`
      )
      if (!confirmPayment) return
    }

    const station = stations.find(s => s.id === formData.stationId)

    const newSale: LPGDailySales = {
      id: selectedSale?.id || Date.now().toString(),
      date: formData.date,
      stationId: formData.stationId,
      stationName: station?.stationName || '',
      openingStock: parseFloat(formData.openingStock),
      closingStock: parseFloat(formData.closingStock) || 0,
      qtyReceived: parseFloat(formData.qtyReceived) || 0,
      qtySold: calculated.qtySold,
      pump1Opening: parseFloat(formData.pump1Opening) || 0,
      pump1Closing: parseFloat(formData.pump1Closing) || 0,
      pump1Diff: calculated.pump1Diff,
      pump2Opening: parseFloat(formData.pump2Opening) || 0,
      pump2Closing: parseFloat(formData.pump2Closing) || 0,
      pump2Diff: calculated.pump2Diff,
      totalMeterReading: calculated.totalMeter,
      percentageReading: calculated.percentageReading,
      expectedReading: calculated.expectedReading,
      percentageOverageShortage: calculated.percentageOverageShortage,
      overageShortage: calculated.overageShortage,
      unitPricePerKg: parseFloat(formData.unitPricePerKg),
      totalValue: calculated.totalValue,
      posSystem: formData.posSystem,
      tajBank: parseFloat(formData.tajBank) || 0,
      payrep: parseFloat(formData.payrep) || 0,
      moniepoint: parseFloat(formData.moniepoint) || 0,
      cash: parseFloat(formData.cash) || 0,
      totalPayments: calculated.totalPayments,
      status: status,
      remarks: formData.remarks,
      createdAt: selectedSale?.createdAt || new Date().toISOString()
    }

    if (selectedSale) {
      setSales(sales.map(s => s.id === selectedSale.id ? newSale : s))
    } else {
      setSales([newSale, ...sales])
    }

    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      openingStock: '',
      qtyReceived: '',
      closingStock: '',
      pump1Opening: '',
      pump1Closing: '',
      pump2Opening: '',
      pump2Closing: '',
      unitPricePerKg: '1250',
      posSystem: '',
      tajBank: '',
      payrep: '',
      moniepoint: '',
      cash: '',
      remarks: ''
    })
    setSelectedSale(null)
  }

  const handleEdit = (sale: LPGDailySales) => {
    setSelectedSale(sale)
    setFormData({
      date: sale.date,
      stationId: sale.stationId,
      openingStock: sale.openingStock.toString(),
      qtyReceived: sale.qtyReceived.toString(),
      closingStock: sale.closingStock.toString(),
      pump1Opening: sale.pump1Opening.toString(),
      pump1Closing: sale.pump1Closing.toString(),
      pump2Opening: sale.pump2Opening.toString(),
      pump2Closing: sale.pump2Closing.toString(),
      unitPricePerKg: sale.unitPricePerKg.toString(),
      posSystem: sale.posSystem,
      tajBank: sale.tajBank.toString(),
      payrep: sale.payrep.toString(),
      moniepoint: sale.moniepoint.toString(),
      cash: sale.cash.toString(),
      remarks: sale.remarks
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setSales(sales.filter(s => s.id !== id))
    }
  }

  // Summary calculations
  const totalQtySold = filteredSales.reduce((sum, s) => sum + s.qtySold, 0)
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalValue, 0)
  const totalOverage = filteredSales.reduce((sum, s) => sum + (s.overageShortage > 0 ? s.overageShortage : 0), 0)
  const totalShortage = filteredSales.reduce((sum, s) => sum + (s.overageShortage < 0 ? Math.abs(s.overageShortage) : 0), 0)

  const calculated = calculateFields()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LPG Daily Sales Recording</h1>
          <p className="text-sm text-gray-500 mt-1">Track daily LPG sales with dual pump meters (Kg-based)</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Qty Sold</p>
              <p className="text-2xl font-bold text-gray-900">{totalQtySold.toLocaleString()} Kg</p>
            </div>
            <Flame className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Overage</p>
              <p className="text-2xl font-bold text-green-600">+{totalOverage.toLocaleString()} Kg</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Shortage</p>
              <p className="text-2xl font-bold text-red-600">-{totalShortage.toLocaleString()} Kg</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by station or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Sales Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Qty Sold (Kg)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Meter Reading</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue (₦)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Payments (₦)</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No sales records found
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{sale.date}</td>
                    <td className="py-3 px-4 text-sm font-medium">{sale.stationName}</td>
                    <td className="py-3 px-4 text-sm text-right">{sale.qtySold.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">{sale.totalMeterReading.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={sale.overageShortage >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {sale.overageShortage >= 0 ? '+' : ''}{sale.overageShortage.toLocaleString()} Kg
                        <div className="text-xs">
                          ({sale.percentageOverageShortage.toFixed(2)}%)
                        </div>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      ₦{sale.totalValue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      ₦{sale.totalPayments.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${sale.status === 'normal' ? 'bg-green-100 text-green-800' :
                          sale.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}>
                        {sale.status === 'normal' ? 'Normal' :
                         sale.status === 'warning' ? 'Warning' : 'Critical'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sale)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(sale.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedSale ? 'Edit LPG Sales Record' : 'New LPG Sales Record'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Station *</label>
                    <select
                      value={formData.stationId}
                      onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Station</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.stationName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Inventory Section */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Inventory (Kg)</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Opening Stock *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.openingStock}
                        onChange={(e) => setFormData({ ...formData, openingStock: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Qty Received</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.qtyReceived}
                        onChange={(e) => setFormData({ ...formData, qtyReceived: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Closing Stock</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.closingStock}
                        onChange={(e) => setFormData({ ...formData, closingStock: e.target.value })}
                        placeholder="Can be negative"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Qty Sold (Auto)</label>
                      <Input
                        type="text"
                        value={calculated.qtySold.toFixed(2)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Pump Readings Section */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Pump Meter Readings (Kg)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-blue-600">Pump 1</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Opening</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.pump1Opening}
                            onChange={(e) => setFormData({ ...formData, pump1Opening: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Closing</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.pump1Closing}
                            onChange={(e) => setFormData({ ...formData, pump1Closing: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Diff (Auto)</label>
                          <Input
                            type="text"
                            value={calculated.pump1Diff.toFixed(2)}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-green-600">Pump 2</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Opening</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.pump2Opening}
                            onChange={(e) => setFormData({ ...formData, pump2Opening: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Closing</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.pump2Closing}
                            onChange={(e) => setFormData({ ...formData, pump2Closing: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Diff (Auto)</label>
                          <Input
                            type="text"
                            value={calculated.pump2Diff.toFixed(2)}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variance Analysis */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Variance Analysis</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Meter:</span>
                      <p className="font-bold">{calculated.totalMeter.toFixed(2)} Kg</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Reading:</span>
                      <p className="font-bold">{calculated.expectedReading.toFixed(2)} Kg</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Overage/Shortage:</span>
                      <p className={`font-bold ${calculated.overageShortage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculated.overageShortage >= 0 ? '+' : ''}{calculated.overageShortage.toFixed(2)} Kg
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Percentage:</span>
                      <p className={`font-bold ${Math.abs(calculated.percentageOverageShortage) <= 2 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculated.percentageOverageShortage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial & Payments */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Financial Details</h3>
                  <div className="grid grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price/Kg (₦)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.unitPricePerKg}
                        onChange={(e) => setFormData({ ...formData, unitPricePerKg: e.target.value })}
                        placeholder="1250"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">TAJ Bank (₦)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.tajBank}
                        onChange={(e) => setFormData({ ...formData, tajBank: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">PayRep (₦)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.payrep}
                        onChange={(e) => setFormData({ ...formData, payrep: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">MoniePoint (₦)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.moniepoint}
                        onChange={(e) => setFormData({ ...formData, moniepoint: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Cash (₦)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.cash}
                        onChange={(e) => setFormData({ ...formData, cash: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">POS System</label>
                      <Input
                        type="text"
                        value={formData.posSystem}
                        onChange={(e) => setFormData({ ...formData, posSystem: e.target.value })}
                        placeholder="Multi-POS"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm text-gray-600">Total Sales Value:</span>
                      <p className="text-lg font-bold">₦{calculated.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <span className="text-sm text-gray-600">Total Payments:</span>
                      <p className="text-lg font-bold">₦{calculated.totalPayments.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium mb-1">Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {selectedSale ? 'Update Record' : 'Save Record'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
