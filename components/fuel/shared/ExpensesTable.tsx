'use client'

import { useState } from 'react'
import { formatNGN, formatDate } from '@/utils/fuel-format'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'

/**
 * Expense Entry Structure
 */
export interface ExpenseEntry {
  id: string
  date: string // YYYY-MM-DD format
  category: string
  description: string
  amount: number
  paidTo?: string
  receiptNo?: string
}

export interface ExpensesTableProps {
  /** Month and year scope */
  month: number
  year: number

  /** Expense entries */
  expenses: ExpenseEntry[]

  /** Available expense categories */
  categories: string[]

  /** Callback when an expense is added */
  onAdd?: (expense: Omit<ExpenseEntry, 'id'>) => void

  /** Callback when an expense is updated */
  onUpdate?: (id: string, expense: Partial<ExpenseEntry>) => void

  /** Callback when an expense is deleted */
  onDelete?: (id: string) => void

  /** Whether the month is locked (read-only) */
  isLocked?: boolean

  /** Show category breakdown summary */
  showSummary?: boolean
}

/**
 * ExpensesTable Component
 *
 * Daily expense tracking table used across:
 * - Filling Station → Operating Expenses
 * - LPG Section → Expenses (for P&L)
 * - AGO Peddling → Expenses by category
 */
export function ExpensesTable({
  month,
  year,
  expenses,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  isLocked = false,
  showSummary = true,
}: ExpensesTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: categories[0] || '',
    description: '',
    amount: 0,
    paidTo: '',
    receiptNo: '',
  })

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Category breakdown
  const categoryTotals: Record<string, number> = {}
  expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
  })

  const handleAdd = () => {
    if (!onAdd) return

    if (!formData.description.trim() || formData.amount <= 0) {
      alert('Please fill in all required fields')
      return
    }

    onAdd({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      paidTo: formData.paidTo || undefined,
      receiptNo: formData.receiptNo || undefined,
    })

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: categories[0] || '',
      description: '',
      amount: 0,
      paidTo: '',
      receiptNo: '',
    })
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    if (!onDelete) return

    if (confirm('Are you sure you want to delete this expense?')) {
      onDelete(id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Expense Button */}
      {!isLocked && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Expense
              </>
            )}
          </button>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && !isLocked && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">New Expense</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter expense description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid To</label>
              <input
                type="text"
                value={formData.paidTo}
                onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Vendor/Recipient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt No.</label>
              <input
                type="text"
                value={formData.receiptNo}
                onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Paid To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Receipt No.
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              {!isLocked && (
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={isLocked ? 6 : 7}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No expenses recorded for this month
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {formatDate(expense.date, 'short')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{expense.paidTo || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{expense.receiptNo || '—'}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                    {formatNGN(expense.amount)}
                  </td>
                  {!isLocked && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>

          {/* Total Row */}
          {expenses.length > 0 && (
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan={isLocked ? 5 : 5} className="px-4 py-3 text-sm text-gray-900">
                  TOTAL EXPENSES
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">
                  {formatNGN(totalExpenses)}
                </td>
                {!isLocked && <td></td>}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Category Summary */}
      {showSummary && expenses.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Expenses by Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([category, total]) => (
                <div key={category} className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">{category}</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatNGN(total)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {((total / totalExpenses) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
