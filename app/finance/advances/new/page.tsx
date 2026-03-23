'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Send, Info } from 'lucide-react'
import Link from 'next/link'
import { AmountInWords } from '@/components/finance'

interface AnticipatedExpense {
  id: string
  description: string
  amount: string
}

export default function NewCashAdvancePage() {
  const router = useRouter()

  // Mock current user
  const currentUser = {
    id: 'user-001',
    name: 'Ibrahim Sani',
    department: 'Fuel Operations',
  }

  // Form state
  const [purpose, setPurpose] = useState('')
  const [anticipatedExpenses, setAnticipatedExpenses] = useState<AnticipatedExpense[]>([
    { id: '1', description: '', amount: '' },
  ])
  const [additionalNotes, setAdditionalNotes] = useState('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addExpenseRow = () => {
    setAnticipatedExpenses([
      ...anticipatedExpenses,
      { id: Date.now().toString(), description: '', amount: '' },
    ])
  }

  const removeExpenseRow = (id: string) => {
    if (anticipatedExpenses.length > 1) {
      setAnticipatedExpenses(anticipatedExpenses.filter((exp) => exp.id !== id))
    }
  }

  const updateExpenseRow = (id: string, field: 'description' | 'amount', value: string) => {
    setAnticipatedExpenses(
      anticipatedExpenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    )
  }

  const calculateTotal = () => {
    return anticipatedExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const validateForm = () => {
    if (!purpose.trim()) {
      alert('Please enter the purpose of this cash advance')
      return false
    }
    if (anticipatedExpenses.every((exp) => !exp.description.trim())) {
      alert('Please add at least one anticipated expense')
      return false
    }
    if (calculateTotal() <= 0) {
      alert('Total amount must be greater than zero')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    router.push('/finance/advances')
  }

  const totalAmount = calculateTotal()

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/advances"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cash Advances
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Cash Advance Request</h1>
        <p className="text-sm text-gray-500 mt-1">Request cash advance for field expenses</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Employee Name</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-medium text-gray-900">
              {currentUser.name}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Department</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-medium text-gray-900">
              {currentUser.department}
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Describe the reason for this cash advance and where you will be traveling/what you will be doing
          </p>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            placeholder="Example: Emergency fuel purchase and minor truck repairs - Route to Lagos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Anticipated Expenses */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Anticipated Expenses</h3>
              <p className="text-sm text-gray-500 mt-1">Break down your expected expenses</p>
            </div>
            <button
              type="button"
              onClick={addExpenseRow}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </button>
          </div>

          <div className="space-y-3">
            {anticipatedExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="col-span-12 md:col-span-8">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) => updateExpenseRow(expense.id, 'description', e.target.value)}
                    placeholder="e.g., Fuel (AGO) - 500 litres"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-10 md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpenseRow(expense.id, 'amount', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeExpenseRow(expense.id)}
                    disabled={anticipatedExpenses.length === 1}
                    className="w-full p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-end gap-4 pt-3 border-t border-gray-300">
            <span className="text-lg font-semibold text-gray-900">Total Cash Advance:</span>
            <span className="text-2xl font-bold text-blue-600">{formatNaira(totalAmount)}</span>
          </div>
        </div>

        {/* Amount in Words */}
        {totalAmount > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Amount in Words</p>
            <AmountInWords amount={totalAmount} className="text-blue-900 text-base" />
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder="Any additional information or special requirements..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your request will be reviewed and approved by Finance</li>
            <li>• Once approved, cash will be disbursed before your trip/activity</li>
            <li>• You must retire this advance within 7 days of disbursement</li>
            <li>• Keep all receipts and submit them with your retirement</li>
            <li>• Any unspent balance must be returned to Finance</li>
          </ul>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-900 mb-1">Retirement Requirement</h3>
          <p className="text-sm text-amber-800">
            Cash advances MUST be retired within 7 days of disbursement. Failure to retire on time may result in
            deduction from salary or suspension of future advance privileges.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/finance/advances"
          className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </div>
  )
}
