/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const, react/no-unescaped-entities, @typescript-eslint/no-empty-object-type */
'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Link from 'next/link'
import {
  Truck,
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Fuel,
  MapPin,
  Clock,
  Plus,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Route,
  Calculator,
  FileText,
  Download,
  X,
  Trash2,
} from 'lucide-react'

interface TruckData {
  id: string
  plateNumber: string
  make: string
  model: string
  year: number
  chassisNumber: string
  capacity: number
  currentOdometer: number
  purchaseCost: number
  depreciationRate: number
  status: 'active' | 'maintenance' | 'retired' | 'out-of-service'
  registrationDate: string
  lastServiceDate?: string
  nextServiceDue?: string
  assignedDriver?: string
  driverPhone?: string
  totalTrips: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  lastTripDate?: string
  totalDistanceCovered: number
  averageProfitPerTrip: number
}

interface Trip {
  id: string
  truckId: string
  plateNumber: string
  loadingLocation: string
  dischargeLocation: string
  quantity: number
  ratePerLiter: number
  totalRevenue: number
  expenses: TripExpense[]
  totalExpenses: number
  netProfit: number
  tripDate: string
  startTime: string
  endTime?: string
  status: 'planned' | 'loading' | 'in-transit' | 'discharging' | 'completed' | 'cancelled'
  driver: string
  startOdometer: number
  endOdometer?: number
  distanceCovered?: number
  notes?: string
}

interface TripExpense {
  id: string
  category: 'fuel' | 'maintenance' | 'tolls' | 'driver-allowance' | 'parking' | 'loading-fee' | 'other'
  description: string
  amount: number
  receipt?: string
}

interface Location {
  id: string
  name: string
  address: string
  state: string
  ratePerLiter: number
  type: 'loading' | 'discharge' | 'both'
  isActive: boolean
  contactPerson?: string
  contactPhone?: string
}

interface MaintenanceRecord {
  id: string
  date: string
  type: 'routine' | 'repair' | 'inspection' | 'tire-change' | 'oil-change' | 'other'
  description: string
  cost: number
  nextServiceDue?: string
  performedBy: string
  odometerReading: number
}

const mockTrucks: TruckData[] = [
  {
    id: 'T001',
    plateNumber: 'FT-001-NG',
    make: 'Mercedes',
    model: 'Actros 2542',
    year: 2020,
    chassisNumber: 'WDB9440321L123456',
    capacity: 33000,
    currentOdometer: 125000,
    purchaseCost: 45000000,
    depreciationRate: 15,
    status: 'active',
    registrationDate: '2020-01-15',
    lastServiceDate: '2024-10-01',
    nextServiceDue: '2024-12-01',
    assignedDriver: 'Musa Ibrahim',
    driverPhone: '+234-803-123-4567',
    totalTrips: 245,
    totalRevenue: 98500000,
    totalExpenses: 52200000,
    netProfit: 46300000,
    lastTripDate: '2024-11-14',
    totalDistanceCovered: 125000,
    averageProfitPerTrip: 189000,
  },
  {
    id: 'T002',
    plateNumber: 'FT-002-NG',
    make: 'Volvo',
    model: 'FH16',
    year: 2019,
    chassisNumber: 'YV2R6400JKA123789',
    capacity: 40000,
    currentOdometer: 180000,
    purchaseCost: 52000000,
    depreciationRate: 15,
    status: 'active',
    registrationDate: '2019-03-10',
    lastServiceDate: '2024-09-15',
    nextServiceDue: '2024-11-25',
    assignedDriver: 'Ahmed Hassan',
    driverPhone: '+234-804-234-5678',
    totalTrips: 312,
    totalRevenue: 142800000,
    totalExpenses: 76500000,
    netProfit: 66300000,
    lastTripDate: '2024-11-13',
    totalDistanceCovered: 180000,
    averageProfitPerTrip: 212500,
  },
  {
    id: 'T003',
    plateNumber: 'FT-003-NG',
    make: 'Scania',
    model: 'R500',
    year: 2021,
    chassisNumber: 'XLBTE45G0EG123456',
    capacity: 35000,
    currentOdometer: 95000,
    purchaseCost: 48000000,
    depreciationRate: 15,
    status: 'maintenance',
    registrationDate: '2021-06-20',
    lastServiceDate: '2024-11-10',
    nextServiceDue: '2025-01-10',
    assignedDriver: 'Fatima Usman',
    driverPhone: '+234-805-345-6789',
    totalTrips: 189,
    totalRevenue: 84400000,
    totalExpenses: 42800000,
    netProfit: 41600000,
    lastTripDate: '2024-11-09',
    totalDistanceCovered: 95000,
    averageProfitPerTrip: 220000,
  },
]

