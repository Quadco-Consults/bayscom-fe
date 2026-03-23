'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, CheckCircle, XCircle, Download, Printer } from 'lucide-react'
import Link from 'next/link'
import { MemoStatusBadge, ApprovalStepper, AmountInWords } from '@/components/finance'
import type { ApprovalStep } from '@/components/finance'
import type { MemoStatus } from '@/utils/finance-state-machine'
import { canTransitionMemo } from '@/utils/finance-state-machine'

interface MemoDetail {
  id: string
  refNumber: string
  subject: string
  raisedBy: string
  raisedById: string
  department: string
  amount: number
  route: 'coo' | 'cfo' | 'both'
  status: MemoStatus
  justification: string
  attachments: { name: string; url: string }[]
  createdAt: string
  updatedAt: string
  approvalHistory: {
    role: string
    actorName: string
    action: 'approved' | 'rejected'
    date: string
    comments?: string
  }[]
}

export default function MemoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const memoId = params.memoId as string

  // Mock current user
  const currentUserId = 'user-001'
  const currentUserRole = 'coo' as 'coo' | 'cfo' | 'md' | 'finance_officer'

  // Action states
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [actionComments, setActionComments] = useState('')

  // Mock memo data - in production, fetch from API
  const memo: MemoDetail = {
    id: memoId,
    refNumber: 'MEM-031',
    subject: 'LPG Cylinder Purchase - March 2026',
    raisedBy: 'Aisha Mohammed',
    raisedById: 'user-002',
    department: 'Fuel Operations',
    amount: 450000,
    route: 'coo',
    status: 'awaiting_coo',
    justification:
      'We need to purchase 50 units of 12.5kg LPG cylinders to replenish our stock. Current inventory shows only 15 empty cylinders available, which is below our reorder level of 30 units. This purchase will ensure we can meet customer demand during the upcoming high-demand period.\n\nSupplier: Nasara Gas Cylinders Ltd\nUnit Price: ₦9,000 per cylinder\nQuantity: 50 cylinders\nTotal: ₦450,000',
    attachments: [
      { name: 'supplier_quote.pdf', url: '#' },
      { name: 'inventory_report.xlsx', url: '#' },
    ],
    createdAt: '2026-03-20T09:30:00Z',
    updatedAt: '2026-03-20T09:30:00Z',
    approvalHistory: [],
  }

  // Build approval steps based on route
  const buildApprovalSteps = (): ApprovalStep[] => {
    const steps: ApprovalStep[] = []

    // Submitted step (always first)
    steps.push({
      label: 'Submitted',
      status: 'done',
      actorName: memo.raisedBy,
      date: memo.createdAt,
    })

    if (memo.route === 'coo' || memo.route === 'both') {
      const cooApproval = memo.approvalHistory.find((h) => h.role === 'COO')
      steps.push({
        label: 'COO Approval',
        status:
          memo.status === 'awaiting_coo'
            ? 'active'
            : memo.status === 'rejected'
            ? 'rejected'
            : cooApproval
            ? 'done'
            : 'pending',
        actorName: cooApproval?.actorName,
        date: cooApproval?.date,
      })
    }

    if (memo.route === 'cfo' || memo.route === 'both') {
      const cfoApproval = memo.approvalHistory.find((h) => h.role === 'CFO')
      steps.push({
        label: 'CFO Approval',
        status:
          memo.status === 'awaiting_cfo'
            ? 'active'
            : memo.status === 'rejected'
            ? 'rejected'
            : cfoApproval
            ? 'done'
            : 'pending',
        actorName: cfoApproval?.actorName,
        date: cfoApproval?.date,
      })
    }

    const mdApproval = memo.approvalHistory.find((h) => h.role === 'MD')
    steps.push({
      label: 'MD Approval',
      status:
        memo.status === 'awaiting_md'
          ? 'active'
          : memo.status === 'rejected'
          ? 'rejected'
          : memo.status === 'md_approved' || memo.status === 'pv_raised' || memo.status === 'paid'
          ? 'done'
          : 'pending',
      actorName: mdApproval?.actorName,
      date: mdApproval?.date,
    })

    if (memo.status === 'pv_raised' || memo.status === 'paid') {
      steps.push({
        label: 'PV Raised',
        status: 'done',
        date: memo.updatedAt,
      })
    }

    if (memo.status === 'paid') {
      steps.push({
        label: 'Paid',
        status: 'done',
        date: memo.updatedAt,
      })
    }

    return steps
  }

  const approvalSteps = buildApprovalSteps()

  // Check if current user can approve/reject
  const canApprove = canTransitionMemo(memo.status, getNextApprovalStatus(), currentUserRole)
  const canReject = ['awaiting_coo', 'awaiting_cfo', 'awaiting_md'].includes(memo.status)

  function getNextApprovalStatus(): MemoStatus {
    if (memo.status === 'awaiting_coo') {
      return memo.route === 'both' ? 'awaiting_cfo' : 'awaiting_md'
    }
    if (memo.status === 'awaiting_cfo') {
      return 'awaiting_md'
    }
    if (memo.status === 'awaiting_md') {
      return 'md_approved'
    }
    return memo.status
  }

  const handleApprove = async () => {
    setIsApproving(true)
    // In production, call API to update memo status
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsApproving(false)
    router.push('/finance/memos')
  }

  const handleReject = async () => {
    if (!actionComments.trim()) {
      alert('Please provide comments for rejection')
      return
    }
    setIsRejecting(true)
    // In production, call API to reject memo
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRejecting(false)
    router.push('/finance/memos')
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

  const getRouteLabel = (route: 'coo' | 'cfo' | 'both') => {
    if (route === 'coo') return 'COO → MD'
    if (route === 'cfo') return 'CFO → MD'
    return 'COO → CFO → MD'
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        href="/finance/memos"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Memos
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{memo.refNumber}</h1>
              <MemoStatusBadge status={memo.status} />
            </div>
            <p className="text-lg text-gray-700">{memo.subject}</p>
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
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Raised By</p>
            <p className="text-sm font-medium text-gray-900">{memo.raisedBy}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
            <p className="text-sm font-medium text-gray-900">{memo.department}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount</p>
            <p className="text-sm font-semibold text-gray-900">{formatNaira(memo.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Approval Route</p>
            <p className="text-sm font-medium text-gray-900">{getRouteLabel(memo.route)}</p>
          </div>
        </div>
      </div>

      {/* Approval Progress */}
      <ApprovalStepper steps={approvalSteps} />

      {/* Justification */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Justification</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{memo.justification}</p>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700 uppercase tracking-wide mb-1">Amount in Words</p>
        <AmountInWords amount={memo.amount} className="text-blue-900 text-base" />
      </div>

      {/* Attachments */}
      {memo.attachments.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h2>
          <div className="space-y-2">
            {memo.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{attachment.name}</span>
                <Download className="h-4 w-4 text-gray-400 ml-auto" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Approval History */}
      {memo.approvalHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h2>
          <div className="space-y-4">
            {memo.approvalHistory.map((history, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div
                  className={`p-2 rounded-full ${
                    history.action === 'approved' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {history.action === 'approved' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {history.role} {history.action === 'approved' ? 'Approved' : 'Rejected'}
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

      {/* Action Panel (only show if user can take action) */}
      {(canApprove || canReject) && memo.status !== 'md_approved' && memo.status !== 'rejected' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments <span className="text-gray-500">(optional for approval, required for rejection)</span>
              </label>
              <textarea
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add your comments here..."
              />
            </div>
            <div className="flex items-center gap-3">
              {canApprove && (
                <button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isApproving ? 'Approving...' : 'Approve'}
                </button>
              )}
              {canReject && (
                <button
                  onClick={handleReject}
                  disabled={isApproving || isRejecting}
                  className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="text-sm text-gray-500">
        <p>Created: {formatDate(memo.createdAt)}</p>
        {memo.updatedAt !== memo.createdAt && <p>Last Updated: {formatDate(memo.updatedAt)}</p>}
      </div>
    </div>
  )
}
