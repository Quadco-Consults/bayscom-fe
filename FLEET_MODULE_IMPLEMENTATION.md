# Fleet & Haulage Module - Implementation Progress

**Date**: March 22, 2026
**Status**: Foundation Complete
**Based On**: Fleet & Haulage Frontend Implementation Guide

## Overview

This document tracks the implementation of the Fleet & Haulage module for Bayscom Energy ERP. The module manages truck fleet operations, trip P&L tracking, and location rate configuration.

## Business Logic

The fleet operates on a simple P&L model:

```
Revenue = Delivered Litres × Rate per Litre (state-based)
Net P&L = Revenue - Total Trip Expenses
```

Key concepts:
- **Haulage revenue**: Charged to client based on delivered quantity
- **Transit loss**: Loaded - Delivered (not charged)
- **Rate per litre**: Fixed per destination state
- **Trip expenses**: Multiple line items per trip
- **Net trip P&L**: Revenue minus expenses

## What Has Been Built

### 1. Foundational Utilities

#### `/utils/fleet-calcs.ts`
Pure calculation functions for all trip P&L computations:

**Core Trip Calculations**:
- `transitLoss()` - Loss in litres
- `transitLossPct()` - Loss as percentage
- `haulageRevenue()` - Delivered litres × rate
- `totalExpenses()` - Sum of expense line items
- `netTripPL()` - Revenue - expenses
- `tripMarginPct()` - P&L as % of revenue

**Fleet-Level Aggregations**:
- `fleetRevenue()` - Total across all trips
- `fleetExpenses()` - Total expenses
- `fleetNetPL()` - Net profit/loss
- `fleetLitres()` - Total hauled

**Per-Truck Aggregations**:
- `truckPL()` - P&L for specific truck
- `truckRevenue()` - Revenue for specific truck
- `truckExpenses()` - Expenses for specific truck
- `truckLitres()` - Litres hauled by truck
- `truckTripCount()` - Number of trips

**Helpers**:
- `isGain()` - Check if profitable
- `plStatus()` - Get 'gain' or 'loss' label
- `expensesByCategory()` - Breakdown by category
- `avgTripPL()` - Average per trip
- `avgRevenuePerLitre()` - Average rate earned

All functions are exported in a centralized `fleetCalc` object.

#### `/utils/fleet-format.ts`
Formatting utilities for consistent display:

- `formatLitres()` - Litres with "L" suffix
- `formatTruckReg()` - Uppercase registration numbers
- `formatRoute()` - "Depot → State" display
- `formatPL()` - P&L with color classes
- `formatPLStatus()` - "Gain" or "Loss" label
- `formatProductName()` - Full product names
- `formatTransitLoss()` - Loss with percentage
- `formatMarginPct()` - Margin percentage
- `formatDistance()` - Kilometers
- `formatRatePerLitre()` - Rate display
- `getProductBadgeColors()` - Badge styling
- `getPLBadgeColors()` - Status badge colors
- `formatTripSummary()` - Complete trip summary

Re-exports `formatNGN`, `formatDate`, `formatNumber` from fuel-format.ts.

#### `/utils/fleet-query-keys.ts`
React Query key factory for consistent cache management:

```typescript
fleetKeys = {
  all, trips, tripsForTruck, trip, trucks, truck,
  activeTrucks, rates, rate, activeRates,
  expenseCategories, activeExpenseCategories,
  dashboard, plSummary, truckPerformance
}
```

### 2. Context Provider

#### `/contexts/FleetConfigContext.tsx`
Configuration management for trucks, location rates, and expense categories.

**Data Models**:

```typescript
interface TruckConfig {
  id: string
  regNo: string          // e.g. "T9829LA"
  driver: string         // assigned driver
  capacityLitres: number // max load
  active: boolean
  notes?: string
}

interface LocationRate {
  id: string
  stateName: string      // e.g. "Kano"
  distanceKm: number
  ratePerLitre: number   // ₦ per litre
  active: boolean
  notes?: string
}

interface ExpenseCategory {
  id: string
  label: string          // e.g. "Fuel / Diesel"
  active: boolean
  sortOrder: number
}
```

**Provider Functions**:
- Truck operations: `getTruck`, `getActiveTrucks`, `updateTruck`, `addTruck`
- Location rate operations: `getLocationRate`, `getActiveLocationRates`, `updateLocationRate`, `addLocationRate`
- Expense category operations: `getExpenseCategory`, `getActiveExpenseCategories`, `updateExpenseCategory`, `addExpenseCategory`
- Config reload: `reloadConfig()`

**Default Configuration**:
- 4 trucks (3 active, 1 decommissioned)
- 8 location rates (Kano, FCT, Kaduna, Sokoto, Jos, Benue, Enugu, Ogun)
- 7 expense categories (Fuel, Driver Allowance, Tolls, Loader Fees, Repairs, Tyre, Other)

**Storage**: Currently uses `localStorage` (easily replaceable with API calls)

## Architecture Principles

### 1. Pure Functions for Calculations
All calculations in `fleet-calcs.ts` are pure functions:
- Same inputs → same outputs
- No side effects
- Easy to test
- Usable anywhere (client/server)

### 2. Rate Snapshot Pattern
Critical: When creating a trip, the current `ratePerLitre` is saved with the trip record. This ensures historical trip revenue is never recalculated when rates change.

```typescript
// In trip form:
const selectedRate = rates.find(r => r.id === stateId)
setDraft(d => ({
  ...d,
  ratePerLitreSaved: selectedRate?.ratePerLitre ?? 0
}))
```

