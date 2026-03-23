interface ProductBadgeProps {
  product: 'PMS' | 'AGO' | 'DPK'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ProductBadge Component
 *
 * Displays a color-coded badge for fuel product types
 * - PMS: Amber
 * - AGO: Teal
 * - DPK: Purple
 */
export function ProductBadge({ product, size = 'md' }: ProductBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const colorClasses = {
    PMS: 'bg-amber-100 text-amber-800 border-amber-200',
    AGO: 'bg-teal-100 text-teal-800 border-teal-200',
    DPK: 'bg-purple-100 text-purple-800 border-purple-200',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size]} ${colorClasses[product]}`}
    >
      {product}
    </span>
  )
}
