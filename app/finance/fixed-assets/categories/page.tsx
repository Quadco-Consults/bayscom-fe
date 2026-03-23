'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Plus, Edit, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { AssetCategory } from '@/lib/types'
import Link from 'next/link'

const mockCategories: AssetCategory[] = [
  {
    id: '1',
    code: 'TRUCKS',
    name: 'Trucks & Vehicles',
    description: 'Fleet vehicles and trucks',
    depreciationMethod: 'straight-line',
    depreciationRate: 15,
    usefulLife: 10,
    salvageValuePercent: 10,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    code: 'PUMPS',
    name: 'Fuel Pumps',
    description: 'Fuel dispensing pumps',
    depreciationMethod: 'straight-line',
    depreciationRate: 20,
    usefulLife: 8,
    salvageValuePercent: 5,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    code: 'TANKS',
    name: 'Storage Tanks',
    description: 'Underground and overground storage tanks',
    depreciationMethod: 'straight-line',
    depreciationRate: 10,
    usefulLife: 15,
    salvageValuePercent: 15,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    code: 'EQUIP',
    name: 'Equipment',
    description: 'General equipment and machinery',
    depreciationMethod: 'declining-balance',
    depreciationRate: 25,
    usefulLife: 6,
    salvageValuePercent: 10,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    code: 'BUILDING',
    name: 'Buildings',
    description: 'Office buildings and structures',
    depreciationMethod: 'straight-line',
    depreciationRate: 5,
    usefulLife: 20,
    salvageValuePercent: 20,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

export default function AssetCategoriesPage() {
  const [categories] = useState<AssetCategory[]>(mockCategories)
  const [showModal, setShowModal] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/finance/fixed-assets"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asset Categories</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage asset categories and depreciation rules
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#8B1538' }}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depreciation Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate/Life</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salvage %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.code}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {category.depreciationMethod.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {category.depreciationRate}% / {category.usefulLife} years
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{category.salvageValuePercent}%</td>
                  <td className="px-6 py-4">
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
