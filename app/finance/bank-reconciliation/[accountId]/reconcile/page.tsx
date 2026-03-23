'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ArrowLeft, Check, X, AlertCircle, CheckCircle, Download, Save } from 'lucide-react'
import Link from 'next/link'

export default function ReconciliationWorkspacePage({ params }: { params: { accountId: string } }) {
  const [glBalance] = useState(45000000)
  const [statementBalance] = useState(43800000)
  const [depositsInTransit] = useState(1500000)
  const [outstandingChecks] = useState(300000)

  const reconciledGLBalance = glBalance
  const reconciledStatementBalance = statementBalance + depositsInTransit - outstandingChecks
  const difference = reconciledGLBalance - reconciledStatementBalance
  const isBalanced = Math.abs(difference) < 1

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/finance/bank-reconciliation"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bank Reconciliation Workspace</h1>
              <p className="text-sm text-gray-600">Operating Account - GTBank | March 2025</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
              disabled={!isBalanced}
            >
              <Save className="w-4 h-4" />
              Complete Reconciliation
            </button>
          </div>
        </div>

        {/* Reconciliation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GL Balance Side */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Per Books (GL)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GL Balance</span>
                <span className="font-semibold text-gray-900">{formatCurrency(glBalance)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-900">Adjusted GL Balance</span>
                  <span className="text-gray-900">{formatCurrency(reconciledGLBalance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statement Balance Side */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Per Bank Statement</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bank Statement Balance</span>
                <span className="font-semibold text-gray-900">{formatCurrency(statementBalance)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Add: Deposits in Transit</span>
                <span className="font-medium">+{formatCurrency(depositsInTransit)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Less: Outstanding Checks</span>
                <span className="font-medium">-{formatCurrency(outstandingChecks)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-900">Adjusted Bank Balance</span>
                  <span className="text-gray-900">{formatCurrency(reconciledStatementBalance)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reconciliation Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reconciliation Status</h3>
              <p className="text-sm text-gray-600 mt-1">
                Difference between adjusted balances
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(difference))}
              </div>
              {isBalanced ? (
                <div className="flex items-center gap-2 text-green-600 mt-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Balanced</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Out of Balance</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unmatched Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Unmatched GL Transactions</h3>
              <p className="text-sm text-gray-600">Transactions not yet matched with bank statement</p>
            </div>
            <div className="p-4 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No unmatched transactions</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Unmatched Bank Transactions</h3>
              <p className="text-sm text-gray-600">Bank statement items not in GL</p>
            </div>
            <div className="p-4 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No unmatched transactions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
