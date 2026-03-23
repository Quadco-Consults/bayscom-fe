/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Droplet,
  Calendar,
  Search,
} from 'lucide-react'
import { tankFormat } from '@/utils/tank-calcs'

interface DischargeRecord {
  id: string
  waybillNo: string
  date: string
  product: 'PMS' | 'AGO' | 'DPK'
  destinationTank: string
  supplier: string
  truckReg: string
  waybillQty: number
  truckTotalLitres: number
  tankReceived: number
  grossShortage: number
  netShortage: number
  varianceStatus: 'excess_loss' | 'within_tolerance' | 'overage'
  status: 'COMPLETED' | 'PENDING_POST_DIP'
}

export default function DischargeHistoryPage() {
  const router = useRouter()

  // Mock discharge history data
  const [discharges] = useState<DischargeRecord[]>([
    {
      id: 'DISCH-001',
      waybillNo: 'WB-2026-001234',
      date: '2026-03-23',
      product: 'PMS',
      destinationTank: 'PMS-T1',
      supplier: 'NIPCO PLC',
      truckReg: 'KNO-123-XY',
      waybillQty: 33000,
      truckTotalLitres: 34650,
      tankReceived: 24300,
      grossShortage: 10350,
      netShortage: 10246,
      varianceStatus: 'excess_loss',
      status: 'COMPLETED',
    },
    {
      id: 'DISCH-002',
      waybillNo: 'WB-2026-001189',
      date: '2026-03-22',
      product: 'AGO',
      destinationTank: 'AGO-T1',
      supplier: 'Total Energies',
      truckReg: 'ABJ-456-ZZ',
      waybillQty: 28000,
      truckTotalLitres: 27950,
      tankReceived: 27885,
      grossShortage: 65,
      netShortage: 0,
      varianceStatus: 'within_tolerance',
      status: 'COMPLETED',
    },
    {
      id: 'DISCH-003',
      waybillNo: 'WB-2026-001156',
      date: '2026-03-21',
      product: 'PMS',
      destinationTank: 'PMS-T2',
      supplier: 'NNPC Retail',
      truckReg: 'LAG-789-AB',
      waybillQty: 44500,
      truckTotalLitres: 44320,
      tankReceived: 44420,
      grossShortage: -100,
      netShortage: 0,
      varianceStatus: 'overage',
      status: 'COMPLETED',
    },
    {
      id: 'DISCH-004',
      waybillNo: 'WB-2026-001098',
      date: '2026-03-20',
      product: 'DPK',
      destinationTank: 'DPK-T1',
      supplier: 'MRS Oil',
      truckReg: 'KAN-234-CD',
      waybillQty: 19500,
      truckTotalLitres: 19480,
      tankReceived: 19425,
      grossShortage: 55,
      netShortage: 0,
      varianceStatus: 'within_tolerance',
      status: 'COMPLETED',
    },
    {
      id: 'DISCH-005',
      waybillNo: 'WB-2026-001045',
      date: '2026-03-19',
      product: 'AGO',
      destinationTank: 'AGO-T1',
      supplier: 'Total Energies',
      truckReg: 'KNO-567-EF',
      waybillQty: 32000,
      truckTotalLitres: 31950,
      tankReceived: 31680,
      grossShortage: 270,
      netShortage: 174,
      varianceStatus: 'excess_loss',
      status: 'COMPLETED',
    },
  ])

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProduct, setFilterProduct] = useState<'ALL' | 'PMS' | 'AGO' | 'DPK'>('ALL')
  const [filterVarianceStatus, setFilterVarianceStatus] = useState<'ALL' | 'excess_loss' | 'within_tolerance' | 'overage'>('ALL')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  // Filtered data
  const filteredDischarges = discharges.filter((discharge) => {
    const matchesSearch =
      discharge.waybillNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discharge.truckReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discharge.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProduct = filterProduct === 'ALL' || discharge.product === filterProduct

    const matchesVariance =
      filterVarianceStatus === 'ALL' || discharge.varianceStatus === filterVarianceStatus

    const matchesDateFrom = !filterDateFrom || discharge.date >= filterDateFrom
    const matchesDateTo = !filterDateTo || discharge.date <= filterDateTo

    return matchesSearch && matchesProduct && matchesVariance && matchesDateFrom && matchesDateTo
  })

  // Summary statistics
  const stats = {
    totalDischarges: filteredDischarges.length,
    totalReceived: filteredDischarges.reduce((sum, d) => sum + d.tankReceived, 0),
    totalShortage: filteredDischarges.reduce((sum, d) => sum + d.netShortage, 0),
    excessLossCount: filteredDischarges.filter((d) => d.varianceStatus === 'excess_loss').length,
  }

  const handleExportCSV = () => {
    const headers = [
      'Discharge ID',
      'Waybill No',
      'Date',
      'Product',
      'Tank',
      'Supplier',
      'Truck Reg',
      'Waybill Qty (L)',
      'Truck Total (L)',
      'Tank Received (L)',
      'Gross Shortage (L)',
      'Net Shortage (L)',
      'Variance Status',
      'Status',
    ]

    const rows = filteredDischarges.map((d) => [
      d.id,
      d.waybillNo,
      d.date,
      d.product,
      d.destinationTank,
      d.supplier,
      d.truckReg,
      d.waybillQty,
      d.truckTotalLitres,
      d.tankReceived,
      d.grossShortage,
      d.netShortage,
      d.varianceStatus,
      d.status,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `discharge-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getVarianceStatusBadge = (status: string) => {
    switch (status) {
      case 'excess_loss':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
            <AlertTriangle className="h-3 w-3" />
            Excess Loss
          </span>
        )
      case 'within_tolerance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
            <CheckCircle className="h-3 w-3" />
            Within Tolerance
          </span>
        )
      case 'overage':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
            <TrendingUp className="h-3 w-3" />
            Overage
          </span>
        )
      default:
        return null
    }
  }

  const getProductColor = (prod: 'PMS' | 'AGO' | 'DPK') => {
    switch (prod) {
      case 'PMS':
        return 'bg-amber-100 text-amber-800'
      case 'AGO':
        return 'bg-teal-100 text-teal-800'
      case 'DPK':
        return 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discharge History</h1>
          <p className="text-sm text-gray-500 mt-1">Complete record of all truck discharges</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Total Discharges</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDischarges}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Total Received</p>
              <p className="text-2xl font-bold text-green-600">{tankFormat.litres(stats.totalReceived)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Total Shortage</p>
              <p className="text-2xl font-bold text-red-600">{tankFormat.litres(stats.totalShortage)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase">Excess Loss Events</p>
              <p className="text-2xl font-bold text-amber-600">{stats.excessLossCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Waybill, truck reg, or supplier..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Products</option>
              <option value="PMS">PMS</option>
              <option value="AGO">AGO</option>
              <option value="DPK">DPK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Variance Status</label>
            <select
              value={filterVarianceStatus}
              onChange={(e) => setFilterVarianceStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Statuses</option>
              <option value="excess_loss">Excess Loss</option>
              <option value="within_tolerance">Within Tolerance</option>
              <option value="overage">Overage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {(searchTerm || filterProduct !== 'ALL' || filterVarianceStatus !== 'ALL' || filterDateFrom || filterDateTo) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing {filteredDischarges.length} of {discharges.length} discharges</span>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterProduct('ALL')
                setFilterVarianceStatus('ALL')
                setFilterDateFrom('')
                setFilterDateTo('')
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Discharge Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Waybill</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Truck Reg</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Received (L)</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Shortage (L)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDischarges.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Droplet className="h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">No discharge records found</p>
                      {(searchTerm || filterProduct !== 'ALL' || filterVarianceStatus !== 'ALL') && (
                        <p className="text-xs text-gray-400">Try adjusting your filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDischarges.map((discharge) => (
                  <tr key={discharge.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(discharge.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{discharge.waybillNo}</div>
                      <div className="text-xs text-gray-500">{discharge.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getProductColor(discharge.product)}`}>
                        {discharge.product}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discharge.destinationTank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discharge.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{discharge.truckReg}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {tankFormat.litres(discharge.tankReceived)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      {discharge.netShortage > 0 ? (
                        <span className="text-red-600">{tankFormat.litres(discharge.netShortage)}</span>
                      ) : (
                        <span className="text-green-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getVarianceStatusBadge(discharge.varianceStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => router.push(`/fuel-operations/filling-station/tanks/discharge/${discharge.id}`)}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
