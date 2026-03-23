'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react'
import Link from 'next/link'
import { AmountInWords } from '@/components/finance'

interface InvoiceLineItem {
  id: string
  description: string
  quantity: string
  unitPrice: string
}

export default function NewPVPage() {
  const router = useRouter()

  // Form state
  const [linkToMemo, setLinkToMemo] = useState(false)
  const [selectedMemoId, setSelectedMemoId] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [payeeBank, setPayeeBank] = useState('')
  const [payeeAccountNumber, setPayeeAccountNumber] = useState('')
  const [purpose, setPurpose] = useState('')
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: '', quantity: '', unitPrice: '' },
  ])

  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock approved memos for selection
  const approvedMemos = [
    { id: 'memo-001', refNumber: 'MEM-031', subject: 'LPG Cylinder Purchase', amount: 450000 },
    { id: 'memo-002', refNumber: 'MEM-033', subject: 'Office Supplies - Q1 2026', amount: 85000 },
    { id: 'memo-003', refNumber: 'MEM-035', subject: 'Staff Training Program', amount: 320000 },
  ]

  // Banks list
  const banks = [
    'Access Bank',
    'Ecobank',
    'Fidelity Bank',
    'First Bank of Nigeria',
    'Guaranty Trust Bank',
    'Keystone Bank',
    'Polaris Bank',
    'Stanbic IBTC Bank',
    'Sterling Bank',
    'Union Bank',
    'United Bank for Africa',
    'Unity Bank',
    'Wema Bank',
    'Zenith Bank',
  ]

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: '', unitPrice: '' },
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateLineItemAmount = (item: InvoiceLineItem) => {
    const qty = parseFloat(item.quantity) || 0
    const price = parseFloat(item.unitPrice) || 0
    return qty * price
  }

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + calculateLineItemAmount(item), 0)
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const validateForm = () => {
    if (linkToMemo && !selectedMemoId) {
      alert('Please select a memo to link')
      return false
    }
    if (!payeeName.trim()) {
      alert('Please enter payee name')
      return false
    }
    if (!payeeBank) {
      alert('Please select payee bank')
      return false
    }
    if (!payeeAccountNumber.trim()) {
      alert('Please enter payee account number')
      return false
    }
    if (!purpose.trim()) {
      alert('Please enter purpose/description')
      return false
    }
    if (lineItems.length === 0 || lineItems.every((item) => !item.description.trim())) {
      alert('Please add at least one invoice line item')
      return false
    }
    if (calculateTotal() <= 0) {
      alert('Total amount must be greater than zero')
      return false
    }
    return true
  }

  const handleSaveDraft = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push('/finance/vouchers')
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    router.push('/finance/vouchers')
  }

  const totalAmount = calculateTotal()

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/vouchers"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payment Vouchers
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Payment Voucher</h1>
        <p className="text-sm text-gray-500 mt-1">Authorize bank transfer to supplier/vendor</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Link to Memo Option */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            id="linkToMemo"
            checked={linkToMemo}
            onChange={(e) => setLinkToMemo(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="linkToMemo" className="flex-1 text-sm font-medium text-blue-900 cursor-pointer">
            Link this payment voucher to an approved memo
          </label>
        </div>

        {linkToMemo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Approved Memo <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMemoId}
              onChange={(e) => setSelectedMemoId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a memo...</option>
              {approvedMemos.map((memo) => (
                <option key={memo.id} value={memo.id}>
                  {memo.refNumber} - {memo.subject} ({formatNaira(memo.amount)})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Only MD-approved memos are shown</p>
          </div>
        )}

        {/* Payee Information */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payee Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="Company or individual name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank <span className="text-red-500">*</span>
              </label>
              <select
                value={payeeBank}
                onChange={(e) => setPayeeBank(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={payeeAccountNumber}
                onChange={(e) => setPayeeAccountNumber(e.target.value)}
                placeholder="0123456789"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose/Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            placeholder="Brief description of what this payment is for"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Invoice Line Items */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Invoice Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-5 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-5 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₦)</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-10 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                  <div className="px-2 py-1.5 text-sm font-mono bg-white border border-gray-300 rounded text-gray-900">
                    {formatNaira(calculateLineItemAmount(item))}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
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
            <span className="text-lg font-semibold text-gray-900">Total:</span>
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
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">3-Signatory Approval Process</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Finance Officer reviews the voucher details</li>
          <li>• COO, CFO, and MD provide approval signatures</li>
          <li>• All three signatories must approve before transfer</li>
          <li>• Finance marks as transferred after bank confirmation</li>
          <li>• Finally marked as paid when payment confirmed</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/finance/vouchers"
          className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
            className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || isSubmitting}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
