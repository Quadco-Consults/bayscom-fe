'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'
import { AssetDisposal } from '@/lib/types'
import Link from 'next/link'

const mockDisposals: AssetDisposal[] = [
  {
    id: '1',
    disposalNumber: 'DSP-2024-001',
    assetId: '10',
    disposalDate: '2024-12-15',
    disposalMethod: 'sale',
    originalCost: 45000000,
    accumulatedDepreciation: 35000000,
    bookValue: 10000000,
    salePrice: 12500000,
    gainLoss: 2500000,
    buyerName: 'ABC Transport Ltd',
    invoiceNumber: 'INV-2024-456',
    notes: 'Old delivery truck sold in good condition',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-15',
  },
  {
    id: '2',
    disposalNumber: 'DSP-2024-002',
    assetId: '15',
    disposalDate: '2024-11-20',
    disposalMethod: 'scrap',
    originalCost: 5000000,
    accumulatedDepreciation: 4800000,
    bookValue: 200000,
    salePrice: 50000,
    gainLoss: -150000,
    buyerName: 'Metal Recyclers Ltd',
    notes: 'Damaged equipment scrapped',
    createdAt: '2024-11-18',
    updatedAt: '2024-11-20',
  },
]

export default function AssetDisposalPage() {
  const [disposals] = useState<AssetDisposal[]>(mockDisposals)

  const totalDisposals = disposals.length
  const totalGain = disposals.filter(d => d.gainLoss > 0).reduce((sum, d) => sum + d.gainLoss, 0)
  const totalLoss = disposals.filter(d => d.gainLoss < 0).reduce((sum, d) => sum + Math.abs(d.gainLoss), 0)
  const totalProceeds = disposals.reduce((sum, d) => sum + d.salePrice, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getMethodBadge = (method: string) => {
    const styles = {
      sale: 'bg-green-50 text-green-700 border-green-200',
      scrap: 'bg-gray-50 text-gray-700 border-gray-200',
      donation: 'bg-blue-50 text-blue-700 border-blue-200',
      'trade-in': 'bg-purple-50 text-purple-700 border-purple-200',
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${
          styles[method as keyof typeof styles] || styles.sale
        }`}
      >
        {method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/finance/fixed-assets"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asset Disposals</h1>
              <p className="mt-1 text-sm text-gray-600">
                Track asset disposals and calculate gains/losses
              </p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            Record Disposal
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Disposals</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{totalDisposals}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Proceeds</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalProceeds)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gains</p>
                <p className="mt-2 text-xl font-semibold text-green-600">
                  {formatCurrency(totalGain)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Losses</p>
                <p className="mt-2 text-xl font-semibold text-red-600">
                  {formatCurrency(totalLoss)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Disposals Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Disposal Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Book Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Sale Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Gain/Loss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Buyer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disposals.map(disposal => (
                  <tr key={disposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {disposal.disposalNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(disposal.disposalDate)}
                      </div>
                      {disposal.invoiceNumber && (
                        <div className="text-xs text-gray-500">Invoice: {disposal.invoiceNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">{getMethodBadge(disposal.disposalMethod)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(disposal.bookValue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Cost: {formatCurrency(disposal.originalCost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(disposal.salePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`text-sm font-semibold ${
                          disposal.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {disposal.gainLoss >= 0 ? '+' : ''}
                        {formatCurrency(disposal.gainLoss)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{disposal.buyerName}</div>
                      {disposal.notes && (
                        <div className="text-xs text-gray-500">{disposal.notes}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
