/**
 * Finance Module - State Machine & Workflow Validation
 *
 * Defines valid state transitions for all finance document types
 * Ensures frontend enforces correct approval workflows
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type MemoStatus =
  | 'draft'
  | 'awaiting_coo'
  | 'awaiting_cfo'
  | 'awaiting_md'
  | 'md_approved'
  | 'pv_raised'
  | 'paid'
  | 'rejected'

export type PVStatus =
  | 'draft'
  | 'awaiting_review'
  | 'reviewed'
  | 'approved'
  | 'transferred'
  | 'paid'

export type PettyCashStatus = 'submitted' | 'approved' | 'disbursed' | 'rejected'

export type AdvanceStatus =
  | 'approved'
  | 'disbursed'
  | 'retirement_submitted'
  | 'partially_retired'
  | 'fully_retired'

export type MemoRoute = 'coo' | 'cfo' | 'coo_and_cfo'

export type UserRole =
  | 'staff'
  | 'department_head'
  | 'coo'
  | 'cfo'
  | 'md'
  | 'finance_officer'
  | 'finance_manager'

// ============================================================================
// MEMO STATE MACHINE
// ============================================================================

export const memoTransitions: Record<
  MemoStatus,
  {
    next: MemoStatus[]
    allowedRoles: UserRole[]
    action: string
  }[]
> = {
  draft: [
    {
      next: ['awaiting_coo'],
      allowedRoles: ['staff', 'department_head', 'finance_officer'],
      action: 'submit (route: COO)',
    },
    {
      next: ['awaiting_cfo'],
      allowedRoles: ['staff', 'department_head', 'finance_officer'],
      action: 'submit (route: CFO)',
    },
  ],
  awaiting_coo: [
    {
      next: ['awaiting_md'],
      allowedRoles: ['coo'],
      action: 'approve',
    },
    {
      next: ['rejected'],
      allowedRoles: ['coo'],
      action: 'reject',
    },
  ],
  awaiting_cfo: [
    {
      next: ['awaiting_md'],
      allowedRoles: ['cfo'],
      action: 'approve',
    },
    {
      next: ['rejected'],
      allowedRoles: ['cfo'],
      action: 'reject',
    },
  ],
  awaiting_md: [
    {
      next: ['md_approved'],
      allowedRoles: ['md'],
      action: 'approve',
    },
    {
      next: ['rejected'],
      allowedRoles: ['md'],
      action: 'reject',
    },
  ],
  md_approved: [
    {
      next: ['pv_raised'],
      allowedRoles: ['finance_officer', 'finance_manager'],
      action: 'raise PV',
    },
  ],
  pv_raised: [
    {
      next: ['paid'],
      allowedRoles: ['finance_manager'],
      action: 'mark paid',
    },
  ],
  paid: [],
  rejected: [],
}

/**
 * Check if a memo transition is valid
 */
export function canTransitionMemo(
  currentStatus: MemoStatus,
  targetStatus: MemoStatus,
  userRole: UserRole
): boolean {
  const transitions = memoTransitions[currentStatus]
  if (!transitions) return false

  return transitions.some(
    (t) => t.next.includes(targetStatus) && t.allowedRoles.includes(userRole)
  )
}

/**
 * Get available actions for a memo
 */
export function getMemoActions(
  currentStatus: MemoStatus,
  userRole: UserRole
): { action: string; targetStatus: MemoStatus }[] {
  const transitions = memoTransitions[currentStatus]
  if (!transitions) return []

  return transitions
    .filter((t) => t.allowedRoles.includes(userRole))
    .flatMap((t) =>
      t.next.map((status) => ({
        action: t.action,
        targetStatus: status,
      }))
    )
}

// ============================================================================
// PAYMENT VOUCHER STATE MACHINE
// ============================================================================

export const pvTransitions: Record<
  PVStatus,
  {
    next: PVStatus[]
    allowedRoles: UserRole[]
    action: string
  }[]
> = {
  draft: [
    {
      next: ['awaiting_review'],
      allowedRoles: ['finance_officer'],
      action: 'submit for review',
    },
  ],
  awaiting_review: [
    {
      next: ['reviewed'],
      allowedRoles: ['finance_officer', 'finance_manager'],
      action: 'check & review',
    },
    {
      next: ['draft'],
      allowedRoles: ['finance_officer', 'finance_manager'],
      action: 'return to draft',
    },
  ],
  reviewed: [
    {
      next: ['approved'],
      allowedRoles: ['coo', 'cfo'],
      action: 'approve',
    },
    {
      next: ['awaiting_review'],
      allowedRoles: ['coo', 'cfo'],
      action: 'return for review',
    },
  ],
  approved: [
    {
      next: ['transferred'],
      allowedRoles: ['finance_officer', 'finance_manager'],
      action: 'mark transferred',
    },
  ],
  transferred: [
    {
      next: ['paid'],
      allowedRoles: ['finance_manager'],
      action: 'confirm paid',
    },
  ],
  paid: [],
}

/**
 * Check if a PV transition is valid
 */
export function canTransitionPV(
  currentStatus: PVStatus,
  targetStatus: PVStatus,
  userRole: UserRole
): boolean {
  const transitions = pvTransitions[currentStatus]
  if (!transitions) return false

  return transitions.some(
    (t) => t.next.includes(targetStatus) && t.allowedRoles.includes(userRole)
  )
}

