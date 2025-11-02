'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Truck, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getActiveStations } from '@/lib/utils/stationHelpers'

interface ProductDelivery {
  id: string
  date: string
  waybillNumber: string
  loadingDate: string
  dischargeDate: string
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG'
  loadingDepot: string
  dischargeStation: string
  truckNumber: string
  driverName: string
  driverPhone: string
  loadingQuantity: number // Litres at depot
  dischargeQuantity: number // Litres at station
  loadingTemperature: number // Celsius
  dischargeTemperature: number // Celsius
  transitLoss: number // Calculated: Loading - Discharge
  transitLossPercentage: number
  acceptableLoss: boolean // True if loss is 0-2%
  status: 'normal' | 'warning' | 'critical'
  remarks: string
  receivedBy: string
  createdAt: string
}

const DEPOTS = [
  'NNPC Suleja Depot',
  'NNPC Ore Depot',
  'MRS Apapa Depot',
  'Conoil Depot',
  'Total Depot',
  'Oando Depot'
]

const PRODUCT_TYPES = ['PMS', 'AGO', 'DPK', 'LPG']

export default function ProductDeliveryPage() {
  const [deliveries, setDeliveries] = useState<ProductDelivery[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<ProductDelivery[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState<ProductDelivery | null>(null)
  const [stations, setStations] = useState<Array<{ id: string; stationCode: string; stationName: string }>>([])

  // Load stations from localStorage
  useEffect(() => {
    const activeStations = getActiveStations()
    setStations(activeStations.map(s => ({ id: s.id, stationCode: s.stationCode, stationName: s.stationName })))
  }, [])

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    waybillNumber: '',
    loadingDate: new Date().toISOString().split('T')[0],
    dischargeDate: new Date().toISOString().split('T')[0],
    productType: 'PMS' as 'PMS' | 'AGO' | 'DPK' | 'LPG',
    loadingDepot: '',
    dischargeStation: '',
    truckNumber: '',
    driverName: '',
    driverPhone: '',
    loadingQuantity: '',
    dischargeQuantity: '',
    loadingTemperature: '',
    dischargeTemperature: '',
    receivedBy: '',
    remarks: ''
  })

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('productDeliveries')
    if (savedData) {
      setDeliveries(JSON.parse(savedData))
    } else {
      // Sample data based on Excel documents
      const sampleData: ProductDelivery[] = [
        {
          id: '1',
          date: '2025-03-04',
          waybillNumber: 'WB-2025-001234',
          loadingDate: '2025-03-04',
          dischargeDate: '2025-03-04',
          productType: 'PMS',
          loadingDepot: 'NNPC Suleja Depot',
          dischargeStation: 'JABI Station',
          truckNumber: 'ABC-123-XY',
          driverName: 'Ibrahim Mohammed',
          driverPhone: '08012345678',
          loadingQuantity: 45000, // 45,000 litres loaded
          dischargeQuantity: 44550, // 44,550 litres discharged
          loadingTemperature: 28,
          dischargeTemperature: 30,
          transitLoss: 450, // 450 litres lost
          transitLossPercentage: 1.0, // 1% loss - acceptable
          acceptableLoss: true,
          status: 'normal',
          remarks: 'Normal delivery - transit loss within acceptable range',
          receivedBy: 'John Adeyemi',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: '2025-03-04',
          waybillNumber: 'WB-2025-001235',
          loadingDate: '2025-03-04',
          dischargeDate: '2025-03-04',
          productType: 'AGO',
          loadingDepot: 'MRS Apapa Depot',
          dischargeStation: 'WUSE 2 Station',
          truckNumber: 'DEF-456-YZ',
          driverName: 'Musa Usman',
          driverPhone: '08023456789',
          loadingQuantity: 33000,
          dischargeQuantity: 32670,
          loadingTemperature: 27,
          dischargeTemperature: 29,
          transitLoss: 330,
          transitLossPercentage: 1.0,
          acceptableLoss: true,
          status: 'normal',
          remarks: '1% transit loss - acceptable',
          receivedBy: 'Mary Okafor',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          date: '2025-03-03',
          waybillNumber: 'WB-2025-001220',
          loadingDate: '2025-03-03',
          dischargeDate: '2025-03-03',
          productType: 'PMS',
          loadingDepot: 'Conoil Depot',
          dischargeStation: 'WUYE Station',
          truckNumber: 'GHI-789-ZA',
          driverName: 'Ahmed Bello',
          driverPhone: '08034567890',
          loadingQuantity: 33000,
          dischargeQuantity: 32340,
          loadingTemperature: 29,
          dischargeTemperature: 31,
          transitLoss: 660,
          transitLossPercentage: 2.0,
          acceptableLoss: true,
          status: 'warning',
          remarks: '2% transit loss - at acceptable threshold',
          receivedBy: 'Peter Obi',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          date: '2025-03-02',
          waybillNumber: 'WB-2025-001200',
          loadingDate: '2025-03-02',
          dischargeDate: '2025-03-02',
          productType: 'PMS',
          loadingDepot: 'Total Depot',
          dischargeStation: 'JABI Station',
          truckNumber: 'JKL-012-AB',
          driverName: 'Tunde Adewale',
          driverPhone: '08045678901',
          loadingQuantity: 45000,
          dischargeQuantity: 43650,
          loadingTemperature: 30,
          dischargeTemperature: 32,
          transitLoss: 1350,
          transitLossPercentage: 3.0,
          acceptableLoss: false,
          status: 'critical',
          remarks: 'EXCESSIVE LOSS! 3% transit loss - investigation required',
          receivedBy: 'John Adeyemi',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          date: '2025-03-01',
          waybillNumber: 'WB-2025-001180',
          loadingDate: '2025-03-01',
          dischargeDate: '2025-03-01',
          productType: 'DPK',
          loadingDepot: 'NNPC Suleja Depot',
          dischargeStation: 'WUSE 2 Station',
          truckNumber: 'MNO-345-BC',
          driverName: 'Yusuf Garba',
          driverPhone: '08056789012',
          loadingQuantity: 30000,
          dischargeQuantity: 29850,
          loadingTemperature: 26,
          dischargeTemperature: 28,
          transitLoss: 150,
          transitLossPercentage: 0.5,
          acceptableLoss: true,
          status: 'normal',
          remarks: 'Excellent delivery - minimal transit loss',
          receivedBy: 'Mary Okafor',
          createdAt: new Date().toISOString()
        }
      ]
      setDeliveries(sampleData)
      localStorage.setItem('productDeliveries', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage whenever deliveries change
  useEffect(() => {
    if (deliveries.length > 0) {
      localStorage.setItem('productDeliveries', JSON.stringify(deliveries))
    }
  }, [deliveries])

  // Filter deliveries based on search
  useEffect(() => {
    const filtered = deliveries.filter(delivery =>
      delivery.waybillNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.dischargeStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.loadingDepot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDeliveries(filtered)
  }, [searchTerm, deliveries])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.waybillNumber || !formData.loadingDepot || !formData.dischargeStation ||
        !formData.truckNumber || !formData.driverName || !formData.loadingQuantity ||
        !formData.dischargeQuantity) {
      alert('Please fill in all required fields!')
      return
    }

    const loadingQty = parseFloat(formData.loadingQuantity)
    const dischargeQty = parseFloat(formData.dischargeQuantity)

    if (loadingQty <= 0 || dischargeQty <= 0) {
      alert('Quantities must be greater than zero!')
      return
    }

    if (dischargeQty > loadingQty) {
      alert('Discharge quantity cannot be greater than loading quantity!\n\nThis would indicate product gain, which is not possible.')
      return
    }

    // Check for duplicate waybill number
    const waybillExists = deliveries.find(d =>
      d.waybillNumber.toLowerCase() === formData.waybillNumber.toLowerCase() &&
      d.id !== selectedDelivery?.id
    )

    if (waybillExists) {
      alert(`Waybill number "${formData.waybillNumber}" already exists!\n\nEach delivery must have a unique waybill number.`)
      return
    }

    // Calculate transit loss
    const transitLoss = loadingQty - dischargeQty
    const transitLossPercentage = (transitLoss / loadingQty) * 100
    const acceptableLoss = transitLossPercentage >= 0 && transitLossPercentage <= 2

    // Determine status
    let status: 'normal' | 'warning' | 'critical' = 'normal'
    if (transitLossPercentage > 2) {
      status = 'critical'
    } else if (transitLossPercentage >= 1.5) {
      status = 'warning'
    }

    // Alert for excessive loss
    if (!acceptableLoss) {
      const confirmSave = confirm(
        `⚠️ EXCESSIVE TRANSIT LOSS DETECTED!\n\n` +
        `Waybill: ${formData.waybillNumber}\n` +
        `Loading: ${loadingQty.toLocaleString()} litres\n` +
        `Discharge: ${dischargeQty.toLocaleString()} litres\n` +
        `Transit Loss: ${transitLoss.toLocaleString()} litres (${transitLossPercentage.toFixed(2)}%)\n\n` +
        `Acceptable range: 0-2%\n` +
        `Your loss: ${transitLossPercentage.toFixed(2)}%\n\n` +
        `This requires investigation! Do you want to proceed?`
      )

      if (!confirmSave) return
    }

    const station = stations.find(s => s.stationName === formData.dischargeStation || s.id === formData.dischargeStation || s.stationCode === formData.dischargeStation)

    const newDelivery: ProductDelivery = {
      id: selectedDelivery?.id || Date.now().toString(),
      date: formData.date,
      waybillNumber: formData.waybillNumber,
      loadingDate: formData.loadingDate,
      dischargeDate: formData.dischargeDate,
      productType: formData.productType,
      loadingDepot: formData.loadingDepot,
      dischargeStation: station?.name || formData.dischargeStation,
      truckNumber: formData.truckNumber,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      loadingQuantity: loadingQty,
      dischargeQuantity: dischargeQty,
      loadingTemperature: parseFloat(formData.loadingTemperature) || 0,
      dischargeTemperature: parseFloat(formData.dischargeTemperature) || 0,
      transitLoss: transitLoss,
      transitLossPercentage: transitLossPercentage,
      acceptableLoss: acceptableLoss,
      status: status,
      remarks: formData.remarks,
      receivedBy: formData.receivedBy,
      createdAt: selectedDelivery?.createdAt || new Date().toISOString()
    }

    if (selectedDelivery) {
      setDeliveries(deliveries.map(d => d.id === selectedDelivery.id ? newDelivery : d))
    } else {
      setDeliveries([newDelivery, ...deliveries])
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      waybillNumber: '',
      loadingDate: new Date().toISOString().split('T')[0],
      dischargeDate: new Date().toISOString().split('T')[0],
      productType: 'PMS',
      loadingDepot: '',
      dischargeStation: '',
      truckNumber: '',
      driverName: '',
      driverPhone: '',
      loadingQuantity: '',
      dischargeQuantity: '',
      loadingTemperature: '',
      dischargeTemperature: '',
      receivedBy: '',
      remarks: ''
    })
    setSelectedDelivery(null)
    setShowModal(false)
  }

  const handleEdit = (delivery: ProductDelivery) => {
    setSelectedDelivery(delivery)
    setFormData({
      date: delivery.date,
      waybillNumber: delivery.waybillNumber,
      loadingDate: delivery.loadingDate,
      dischargeDate: delivery.dischargeDate,
      productType: delivery.productType,
      loadingDepot: delivery.loadingDepot,
      dischargeStation: delivery.dischargeStation,
      truckNumber: delivery.truckNumber,
      driverName: delivery.driverName,
      driverPhone: delivery.driverPhone,
      loadingQuantity: delivery.loadingQuantity.toString(),
      dischargeQuantity: delivery.dischargeQuantity.toString(),
      loadingTemperature: delivery.loadingTemperature.toString(),
      dischargeTemperature: delivery.dischargeTemperature.toString(),
      receivedBy: delivery.receivedBy,
      remarks: delivery.remarks
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery record?')) {
      setDeliveries(deliveries.filter(d => d.id !== id))
    }
  }

  // Calculate summary statistics
  const totalLoaded = filteredDeliveries.reduce((sum, d) => sum + d.loadingQuantity, 0)
  const totalDischarged = filteredDeliveries.reduce((sum, d) => sum + d.dischargeQuantity, 0)
  const totalLoss = totalLoaded - totalDischarged
  const avgLossPercentage = totalLoaded > 0 ? (totalLoss / totalLoaded) * 100 : 0
  const criticalCount = filteredDeliveries.filter(d => d.status === 'critical').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Delivery Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Track deliveries with waybill and transit loss monitoring</p>
        </div>
        <Button onClick={() => {
          setSelectedDelivery(null)
          setFormData({
            date: new Date().toISOString().split('T')[0],
            waybillNumber: '',
            loadingDate: new Date().toISOString().split('T')[0],
            dischargeDate: new Date().toISOString().split('T')[0],
            productType: 'PMS',
            loadingDepot: '',
            dischargeStation: '',
            truckNumber: '',
            driverName: '',
            driverPhone: '',
            loadingQuantity: '',
            dischargeQuantity: '',
            loadingTemperature: '',
            dischargeTemperature: '',
            receivedBy: '',
            remarks: ''
          })
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Delivery
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Loaded</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoaded.toLocaleString()}L</p>
            </div>
            <Truck className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Discharged</p>
              <p className="text-2xl font-bold text-gray-900">{totalDischarged.toLocaleString()}L</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transit Loss</p>
              <p className={`text-2xl font-bold ${avgLossPercentage <= 2 ? 'text-green-600' : 'text-red-600'}`}>
                {totalLoss.toLocaleString()}L
              </p>
              <p className={`text-xs ${avgLossPercentage <= 2 ? 'text-green-600' : 'text-red-600'}`}>
                {avgLossPercentage.toFixed(2)}% avg
              </p>
            </div>
            <TrendingDown className={`w-8 h-8 ${avgLossPercentage <= 2 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Excessive Loss</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-xs text-gray-500">Deliveries &gt;2% loss</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by waybill, station, depot, truck, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Waybill No.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">From</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">To</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Loaded (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Discharged (L)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Transit Loss</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Truck/Driver</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-gray-500">
                    No delivery records found
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-blue-600">{delivery.waybillNumber}</td>
                    <td className="py-3 px-4 text-sm">{delivery.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${delivery.productType === 'PMS' ? 'bg-green-100 text-green-800' :
                          delivery.productType === 'AGO' ? 'bg-yellow-100 text-yellow-800' :
                          delivery.productType === 'DPK' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'}`}>
                        {delivery.productType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{delivery.loadingDepot}</td>
                    <td className="py-3 px-4 text-sm font-medium">{delivery.dischargeStation}</td>
                    <td className="py-3 px-4 text-sm text-right">{delivery.loadingQuantity.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">{delivery.dischargeQuantity.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className={delivery.acceptableLoss ? 'text-green-600' : 'text-red-600'}>
                        {delivery.transitLoss.toLocaleString()}L
                        <div className="text-xs">
                          ({delivery.transitLossPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div>{delivery.truckNumber}</div>
                      <div className="text-xs text-gray-500">{delivery.driverName}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${delivery.status === 'normal' ? 'bg-green-100 text-green-800' :
                          delivery.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}>
                        {delivery.status === 'normal' ? 'Normal' :
                         delivery.status === 'warning' ? 'Warning' :
                         'Critical'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(delivery)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(delivery.id)}
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
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedDelivery ? 'Edit Delivery' : 'New Product Delivery'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Waybill & Dates */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Waybill Number *</label>
                    <Input
                      type="text"
                      value={formData.waybillNumber}
                      onChange={(e) => setFormData({ ...formData, waybillNumber: e.target.value })}
                      placeholder="WB-2025-001234"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Loading Date *</label>
                    <Input
                      type="date"
                      value={formData.loadingDate}
                      onChange={(e) => setFormData({ ...formData, loadingDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Discharge Date *</label>
                    <Input
                      type="date"
                      value={formData.dischargeDate}
                      onChange={(e) => setFormData({ ...formData, dischargeDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Product & Locations */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Type *</label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {PRODUCT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Loading Depot *</label>
                    <select
                      value={formData.loadingDepot}
                      onChange={(e) => setFormData({ ...formData, loadingDepot: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Depot</option>
                      {DEPOTS.map(depot => (
                        <option key={depot} value={depot}>{depot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Discharge Station *</label>
                    <select
                      value={formData.dischargeStation}
                      onChange={(e) => setFormData({ ...formData, dischargeStation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Station</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.stationName}>{station.stationName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Truck & Driver */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Truck Number *</label>
                    <Input
                      type="text"
                      value={formData.truckNumber}
                      onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                      placeholder="ABC-123-XY"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Driver Name *</label>
                    <Input
                      type="text"
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      placeholder="Enter driver name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Driver Phone</label>
                    <Input
                      type="tel"
                      value={formData.driverPhone}
                      onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                      placeholder="08012345678"
                    />
                  </div>
                </div>

                {/* Quantities & Temperatures */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Loading Qty (L) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.loadingQuantity}
                      onChange={(e) => setFormData({ ...formData, loadingQuantity: e.target.value })}
                      placeholder="45000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Discharge Qty (L) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.dischargeQuantity}
                      onChange={(e) => setFormData({ ...formData, dischargeQuantity: e.target.value })}
                      placeholder="44550"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Loading Temp (°C)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.loadingTemperature}
                      onChange={(e) => setFormData({ ...formData, loadingTemperature: e.target.value })}
                      placeholder="28"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Discharge Temp (°C)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.dischargeTemperature}
                      onChange={(e) => setFormData({ ...formData, dischargeTemperature: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                </div>

                {/* Received By & Remarks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Received By</label>
                    <Input
                      type="text"
                      value={formData.receivedBy}
                      onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                      placeholder="Staff name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Remarks</label>
                    <Input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                {/* Transit Loss Preview */}
                {formData.loadingQuantity && formData.dischargeQuantity && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Transit Loss Preview:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {(() => {
                        const loaded = parseFloat(formData.loadingQuantity)
                        const discharged = parseFloat(formData.dischargeQuantity)
                        const loss = loaded - discharged
                        const lossPercentage = (loss / loaded) * 100
                        const acceptable = lossPercentage >= 0 && lossPercentage <= 2

                        return (
                          <>
                            <div>
                              <span className="text-gray-600">Loaded:</span>
                              <span className="ml-2 font-medium">{loaded.toLocaleString()} L</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Discharged:</span>
                              <span className="ml-2 font-medium">{discharged.toLocaleString()} L</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">Transit Loss:</span>
                              <span className={`ml-2 font-bold ${acceptable ? 'text-green-600' : 'text-red-600'}`}>
                                {loss.toLocaleString()} L ({lossPercentage.toFixed(2)}%)
                              </span>
                              <span className={`ml-2 text-xs ${acceptable ? 'text-green-600' : 'text-red-600'}`}>
                                {acceptable ? '✓ Acceptable (0-2%)' : '⚠ EXCESSIVE! (>2%)'}
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
                    {selectedDelivery ? 'Update Delivery' : 'Save Delivery'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedDelivery(null)
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
