'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  Truck,
  Wrench,
  Package,
  TrendingDown,
  Calendar,
  DollarSign,
  MapPin,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { FixedAsset, AssetCategory } from '@/lib/types'
import Link from 'next/link'

// Mock data for demonstration
const mockAssetCategories: AssetCategory[] = [
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
]

const mockFixedAssets: FixedAsset[] = [
  {
    id: '1',
    assetTag: 'TRK-001',
    assetName: 'Mercedes Actros 2545 - FT-001-NG',
    description: '33,000L fuel tanker truck',
    categoryId: '1',
    category: mockAssetCategories[0],
    serialNumber: 'WDB9340261K485123',
    manufacturer: 'Mercedes-Benz',
    model: 'Actros 2545',
    acquisitionDate: '2023-01-15',
    acquisitionCost: 85000000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2023-02-01',
    usefulLife: 10,
    salvageValue: 8500000,
    currentValue: 73650000,
    accumulatedDepreciation: 11350000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2025-03-22',
  },
  {
    id: '2',
    assetTag: 'TRK-002',
    assetName: 'Volvo FH16 - FT-002-NG',
    description: '40,000L fuel tanker truck',
    categoryId: '1',
    category: mockAssetCategories[0],
    serialNumber: 'YV2AG40C4DA567890',
    manufacturer: 'Volvo',
    model: 'FH16',
    acquisitionDate: '2023-06-20',
    acquisitionCost: 95000000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2023-07-01',
    usefulLife: 10,
    salvageValue: 9500000,
    currentValue: 83000000,
    accumulatedDepreciation: 12000000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2023-06-20',
    updatedAt: '2025-03-22',
  },
  {
    id: '3',
    assetTag: 'PMP-ABJ-01',
    assetName: 'Fuel Dispenser - Abuja Station Pump 1',
    description: 'Tokheim 4-nozzle fuel dispenser',
    categoryId: '2',
    category: mockAssetCategories[1],
    serialNumber: 'TKH-2024-ABJ-001',
    manufacturer: 'Tokheim',
    model: 'Quantium 510',
    acquisitionDate: '2024-03-10',
    acquisitionCost: 3500000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2024-04-01',
    usefulLife: 8,
    salvageValue: 175000,
    currentValue: 3150000,
    accumulatedDepreciation: 350000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2024-03-10',
    updatedAt: '2025-03-22',
  },
  {
    id: '4',
    assetTag: 'PMP-ABJ-02',
    assetName: 'Fuel Dispenser - Abuja Station Pump 2',
    description: 'Tokheim 4-nozzle fuel dispenser',
    categoryId: '2',
    category: mockAssetCategories[1],
    serialNumber: 'TKH-2024-ABJ-002',
    manufacturer: 'Tokheim',
    model: 'Quantium 510',
    acquisitionDate: '2024-03-10',
    acquisitionCost: 3500000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2024-04-01',
    usefulLife: 8,
    salvageValue: 175000,
    currentValue: 3150000,
    accumulatedDepreciation: 350000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2024-03-10',
    updatedAt: '2025-03-22',
  },
  {
    id: '5',
    assetTag: 'TNK-ABJ-AGO',
    assetName: 'Underground Storage Tank - AGO',
    description: '50,000L underground storage tank for AGO',
    categoryId: '3',
    category: mockAssetCategories[2],
    serialNumber: 'UST-50K-AGO-001',
    manufacturer: 'Corrosion-resistant Systems',
    model: 'UDT-50000',
    acquisitionDate: '2022-08-15',
    acquisitionCost: 15000000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2022-09-01',
    usefulLife: 15,
    salvageValue: 2250000,
    currentValue: 12875000,
    accumulatedDepreciation: 2125000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2022-08-15',
    updatedAt: '2025-03-22',
  },
  {
    id: '6',
    assetTag: 'TNK-ABJ-PMS',
    assetName: 'Underground Storage Tank - PMS',
    description: '60,000L underground storage tank for PMS',
    categoryId: '3',
    category: mockAssetCategories[2],
    serialNumber: 'UST-60K-PMS-001',
    manufacturer: 'Corrosion-resistant Systems',
    model: 'UDT-60000',
    acquisitionDate: '2022-08-15',
    acquisitionCost: 18000000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2022-09-01',
    usefulLife: 15,
    salvageValue: 2700000,
    currentValue: 15450000,
    accumulatedDepreciation: 2550000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2022-08-15',
    updatedAt: '2025-03-22',
  },
  {
    id: '7',
    assetTag: 'TRK-003',
    assetName: 'Scania R500 - FT-003-NG',
    description: '36,000L fuel tanker truck',
    categoryId: '1',
    category: mockAssetCategories[0],
    serialNumber: 'YS2R6X40005678901',
    manufacturer: 'Scania',
    model: 'R500',
    acquisitionDate: '2024-11-01',
    acquisitionCost: 92000000,
    depreciationMethod: 'straight-line',
    depreciationStartDate: '2024-12-01',
    usefulLife: 10,
    salvageValue: 9200000,
    currentValue: 89500000,
    accumulatedDepreciation: 2500000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2024-11-01',
    updatedAt: '2025-03-22',
  },
  {
    id: '8',
    assetTag: 'EQP-GEN-001',
    assetName: 'Diesel Generator - Abuja Station',
    description: '200KVA standby generator',
    categoryId: '4',
    category: mockAssetCategories[3],
    serialNumber: 'CAT-DE200E0-S-001',
    manufacturer: 'Caterpillar',
    model: 'DE200E0',
    acquisitionDate: '2023-10-05',
    acquisitionCost: 12000000,
    depreciationMethod: 'declining-balance',
    depreciationStartDate: '2023-11-01',
    usefulLife: 6,
    salvageValue: 1200000,
    currentValue: 8100000,
    accumulatedDepreciation: 3900000,
    lastDepreciationDate: '2025-03-01',
    status: 'active',
    createdAt: '2023-10-05',
    updatedAt: '2025-03-22',
  },
]

