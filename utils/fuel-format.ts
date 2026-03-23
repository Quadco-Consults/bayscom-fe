/**
 * Fuel & Gas Operations - Formatting Utilities
 *
 * Consistent formatting for currency, volumes, and other display values
 */

/**
 * Format Nigerian Naira currency
 * @param value - Numeric value
 * @param showSymbol - Whether to show ₦ symbol (default: true)
 * @returns Formatted currency string
 * @example formatNGN(1234567) => "₦ 1,234,567.00"
 */
export function formatNGN(value: number, showSymbol = true): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return showSymbol ? `₦ ${formatted}` : formatted;
}

/**
 * Format volume in litres
 * @param value - Volume value
 * @param showUnit - Whether to show "Ltrs" suffix (default: true)
 * @returns Formatted litres string
 * @example formatLitres(14300) => "14,300 Ltrs"
 */
export function formatLitres(value: number, showUnit = true): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  return showUnit ? `${formatted} Ltrs` : formatted;
}

/**
 * Format weight in kilograms
 * @param value - Weight value
 * @param showUnit - Whether to show "Kg" suffix (default: true)
 * @returns Formatted kg string
 * @example formatKg(2877) => "2,877 Kg"
 */
export function formatKg(value: number, showUnit = true): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  return showUnit ? `${formatted} Kg` : formatted;
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 * @example formatPercent(75.5) => "75.5%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date in Nigerian locale
 * @param date - Date string or Date object
 * @param format - Format type: 'short' | 'medium' | 'long'
 * @returns Formatted date string
 * @example formatDate('2025-05-02', 'medium') => "2 May 2025"
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const options = {
    short: { day: 'numeric', month: 'short', year: '2-digit' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat('en-NG', options).format(d);
}

/**
 * Format a generic number with thousand separators
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 * @example formatNumber(1234567, 2) => "1,234,567.00"
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format variance with direction indicator
 * @param value - Variance value
 * @param unit - Unit to display after value
 * @returns Formatted variance with arrow
 * @example formatVariance(2400, '₦') => "▲ ₦2,400"
 * @example formatVariance(-1200, '₦') => "▼ ₦-1,200"
 */
export function formatVariance(value: number, unit = '₦'): string {
  if (value === 0) return '—';

  const arrow = value > 0 ? '▲' : '▼';
  const formatted =
    unit === '₦'
      ? formatNGN(Math.abs(value))
      : `${formatNumber(Math.abs(value))} ${unit}`;

  return value > 0 ? `${arrow} ${formatted}` : `${arrow} -${formatted}`;
}

/**
 * Get variance color class based on value
 * @param value - Variance value
 * @returns Tailwind color classes
 */
export function getVarianceColor(value: number): string {
  if (value > 0) return 'text-green-700 bg-green-50';
  if (value < 0) return 'text-red-700 bg-red-50';
  return 'text-gray-700 bg-gray-50';
}

/**
 * Get variance status badge color
 * @param value - Variance value
 * @param threshold - Threshold for warning (default: 0)
 * @returns Status and color
 */
export function getVarianceStatus(
  value: number,
  threshold = 0
): { status: 'balanced' | 'surplus' | 'deficit'; color: string; label: string } {
  if (Math.abs(value) <= threshold) {
    return { status: 'balanced', color: 'green', label: 'Balanced' };
  }
  if (value > threshold) {
    return { status: 'surplus', color: 'amber', label: `Overlodged ${formatNGN(value)}` };
  }
  return { status: 'deficit', color: 'red', label: `Underlodged ${formatNGN(Math.abs(value))}` };
}

/**
 * Format month and year
 * @param month - Month number (1-12)
 * @param year - Year number
 * @returns Formatted month-year string
 * @example formatMonthYear(5, 2025) => "May 2025"
 */
export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-NG', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Get month name from number
 * @param month - Month number (1-12)
 * @returns Month name
 * @example getMonthName(5) => "May"
 */
export function getMonthName(month: number): string {
  const date = new Date(2000, month - 1, 1);
  return new Intl.DateTimeFormat('en-NG', { month: 'long' }).format(date);
}

/**
 * Get short month name
 * @param month - Month number (1-12)
 * @returns Short month name
 * @example getShortMonthName(5) => "May"
 */
export function getShortMonthName(month: number): string {
  const date = new Date(2000, month - 1, 1);
  return new Intl.DateTimeFormat('en-NG', { month: 'short' }).format(date);
}

/**
 * Format product code with price
 * @param product - Product code (e.g., "AGO")
 * @param price - Price per unit
 * @returns Formatted string
 * @example formatProductWithPrice("AGO", 1140) => "AGO @N1140"
 */
export function formatProductWithPrice(product: string, price: number): string {
  return `${product} @N${formatNumber(price)}`;
}

/**
 * Parse formatted currency back to number
 * @param formatted - Formatted currency string
 * @returns Numeric value
 * @example parseNGN("₦ 1,234,567.00") => 1234567
 */
export function parseNGN(formatted: string): number {
  const cleaned = formatted.replace(/[₦,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format truck registration number
 * @param regNo - Registration number
 * @returns Formatted reg number
 * @example formatTruckReg("t9829la") => "T9829LA"
 */
export function formatTruckReg(regNo: string): string {
  return regNo.toUpperCase().trim();
}
