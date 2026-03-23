'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Building2,
  Truck,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import Link from 'next/link'

export default function FinanceDashboardPage() {
  // KPIs
  const totalRevenue = 450000000
  const revenueGrowth = 15.5
  const totalExpenses = 375000000
  const expenseGrowth = -8.2
  const netProfit = 75000000
  const profitMargin = 16.7
  const cashBalance = 82000000
  const cashGrowth = 12.3

  // Working Capital
  const currentAssets = 180000000
  const currentLiabilities = 95000000
  const workingCapital = currentAssets - currentLiabilities
  const currentRatio = currentAssets / currentLiabilities

  // Receivables & Payables
  const accountsReceivable = 58000000
  const accountsPayable = 45000000
  const daysReceivable = 38
  const daysPayable = 42

  // Operational Metrics
  const activeStations = 5
  const activeTrucks = 3
  const pendingInvoices = 12
  const overdueInvoices = 3

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Real-time financial overview and key performance indicators
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>As of {new Date().toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueGrowth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {formatPercentage(revenueGrowth)}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="mt-1 text-xs text-gray-500">Year to date</p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {expenseGrowth <= 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                {formatPercentage(Math.abs(expenseGrowth))}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            <p className="mt-1 text-xs text-gray-500">Year to date</p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <CheckCircle className="w-4 h-4" />
                {profitMargin}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(netProfit)}</p>
            <p className="mt-1 text-xs text-gray-500">Profit margin</p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${cashGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cashGrowth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {formatPercentage(cashGrowth)}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Cash & Bank</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(cashBalance)}</p>
            <p className="mt-1 text-xs text-gray-500">Available balance</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Working Capital */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Capital</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Assets</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(currentAssets)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Liabilities</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(currentLiabilities)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Working Capital</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(workingCapital)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Current Ratio</span>
                  <span className="text-sm font-semibold text-gray-900">{currentRatio.toFixed(2)}:1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Receivables & Payables */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Receivables & Payables</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Accounts Receivable</span>
                  <div className="text-xs text-gray-500 mt-1">Avg. {daysReceivable} days</div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(accountsReceivable)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Accounts Payable</span>
                  <div className="text-xs text-gray-500 mt-1">Avg. {daysPayable} days</div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(accountsPayable)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Net Working Position</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(accountsReceivable - accountsPayable)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Status & Quick Links */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Operational Metrics */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Active Stations</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{activeStations}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Active Trucks</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{activeTrucks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Pending Invoices</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{pendingInvoices}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600">Overdue Invoices</span>
                </div>
                <span className="text-sm font-semibold text-orange-600">{overdueInvoices}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/finance/general-ledger/journal-entries/new"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FileText className="w-4 h-4" />
                New Journal Entry
              </Link>
              <Link
                href="/finance/bank-reconciliation"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Building2 className="w-4 h-4" />
                Bank Reconciliation
              </Link>
              <Link
                href="/finance/fixed-assets"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Truck className="w-4 h-4" />
                Fixed Assets
              </Link>
              <Link
                href="/finance/tax-management"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <DollarSign className="w-4 h-4" />
                Tax Management
              </Link>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">All banks reconciled</p>
                  <p className="text-xs text-gray-500">Last reconciliation: Today</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">VAT return due soon</p>
                  <p className="text-xs text-gray-500">Due: April 21, 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Depreciation completed</p>
                  <p className="text-xs text-gray-500">March 2025 processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
