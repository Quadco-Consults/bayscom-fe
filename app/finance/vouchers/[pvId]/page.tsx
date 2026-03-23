'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, CheckCircle, XCircle, Download, Printer, Building2, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { PVStatusBadge, ApprovalStepper, AmountInWords } from '@/components/finance'
import type { ApprovalStep } from '@/components/finance'
import type { PVStatus } from '@/utils/finance-state-machine'
import { canTransitionPV } from '@/utils/finance-state-machine'

interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface PVDetail {
  id: string
  refNumber: string
  memoRef?: string
  memoId?: string
  payeeName: string
  payeeBank: string
  payeeAccountNumber: string
  amount: number
  purpose: string
  status: PVStatus
  invoiceItems: InvoiceLineItem[]
  createdBy: string
  createdById: string
  createdAt: string
  updatedAt: string
  approvalHistory: {
    role: string
    actorName: string
    action: 'reviewed' | 'approved' | 'rejected' | 'transferred' | 'paid'
    date: string
    comments?: string
  }[]
}

export default function PVDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pvId = params.pvId as string

  // Mock current user
  const currentUserId = 'user-001'
  const currentUserRole = 'finance_officer' as 'finance_officer' | 'coo' | 'cfo' | 'md'

  // Action states
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionComments, setActionComments] = useState('')

  // Mock PV data
  const pv: PVDetail = {
    id: pvId,
    refNumber: 'PV-0041',
    memoRef: 'MEM-031',
    memoId: 'memo-001',
    payeeName: 'Nasara Gas Cylinders Ltd',
    payeeBank: 'Guaranty Trust Bank',
    payeeAccountNumber: '0123456789',
    amount: 450000,
    purpose: 'LPG Cylinder Purchase - March 2026',
    status: 'awaiting_review',
    invoiceItems: [
      {
        description: '12.5kg LPG Cylinders (Empty)',
        quantity: 50,
        unitPrice: 9000,
        amount: 450000,
      },
    ],
    createdBy: 'Ibrahim Sani',
    createdById: 'user-002',
    createdAt: '2026-03-22T10:00:00Z',
    updatedAt: '2026-03-22T10:00:00Z',
    approvalHistory: [],
  }

  // Build approval steps (3-signatory system: Finance Review → COO/CFO/MD Approve)
  const buildApprovalSteps = (): ApprovalStep[] => {
    const steps: ApprovalStep[] = []

    // Created
    steps.push({
      label: 'Created',
      status: 'done',
      actorName: pv.createdBy,
      date: pv.createdAt,
    })

    // Finance Review
    const financeReview = pv.approvalHistory.find((h) => h.action === 'reviewed')
    steps.push({
      label: 'Finance Review',
      status:
        // @ts-ignore - Type comparison intentional for runtime status checks
        pv.status === 'awaiting_review'
          ? 'active'
          // @ts-ignore - Type comparison intentional for runtime status checks
          : pv.status === 'rejected'
          ? 'rejected'
          : financeReview
          ? 'done'
          : 'pending',
      actorName: financeReview?.actorName,
      date: financeReview?.date,
    })

    // 3-Signatory Approval (COO, CFO, MD)
    const approvals = pv.approvalHistory.filter((h) => h.action === 'approved')
    steps.push({
      label: '3-Signatory Approval',
      status:
        pv.status === 'reviewed'
          ? 'active'
          // @ts-ignore - Type comparison intentional for runtime status checks
          : pv.status === 'rejected'
          ? 'rejected'
          : pv.status === 'approved' || pv.status === 'transferred' || pv.status === 'paid'
          ? 'done'
          : 'pending',
      actorName: approvals.length > 0 ? `${approvals.length} of 3 signed` : undefined,
      date: approvals.length > 0 ? approvals[approvals.length - 1].date : undefined,
    })

    // Transferred
    const transferred = pv.approvalHistory.find((h) => h.action === 'transferred')
    if (pv.status === 'transferred' || pv.status === 'paid') {
      steps.push({
        label: 'Transferred',
        status: 'done',
        actorName: transferred?.actorName,
        date: transferred?.date,
      })
    }

    // Paid
    const paid = pv.approvalHistory.find((h) => h.action === 'paid')
    if (pv.status === 'paid') {
      steps.push({
        label: 'Paid',
        status: 'done',
        actorName: paid?.actorName,
        date: paid?.date,
      })
    }

    return steps
  }

  const approvalSteps = buildApprovalSteps()

  // Check user permissions
  const canReview = currentUserRole === 'finance_officer' && pv.status === 'awaiting_review'
  const canApprove =
    ['coo', 'cfo', 'md'].includes(currentUserRole) && pv.status === 'reviewed'
  const canMarkTransferred = currentUserRole === 'finance_officer' && pv.status === 'approved'
  const canMarkPaid = currentUserRole === 'finance_officer' && pv.status === 'transferred'
  const canReject = ['awaiting_review', 'reviewed'].includes(pv.status)

  const handleAction = async (action: 'review' | 'approve' | 'transfer' | 'paid' | 'reject') => {
    if (action === 'reject' && !actionComments.trim()) {
      alert('Please provide comments for rejection')
      return
    }

    setIsProcessing(true)
    // In production, call API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    router.push('/finance/vouchers')
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

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/vouchers"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payment Vouchers
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{pv.refNumber}</h1>
              <PVStatusBadge status={pv.status} />
            </div>
            <p className="text-lg text-gray-700">{pv.purpose}</p>
            {pv.memoRef && (
              <Link
                href={`/finance/memos/${pv.memoId}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                <FileText className="h-3.5 w-3.5" />
                Linked to {pv.memoRef}
              </Link>
            )}
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created By</p>
            <p className="text-sm font-medium text-gray-900">{pv.createdBy}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
            <p className="text-sm font-semibold text-gray-900">{formatNaira(pv.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(pv.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Approval Progress */}
      <ApprovalStepper steps={approvalSteps} />

      {/* Payee Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Payee Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payee Name</p>
            <p className="text-sm font-medium text-gray-900">{pv.payeeName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bank</p>
            <p className="text-sm font-medium text-gray-900">{pv.payeeBank}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Number</p>
            <p className="text-sm font-mono font-medium text-gray-900">{pv.payeeAccountNumber}</p>
          </div>
        </div>
      </div>

      {/* Invoice Line Items */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Invoice Line Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pv.invoiceItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNaira(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatNaira(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  Total
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  {formatNaira(pv.invoiceItems.reduce((sum, item) => sum + item.amount, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Amount in Words</p>
        <AmountInWords amount={pv.amount} className="text-blue-900 text-base" />
      </div>

      {/* Approval History */}
      {pv.approvalHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h2>
          <div className="space-y-4">
            {pv.approvalHistory.map((history, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div
                  className={`p-2 rounded-full ${
                    history.action === 'rejected' ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  {history.action === 'rejected' ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {history.role} {history.action}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(history.date)}</p>
                  </div>
                  <p className="text-sm text-gray-600">{history.actorName}</p>
                  {history.comments && <p className="text-sm text-gray-700 mt-2 italic">{history.comments}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Panel */}
      {(canReview || canApprove || canMarkTransferred || canMarkPaid || canReject) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments{' '}
                <span className="text-gray-500">
                  {canReject ? '(required for rejection)' : '(optional)'}
                </span>
              </label>
              <textarea
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add your comments here..."
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {canReview && (
                <button
                  onClick={() => handleAction('review')}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Mark as Reviewed'}
                </button>
              )}
              {canApprove && (
                <button
                  onClick={() => handleAction('approve')}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Approve (Sign)'}
                </button>
              )}
              {canMarkTransferred && (
                <button
                  onClick={() => handleAction('transfer')}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Mark as Transferred'}
                </button>
              )}
              {canMarkPaid && (
                <button
                  onClick={() => handleAction('paid')}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Mark as Paid'}
                </button>
              )}
              {canReject && (
                <button
                  onClick={() => handleAction('reject')}
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Reject'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="text-sm text-gray-500">
        <p>Created: {formatDate(pv.createdAt)}</p>
        {pv.updatedAt !== pv.createdAt && <p>Last Updated: {formatDate(pv.updatedAt)}</p>}
      </div>
    </div>
  )
}
