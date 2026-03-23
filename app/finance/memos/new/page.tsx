/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Save, Send } from 'lucide-react'
import Link from 'next/link'
import { AmountInWords } from '@/components/finance'

interface AttachmentFile {
  id: string
  file: File
}

export default function NewMemoPage() {
  const router = useRouter()

  // Form state
  const [subject, setSubject] = useState('')
  const [department, setDepartment] = useState('')
  const [amount, setAmount] = useState('')
  const [route, setRoute] = useState<'coo' | 'cfo' | 'both'>('coo')
  const [justification, setJustification] = useState('')
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])

  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock current user
  const currentUser = {
    name: 'Fatima Yusuf',
    department: 'Administration',
  }

  // Departments list
  const departments = [
    'Administration',
    'Finance',
    'Fuel Operations',
    'Fleet & Haulage',
    'Peddling Operations',
    'Human Resources',
    'Procurement',
    'IT & Systems',
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: AttachmentFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
    }))

    setAttachments([...attachments, ...newAttachments])
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const validateForm = () => {
    if (!subject.trim()) {
      alert('Please enter a subject')
      return false
    }
    if (!department) {
      alert('Please select a department')
      return false
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return false
    }
    if (!justification.trim()) {
      alert('Please enter justification')
      return false
    }
    return true
  }

  const handleSaveDraft = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    // In production, call API to save as draft
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push('/finance/memos')
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    // In production, call API to submit memo
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    router.push('/finance/memos')
  }

  const numericAmount = parseFloat(amount) || 0

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/memos"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Memos
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Memo</h1>
        <p className="text-sm text-gray-500 mt-1">Request authorization for spending</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of the request (e.g., LPG Cylinder Purchase - March 2026)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {numericAmount > 0 && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Amount in Words</p>
              <AmountInWords amount={numericAmount} className="text-blue-900" />
            </div>
          )}
        </div>

        {/* Approval Route */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Route <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">Select who should approve this memo before MD approval</p>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="route"
                value="coo"
                checked={route === 'coo'}
                onChange={(e) => setRoute(e.target.value as 'coo' | 'cfo' | 'both')}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">COO → MD</p>
                <p className="text-xs text-gray-500">Chief Operating Officer approval, then Managing Director</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="route"
                value="cfo"
                checked={route === 'cfo'}
                onChange={(e) => setRoute(e.target.value as 'coo' | 'cfo' | 'both')}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">CFO → MD</p>
                <p className="text-xs text-gray-500">Chief Financial Officer approval, then Managing Director</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="route"
                value="both"
                checked={route === 'both'}
                onChange={(e) => setRoute(e.target.value as 'coo' | 'cfo' | 'both')}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">COO → CFO → MD</p>
                <p className="text-xs text-gray-500">Both COO and CFO approvals required before MD</p>
              </div>
            </label>
          </div>
        </div>

        {/* Justification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justification <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Provide detailed justification for this spending request. Include supplier details, quantities, unit
            prices, and business need.
          </p>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={8}
            placeholder="Example:&#10;&#10;We need to purchase 50 units of 12.5kg LPG cylinders to replenish our stock. Current inventory shows only 15 empty cylinders available, which is below our reorder level of 30 units.&#10;&#10;Supplier: Nasara Gas Cylinders Ltd&#10;Unit Price: ₦9,000 per cylinder&#10;Quantity: 50 cylinders&#10;Total: ₦450,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">{justification.length} characters</p>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <p className="text-sm text-gray-500 mb-3">
            Upload supporting documents (quotes, invoices, inventory reports, etc.)
          </p>

          {/* Upload Button */}
          <div className="mb-4">
            <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
              <input type="file" multiple onChange={handleFileUpload} className="hidden" accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png" />
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF, Excel, Word, or Image files (Max 5MB each)</p>
          </div>

          {/* Attachment List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{attachment.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(attachment.file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your memo will be routed to the selected approver(s)</li>
          <li>• You'll receive notifications when actions are taken</li>
          <li>• Once MD approved, Finance can raise a Payment Voucher</li>
          <li>• You can track status in the Memos list</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link
          href="/finance/memos"
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
            {isSubmitting ? 'Submitting...' : 'Submit Memo'}
          </button>
        </div>
      </div>
    </div>
  )
}
