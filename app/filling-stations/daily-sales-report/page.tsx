'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Download, TrendingUp, DollarSign, Droplet, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface DailySalesReport {
  date: string
  station: string

  // Pump Sales Data
  pumpSales: {
    productType: string
    totalQuantity: number
    totalRevenue: number
    cashCollected: number
    variance: number
  }[]

  // Tank Dipping Data
  tankData: {
    productType: string
    openingStock: number
    receipts: number
    sales: number
    closingBook: number
    physicalStock: number
    variance: number
    varianceValue: number
  }[]

  // Bank Lodgements
  lodgements: {
    bankName: string
    amount: number
    tellerNumber: string
  }[]

  // Deliveries Received
  deliveries: {
    waybillNumber: string
    productType: string
    quantity: number
    transitLoss: number
  }[]

  // Summary
  totalRevenue: number
  totalCashCollected: number
  totalBankLodgements: number
  cashVariance: number
  stockVariance: number
  overallStatus: 'good' | 'warning' | 'critical'
}

const PRODUCT_PRICES = {
  PMS: 617,
  AGO: 1200,
  DPK: 900,
  LPG: 1052
}

export default function DailySalesReportPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedStation, setSelectedStation] = useState('')
  const [report, setReport] = useState<DailySalesReport | null>(null)
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])

  // Load stations from localStorage
  useEffect(() => {
    const activeStations = getActiveStations()
    const stationList = activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName }))
    setStations(stationList)
    if (stationList.length > 0 && !selectedStation) {
      setSelectedStation(stationList[0].stationName)
    }
  }, [])

  useEffect(() => {
    generateReport()
  }, [selectedDate, selectedStation])

  const generateReport = () => {
    // Load data from all modules
    const pumpSalesData = JSON.parse(localStorage.getItem('pumpSalesRecords') || '[]')
    const dippingData = JSON.parse(localStorage.getItem('dippingRecords') || '[]')
    const lodgementData = JSON.parse(localStorage.getItem('bankLodgements') || '[]')
    const deliveryData = JSON.parse(localStorage.getItem('productDeliveries') || '[]')

    // Filter by date and station
    const dailyPumpSales = pumpSalesData.filter((r: any) =>
      r.date === selectedDate && r.stationName === selectedStation
    )
    const dailyDipping = dippingData.filter((r: any) =>
      r.date === selectedDate && r.stationName === selectedStation
    )
    const dailyLodgements = lodgementData.filter((r: any) =>
      r.date === selectedDate && r.stationName === selectedStation
    )
    const dailyDeliveries = deliveryData.filter((r: any) =>
      r.date === selectedDate && r.dischargeStation === selectedStation
    )

    // Aggregate pump sales by product
    const pumpSalesByProduct = ['PMS', 'AGO', 'DPK', 'LPG'].map(productType => {
      const productSales = dailyPumpSales.filter((s: any) => s.productType === productType)
      const totalQuantity = productSales.reduce((sum: number, s: any) => sum + s.salesQuantity, 0)
      const totalRevenue = productSales.reduce((sum: number, s: any) => sum + s.salesValue, 0)
      const cashCollected = productSales.reduce((sum: number, s: any) => sum + s.cashCollected, 0)
      const variance = cashCollected - totalRevenue

      return {
        productType,
        totalQuantity,
        totalRevenue,
        cashCollected,
        variance
      }
    }).filter(p => p.totalQuantity > 0)

    // Aggregate tank data by product
    const tankDataByProduct = ['PMS', 'AGO', 'DPK', 'LPG'].map(productType => {
      const productDipping = dailyDipping.filter((d: any) => d.productType === productType)

      if (productDipping.length === 0) return null

      // Sum up all tanks for the product
      const openingStock = productDipping.reduce((sum: number, d: any) => sum + d.openingBalance, 0)
      const receipts = productDipping.reduce((sum: number, d: any) => sum + d.receipts, 0)
      const sales = productDipping.reduce((sum: number, d: any) => sum + d.sales, 0)
      const closingBook = productDipping.reduce((sum: number, d: any) => sum + d.closingBalance, 0)
      const physicalStock = productDipping.reduce((sum: number, d: any) => sum + d.physicalStock, 0)
      const variance = physicalStock - closingBook
      const price = PRODUCT_PRICES[productType as keyof typeof PRODUCT_PRICES]
      const varianceValue = variance * price

      return {
        productType,
        openingStock,
        receipts,
        sales,
        closingBook,
        physicalStock,
        variance,
        varianceValue
      }
    }).filter(p => p !== null) as any[]

    // Format lodgements
    const lodgements = dailyLodgements.map((l: any) => ({
      bankName: l.bankName,
      amount: l.amountDeposited,
      tellerNumber: l.tellerNumber
    }))

    // Format deliveries
    const deliveries = dailyDeliveries.map((d: any) => ({
      waybillNumber: d.waybillNumber,
      productType: d.productType,
      quantity: d.dischargeQuantity,
      transitLoss: d.transitLoss
    }))

    // Calculate summary
    const totalRevenue = pumpSalesByProduct.reduce((sum, p) => sum + p.totalRevenue, 0)
    const totalCashCollected = pumpSalesByProduct.reduce((sum, p) => sum + p.cashCollected, 0)
    const totalBankLodgements = lodgements.reduce((sum: number, l: any) => sum + l.amount, 0)
    const cashVariance = totalCashCollected - totalRevenue
    const stockVariance = tankDataByProduct.reduce((sum, p) => sum + p.varianceValue, 0)

    // Determine overall status
    let overallStatus: 'good' | 'warning' | 'critical' = 'good'
    const cashVariancePercentage = totalRevenue > 0 ? Math.abs(cashVariance / totalRevenue) * 100 : 0
    const stockVariancePercentage = Math.abs(stockVariance / totalRevenue) * 100

    if (cashVariancePercentage > 2 || stockVariancePercentage > 2) {
      overallStatus = 'critical'
    } else if (cashVariancePercentage > 1 || stockVariancePercentage > 1) {
      overallStatus = 'warning'
    }

    const dailyReport: DailySalesReport = {
      date: selectedDate,
      station: selectedStation,
      pumpSales: pumpSalesByProduct,
      tankData: tankDataByProduct,
      lodgements,
      deliveries,
      totalRevenue,
      totalCashCollected,
      totalBankLodgements,
      cashVariance,
      stockVariance,
      overallStatus
    }

    setReport(dailyReport)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    if (!report) return

    const csvContent = generateCSV(report)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Daily_Sales_Report_${report.station}_${report.date}.csv`
    a.click()
  }

  const generateCSV = (report: DailySalesReport) => {
    let csv = `Daily Sales Report\n`
    csv += `Date: ${report.date}\n`
    csv += `Station: ${report.station}\n\n`

    csv += `PUMP SALES SUMMARY\n`
    csv += `Product,Quantity (L),Revenue (₦),Cash Collected (₦),Variance (₦)\n`
    report.pumpSales.forEach(p => {
      csv += `${p.productType},${p.totalQuantity},${p.totalRevenue},${p.cashCollected},${p.variance}\n`
    })

    csv += `\nTANK STOCK SUMMARY\n`
    csv += `Product,Opening (L),Receipts (L),Sales (L),Closing Book (L),Physical (L),Variance (L),Value (₦)\n`
    report.tankData.forEach(t => {
      csv += `${t.productType},${t.openingStock},${t.receipts},${t.sales},${t.closingBook},${t.physicalStock},${t.variance},${t.varianceValue}\n`
    })

    csv += `\nBANK LODGEMENTS\n`
    csv += `Bank,Amount (₦),Teller Number\n`
    report.lodgements.forEach(l => {
      csv += `${l.bankName},${l.amount},${l.tellerNumber}\n`
    })

    csv += `\nDELIVERIES RECEIVED\n`
    csv += `Waybill,Product,Quantity (L),Transit Loss (L)\n`
    report.deliveries.forEach(d => {
      csv += `${d.waybillNumber},${d.productType},${d.quantity},${d.transitLoss}\n`
    })

    csv += `\nSUMMARY\n`
    csv += `Total Revenue,₦${report.totalRevenue}\n`
    csv += `Total Cash Collected,₦${report.totalCashCollected}\n`
    csv += `Total Bank Lodgements,₦${report.totalBankLodgements}\n`
    csv += `Cash Variance,₦${report.cashVariance}\n`
    csv += `Stock Variance,₦${report.stockVariance}\n`

    return csv
  }

  if (!report) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p>Loading report...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Sales Summary Report</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive daily operations summary</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 print:hidden">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
                <option key={station.id} value={station.stationName}>{station.stationName}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Report Header */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{report.station}</h2>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(report.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-4 py-2 rounded-lg font-semibold
              ${report.overallStatus === 'good' ? 'bg-green-100 text-green-800' :
                report.overallStatus === 'warning' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'}`}>
              {report.overallStatus === 'good' ? '✓ Good' :
               report.overallStatus === 'warning' ? '⚠ Warning' :
               '⚠ Critical'}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦{report.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cash Collected</p>
              <p className="text-2xl font-bold text-gray-900">₦{report.totalCashCollected.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bank Lodgements</p>
              <p className="text-2xl font-bold text-gray-900">₦{report.totalBankLodgements.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cash Variance</p>
              <p className={`text-2xl font-bold ${report.cashVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {report.cashVariance >= 0 ? '+' : ''}₦{report.cashVariance.toLocaleString()}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${report.cashVariance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </Card>
      </div>

      {/* Pump Sales Summary */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Pump Sales Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Quantity (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue (₦)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Cash Collected (₦)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variance (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.pumpSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No pump sales recorded</td>
                </tr>
              ) : (
                report.pumpSales.map((sale) => (
                  <tr key={sale.productType}>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${sale.productType === 'PMS' ? 'bg-green-100 text-green-800' :
                          sale.productType === 'AGO' ? 'bg-yellow-100 text-yellow-800' :
                          sale.productType === 'DPK' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'}`}>
                        {sale.productType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{sale.totalQuantity.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">₦{sale.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">₦{sale.cashCollected.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-right font-medium ${sale.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sale.variance >= 0 ? '+' : ''}₦{sale.variance.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
              {report.pumpSales.length > 0 && (
                <tr className="bg-gray-50 font-bold">
                  <td className="py-3 px-4">TOTAL</td>
                  <td className="py-3 px-4 text-right">
                    {report.pumpSales.reduce((sum, s) => sum + s.totalQuantity, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">₦{report.totalRevenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₦{report.totalCashCollected.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right ${report.cashVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.cashVariance >= 0 ? '+' : ''}₦{report.cashVariance.toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tank Stock Summary */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Tank Stock Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Opening (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Receipts (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Sales (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Closing Book (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Physical (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variance (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Value (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.tankData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">No tank dipping recorded</td>
                </tr>
              ) : (
                report.tankData.map((tank) => (
                  <tr key={tank.productType}>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${tank.productType === 'PMS' ? 'bg-green-100 text-green-800' :
                          tank.productType === 'AGO' ? 'bg-yellow-100 text-yellow-800' :
                          tank.productType === 'DPK' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'}`}>
                        {tank.productType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{tank.openingStock.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{tank.receipts.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{tank.sales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{tank.closingBook.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">{tank.physicalStock.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-right ${tank.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tank.variance >= 0 ? '+' : ''}{tank.variance.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${tank.varianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tank.varianceValue >= 0 ? '+' : ''}₦{tank.varianceValue.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bank Lodgements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Bank Lodgements</h3>
          </div>
          <div className="p-4">
            {report.lodgements.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No lodgements recorded</p>
            ) : (
              <div className="space-y-3">
                {report.lodgements.map((lodgement, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{lodgement.bankName}</p>
                      <p className="text-xs text-gray-500">{lodgement.tellerNumber}</p>
                    </div>
                    <p className="font-bold">₦{lodgement.amount.toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-bold">
                  <p>Total Lodged</p>
                  <p>₦{report.totalBankLodgements.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Deliveries Received</h3>
          </div>
          <div className="p-4">
            {report.deliveries.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No deliveries received</p>
            ) : (
              <div className="space-y-3">
                {report.deliveries.map((delivery, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{delivery.productType}</p>
                        <p className="text-xs text-gray-500">{delivery.waybillNumber}</p>
                      </div>
                      <p className="font-bold">{delivery.quantity.toLocaleString()}L</p>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Transit Loss: {delivery.transitLoss.toLocaleString()}L
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Cash Reconciliation */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Cash Reconciliation</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expected Revenue (from pump sales):</span>
              <span className="font-bold">₦{report.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Actual Cash Collected:</span>
              <span className="font-bold">₦{report.totalCashCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bank Lodgements:</span>
              <span className="font-bold">₦{report.totalBankLodgements.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Cash Variance:</span>
                <span className={`font-bold text-lg ${report.cashVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {report.cashVariance >= 0 ? '+' : ''}₦{report.cashVariance.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Stock Variance Value:</span>
              <span className={`font-bold text-lg ${report.stockVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {report.stockVariance >= 0 ? '+' : ''}₦{report.stockVariance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
