'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Truck,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Fuel,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Package,
  Route,
  Calculator,
  FileText,
  Filter,
  Download,
  X,
  ChevronDown,
  Settings,
  Activity,
  BarChart3,
  Target,
  Car,
  Users,
} from 'lucide-react';

interface Truck {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  chassisNumber: string;
  capacity: number; // in liters
  currentOdometer: number;
  purchaseCost: number;
  depreciationRate: number; // percentage per year
  status: 'active' | 'maintenance' | 'retired' | 'out-of-service';
  registrationDate: string;
  lastServiceDate?: string;
  nextServiceDue?: string;
  assignedDriver?: string;
  driverPhone?: string;
  // Financial tracking
  totalTrips: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  lastTripDate?: string;
  totalDistanceCovered: number;
  averageProfitPerTrip: number;
}

interface Trip {
  id: string;
  truckId: string;
  plateNumber: string;
  loadingLocation: string;
  dischargeLocation: string;
  quantity: number; // liters
  ratePerLiter: number;
  totalRevenue: number;
  expenses: TripExpense[];
  totalExpenses: number;
  netProfit: number;
  tripDate: string;
  startTime: string;
  endTime?: string;
  status: 'planned' | 'loading' | 'in-transit' | 'discharging' | 'completed' | 'cancelled';
  driver: string;
  startOdometer: number;
  endOdometer?: number;
  distanceCovered?: number;
  notes?: string;
}

interface TripExpense {
  id: string;
  category: 'fuel' | 'maintenance' | 'tolls' | 'driver-allowance' | 'parking' | 'loading-fee' | 'other';
  description: string;
  amount: number;
  receipt?: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  state: string;
  ratePerLiter: number;
  type: 'loading' | 'discharge' | 'both';
  isActive: boolean;
  contactPerson?: string;
  contactPhone?: string;
}

interface TruckAccount {
  truckId: string;
  plateNumber: string;
  period: string; // Month/Year
  totalTrips: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  averageRevenuePerTrip: number;
  averageExpensePerTrip: number;
}

// Mock data
const mockTrucks: Truck[] = [
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
];

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
    contactPhone: '+234-801-111-2222'
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
    contactPhone: '+234-802-222-3333'
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
    contactPhone: '+234-803-333-4444'
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
    contactPhone: '+234-804-444-5555'
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
    contactPhone: '+234-805-555-6666'
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
    contactPhone: '+234-806-666-7777'
  },
];

const mockRecentTrips: Trip[] = [
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
    notes: 'Successful trip, no issues'
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
    notes: 'Good trip, minor delay at checkpoint'
  },
];

