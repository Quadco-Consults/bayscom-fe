import type {
  MemoStatus,
  PVStatus,
  PettyCashStatus,
  AdvanceStatus,
} from '@/utils/finance-state-machine'
import {
  getMemoStatusLabel,
  getPVStatusLabel,
  getPettyCashStatusLabel,
  getAdvanceStatusLabel,
} from '@/utils/finance-state-machine'

interface BadgeProps {
  size?: 'sm' | 'md' | 'lg'
}

interface MemoStatusBadgeProps extends BadgeProps {
  status: MemoStatus
}

interface PVStatusBadgeProps extends BadgeProps {
  status: PVStatus
}

interface PettyCashStatusBadgeProps extends BadgeProps {
  status: PettyCashStatus
}

interface AdvanceStatusBadgeProps extends BadgeProps {
  status: AdvanceStatus
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

// Status color mapping based on UI/UX conventions in the spec
const getStatusColors = (
  status: string
): { bg: string; text: string; border: string } => {
  // Draft
  if (status === 'draft') {
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200',
    }
  }

  // Awaiting/Pending states
  if (
    status.includes('awaiting') ||
    status === 'submitted' ||
    status === 'awaiting_review' ||
    status === 'retirement_submitted'
  ) {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
    }
  }

  // Approved/Signed states
  if (
    status === 'md_approved' ||
    status === 'approved' ||
    status === 'reviewed' ||
    status === 'disbursed'
  ) {
    return {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
    }
  }

  // Rejected/Returned states
  if (status === 'rejected') {
    return {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    }
  }

  // Paid/Completed states
  if (status === 'paid' || status === 'fully_retired') {
    return {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
    }
  }

  // PV Raised
  if (status === 'pv_raised') {
    return {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
    }
  }

  // Transferred
  if (status === 'transferred') {
    return {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
    }
  }

  // Partially retired
  if (status === 'partially_retired') {
    return {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
    }
  }

  // Default
  return {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
  }
}

export function MemoStatusBadge({ status, size = 'md' }: MemoStatusBadgeProps) {
  const colors = getStatusColors(status)
  const label = getMemoStatusLabel(status)

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size]} ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {label}
    </span>
  )
}

export function PVStatusBadge({ status, size = 'md' }: PVStatusBadgeProps) {
  const colors = getStatusColors(status)
  const label = getPVStatusLabel(status)

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size]} ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {label}
    </span>
  )
}

export function PettyCashStatusBadge({ status, size = 'md' }: PettyCashStatusBadgeProps) {
  const colors = getStatusColors(status)
  const label = getPettyCashStatusLabel(status)

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size]} ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {label}
    </span>
  )
}

export function AdvanceStatusBadge({ status, size = 'md' }: AdvanceStatusBadgeProps) {
  const colors = getStatusColors(status)
  const label = getAdvanceStatusLabel(status)

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size]} ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {label}
    </span>
  )
}
