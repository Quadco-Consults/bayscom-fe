'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import {
  Truck,
  Droplet,
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  ArrowRight,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import { tankCalc, tankFormat } from '@/utils/tank-calcs'
import type { ChartEntry } from '@/utils/tank-calcs'

interface CompartmentReading {
  id: string
  label: string
  dipCm: string
  litres: number
}

interface TankDipReading {
  dipCm: string
  volumeLitres: number
  waterDipCm: string
  waterLitres: number
  netFuelLitres: number
  temperatureC: string
  readBy: string
  timestamp: string
}

export default function NewDischargePage() {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Truck Arrival Details
  const [waybillNo, setWaybillNo] = useState('')
  const [waybillDate, setWaybillDate] = useState(new Date().toISOString().split('T')[0])
  const [supplier, setSupplier] = useState('')
  const [transporter, setTransporter] = useState('')
  const [truckReg, setTruckReg] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [product, setProduct] = useState<'PMS' | 'AGO' | 'DPK'>('PMS')
  const [destinationTank, setDestinationTank] = useState('PMS-T1')
  const [waybillQty, setWaybillQty] = useState('')

  // Step 2: Compartment Readings
  const [compartments, setCompartments] = useState<CompartmentReading[]>([
    { id: '1', label: 'C1', dipCm: '', litres: 0 },
    { id: '2', label: 'C2', dipCm: '', litres: 0 },
    { id: '3', label: 'C3', dipCm: '', litres: 0 },
    { id: '4', label: 'C4', dipCm: '', litres: 0 },
  ])

  // Step 3: Pre-discharge Tank Dip
  const [preDischarge, setPreDischarge] = useState<TankDipReading>({
    dipCm: '',
    volumeLitres: 0,
    waterDipCm: '0',
    waterLitres: 0,
    netFuelLitres: 0,
    temperatureC: '',
    readBy: '',
    timestamp: '',
  })

  // Step 4: Discharge timing
  const [dischargeStartTime, setDischargeStartTime] = useState('')

  // Step 5: Post-discharge Tank Dip
  const [postDischarge, setPostDischarge] = useState<TankDipReading>({
    dipCm: '',
    volumeLitres: 0,
    waterDipCm: '0',
    waterLitres: 0,
    netFuelLitres: 0,
    temperatureC: '',
    readBy: '',
    timestamp: '',
  })

  // Mock calibration charts (in production, fetch from config)
  const compartmentChart: ChartEntry[] = [
    { dipCm: 0, litres: 0 },
    { dipCm: 20, litres: 1200 },
    { dipCm: 40, litres: 2500 },
    { dipCm: 60, litres: 3900 },
    { dipCm: 80, litres: 5400 },
    { dipCm: 100, litres: 7000 },
    { dipCm: 120, litres: 8700 },
    { dipCm: 140, litres: 10500 },
  ]

  const tankChart: ChartEntry[] = [
    { dipCm: 0, litres: 0 },
    { dipCm: 50, litres: 5500 },
    { dipCm: 100, litres: 12000 },
    { dipCm: 150, litres: 19500 },
    { dipCm: 200, litres: 28000 },
    { dipCm: 250, litres: 37500 },
    { dipCm: 280, litres: 45000 },
  ]

  // Compartment calculations
  const updateCompartment = (id: string, dipCm: string) => {
    setCompartments(
      compartments.map((c) => {
        if (c.id !== id) return c
        const litres = tankCalc.chartLookup(compartmentChart, parseFloat(dipCm) || 0) ?? 0
        return { ...c, dipCm, litres }
      })
    )
  }

  const addCompartment = () => {
    const nextNum = compartments.length + 1
    setCompartments([...compartments, { id: String(nextNum), label: `C${nextNum}`, dipCm: '', litres: 0 }])
  }

  const removeCompartment = (id: string) => {
    if (compartments.length > 1) {
      setCompartments(compartments.filter((c) => c.id !== id))
    }
  }

  const truckTotalLitres = compartments.reduce((sum, c) => sum + c.litres, 0)

  // Tank dip calculations
  const updateTankDip = (
    dipType: 'pre' | 'post',
    field: keyof TankDipReading,
    value: string
  ) => {
    const setter = dipType === 'pre' ? setPreDischarge : setPostDischarge
    const current = dipType === 'pre' ? preDischarge : postDischarge

    const updated = { ...current, [field]: value }

    if (field === 'dipCm') {
      const dipCm = parseFloat(value) || 0
      updated.volumeLitres = tankCalc.chartLookup(tankChart, dipCm) ?? 0
    }

    if (field === 'waterDipCm') {
      const waterCm = parseFloat(value) || 0
      updated.waterLitres = tankCalc.chartLookup(tankChart, waterCm) ?? 0
    }

    updated.netFuelLitres = Math.max(0, updated.volumeLitres - updated.waterLitres)

    setter(updated)
  }

  // Variance calculations
  const tankReceived = postDischarge.netFuelLitres - preDischarge.netFuelLitres
  const grossShortage = tankCalc.grossShortage(truckTotalLitres, tankReceived)
  const allowedLoss = tankCalc.allowedTransitLoss(truckTotalLitres, 0.003) // 0.3%
  const netShortage = tankCalc.netShortage(grossShortage, allowedLoss)
  const varianceStatus = tankCalc.varianceStatus(grossShortage, allowedLoss)

  // Pre-discharge warning
  const waybillVariance = Math.abs(truckTotalLitres - parseFloat(waybillQty || '0'))
  const showPreDischargeWarning = waybillVariance > 500 // 500L threshold

  // Validation
  const canProceedStep1 =
    waybillNo && supplier && truckReg && driverName && destinationTank && waybillQty
  const canProceedStep2 = truckTotalLitres > 0
  const canProceedStep3 = preDischarge.dipCm && preDischarge.readBy
  const canProceedStep4 = dischargeStartTime
  const canProceedStep5 = postDischarge.dipCm && postDischarge.readBy

  const handleNext = () => {
    if (currentStep === 3) {
      // Partial save after Step 3
      console.log('Partial save - Status: PENDING_POST_DIP', {
        waybillNo,
        truckTotalLitres,
        preDischarge,
      })
    }
    setCurrentStep((prev) => Math.min(6, prev + 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleSaveDischarge = () => {
    const dischargeData = {
      waybillNo,
      waybillDate,
      supplier,
      transporter,
      truckReg,
      driverName,
      driverPhone,
      product,
      destinationTank,
      waybillQty: parseFloat(waybillQty),
      compartments,
      truckTotalLitres,
      preDischarge,
      dischargeStartTime,
      postDischarge,
      tankReceived,
      grossShortage,
      allowedLoss,
      netShortage,
      varianceStatus,
      createdAt: new Date().toISOString(),
      status: 'COMPLETED',
    }

    console.log('Saving discharge:', dischargeData)
    alert('Discharge saved successfully! Redirecting to detail view...')
    // In production: POST to API, then navigate to /tanks/discharge/[id]
  }

  const getProductColor = (prod: 'PMS' | 'AGO' | 'DPK') => {
    switch (prod) {
      case 'PMS':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' }
      case 'AGO':
        return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' }
      case 'DPK':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
    }
  }

  const productColor = getProductColor(product)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Discharge Entry</h1>
          <p className="text-sm text-gray-500 mt-1">
            6-step truck discharge process with variance tracking
          </p>
        </div>
        {currentStep === 6 && (
          <button
            onClick={handleSaveDischarge}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Finalize Discharge
          </button>
        )}
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Truck Arrival' },
            { num: 2, label: 'Compartments' },
            { num: 3, label: 'Pre-Discharge' },
            { num: 4, label: 'Discharge' },
            { num: 5, label: 'Post-Discharge' },
            { num: 6, label: 'Variance' },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep === step.num
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.num
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle className="h-5 w-5" /> : step.num}
                </div>
                <p
                  className={`text-xs mt-2 text-center ${
                    currentStep === step.num
                      ? 'text-blue-900 font-semibold'
                      : currentStep > step.num
                      ? 'text-green-700 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {idx < 5 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-colors ${
                    currentStep > step.num ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* STEP 1: Truck Arrival Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Step 1: Truck Arrival Details</h2>
                <p className="text-sm text-gray-500">Record waybill and truck information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waybill No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={waybillNo}
                  onChange={(e) => setWaybillNo(e.target.value)}
                  placeholder="WB-2026-001234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waybill Date</label>
                <input
                  type="date"
                  value={waybillDate}
                  onChange={(e) => setWaybillDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="NIPCO PLC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transporter</label>
                <input
                  type="text"
                  value={transporter}
                  onChange={(e) => setTransporter(e.target.value)}
                  placeholder="ABC Transport Ltd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Truck Registration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={truckReg}
                  onChange={(e) => setTruckReg(e.target.value)}
                  placeholder="KNO-123-XY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Aliyu Ibrahim"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Phone</label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value as 'PMS' | 'AGO' | 'DPK')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PMS">PMS (Petrol)</option>
                  <option value="AGO">AGO (Diesel)</option>
                  <option value="DPK">DPK (Kerosene)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Tank <span className="text-red-500">*</span>
                </label>
                <select
                  value={destinationTank}
                  onChange={(e) => setDestinationTank(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PMS-T1">PMS Tank 1 (45,000L)</option>
                  <option value="PMS-T2">PMS Tank 2 (45,000L)</option>
                  <option value="AGO-T1">AGO Tank 1 (33,000L)</option>
                  <option value="DPK-T1">DPK Tank 1 (20,000L)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waybill Quantity (L) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={waybillQty}
                  onChange={(e) => setWaybillQty(e.target.value)}
                  placeholder="33000"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Compartment Readings */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Step 2: Truck Compartment Dip Readings
                </h2>
                <p className="text-sm text-gray-500">Measure each compartment using calibration chart</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Nigerian Dip Reading Method</h3>
                  <p className="text-sm text-blue-800">
                    Lower the dip rod to the compartment floor, hold for 3-5 seconds, then pull straight up.
                    <strong> Larger cm = more fuel</strong> (bottom-up reading).
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Compartment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Dip Reading (cm)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Volume from Chart (L)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {compartments.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                          {comp.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={comp.dipCm}
                          onChange={(e) => updateCompartment(comp.id, e.target.value)}
                          step="0.1"
                          placeholder="0.0"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {tankFormat.litres(comp.litres)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeCompartment(comp.id)}
                          disabled={compartments.length === 1}
                          className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">Total Truck Quantity</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3">
                      <span className="text-xl font-bold text-blue-600">
                        {tankFormat.litres(truckTotalLitres)}
                      </span>
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <button
              onClick={addCompartment}
              disabled={compartments.length >= 6}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              + Add Compartment
            </button>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-900 font-medium">Waybill Quantity</p>
                  <p className="text-lg font-bold text-amber-700">{tankFormat.litres(parseFloat(waybillQty || '0'))}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-900 font-medium">Truck Chart Total</p>
                  <p className="text-lg font-bold text-amber-700">{tankFormat.litres(truckTotalLitres)}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-900 font-medium">Difference</p>
                  <p
                    className={`text-lg font-bold ${
                      waybillVariance > 500 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {tankFormat.litres(waybillVariance)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pre-Discharge Tank Dip */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Step 3: Pre-Discharge Tank Dip</h2>
                <p className="text-sm text-gray-500">Measure tank level BEFORE discharge begins</p>
              </div>
            </div>

            {showPreDischargeWarning && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-red-900 mb-1">Pre-Discharge Warning</h3>
                  <p className="text-sm text-red-800 mb-2">
                    Truck chart total ({tankFormat.litres(truckTotalLitres)}) differs from waybill quantity (
                    {tankFormat.litres(parseFloat(waybillQty))}) by {tankFormat.litres(waybillVariance)}.
                  </p>
                  <p className="text-xs text-red-700">
                    Variance exceeds 500L threshold. Verify compartment readings before proceeding with discharge.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tank: <span className={`ml-2 px-2 py-1 text-xs font-medium border rounded ${productColor.bg} ${productColor.text} ${productColor.border}`}>{destinationTank}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tank Dip Reading (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={preDischarge.dipCm}
                  onChange={(e) => updateTankDip('pre', 'dipCm', e.target.value)}
                  step="0.1"
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume from Chart (L)</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold">
                  {tankFormat.litres(preDischarge.volumeLitres)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Dip (cm)</label>
                <input
                  type="number"
                  value={preDischarge.waterDipCm}
                  onChange={(e) => updateTankDip('pre', 'waterDipCm', e.target.value)}
                  step="0.1"
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  value={preDischarge.temperatureC}
                  onChange={(e) => updateTankDip('pre', 'temperatureC', e.target.value)}
                  step="0.1"
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={preDischarge.readBy}
                  onChange={(e) => updateTankDip('pre', 'readBy', e.target.value)}
                  placeholder="Officer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Gross Volume</p>
                  <p className="text-xl font-bold text-blue-900">{tankFormat.litres(preDischarge.volumeLitres)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Less: Water Volume</p>
                  <p className="text-xl font-bold text-amber-600">
                    {preDischarge.waterLitres > 0 ? `−${tankFormat.litres(preDischarge.waterLitres)}` : '—'}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-800 mb-1">Net Fuel (Pre-Discharge)</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {tankFormat.litres(preDischarge.netFuelLitres)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Discharge Begins */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Step 4: Discharge Begins</h2>
                <p className="text-sm text-gray-500">Record start time and begin fuel transfer</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Pre-Discharge Check Complete</h3>
                  <p className="text-sm text-green-700">
                    Tank {destinationTank} measured at {tankFormat.litres(preDischarge.netFuelLitres)} (net fuel)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discharge Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={dischargeStartTime}
                    onChange={(e) => setDischargeStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Discharge Safety Checklist</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Ensure truck engine is OFF</li>
                    <li>Verify hose connections are secure</li>
                    <li>Check fire extinguishers are accessible</li>
                    <li>Confirm no smoking signs are visible</li>
                    <li>Station attendant is monitoring the discharge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Post-Discharge Tank Dip */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Step 5: Post-Discharge Tank Dip</h2>
                <p className="text-sm text-gray-500">Measure tank level AFTER discharge completes</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-900 font-medium">Pre-Discharge (Net Fuel)</p>
                  <p className="text-xl font-bold text-amber-700">
                    {tankFormat.litres(preDischarge.netFuelLitres)}
                  </p>
                </div>
                <div className="text-amber-500">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-amber-900 font-medium">Truck Total</p>
                  <p className="text-xl font-bold text-amber-700">{tankFormat.litres(truckTotalLitres)}</p>
                </div>
                <div className="text-amber-500">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-amber-900 font-medium">Expected Post-Discharge</p>
                  <p className="text-xl font-bold text-amber-700">
                    {tankFormat.litres(preDischarge.netFuelLitres + truckTotalLitres)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tank Dip Reading (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={postDischarge.dipCm}
                  onChange={(e) => updateTankDip('post', 'dipCm', e.target.value)}
                  step="0.1"
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume from Chart (L)</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold">
                  {tankFormat.litres(postDischarge.volumeLitres)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Dip (cm)</label>
                <input
                  type="number"
                  value={postDischarge.waterDipCm}
                  onChange={(e) => updateTankDip('post', 'waterDipCm', e.target.value)}
                  step="0.1"
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  value={postDischarge.temperatureC}
                  onChange={(e) => updateTankDip('post', 'temperatureC', e.target.value)}
                  step="0.1"
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={postDischarge.readBy}
                  onChange={(e) => updateTankDip('post', 'readBy', e.target.value)}
                  placeholder="Officer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-700 mb-1">Gross Volume</p>
                  <p className="text-xl font-bold text-green-900">
                    {tankFormat.litres(postDischarge.volumeLitres)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Less: Water Volume</p>
                  <p className="text-xl font-bold text-amber-600">
                    {postDischarge.waterLitres > 0 ? `−${tankFormat.litres(postDischarge.waterLitres)}` : '—'}
                  </p>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-sm text-green-800 mb-1">Net Fuel (Post-Discharge)</p>
                  <p className="text-2xl font-bold text-green-900">
                    {tankFormat.litres(postDischarge.netFuelLitres)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Tank Received (Post - Pre)</p>
                  <p className="text-2xl font-bold text-blue-900">{tankFormat.litres(tankReceived)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Truck Total</p>
                  <p className="text-2xl font-bold text-blue-900">{tankFormat.litres(truckTotalLitres)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Preliminary Shortage</p>
                  <p className={`text-2xl font-bold ${grossShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {grossShortage > 0 ? tankFormat.litres(grossShortage) : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Variance Calculation & Review */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Step 6: Variance Calculation & Review</h2>
                <p className="text-sm text-gray-500">Final variance analysis and discharge summary</p>
              </div>
            </div>

            {/* Variance Status Banner */}
            <div
              className={`rounded-lg p-6 border-2 ${
                varianceStatus === 'excess_loss'
                  ? 'bg-red-50 border-red-300'
                  : varianceStatus === 'within_tolerance'
                  ? 'bg-green-50 border-green-300'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              <div className="flex items-center gap-4">
                {varianceStatus === 'excess_loss' ? (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                ) : varianceStatus === 'within_tolerance' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                )}
                <div className="flex-1">
                  <h3
                    className={`text-lg font-bold ${
                      varianceStatus === 'excess_loss'
                        ? 'text-red-900'
                        : varianceStatus === 'within_tolerance'
                        ? 'text-green-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {varianceStatus === 'excess_loss'
                      ? 'Excess Loss Detected'
                      : varianceStatus === 'within_tolerance'
                      ? 'Variance Within Tolerance'
                      : 'Overage Detected'}
                  </h3>
                  <p
                    className={`text-sm ${
                      varianceStatus === 'excess_loss'
                        ? 'text-red-700'
                        : varianceStatus === 'within_tolerance'
                        ? 'text-green-700'
                        : 'text-blue-700'
                    }`}
                  >
                    {varianceStatus === 'excess_loss'
                      ? `Net chargeable shortage: ${tankFormat.litres(netShortage)} exceeds allowed transit loss`
                      : varianceStatus === 'within_tolerance'
                      ? 'Shortage is within the acceptable 0.3% transit loss tolerance'
                      : 'Tank received more fuel than truck chart total'}
                  </p>
                </div>
              </div>
            </div>

            {/* Discharge Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Truck Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Waybill No.</span>
                    <span className="text-sm font-semibold text-gray-900">{waybillNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Truck Reg</span>
                    <span className="text-sm font-semibold text-gray-900">{truckReg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Driver</span>
                    <span className="text-sm font-semibold text-gray-900">{driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Product</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${productColor.bg} ${productColor.text}`}>
                      {product}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Destination Tank</span>
                    <span className="text-sm font-semibold text-gray-900">{destinationTank}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Quantity Comparison</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Waybill Quantity</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tankFormat.litres(parseFloat(waybillQty))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Truck Chart Total</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tankFormat.litres(truckTotalLitres)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pre-Discharge (Net)</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tankFormat.litres(preDischarge.netFuelLitres)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Post-Discharge (Net)</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {tankFormat.litres(postDischarge.netFuelLitres)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-900">Tank Received</span>
                    <span className="text-lg font-bold text-blue-600">{tankFormat.litres(tankReceived)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variance Breakdown */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Variance Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Truck Chart Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    {tankFormat.litres(truckTotalLitres)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Less: Tank Received</span>
                  <span className="text-base font-semibold text-gray-900">
                    {tankFormat.litres(tankReceived)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-gray-300">
                  <span className="text-sm font-semibold text-gray-900">Gross Shortage</span>
                  <span className={`text-lg font-bold ${grossShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {grossShortage > 0 ? tankFormat.litres(grossShortage) : 'None (Overage)'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Less: Allowed Transit Loss (0.3%)</span>
                  <span className="text-base font-semibold text-green-600">{tankFormat.litres(allowedLoss)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-t-2 border-gray-300 bg-white px-4 rounded-lg">
                  <span className="text-base font-bold text-gray-900">Net Chargeable Shortage</span>
                  <span
                    className={`text-2xl font-bold ${
                      netShortage > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {netShortage > 0 ? tankFormat.litres(netShortage) : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compartment Summary */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Compartment Readings Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {compartments.map((comp) => (
                    <div key={comp.id} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">{comp.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{comp.dipCm} cm</p>
                      <p className="text-lg font-bold text-blue-600">{tankFormat.litres(comp.litres)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="text-sm text-gray-500">
          Step {currentStep} of 6
        </div>

        {currentStep < 6 && (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !canProceedStep1) ||
              (currentStep === 2 && !canProceedStep2) ||
              (currentStep === 3 && !canProceedStep3) ||
              (currentStep === 4 && !canProceedStep4) ||
              (currentStep === 5 && !canProceedStep5)
            }
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === 3 ? 'Save & Continue' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  )
}
