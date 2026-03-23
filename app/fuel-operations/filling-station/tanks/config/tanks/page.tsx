/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import {
  Droplet,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  Fuel,
  Link as LinkIcon,
} from 'lucide-react'

interface Tank {
  id: string
  label: string
  product: 'PMS' | 'AGO' | 'DPK'
  capacityLitres: number
  calibrationChartId: string
  status: 'active' | 'inactive'
  installDate: string
  lastCalibrationDate: string
}

interface Pump {
  id: string
  label: string
  tankId: string
  product: 'PMS' | 'AGO' | 'DPK'
  status: 'active' | 'inactive' | 'maintenance'
  lastMaintenanceDate: string
}

export default function TankConfigPage() {
  const [tanks, setTanks] = useState<Tank[]>([
    {
      id: 'PMS-T1',
      label: 'PMS Tank 1',
      product: 'PMS',
      capacityLitres: 45000,
      calibrationChartId: 'CHART-PMS-T1',
      status: 'active',
      installDate: '2020-01-15',
      lastCalibrationDate: '2025-12-10',
    },
    {
      id: 'PMS-T2',
      label: 'PMS Tank 2',
      product: 'PMS',
      capacityLitres: 45000,
      calibrationChartId: 'CHART-PMS-T2',
      status: 'active',
      installDate: '2020-01-15',
      lastCalibrationDate: '2025-12-10',
    },
    {
      id: 'AGO-T1',
      label: 'AGO Tank 1',
      product: 'AGO',
      capacityLitres: 33000,
      calibrationChartId: 'CHART-AGO-T1',
      status: 'active',
      installDate: '2020-01-15',
      lastCalibrationDate: '2025-12-10',
    },
    {
      id: 'DPK-T1',
      label: 'DPK Tank 1',
      product: 'DPK',
      capacityLitres: 20000,
      calibrationChartId: 'CHART-DPK-T1',
      status: 'active',
      installDate: '2020-01-15',
      lastCalibrationDate: '2025-12-10',
    },
  ])

  const [pumps, setPumps] = useState<Pump[]>([
    { id: 'PUMP-01', label: 'Pump 1', tankId: 'PMS-T1', product: 'PMS', status: 'active', lastMaintenanceDate: '2026-02-15' },
    { id: 'PUMP-02', label: 'Pump 2', tankId: 'PMS-T1', product: 'PMS', status: 'active', lastMaintenanceDate: '2026-02-15' },
    { id: 'PUMP-03', label: 'Pump 3', tankId: 'PMS-T2', product: 'PMS', status: 'active', lastMaintenanceDate: '2026-02-18' },
    { id: 'PUMP-04', label: 'Pump 4', tankId: 'PMS-T2', product: 'PMS', status: 'active', lastMaintenanceDate: '2026-02-18' },
    { id: 'PUMP-05', label: 'Pump 5', tankId: 'AGO-T1', product: 'AGO', status: 'active', lastMaintenanceDate: '2026-02-20' },
    { id: 'PUMP-06', label: 'Pump 6', tankId: 'AGO-T1', product: 'AGO', status: 'maintenance', lastMaintenanceDate: '2026-03-01' },
    { id: 'PUMP-07', label: 'Pump 7', tankId: 'DPK-T1', product: 'DPK', status: 'active', lastMaintenanceDate: '2026-02-22' },
  ])

  const [editingTank, setEditingTank] = useState<Tank | null>(null)
  const [editingPump, setEditingPump] = useState<Pump | null>(null)
  const [isAddingTank, setIsAddingTank] = useState(false)
  const [isAddingPump, setIsAddingPump] = useState(false)

  const handleSaveTank = (tank: Tank) => {
    if (editingTank) {
      setTanks(tanks.map((t) => (t.id === tank.id ? tank : t)))
      setEditingTank(null)
    } else {
      setTanks([...tanks, tank])
      setIsAddingTank(false)
    }
  }

  const handleDeleteTank = (tankId: string) => {
    const connectedPumps = pumps.filter((p) => p.tankId === tankId)
    if (connectedPumps.length > 0) {
      alert(
        `Cannot delete tank ${tankId}. It has ${connectedPumps.length} connected pump(s). Please reassign or remove pumps first.`
      )
      return
    }
    if (confirm(`Are you sure you want to delete tank ${tankId}?`)) {
      setTanks(tanks.filter((t) => t.id !== tankId))
    }
  }

  const handleSavePump = (pump: Pump) => {
    const tank = tanks.find((t) => t.id === pump.tankId)
    if (tank && tank.product !== pump.product) {
      alert(`Pump product (${pump.product}) must match tank product (${tank.product})`)
      return
    }

    if (editingPump) {
      setPumps(pumps.map((p) => (p.id === pump.id ? pump : p)))
      setEditingPump(null)
    } else {
      setPumps([...pumps, pump])
      setIsAddingPump(false)
    }
  }

  const handleDeletePump = (pumpId: string) => {
    if (confirm(`Are you sure you want to delete pump ${pumpId}?`)) {
      setPumps(pumps.filter((p) => p.id !== pumpId))
    }
  }

  const getConnectedPumps = (tankId: string) => {
    return pumps.filter((p) => p.tankId === tankId)
  }

  const getProductColor = (prod: 'PMS' | 'AGO' | 'DPK') => {
    switch (prod) {
      case 'PMS':
        return 'bg-amber-100 text-amber-800'
      case 'AGO':
        return 'bg-teal-100 text-teal-800'
      case 'DPK':
        return 'bg-purple-100 text-purple-800'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">Active</span>
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded">Inactive</span>
      case 'maintenance':
        return <span className="px-2 py-1 text-xs font-semibold text-amber-800 bg-amber-100 rounded">Maintenance</span>
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tank & Pump Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage underground tanks and fuel pumps</p>
      </div>

      {/* Tanks Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplet className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Underground Tanks</h2>
          </div>
          <button
            onClick={() => setIsAddingTank(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tank
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tank ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Label</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Capacity (L)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Connected Pumps</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tanks.map((tank) => {
                const connectedPumps = getConnectedPumps(tank.id)
                return (
                  <tr key={tank.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{tank.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tank.label}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getProductColor(tank.product)}`}>
                        {tank.product}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tank.capacityLitres.toLocaleString('en-NG')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{connectedPumps.length} pump(s)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(tank.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingTank(tank)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTank(tank.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pumps Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Fuel className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Fuel Pumps</h2>
          </div>
          <button
            onClick={() => setIsAddingPump(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Pump
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pump ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Label</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned Tank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pumps.map((pump) => (
                <tr key={pump.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{pump.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pump.label}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getProductColor(pump.product)}`}>
                      {pump.product}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{pump.tankId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(pump.lastMaintenanceDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(pump.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingPump(pump)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePump(pump.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Configuration Rules</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Each pump must be assigned to exactly one tank</li>
              <li>Multiple pumps can be connected to the same tank</li>
              <li>Pump product type must match the assigned tank's product type</li>
              <li>Cannot delete a tank that has connected pumps (reassign pumps first)</li>
              <li>Each tank must have a valid calibration chart assigned</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tank Edit/Add Modal */}
      {(editingTank || isAddingTank) && (
        <TankFormModal
          tank={editingTank}
          onSave={handleSaveTank}
          onCancel={() => {
            setEditingTank(null)
            setIsAddingTank(false)
          }}
        />
      )}

      {/* Pump Edit/Add Modal */}
      {(editingPump || isAddingPump) && (
        <PumpFormModal
          pump={editingPump}
          tanks={tanks}
          onSave={handleSavePump}
          onCancel={() => {
            setEditingPump(null)
            setIsAddingPump(false)
          }}
        />
      )}
    </div>
  )
}

// Tank Form Modal Component
function TankFormModal({
  tank,
  onSave,
  onCancel,
}: {
  tank: Tank | null
  onSave: (tank: Tank) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Tank>(
    tank || {
      id: '',
      label: '',
      product: 'PMS',
      capacityLitres: 0,
      calibrationChartId: '',
      status: 'active',
      installDate: new Date().toISOString().split('T')[0],
      lastCalibrationDate: new Date().toISOString().split('T')[0],
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id || !formData.label || !formData.capacityLitres || !formData.calibrationChartId) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{tank ? 'Edit Tank' : 'Add New Tank'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tank ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!!tank}
                placeholder="PMS-T1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="PMS Tank 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PMS">PMS (Petrol)</option>
                <option value="AGO">AGO (Diesel)</option>
                <option value="DPK">DPK (Kerosene)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (Litres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.capacityLitres}
                onChange={(e) => setFormData({ ...formData, capacityLitres: parseFloat(e.target.value) })}
                placeholder="45000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibration Chart ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.calibrationChartId}
                onChange={(e) => setFormData({ ...formData, calibrationChartId: e.target.value })}
                placeholder="CHART-PMS-T1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Install Date</label>
              <input
                type="date"
                value={formData.installDate}
                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Calibration Date</label>
              <input
                type="date"
                value={formData.lastCalibrationDate}
                onChange={(e) => setFormData({ ...formData, lastCalibrationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {tank ? 'Save Changes' : 'Add Tank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Pump Form Modal Component
function PumpFormModal({
  pump,
  tanks,
  onSave,
  onCancel,
}: {
  pump: Pump | null
  tanks: Tank[]
  onSave: (pump: Pump) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Pump>(
    pump || {
      id: '',
      label: '',
      tankId: tanks[0]?.id || '',
      product: tanks[0]?.product || 'PMS',
      status: 'active',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
    }
  )

  const handleTankChange = (tankId: string) => {
    const tank = tanks.find((t) => t.id === tankId)
    if (tank) {
      setFormData({ ...formData, tankId, product: tank.product })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id || !formData.label || !formData.tankId) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{pump ? 'Edit Pump' : 'Add New Pump'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pump ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!!pump}
                placeholder="PUMP-01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Pump 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Tank <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tankId}
                onChange={(e) => handleTankChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tanks.map((tank) => (
                  <option key={tank.id} value={tank.id}>
                    {tank.label} ({tank.product})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product (Auto-assigned)</label>
              <input
                type="text"
                value={formData.product}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Maintenance Date</label>
              <input
                type="date"
                value={formData.lastMaintenanceDate}
                onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {pump ? 'Save Changes' : 'Add Pump'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