export default function FleetManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trucks, setTrucks] = useState<Truck[]>(mockTrucks);
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [trips, setTrips] = useState<Trip[]>(mockRecentTrips);
  const [showAddTruckModal, setShowAddTruckModal] = useState(false);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTripExpenseModal, setShowTripExpenseModal] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  const [newTruck, setNewTruck] = useState({
    plateNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    chassisNumber: '',
    capacity: 0,
    currentOdometer: 0,
    purchaseCost: 0,
    depreciationRate: 15,
    registrationDate: new Date().toISOString().split('T')[0],
    assignedDriver: '',
    driverPhone: '',
  });

  const [newTrip, setNewTrip] = useState({
    truckId: '',
    loadingLocation: '',
    dischargeLocation: '',
    quantity: 0,
    driver: '',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: '',
    startOdometer: 0,
    notes: '',
  });

  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    state: '',
    ratePerLiter: 0,
    type: 'both' as 'loading' | 'discharge' | 'both',
    contactPerson: '',
    contactPhone: '',
  });

  const tabs = [
    { id: 'overview', label: 'Fleet Overview', icon: BarChart3 },
    { id: 'trucks', label: 'Truck Management', icon: Truck },
    { id: 'trips', label: 'Trip Management', icon: Route },
    { id: 'locations', label: 'Locations & Rates', icon: MapPin },
    { id: 'financials', label: 'Truck Accounts', icon: DollarSign },
    { id: 'analytics', label: 'Performance Analytics', icon: Activity },
  ];

  const calculateDepreciatedValue = (truck: Truck) => {
    const currentYear = new Date().getFullYear();
    const registrationYear = new Date(truck.registrationDate).getFullYear();
    const yearsOwned = currentYear - registrationYear;
    const depreciation = truck.purchaseCost * (truck.depreciationRate / 100) * yearsOwned;
    return Math.max(truck.purchaseCost - depreciation, truck.purchaseCost * 0.1); // Minimum 10% of original value
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-red-100 text-red-800';
      case 'out-of-service': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      case 'discharging': return 'bg-orange-100 text-orange-800';
      case 'planned': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const truckId = `T${String(trucks.length + 1).padStart(3, '0')}`;
      const truck: Truck = {
        ...newTruck,
        id: truckId,
        status: 'active',
        totalTrips: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        totalDistanceCovered: 0,
        averageProfitPerTrip: 0,
      };

      setTrucks(prev => [...prev, truck]);
      setNewTruck({
        plateNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        chassisNumber: '',
        capacity: 0,
        currentOdometer: 0,
        purchaseCost: 0,
        depreciationRate: 15,
        registrationDate: new Date().toISOString().split('T')[0],
        assignedDriver: '',
        driverPhone: '',
      });
      setShowAddTruckModal(false);
      alert('Truck added successfully!');
    } catch (error) {
      alert('Error adding truck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const locationId = `L${String(locations.length + 1).padStart(3, '0')}`;
      const location: Location = {
        ...newLocation,
        id: locationId,
        isActive: true,
      };

      setLocations(prev => [...prev, location]);
      setNewLocation({
        name: '',
        address: '',
        state: '',
        ratePerLiter: 0,
        type: 'both',
        contactPerson: '',
        contactPhone: '',
      });
      setShowLocationModal(false);
      alert('Location added successfully!');
    } catch (error) {
      alert('Error adding location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalFleetValue = trucks.reduce((sum, truck) => sum + calculateDepreciatedValue(truck), 0);
  const activeTrucks = trucks.filter(t => t.status === 'active').length;
  const totalRevenue = trucks.reduce((sum, truck) => sum + truck.totalRevenue, 0);
  const totalProfit = trucks.reduce((sum, truck) => sum + truck.netProfit, 0);
  const totalExpenses = trucks.reduce((sum, truck) => sum + truck.totalExpenses, 0);
  const averageProfitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Active Trucks</p>
              <p className="text-3xl font-bold text-green-600">{activeTrucks}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-black">of {trucks.length} total trucks</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Fleet Revenue</p>
              <p className="text-3xl font-bold text-blue-600">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+15.2%</span>
            <span className="text-black ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Net Profit</p>
              <p className="text-3xl font-bold text-green-600">₦{(totalProfit / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-black">
              {averageProfitMargin.toFixed(1)}% margin
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Fleet Value</p>
              <p className="text-3xl font-bold text-[#8B1538]">₦{(totalFleetValue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-[#8B1538]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-black">Depreciated value</span>
          </div>
        </div>
      </div>

      {/* Fleet Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Performing Trucks</h3>
          <div className="space-y-3">
            {trucks
              .sort((a, b) => b.netProfit - a.netProfit)
              .slice(0, 5)
              .map((truck, index) => (
                <div key={truck.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-[#8B1538] text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{truck.plateNumber}</p>
                      <p className="text-sm text-black">{truck.make} {truck.model}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₦{(truck.netProfit / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-black">{truck.totalTrips} trips</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Trip Activity</h3>
          <div className="space-y-3">
            {trips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${getTripStatusColor(trip.status).includes('green') ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="font-medium">{trip.plateNumber}</p>
                    <p className="text-sm text-black">
                      {trip.loadingLocation} → {trip.dischargeLocation}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">₦{(trip.netProfit / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-black">{trip.tripDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Total Revenue</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">₦{(totalExpenses / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Total Expenses</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">₦{(totalProfit / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Net Profit</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrucksTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Truck Fleet Management</h3>
        <button
          onClick={() => setShowAddTruckModal(true)}
          className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Truck
        </button>
      </div>

      {/* Trucks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {trucks.map((truck) => (
          <div key={truck.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-black">{truck.plateNumber}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(truck.status)}`}>
                {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">Make/Model:</span>
                <span className="font-medium text-black">{truck.make} {truck.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Capacity:</span>
                <span className="font-medium text-black">{truck.capacity.toLocaleString()}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Odometer:</span>
                <span className="font-medium text-black">{truck.currentOdometer.toLocaleString()}km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Current Value:</span>
                <span className="font-medium text-black">₦{(calculateDepreciatedValue(truck) / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Driver:</span>
                <span className="font-medium text-black">{truck.assignedDriver || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Net Profit:</span>
                <span className="font-medium text-green-600">₦{(truck.netProfit / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm text-black">
                <span>Trips: <strong className="text-black">{truck.totalTrips}</strong></span>
                <span>Avg Profit: <strong className="text-black">₦{(truck.averageProfitPerTrip / 1000).toFixed(0)}K</strong></span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setSelectedTruck(truck)}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Account
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTripsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trip Management</h3>
        <button
          onClick={() => setShowAddTripModal(true)}
          className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Trip
        </button>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Trip Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Quantity & Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Net Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-black">{trip.plateNumber}</div>
                      <div className="text-sm text-black">{trip.id}</div>
                      <div className="text-xs text-black">{trip.tripDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-black">
                        <span className="text-blue-600">{trip.loadingLocation}</span>
                      </div>
                      <div className="text-sm text-black flex items-center">
                        <span className="mr-2">→</span>
                        <span className="text-green-600">{trip.dischargeLocation}</span>
                      </div>
                      {trip.distanceCovered && (
                        <div className="text-xs text-black">{trip.distanceCovered}km</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-black">{trip.quantity.toLocaleString()}L</div>
                      <div className="text-sm text-black">₦{trip.ratePerLiter}/L</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ₦{trip.totalRevenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      ₦{trip.totalExpenses.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      ₦{trip.netProfit.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTripStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTrip(trip);
                          setShowTripExpenseModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Calculator className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLocationsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Loading & Discharge Locations</h3>
        <button
          onClick={() => setShowLocationModal(true)}
          className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">{location.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                location.type === 'loading' ? 'bg-blue-100 text-blue-800' :
                location.type === 'discharge' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-black">Address:</p>
                <p className="font-medium">{location.address}</p>
                <p className="text-sm text-black">{location.state} State</p>
              </div>

              <div className="flex justify-between">
                <span className="text-black">Rate per Liter:</span>
                <span className="font-medium text-green-600">₦{location.ratePerLiter}</span>
              </div>

              {location.contactPerson && (
                <div>
                  <p className="text-sm text-black">Contact Person:</p>
                  <p className="font-medium text-black">{location.contactPerson}</p>
                  <p className="text-sm text-black">{location.contactPhone}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                <MapPin className="h-4 w-4 mr-1" />
                View Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Fleet Management System</h1>
            <p className="mt-1 text-sm text-black">
              Comprehensive fuel transportation fleet management with trip tracking and financial accounting
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="-mb-px flex space-x-8 overflow-x-auto px-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#8B1538] text-[#8B1538] bg-[#8B1538]/5'
                      : 'border-transparent text-black hover:text-[#8B1538] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'trucks' && renderTrucksTab()}
          {activeTab === 'trips' && renderTripsTab()}
          {activeTab === 'locations' && renderLocationsTab()}
          {activeTab === 'financials' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Truck Financial Accounts</h3>
              <p className="text-black">Individual truck P&L statements and financial tracking</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Performance Analytics</h3>
              <p className="text-black">Detailed analytics on truck performance, route efficiency, and profitability</p>
            </div>
          )}
        </div>

        {/* Add Truck Modal */}
        {showAddTruckModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Add New Fuel Transport Truck</h2>
                  <button
                    onClick={() => setShowAddTruckModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddTruck} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plate Number *
                    </label>
                    <input
                      type="text"
                      value={newTruck.plateNumber}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, plateNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="FT-001-NG"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chassis Number *
                    </label>
                    <input
                      type="text"
                      value={newTruck.chassisNumber}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, chassisNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="WDB9440321L123456"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make *
                    </label>
                    <input
                      type="text"
                      value={newTruck.make}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, make: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Mercedes"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={newTruck.model}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Actros 2542"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={newTruck.year}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tank Capacity (Liters) *
                    </label>
                    <input
                      type="number"
                      value={newTruck.capacity}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="33000"
                      min="1000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Odometer (km) *
                    </label>
                    <input
                      type="number"
                      value={newTruck.currentOdometer}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, currentOdometer: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="125000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Cost (₦) *
                    </label>
                    <input
                      type="number"
                      value={newTruck.purchaseCost}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, purchaseCost: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="45000000"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depreciation Rate (% per year)
                    </label>
                    <input
                      type="number"
                      value={newTruck.depreciationRate}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, depreciationRate: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="15"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Date *
                    </label>
                    <input
                      type="date"
                      value={newTruck.registrationDate}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, registrationDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Driver
                    </label>
                    <input
                      type="text"
                      value={newTruck.assignedDriver}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, assignedDriver: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Musa Ibrahim"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Phone
                  </label>
                  <input
                    type="tel"
                    value={newTruck.driverPhone}
                    onChange={(e) => setNewTruck(prev => ({ ...prev, driverPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="+234-803-123-4567"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddTruckModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Truck'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Add New Location</h2>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddLocation} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Lagos Terminal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Apapa Wharf, Lagos"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={newLocation.state}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Lagos"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Type *
                    </label>
                    <select
                      value={newLocation.type}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, type: e.target.value as 'loading' | 'discharge' | 'both' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="both">Both (Loading & Discharge)</option>
                      <option value="loading">Loading Point</option>
                      <option value="discharge">Discharge Point</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate per Liter (₦) *
                  </label>
                  <input
                    type="number"
                    value={newLocation.ratePerLiter}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, ratePerLiter: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="850"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={newLocation.contactPerson}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Mr. Adebayo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={newLocation.contactPhone}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="+234-801-111-2222"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Location'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}