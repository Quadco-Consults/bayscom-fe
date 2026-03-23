// User Management Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId: string;
  role?: Role;
  departmentId: string;
  department?: Department;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// Role & Permissions Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  manager?: User;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

// Filling Station Types
export interface FillingStation {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  managerId: string;
  manager?: User;
  status: 'active' | 'inactive' | 'under-maintenance';
  products: ('PMS' | 'AGO' | 'DPK' | 'LPG')[];
  tanks: Tank[];
  pumps: Pump[];
  createdAt: string;
  updatedAt: string;
}

export interface Tank {
  id: string;
  stationId: string;
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  capacity: number;
  currentLevel: number;
  unit: 'liters' | 'kg';
  lastCalibrationDate: string;
  status: 'operational' | 'faulty' | 'maintenance';
}

export interface Pump {
  id: string;
  stationId: string;
  pumpNumber: string;
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  status: 'operational' | 'faulty' | 'maintenance';
  meterReading: number;
  lastMaintenanceDate: string;
}

// Truck & Fleet Types
export interface Truck {
  id: string;
  registrationNumber: string;
  vehicleType: 'tanker' | 'delivery-truck';
  productType: 'AGO' | 'LPG' | 'multi-product';
  capacity: number;
  unit: 'liters' | 'kg';
  driverId?: string;
  driver?: User;
  status: 'available' | 'in-transit' | 'loading' | 'maintenance' | 'inactive';
  currentLocation?: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  insuranceExpiryDate: string;
  // Financial fields
  acquisitionCost: number; // Total cost to acquire the truck
  acquisitionDate: string;
  totalEarnings: number; // Cumulative earnings from all trips
  totalExpenses: number; // Cumulative expenses
  netProfit: number; // Total earnings - total expenses
  remainingDebt: number; // Acquisition cost - net profit (if positive, still paying off)
  isBreakEven: boolean; // True when remainingDebt <= 0
  breakEvenDate?: string; // Date when truck broke even
  monthlyEarnings: number; // Current month earnings
  monthlyExpenses: number; // Current month expenses
  annualEarnings: number; // Current year earnings
  annualExpenses: number; // Current year expenses
  createdAt: string;
  updatedAt: string;
}

