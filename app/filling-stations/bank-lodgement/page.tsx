'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, DollarSign, Calendar, Building2, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface BankLodgement {
  id: string
  date: string
  stationId: string
  stationName: string
  bankName: string
  tellerNumber: string
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG' | 'Mixed'
  amountDeposited: number
  expectedAmount: number
  variance: number
  variancePercentage: number
  cashier: string
  depositTime: string
  reconciled: boolean
  remarks: string
  createdAt: string
}

const BANKS = [
  'ZENITH BANK',
  'FIRST BANK',
  'STERLING BANK',
  'GTB',
  'UBA',
  'ACCESS BANK',
  'UNION BANK'
]

const PRODUCT_TYPES = ['PMS', 'AGO', 'DPK', 'LPG', 'Mixed']

export default function BankLodgementPage() {
  const [lodgements, setLodgements] = useState<BankLodgement[]>([])
  const [filteredLodgements, setFilteredLodgements] = useState<BankLodgement[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLodgement, setSelectedLodgement] = useState<BankLodgement | null>(null)
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])

  // Load stations from localStorage
  useEffect(() => {
    const activeStations = getActiveStations()
    setStations(activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName })))
  }, [])

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    bankName: '',
    tellerNumber: '',
    productType: 'PMS' as 'PMS' | 'AGO' | 'DPK' | 'LPG' | 'Mixed',
    amountDeposited: '',
    expectedAmount: '',
    cashier: '',
    depositTime: '',
    remarks: ''
  })

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('bankLodgements')
    if (savedData) {
      setLodgements(JSON.parse(savedData))
    } else {
      // Sample data from Excel documents
      const sampleData: BankLodgement[] = [
        {
          id: '1',
          date: '2025-03-05',
          stationId: 'JABI',
          stationName: 'JABI Station',
          bankName: 'ZENITH BANK',
          tellerNumber: 'ZEN/JABI/001234',
          productType: 'PMS',
          amountDeposited: 3434470,
          expectedAmount: 3434470,
          variance: 0,
          variancePercentage: 0,
          cashier: 'John Adeyemi',
          depositTime: '10:30',
          reconciled: true,
          remarks: 'First deposit - Morning sales',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: '2025-03-05',
          stationId: 'JABI',
          stationName: 'JABI Station',
          bankName: 'FIRST BANK',
          tellerNumber: 'FBN/JABI/005678',
          productType: 'AGO',
          amountDeposited: 2850000,
          expectedAmount: 2850000,
          variance: 0,
          variancePercentage: 0,
          cashier: 'John Adeyemi',
          depositTime: '11:45',
          reconciled: true,
          remarks: 'Second deposit - AGO sales',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          date: '2025-03-05',
          stationId: 'JABI',
          stationName: 'JABI Station',
          bankName: 'ZENITH BANK',
          tellerNumber: 'ZEN/JABI/001235',
          productType: 'PMS',
          amountDeposited: 2057290,
          expectedAmount: 2057290,
          variance: 0,
          variancePercentage: 0,
          cashier: 'John Adeyemi',
          depositTime: '14:20',
          reconciled: true,
          remarks: 'Third deposit - Afternoon sales',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          date: '2025-03-05',
          stationId: 'JABI',
          stationName: 'JABI Station',
          bankName: 'STERLING BANK',
          tellerNumber: 'STB/JABI/009876',
          productType: 'Mixed',
          amountDeposited: 1000000,
          expectedAmount: 1050000,
          variance: -50000,
          variancePercentage: -4.76,
          cashier: 'John Adeyemi',
          depositTime: '16:00',
          reconciled: false,
          remarks: 'Fourth deposit - Cash shortfall detected',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          date: '2025-03-04',
          stationId: 'WUSE2',
          stationName: 'WUSE 2 Station',
          bankName: 'GTB',
          tellerNumber: 'GTB/WSE2/112233',
          productType: 'PMS',
          amountDeposited: 4250000,
          expectedAmount: 4250000,
          variance: 0,
          variancePercentage: 0,
          cashier: 'Mary Okafor',
          depositTime: '11:00',
          reconciled: true,
          remarks: 'Morning sales deposit',
          createdAt: new Date().toISOString()
        },
        {
          id: '6',
          date: '2025-03-04',
          stationId: 'WUSE2',
          stationName: 'WUSE 2 Station',
          bankName: 'ZENITH BANK',
          tellerNumber: 'ZEN/WSE2/445566',
          productType: 'AGO',
          amountDeposited: 1800000,
          expectedAmount: 1800000,
          variance: 0,
          variancePercentage: 0,
          cashier: 'Mary Okafor',
          depositTime: '15:30',
          reconciled: true,
          remarks: 'Afternoon sales deposit',
          createdAt: new Date().toISOString()
        }
      ]
      setLodgements(sampleData)
      localStorage.setItem('bankLodgements', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage whenever lodgements change
  useEffect(() => {
    if (lodgements.length > 0) {
      localStorage.setItem('bankLodgements', JSON.stringify(lodgements))
    }
  }, [lodgements])

  // Filter lodgements based on search
  useEffect(() => {
    const filtered = lodgements.filter(lodgement =>
      lodgement.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lodgement.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lodgement.tellerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lodgement.cashier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLodgements(filtered)
  }, [searchTerm, lodgements])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.stationId || !formData.bankName || !formData.tellerNumber ||
        !formData.amountDeposited || !formData.cashier) {
      alert('Please fill in all required fields!')
      return
    }

    const deposited = parseFloat(formData.amountDeposited)
    const expected = parseFloat(formData.expectedAmount) || deposited

    if (deposited <= 0) {
      alert('Amount deposited must be greater than zero!')
      return
    }

    // Check for duplicate teller number
    const tellerExists = lodgements.find(l =>
      l.tellerNumber.toLowerCase() === formData.tellerNumber.toLowerCase() &&
      l.id !== selectedLodgement?.id
    )

    if (tellerExists) {
      alert(`Teller number "${formData.tellerNumber}" already exists!\n\nEach bank deposit must have a unique teller number.`)
      return
    }

    // Calculate variance
    const variance = deposited - expected
    const variancePercentage = expected > 0 ? (variance / expected) * 100 : 0

    // Alert for variance
    if (Math.abs(variancePercentage) > 1) {
      const confirmSave = confirm(
        `⚠️ VARIANCE DETECTED!\n\n` +
        `Expected: ₦${expected.toLocaleString()}\n` +
        `Deposited: ₦${deposited.toLocaleString()}\n` +
        `Variance: ₦${Math.abs(variance).toLocaleString()} (${Math.abs(variancePercentage).toFixed(2)}%)\n\n` +
        `Do you want to proceed with this lodgement?`
      )

      if (!confirmSave) return
    }

    const station = stations.find(s => s.id === formData.stationId || s.stationCode === formData.stationId)

    const newLodgement: BankLodgement = {
      id: selectedLodgement?.id || Date.now().toString(),
      date: formData.date,
      stationId: formData.stationId,
      stationName: station?.name || '',
      bankName: formData.bankName,
      tellerNumber: formData.tellerNumber,
      productType: formData.productType,
      amountDeposited: deposited,
      expectedAmount: expected,
      variance: variance,
      variancePercentage: variancePercentage,
      cashier: formData.cashier,
      depositTime: formData.depositTime,
      reconciled: Math.abs(variance) < 100, // Auto-reconcile if variance < ₦100
      remarks: formData.remarks,
      createdAt: selectedLodgement?.createdAt || new Date().toISOString()
    }

    if (selectedLodgement) {
      setLodgements(lodgements.map(l => l.id === selectedLodgement.id ? newLodgement : l))
    } else {
      setLodgements([newLodgement, ...lodgements])
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      bankName: '',
      tellerNumber: '',
      productType: 'PMS',
      amountDeposited: '',
      expectedAmount: '',
      cashier: '',
      depositTime: '',
      remarks: ''
    })
    setSelectedLodgement(null)
    setShowModal(false)
  }

  const handleEdit = (lodgement: BankLodgement) => {
    setSelectedLodgement(lodgement)
    setFormData({
      date: lodgement.date,
      stationId: lodgement.stationId,
      bankName: lodgement.bankName,
      tellerNumber: lodgement.tellerNumber,
      productType: lodgement.productType,
      amountDeposited: lodgement.amountDeposited.toString(),
      expectedAmount: lodgement.expectedAmount.toString(),
      cashier: lodgement.cashier,
      depositTime: lodgement.depositTime,
      remarks: lodgement.remarks
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lodgement record?')) {
      setLodgements(lodgements.filter(l => l.id !== id))
    }
  }

  const toggleReconciled = (id: string) => {
    setLodgements(lodgements.map(l =>
      l.id === id ? { ...l, reconciled: !l.reconciled } : l
    ))
  }

  // Calculate summary statistics
  const totalDeposited = filteredLodgements.reduce((sum, l) => sum + l.amountDeposited, 0)
  const totalExpected = filteredLodgements.reduce((sum, l) => sum + l.expectedAmount, 0)
  const totalVariance = totalDeposited - totalExpected
  const unreconciledCount = filteredLodgements.filter(l => !l.reconciled).length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Lodgement Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Track daily bank deposits with teller numbers</p>
        </div>
        <Button onClick={() => {
          setSelectedLodgement(null)
          setFormData({
            date: new Date().toISOString().split('T')[0],
            stationId: '',
            bankName: '',
            tellerNumber: '',
            productType: 'PMS',
            amountDeposited: '',
            expectedAmount: '',
            cashier: '',
            depositTime: '',
            remarks: ''
          })
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Lodgement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Deposited</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalDeposited.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expected Amount</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalExpected.toLocaleString()}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Variance</p>
              <p className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{totalVariance.toLocaleString()}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${totalVariance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unreconciled</p>
              <p className="text-2xl font-bold text-orange-600">{unreconciledCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by station, bank, teller number, or cashier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Lodgements Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Bank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Teller No.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Amount Deposited</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Expected</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cashier</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLodgements.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-gray-500">
                    No lodgement records found
                  </td>
                </tr>
              ) : (
                filteredLodgements.map((lodgement) => (
                  <tr key={lodgement.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{lodgement.date}</td>
                    <td className="py-3 px-4 text-sm font-medium">{lodgement.stationName}</td>
                    <td className="py-3 px-4 text-sm">{lodgement.bankName}</td>
                    <td className="py-3 px-4 text-sm font-mono text-blue-600">{lodgement.tellerNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${lodgement.productType === 'PMS' ? 'bg-green-100 text-green-800' :
                          lodgement.productType === 'AGO' ? 'bg-yellow-100 text-yellow-800' :
                          lodgement.productType === 'DPK' ? 'bg-blue-100 text-blue-800' :
                          lodgement.productType === 'LPG' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {lodgement.productType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      ₦{lodgement.amountDeposited.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      ₦{lodgement.expectedAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={lodgement.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {lodgement.variance >= 0 ? '+' : ''}₦{lodgement.variance.toLocaleString()}
                        {Math.abs(lodgement.variancePercentage) > 0.01 && (
                          <span className="text-xs ml-1">
                            ({lodgement.variancePercentage.toFixed(2)}%)
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{lodgement.depositTime || '-'}</td>
                    <td className="py-3 px-4 text-sm">{lodgement.cashier}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleReconciled(lodgement.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer
                          ${lodgement.reconciled ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                      >
                        {lodgement.reconciled ? 'Reconciled' : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(lodgement)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(lodgement.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedLodgement ? 'Edit Lodgement' : 'New Bank Lodgement'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Station *</label>
                    <select
                      value={formData.stationId}
                      onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Station</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.stationName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name *</label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Bank</option>
                      {BANKS.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Teller Number *</label>
                    <Input
                      type="text"
                      value={formData.tellerNumber}
                      onChange={(e) => setFormData({ ...formData, tellerNumber: e.target.value })}
                      placeholder="e.g., ZEN/JABI/001234"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Product Type</label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {PRODUCT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Deposit Time</label>
                    <Input
                      type="time"
                      value={formData.depositTime}
                      onChange={(e) => setFormData({ ...formData, depositTime: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Amount Deposited (₦) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amountDeposited}
                      onChange={(e) => setFormData({ ...formData, amountDeposited: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Expected Amount (₦)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.expectedAmount}
                      onChange={(e) => setFormData({ ...formData, expectedAmount: e.target.value })}
                      placeholder="Leave blank if same as deposited"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Cashier Name *</label>
                    <Input
                      type="text"
                      value={formData.cashier}
                      onChange={(e) => setFormData({ ...formData, cashier: e.target.value })}
                      placeholder="Enter cashier name"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Remarks</label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                {/* Variance Preview */}
                {formData.amountDeposited && formData.expectedAmount && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Variance Preview:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {(() => {
                        const deposited = parseFloat(formData.amountDeposited)
                        const expected = parseFloat(formData.expectedAmount)
                        const variance = deposited - expected
                        const variancePercentage = expected > 0 ? (variance / expected) * 100 : 0

                        return (
                          <>
                            <div>
                              <span className="text-gray-600">Deposited:</span>
                              <span className="ml-2 font-medium">₦{deposited.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Expected:</span>
                              <span className="ml-2 font-medium">₦{expected.toLocaleString()}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">Variance:</span>
                              <span className={`ml-2 font-bold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {variance >= 0 ? '+' : ''}₦{variance.toLocaleString()} ({variancePercentage.toFixed(2)}%)
                              </span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {selectedLodgement ? 'Update Lodgement' : 'Save Lodgement'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedLodgement(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
