# Fuel & Gas Operations - Refactor Implementation Summary

**Date**: March 22, 2026
**Status**: Foundation Complete
**Based On**: Bayscom Energy Frontend Implementation Guide

## Overview

This document summarizes the comprehensive refactor of the Fuel & Gas Operations module according to the official implementation guide. The refactor establishes a solid foundation with shared components, utilities, and context providers that can be used across all three business lines:

1. **Filling Station** (PMS, AGO, DPK - walk-in pump sales)
2. **LPG Section** (cooking gas with accessories)
3. **AGO Peddling** (door-to-door diesel with credit/debtors tracking)

## What Has Been Built

### 1. Foundational Utilities

#### `/utils/fuel-calcs.ts`
Centralized auto-calculation logic with 30+ pure functions covering:

- **Stock/Dipping Calculations**
  - `receipt()` - Actual receipt after transit loss
  - `closingStock()` - Closing stock from opening + receipt - sales
  - `diff()` - Variance between physical and book stock
  - `dailyOverage()` - Daily overage/shortage movement
  - `value()` - Monetary value of overage/shortage

- **LPG Specific Calculations**
  - `pumpDiff()` - Pump meter difference
  - `qtySold()` - Total quantity sold from multiple pumps
  - `expectedReading()` - Expected tank reading from percentage
  - `pctOverage()` - Percentage overage/shortage

- **Lodgement Calculations**
  - `totalLodged()` - Total across payment channels
  - `lodgementDiff()` - Lodgement vs expected sales

- **Debtors Calculations**
  - `debtorBalance()` - Outstanding balance tracking

- **P&L Calculations**
  - `grossMargin()` - Sales value - cost value
  - `netProfit()` - Gross margin - expenses

- **Transit Loss Calculations**
  - `transitLoss()` - Waybill vs actual received
  - `transitLossPercent()` - Loss as percentage
  - `isTransitLossAcceptable()` - Threshold validation

- **Reconciliation Calculations**
  - `dealerGrossMargin()` - Volume × (sales price - cost price)
  - `shortageCash()` - Shortage in monetary value
  - `netDealerMargin()` - Gross margin - shortage

#### `/utils/fuel-format.ts`
Consistent formatting utilities:

- `formatNGN()` - Nigerian Naira with ₦ symbol
- `formatLitres()` - Volume with "Ltrs" suffix
- `formatKg()` - Weight with "Kg" suffix
- `formatPercent()` - Percentage values
- `formatDate()` - Nigerian locale dates
- `formatVariance()` - Variance with arrow indicators (▲/▼)
- `getVarianceColor()` - Tailwind color classes
- `getVarianceStatus()` - Status badges (balanced/surplus/deficit)
- `formatMonthYear()` - Month and year display
- `formatProductWithPrice()` - Product code with price
- `parseNGN()` - Parse formatted currency back to number

### 2. Shared Components

All components are located in `/components/fuel/shared/` and exported via `index.ts`.

#### `<DippingTable>`
**Purpose**: Daily stock reconciliation table
**Used In**: Filling Station (PMS/AGO/DPK), LPG Section, AGO Peddling

**Features**:
- Daily rows for selected month
- Inline editing for user-input fields (click cell to edit)
- Auto-calculated fields shown in italic/muted style
- Color-coded rows (green = overage, red = shortage)
- Bottom summary row with totals
- Supports month locking (read-only when locked)
- Real-time calculations using `calc.*` functions

**Key Props**:
```typescript
{
  product: string              // PMS, AGO, DPK, or LPG
  unit: 'Ltrs' | 'Kg'         // Unit of measurement
  month: number                // 1-12
  year: number                 // Year
  rows: DippingRow[]          // Daily data
  onRowUpdate?: (rowId, field, value) => void
  isLocked?: boolean          // Month lock status
  tankCapacity?: number       // For validation
}
```

#### `<LodgementTable>`
**Purpose**: Bank lodgement register
**Used In**: Filling Station, LPG Section, AGO Peddling

**Features**:
- Daily rows with expected sales value
- Multiple payment channels (Cash, POS, Transfer, OPay, PalmPay, Moniepoint)
- Auto-calculated total lodged
- Auto-calculated difference (overlodged/underlodged)
- Status badges (balanced/surplus/deficit)
- Color-coded rows based on variance
- Summary row with channel totals
- Legend explaining color codes

