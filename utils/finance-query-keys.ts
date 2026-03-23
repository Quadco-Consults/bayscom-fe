/**
 * Finance Module - React Query Keys Factory
 *
 * Centralized query key definitions for all finance data
 * Ensures consistent cache invalidation across the module
 */

export interface MemoFilters {
  status?: string
  createdBy?: string
  department?: string
  dateFrom?: string
  dateTo?: string
}

export interface PVFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  memoId?: string
}

export const financeKeys = {
  all: ['finance'] as const,

  // Dashboard
  dashboard: () => [...financeKeys.all, 'dashboard'] as const,

  // Memos
  memos: (filters?: MemoFilters) =>
    [...financeKeys.all, 'memos', filters] as const,

  memo: (memoId: string) => [...financeKeys.all, 'memo', memoId] as const,

  memosPending: (userId: string) =>
    [...financeKeys.all, 'memos-pending', userId] as const,

  memosCount: () => [...financeKeys.all, 'memos-count'] as const,

  // Payment Vouchers
  vouchers: (filters?: PVFilters) =>
    [...financeKeys.all, 'vouchers', filters] as const,

  voucher: (pvId: string) => [...financeKeys.all, 'voucher', pvId] as const,

  vouchersByMemo: (memoId: string) =>
    [...financeKeys.all, 'vouchers-by-memo', memoId] as const,

  // Petty Cash
  pettyCash: (stationId: string, dept: string) =>
    [...financeKeys.all, 'petty-cash', stationId, dept] as const,

  pettyCashRequests: (floatId: string) =>
    [...financeKeys.all, 'petty-cash-requests', floatId] as const,

  pettyCashRequest: (requestId: string) =>
    [...financeKeys.all, 'petty-cash-request', requestId] as const,

  pettyCashBalance: (floatId: string) =>
    [...financeKeys.all, 'petty-cash-balance', floatId] as const,

  // Cash Advances
  advances: () => [...financeKeys.all, 'advances'] as const,

  advance: (advanceId: string) =>
    [...financeKeys.all, 'advance', advanceId] as const,

  advancesUnretired: () =>
    [...financeKeys.all, 'advances-unretired'] as const,

  advancesByOfficer: (officerId: string) =>
    [...financeKeys.all, 'advances-by-officer', officerId] as const,

  // Config
  config: () => [...financeKeys.all, 'config'] as const,
}
