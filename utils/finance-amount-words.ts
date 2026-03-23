/**
 * Finance Amount to Words Conversion
 *
 * Converts numeric amounts to Nigerian Naira words
 * Used for payment vouchers and other financial documents
 */

const ones = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

const teens = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]

const tens = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
]

const thousands = ['', 'thousand', 'million', 'billion', 'trillion']

/**
 * Convert a number less than 1000 to words
 */
function convertHundreds(num: number): string {
  if (num === 0) return ''

  let result = ''

  const hundred = Math.floor(num / 100)
  const remainder = num % 100

  if (hundred > 0) {
    result += ones[hundred] + ' hundred'
    if (remainder > 0) result += ' and '
  }

  if (remainder >= 10 && remainder < 20) {
    result += teens[remainder - 10]
  } else {
    const ten = Math.floor(remainder / 10)
    const one = remainder % 10

    if (ten > 0) {
      result += tens[ten]
      if (one > 0) result += '-'
    }

    if (one > 0) {
      result += ones[one]
    }
  }

  return result
}

/**
 * Convert a number to words
 */
function numberToWords(num: number): string {
  if (num === 0) return 'zero'

  let result = ''
  let thousandCounter = 0

  while (num > 0) {
    const chunk = num % 1000

    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk)
      const suffix = thousands[thousandCounter]

      result = chunkWords + (suffix ? ' ' + suffix : '') + (result ? ' ' + result : '')
    }

    num = Math.floor(num / 1000)
    thousandCounter++
  }

  return result.trim()
}

/**
 * Convert amount to Naira words
 * @param amount - Numeric amount in Naira
 * @param includeKobo - Whether to include kobo (cents) in the output
 * @returns Formatted Naira words string
 * @example
 * amountToWords(116000) => "One hundred and sixteen thousand naira only"
 * amountToWords(1250.50, true) => "One thousand two hundred and fifty naira fifty kobo only"
 */
export function amountToWords(amount: number, includeKobo: boolean = false): string {
  if (!amount || amount < 0) {
    return 'Zero naira only'
  }

  // Split into naira and kobo
  const naira = Math.floor(amount)
  const kobo = Math.round((amount - naira) * 100)

  let result = ''

  // Convert naira part
  if (naira > 0) {
    const nairaWords = numberToWords(naira)
    result = nairaWords.charAt(0).toUpperCase() + nairaWords.slice(1) + ' naira'
  }

  // Convert kobo part if needed
  if (includeKobo && kobo > 0) {
    const koboWords = numberToWords(kobo)
    if (naira > 0) {
      result += ' ' + koboWords + ' kobo'
    } else {
      result = koboWords.charAt(0).toUpperCase() + koboWords.slice(1) + ' kobo'
    }
  }

  result += ' only'

  return result
}

/**
 * Format amount with proper capitalization
 * @param amount - Numeric amount
 * @returns Properly capitalized amount in words
 */
export function formatAmountWords(amount: number): string {
  return amountToWords(amount, false)
}

/**
 * Generate PV amount display (both numeric and words)
 * @param amount - Numeric amount
 * @returns Object with numeric and words representation
 */
export function formatPVAmount(amount: number): {
  numeric: string
  words: string
} {
  return {
    numeric: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount),
    words: amountToWords(amount),
  }
}
