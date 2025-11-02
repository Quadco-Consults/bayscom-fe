'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Truck, TrendingUp, DollarSign, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface LPGPurchase {
  id: string
  date: string
  stationId: string
  stationName: string

  // Purchase Details
  purchaseVolumeKg: number
  purchasePricePerKg: number
  totalPurchasePrice: number
  supplier: 'DANGOTE' | 'RANO' | 'OTHER'

  // Sales/Delivery Details
  actualSalesVolumeKg: number
  salesPricePerKg: number
  salesValue: number
  totalSalesValue: number

  // Analysis
  grossMargin: number
  shortageOverage: number // negative = shortage, positive = overage
  inTransitLoss: number

  remarks: string
  createdAt: string
}

const SUPPLIERS = ['DANGOTE', 'RANO', 'OTHER']

export default function LPGProductPurchasePage() {
  const [purchases, setPurchases] = useState<LPGPurchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<LPGPurchase[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPurchase, setSelectedPurchase] = useState<LPGPurchase | null>(null)
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])
  const [filterSupplier, setFilterSupplier] = useState('all')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    purchaseVolumeKg: '',
    purchasePricePerKg: '',
    supplier: 'DANGOTE' as 'DANGOTE' | 'RANO' | 'OTHER',
    actualSalesVolumeKg: '',
    salesPricePerKg: '1250',
    remarks: ''
  })

  // Load stations
  useEffect(() => {
    const activeStations = getActiveStations().filter(s => s.productsAvailable.includes('LPG'))
    setStations(activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName })))
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lpgProductPurchases')
    if (savedData) {
      setPurchases(JSON.parse(savedData))
    } else {
      // Sample data from GARKI Excel document
      const sampleData: LPGPurchase[] = [
        {
          id: '1',
          date: '2025-06-01',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          purchaseVolumeKg: 2877,
          purchasePricePerKg: 1052.40,
          totalPurchasePrice: 3027754.80,
          supplier: 'DANGOTE',
          actualSalesVolumeKg: 2890,
          salesPricePerKg: 1250,
          salesValue: 3612500,
          totalSalesValue: 3612500,
          grossMargin: 571064,
          shortageOverage: 13,
          inTransitLoss: 0,
          remarks: 'June batch 1',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: '2025-06-05',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          purchaseVolumeKg: 31110,
          purchasePricePerKg: 1052.40,
          totalPurchasePrice: 32740164,
          supplier: 'DANGOTE',
          actualSalesVolumeKg: 31208,
          salesPricePerKg: 1250,
          salesValue: 39010000,
          totalSalesValue: 39010000,
          grossMargin: 6166700.80,
          shortageOverage: 98,
          inTransitLoss: 0,
          remarks: 'June batch 2',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          date: '2025-06-14',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          purchaseVolumeKg: 43200,
          purchasePricePerKg: 1002.40,
          totalPurchasePrice: 43303680,
          supplier: 'DANGOTE',
          actualSalesVolumeKg: 41167,
          salesPricePerKg: 1250,
          salesValue: 51458750,
          totalSalesValue: 51458750,
          grossMargin: 10192949.20,
          shortageOverage: -2033, // Shortage
          inTransitLoss: 2033,
          remarks: 'June batch 3 - transit loss',
          createdAt: new Date().toISOString()
        }
      ]
      setPurchases(sampleData)
      localStorage.setItem('lpgProductPurchases', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (purchases.length > 0) {
      localStorage.setItem('lpgProductPurchases', JSON.stringify(purchases))
    }
  }, [purchases])

  // Filter purchases
  useEffect(() => {
    let filtered = purchases

    if (filterSupplier !== 'all') {
      filtered = filtered.filter(p => p.supplier === filterSupplier)
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPurchases(filtered)
  }, [searchTerm, filterSupplier, purchases])

  const calculateFields = () => {
    const purchaseVol = parseFloat(formData.purchaseVolumeKg) || 0
    const purchasePrice = parseFloat(formData.purchasePricePerKg) || 0
    const totalPurchase = purchaseVol * purchasePrice

    const salesVol = parseFloat(formData.actualSalesVolumeKg) || 0
    const salesPrice = parseFloat(formData.salesPricePerKg) || 1250
    const salesValue = salesVol * salesPrice
    const totalSalesValue = salesValue

    const grossMargin = totalSalesValue - totalPurchase
    const shortageOverage = salesVol - purchaseVol
    const inTransitLoss = shortageOverage < 0 ? Math.abs(shortageOverage) : 0

    return {
      totalPurchase,
      salesValue,
      totalSalesValue,
      grossMargin,
      shortageOverage,
      inTransitLoss
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.stationId || !formData.purchaseVolumeKg || !formData.purchasePricePerKg) {
      alert('Please fill in all required fields!')
      return
    }

    const calculated = calculateFields()

    // Alert for excessive transit loss
    const lossPercentage = parseFloat(formData.purchaseVolumeKg) > 0
      ? (calculated.inTransitLoss / parseFloat(formData.purchaseVolumeKg)) * 100
      : 0

    if (lossPercentage > 2) {
      const confirmSave = confirm(
        `⚠️ HIGH TRANSIT LOSS DETECTED!\n\n` +
        `Purchase Volume: ${parseFloat(formData.purchaseVolumeKg).toLocaleString()} Kg\n` +
        `Sales Volume: ${parseFloat(formData.actualSalesVolumeKg).toLocaleString()} Kg\n` +
        `Transit Loss: ${calculated.inTransitLoss.toLocaleString()} Kg (${lossPercentage.toFixed(2)}%)\n\n` +
        `Acceptable range: 0-2%\n` +
        `Do you want to proceed?`
      )
      if (!confirmSave) return
    }

    const station = stations.find(s => s.id === formData.stationId)

    const newPurchase: LPGPurchase = {
      id: selectedPurchase?.id || Date.now().toString(),
      date: formData.date,
      stationId: formData.stationId,
      stationName: station?.stationName || '',
      purchaseVolumeKg: parseFloat(formData.purchaseVolumeKg),
      purchasePricePerKg: parseFloat(formData.purchasePricePerKg),
      totalPurchasePrice: calculated.totalPurchase,
      supplier: formData.supplier,
      actualSalesVolumeKg: parseFloat(formData.actualSalesVolumeKg) || 0,
      salesPricePerKg: parseFloat(formData.salesPricePerKg),
      salesValue: calculated.salesValue,
      totalSalesValue: calculated.totalSalesValue,
      grossMargin: calculated.grossMargin,
      shortageOverage: calculated.shortageOverage,
      inTransitLoss: calculated.inTransitLoss,
      remarks: formData.remarks,
      createdAt: selectedPurchase?.createdAt || new Date().toISOString()
    }

    if (selectedPurchase) {
      setPurchases(purchases.map(p => p.id === selectedPurchase.id ? newPurchase : p))
    } else {
      setPurchases([newPurchase, ...purchases])
    }

    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      purchaseVolumeKg: '',
      purchasePricePerKg: '',
      supplier: 'DANGOTE',
      actualSalesVolumeKg: '',
      salesPricePerKg: '1250',
      remarks: ''
    })
    setSelectedPurchase(null)
  }

  const handleEdit = (purchase: LPGPurchase) => {
    setSelectedPurchase(purchase)
    setFormData({
      date: purchase.date,
      stationId: purchase.stationId,
      purchaseVolumeKg: purchase.purchaseVolumeKg.toString(),
      purchasePricePerKg: purchase.purchasePricePerKg.toString(),
      supplier: purchase.supplier,
      actualSalesVolumeKg: purchase.actualSalesVolumeKg.toString(),
      salesPricePerKg: purchase.salesPricePerKg.toString(),
      remarks: purchase.remarks
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this purchase record?')) {
      setPurchases(purchases.filter(p => p.id !== id))
    }
  }

  // Summary calculations
  const totalPurchased = filteredPurchases.reduce((sum, p) => sum + p.purchaseVolumeKg, 0)
  const totalPurchaseValue = filteredPurchases.reduce((sum, p) => sum + p.totalPurchasePrice, 0)
  const totalSalesValue = filteredPurchases.reduce((sum, p) => sum + p.totalSalesValue, 0)
  const totalGrossMargin = filteredPurchases.reduce((sum, p) => sum + p.grossMargin, 0)
  const totalTransitLoss = filteredPurchases.reduce((sum, p) => sum + p.inTransitLoss, 0)

  const calculated = calculateFields()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LPG Product Purchase & Delivery</h1>
          <p className="text-sm text-gray-500 mt-1">Track LPG procurement, sales, and margins</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Purchase
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Purchased</p>
              <p className="text-2xl font-bold text-gray-900">{totalPurchased.toLocaleString()} Kg</p>
              <p className="text-xs text-gray-500">₦{totalPurchaseValue.toLocaleString()}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales Value</p>
              <p className="text-2xl font-bold text-green-600">₦{totalSalesValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gross Margin</p>
              <p className="text-2xl font-bold text-purple-600">₦{totalGrossMargin.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {totalSalesValue > 0 ? ((totalGrossMargin / totalSalesValue) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transit Loss</p>
              <p className="text-2xl font-bold text-red-600">{totalTransitLoss.toLocaleString()} Kg</p>
              <p className="text-xs text-gray-500">
                {totalPurchased > 0 ? ((totalTransitLoss / totalPurchased) * 100).toFixed(2) : 0}%
              </p>
            </div>
            <Package className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by station or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Suppliers</option>
            {SUPPLIERS.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Purchases Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Purchased (Kg)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Cost (₦)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Sold (Kg)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Sales (₦)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Margin (₦)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Transit Loss</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-500">
                    No purchase records found
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{purchase.date}</td>
                    <td className="py-3 px-4 text-sm font-medium">{purchase.stationName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${purchase.supplier === 'DANGOTE' ? 'bg-blue-100 text-blue-800' :
                          purchase.supplier === 'RANO' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {purchase.supplier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">{purchase.purchaseVolumeKg.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">₦{purchase.totalPurchasePrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">{purchase.actualSalesVolumeKg.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium">₦{purchase.totalSalesValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-green-600">
                      ₦{purchase.grossMargin.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={purchase.inTransitLoss > 0 ? 'text-red-600' : 'text-green-600'}>
                        {purchase.inTransitLoss > 0 ? '-' : ''}{purchase.inTransitLoss.toLocaleString()} Kg
                        {purchase.purchaseVolumeKg > 0 && (
                          <div className="text-xs">
                            ({((purchase.inTransitLoss / purchase.purchaseVolumeKg) * 100).toFixed(2)}%)
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(purchase)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(purchase.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredPurchases.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr className="font-bold">
                  <td colSpan={3} className="py-3 px-4 text-sm text-right">TOTALS:</td>
                  <td className="py-3 px-4 text-sm text-right">{totalPurchased.toLocaleString()} Kg</td>
                  <td className="py-3 px-4 text-sm text-right">₦{totalPurchaseValue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right">-</td>
                  <td className="py-3 px-4 text-sm text-right">₦{totalSalesValue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right text-green-600">₦{totalGrossMargin.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right text-red-600">{totalTransitLoss.toLocaleString()} Kg</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedPurchase ? 'Edit Purchase Record' : 'New LPG Purchase'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-3 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-1">Supplier *</label>
                    <select
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {SUPPLIERS.map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Purchase Details */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Purchase Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Purchase Volume (Kg) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.purchaseVolumeKg}
                        onChange={(e) => setFormData({ ...formData, purchaseVolumeKg: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Price per Kg (₦) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.purchasePricePerKg}
                        onChange={(e) => setFormData({ ...formData, purchasePricePerKg: e.target.value })}
                        placeholder="1052.40"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Total Purchase (Auto)</label>
                      <Input
                        type="text"
                        value={`₦${calculated.totalPurchase.toLocaleString()}`}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Sales Details */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Sales/Delivery Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Actual Sales Volume (Kg)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.actualSalesVolumeKg}
                        onChange={(e) => setFormData({ ...formData, actualSalesVolumeKg: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Sales Price per Kg (₦)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.salesPricePerKg}
                        onChange={(e) => setFormData({ ...formData, salesPricePerKg: e.target.value })}
                        placeholder="1250"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Total Sales (Auto)</label>
                      <Input
                        type="text"
                        value={`₦${calculated.totalSalesValue.toLocaleString()}`}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Financial Analysis</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Gross Margin:</span>
                      <p className="font-bold text-green-600">₦{calculated.grossMargin.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Shortage/Overage:</span>
                      <p className={`font-bold ${calculated.shortageOverage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculated.shortageOverage >= 0 ? '+' : ''}{calculated.shortageOverage.toFixed(2)} Kg
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Transit Loss:</span>
                      <p className={`font-bold ${calculated.inTransitLoss > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculated.inTransitLoss.toFixed(2)} Kg
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Loss %:</span>
                      <p className={`font-bold ${
                        parseFloat(formData.purchaseVolumeKg) > 0 &&
                        (calculated.inTransitLoss / parseFloat(formData.purchaseVolumeKg)) * 100 > 2
                        ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {parseFloat(formData.purchaseVolumeKg) > 0
                          ? ((calculated.inTransitLoss / parseFloat(formData.purchaseVolumeKg)) * 100).toFixed(2)
                          : 0}%
                      </p>
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
                    {selectedPurchase ? 'Update Purchase' : 'Save Purchase'}
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
