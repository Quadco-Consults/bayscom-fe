'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { formatNGN } from '@/utils/fleet-format'
import { fleetCalc } from '@/utils/fleet-calcs'

export interface ExpenseItem {
  id: string
  category: string
  description: string
  amt: number
}

interface ExpenseLineItemsProps {
  items: ExpenseItem[]
  onChange: (items: ExpenseItem[]) => void
  categories: string[]
  disabled?: boolean
}

/**
 * ExpenseLineItems Component
 *
 * Dynamic line items for trip expenses with add/remove functionality
 * - Used in New Trip form for recording multiple expenses
 * - Auto-calculates total expenses
 * - Supports custom categories
 */
export function ExpenseLineItems({
  items,
  onChange,
  categories,
  disabled = false,
}: ExpenseLineItemsProps) {
  const handleAddItem = () => {
    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: categories[0] || '',
      description: '',
      amt: 0,
    }
    onChange([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id: string, field: keyof ExpenseItem, value: string | number) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const totalExpenses = fleetCalc.totalExpenses(items)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Trip Expenses</h3>
        <button
          type="button"
          onClick={handleAddItem}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Expense Items Table */}
      {items.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase w-1/4">
                  Category
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase w-2/5">
                  Description
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase w-1/4">
                  Amount
                </th>
                <th className="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                      disabled={disabled}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Enter description..."
                      disabled={disabled}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.amt || ''}
                      onChange={(e) =>
                        handleItemChange(item.id, 'amt', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                      disabled={disabled}
                      className="w-full px-2 py-1.5 text-sm text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={disabled}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Row */}
          <div className="bg-gray-50 border-t border-gray-200 px-3 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total Expenses</span>
              <span className="text-base font-bold text-gray-900">{formatNGN(totalExpenses)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500 mb-3">No expenses added yet</p>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add First Expense
          </button>
        </div>
      )}
    </div>
  )
}
