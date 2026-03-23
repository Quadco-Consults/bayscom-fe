/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Info } from 'lucide-react'
import Link from 'next/link'
import { AmountInWords } from '@/components/finance'

export default function NewPettyCashRequestPage() {
  const router = useRouter()

  // Mock current user
  const currentUser = {
    id: 'user-001',
    name: 'Ibrahim Sani',
    department: 'Fuel Operations',
  }

  // Form state
  const [department] = useState(currentUser.department)
  const [purpose, setPurpose] = useState('')
  const [amount, setAmount] = useState('')
  const [details, setDetails] = useState('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Petty cash limits
  const maxAmount = 10000 // Maximum single request
  const currentFloatBalance = 8500 // Available in float

  const numericAmount = parseFloat(amount) || 0
  const exceedsMax = numericAmount > maxAmount
  const exceedsBalance = numericAmount > currentFloatBalance

  const validateForm = () => {
    if (!purpose.trim()) {
      alert('Please enter the purpose of this request')
      return false
    }
    if (!amount || numericAmount <= 0) {
      alert('Please enter a valid amount')
      return false
    }
    if (exceedsMax) {
      alert(`Amount cannot exceed ₦${maxAmount.toLocaleString('en-NG')} for petty cash requests`)
      return false
    }
    if (exceedsBalance) {
      alert(`Insufficient float balance. Current balance: ₦${currentFloatBalance.toLocaleString('en-NG')}`)
      return false
    }
    if (!details.trim()) {
      alert('Please provide details of what this cash will be used for')
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
    router.push('/finance/petty-cash')
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/petty-cash"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Petty Cash
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Petty Cash Request</h1>
        <p className="text-sm text-gray-500 mt-1">Request cash disbursement from petty cash float</p>
      </div>

      {/* Form (Physical Form Layout) */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-maroon-600 to-orange-500 p-6 text-white">
          <h2 className="text-xl font-bold text-center">BAYSCOM ENERGY LIMITED</h2>
          <p className="text-center text-sm mt-1">Petty Cash Voucher</p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Date (Auto) */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {new Date().toLocaleDateString('en-NG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Voucher No.</p>
              <p className="text-sm font-mono font-medium text-gray-900 mt-1">(Auto-generated)</p>
            </div>
          </div>

          {/* Requester Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Requested By</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-medium text-gray-900">
                {currentUser.name}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Department</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-medium text-gray-900">
                {department}
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
              Purpose <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Brief description (e.g., Office cleaning supplies)"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
              Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              max={maxAmount}
              className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                exceedsMax || exceedsBalance ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {numericAmount > 0 && !exceedsMax && !exceedsBalance && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Amount in Words</p>
                <AmountInWords amount={numericAmount} className="text-blue-900" />
              </div>
            )}
            {exceedsMax && (
              <p className="text-xs text-red-600 mt-1">
                Amount exceeds maximum petty cash limit of {formatNaira(maxAmount)}
              </p>
            )}
            {!exceedsMax && exceedsBalance && (
              <p className="text-xs text-red-600 mt-1">
                Insufficient float balance. Available: {formatNaira(currentFloatBalance)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Max per request: {formatNaira(maxAmount)} • Available in float: {formatNaira(currentFloatBalance)}
            </p>
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Provide specific details of what this cash will be used for
            </p>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Example:&#10;- Item 1: Cleaning detergent (₦1,500)&#10;- Item 2: Toilet rolls (₦800)&#10;- Item 3: Hand soap (₦1,200)"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Signature Placeholder */}
          <div className="pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Requester Signature</p>
                <div className="h-16 border-b-2 border-gray-300 flex items-end pb-1">
                  <p className="text-sm text-gray-400 italic">(Digital signature on submit)</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Received By</p>
                <div className="h-16 border-b-2 border-gray-300 flex items-end pb-1">
                  <p className="text-sm text-gray-400 italic">(Filled on disbursement)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Petty Cash Approval Process</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your request will be reviewed by Finance</li>
            <li>• Once approved, you'll be notified to collect the cash</li>
            <li>• Ensure you provide receipts for all items purchased</li>
            <li>• Maximum amount per request: {formatNaira(maxAmount)}</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/finance/petty-cash"
          className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || exceedsMax || exceedsBalance}
          className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </div>
  )
}