### 3. Live P&L Preview
The new trip form must show real-time P&L calculation as user types:
- No debounce on preview updates
- Show "—" for incomplete fields (not zeros)
- Green border for gains, red for losses

### 4. Configuration-Driven
All trucks, rates, and categories come from config:
- No hard-coded values
- Easy to add new states or categories
- Config changes apply to future trips only

## Color System

### P&L Colors

| State | Text Color | Background |
|---|---|---|
| Gain (netPL ≥ 0) | `#3B6D11` (green-800) | `#EAF3DE` (green-50) |
| Loss (netPL < 0) | `#A32D2D` (red-800) | `#FCEBEB` (red-50) |

### Product Badge Colors

| Product | Background | Text |
|---|---|---|
| PMS | `#FAEEDA` (amber-50) | `#854F0B` (amber-800) |
| AGO | `#E1F5EE` (teal-50) | `#0F6E56` (teal-800) |
| DPK | `#EEEDFE` (purple-50) | `#3C3489` (purple-800) |

## Next Steps

### Phase 1: Core Components
1. **`<TripPLPreview>`** - Live calculation panel for new trip form
2. **`<ExpenseLineItems>`** - Dynamic expense list with add/remove
3. **`<ProductBadge>`** - Product type indicators
4. **`<TripStatusBadge>`** - Gain/Loss status badges

### Phase 2: Data Components
5. **`<TripTable>`** - Reusable trip list with expandable rows
6. **`<TruckSelectorBar>`** - Horizontal truck card selector
7. **`<FleetPLBars>`** - Per-truck P&L bar chart
8. **`<LocationRateCard>`** - Editable rate configuration card

### Phase 3: Pages
9. **New Trip Form** (`/fleet/trips/new`) - Primary data entry
10. **Trip Log** (`/fleet/trips`) - Full trip history with filters
11. **Dashboard** (`/fleet/dashboard`) - KPIs and recent activity
12. **Truck Fleet** (`/fleet/trucks`) - Per-truck performance
13. **P&L Summary** (`/fleet/reports/pl`) - Monthly reports
14. **Configuration Pages** (`/fleet/config/*`) - Manage trucks, rates, categories

### Phase 4: Integration
15. Update root layout with `FleetConfigProvider`
16. Create fleet layout with `MonthScopeProvider` (reuse from fuel module)
17. Add fleet sidebar navigation
18. Connect to ERP shell components

## Example Trip P&L Calculation

```
Truck:              BDG482XA
Date:               2025-05-08
Depot:              Kaduna Depot
Destination state:  Kano
Product:            PMS
Loaded:             33,000 L
Delivered:          32,900 L

Rate lookup → Kano = ₦38 / litre

Transit loss    = 33,000 − 32,900       = 100 L (0.30%)
Haulage revenue = 32,900 × ₦38         = ₦1,250,200

Expenses:
  Fuel / diesel       ₦ 88,000
  Driver allowance    ₦ 45,000
  Tolls               ₦ 15,000
  ──────────────────────────────
  Total expenses      ₦148,000

Net P&L = ₦1,250,200 − ₦148,000 = ₦1,102,200  ← GAIN
```

## Files Created

```
/utils/
  fleet-calcs.ts           # 200+ lines - Calculation utilities
  fleet-format.ts          # 180+ lines - Formatting utilities
  fleet-query-keys.ts      # 60+ lines - React Query keys

/contexts/
  FleetConfigContext.tsx   # 250+ lines - Configuration provider

FLEET_MODULE_IMPLEMENTATION.md  # This document
```

## Integration with Fuel Module

The Fleet module shares infrastructure with the Fuel & Gas module:

| Shared Resource | Usage |
|---|---|
| `MonthScopeProvider` | Same period scoping pattern |
| `formatNGN()` | Currency formatting |
| `formatDate()` | Date formatting |
| Product list (PMS/AGO/DPK) | Shared product config |
| Filling station list | Trip destinations |
| ERP shell components | Layout, tables, modals, etc. |

Fuel module trucks can deliver to filling stations tracked in the fuel module. The `truckRegNo` field in fuel receivables should match the fleet truck register.

## Testing Utilities

All calculation functions can be tested independently:

```typescript
import { fleetCalc } from '@/utils/fleet-calcs'

// Test trip P&L
const revenue = fleetCalc.haulageRevenue(32900, 38)  // ₦1,250,200
const expenses = fleetCalc.totalExpenses([
  { amt: 88000 },
  { amt: 45000 },
  { amt: 15000 }
])  // ₦148,000
const netPL = fleetCalc.netTripPL(revenue, expenses)  // ₦1,102,200

expect(fleetCalc.isGain(netPL)).toBe(true)
expect(fleetCalc.plStatus(netPL)).toBe('gain')
```

## Key Benefits

1. **Consistent Calculations**: All P&L logic centralized and tested
2. **Type Safety**: Full TypeScript throughout
3. **Performance**: Pure functions, easily memoizable
4. **Maintainability**: Clear separation of concerns
5. **Flexibility**: Configuration-driven, easy to extend
6. **Historical Integrity**: Rate snapshot prevents retroactive recalculation
7. **Real-time Feedback**: Live P&L preview for data entry

---

**Implementation Status**: Foundation Complete ✅
**Next Phase**: Build shared components
**Estimated Effort**: 3-4 days for complete module with foundation in place