**Key Props**:
```typescript
{
  month: number
  year: number
  rows: LodgementRow[]
  paymentChannels: string[]   // Configurable channels
  onRowUpdate?: (rowId, channel, value) => void
  isLocked?: boolean
  balanceThreshold?: number   // Tolerance for "balanced" status
}
```

#### `<MonthScopeBar>`
**Purpose**: Station + month/year selector with lock status
**Used In**: All fuel operations pages

**Features**:
- Station dropdown selection
- Month/year navigation (prev/next buttons)
- Lock status indicator (locked/unlocked)
- Optional lock toggle button (admin only)
- Prevents navigation into future months
- Custom actions slot
- Lock warning banner when month is locked

**Key Props**:
```typescript
{
  stationId: string
  month: number
  year: number
  isLocked: boolean
  stations: Array<{ id, name, location }>
  onStationChange: (stationId) => void
  onMonthChange: (month, year) => void
  showLockToggle?: boolean    // Admin feature
  onLockToggle?: () => void
  actions?: ReactNode         // Custom action buttons
}
```

#### `<InventorySummaryCard>`
**Purpose**: Read-only computed summary display
**Used In**: All modules for monthly summaries

**Features**:
- Grid layout for summary items
- Support for currency, litres, kg, number, percent formats
- Trend indicators (up/down/neutral)
- Highlight variants (success/warning/danger/info)
- Compact and default size variants
- Optional footer slot

**Key Props**:
```typescript
{
  title: string
  subtitle?: string
  items: SummaryItem[]        // Array of metrics
  icon?: ReactNode
  footer?: ReactNode
  variant?: 'default' | 'compact'
}
```

#### `<VarianceBadge>` & `<VarianceText>`
**Purpose**: Color-coded variance indicators
**Used In**: All reconciliation and summary displays

**Features**:
- Green for surplus/overage (positive)
- Red for deficit/shortage (negative)
- Gray for balanced (within threshold)
- Arrow icons (▲ up, ▼ down, - balanced)
- Support for currency, litres, kg, number units
- Three sizes: sm, md, lg

#### `<AutoCalcField>`, `<AutoCalcLabel>`, `<AutoCalcRow>`
**Purpose**: Wrappers for auto-calculated fields
**Used In**: Forms, tables, summaries

**Features**:
- Italic/muted styling for auto-calculated values
- Optional calculator icon
- Formula tooltips on hover
- Color variants (default/success/warning/danger)
- Different layouts (field, label, row)

#### `<ExpensesTable>`
**Purpose**: Daily expense tracking
**Used In**: All modules for operating expenses

**Features**:
- Add/edit/delete expense entries
- Category-based organization
- Date, description, amount, paid to, receipt no
- Category breakdown summary
- Percentage distribution charts
- Respects month lock status

**Key Props**:
```typescript
{
  month: number
  year: number
  expenses: ExpenseEntry[]
  categories: string[]        // Filterable by module
  onAdd?: (expense) => void
  onUpdate?: (id, expense) => void
  onDelete?: (id) => void
  isLocked?: boolean
  showSummary?: boolean
}
```

#### `<ReconciliationSummaryTable>`
**Purpose**: Monthly reconciliation summary
**Used In**: All modules for end-of-month reconciliation

**Features**:
- Product-wise reconciliation
- Opening stock → Deliveries → Transit loss → Sales → Closing stock
- Book vs Physical comparison
- Variance calculation and highlighting
- Value calculation for variances
- Summary cards for totals
- Optional formula display

### 3. Context Providers

#### `FuelConfigContext` (`/contexts/FuelConfigContext.tsx`)
**Purpose**: Module-level configuration management

**Provides**:
- Station configurations (products, channels, transit loss thresholds)
- Payment channel configuration
- Expense category configuration
- Monthly price overrides
- Month lock status management

**Key Functions**:
```typescript
const {
  config,                     // Full config state
  getStation,                 // Get station by ID
  updateStation,              // Update station config
  getProductPrice,            // Get price for product/month/year
  setMonthlyPriceOverride,    // Override price for specific month
  getPaymentChannels,         // Get enabled channels for station
  getExpenseCategories,       // Get categories by module type
  isMonthLocked,              // Check if month is locked
  lockMonth,                  // Lock a month (approve)
  unlockMonth,                // Unlock a month
  reloadConfig,               // Refresh from API
} = useFuelConfig()
```

**Data Storage**: Currently uses `localStorage` (easily replaceable with API calls)