const mockLocations: Location[] = [
  {
    id: 'L001',
    name: 'Lagos Terminal',
    address: 'Apapa Wharf, Lagos',
    state: 'Lagos',
    ratePerLiter: 850,
    type: 'loading',
    isActive: true,
    contactPerson: 'Mr. Adebayo',
    contactPhone: '+234-801-111-2222',
  },
  {
    id: 'L002',
    name: 'Kano Depot',
    address: 'Industrial Area, Kano',
    state: 'Kano',
    ratePerLiter: 920,
    type: 'discharge',
    isActive: true,
    contactPerson: 'Alhaji Musa',
    contactPhone: '+234-802-222-3333',
  },
  {
    id: 'L003',
    name: 'Port Harcourt Hub',
    address: 'Trans Amadi, PH',
    state: 'Rivers',
    ratePerLiter: 880,
    type: 'loading',
    isActive: true,
    contactPerson: 'Mr. Emmanuel',
    contactPhone: '+234-803-333-4444',
  },
  {
    id: 'L004',
    name: 'Abuja Station',
    address: 'Wuse Zone, Abuja',
    state: 'FCT',
    ratePerLiter: 900,
    type: 'discharge',
    isActive: true,
    contactPerson: 'Mrs. Sarah',
    contactPhone: '+234-804-444-5555',
  },
  {
    id: 'L005',
    name: 'Kaduna Filling Point',
    address: 'Kudenden, Kaduna',
    state: 'Kaduna',
    ratePerLiter: 910,
    type: 'discharge',
    isActive: true,
    contactPerson: 'Mr. Ibrahim',
    contactPhone: '+234-805-555-6666',
  },
  {
    id: 'L006',
    name: 'Warri Loading Bay',
    address: 'Warri, Delta',
    state: 'Delta',
    ratePerLiter: 870,
    type: 'loading',
    isActive: true,
    contactPerson: 'Mr. John',
    contactPhone: '+234-806-666-7777',
  },
]

const mockTrips: Trip[] = [
  {
    id: 'TR001',
    truckId: 'T001',
    plateNumber: 'FT-001-NG',
    loadingLocation: 'Lagos Terminal',
    dischargeLocation: 'Kano Depot',
    quantity: 32000,
    ratePerLiter: 920,
    totalRevenue: 29440000,
    expenses: [
      { id: 'E001', category: 'fuel', description: 'Diesel for trip', amount: 450000, receipt: 'REC001' },
      { id: 'E002', category: 'driver-allowance', description: 'Driver allowance', amount: 50000 },
      { id: 'E003', category: 'tolls', description: 'Highway tolls', amount: 25000 },
    ],
    totalExpenses: 525000,
    netProfit: 28915000,
    tripDate: '2024-11-14',
    startTime: '06:00',
    endTime: '18:30',
    status: 'completed',
    driver: 'Musa Ibrahim',
    startOdometer: 124500,
    endOdometer: 125000,
    distanceCovered: 500,
    notes: 'Successful trip, no issues',
  },
  {
    id: 'TR002',
    truckId: 'T002',
    plateNumber: 'FT-002-NG',
    loadingLocation: 'Port Harcourt Hub',
    dischargeLocation: 'Abuja Station',
    quantity: 38000,
    ratePerLiter: 900,
    totalRevenue: 34200000,
    expenses: [
      { id: 'E004', category: 'fuel', description: 'Diesel for trip', amount: 520000 },
      { id: 'E005', category: 'driver-allowance', description: 'Driver allowance', amount: 60000 },
      { id: 'E006', category: 'loading-fee', description: 'Loading terminal fees', amount: 15000 },
    ],
    totalExpenses: 595000,
    netProfit: 33605000,
    tripDate: '2024-11-13',
    startTime: '05:30',
    endTime: '19:45',
    status: 'completed',
    driver: 'Ahmed Hassan',
    startOdometer: 179200,
    endOdometer: 180000,
    distanceCovered: 800,
    notes: 'Good trip, minor delay at checkpoint',
  },
]

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'M001',
    date: '2024-10-01',
    type: 'routine',
    description: 'Routine maintenance - oil change, filter replacement',
    cost: 350000,
    nextServiceDue: '2024-12-01',
    performedBy: 'Bayscom Service Center',
    odometerReading: 122000,
  },
  {
    id: 'M002',
    date: '2024-08-15',
    type: 'tire-change',
    description: 'Front tire replacement (2 tires)',
    cost: 480000,
    performedBy: 'Michelin Service Center',
    odometerReading: 118000,
  },
  {
    id: 'M003',
    date: '2024-06-20',
    type: 'repair',
    description: 'Brake system repair and pad replacement',
    cost: 620000,
    performedBy: 'Mercedes Service Center',
    odometerReading: 115000,
  },
]

