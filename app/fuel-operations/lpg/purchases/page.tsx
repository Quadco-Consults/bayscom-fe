'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  MonthScopeBar,
  InventorySummaryCard,
  SummaryItem,
} from '@/components/fuel/shared'
import { useFuelConfig } from '@/contexts/FuelConfigContext'
import { useMonthScope } from '@/contexts/MonthScopeContext'
import { ShoppingCart, Download, Printer, Plus, Edit, Trash2, Check, X } from 'lucide-react'
import { formatNGN, formatKg } from '@/utils/fuel-format'

interface LPGPurchaseRecord {
  id: string
  date: string
  supplier: string
  invoiceNo: string

  // LPG Refill
  lpgKg: number
  lpgUnitPrice: number

  // Cylinder Purchases (empty cylinders)
  cylinders12_5kg: number
  cylinders6kg: number
  cylinders3kg: number
  cylinderUnitPrice12_5: number
  cylinderUnitPrice6: number
  cylinderUnitPrice3: number

  // Accessory Purchases
  regulators: number
  hoses: number
  regulatorUnitPrice: number
  hoseUnitPrice: number

  // Payment
  paymentStatus: 'paid' | 'pending' | 'partial'
  amountPaid: number
  notes?: string
}

/**
 * LPG Section - Purchases Page
 *
 * Demonstrates:
 * - LPG refill tracking
 * - Cylinder inventory purchases
 * - Accessory purchases (regulators, hoses)
 * - Supplier and invoice management
 * - Payment tracking
 * - Monthly purchase summaries
 */
