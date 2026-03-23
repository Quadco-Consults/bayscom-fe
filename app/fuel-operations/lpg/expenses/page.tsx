// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  ExpensesTable,
  type ExpenseEntry,
  MonthScopeBar,
  InventorySummaryCard,
  type SummaryItem,
} from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { Receipt, Download, Printer } from 'lucide-react'

/**
 * LPG Section - Expenses Page
 *
 * Demonstrates:
 * - ExpensesTable component
 * - Daily expense tracking by category
 * - Monthly expense summaries
 * - Category-wise breakdown
 */
export default function LPGExpensesPage() {
  const { config, getStation, getExpenseCategories, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [expenseRows, setExpenseRows] = useState<ExpenseEntry[]>([])
  const [loading, setLoading] = useState(true)

  const station = getStation(stationId as 'filling-station' | 'ago-peddling' | 'lpg')
  const isLocked = isMonthLocked(stationId, month, year)
  const expenseCategories = getExpenseCategories(stationId as 'filling-station' | 'ago-peddling' | 'lpg')

  // Generate daily rows for the month
  useEffect(() => {
    setLoading(true)

    const daysInMonth = new Date(year, month, 0).getDate()
    const rows: ExpenseEntry[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = date.toISOString().split('T')[0]

      // Initialize with empty category amounts
      const categoryAmounts: Record<string, number> = {}
      expenseCategories.forEach((cat) => {
        categoryAmounts[cat.code] = 0
      })

      rows.push({
        id: `EXP-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        date: dateStr,
        dayNumber: day,
        categoryAmounts,
      })
    }

    // Add sample data for demonstration
    if (rows.length > 0) {
      // Day 1
      rows[0].categoryAmounts = {
        SALARIES: 15000,
        TRANSPORT: 2500,
        UTILITIES: 8500,
        MAINTENANCE: 0,
        SUPPLIES: 1200,
        SECURITY: 3000,
        MISC: 500,
      }

      if (rows.length > 1) {
        // Day 2
        rows[1].categoryAmounts = {
          SALARIES: 15000,
          TRANSPORT: 1800,
          UTILITIES: 0,
          MAINTENANCE: 5500,
          SUPPLIES: 800,
          SECURITY: 3000,
          MISC: 0,
        }

        if (rows.length > 2) {
          // Day 3
          rows[2].categoryAmounts = {
            SALARIES: 15000,
            TRANSPORT: 2200,
            UTILITIES: 0,
            MAINTENANCE: 0,
            SUPPLIES: 1500,
            SECURITY: 3000,
            MISC: 1200,
          }
        }
      }
    }

    setExpenseRows(rows)
    setLoading(false)
  }, [stationId, month, year, expenseCategories])

  // Handle row updates
  const handleRowUpdate = (rowId: string, category: string, amount: number) => {
    setExpenseRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== rowId) return row

        return {
          ...row,
          categoryAmounts: {
            ...row.categoryAmounts,
            [category]: amount,
          },
        }
      })
    )
  }

  // Calculate monthly summary
  const monthlySummary = useMemo((): SummaryItem[] => {
    // Total expenses
    const totalExpenses = expenseRows.reduce((sum, row) => {
      const dayTotal = Object.values(row.categoryAmounts).reduce((s, amt) => s + amt, 0)
      return sum + dayTotal
    }, 0)

    // Category totals
    const categoryTotals: Record<string, number> = {}
    expenseCategories.forEach((cat) => {
      categoryTotals[cat.code] = expenseRows.reduce(
        (sum, row) => sum + (row.categoryAmounts[cat.code] || 0),
        0
      )
    })

    // Days with expenses
    const daysWithExpenses = expenseRows.filter((row) =>
      Object.values(row.categoryAmounts).some((amt) => amt > 0)
    ).length

    // Average daily expense
    const avgDailyExpense = daysWithExpenses > 0 ? totalExpenses / daysWithExpenses : 0

    // Top category
    const topCategory = Object.entries(categoryTotals).reduce(
      (max, [code, total]) => (total > max.total ? { code, total } : max),
      { code: '', total: 0 }
    )

    const topCategoryName =
      expenseCategories.find((cat) => cat.code === topCategory.code)?.name || 'N/A'

    return [
      {
        label: 'Total Expenses',
        value: totalExpenses,
        format: 'currency',
        highlight: 'danger',
        description: `Across ${daysWithExpenses} days`,
      },
      {
        label: 'Average Daily Expense',
        value: avgDailyExpense,
        format: 'currency',
        description: `Based on days with expenses`,
      },
      {
        label: 'Highest Category',
        value: topCategory.total,
        format: 'currency',
        description: topCategoryName,
      },
      ...expenseCategories.map((cat) => ({
        label: cat.name,
        value: categoryTotals[cat.code] || 0,
        format: 'currency' as const,
        description: `${((categoryTotals[cat.code] / totalExpenses) * 100 || 0).toFixed(1)}% of total`,
      })),
    ]
  }, [expenseRows, expenseCategories])

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Month Scope Bar */}
        <MonthScopeBar
          stationId={stationId}
          month={month}
          year={year}
          isLocked={isLocked}
          stations={lpgStations}
          onStationChange={setStation}
          onMonthChange={(m, y) => setMonthYear(m, y)}
          showLockToggle={false}
          actions={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          }
        />

        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Receipt className="w-8 h-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LPG Expenses</h1>
            <p className="text-sm text-gray-500">
              Daily operating expenses by category
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Expense Summary"
          subtitle="Computed totals for the selected month"
          items={monthlySummary}
          icon={<Receipt className="w-6 h-6" />}
        />

        {/* Expenses Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Daily Expense Register</h2>
            <p className="text-sm text-gray-500 mt-1">
              Record all operating expenses by category. Auto-calculated totals are shown in
              italic.
            </p>
          </div>

          <ExpensesTable
            month={month}
            year={year}
            rows={expenseRows}
            categories={expenseCategories}
            onRowUpdate={handleRowUpdate}
            isLocked={isLocked}
          />
        </div>

        {/* Category Guidelines */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">Expense Categories:</h3>
          <div className="grid grid-cols-2 gap-3">
            {expenseCategories.map((cat) => (
              <div key={cat.code} className="text-sm text-orange-800">
                <strong>{cat.name}:</strong> {cat.description || 'N/A'}
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Record expenses daily to ensure accurate P&L calculation</li>
            <li>Keep all receipts and invoices for audit purposes</li>
            <li>Large or unusual expenses should be documented with notes</li>
            <li>Salaries should be allocated daily (monthly salary ÷ days in month)</li>
            <li>Utilities may be recorded on billing day or allocated daily</li>
            <li>
              Total monthly expenses feed into the P&L statement for profitability analysis
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
