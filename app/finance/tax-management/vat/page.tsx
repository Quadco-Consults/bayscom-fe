'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ArrowLeft, Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { VATReturn } from '@/lib/types'
import Link from 'next/link'

const mockVATReturns: VATReturn[] = [
  {
    id: '1',
    returnNumber: 'VAT-2025-Q1',
    returnPeriodStart: '2025-01-01',
    returnPeriodEnd: '2025-03-31',
    dueDate: '2025-04-21',
    totalOutputVAT: 8500000,
    totalInputVAT: 2900000,
    netVAT: 5600000,
    adjustments: 0,
    vatPayable: 5600000,
    status: 'draft',
    createdAt: '2025-03-20',
    updatedAt: '2025-03-22',
  },
  {
    id: '2',
    returnNumber: 'VAT-2024-Q4',
    returnPeriodStart: '2024-10-01',
    returnPeriodEnd: '2024-12-31',
    dueDate: '2025-01-21',
    totalOutputVAT: 7800000,
    totalInputVAT: 2500000,
    netVAT: 5300000,
    adjustments: 0,
    vatPayable: 5300000,
    status: 'paid',
    submittedDate: '2025-01-18',
    paidDate: '2025-01-20',
    paidAmount: 5300000,
    paymentReference: 'PAY-VAT-202501-001',
    filingReference: 'FIRS-VAT-Q4-2024-789456',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-20',
  },
]

export default function VATReturnsPage() {
  const [returns] = useState<VATReturn[]>(mockVATReturns)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-50 text-gray-700 border-gray-200',
      submitted: 'bg-blue-50 text-blue-700 border-blue-200',
      paid: 'bg-green-50 text-green-700 border-green-200',
      overdue: 'bg-red-50 text-red-700 border-red-200',
    }

    const icons = {
      draft: <FileText className="w-3 h-3" />,
      submitted: <Clock className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      overdue: <AlertCircle className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/finance/tax-management"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VAT Returns</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and file 7.5% VAT returns for Nigeria (FIRS)
              </p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            New VAT Return
          </button>
        </div>

        {/* VAT Returns Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Return Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Output VAT
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Input VAT
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  VAT Payable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.map(vat => (
                <tr key={vat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{vat.returnNumber}</div>
                    <div className="text-xs text-gray-500">Due: {formatDate(vat.dueDate)}</div>
                    {vat.filingReference && (
                      <div className="text-xs text-gray-500">FIRS: {vat.filingReference}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(vat.returnPeriodStart)} - {formatDate(vat.returnPeriodEnd)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(vat.totalOutputVAT)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(vat.totalInputVAT)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(vat.vatPayable)}
                    </div>
                    {vat.paidAmount && (
                      <div className="text-xs text-green-600">Paid {formatDate(vat.paidDate!)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(vat.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