export default function FixedAssetsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [assets] = useState<FixedAsset[]>(mockFixedAssets)
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Calculate summary statistics
  const totalAssets = assets.length
  const activeAssets = assets.filter(a => a.status === 'active').length
  const totalAcquisitionCost = assets.reduce((sum, a) => sum + a.acquisitionCost, 0)
  const totalCurrentValue = assets.reduce((sum, a) => sum + a.currentValue, 0)
  const totalDepreciation = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0)
  const monthlyDepreciation = 715833 // Calculated average

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || asset.categoryId === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-200',
      disposed: 'bg-gray-50 text-gray-700 border-gray-200',
      'fully-depreciated': 'bg-blue-50 text-blue-700 border-blue-200',
      'under-maintenance': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      retired: 'bg-red-50 text-red-700 border-red-200',
    }

    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      disposed: <XCircle className="w-3 h-3" />,
      'fully-depreciated': <TrendingDown className="w-3 h-3" />,
      'under-maintenance': <Wrench className="w-3 h-3" />,
      retired: <AlertCircle className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${
          styles[status as keyof typeof styles] || styles.active
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </span>
    )
  }

  const getCategoryIcon = (categoryCode: string) => {
    switch (categoryCode) {
      case 'TRUCKS':
        return <Truck className="w-5 h-5" />
      case 'PUMPS':
        return <Package className="w-5 h-5" />
      case 'TANKS':
        return <Building2 className="w-5 h-5" />
      default:
        return <Wrench className="w-5 h-5" />
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Asset Tag',
      'Asset Name',
      'Category',
      'Acquisition Date',
      'Acquisition Cost',
      'Current Value',
      'Accumulated Depreciation',
      'Status',
    ]

    const csvData = filteredAssets.map(asset => [
      asset.assetTag,
      asset.assetName,
      asset.category?.name || '',
      asset.acquisitionDate,
      asset.acquisitionCost,
      asset.currentValue,
      asset.accumulatedDepreciation,
      asset.status,
    ])

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fixed-assets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fixed Assets Register</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track all fixed assets with automated depreciation
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/finance/fixed-assets/categories"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              Categories
            </Link>
            <Link
              href="/finance/fixed-assets/depreciation"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <TrendingDown className="w-4 h-4" />
              Depreciation
            </Link>
            <Link
              href="/finance/fixed-assets/disposal"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <XCircle className="w-4 h-4" />
              Disposals
            </Link>
            <Link
              href="/finance/fixed-assets/assets/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{totalAssets}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assets</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{activeAssets}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acquisition Cost</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalAcquisitionCost)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Value</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalCurrentValue)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Depreciation</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalDepreciation)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Depreciation</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(monthlyDepreciation)}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by tag, name, description, serial number..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {mockAssetCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="disposed">Disposed</option>
                <option value="fully-depreciated">Fully Depreciated</option>
                <option value="under-maintenance">Under Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAssets.length} of {totalAssets} assets
            </p>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acquisition
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acquisition Cost
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depreciation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getCategoryIcon(asset.category?.code || '')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{asset.assetTag}</div>
                          <div className="text-sm text-gray-600">{asset.assetName}</div>
                          {asset.serialNumber && (
                            <div className="text-xs text-gray-500 mt-0.5">SN: {asset.serialNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{asset.category?.name}</div>
                      <div className="text-xs text-gray-500">{asset.depreciationMethod.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(asset.acquisitionDate)}</div>
                      {asset.manufacturer && (
                        <div className="text-xs text-gray-500">{asset.manufacturer}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(asset.acquisitionCost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(asset.currentValue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((asset.currentValue / asset.acquisitionCost) * 100).toFixed(1)}% of cost
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(asset.accumulatedDepreciation)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((asset.accumulatedDepreciation / (asset.acquisitionCost - asset.salvageValue)) * 100).toFixed(1)}% depreciated
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedAsset(asset)
                          setShowDetailModal(true)
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Detail Modal */}
        {showDetailModal && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Asset Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 space-y-6">
                {/* Asset Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Asset Tag</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.assetTag}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <p className="mt-1">{getStatusBadge(selectedAsset.status)}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Asset Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.assetName}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.category?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Serial Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.serialNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.manufacturer || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Model</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.model || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Acquisition Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedAsset.acquisitionDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Acquisition Cost</label>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedAsset.acquisitionCost)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Current Value</label>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedAsset.currentValue)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Accumulated Depreciation</label>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedAsset.accumulatedDepreciation)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Salvage Value</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCurrency(selectedAsset.salvageValue)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Depreciable Amount</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCurrency(selectedAsset.acquisitionCost - selectedAsset.salvageValue)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Depreciation Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Depreciation Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Depreciation Method</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAsset.depreciationMethod
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Useful Life</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.usefulLife} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Depreciation Start Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedAsset.depreciationStartDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Depreciation Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAsset.lastDepreciationDate ? formatDate(selectedAsset.lastDepreciationDate) : 'N/A'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">Depreciation Progress</label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {((selectedAsset.accumulatedDepreciation / (selectedAsset.acquisitionCost - selectedAsset.salvageValue)) * 100).toFixed(1)}% Complete
                          </span>
                          <span className="text-gray-600">
                            {formatCurrency(selectedAsset.accumulatedDepreciation)} of{' '}
                            {formatCurrency(selectedAsset.acquisitionCost - selectedAsset.salvageValue)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${((selectedAsset.accumulatedDepreciation / (selectedAsset.acquisitionCost - selectedAsset.salvageValue)) * 100)}%`,
                              backgroundColor: '#8B1538',
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6 flex gap-3">
                  <Link
                    href={`/finance/fixed-assets/assets/${selectedAsset.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    <FileText className="w-4 h-4" />
                    View Full Details
                  </Link>
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <TrendingDown className="w-4 h-4" />
                    View Depreciation Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
