'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { ExpensesTable, type ExpenseEntry } from '@/components/fuel/shared/ExpensesTable'

export default function AGOExpensesPage() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([])

  // AGO-specific expense categories
  const expenseCategories = [
    'Driver Salaries',
    'Vehicle Maintenance',
    'Fuel (for delivery vehicle)',
    'Rent & Utilities',
    'Marketing & Promotion',
    'Administrative Costs',
    'Miscellaneous',
  ]

  const handleAdd = (expense: Omit<ExpenseEntry, 'id'>) => {
    const newExpense: ExpenseEntry = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setExpenses([...expenses, newExpense])
  }

  const handleUpdate = (id: string, updates: Partial<ExpenseEntry>) => {
    setExpenses(expenses.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)))
  }

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AGO Peddling Expenses</h1>
        <p className="text-sm text-gray-500 mt-1">Track daily operating expenses for diesel peddling operations</p>
      </div>
      <ExpensesTable
        month={month}
        year={year}
        expenses={expenses}
        categories={expenseCategories}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