**Default Configuration**:
- 3 stations (Filling Station, LPG Section, AGO Peddling)
- 6 payment channels (Cash, POS, Transfer, OPay, PalmPay, Moniepoint)
- 10 expense categories
- Transit loss thresholds (0.3% - 0.5%)

#### `MonthScopeContext` (`/contexts/MonthScopeContext.tsx`)
**Purpose**: Active station and month/year scope management

**Provides**:
```typescript
const {
  stationId,                  // Currently selected station
  month,                      // Currently selected month (1-12)
  year,                       // Currently selected year
  isLocked,                   // Current month lock status
  setStation,                 // Change active station
  setMonthYear,               // Change active month/year
  previousMonth,              // Navigate to previous month
  nextMonth,                  // Navigate to next month
  canNavigateNext,            // Check if can go to next month
  resetToCurrentMonth,        // Reset to today's month
} = useMonthScope()
```

**Features**:
- Persists selection in `localStorage`
- Automatically updates lock status
- Prevents navigation into future
- Syncs across all pages

### 4. Root Layout Integration

The context providers are wrapped at the root level (`/app/layout.tsx`):

```typescript
<FuelConfigProvider>
  <MonthScopeProvider>
    {children}
  </MonthScopeProvider>
</FuelConfigProvider>
```

This makes all configuration and scope data available throughout the application.

## Sample Implementation

### `/app/fuel-operations/filling-station/pms-stock/page.tsx`

A comprehensive example demonstrating:
- MonthScopeBar for navigation
- DippingTable for daily entries
- InventorySummaryCard for monthly totals
- Context providers for configuration
- Auto-calculations in action
- Month locking behavior

**Features Demonstrated**:
- Generate daily rows for selected month
- Sample data pre-populated for days 1-3
- Opening stock propagation (next day's opening = previous day's physical)
- Real-time calculation of all auto-fields
- Monthly summary with 8 key metrics
- Export and Print actions
- Lock warning banner
- Instructions panel

## How To Use

### 1. Access the Sample Page

Navigate to: `http://localhost:3000/fuel-operations/filling-station/pms-stock`

### 2. Change Station/Month

Use the MonthScopeBar at the top:
- Click station dropdown to select different station
- Use ◀ ▶ arrows to navigate months
- Lock/unlock months (if admin)

### 3. Edit Dipping Table

- Click any cell with a pencil icon to edit
- Enter values and press Enter or click ✓ to save
- Press Escape or click × to cancel
- Italic fields are auto-calculated and not editable

### 4. Understanding Color Codes

**Dipping Table Rows**:
- **Green background** = Overage (surplus stock)
- **Red background** = Shortage (deficit stock)
- **No background** = Balanced (within tolerance)

**Lodgement Table Rows**:
- **Green** = Balanced (cash matches sales)
- **Amber** = Overlodged (excess cash)
- **Red** = Underlodged (missing cash)

### 5. Month Locking

When a month is locked:
- All fields become read-only
- Yellow warning banner appears
- Edit icons disappear
- Month is "approved" and cannot be changed

Only admins can lock/unlock months via the toggle button.

## Architecture Principles

### 1. Pure Functions for Calculations

All calculations are pure functions in `fuel-calcs.ts`:
- Same inputs always produce same outputs
- No side effects
- Easy to test
- Can be used in any context

### 2. Shared Components

Components are:
- Reusable across all three business lines
- Configurable via props
- Self-contained with internal state
- Consistently styled

### 3. Context for Global State

- `FuelConfigContext` = Configuration (changes rarely)
- `MonthScopeContext` = Active scope (changes frequently)
- Persisted in localStorage
- Easy to swap with API calls

### 4. Consistent Formatting

All formatting uses utilities from `fuel-format.ts`:
- Ensures consistency across UI
- Easy to change formatting globally
- Handles edge cases (negatives, zeros)

### 5. Auto-Calculation Pattern

```typescript
// 1. Calculate in useMemo
const computed = useMemo(() => {
  return rows.map(row => ({
    ...row,
    actualReceipt: calc.receipt(row.waybillQty, row.transitLoss),
    closingStock: calc.closingStock(row.opening, receipt, row.sales),
  }))
}, [rows])

// 2. Display with AutoCalcField
<AutoCalcField
  value={formatLitres(row.actualReceipt)}
  formula="Waybill - Transit Loss"
/>
```

## Next Steps

To complete the fuel operations refactor:

### 1. Restructure Filling Station Module
- `/filling-stations/deliveries` - Waybill tracking
- `/filling-stations/pms-stock` - PMS dipping table
- `/filling-stations/ago-stock` - AGO dipping table
- `/filling-stations/dpk-stock` - DPK dipping table
- `/filling-stations/sales-summary` - Monthly sales totals
- `/filling-stations/lodgements` - Bank lodgements
- `/filling-stations/reconciliation` - Monthly reconciliation

### 2. Implement LPG Section Module
- `/lpg/daily-sales` - Daily sales with pump meters
- `/lpg/purchases` - Stock purchases
- `/lpg/accessories` - Cylinder accessories inventory
- `/lpg/expenses` - Operating expenses
- `/lpg/pl-statement` - Full P&L statement

### 3. Implement AGO Peddling Module
- `/ago-peddling/deliveries` - Customer delivery log
- `/ago-peddling/debtors` - Critical debtors tracking
- `/ago-peddling/stock` - Stock reconciliation
- `/ago-peddling/collections` - Cash collections
- `/ago-peddling/expenses` - Expenses by category
- `/ago-peddling/reconciliation` - Monthly reconciliation

### 4. Create Configuration Pages
- `/fuel-config/stations` - Station master list
- `/fuel-config/products` - Product configuration
- `/fuel-config/prices` - Monthly price overrides
- `/fuel-config/channels` - Payment channel setup
- `/fuel-config/categories` - Expense categories
- `/fuel-config/customers` - AGO peddling customer master
- `/fuel-config/trucks` - AGO peddling truck master

### 5. Implement Data Persistence
Replace `localStorage` with proper API calls:
- GET/POST/PUT/DELETE for all entities
- Real-time sync across users
- Optimistic updates with rollback
- React Query integration

### 6. Add Advanced Features
- Auto-save with debounce for high-frequency tables
- Bulk import/export (Excel, CSV)
- PDF report generation
- Email notifications for month locks
- Audit log for all changes
- Role-based access control integration

## Files Created

```
/utils/
  fuel-calcs.ts              # 332 lines - Calculation utilities
  fuel-format.ts             # 220 lines - Formatting utilities

/components/fuel/shared/
  DippingTable.tsx           # Daily stock reconciliation
  LodgementTable.tsx         # Bank lodgements
  MonthScopeBar.tsx          # Station + month selector
  InventorySummaryCard.tsx   # Summary metrics display
  VarianceBadge.tsx          # Color-coded variance indicators
  AutoCalcField.tsx          # Auto-calculated field wrappers
  ExpensesTable.tsx          # Daily expense tracking
  ReconciliationSummaryTable.tsx  # Monthly reconciliation
  index.ts                   # Centralized exports

/contexts/
  FuelConfigContext.tsx      # Configuration management
  MonthScopeContext.tsx      # Active scope management

/app/fuel-operations/filling-station/
  pms-stock/page.tsx         # Sample implementation

/app/layout.tsx              # Updated with context providers

FUEL_OPERATIONS_REFACTOR.md  # This document
```

## Testing the Implementation

1. **Start the dev server**: Should already be running on http://localhost:3000
2. **Navigate to PMS Stock page**: `/fuel-operations/filling-station/pms-stock`
3. **Test station switching**: Click station dropdown
4. **Test month navigation**: Use prev/next buttons
5. **Test cell editing**: Click any editable cell
6. **Verify auto-calculations**: Watch italic fields update automatically
7. **Check localStorage**: Open browser DevTools → Application → LocalStorage
   - `fuel-config` - Configuration data
   - `month-scope` - Active selection

## Key Benefits

1. **Consistency**: All three modules share the same components and calculations
2. **Maintainability**: Centralized logic easy to update and test
3. **Type Safety**: Full TypeScript support throughout
4. **Performance**: Optimized with useMemo for calculations
5. **User Experience**: Inline editing, real-time feedback, clear visual indicators
6. **Flexibility**: Easy to add new products, channels, or features
7. **Audit Trail**: Month locking ensures data integrity
8. **Configuration-Driven**: No hard-coded values, all configurable

## Notes

- All components follow the implementation guide specifications
- Auto-calculations match the formulas in the guide
- Color coding matches the guide (green = good, red = bad, amber = warning)
- Month locking prevents accidental changes to approved data
- The architecture is ready to scale to all three business lines
- localStorage is used temporarily - replace with API for production

---

**Implementation Status**: Foundation Complete ✅
**Next Phase**: Restructure Filling Station module pages
**Estimated Effort**: 2-3 days per module with the foundation in place