export default function TruckDetailPage() {
  const params = useParams()
  const truckId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'financials' | 'maintenance'>('overview')
  const [showAddTripModal, setShowAddTripModal] = useState(false)
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false)
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords)
  const [locations] = useState<Location[]>(mockLocations)
  const [loading, setLoading] = useState(false)

  const [newTrip, setNewTrip] = useState({
    loadingLocation: '',
    dischargeLocation: '',
    quantity: 0,
    driver: '',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: '',
    startOdometer: 0,
    notes: '',
  })

  const [tripExpenses, setTripExpenses] = useState<TripExpense[]>([])
  const [newExpense, setNewExpense] = useState({
    category: 'fuel' as TripExpense['category'],
    description: '',
    amount: 0,
  })

  const [newMaintenance, setNewMaintenance] = useState({
    type: 'routine' as MaintenanceRecord['type'],
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    odometerReading: 0,
    performedBy: '',
    nextServiceDue: '',
  })

  const truck = mockTrucks.find(t => t.id === truckId)
  const truckTrips = trips.filter(t => t.truckId === truckId)

  if (!truck) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Truck Not Found</h3>
            <p className="text-gray-600 mb-4">The truck you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/trucks"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Fleet
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const calculateDepreciatedValue = () => {
    const currentYear = new Date().getFullYear()
    const registrationYear = new Date(truck.registrationDate).getFullYear()
    const yearsOwned = currentYear - registrationYear
    const depreciation = truck.purchaseCost * (truck.depreciationRate / 100) * yearsOwned
    return Math.max(truck.purchaseCost - depreciation, truck.purchaseCost * 0.1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getSelectedLocationRate = (locationName: string) => {
    const location = locations.find(l => l.name === locationName)
    return location?.ratePerLiter || 0
  }

  const calculateTripRevenue = () => {
    const rate = getSelectedLocationRate(newTrip.dischargeLocation)
    return newTrip.quantity * rate
  }

  const calculateTotalExpenses = () => {
    return tripExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  }

  const calculateNetProfit = () => {
    return calculateTripRevenue() - calculateTotalExpenses()
  }

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      const expense: TripExpense = {
        id: `E${Date.now()}`,
        ...newExpense,
      }
      setTripExpenses([...tripExpenses, expense])
      setNewExpense({
        category: 'fuel',
        description: '',
        amount: 0,
      })
    }
  }

  const handleRemoveExpense = (expenseId: string) => {
    setTripExpenses(tripExpenses.filter(e => e.id !== expenseId))
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tripId = `TR${String(trips.length + 1).padStart(3, '0')}`
      const rate = getSelectedLocationRate(newTrip.dischargeLocation)
      const totalRevenue = calculateTripRevenue()
      const totalExpenses = calculateTotalExpenses()
      const netProfit = calculateNetProfit()

      const trip: Trip = {
        id: tripId,
        truckId: truck.id,
        plateNumber: truck.plateNumber,
        loadingLocation: newTrip.loadingLocation,
        dischargeLocation: newTrip.dischargeLocation,
        quantity: newTrip.quantity,
        ratePerLiter: rate,
        totalRevenue,
        expenses: tripExpenses,
        totalExpenses,
        netProfit,
        tripDate: newTrip.tripDate,
        startTime: newTrip.startTime,
        status: 'planned',
        driver: newTrip.driver || truck.assignedDriver || '',
        startOdometer: newTrip.startOdometer,
        notes: newTrip.notes,
      }

      setTrips([...trips, trip])
      setShowAddTripModal(false)
      setNewTrip({
        loadingLocation: '',
        dischargeLocation: '',
        quantity: 0,
        driver: '',
        tripDate: new Date().toISOString().split('T')[0],
        startTime: '',
        startOdometer: 0,
        notes: '',
      })
      setTripExpenses([])
      alert('Trip created successfully!')
    } catch (error) {
      alert('Error creating trip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const maintenanceId = `M${String(maintenanceRecords.length + 1).padStart(3, '0')}`

      const maintenance: MaintenanceRecord = {
        id: maintenanceId,
        date: newMaintenance.date,
        type: newMaintenance.type,
        description: newMaintenance.description,
        cost: newMaintenance.cost,
        odometerReading: newMaintenance.odometerReading,
        performedBy: newMaintenance.performedBy,
        nextServiceDue: newMaintenance.nextServiceDue || undefined,
      }

      setMaintenanceRecords([maintenance, ...maintenanceRecords])
      setShowAddMaintenanceModal(false)
      setNewMaintenance({
        type: 'routine',
        description: '',
        cost: 0,
        date: new Date().toISOString().split('T')[0],
        odometerReading: 0,
        performedBy: '',
        nextServiceDue: '',
      })
      alert('Maintenance record created successfully!')
    } catch (error) {
      alert('Error creating maintenance record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      retired: 'bg-red-100 text-red-800 border-red-200',
      'out-of-service': 'bg-gray-100 text-gray-800 border-gray-200',
    }

    const icons = {
      active: CheckCircle,
      maintenance: AlertTriangle,
      retired: Clock,
      'out-of-service': Clock,
    }

    const Icon = icons[status as keyof typeof icons] || Clock

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon className="w-4 h-4" />
        {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </span>
    )
  }

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-transit':
        return 'bg-blue-100 text-blue-800'
      case 'loading':
        return 'bg-yellow-100 text-yellow-800'
      case 'discharging':
        return 'bg-orange-100 text-orange-800'
      case 'planned':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fuel':
        return <Fuel className="w-4 h-4" />
      case 'maintenance':
        return <Wrench className="w-4 h-4" />
      case 'tolls':
        return <MapPin className="w-4 h-4" />
      case 'driver-allowance':
        return <DollarSign className="w-4 h-4" />
      default:
        return <Calculator className="w-4 h-4" />
    }
  }

  const loadingLocations = locations.filter(l => l.type === 'loading' || l.type === 'both')
  const dischargeLocations = locations.filter(l => l.type === 'discharge' || l.type === 'both')

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/trucks"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{truck.plateNumber}</h1>
                {getStatusBadge(truck.status)}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {truck.make} {truck.model} ({truck.year}) • Chassis: {truck.chassisNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#8B1538' }}>
              <Edit className="w-4 h-4" />
              Edit Truck
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="mt-2 text-xl font-semibold text-green-600">
                  {formatCurrency(truck.netProfit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((truck.netProfit / truck.totalRevenue) * 100).toFixed(1)}% margin
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{truckTrips.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {formatCurrency(truck.averageProfitPerTrip)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Route className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Value</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(calculateDepreciatedValue())}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {truck.depreciationRate}% annual depreciation
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#8B1538' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Distance Covered</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {truck.totalDistanceCovered.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">kilometers</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('trips')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'trips'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trips ({truckTrips.length})
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'financials'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Financials
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'maintenance'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Maintenance
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Plate Number:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Make & Model:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.make} {truck.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Year:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Chassis Number:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.chassisNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Capacity:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.capacity.toLocaleString()}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Odometer:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.currentOdometer.toLocaleString()}km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Registration Date:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(truck.registrationDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Assigned Driver:</span>
                        <span className="text-sm font-medium text-gray-900">{truck.assignedDriver || 'Unassigned'}</span>
                      </div>
                      {truck.driverPhone && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="text-sm font-medium text-gray-900">{truck.driverPhone}</span>
                        </div>
                      )}
                      {truck.lastTripDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Trip:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(truck.lastTripDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Purchase Cost</p>
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(truck.purchaseCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Value</p>
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(calculateDepreciatedValue())}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Depreciation</p>
                      <p className="text-xl font-semibold text-red-600">
                        {formatCurrency(truck.purchaseCost - calculateDepreciatedValue())}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                  <div className="space-y-3">
                    {truck.lastServiceDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Service:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(truck.lastServiceDate)}</span>
                      </div>
                    )}
                    {truck.nextServiceDue && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Next Service Due:</span>
                        <span className="text-sm font-medium text-orange-600">{formatDate(truck.nextServiceDue)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Trips Tab */}
            {activeTab === 'trips' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Trip History</h3>
                  <button
                    onClick={() => setShowAddTripModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    <Plus className="w-4 h-4" />
                    Schedule New Trip
                  </button>
                </div>

                <div className="space-y-4">
                  {truckTrips.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Route className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No trips recorded for this truck yet.</p>
                      <button
                        onClick={() => setShowAddTripModal(true)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                        style={{ backgroundColor: '#8B1538' }}
                      >
                        <Plus className="w-4 h-4" />
                        Create First Trip
                      </button>
                    </div>
                  ) : (
                    truckTrips.map(trip => (
                      <div key={trip.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{trip.id}</h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTripStatusColor(trip.status)}`}>
                                {trip.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">{trip.loadingLocation}</span>
                              <span>→</span>
                              <span className="font-medium text-green-600">{trip.dischargeLocation}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(trip.tripDate)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-sm font-medium text-gray-900">{trip.quantity.toLocaleString()}L</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Revenue</p>
                            <p className="text-sm font-semibold text-green-600">{formatCurrency(trip.totalRevenue)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Expenses</p>
                            <p className="text-sm font-semibold text-red-600">{formatCurrency(trip.totalExpenses)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Net Profit</p>
                            <p className="text-sm font-semibold text-blue-600">{formatCurrency(trip.netProfit)}</p>
                          </div>
                        </div>

                        {trip.expenses.length > 0 && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">Expenses Breakdown:</p>
                            <div className="space-y-1">
                              {trip.expenses.map(expense => (
                                <div key={expense.id} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    {getCategoryIcon(expense.category)}
                                    <span className="text-gray-600">{expense.description}</span>
                                  </div>
                                  <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {trip.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Notes: {trip.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Financials Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Statement</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(truck.totalRevenue)}</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(truck.totalExpenses)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Net Profit</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(truck.netProfit)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Key Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profit Margin:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {((truck.netProfit / truck.totalRevenue) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Profit per Trip:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(truck.averageProfitPerTrip)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue per Trip:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(truck.totalRevenue / truck.totalTrips)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expense per Trip:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(truck.totalExpenses / truck.totalTrips)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Maintenance History</h3>
                  <button
                    onClick={() => setShowAddMaintenanceModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    <Plus className="w-4 h-4" />
                    Record Maintenance
                  </button>
                </div>

                {truck.nextServiceDue && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-900">Next Service Due</p>
                        <p className="text-sm text-orange-700">{formatDate(truck.nextServiceDue)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {maintenanceRecords.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No maintenance records yet.</p>
                      <button
                        onClick={() => setShowAddMaintenanceModal(true)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
                        style={{ backgroundColor: '#8B1538' }}
                      >
                        <Plus className="w-4 h-4" />
                        Record First Maintenance
                      </button>
                    </div>
                  ) : (
                    maintenanceRecords.map(record => (
                      <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Wrench className="w-4 h-4 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">{record.description}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{record.performedBy}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(record.cost)}</p>
                            <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Type: </span>
                            <span className="font-medium text-gray-900">
                              {record.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Odometer: </span>
                            <span className="font-medium text-gray-900">{record.odometerReading.toLocaleString()}km</span>
                          </div>
                        </div>

                        {record.nextServiceDue && (
                          <div className="mt-2 pt-2 border-t border-gray-200 text-sm">
                            <span className="text-gray-600">Next Service Due: </span>
                            <span className="font-medium text-orange-600">{formatDate(record.nextServiceDue)}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Trip Modal */}
        {showAddTripModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Schedule New Trip - {truck.plateNumber}</h2>
                  <button
                    onClick={() => setShowAddTripModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateTrip} className="p-6 space-y-6">
                {/* Trip Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loading Location *
                      </label>
                      <select
                        value={newTrip.loadingLocation}
                        onChange={(e) => setNewTrip(prev => ({ ...prev, loadingLocation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select loading location</option>
                        {loadingLocations.map(loc => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} - {loc.state} (₦{loc.ratePerLiter}/L)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discharge Location *
                      </label>
                      <select
                        value={newTrip.dischargeLocation}
                        onChange={(e) => setNewTrip(prev => ({ ...prev, dischargeLocation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select discharge location</option>
                        {dischargeLocations.map(loc => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} - {loc.state} (₦{loc.ratePerLiter}/L)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity (Liters) *
                      </label>
                      <input
                        type="number"
                        value={newTrip.quantity || ''}
                        onChange={(e) => setNewTrip(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="32000"
                        min="1"
                        max={truck.capacity}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Max capacity: {truck.capacity.toLocaleString()}L</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate per Liter
                      </label>
                      <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                        <p className="text-sm font-medium text-gray-900">
                          ₦{getSelectedLocationRate(newTrip.dischargeLocation).toLocaleString()}/L
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Based on discharge location</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trip Date *
                      </label>
                      <input
                        type="date"
                        value={newTrip.tripDate}
                        onChange={(e) => setNewTrip(prev => ({ ...prev, tripDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={newTrip.startTime}
                        onChange={(e) => setNewTrip(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Odometer (km) *
                      </label>
                      <input
                        type="number"
                        value={newTrip.startOdometer || ''}
                        onChange={(e) => setNewTrip(prev => ({ ...prev, startOdometer: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={truck.currentOdometer.toString()}
                        min={truck.currentOdometer}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver
                    </label>
                    <input
                      type="text"
                      value={newTrip.driver}
                      onChange={(e) => setNewTrip(prev => ({ ...prev, driver: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={truck.assignedDriver || 'Enter driver name'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={newTrip.notes}
                      onChange={(e) => setNewTrip(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                      placeholder="Any additional notes for this trip..."
                    />
                  </div>
                </div>

                {/* Expenses */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Trip Expenses</h3>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as TripExpense['category'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="fuel">Fuel</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="tolls">Tolls</option>
                        <option value="driver-allowance">Driver Allowance</option>
                        <option value="parking">Parking</option>
                        <option value="loading-fee">Loading Fee</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={newExpense.amount || ''}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Amount (₦)"
                        min="0"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={handleAddExpense}
                        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  {tripExpenses.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      {tripExpenses.map(expense => (
                        <div key={expense.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(expense.category)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                              <p className="text-xs text-gray-500">{expense.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(expense.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExpense(expense.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Revenue:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(calculateTripRevenue())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Expenses:</span>
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(calculateTotalExpenses())}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-base font-semibold text-gray-900">Net Profit:</span>
                      <span className="text-base font-bold text-blue-600">
                        {formatCurrency(calculateNetProfit())}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddTripModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !newTrip.loadingLocation || !newTrip.dischargeLocation || !newTrip.quantity}
                    className="px-4 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    {loading ? 'Creating...' : 'Create Trip'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Maintenance Modal */}
        {showAddMaintenanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Record Maintenance - {truck.plateNumber}</h2>
                  <button
                    onClick={() => setShowAddMaintenanceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateMaintenance} className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Maintenance Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Type *
                      </label>
                      <select
                        value={newMaintenance.type}
                        onChange={(e) => setNewMaintenance(prev => ({
                          ...prev,
                          type: e.target.value as MaintenanceRecord['type']
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="routine">Routine Maintenance</option>
                        <option value="repair">Repair</option>
                        <option value="inspection">Inspection</option>
                        <option value="tire-change">Tire Change</option>
                        <option value="oil-change">Oil Change</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newMaintenance.date}
                        onChange={(e) => setNewMaintenance(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={newMaintenance.description}
                      onChange={(e) => setNewMaintenance(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Describe the maintenance work performed..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost (₦) *
                      </label>
                      <input
                        type="number"
                        value={newMaintenance.cost || ''}
                        onChange={(e) => setNewMaintenance(prev => ({
                          ...prev,
                          cost: parseFloat(e.target.value) || 0
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="350000"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Odometer Reading (km) *
                      </label>
                      <input
                        type="number"
                        value={newMaintenance.odometerReading || ''}
                        onChange={(e) => setNewMaintenance(prev => ({
                          ...prev,
                          odometerReading: parseInt(e.target.value) || 0
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={truck.currentOdometer.toString()}
                        min="0"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Current: {truck.currentOdometer.toLocaleString()}km
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Performed By *
                      </label>
                      <input
                        type="text"
                        value={newMaintenance.performedBy}
                        onChange={(e) => setNewMaintenance(prev => ({ ...prev, performedBy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Service center or mechanic name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Service Due (Optional)
                      </label>
                      <input
                        type="date"
                        value={newMaintenance.nextServiceDue}
                        onChange={(e) => setNewMaintenance(prev => ({
                          ...prev,
                          nextServiceDue: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min={newMaintenance.date}
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Maintenance Cost:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(newMaintenance.cost)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddMaintenanceModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !newMaintenance.description || !newMaintenance.performedBy || newMaintenance.cost <= 0}
                    className="px-4 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#8B1538' }}
                  >
                    {loading ? 'Recording...' : 'Record Maintenance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
