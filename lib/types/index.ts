// Position Management Types
export interface Position {
  id: string;
  title: string;
  departmentId: string;
  department?: Department;
  description: string;
  level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  baseSalary: number;
  allowances: PositionAllowance[];
  totalCompensation: number;
  benefits: string[];
  requirements: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PositionAllowance {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  description?: string;
}

export interface EmployeeTermination {
  id: string;
  employeeId: string;
  employee?: Employee;
  terminationDate: string;
  terminationType: 'resignation' | 'dismissal' | 'retirement' | 'contract-end' | 'redundancy' | 'mutual-agreement';
  reason: string;
  exitInterviewNotes?: string;
  clearanceStatus: 'pending' | 'in-progress' | 'completed';
  finalSettlement: number;
  outstandingDues: number;
  processedBy: string;
  processor?: User;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSuspension {
  id: string;
  employeeId: string;
  employee?: Employee;
  suspensionDate: string;
  suspensionType: 'disciplinary' | 'investigation' | 'medical' | 'administrative' | 'performance' | 'misconduct';
  reason: string;
  duration: number; // in days
  startDate: string;
  endDate: string;
  isPaid: boolean;
  conditions?: string;
  reinstatementConditions?: string;
  notes?: string;
  status: 'active' | 'completed' | 'lifted';
  processedBy: string;
  processor?: User;
  createdAt: string;
  updatedAt: string;
}

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
  positionId?: string;
  position?: Position;
  status: 'active' | 'inactive' | 'suspended' | 'on-leave' | 'terminated';
  leaveStatus?: {
    isOnLeave: boolean;
    leaveType?: string;
    startDate?: string;
    endDate?: string;
  };
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

// HR Management Types
export interface Employee {
  id: string;
  userId: string;
  user?: User;
  employeeNumber: string;
  positionId?: string;
  position?: Position;
  dateOfJoining: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  address: string;
  city: string;
  state: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  jobTitle: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  salary: number;
  bonuses: EmployeeBonus[];
  bankName?: string;
  accountNumber?: string;
  pensionNumber?: string;
  taxNumber?: string;
  status: 'active' | 'on-leave' | 'suspended' | 'terminated';
  terminationId?: string;
  termination?: EmployeeTermination;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeBonus {
  id: string;
  name: string;
  amount: number;
  type: 'monthly' | 'quarterly' | 'annual' | 'one-time' | 'performance';
  date?: string;
  reason?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  workHours?: number;
  overtime?: number;
  notes?: string;
  location?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employee?: Employee;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'compassionate' | 'study';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approver?: User;
  approvalDate?: string;
  rejectionReason?: string;
  handoverNotes?: string;
  reliefOfficerId?: string;
  reliefOfficer?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  employee?: Employee;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface Overtime {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  hours: number;
  rate: number;
  totalAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string;
  approver?: User;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employee?: Employee;
  reviewerId: string;
  reviewer?: User;
  reviewPeriod: string;
  reviewDate: string;
  overallRating: number;
  categories: PerformanceCategory[];
  strengths: string;
  areasForImprovement: string;
  goals: string;
  employeeComments?: string;
  status: 'draft' | 'submitted' | 'acknowledged';
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceCategory {
  category: string;
  rating: number;
  comments: string;
}

export interface Recruitment {
  id: string;
  jobTitle: string;
  departmentId: string;
  department?: Department;
  positions: number;
  jobDescription: string;
  requirements: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  salaryRangeMin: number;
  salaryRangeMax: number;
  location: string;
  postingDate: string;
  closingDate: string;
  status: 'draft' | 'open' | 'closed' | 'filled';
  applications: JobApplication[];
  createdBy: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  recruitmentId: string;
  recruitment?: Recruitment;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  interviewDate?: string;
  interviewNotes?: string;
  rating?: number;
  appliedDate: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  trainingType: 'internal' | 'external' | 'online' | 'workshop' | 'seminar';
  trainer: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number;
  capacity: number;
  cost: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  participants: TrainingParticipant[];
  materials?: string;
  createdBy: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingParticipant {
  id: string;
  trainingId: string;
  training?: Training;
  employeeId: string;
  employee?: Employee;
  status: 'registered' | 'attended' | 'absent' | 'completed';
  score?: number;
  certificateIssued: boolean;
  feedback?: string;
  registeredDate: string;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  fromEmployeeId: string;
  fromEmployee?: Employee;
  toEmployeeIds: string[];
  toEmployees?: Employee[];
  departmentId?: string;
  department?: Department;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'policy' | 'announcement' | 'directive' | 'meeting' | 'reminder' | 'other';
  status: 'draft' | 'sent' | 'archived';
  attachments?: string[];
  dueDate?: string;
  readBy?: string[];
  createdBy: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
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
