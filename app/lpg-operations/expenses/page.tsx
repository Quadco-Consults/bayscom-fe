'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Receipt, Calendar, TrendingDown, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface LPGExpense {
  id: string
  date: string
  stationId: string
  stationName: string
  description: string
  category: 'DIESEL' | 'MAINTENANCE' | 'SUPPLIES' | 'LABOR' | 'EQUIPMENT' | 'OTHER'
  amount: number
  remarks: string
  createdAt: string
}

const EXPENSE_CATEGORIES = [
  'DIESEL',
  'MAINTENANCE',
  'SUPPLIES',
  'LABOR',
  'EQUIPMENT',
  'OTHER'
]

export default function LPGExpensesPage() {
  const [expenses, setExpenses] = useState<LPGExpense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<LPGExpense[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpense, setSelectedExpense] = useState<LPGExpense | null>(null)
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterMonth, setFilterMonth] = useState('')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    description: '',
    category: 'DIESEL' as 'DIESEL' | 'MAINTENANCE' | 'SUPPLIES' | 'LABOR' | 'EQUIPMENT' | 'OTHER',
    amount: '',
    remarks: ''
  })

  // Load stations
  useEffect(() => {
    const activeStations = getActiveStations().filter(s => s.productsAvailable.includes('LPG'))
    setStations(activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName })))
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lpgExpenses')
    if (savedData) {
      setExpenses(JSON.parse(savedData))
    } else {
      // Sample data from GARKI Excel document (June 2025)
      const sampleData: LPGExpense[] = [
        {
          id: '1',
          date: '2025-06-02',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'DIESEL',
          category: 'DIESEL',
          amount: 83160,
          remarks: 'Generator fuel',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: '2025-06-06',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'DIESEL',
          category: 'DIESEL',
          amount: 226000,
          remarks: 'Generator fuel',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          date: '2025-06-09',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'DIESEL',
          category: 'DIESEL',
          amount: 81160,
          remarks: 'Generator fuel',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          date: '2025-06-11',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'FILLING VALVE',
          category: 'EQUIPMENT',
          amount: 15000,
          remarks: 'Replacement valve',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          date: '2025-06-13',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'ENGINEER WORKMANSHIP',
          category: 'LABOR',
          amount: 11000,
          remarks: 'Equipment repair',
          createdAt: new Date().toISOString()
        },
        {
          id: '6',
          date: '2025-06-17',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'DIESEL',
          category: 'DIESEL',
          amount: 84700,
          remarks: 'Generator fuel',
          createdAt: new Date().toISOString()
        },
        {
          id: '7',
          date: '2025-06-23',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'POS PAPER',
          category: 'SUPPLIES',
          amount: 35000,
          remarks: 'Receipt paper rolls',
          createdAt: new Date().toISOString()
        },
        {
          id: '8',
          date: '2025-06-23',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'DIESEL',
          category: 'DIESEL',
          amount: 86250,
          remarks: 'Generator fuel',
          createdAt: new Date().toISOString()
        },
        {
          id: '9',
          date: '2025-06-25',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'ALLOWANCE',
          category: 'LABOR',
          amount: 30000,
          remarks: 'Staff allowance',
          createdAt: new Date().toISOString()
        },
        {
          id: '10',
          date: '2025-06-26',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'RUBBER',
          category: 'MAINTENANCE',
          amount: 31000,
          remarks: 'Rubber seals replacement',
          createdAt: new Date().toISOString()
        },
        {
          id: '11',
          date: '2025-06-30',
          stationId: 'GARKI',
          stationName: 'GARKI Station',
          description: 'DIESEL',
          category: 'DIESEL',
          amount: 86240,
          remarks: 'Generator fuel',
          createdAt: new Date().toISOString()
        }
      ]
      setExpenses(sampleData)
      localStorage.setItem('lpgExpenses', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('lpgExpenses', JSON.stringify(expenses))
    }
  }, [expenses])

  // Filter expenses
  useEffect(() => {
    let filtered = expenses

    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === filterCategory)
    }

    if (filterMonth) {
      filtered = filtered.filter(exp => exp.date.startsWith(filterMonth))
    }

    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.stationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredExpenses(filtered)
  }, [searchTerm, filterCategory, filterMonth, expenses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.stationId || !formData.description || !formData.amount) {
      alert('Please fill in all required fields!')
      return
    }

    const station = stations.find(s => s.id === formData.stationId)

    const newExpense: LPGExpense = {
      id: selectedExpense?.id || Date.now().toString(),
      date: formData.date,
      stationId: formData.stationId,
      stationName: station?.stationName || '',
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      remarks: formData.remarks,
      createdAt: selectedExpense?.createdAt || new Date().toISOString()
    }

    if (selectedExpense) {
      setExpenses(expenses.map(e => e.id === selectedExpense.id ? newExpense : e))
    } else {
      setExpenses([newExpense, ...expenses])
    }

    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      description: '',
      category: 'DIESEL',
      amount: '',
      remarks: ''
    })
    setSelectedExpense(null)
  }

  const handleEdit = (expense: LPGExpense) => {
    setSelectedExpense(expense)
    setFormData({
      date: expense.date,
      stationId: expense.stationId,
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      remarks: expense.remarks
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  // Summary calculations
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const expensesByCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    return acc
  }, {} as Record<string, number>)

  // Get top category
  const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LPG Expenses Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Record and monitor operational expenses</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₦{totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Diesel</p>
              <p className="text-2xl font-bold text-gray-900">₦{expensesByCategory['DIESEL']?.toLocaleString() || 0}</p>
            </div>
            <Receipt className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">₦{expensesByCategory['MAINTENANCE']?.toLocaleString() || 0}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{topCategory?.[0] || '-'}</p>
              <p className="text-xs text-gray-500">₦{topCategory?.[1]?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search description or station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <Input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            placeholder="Filter by month"
          />
        </div>
      </Card>

      {/* Expenses Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Amount (₦)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Remarks</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{expense.date}</td>
                    <td className="py-3 px-4 text-sm font-medium">{expense.stationName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${expense.category === 'DIESEL' ? 'bg-orange-100 text-orange-800' :
                          expense.category === 'MAINTENANCE' ? 'bg-blue-100 text-blue-800' :
                          expense.category === 'SUPPLIES' ? 'bg-green-100 text-green-800' :
                          expense.category === 'LABOR' ? 'bg-purple-100 text-purple-800' :
                          expense.category === 'EQUIPMENT' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{expense.description}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-red-600">
                      ₦{expense.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{expense.remarks}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredExpenses.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-sm font-bold text-right">TOTAL:</td>
                  <td className="py-3 px-4 text-sm font-bold text-right text-red-600">
                    ₦{totalExpenses.toLocaleString()}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* Expense Breakdown by Category */}
      <Card className="mt-6 p-6">
        <h3 className="text-lg font-medium mb-4">Expense Breakdown by Category</h3>
        <div className="space-y-3">
          {Object.entries(expensesByCategory)
            .filter(([, amount]) => amount > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-bold text-gray-900">
                      ₦{amount.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category === 'DIESEL' ? 'bg-orange-500' :
                        category === 'MAINTENANCE' ? 'bg-blue-500' :
                        category === 'SUPPLIES' ? 'bg-green-500' :
                        category === 'LABOR' ? 'bg-purple-500' :
                        category === 'EQUIPMENT' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Station *</label>
                    <select
                      value={formData.stationId}
                      onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Station</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.stationName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₦) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <Input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., DIESEL, FILLING VALVE, POS PAPER"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Remarks</label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Additional details..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {selectedExpense ? 'Update Expense' : 'Add Expense'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
