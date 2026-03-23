/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Purchase {
  id: string
  date: string
  supplier: string
  litres: number
  pricePerLitre: number
  totalCost: number
  paymentStatus: 'paid' | 'pending' | 'partial'
  amountPaid: number
  invoiceNo: string
  note: string
}

export default function AGOPurchasesPage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  // Mock purchase data
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      date: '2026-03-15',
      supplier: 'NNPC Depot Kano',
      litres: 33000,
      pricePerLitre: 720,
      totalCost: 23760000,
      paymentStatus: 'paid',
      amountPaid: 23760000,
      invoiceNo: 'INV-2026-0315',
      note: 'Full truck delivery',
    },
    {
      id: '2',
      date: '2026-03-08',
      supplier: 'MRS Oil Kaduna',
      litres: 33000,
      pricePerLitre: 715,
      totalCost: 23595000,
      paymentStatus: 'paid',
      amountPaid: 23595000,
      invoiceNo: 'INV-2026-0308',
      note: '',
    },
  ])

  const addPurchase = () => {
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      litres: 0,
      pricePerLitre: 0,
      totalCost: 0,
      paymentStatus: 'pending',
      amountPaid: 0,
      invoiceNo: '',
      note: '',
    }
    setPurchases([newPurchase, ...purchases])
  }

  const removePurchase = (id: string) => {
    setPurchases(purchases.filter((p) => p.id !== id))
  }

  const updatePurchase = (id: string, field: keyof Purchase, value: any) => {
    setPurchases(
      purchases.map((p) => {
        if (p.id !== id) return p

        const updated = { ...p, [field]: value }

        // Auto-calculate total cost
        if (field === 'litres' || field === 'pricePerLitre') {
          updated.totalCost = updated.litres * updated.pricePerLitre
        }

        return updated
      })
    )
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
  const formatLitres = (litres: number) => `${litres.toLocaleString('en-NG')} L`

  // Calculate totals
  const totals = purchases.reduce(
    (acc, purchase) => ({
      litres: acc.litres + purchase.litres,
      totalCost: acc.totalCost + purchase.totalCost,
      amountPaid: acc.amountPaid + purchase.amountPaid,
    }),
    { litres: 0, totalCost: 0, amountPaid: 0 }
  )

  const outstandingBalance = totals.totalCost - totals.amountPaid

  const getPaymentStatusColor = (status: Purchase['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'partial':
        return 'bg-amber-100 text-amber-800 border-amber-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AGO Purchases</h1>
          <p className="text-sm text-gray-500 mt-1">Track diesel refills and supplier payments</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addPurchase}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Purchase
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Purchases</p>
          <p className="text-2xl font-bold text-teal-600">{formatLitres(totals.litres)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-gray-900">{formatNaira(totals.totalCost)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
          <p className="text-2xl font-bold text-green-600">{formatNaira(totals.amountPaid)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Outstanding Balance</p>
          <p className={`text-2xl font-bold ${outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatNaira(outstandingBalance)}
          </p>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Litres</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/L</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={purchase.date}
                      onChange={(e) => updatePurchase(purchase.id, 'date', e.target.value)}
                      className="w-36 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={purchase.supplier}
                      onChange={(e) => updatePurchase(purchase.id, 'supplier', e.target.value)}
                      placeholder="Supplier name"
                      className="w-40 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={purchase.litres || ''}
                      onChange={(e) => updatePurchase(purchase.id, 'litres', Number(e.target.value))}
                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={purchase.pricePerLitre || ''}
                      onChange={(e) => updatePurchase(purchase.id, 'pricePerLitre', Number(e.target.value))}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formatNaira(purchase.totalCost)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={purchase.paymentStatus}
                      onChange={(e) =>
                        updatePurchase(purchase.id, 'paymentStatus', e.target.value as Purchase['paymentStatus'])
                      }
                      className={`px-2 py-1 text-xs font-medium border rounded-full ${getPaymentStatusColor(
                        purchase.paymentStatus
                      )}`}
                    >
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={purchase.amountPaid || ''}
                      onChange={(e) => updatePurchase(purchase.id, 'amountPaid', Number(e.target.value))}
                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={purchase.invoiceNo}
                      onChange={(e) => updatePurchase(purchase.id, 'invoiceNo', e.target.value)}
                      placeholder="INV-"
                      className="w-32 px-2 py-1 text-sm font-mono border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={purchase.note}
                      onChange={(e) => updatePurchase(purchase.id, 'note', e.target.value)}
                      placeholder="Optional"
                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removePurchase(purchase.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-900">
                  TOTALS
                </td>
                <td className="px-4 py-3 text-sm font-bold text-teal-600">{formatLitres(totals.litres)}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{formatNaira(totals.totalCost)}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-sm font-bold text-green-600">{formatNaira(totals.amountPaid)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