export interface TruckTrip {
  id: string;
  tripNumber: string; // Unique trip identifier
  truckId: string;
  truck?: Truck;
  driverId: string;
  driver?: User;
  origin: string;
  destination: string;
  destinationStationId?: string; // If delivering to a filling station
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  quantity: number;
  unit: 'liters' | 'kg';
  distance: number; // Distance in kilometers
  ratePerKm: number; // Charge rate per kilometer
  // Financial fields
  freight: number; // Total freight charge (distance * ratePerKm)
  earnings: number; // Total revenue from the trip
  expenses: TripExpense[];
  totalExpenses: number; // Sum of all expenses
  netProfit: number; // Earnings - total expenses
  // Trip details
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  departureTime?: string;
  arrivalTime?: string;
  estimatedArrivalTime?: string;
  actualDuration?: number; // Duration in hours
  // Additional details
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripExpense {
  id: string;
  tripId: string;
  category: 'fuel' | 'toll' | 'maintenance' | 'driver-allowance' | 'parking' | 'loading-fee' | 'other';
  description: string;
  amount: number;
  receiptNumber?: string;
  date: string;
  createdBy?: string;
}

// Financial Analytics Types
export interface TruckFinancialSummary {
  truckId: string;
  registrationNumber: string;
  // Acquisition
  acquisitionCost: number;
  acquisitionDate: string;
  monthsSinceAcquisition: number;
  // Cumulative
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  remainingDebt: number;
  isBreakEven: boolean;
  breakEvenDate?: string;
  // ROI
  roi: number; // (netProfit / acquisitionCost) * 100
  projectedBreakEvenMonths?: number;
  // Period performance
  monthlyEarnings: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  annualEarnings: number;
  annualExpenses: number;
  annualProfit: number;
  // Trip stats
  totalTrips: number;
  completedTrips: number;
  averageEarningsPerTrip: number;
  averageExpensesPerTrip: number;
}

export interface FleetFinancialReport {
  totalFleetValue: number; // Sum of all acquisition costs
  totalFleetEarnings: number;
  totalFleetExpenses: number;
  totalFleetProfit: number;
  totalRemainingDebt: number;
  breakEvenTrucks: number;
  profitableTrucks: number;
  averageROI: number;
  monthlyFleetEarnings: number;
  monthlyFleetExpenses: number;
  annualFleetEarnings: number;
  annualFleetExpenses: number;
  trucks: TruckFinancialSummary[];
}

// Inventory Types - LPG Accessories
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  description: string;
  unit: string;
  reorderLevel: number;
  reorderQuantity: number;
  currentStock: number;
  unitPrice: number;
  supplier?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export type InventoryCategory =
  | 'lpg-cylinders'
  | 'lpg-regulators'
  | 'lpg-hoses'
  | 'lpg-valves'
  | 'lpg-accessories'
  | 'lubricants'
  | 'other';

// Lubricants Types
export interface Lubricant {
  id: string;
  sku: string;
  brand: string;
  productName: string;
  viscosityGrade: string;
  type: 'engine-oil' | 'gear-oil' | 'hydraulic-oil' | 'grease' | 'transmission-fluid' | 'other';
  packagingSize: string;
  unit: 'liters' | 'kg';
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  sellingPrice: number;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

// Sales & Transactions Types
export interface Sale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customer?: Customer;
  salesPersonId: string;
  salesPerson?: User;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productType: 'inventory' | 'lubricant' | 'fuel';
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  address?: string;
  type: 'individual' | 'corporate';
  creditLimit?: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalSales: number;
  salesChange: number;
  activeStations: number;
  stationsChange: number;
  activeTrucks: number;
  trucksChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  sales: number;
}

export interface ProductSalesData {
  product: string;
  sales: number;
  revenue: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== SAGE-INSPIRED FINANCE TYPES ====================

// Dimensional Accounting Types
export interface CostCenter {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'filling-station' | 'department' | 'project' | 'other';
  parentId?: string;
  parent?: CostCenter;
  isActive: boolean;
  managerId?: string;
  manager?: User;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'truck-operation' | 'expansion' | 'maintenance' | 'other';
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget: number;
  actualCost: number;
  projectManagerId?: string;
  projectManager?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  type: 'state' | 'city' | 'region' | 'zone';
  parentId?: string;
  parent?: Location;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dimension {
  costCenterId?: string;
  costCenter?: CostCenter;
  projectId?: string;
  project?: Project;
  departmentId?: string;
  department?: Department;
  locationId?: string;
  location?: Location;
}

// Multi-Entity Types
export interface Entity {
  id: string;
  code: string;
  name: string;
  legalName: string;
  type: 'parent' | 'subsidiary' | 'branch';
  taxId: string;
  registrationNumber: string;
  currency: 'NGN' | 'USD' | 'GBP' | 'EUR';
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  email: string;
  consolidate: boolean;
  parentEntityId?: string;
  parentEntity?: Entity;
  fiscalYearEnd: string; // MM-DD format
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Chart of Accounts Types
export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  accountSubType: string; // e.g., 'Current Asset', 'Fixed Asset', 'Operating Expense'
  parentAccountId?: string;
  parentAccount?: ChartOfAccount;
  level: number; // Account hierarchy level
  isActive: boolean;
  allowPosting: boolean; // Control accounts don't allow direct posting
  currency: string;
  openingBalance: number;
  currentBalance: number;
  description?: string;
  taxCode?: string;
  entityId?: string;
  entity?: Entity;
  createdAt: string;
  updatedAt: string;
}

// Journal Entry Types
export interface JournalEntry {
  id: string;
  journalNumber: string;
  entryDate: string;
  postingDate: string;
  reference: string;
  description: string;
  type: 'manual' | 'auto' | 'recurring' | 'adjustment' | 'reversing';
  source: 'GL' | 'AR' | 'AP' | 'Bank' | 'Inventory' | 'Payroll' | 'Other';
  status: 'draft' | 'pending-approval' | 'approved' | 'posted' | 'rejected' | 'reversed';
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  // Approval workflow
  createdById: string;
  createdBy?: User;
  submittedDate?: string;
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  rejectionReason?: string;
  // Dimensions
  dimensions?: Dimension;
  // Audit trail
  reversedById?: string;
  reversedDate?: string;
  reversalJournalId?: string;
  entityId?: string;
  entity?: Entity;
  periodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalLine {
  id: string;
  journalEntryId: string;
  lineNumber: number;
  accountId: string;
  account?: ChartOfAccount;
  description: string;
  debit: number;
  credit: number;
  // Dimensions for each line
  dimensions?: Dimension;
  // Additional tracking
  reconciled: boolean;
  reconciledDate?: string;
}

// Trial Balance Types
export interface TrialBalanceEntry {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
  balance: number; // Net balance (debit - credit)
}

export interface TrialBalance {
  periodStart: string;
  periodEnd: string;
  entityId?: string;
  entity?: Entity;
  entries: TrialBalanceEntry[];
  totalOpeningDebit: number;
  totalOpeningCredit: number;
  totalPeriodDebit: number;
  totalPeriodCredit: number;
  totalClosingDebit: number;
  totalClosingCredit: number;
  isBalanced: boolean;
  generatedAt: string;
  generatedBy?: User;
}

// Fixed Assets Types
export interface AssetCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  depreciationMethod: 'straight-line' | 'declining-balance' | 'sum-of-years-digits' | 'units-of-production';
  depreciationRate: number; // Percentage or rate
  usefulLife: number; // In years or units
  salvageValuePercent: number;
  glAccountId?: string; // Asset account
  depreciationAccountId?: string; // Accumulated depreciation account
  expenseAccountId?: string; // Depreciation expense account
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FixedAsset {
  id: string;
  assetTag: string;
  assetName: string;
  description: string;
  categoryId: string;
  category?: AssetCategory;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  // Acquisition
  acquisitionDate: string;
  acquisitionCost: number;
  vendorId?: string;
  vendor?: Vendor;
  purchaseOrderNumber?: string;
  invoiceNumber?: string;
  // Depreciation
  depreciationMethod: 'straight-line' | 'declining-balance' | 'sum-of-years-digits' | 'units-of-production';
  depreciationStartDate: string;
  usefulLife: number;
  salvageValue: number;
  currentValue: number;
  accumulatedDepreciation: number;
  lastDepreciationDate?: string;
  // Location & Assignment
  locationId?: string;
  location?: Location;
  costCenterId?: string;
  costCenter?: CostCenter;
  assignedToUserId?: string;
  assignedTo?: User;
  // Status
  status: 'active' | 'disposed' | 'fully-depreciated' | 'under-maintenance' | 'retired';
  disposalDate?: string;
  disposalValue?: number;
  disposalMethod?: 'sale' | 'scrap' | 'donation' | 'trade-in';
  // Dimensions
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  // Warranty & Insurance
  warrantyExpiryDate?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepreciationSchedule {
  id: string;
  assetId: string;
  asset?: FixedAsset;
  year: number;
  period: number; // Month 1-12 or quarter 1-4
  periodStart: string;
  periodEnd: string;
  openingValue: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  closingValue: number;
  status: 'scheduled' | 'posted' | 'adjusted';
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  createdAt: string;
  updatedAt: string;
}

export interface AssetDisposal {
  id: string;
  disposalNumber: string;
  assetId: string;
  asset?: FixedAsset;
  disposalDate: string;
  disposalMethod: 'sale' | 'scrap' | 'donation' | 'trade-in';
  originalCost: number;
  accumulatedDepreciation: number;
  bookValue: number; // Original cost - accumulated depreciation
  salePrice: number;
  gainLoss: number; // Sale price - book value
  buyerId?: string;
  buyerName?: string;
  invoiceNumber?: string;
  notes?: string;
  approvedById?: string;
  approvedBy?: User;
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  createdAt: string;
  updatedAt: string;
}

// Bank Reconciliation Types
export interface BankAccount {
  id: string;
  accountCode: string;
  accountName: string;
  bankName: string;
  branchName?: string;
  accountNumber: string;
  accountType: 'current' | 'savings' | 'fixed-deposit';
  currency: 'NGN' | 'USD' | 'GBP' | 'EUR';
  currentBalance: number;
  lastReconciledBalance: number;
  lastReconciledDate?: string;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
  entityId?: string;
  entity?: Entity;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankStatement {
  id: string;
  bankAccountId: string;
  bankAccount?: BankAccount;
  statementDate: string;
  statementNumber?: string;
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactions: BankStatementLine[];
  uploadedFileName?: string;
  uploadedAt?: string;
  uploadedById?: string;
  uploadedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface BankStatementLine {
  id: string;
  statementId: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  isReconciled: boolean;
  reconciledJournalLineId?: string;
  reconciledJournalLine?: JournalLine;
  reconciledDate?: string;
  notes?: string;
}

export interface BankReconciliation {
  id: string;
  reconciliationNumber: string;
  bankAccountId: string;
  bankAccount?: BankAccount;
  periodStart: string;
  periodEnd: string;
  statementId?: string;
  statement?: BankStatement;
  glBalance: number; // Balance per books
  statementBalance: number; // Balance per bank
  // Reconciling items
  depositsInTransit: number;
  outstandingChecks: number;
  bankCharges: number;
  bankInterest: number;
  adjustments: number;
  // Reconciled balance
  reconciledGLBalance: number;
  reconciledStatementBalance: number;
  difference: number;
  isBalanced: boolean;
  // Status
  status: 'in-progress' | 'completed' | 'approved';
  reconciledById?: string;
  reconciledBy?: User;
  reconciledDate?: string;
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Tax Management Types (Nigeria-specific)
export interface VATTransaction {
  id: string;
  transactionDate: string;
  transactionType: 'input-vat' | 'output-vat';
  documentType: 'invoice' | 'bill' | 'receipt' | 'payment' | 'credit-note' | 'debit-note';
  documentNumber: string;
  documentId?: string;
  supplierId?: string;
  supplier?: Vendor;
  customerId?: string;
  customer?: Customer;
  description: string;
  netAmount: number;
  vatRate: number; // Percentage (e.g., 7.5 for Nigeria)
  vatAmount: number;
  grossAmount: number;
  vatCode: string;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  isReconciled: boolean;
  vatReturnId?: string;
  entityId?: string;
  entity?: Entity;
  createdAt: string;
  updatedAt: string;
}

export interface VATReturn {
  id: string;
  returnNumber: string;
  returnPeriodStart: string;
  returnPeriodEnd: string;
  dueDate: string;
  totalOutputVAT: number;
  totalInputVAT: number;
  netVAT: number; // Output VAT - Input VAT (if positive, payable; if negative, refundable)
  adjustments: number;
  vatPayable: number;
  status: 'draft' | 'submitted' | 'paid' | 'overdue';
  submittedDate?: string;
  submittedById?: string;
  submittedBy?: User;
  paidDate?: string;
  paidAmount?: number;
  paymentReference?: string;
  filingReference?: string;
  entityId?: string;
  entity?: Entity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithholdingTax {
  id: string;
  transactionDate: string;
  whtType: 'company' | 'individual' | 'rent' | 'dividend' | 'professional-fees' | 'consultancy' | 'other';
  documentType: 'payment' | 'invoice' | 'bill';
  documentNumber: string;
  documentId?: string;
  vendorId?: string;
  vendor?: Vendor;
  description: string;
  grossAmount: number;
  whtRate: number; // Percentage (e.g., 5, 10)
  whtAmount: number;
  netAmount: number; // Gross - WHT
  whtCode: string;
  certificateNumber?: string;
  certificateIssueDate?: string;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  isRemitted: boolean;
  remittanceDate?: string;
  remittanceReference?: string;
  entityId?: string;
  entity?: Entity;
  createdAt: string;
  updatedAt: string;
}

export interface TaxCertificate {
  id: string;
  certificateNumber: string;
  certificateType: 'vat' | 'wht' | 'cit' | 'other';
  issueDate: string;
  taxPeriodStart: string;
  taxPeriodEnd: string;
  vendorId?: string;
  vendor?: Vendor;
  taxAmount: number;
  documentUrl?: string;
  status: 'issued' | 'cancelled' | 'expired';
  issuedById?: string;
  issuedBy?: User;
  entityId?: string;
  entity?: Entity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced AR Types
export interface ARCustomer extends Customer {
  companyName?: string;
  contactPerson?: string;
  creditRating: 'excellent' | 'good' | 'fair' | 'poor' | 'bad';
  paymentTerms: string; // e.g., 'Net 30', 'Net 60', 'COD'
  paymentTermsDays: number;
  taxId?: string;
  industryType?: string;
  salesPersonId?: string;
  salesPerson?: User;
  priceListId?: string;
  discountPercent: number;
  creditLimit: number;
  currentBalance: number;
  overdueBalance: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  totalInvoiced: number;
  totalPaid: number;
  averageDaysToPay: number;
  isActive: boolean;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
}

export interface ARInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customer?: ARCustomer;
  salesOrderNumber?: string;
  reference?: string;
  description: string;
  lines: ARInvoiceLine[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'sent' | 'outstanding' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'written-off';
  priority: 'low' | 'medium' | 'high' | 'critical';
  paymentTerms: string;
  daysPastDue: number;
  // Dimensions
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  // Approval & Posting
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  // Communications
  sentDate?: string;
  lastReminderDate?: string;
  reminderCount: number;
  notes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ARInvoiceLine {
  id: string;
  invoiceId: string;
  lineNumber: number;
  productId?: string;
  productCode?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
  dimensions?: Dimension;
}

export interface ARReceipt {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  customerId: string;
  customer?: ARCustomer;
  paymentMethod: 'cash' | 'cheque' | 'bank-transfer' | 'card' | 'mobile-money' | 'other';
  reference: string;
  bankAccountId?: string;
  bankAccount?: BankAccount;
  chequeNumber?: string;
  chequeDate?: string;
  amount: number;
  allocations: ReceiptAllocation[];
  unappliedAmount: number;
  status: 'draft' | 'posted' | 'cleared' | 'bounced' | 'cancelled';
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  notes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptAllocation {
  id: string;
  receiptId: string;
  invoiceId: string;
  invoice?: ARInvoice;
  allocationAmount: number;
  discountTaken: number;
}

export interface ARCreditNote {
  id: string;
  creditNoteNumber: string;
  creditNoteDate: string;
  customerId: string;
  customer?: ARCustomer;
  invoiceId?: string;
  invoice?: ARInvoice;
  reason: 'return' | 'discount' | 'error' | 'damage' | 'other';
  description: string;
  lines: ARCreditNoteLine[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  appliedAmount: number;
  balanceAmount: number;
  status: 'draft' | 'approved' | 'applied' | 'cancelled';
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  notes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ARCreditNoteLine {
  id: string;
  creditNoteId: string;
  lineNumber: number;
  productId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
}

// Enhanced AP Types
export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  vendorType: 'fuel-supplier' | 'maintenance' | 'equipment' | 'services' | 'other';
  paymentTerms: string;
  paymentTermsDays: number;
  taxId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  currentBalance: number;
  totalPurchased: number;
  totalPaid: number;
  creditLimit?: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  isActive: boolean;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  createdAt: string;
  updatedAt: string;
}

export interface APBill {
  id: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  vendorId: string;
  vendor?: Vendor;
  purchaseOrderNumber?: string;
  vendorInvoiceNumber: string;
  reference?: string;
  description: string;
  lines: APBillLine[];
  subtotal: number;
  taxAmount: number;
  whtAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'pending-approval' | 'approved' | 'outstanding' | 'partial' | 'paid' | 'overdue' | 'disputed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  paymentTerms: string;
  daysPastDue: number;
  // Dimensions
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  // Approval & Posting
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  // Attachments & Notes
  hasAttachment: boolean;
  notes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface APBillLine {
  id: string;
  billId: string;
  lineNumber: number;
  productId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
  whtRate: number;
  whtAmount: number;
  totalAmount: number;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
  assetId?: string; // For fixed asset purchases
  dimensions?: Dimension;
}

export interface APPayment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  vendorId: string;
  vendor?: Vendor;
  paymentMethod: 'cash' | 'cheque' | 'bank-transfer' | 'card' | 'other';
  reference: string;
  bankAccountId?: string;
  bankAccount?: BankAccount;
  chequeNumber?: string;
  chequeDate?: string;
  amount: number;
  allocations: PaymentAllocation[];
  unappliedAmount: number;
  whtAmount: number;
  status: 'draft' | 'posted' | 'cleared' | 'cancelled';
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  notes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  billId: string;
  bill?: APBill;
  allocationAmount: number;
  discountTaken: number;
  whtAmount: number;
}

export interface APDebitNote {
  id: string;
  debitNoteNumber: string;
  debitNoteDate: string;
  vendorId: string;
  vendor?: Vendor;
  billId?: string;
  bill?: APBill;
  reason: 'return' | 'overcharge' | 'error' | 'damage' | 'other';
  description: string;
  lines: APDebitNoteLine[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  appliedAmount: number;
  balanceAmount: number;
  status: 'draft' | 'approved' | 'applied' | 'cancelled';
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  notes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface APDebitNoteLine {
  id: string;
  debitNoteId: string;
  lineNumber: number;
  productId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  glAccountId?: string;
  glAccount?: ChartOfAccount;
}

// Revenue Recognition Types
export interface RevenueContract {
  id: string;
  contractNumber: string;
  contractName: string;
  customerId: string;
  customer?: ARCustomer;
  contractType: 'fuel-supply' | 'subscription' | 'service' | 'lease' | 'other';
  startDate: string;
  endDate: string;
  totalContractValue: number;
  recognitionMethod: 'over-time' | 'point-in-time' | 'milestone';
  recognitionPattern: 'straight-line' | 'usage-based' | 'milestone-based';
  status: 'draft' | 'active' | 'completed' | 'terminated' | 'suspended';
  performanceObligations: PerformanceObligation[];
  totalRecognized: number;
  totalDeferred: number;
  dimensions?: Dimension;
  entityId?: string;
  entity?: Entity;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceObligation {
  id: string;
  contractId: string;
  description: string;
  allocatedValue: number;
  recognizedValue: number;
  deferredValue: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface RevenueSchedule {
  id: string;
  scheduleNumber: string;
  contractId: string;
  contract?: RevenueContract;
  periodStart: string;
  periodEnd: string;
  scheduledAmount: number;
  recognizedAmount: number;
  deferredAmount: number;
  status: 'scheduled' | 'recognized' | 'adjusted';
  journalEntryId?: string;
  journalEntry?: JournalEntry;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Period Close Types
export interface AccountingPeriod {
  id: string;
  periodName: string;
  periodType: 'month' | 'quarter' | 'year';
  fiscalYear: number;
  periodNumber: number;
  startDate: string;
  endDate: string;
  status: 'open' | 'closing' | 'closed' | 'locked';
  closedById?: string;
  closedBy?: User;
  closedDate?: string;
  canReopen: boolean;
  entityId?: string;
  entity?: Entity;
  createdAt: string;
  updatedAt: string;
}

export interface PeriodCloseChecklist {
  id: string;
  periodId: string;
  period?: AccountingPeriod;
  checklistItems: PeriodCloseChecklistItem[];
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface PeriodCloseChecklistItem {
  id: string;
  checklistId: string;
  taskName: string;
  taskDescription: string;
  category: 'reconciliation' | 'adjustment' | 'reporting' | 'review' | 'approval' | 'other';
  sequence: number;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  assignedToId?: string;
  assignedTo?: User;
  dueDate?: string;
  completedDate?: string;
  completedById?: string;
  completedBy?: User;
  notes?: string;
  isRequired: boolean;
}

export interface PeriodAdjustment {
  id: string;
  adjustmentNumber: string;
  periodId: string;
  period?: AccountingPeriod;
  adjustmentType: 'accrual' | 'prepayment' | 'depreciation' | 'provision' | 'reclassification' | 'other';
  description: string;
  journalEntryId: string;
  journalEntry?: JournalEntry;
  amount: number;
  status: 'draft' | 'posted' | 'reversed';
  createdById: string;
  createdBy?: User;
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Consolidation Types
export interface ConsolidationRule {
  id: string;
  ruleName: string;
  ruleType: 'elimination' | 'adjustment' | 'translation';
  description: string;
  sourceEntityId: string;
  sourceEntity?: Entity;
  targetEntityId?: string;
  targetEntity?: Entity;
  accountMappings: AccountMapping[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountMapping {
  id: string;
  sourceAccountId: string;
  sourceAccount?: ChartOfAccount;
  targetAccountId: string;
  targetAccount?: ChartOfAccount;
  mappingType: 'one-to-one' | 'many-to-one' | 'percentage-allocation';
  allocationPercent?: number;
}

export interface ConsolidationReport {
  id: string;
  reportNumber: string;
  consolidationDate: string;
  periodStart: string;
  periodEnd: string;
  parentEntityId: string;
  parentEntity?: Entity;
  includedEntities: Entity[];
  eliminationJournalId?: string;
  eliminationJournal?: JournalEntry;
  status: 'draft' | 'in-progress' | 'completed' | 'approved';
  createdById: string;
  createdBy?: User;
  approvedById?: string;
  approvedBy?: User;
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Advanced Reporting Types
export interface FinancialStatement {
  id: string;
  statementType: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'changes-in-equity' | 'trial-balance';
  statementName: string;
  periodStart: string;
  periodEnd: string;
  comparisonPeriodStart?: string;
  comparisonPeriodEnd?: string;
  entityId?: string;
  entity?: Entity;
  includeComparison: boolean;
  includeNotes: boolean;
  currency: string;
  data: Record<string, unknown>; // Statement-specific data structure
  generatedAt: string;
  generatedById: string;
  generatedBy?: User;
}

export interface CustomReport {
  id: string;
  reportName: string;
  reportDescription: string;
  reportType: 'gl' | 'ar' | 'ap' | 'bank' | 'fixed-assets' | 'tax' | 'custom';
  filters: ReportFilter[];
  columns: ReportColumn[];
  groupBy?: string[];
  sortBy?: string[];
  aggregations?: ReportAggregation[];
  isPublic: boolean;
  createdById: string;
  createdBy?: User;
  sharedWith?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'between' | 'in';
  value: string | number | boolean | string[] | number[] | null;
}

export interface ReportColumn {
  field: string;
  header: string;
  dataType: 'text' | 'number' | 'date' | 'currency' | 'percentage';
  width?: number;
  alignment?: 'left' | 'center' | 'right';
  format?: string;
}

export interface ReportAggregation {
  field: string;
  function: 'sum' | 'average' | 'count' | 'min' | 'max';
  label: string;
}

// Financial KPI Types
export interface FinancialKPI {
  id: string;
  kpiName: string;
  kpiCategory: 'profitability' | 'liquidity' | 'efficiency' | 'leverage';
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  target?: number;
  unit: 'currency' | 'percentage' | 'ratio' | 'days' | 'number';
  period: string;
  calculationFormula: string;
  status: 'on-track' | 'warning' | 'critical' | 'excellent';
}