export default function LPGPurchasesPage() {
  const { config, getStation, isMonthLocked } = useFuelConfig()
  const { stationId, month, year, setStation, setMonthYear } = useMonthScope()

  const [purchases, setPurchases] = useState<LPGPurchaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const station = getStation(stationId)
  const isLocked = isMonthLocked(stationId, month, year)

  // Load purchases for the month
  useEffect(() => {
    setLoading(true)

    // Sample data (in production, this would come from API)
    const samplePurchases: LPGPurchaseRecord[] = [
      {
        id: 'PUR-001',
        date: new Date(year, month - 1, 5).toISOString().split('T')[0],
        supplier: 'Techno Oil Ltd',
        invoiceNo: 'INV-2024-0156',
        lpgKg: 5000,
        lpgUnitPrice: 650,
        cylinders12_5kg: 20,
        cylinders6kg: 15,
        cylinders3kg: 10,
        cylinderUnitPrice12_5: 12000,
        cylinderUnitPrice6: 7000,
        cylinderUnitPrice3: 4000,
        regulators: 30,
        hoses: 25,
        regulatorUnitPrice: 2800,
        hoseUnitPrice: 1200,
        paymentStatus: 'paid',
        amountPaid: 3685000,
        notes: 'Bulk purchase for month start',
      },
      {
        id: 'PUR-002',
        date: new Date(year, month - 1, 12).toISOString().split('T')[0],
        supplier: 'Techno Oil Ltd',
        invoiceNo: 'INV-2024-0198',
        lpgKg: 3500,
        lpgUnitPrice: 650,
        cylinders12_5kg: 10,
        cylinders6kg: 8,
        cylinders3kg: 5,
        cylinderUnitPrice12_5: 12000,
        cylinderUnitPrice6: 7000,
        cylinderUnitPrice3: 4000,
        regulators: 15,
        hoses: 12,
        regulatorUnitPrice: 2800,
        hoseUnitPrice: 1200,
        paymentStatus: 'pending',
        amountPaid: 0,
        notes: 'Mid-month restock',
      },
      {
        id: 'PUR-003',
        date: new Date(year, month - 1, 20).toISOString().split('T')[0],
        supplier: 'Gas City Supply',
        invoiceNo: 'GCS-2024-445',
        lpgKg: 2000,
        lpgUnitPrice: 680,
        cylinders12_5kg: 5,
        cylinders6kg: 0,
        cylinders3kg: 8,
        cylinderUnitPrice12_5: 12500,
        cylinderUnitPrice6: 0,
        cylinderUnitPrice3: 4200,
        regulators: 10,
        hoses: 8,
        regulatorUnitPrice: 3000,
        hoseUnitPrice: 1300,
        paymentStatus: 'partial',
        amountPaid: 1000000,
        notes: 'Different supplier - higher rates',
      },
    ]

    setPurchases(samplePurchases)
    setLoading(false)
  }, [stationId, month, year])

  // Calculate total cost for a purchase
  const calculateTotalCost = (purchase: LPGPurchaseRecord) => {
    const lpgCost = purchase.lpgKg * purchase.lpgUnitPrice
    const cylinderCost =
      purchase.cylinders12_5kg * purchase.cylinderUnitPrice12_5 +
      purchase.cylinders6kg * purchase.cylinderUnitPrice6 +
      purchase.cylinders3kg * purchase.cylinderUnitPrice3
    const accessoryCost =
      purchase.regulators * purchase.regulatorUnitPrice +
      purchase.hoses * purchase.hoseUnitPrice

    return {
      lpgCost,
      cylinderCost,
      accessoryCost,
      totalCost: lpgCost + cylinderCost + accessoryCost,
    }
  }

  // Calculate monthly summary
  const monthlySummary = useMemo((): SummaryItem[] => {
    let totalLPGKg = 0
    let totalLPGCost = 0
    let totalCylinderCost = 0
    let totalAccessoryCost = 0
    let totalCost = 0
    let totalPaid = 0
    let totalCylinders12_5 = 0
    let totalCylinders6 = 0
    let totalCylinders3 = 0

    purchases.forEach((purchase) => {
      const costs = calculateTotalCost(purchase)
      totalLPGKg += purchase.lpgKg
      totalLPGCost += costs.lpgCost
      totalCylinderCost += costs.cylinderCost
      totalAccessoryCost += costs.accessoryCost
      totalCost += costs.totalCost
      totalPaid += purchase.amountPaid

      totalCylinders12_5 += purchase.cylinders12_5kg
      totalCylinders6 += purchase.cylinders6kg
      totalCylinders3 += purchase.cylinders3kg
    })

    const totalOutstanding = totalCost - totalPaid
    const purchaseCount = purchases.length

    return [
      {
        label: 'Total LPG Purchased',
        value: totalLPGKg,
        format: 'number',
        description: `${formatKg(totalLPGKg)} across ${purchaseCount} purchases`,
      },
      {
        label: 'LPG Cost',
        value: totalLPGCost,
        format: 'currency',
        description: 'Total cost of LPG refills',
      },
      {
        label: 'Cylinder Purchases',
        value: totalCylinderCost,
        format: 'currency',
        description: `${totalCylinders12_5 + totalCylinders6 + totalCylinders3} cylinders`,
      },
      {
        label: 'Accessory Purchases',
        value: totalAccessoryCost,
        format: 'currency',
        description: 'Regulators and hoses',
      },
      {
        label: 'Total Purchase Value',
        value: totalCost,
        format: 'currency',
        highlight: 'success',
        description: 'Combined total for all purchases',
      },
      {
        label: 'Amount Paid',
        value: totalPaid,
        format: 'currency',
        description: 'Total payments made',
      },
      {
        label: 'Outstanding Balance',
        value: totalOutstanding,
        format: 'currency',
        highlight: totalOutstanding > 0 ? 'danger' : undefined,
        description: totalOutstanding > 0 ? 'Pending payment' : 'Fully paid',
      },
    ]
  }, [purchases])

  const lpgStations = config.stations.filter((s) => s.type === 'lpg-section')

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this purchase record?')) {
      setPurchases((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const getPaymentStatusBadge = (status: LPGPurchaseRecord['paymentStatus']) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-red-100 text-red-800',
      partial: 'bg-amber-100 text-amber-800',
    }

    const labels = {
      paid: 'Paid',
      pending: 'Pending',
      partial: 'Partial',
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading purchases...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Month Scope Bar */}
        <MonthScopeBar
          stationId={stationId}
          month={month}
          year={year}
          isLocked={isLocked}
          stations={lpgStations}
          onStationChange={setStation}
          onMonthChange={(m, y) => setMonthYear(m, y)}
          showLockToggle={false}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                disabled={isLocked}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Purchase
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          }
        />

        {/* Page Header */}
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LPG Purchases</h1>
            <p className="text-sm text-gray-500">
              Track LPG refills, cylinder purchases, and accessories
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <InventorySummaryCard
          title="Purchase Summary"
          subtitle="Computed totals for the selected month"
          items={monthlySummary}
          icon={<ShoppingCart className="w-6 h-6" />}
        />

        {/* Purchase Records Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Purchase Records</h2>
            <p className="text-sm text-gray-500 mt-1">
              All LPG, cylinder, and accessory purchases for the month
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Supplier
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Invoice No
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    LPG (Kg)
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Cylinders
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Accessories
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Total Cost
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Paid
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                      No purchase records found for this month. Click "Add Purchase" to record a
                      new purchase.
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => {
                    const costs = calculateTotalCost(purchase)
                    const totalCylinders =
                      purchase.cylinders12_5kg + purchase.cylinders6kg + purchase.cylinders3kg
                    const totalAccessories = purchase.regulators + purchase.hoses

                    return (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(purchase.date).toLocaleDateString('en-NG', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">{purchase.supplier}</td>
                        <td className="px-3 py-4 text-sm text-gray-600 font-mono">
                          {purchase.invoiceNo}
                        </td>
                        <td className="px-3 py-4 text-sm text-right text-gray-900">
                          {formatKg(purchase.lpgKg)}
                          <div className="text-xs text-gray-500">
                            @ {formatNGN(purchase.lpgUnitPrice)}/Kg
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-right text-gray-900">
                          {totalCylinders}
                          <div className="text-xs text-gray-500">
                            {purchase.cylinders12_5kg > 0 && `12.5kg: ${purchase.cylinders12_5kg}`}
                            {purchase.cylinders6kg > 0 && `, 6kg: ${purchase.cylinders6kg}`}
                            {purchase.cylinders3kg > 0 && `, 3kg: ${purchase.cylinders3kg}`}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-right text-gray-900">
                          {totalAccessories}
                          <div className="text-xs text-gray-500">
                            Reg: {purchase.regulators}, Hose: {purchase.hoses}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-right font-semibold text-gray-900">
                          {formatNGN(costs.totalCost)}
                        </td>
                        <td className="px-3 py-4 text-sm text-right text-gray-900">
                          {formatNGN(purchase.amountPaid)}
                        </td>
                        <td className="px-3 py-4 text-center">
                          {getPaymentStatusBadge(purchase.paymentStatus)}
                        </td>
                        <td className="px-3 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingId(purchase.id)}
                              disabled={isLocked}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(purchase.id)}
                              disabled={isLocked}
                              className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">Purchase Guidelines:</h3>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>Record all LPG refills with supplier invoice numbers for tracking</li>
            <li>
              Cylinder purchases are for EMPTY cylinders to be added to inventory (not refills)
            </li>
            <li>Track payment status accurately - Paid, Pending, or Partial</li>
            <li>Outstanding balances should be settled before month-end reconciliation</li>
            <li>Verify all purchases match physical stock additions in inventory</li>
            <li>Keep supplier invoices for audit purposes</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
