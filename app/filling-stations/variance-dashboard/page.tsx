'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, TrendingDown, DollarSign, Droplet, Truck, Building2, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface DippingRecord {
  id: string
  date: string
  stationName: string
  productType: string
  variance: number
  variancePercentage: number
  varianceValue: number
  status: string
}

interface PumpSalesRecord {
  id: string
  date: string
  stationName: string
  productType: string
  variance: number
  variancePercentage: number
  salesValue: number
}

interface BankLodgement {
  id: string
  date: string
  stationName: string
  variance: number
  variancePercentage: number
  amountDeposited: number
}

interface ProductDelivery {
  id: string
  date: string
  dischargeStation: string
  productType: string
  transitLoss: number
  transitLossPercentage: number
  loadingQuantity: number
  status: string
}

interface VarianceAlert {
  id: string
  date: string
  type: 'Stock' | 'Cash' | 'Lodgement' | 'Transit'
  station: string
  product: string
  variance: number
  variancePercentage: number
  value: number
  severity: 'critical' | 'warning' | 'normal'
  description: string
}

export default function VarianceDashboardPage() {
  const [alerts, setAlerts] = useState<VarianceAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<VarianceAlert[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedStation, setSelectedStation] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [stationsList, setStationsList] = useState<string[]>(['all'])

  // Load stations from localStorage
  useEffect(() => {
    const activeStations = getActiveStations()
    setStationsList(['all', ...activeStations.map(s => s.stationName)])
  }, [])

  useEffect(() => {
    loadVarianceData()
  }, [])

  useEffect(() => {
    filterAlerts()
  }, [alerts, dateFrom, dateTo, selectedStation, selectedSeverity])

  const loadVarianceData = () => {
    const allAlerts: VarianceAlert[] = []

    // Load Dipping Variances
    const dippingData = localStorage.getItem('dippingRecords')
    if (dippingData) {
      const records: DippingRecord[] = JSON.parse(dippingData)
      records.forEach(record => {
        if (Math.abs(record.variancePercentage) > 1) {
          allAlerts.push({
            id: `dip-${record.id}`,
            date: record.date,
            type: 'Stock',
            station: record.stationName,
            product: record.productType,
            variance: record.variance,
            variancePercentage: record.variancePercentage,
            value: Math.abs(record.varianceValue),
            severity: record.status === 'critical' ? 'critical' : record.status === 'warning' ? 'warning' : 'normal',
            description: `Tank stock variance: ${record.variance >= 0 ? '+' : ''}${record.variance.toLocaleString()}L (${record.variancePercentage.toFixed(2)}%)`
          })
        }
      })
    }

    // Load Pump Sales Variances
    const pumpSalesData = localStorage.getItem('pumpSalesRecords')
    if (pumpSalesData) {
      const records: PumpSalesRecord[] = JSON.parse(pumpSalesData)
      records.forEach(record => {
        if (Math.abs(record.variancePercentage) > 1) {
          allAlerts.push({
            id: `pump-${record.id}`,
            date: record.date,
            type: 'Cash',
            station: record.stationName,
            product: record.productType,
            variance: record.variance,
            variancePercentage: record.variancePercentage,
            value: Math.abs(record.variance),
            severity: Math.abs(record.variancePercentage) > 2 ? 'critical' : 'warning',
            description: `Pump cash variance: ${record.variance >= 0 ? '+' : ''}₦${record.variance.toLocaleString()} (${record.variancePercentage.toFixed(2)}%)`
          })
        }
      })
    }

    // Load Bank Lodgement Variances
    const lodgementData = localStorage.getItem('bankLodgements')
    if (lodgementData) {
      const records: BankLodgement[] = JSON.parse(lodgementData)
      records.forEach(record => {
        if (Math.abs(record.variancePercentage) > 1) {
          allAlerts.push({
            id: `lodg-${record.id}`,
            date: record.date,
            type: 'Lodgement',
            station: record.stationName,
            product: 'Cash',
            variance: record.variance,
            variancePercentage: record.variancePercentage,
            value: Math.abs(record.variance),
            severity: Math.abs(record.variancePercentage) > 2 ? 'critical' : 'warning',
            description: `Bank lodgement variance: ${record.variance >= 0 ? '+' : ''}₦${record.variance.toLocaleString()} (${record.variancePercentage.toFixed(2)}%)`
          })
        }
      })
    }

    // Load Product Delivery Variances (Transit Loss)
    const deliveryData = localStorage.getItem('productDeliveries')
    if (deliveryData) {
      const records: ProductDelivery[] = JSON.parse(deliveryData)
      records.forEach(record => {
        if (record.transitLossPercentage > 1) {
          allAlerts.push({
            id: `delv-${record.id}`,
            date: record.date,
            type: 'Transit',
            station: record.dischargeStation,
            product: record.productType,
            variance: -record.transitLoss,
            variancePercentage: record.transitLossPercentage,
            value: record.transitLoss,
            severity: record.status === 'critical' ? 'critical' : record.status === 'warning' ? 'warning' : 'normal',
            description: `Transit loss: ${record.transitLoss.toLocaleString()}L (${record.transitLossPercentage.toFixed(2)}%)`
          })
        }
      })
    }

    // Sort by date (newest first) and severity
    allAlerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, normal: 2 }
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setAlerts(allAlerts)
  }

  const filterAlerts = () => {
    let filtered = [...alerts]

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(alert => alert.date >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter(alert => alert.date <= dateTo)
    }

    // Filter by station
    if (selectedStation !== 'all') {
      filtered = filtered.filter(alert => alert.station === selectedStation)
    }

    // Filter by severity
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    setFilteredAlerts(filtered)
  }

  // Calculate summary statistics
  const totalVarianceValue = filteredAlerts.reduce((sum, alert) => sum + alert.value, 0)
  const criticalCount = filteredAlerts.filter(a => a.severity === 'critical').length
  const warningCount = filteredAlerts.filter(a => a.severity === 'warning').length

  const varianceByType = {
    Stock: filteredAlerts.filter(a => a.type === 'Stock').reduce((sum, a) => sum + a.value, 0),
    Cash: filteredAlerts.filter(a => a.type === 'Cash').reduce((sum, a) => sum + a.value, 0),
    Lodgement: filteredAlerts.filter(a => a.type === 'Lodgement').reduce((sum, a) => sum + a.value, 0),
    Transit: filteredAlerts.filter(a => a.type === 'Transit').reduce((sum, a) => sum + a.value, 0)
  }

  const varianceByStation = stationsList.filter(s => s !== 'all').reduce((acc, station) => {
    acc[station] = filteredAlerts.filter(a => a.station === station).reduce((sum, a) => sum + a.value, 0)
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Variance Management Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and track all variances across operations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Variance Value</p>
              <p className="text-2xl font-bold text-red-600">₦{totalVarianceValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-xs text-gray-500">&gt;2% variance</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Warning Alerts</p>
              <p className="text-2xl font-bold text-orange-600">{warningCount}</p>
              <p className="text-xs text-gray-500">1-2% variance</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAlerts.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Station</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {stationsList.map(station => (
                <option key={station} value={station}>
                  {station === 'all' ? 'All Stations' : station}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Variance by Type */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Stock Variance</h3>
            <Droplet className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">₦{varianceByType.Stock.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredAlerts.filter(a => a.type === 'Stock').length} alerts
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Cash Variance</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">₦{varianceByType.Cash.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredAlerts.filter(a => a.type === 'Cash').length} alerts
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Lodgement Variance</h3>
            <Building2 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">₦{varianceByType.Lodgement.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredAlerts.filter(a => a.type === 'Lodgement').length} alerts
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Transit Loss</h3>
            <Truck className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">₦{varianceByType.Transit.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredAlerts.filter(a => a.type === 'Transit').length} alerts
          </p>
        </Card>
      </div>

      {/* Variance by Station */}
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Variance by Station</h3>
        <div className="space-y-3">
          {Object.entries(varianceByStation)
            .sort(([, a], [, b]) => b - a)
            .map(([station, value]) => {
              const stationAlerts = filteredAlerts.filter(a => a.station === station)
              const maxValue = Math.max(...Object.values(varianceByStation))
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

              return (
                <div key={station}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{station}</span>
                    <span className="text-sm font-bold text-gray-900">
                      ₦{value.toLocaleString()} ({stationAlerts.length} alerts)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </Card>

      {/* Alerts Table */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Variance Alerts</h3>
          <p className="text-sm text-gray-500">All variances &gt;1% are shown below</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Value</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No variance alerts found
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{alert.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full
                        ${alert.type === 'Stock' ? 'bg-blue-100 text-blue-800' :
                          alert.type === 'Cash' ? 'bg-green-100 text-green-800' :
                          alert.type === 'Lodgement' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'}`}>
                        {alert.type === 'Stock' && <Droplet className="w-3 h-3 mr-1" />}
                        {alert.type === 'Cash' && <DollarSign className="w-3 h-3 mr-1" />}
                        {alert.type === 'Lodgement' && <Building2 className="w-3 h-3 mr-1" />}
                        {alert.type === 'Transit' && <Truck className="w-3 h-3 mr-1" />}
                        {alert.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{alert.station}</td>
                    <td className="py-3 px-4 text-sm">{alert.product}</td>
                    <td className="py-3 px-4 text-sm">{alert.description}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-red-600">
                      ₦{alert.value.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'warning' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {alert.severity === 'critical' ? '🔴 Critical' :
                         alert.severity === 'warning' ? '🟡 Warning' :
                         '🟢 Normal'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
