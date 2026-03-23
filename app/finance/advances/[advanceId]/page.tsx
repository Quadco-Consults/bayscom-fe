/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  DollarSign,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { AdvanceStatusBadge, ApprovalStepper, AmountInWords } from '@/components/finance'
import type { ApprovalStep } from '@/components/finance'
import type { AdvanceStatus } from '@/utils/finance-state-machine'

interface AnticipatedExpense {
  description: string
  amount: number
}

interface ActualExpense {
  description: string
  amount: number
  receiptAttached: boolean
}

interface Receipt {
  id: string
  file: File
}

interface AdvanceDetail {
  id: string
  refNumber: string
  employeeName: string
  employeeId: string
  department: string
  purpose: string
  amount: number
  status: AdvanceStatus
  anticipatedExpenses: AnticipatedExpense[]
  actualExpenses: ActualExpense[]
  receipts: { name: string; url: string }[]
  createdAt: string
  approvedAt?: string
  disbursedAt?: string
  retirementSubmittedAt?: string
  fullyRetiredAt?: string
  approvalHistory: {
    role: string
    actorName: string
    action: string
    date: string
    comments?: string
  }[]
}

export default function AdvanceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const advanceId = params.advanceId as string

  // Mock current user
  const currentUserId = 'user-001'
  const currentUserRole = 'coo' as 'coo' | 'cfo' | 'md' | 'finance_officer'

  // Retirement form state
  const [actualExpenses, setActualExpenses] = useState<ActualExpense[]>([
    { description: '', amount: 0, receiptAttached: false },
  ])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [retirementNotes, setRetirementNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock advance data
  const advance: AdvanceDetail = {
    id: advanceId,
    refNumber: 'ADV-2026-015',
    employeeName: 'Usman Ibrahim',
    employeeId: currentUserId,
    department: 'Fleet & Haulage',
    purpose: 'Emergency fuel purchase and minor truck repairs - Route to Lagos',
    amount: 150000,
    status: 'disbursed',
    anticipatedExpenses: [
      { description: 'Fuel (AGO) - 500 litres', amount: 90000 },
      { description: 'Truck tire repair', amount: 35000 },
      { description: 'Accommodation (2 nights)', amount: 15000 },
      { description: 'Meals and miscellaneous', amount: 10000 },
    ],
    actualExpenses: [],
    receipts: [],
    createdAt: '2026-03-20T09:00:00Z',
    approvedAt: '2026-03-20T12:30:00Z',
    disbursedAt: '2026-03-20T14:30:00Z',
    approvalHistory: [
      {
        role: 'Finance Officer',
        actorName: 'Ibrahim Sani',
        action: 'approved',
        date: '2026-03-20T12:30:00Z',
      },
    ],
  }

  // Build approval steps
  const buildApprovalSteps = (): ApprovalStep[] => {
    const steps: ApprovalStep[] = [
      {
        label: 'Submitted',
        status: 'done',
        actorName: advance.employeeName,
        date: advance.createdAt,
      },
    ]

    if (advance.approvedAt) {
      steps.push({
        label: 'Approved',
        status: 'done',
        date: advance.approvedAt,
      })
    }

    if (advance.disbursedAt) {
      steps.push({
        label: 'Disbursed',
        status: 'done',
        date: advance.disbursedAt,
      })
    }

    if (advance.retirementSubmittedAt) {
      steps.push({
        label: 'Retirement Submitted',
        status: advance.status === 'retirement_submitted' ? 'active' : 'done',
        date: advance.retirementSubmittedAt,
      })
    }

    if (advance.fullyRetiredAt) {
      steps.push({
        label: 'Fully Retired',
        status: 'done',
        date: advance.fullyRetiredAt,
      })
    }

    return steps
  }

  const approvalSteps = buildApprovalSteps()

  const calculateTotalActual = () => {
    return actualExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
  }

  const calculateBalance = () => {
    return advance.amount - calculateTotalActual()
  }

  const addExpenseRow = () => {
    setActualExpenses([...actualExpenses, { description: '', amount: 0, receiptAttached: false }])
  }

  const removeExpenseRow = (index: number) => {
    if (actualExpenses.length > 1) {
      setActualExpenses(actualExpenses.filter((_, i) => i !== index))
    }
  }

  const updateExpenseRow = (index: number, field: keyof ActualExpense, value: any) => {
    const updated = [...actualExpenses]
    updated[index] = { ...updated[index], [field]: value }
    setActualExpenses(updated)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newReceipts: Receipt[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
    }))

    setReceipts([...receipts, ...newReceipts])
  }

  const removeReceipt = (id: string) => {
    setReceipts(receipts.filter((r) => r.id !== id))
  }

  const validateRetirement = () => {
    if (actualExpenses.every((exp) => !exp.description.trim())) {
      alert('Please add at least one actual expense')
      return false
    }
    if (receipts.length === 0) {
      alert('Please upload at least one receipt')
      return false
    }
    return true
  }

  const handleSubmitRetirement = async () => {
    if (!validateRetirement()) return

    setIsSubmitting(true)
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    router.push('/finance/advances')
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const isMyAdvance = advance.employeeId === currentUserId
  const canRetire = isMyAdvance && advance.status === 'disbursed'
  const balance = calculateBalance()

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/advances"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cash Advances
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{advance.refNumber}</h1>
              <AdvanceStatusBadge status={advance.status} />
            </div>
            <p className="text-lg text-gray-700">{advance.purpose}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
              <Printer className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Employee</p>
            <p className="text-sm font-medium text-gray-900">{advance.employeeName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
            <p className="text-sm font-medium text-gray-900">{advance.department}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Disbursed</p>
            <p className="text-sm font-semibold text-gray-900">{formatNaira(advance.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(advance.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <ApprovalStepper steps={approvalSteps} />

      {/* Anticipated Expenses */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Anticipated Expenses</h2>
        <div className="space-y-3">
          {advance.anticipatedExpenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{expense.description}</span>
              <span className="text-sm font-medium text-gray-900">{formatNaira(expense.amount)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300">
            <span className="text-sm font-semibold text-gray-900">Total Anticipated</span>
            <span className="text-lg font-bold text-gray-900">{formatNaira(advance.amount)}</span>
          </div>
        </div>
      </div>

      {/* Retirement Form (only show if can retire) */}
      {canRetire && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-900">Submit Retirement</h2>
          </div>

          <div className="space-y-6">
            {/* Actual Expenses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-900">Actual Expenses</label>
                <button
                  onClick={addExpenseRow}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Add Expense
                </button>
              </div>

              <div className="space-y-3">
                {actualExpenses.map((expense, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-white rounded-lg border border-gray-300">
                    <div className="col-span-12 md:col-span-6">
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) => updateExpenseRow(index, 'description', e.target.value)}
                        placeholder="Expense description"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-10 md:col-span-4">
                      <input
                        type="number"
                        value={expense.amount || ''}
                        onChange={(e) => updateExpenseRow(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="Amount (₦)"
                        min="0"
                        step="0.01"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="flex items-center justify-center h-full cursor-pointer">
                        <input
                          type="checkbox"
                          checked={expense.receiptAttached}
                          onChange={(e) => updateExpenseRow(index, 'receiptAttached', e.target.checked)}
                          className="rounded"
                          title="Receipt attached"
                        />
                      </label>
                    </div>
                    <div className="col-span-12 md:col-span-1">
                      <button
                        onClick={() => removeExpenseRow(index)}
                        disabled={actualExpenses.length === 1}
                        className="w-full p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <X className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Balance Summary */}
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Actual Expenses</span>
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(calculateTotalActual())}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Amount Received</span>
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(advance.amount)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                  <span className="text-sm font-bold text-gray-900">
                    {balance >= 0 ? 'Balance to Return' : 'Excess Spent'}
                  </span>
                  <span className={`text-lg font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNaira(Math.abs(balance))}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Upload Receipts</label>
              <div className="mb-4">
                <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </label>
                <p className="text-xs text-gray-600 mt-2">PDF or Image files (Max 5MB each)</p>
              </div>

              {receipts.length > 0 && (
                <div className="space-y-2">
                  {receipts.map((receipt) => (
                    <div key={receipt.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                      <div>
                        <p className="text-sm text-gray-900">{receipt.file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(receipt.file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeReceipt(receipt.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Additional Notes</label>
              <textarea
                value={retirementNotes}
                onChange={(e) => setRetirementNotes(e.target.value)}
                rows={3}
                placeholder="Any additional comments or explanations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t border-amber-300">
              <button
                onClick={handleSubmitRetirement}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Retirement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actual Expenses (if already retired) */}
      {advance.actualExpenses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actual Expenses</h2>
          <div className="space-y-3">
            {advance.actualExpenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{expense.description}</span>
                  {expense.receiptAttached && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
                <span className="text-sm font-medium text-gray-900">{formatNaira(expense.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="text-sm text-gray-500">
        <p>Created: {formatDate(advance.createdAt)}</p>
        {advance.disbursedAt && <p>Disbursed: {formatDate(advance.disbursedAt)}</p>}
        {advance.retirementSubmittedAt && <p>Retirement Submitted: {formatDate(advance.retirementSubmittedAt)}</p>}
      </div>
    </div>
  )
}
