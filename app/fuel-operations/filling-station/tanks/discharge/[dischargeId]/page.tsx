'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Truck,
  Droplet,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  ArrowLeft,
  FileText,
  Calendar,
  User,
} from 'lucide-react'
import { tankFormat } from '@/utils/tank-calcs'

export default function DischargeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dischargeId = params.dischargeId as string

  // Mock discharge data (in production, fetch from API using dischargeId)
  const discharge = {
    id: dischargeId,
    waybillNo: 'WB-2026-001234',
    waybillDate: '2026-03-23',
    createdAt: '2026-03-23T14:30:00',
    supplier: 'NIPCO PLC',
    transporter: 'ABC Transport Ltd',
    truckReg: 'KNO-123-XY',
    driverName: 'Aliyu Ibrahim',
    driverPhone: '08012345678',
    product: 'PMS' as 'PMS' | 'AGO' | 'DPK',
    destinationTank: 'PMS-T1',
    waybillQty: 33000,
    compartments: [
      { id: '1', label: 'C1', dipCm: '125', litres: 9100 },
      { id: '2', label: 'C2', dipCm: '118', litres: 8500 },
      { id: '3', label: 'C3', dipCm: '122', litres: 8850 },
      { id: '4', label: 'C4', dipCm: '115', litres: 8200 },
    ],
    truckTotalLitres: 34650,
    preDischarge: {
      dipCm: '145',
      volumeLitres: 18500,
      waterDipCm: '1.5',
      waterLitres: 150,
      netFuelLitres: 18350,
      temperatureC: '28',
      readBy: 'John Okafor',
      timestamp: '2026-03-23T14:45:00',
    },
    dischargeStartTime: '14:50',
    postDischarge: {
      dipCm: '258',
      volumeLitres: 42800,
      waterDipCm: '1.5',
      waterLitres: 150,
      netFuelLitres: 42650,
      temperatureC: '29',
      readBy: 'John Okafor',
      timestamp: '2026-03-23T16:20:00',
    },
    tankReceived: 24300, // 42650 - 18350
    grossShortage: 10350, // 34650 - 24300
    allowedLoss: 104, // 0.3% of 34650
    netShortage: 10246, // 10350 - 104
    varianceStatus: 'excess_loss' as 'excess_loss' | 'within_tolerance' | 'overage',
    status: 'COMPLETED',
  }

  const handlePrint = () => {
    window.print()
  }

  const getProductColor = (prod: 'PMS' | 'AGO' | 'DPK') => {
    switch (prod) {
      case 'PMS':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' }
      case 'AGO':
        return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' }
      case 'DPK':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
    }
  }

  const getVarianceColor = (status: string) => {
    switch (status) {
      case 'excess_loss':
        return { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-300', icon: 'text-red-600' }
      case 'within_tolerance':
        return { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-300', icon: 'text-green-600' }
      case 'overage':
        return { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300', icon: 'text-blue-600' }
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-300', icon: 'text-gray-600' }
    }
  }

  const productColor = getProductColor(discharge.product)
  const varianceColor = getVarianceColor(discharge.varianceStatus)

  return (
    <div className="p-6 space-y-6">
      {/* Header - Hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <button
            onClick={() => router.push('/fuel-operations/filling-station/tanks/history')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to History
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Discharge Details</h1>
          <p className="text-sm text-gray-500 mt-1">Waybill: {discharge.waybillNo}</p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </button>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block mb-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">BAYSCOM ENERGY</h1>
          <h2 className="text-lg font-semibold text-gray-700 mt-2">Truck Discharge Report</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generated on {new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      {/* Variance Status Banner */}
      <div
        className={`rounded-lg p-6 border-2 ${varianceColor.bg} ${varianceColor.border}`}
      >
        <div className="flex items-center gap-4">
          {discharge.varianceStatus === 'excess_loss' ? (
            <AlertTriangle className={`h-8 w-8 ${varianceColor.icon}`} />
          ) : (
            <CheckCircle className={`h-8 w-8 ${varianceColor.icon}`} />
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${varianceColor.text}`}>
              {discharge.varianceStatus === 'excess_loss'
                ? 'Excess Loss Detected'
                : discharge.varianceStatus === 'within_tolerance'
                ? 'Variance Within Tolerance'
                : 'Overage Detected'}
            </h3>
            <p className={`text-sm ${varianceColor.text} opacity-90`}>
              {discharge.varianceStatus === 'excess_loss'
                ? `Net chargeable shortage: ${tankFormat.litres(discharge.netShortage)} exceeds allowed transit loss`
                : discharge.varianceStatus === 'within_tolerance'
                ? 'Shortage is within the acceptable 0.3% transit loss tolerance'
                : 'Tank received more fuel than truck chart total'}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${varianceColor.text} opacity-80`}>Discharge ID</p>
            <p className={`text-base font-mono font-bold ${varianceColor.text}`}>{discharge.id}</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Truck Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Waybill No.</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.waybillNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Waybill Date</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(discharge.waybillDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Truck Registration</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.truckReg}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Driver Name</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Driver Phone</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.driverPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Supplier</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transporter</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.transporter}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplet className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Discharge Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Product</span>
              <span className={`text-sm font-semibold px-2 py-1 rounded ${productColor.bg} ${productColor.text}`}>
                {discharge.product}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Destination Tank</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.destinationTank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Discharge Date</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(discharge.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Start Time</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.dischargeStartTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                {discharge.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compartment Readings */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Truck Compartment Readings</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Compartment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dip Reading (cm)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Volume (L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discharge.compartments.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {comp.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{comp.dipCm} cm</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{tankFormat.litres(comp.litres)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Total Truck Quantity</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-xl font-bold text-blue-600">
                  {tankFormat.litres(discharge.truckTotalLitres)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Tank Dip Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pre-Discharge */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplet className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Pre-Discharge Tank Dip</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Dip Reading</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.preDischarge.dipCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Gross Volume</span>
              <span className="text-sm font-semibold text-gray-900">
                {tankFormat.litres(discharge.preDischarge.volumeLitres)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Water Dip</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.preDischarge.waterDipCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Water Volume</span>
              <span className="text-sm font-semibold text-amber-600">
                {tankFormat.litres(discharge.preDischarge.waterLitres)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Temperature</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.preDischarge.temperatureC}°C</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Net Fuel Volume</span>
              <span className="text-lg font-bold text-blue-600">
                {tankFormat.litres(discharge.preDischarge.netFuelLitres)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User className="h-3 w-3" />
                <span>Read by: {discharge.preDischarge.readBy}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{new Date(discharge.preDischarge.timestamp).toLocaleTimeString('en-NG', { timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Discharge */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Droplet className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Post-Discharge Tank Dip</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Dip Reading</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.postDischarge.dipCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Gross Volume</span>
              <span className="text-sm font-semibold text-gray-900">
                {tankFormat.litres(discharge.postDischarge.volumeLitres)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Water Dip</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.postDischarge.waterDipCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Water Volume</span>
              <span className="text-sm font-semibold text-amber-600">
                {tankFormat.litres(discharge.postDischarge.waterLitres)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Temperature</span>
              <span className="text-sm font-semibold text-gray-900">{discharge.postDischarge.temperatureC}°C</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Net Fuel Volume</span>
              <span className="text-lg font-bold text-green-600">
                {tankFormat.litres(discharge.postDischarge.netFuelLitres)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User className="h-3 w-3" />
                <span>Read by: {discharge.postDischarge.readBy}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{new Date(discharge.postDischarge.timestamp).toLocaleTimeString('en-NG', { timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quantity Comparison</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase mb-2">Waybill Quantity</p>
            <p className="text-xl font-bold text-gray-900">{tankFormat.litres(discharge.waybillQty)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 uppercase mb-2">Truck Chart Total</p>
            <p className="text-xl font-bold text-blue-900">{tankFormat.litres(discharge.truckTotalLitres)}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700 uppercase mb-2">Tank Received</p>
            <p className="text-xl font-bold text-green-900">{tankFormat.litres(discharge.tankReceived)}</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-700 uppercase mb-2">Waybill Variance</p>
            <p className="text-xl font-bold text-amber-900">
              {tankFormat.litres(Math.abs(discharge.waybillQty - discharge.truckTotalLitres))}
            </p>
          </div>
        </div>
      </div>

      {/* Variance Breakdown */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Variance Analysis</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Truck Chart Total</span>
            <span className="text-base font-semibold text-gray-900">
              {tankFormat.litres(discharge.truckTotalLitres)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Less: Tank Received</span>
            <span className="text-base font-semibold text-gray-900">
              {tankFormat.litres(discharge.tankReceived)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-300">
            <span className="text-sm font-semibold text-gray-900">Gross Shortage</span>
            <span className={`text-lg font-bold ${discharge.grossShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {discharge.grossShortage > 0 ? tankFormat.litres(discharge.grossShortage) : 'None (Overage)'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Less: Allowed Transit Loss (0.3%)</span>
            <span className="text-base font-semibold text-green-600">{tankFormat.litres(discharge.allowedLoss)}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t-2 border-gray-300 bg-white px-4 rounded-lg">
            <span className="text-base font-bold text-gray-900">Net Chargeable Shortage</span>
            <span
              className={`text-2xl font-bold ${
                discharge.netShortage > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {discharge.netShortage > 0 ? tankFormat.litres(discharge.netShortage) : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Print Footer - Only visible when printing */}
      <div className="hidden print:block mt-12 pt-8 border-t border-gray-300">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12">
              <p className="text-sm font-semibold">Station Manager</p>
              <p className="text-xs text-gray-600">Signature & Date</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12">
              <p className="text-sm font-semibold">Pump Attendant</p>
              <p className="text-xs text-gray-600">Signature & Date</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12">
              <p className="text-sm font-semibold">Truck Driver</p>
              <p className="text-xs text-gray-600">Signature & Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