/**
 * Get available actions for a PV
 */
export function getPVActions(
  currentStatus: PVStatus,
  userRole: UserRole
): { action: string; targetStatus: PVStatus }[] {
  const transitions = pvTransitions[currentStatus]
  if (!transitions) return []

  return transitions
    .filter((t) => t.allowedRoles.includes(userRole))
    .flatMap((t) =>
      t.next.map((status) => ({
        action: t.action,
        targetStatus: status,
      }))
    )
}

// ============================================================================
// PETTY CASH STATE MACHINE
// ============================================================================

export const pettyCashTransitions: Record<
  PettyCashStatus,
  {
    next: PettyCashStatus[]
    allowedRoles: UserRole[]
    action: string
  }[]
> = {
  submitted: [
    {
      next: ['approved'],
      allowedRoles: ['department_head', 'coo'],
      action: 'approve',
    },
    {
      next: ['rejected'],
      allowedRoles: ['department_head', 'coo'],
      action: 'reject',
    },
  ],
  approved: [
    {
      next: ['disbursed'],
      allowedRoles: ['finance_officer'],
      action: 'disburse',
    },
  ],
  disbursed: [],
  rejected: [],
}

/**
 * Check if a petty cash transition is valid
 */
export function canTransitionPettyCash(
  currentStatus: PettyCashStatus,
  targetStatus: PettyCashStatus,
  userRole: UserRole
): boolean {
  const transitions = pettyCashTransitions[currentStatus]
  if (!transitions) return false

  return transitions.some(
    (t) => t.next.includes(targetStatus) && t.allowedRoles.includes(userRole)
  )
}

// ============================================================================
// CASH ADVANCE STATE MACHINE
// ============================================================================

export const advanceTransitions: Record<
  AdvanceStatus,
  {
    next: AdvanceStatus[]
    allowedRoles: UserRole[]
    action: string
  }[]
> = {
  approved: [
    {
      next: ['disbursed'],
      allowedRoles: ['finance_officer', 'finance_manager'],
      action: 'disburse',
    },
  ],
  disbursed: [
    {
      next: ['retirement_submitted'],
      allowedRoles: ['staff', 'department_head'],
      action: 'submit retirement',
    },
  ],
  retirement_submitted: [
    {
      next: ['partially_retired', 'fully_retired'],
      allowedRoles: ['department_head', 'finance_manager'],
      action: 'confirm retirement',
    },
  ],
  partially_retired: [
    {
      next: ['fully_retired'],
      allowedRoles: ['department_head', 'finance_manager'],
      action: 'submit final retirement',
    },
  ],
  fully_retired: [],
}

/**
 * Check if an advance transition is valid
 */
export function canTransitionAdvance(
  currentStatus: AdvanceStatus,
  targetStatus: AdvanceStatus,
  userRole: UserRole
): boolean {
  const transitions = advanceTransitions[currentStatus]
  if (!transitions) return false

  return transitions.some(
    (t) => t.next.includes(targetStatus) && t.allowedRoles.includes(userRole)
  )
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine next approver based on memo route and current status
 */
export function getNextMemoApprover(
  currentStatus: MemoStatus,
  route: MemoRoute
): UserRole | null {
  if (currentStatus === 'draft') {
    if (route === 'coo' || route === 'coo_and_cfo') return 'coo'
    if (route === 'cfo') return 'cfo'
  }

  if (currentStatus === 'awaiting_coo') return 'md'
  if (currentStatus === 'awaiting_cfo') return 'md'
  if (currentStatus === 'awaiting_md') return null // Final approval

  return null
}

/**
 * Check if user can approve at current stage
 */
export function canUserApproveMemo(
  currentStatus: MemoStatus,
  userRole: UserRole,
  route: MemoRoute
): boolean {
  const nextApprover = getNextMemoApprover(currentStatus, route)
  return nextApprover === userRole
}

/**
 * Get human-readable status label
 */
export function getMemoStatusLabel(status: MemoStatus): string {
  const labels: Record<MemoStatus, string> = {
    draft: 'Draft',
    awaiting_coo: 'Awaiting COO',
    awaiting_cfo: 'Awaiting CFO',
    awaiting_md: 'Awaiting MD',
    md_approved: 'MD Approved',
    pv_raised: 'PV Raised',
    paid: 'Paid',
    rejected: 'Rejected',
  }
  return labels[status]
}

export function getPVStatusLabel(status: PVStatus): string {
  const labels: Record<PVStatus, string> = {
    draft: 'Draft',
    awaiting_review: 'Awaiting Review',
    reviewed: 'Reviewed',
    approved: 'Approved',
    transferred: 'Transferred',
    paid: 'Paid',
  }
  return labels[status]
}

export function getPettyCashStatusLabel(status: PettyCashStatus): string {
  const labels: Record<PettyCashStatus, string> = {
    submitted: 'Submitted',
    approved: 'Approved',
    disbursed: 'Disbursed',
    rejected: 'Rejected',
  }
  return labels[status]
}

export function getAdvanceStatusLabel(status: AdvanceStatus): string {
  const labels: Record<AdvanceStatus, string> = {
    approved: 'Approved',
    disbursed: 'Disbursed',
    retirement_submitted: 'Retirement Submitted',
    partially_retired: 'Partially Retired',
    fully_retired: 'Fully Retired',
  }
  return labels[status]
}
