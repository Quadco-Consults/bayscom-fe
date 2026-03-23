'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { FileText, DollarSign, AlertCircle, CheckCircle, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function TaxManagementPage() {
  const vatPayable = 5600000
  const whtCollected = 2800000
  const overdueReturns = 0
  const upcomingDeadline = '2025-04-21'

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage VAT, Withholding Tax, and compliance for Nigeria
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VAT Payable</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(vatPayable)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current period</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">WHT Collected</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(whtCollected)}
                </p>
                <p className="text-xs text-gray-500 mt-1">To be remitted</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
                <p className="mt-2 text-2xl font-semibold text-red-600">{overdueReturns}</p>
                <p className="text-xs text-gray-500 mt-1">All up to date</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Deadline</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {new Date(upcomingDeadline).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500 mt-1">VAT Return (Q1 2025)</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/finance/tax-management/vat">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                    <FileText className="w-6 h-6" style={{ color: '#8B1538' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">VAT (Value Added Tax)</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      7.5% VAT returns, filings, and transaction tracking
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Period Output VAT:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(8500000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Period Input VAT:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(2900000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Net VAT Payable:</span>
                        <span className="font-semibold" style={{ color: '#8B1538' }}>
                          {formatCurrency(vatPayable)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>

          <Link href="/finance/tax-management/withholding-tax">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Withholding Tax (WHT)</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      WHT deductions, remittances, and certificate issuance
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Company WHT:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(1500000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Individual WHT:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(800000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Professional Fees WHT:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(500000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Total to Remit:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(whtCollected)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>

          <Link href="/finance/tax-management/certificates">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tax Certificates</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Issue and manage WHT certificates for vendors
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Issued this Month:</span>
                        <span className="font-medium text-gray-900">12 certificates</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pending Issuance:</span>
                        <span className="font-medium text-orange-600">5 certificates</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
                <p className="text-sm text-gray-600 mt-1">Overall tax compliance tracking</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">All returns filed on time</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">All remittances up to date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
