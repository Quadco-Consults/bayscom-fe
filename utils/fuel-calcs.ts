/**
 * Fuel & Gas Operations - Auto-Calculation Utilities
 *
 * All auto-calculated fields share the same derivation logic across modules.
 * These functions are pure - they take inputs and return computed values.
 */

export const calc = {
  // ============================================================================
  // Stock / Dipping Calculations
  // ============================================================================

  /**
   * Calculate actual receipt after transit loss
   * @param waybill - Waybill quantity (litres/kg)
   * @param loss - Transit loss (litres/kg)
   * @returns Actual receipt quantity
   */
  receipt: (waybill: number, loss: number): number => waybill - loss,

  /**
   * Calculate closing stock from opening + receipt - sales
   * @param opening - Opening balance
   * @param receipt - Receipt quantity
   * @param sales - Sales quantity
   * @returns Closing stock (book)
   */
  closingStock: (opening: number, receipt: number, sales: number): number =>
    opening + receipt - sales,

  /**
   * Calculate difference between physical and book stock
   * @param physical - Physical dipstick reading
   * @param book - Book closing stock
   * @returns Variance (positive = overage, negative = shortage)
   */
  diff: (physical: number, book: number): number => physical - book,

  /**
   * Calculate daily overage/shortage movement
   * @param currentDiff - Today's variance
   * @param previousDiff - Yesterday's variance
   * @returns Daily overage/shortage
   */
  dailyOverage: (currentDiff: number, previousDiff: number): number =>
    currentDiff - previousDiff,

  /**
   * Calculate monetary value of overage/shortage
   * @param overage - Daily overage/shortage quantity
   * @param price - Price per unit
   * @returns Value in Naira
   */
  value: (overage: number, price: number): number => overage * price,

  // ============================================================================
  // Sales Calculations
  // ============================================================================

  /**
   * Calculate sales value for a product
   * @param litres - Volume sold
   * @param price - Price per unit
   * @returns Sales value in Naira
   */
  salesValue: (litres: number, price: number): number => litres * price,

  /**
   * Calculate total sales value across multiple entries
   * @param entries - Array of sales entries with litres and price
   * @returns Total sales value
   */
  totalSalesValue: (entries: { litres: number; price: number }[]): number =>
    entries.reduce((sum, e) => sum + e.litres * e.price, 0),

  // ============================================================================
  // LPG Specific Calculations
  // ============================================================================

  /**
   * Calculate pump meter difference
   * @param closing - Closing meter reading
   * @param opening - Opening meter reading
   * @returns Pump difference
   */
  pumpDiff: (closing: number, opening: number): number => closing - opening,

  /**
   * Calculate total quantity sold from multiple pumps
   * @param pump1Diff - Pump 1 difference
   * @param pump2Diff - Pump 2 difference
   * @returns Total quantity sold
   */
  qtySold: (pump1Diff: number, pump2Diff: number): number => pump1Diff + pump2Diff,

  /**
   * Calculate expected tank reading from percentage
   * @param pct - Percentage reading from dipstick
   * @param tankCapacity - Total tank capacity
   * @returns Expected reading in kg/litres
   */
  expectedReading: (pct: number, tankCapacity: number): number =>
    (pct / 100) * tankCapacity,

  /**
   * Calculate percentage overage/shortage
   * @param expected - Expected reading from %
   * @param closing - Closing stock from sales
   * @returns Overage (positive) or Shortage (negative)
   */
  pctOverage: (expected: number, closing: number): number => expected - closing,

  /**
   * Calculate VAT exclusive price
   * @param price - Price including VAT
   * @param vatRate - VAT rate (default 7.5%)
   * @returns Price excluding VAT
   */
  vatExclPrice: (price: number, vatRate = 0.075): number => price / (1 + vatRate),

  /**
   * Calculate accessory margin
   * @param qtySold - Quantity sold
   * @param sellPrice - Selling price per unit
   * @param costPrice - Cost price per unit
   * @returns Gross margin
   */
  accessoryMargin: (qtySold: number, sellPrice: number, costPrice: number): number =>
    qtySold * sellPrice - qtySold * costPrice,

  /**
   * Calculate quantity left after sales
   * @param total - Total quantity available
   * @param sold - Quantity sold
   * @returns Remaining quantity
   */
  qtyLeft: (total: number, sold: number): number => total - sold,

  // ============================================================================
  // Lodgement Calculations
  // ============================================================================

  /**
   * Calculate total lodgement across payment channels
   * @param channels - Record of payment channel amounts
   * @returns Total lodged amount
   */
  totalLodged: (channels: Record<string, number>): number =>
    Object.values(channels).reduce((sum, v) => sum + v, 0),

  /**
   * Calculate lodgement difference
   * @param lodged - Total amount lodged
   * @param sales - Expected sales value
   * @returns Difference (positive = overlodged, negative = underlodged)
   */
  lodgementDiff: (lodged: number, sales: number): number => lodged - sales,

  // ============================================================================
  // Debtors Calculations
  // ============================================================================

  /**
   * Calculate debtor outstanding balance
   * @param paid - Total amount paid
   * @param delivered - Total value delivered
   * @returns Balance (negative = owes, positive = overpaid)
   */
  debtorBalance: (paid: number, delivered: number): number => paid - delivered,

  // ============================================================================
  // P&L Calculations
  // ============================================================================

  /**
   * Calculate gross margin
   * @param salesValue - Total sales value
   * @param costValue - Total cost value
   * @returns Gross margin
   */
  grossMargin: (salesValue: number, costValue: number): number =>
    salesValue - costValue,

  /**
   * Calculate net profit
   * @param grossMargin - Gross margin
   * @param totalExpenses - Total expenses
   * @returns Net profit
   */
  netProfit: (grossMargin: number, totalExpenses: number): number =>
    grossMargin - totalExpenses,

  // ============================================================================
  // Inventory Calculations
  // ============================================================================

  /**
   * Calculate stock available after delivery
   * @param opening - Opening stock
   * @param added - Quantity added (deliveries)
   * @param transitLoss - Transit loss
   * @returns Stock available for sale
   */
  stockAvailable: (opening: number, added: number, transitLoss: number): number =>
    opening + added - transitLoss,

  /**
   * Calculate closing stock (book) from inventory
   * @param available - Stock available
   * @param sales - Total sales
   * @returns Closing stock (book)
   */
  closingStockBook: (available: number, sales: number): number => available - sales,

  /**
   * Calculate inventory variance
   * @param physical - Physical stock count
   * @param book - Book stock
   * @returns Variance
   */
  inventoryVariance: (physical: number, book: number): number => physical - book,

  // ============================================================================
  // Transit Loss Calculations
  // ============================================================================

  /**
   * Calculate transit loss
   * @param waybill - Waybill quantity
   * @param actual - Actual received quantity
   * @returns Transit loss
   */
  transitLoss: (waybill: number, actual: number): number => waybill - actual,

  /**
   * Calculate transit loss percentage
   * @param waybill - Waybill quantity
   * @param actual - Actual received quantity
   * @returns Transit loss percentage
   */
  transitLossPercent: (waybill: number, actual: number): number => {
    if (waybill === 0) return 0;
    return ((waybill - actual) / waybill) * 100;
  },

  /**
   * Check if transit loss is within acceptable threshold
   * @param waybill - Waybill quantity
   * @param actual - Actual received quantity
   * @param allowedPercent - Allowed loss percentage (e.g., 0.5)
   * @returns true if within threshold
   */
  isTransitLossAcceptable: (waybill: number, actual: number, allowedPercent: number): boolean => {
    const lossPercent = calc.transitLossPercent(waybill, actual);
    return Math.abs(lossPercent) <= allowedPercent;
  },

  // ============================================================================
  // Reconciliation Calculations
  // ============================================================================

  /**
   * Calculate dealer gross margin
   * @param salesVolume - Volume sold
   * @param salesPrice - Sales price per unit
   * @param costPrice - Cost price per unit
   * @returns Gross dealer margin
   */
  dealerGrossMargin: (salesVolume: number, salesPrice: number, costPrice: number): number =>
    salesVolume * (salesPrice - costPrice),

  /**
   * Calculate shortage in cash value
   * @param shortageQty - Shortage quantity
   * @param costPrice - Cost price per unit
   * @returns Shortage value in Naira
   */
  shortageCash: (shortageQty: number, costPrice: number): number =>
    shortageQty * costPrice,

  /**
   * Calculate net dealer margin after shortage
   * @param grossMargin - Gross dealer margin
   * @param shortageCash - Shortage in cash
   * @returns Net dealer margin
   */
  netDealerMargin: (grossMargin: number, shortageCash: number): number =>
    grossMargin - shortageCash,

  /**
   * Calculate underlodgement
   * @param salesValue - Total sales value
   * @param amountBanked - Amount actually banked
   * @returns Underlodgement (negative = money not banked)
   */
  underlodgement: (salesValue: number, amountBanked: number): number =>
    amountBanked - salesValue,
};

// Type-safe calculation result with metadata
export interface CalcResult<T = number> {
  value: T;
  formula?: string;
  isAutoCalculated: true;
}

/**
 * Wrap a calculation result with metadata
 * @param value - Calculated value
 * @param formula - Optional formula description
 * @returns CalcResult object
 */
export function wrapCalc<T = number>(value: T, formula?: string): CalcResult<T> {
  return {
    value,
    formula,
    isAutoCalculated: true,
  };
}

/**
 * Check if a value is an auto-calculated result
 */
export function isCalcResult(value: unknown): value is CalcResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'isAutoCalculated' in value &&
    value.isAutoCalculated === true
  );
}
