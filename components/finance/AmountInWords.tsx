import { amountToWords } from '@/utils/finance-amount-words'

interface AmountInWordsProps {
  amount: number
  includeKobo?: boolean
  className?: string
}

/**
 * AmountInWords Component
 *
 * Displays a numeric amount as Naira words
 * Used in payment vouchers and other financial documents
 * Auto-generates the text - not an editable input
 */
export function AmountInWords({ amount, includeKobo = false, className = '' }: AmountInWordsProps) {
  const words = amountToWords(amount, includeKobo)

  return (
    <span className={`italic text-gray-700 ${className}`}>
      {words}
    </span>
  )
}
