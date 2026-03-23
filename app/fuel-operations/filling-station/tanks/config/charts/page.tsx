'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import {
  FileText,
  Upload,
  Download,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import { tankCalc } from '@/utils/tank-calcs'
import type { ChartEntry } from '@/utils/tank-calcs'

interface CalibrationChart {
  id: string
  label: string
  type: 'tank' | 'compartment'
  assignedTo: string
  entries: ChartEntry[]
  uploadedBy: string
  uploadedAt: string
  lastModifiedBy: string
  lastModifiedAt: string
}

export default function CalibrationChartsPage() {
  const [charts, setCharts] = useState<CalibrationChart[]>([
    {
      id: 'CHART-PMS-T1',
      label: 'PMS Tank 1 Calibration',
      type: 'tank',
      assignedTo: 'PMS-T1',
      entries: [
        { dipCm: 0, litres: 0 },
        { dipCm: 50, litres: 5500 },
        { dipCm: 100, litres: 12000 },
        { dipCm: 150, litres: 19500 },
        { dipCm: 200, litres: 28000 },
        { dipCm: 250, litres: 37500 },
        { dipCm: 280, litres: 45000 },
      ],
      uploadedBy: 'Admin',
      uploadedAt: '2025-12-10T10:30:00',
      lastModifiedBy: 'Admin',
      lastModifiedAt: '2025-12-10T10:30:00',
    },
    {
      id: 'CHART-COMP-STD',
      label: 'Standard Compartment',
      type: 'compartment',
      assignedTo: 'All Trucks',
      entries: [
        { dipCm: 0, litres: 0 },
        { dipCm: 20, litres: 1200 },
        { dipCm: 40, litres: 2500 },
        { dipCm: 60, litres: 3900 },
        { dipCm: 80, litres: 5400 },
        { dipCm: 100, litres: 7000 },
        { dipCm: 120, litres: 8700 },
        { dipCm: 140, litres: 10500 },
      ],
      uploadedBy: 'Admin',
      uploadedAt: '2025-12-10T10:30:00',
      lastModifiedBy: 'Admin',
      lastModifiedAt: '2025-12-10T10:30:00',
    },
  ])

  const [selectedChart, setSelectedChart] = useState<CalibrationChart | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const validateChart = (entries: ChartEntry[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (entries.length < 2) {
      errors.push('Chart must have at least 2 data points')
    }

    // Check monotonic increasing
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].dipCm <= entries[i - 1].dipCm) {
        errors.push(`Dip reading at row ${i + 1} must be greater than previous row`)
      }
      if (entries[i].litres <= entries[i - 1].litres) {
        errors.push(`Volume at row ${i + 1} must be greater than previous row`)
      }
    }

    // Check for duplicates
    const dipCms = entries.map((e) => e.dipCm)
    const uniqueDipCms = new Set(dipCms)
    if (dipCms.length !== uniqueDipCms.size) {
      errors.push('Duplicate dip readings found')
    }

    // Check first entry is zero
    if (entries[0].dipCm !== 0 || entries[0].litres !== 0) {
      errors.push('First entry must be 0cm = 0L')
    }

    return { valid: errors.length === 0, errors }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const csvText = event.target?.result as string
      const lines = csvText.split('\n').filter((line) => line.trim())

      // Skip header row if present
      const dataLines = lines[0].toLowerCase().includes('dip') ? lines.slice(1) : lines

      const entries: ChartEntry[] = dataLines
        .map((line) => {
          const [dipCm, litres] = line.split(',').map((val) => parseFloat(val.trim()))
          if (isNaN(dipCm) || isNaN(litres)) return null
          return { dipCm, litres }
        })
        .filter((entry): entry is ChartEntry => entry !== null)

      const validation = validateChart(entries)
      if (!validation.valid) {
        alert(`Chart validation failed:\n${validation.errors.join('\n')}`)
        return
      }

      // Create new chart from CSV
      const newChart: CalibrationChart = {
        id: `CHART-${Date.now()}`,
        label: file.name.replace('.csv', ''),
        type: 'tank',
        assignedTo: 'Unassigned',
        entries,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        lastModifiedBy: 'Current User',
        lastModifiedAt: new Date().toISOString(),
      }

      setCharts([...charts, newChart])
      alert(`Chart "${newChart.label}" uploaded successfully with ${entries.length} data points`)
    }

    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  const handleDownloadCSV = (chart: CalibrationChart) => {
    const csvContent = [
      'Dip (cm),Volume (L)',
      ...chart.entries.map((e) => `${e.dipCm},${e.litres}`),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chart.label.replace(/\s+/g, '-')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDeleteChart = (chartId: string) => {
    if (confirm('Are you sure you want to delete this calibration chart?')) {
      setCharts(charts.filter((c) => c.id !== chartId))
    }
  }

  const handleSaveChart = (chart: CalibrationChart) => {
    const validation = validateChart(chart.entries)
    if (!validation.valid) {
      alert(`Chart validation failed:\n${validation.errors.join('\n')}`)
      return
    }

    if (isEditing && selectedChart) {
      setCharts(
        charts.map((c) =>
          c.id === chart.id
            ? {
                ...chart,
                lastModifiedBy: 'Current User',
                lastModifiedAt: new Date().toISOString(),
              }
            : c
        )
      )
      setIsEditing(false)
      setSelectedChart(null)
    } else if (isAdding) {
      setCharts([...charts, chart])
      setIsAdding(false)
      setSelectedChart(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calibration Charts Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage dip-to-volume calibration charts for tanks and compartments</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>
          <button
            onClick={() => {
              setSelectedChart({
                id: `CHART-${Date.now()}`,
                label: '',
                type: 'tank',
                assignedTo: '',
                entries: [{ dipCm: 0, litres: 0 }],
                uploadedBy: 'Current User',
                uploadedAt: new Date().toISOString(),
                lastModifiedBy: 'Current User',
                lastModifiedAt: new Date().toISOString(),
              })
              setIsAdding(true)
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chart
          </button>
        </div>
      </div>

      {/* Charts List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Calibration Charts ({charts.length})</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Chart ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Label</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Data Points</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Modified</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {charts.map((chart) => {
                const validation = validateChart(chart.entries)
                return (
                  <tr key={chart.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{chart.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{chart.label}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          chart.type === 'tank'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {chart.type === 'tank' ? 'Tank' : 'Compartment'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{chart.assignedTo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {validation.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-900">{chart.entries.length} points</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(chart.lastModifiedAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedChart(chart)
                            setIsEditing(true)
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Edit chart"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadCSV(chart)}
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Download CSV"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChart(chart.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Delete chart"
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

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">CSV Upload Format</h3>
            <p className="text-sm text-blue-800 mb-2">
              Upload a CSV file with two columns: <strong>Dip (cm)</strong> and <strong>Volume (L)</strong>
            </p>
            <div className="bg-white rounded p-3 font-mono text-xs text-gray-900 mb-2">
              Dip (cm),Volume (L)<br />
              0,0<br />
              50,5500<br />
              100,12000<br />
              150,19500<br />
              ...
            </div>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>First row can be headers (optional, will be skipped)</li>
              <li>Dip readings must be monotonically increasing (larger cm = more fuel)</li>
              <li>Volume must be monotonically increasing</li>
              <li>First entry must be 0,0</li>
              <li>No duplicate dip readings</li>
              <li>Minimum 2 data points required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chart Editor Modal */}
      {(isEditing || isAdding) && selectedChart && (
        <ChartEditorModal
          chart={selectedChart}
          isAdding={isAdding}
          onSave={handleSaveChart}
          onCancel={() => {
            setSelectedChart(null)
            setIsEditing(false)
            setIsAdding(false)
          }}
        />
      )}
    </div>
  )
}

// Chart Editor Modal Component
function ChartEditorModal({
  chart,
  isAdding,
  onSave,
  onCancel,
}: {
  chart: CalibrationChart
  isAdding: boolean
  onSave: (chart: CalibrationChart) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<CalibrationChart>(chart)

  const updateEntry = (index: number, field: 'dipCm' | 'litres', value: number) => {
    const newEntries = [...formData.entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setFormData({ ...formData, entries: newEntries })
  }

  const addEntry = () => {
    const lastEntry = formData.entries[formData.entries.length - 1]
    const newEntry: ChartEntry = {
      dipCm: lastEntry ? lastEntry.dipCm + 10 : 0,
      litres: lastEntry ? lastEntry.litres + 1000 : 0,
    }
    setFormData({ ...formData, entries: [...formData.entries, newEntry] })
  }

  const removeEntry = (index: number) => {
    if (formData.entries.length <= 2) {
      alert('Chart must have at least 2 data points')
      return
    }
    const newEntries = formData.entries.filter((_, i) => i !== index)
    setFormData({ ...formData, entries: newEntries })
  }

  const validationErrors = tankCalc.validateChartEntries
    ? tankCalc.validateChartEntries(formData.entries)
    : []
  const validation = { valid: validationErrors.length === 0, errors: validationErrors }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isAdding ? 'New Calibration Chart' : 'Edit Calibration Chart'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Chart Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="PMS Tank 1 Calibration"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'tank' | 'compartment' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tank">Underground Tank</option>
                <option value="compartment">Truck Compartment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="PMS-T1 or All Trucks"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Validation Status */}
          {validation && !validation.valid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-1">Validation Errors</h4>
                  <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                    {validation.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Chart Data Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Calibration Data Points</h4>
              <button
                onClick={addEntry}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">#</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Dip Reading (cm)</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Volume (L)</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Increment</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.entries.map((entry, index) => {
                    const prevEntry = index > 0 ? formData.entries[index - 1] : null
                    const dipIncrement = prevEntry ? entry.dipCm - prevEntry.dipCm : 0
                    const volIncrement = prevEntry ? entry.litres - prevEntry.litres : 0

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.dipCm}
                            onChange={(e) => updateEntry(index, 'dipCm', parseFloat(e.target.value) || 0)}
                            step="0.1"
                            disabled={index === 0}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.litres}
                            onChange={(e) => updateEntry(index, 'litres', parseFloat(e.target.value) || 0)}
                            step="1"
                            disabled={index === 0}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {index > 0 && (
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span>+{dipIncrement.toFixed(1)}cm, +{volIncrement}L</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => removeEntry(index)}
                            disabled={index === 0 || formData.entries.length <= 2}
                            className="p-1 text-red-600 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {formData.entries.length} data points • Range: {formData.entries[0]?.dipCm}cm to{' '}
            {formData.entries[formData.entries.length - 1]?.dipCm}cm
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              disabled={validation && !validation.valid}
              className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isAdding ? 'Create Chart' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
