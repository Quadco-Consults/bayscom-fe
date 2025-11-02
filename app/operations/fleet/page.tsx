'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, MapPin, DollarSign, TrendingUp, Calendar, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface VehicleType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TruckData {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  vehicleTypeId?: string;
  productType: 'AGO' | 'PMS' | 'DPK' | 'LPG' | 'multi-product';
  capacity: number;
  unit: 'liters' | 'kg';
  status: 'available' | 'in-transit' | 'loading' | 'maintenance' | 'inactive';
  currentLocation?: string;
  driverId?: string;
  // Maintenance
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  insuranceExpiryDate: string;
  // Financial
  acquisitionCost: number;
  acquisitionDate: string;
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  remainingDebt: number;
  isBreakEven: boolean;
  breakEvenDate?: string;
  monthlyEarnings: number;
  monthlyExpenses: number;
  annualEarnings: number;
  annualExpenses: number;
  createdAt: string;
  updatedAt: string;
}

interface TruckTrip {
  id: string;
  tripNumber: string;
  truckId: string;
  truckRegistration?: string;
  driverId: string;
  origin: string;
  destination: string;
  destinationStationId?: string;
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  quantity: number;
  unit: 'liters' | 'kg';
  distance: number;
  ratePerKm: number;
  freight: number;
  earnings: number;
  totalExpenses: number;
  netProfit: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  departureTime?: string;
  arrivalTime?: string;
  estimatedArrivalTime?: string;
  actualDuration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function FleetManagementPage() {
  const [activeTab, setActiveTab] = useState<'trucks' | 'trips'>('trucks');
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [trips, setTrips] = useState<TruckTrip[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTruckId, setEditingTruckId] = useState<string | null>(null);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const [truckForm, setTruckForm] = useState({
    registrationNumber: '',
    vehicleType: '',
    vehicleTypeId: '',
    productType: 'AGO' as 'AGO' | 'PMS' | 'DPK' | 'LPG' | 'multi-product',
    capacity: '',
    unit: 'liters' as 'liters' | 'kg',
    status: 'available' as TruckData['status'],
    currentLocation: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    insuranceExpiryDate: '',
    acquisitionCost: '',
    acquisitionDate: '',
  });

  const [tripForm, setTripForm] = useState({
    truckId: '',
    driverId: '',
    origin: '',
    destination: '',
    productType: 'AGO' as 'PMS' | 'AGO' | 'DPK' | 'LPG',
    quantity: '',
    unit: 'liters' as 'liters' | 'kg',
    distance: '',
    ratePerKm: '',
    status: 'scheduled' as TruckTrip['status'],
    departureTime: '',
    estimatedArrivalTime: '',
    notes: '',
  });

  useEffect(() => {
    loadVehicleTypes();
    loadTrucks();
    loadTrips();
  }, []);

  const loadVehicleTypes = () => {
    const stored = localStorage.getItem('fleet_vehicle_types');
    if (stored) {
      setVehicleTypes(JSON.parse(stored));
    } else {
      // Default vehicle types
      const defaultTypes: VehicleType[] = [
        {
          id: '1',
          name: 'Tanker',
          description: 'Large capacity fuel tanker for bulk transportation',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Delivery Truck',
          description: 'Medium capacity truck for product delivery',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setVehicleTypes(defaultTypes);
      localStorage.setItem('fleet_vehicle_types', JSON.stringify(defaultTypes));
    }
  };

  const loadTrucks = () => {
    const stored = localStorage.getItem('fleet_trucks');
    if (stored) {
      setTrucks(JSON.parse(stored));
    } else {
      // Sample data
      const sampleTrucks: TruckData[] = [
        {
          id: '1',
          registrationNumber: 'ABC-123-XY',
          vehicleType: 'tanker',
          productType: 'AGO',
          capacity: 33000,
          unit: 'liters',
          status: 'in-transit',
          currentLocation: 'Lagos - Port Harcourt Route',
          lastMaintenanceDate: '2024-09-15',
          nextMaintenanceDate: '2024-12-15',
          insuranceExpiryDate: '2025-06-30',
          acquisitionCost: 25000000,
          acquisitionDate: '2023-01-15',
          totalEarnings: 28500000,
          totalExpenses: 15200000,
          netProfit: 13300000,
          remainingDebt: 0,
          isBreakEven: true,
          breakEvenDate: '2024-08-20',
          monthlyEarnings: 1850000,
          monthlyExpenses: 980000,
          annualEarnings: 18500000,
          annualExpenses: 9800000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          registrationNumber: 'DEF-456-XY',
          vehicleType: 'tanker',
          productType: 'LPG',
          capacity: 10000,
          unit: 'kg',
          status: 'available',
          currentLocation: 'Lagos Depot',
          lastMaintenanceDate: '2024-09-01',
          nextMaintenanceDate: '2024-12-01',
          insuranceExpiryDate: '2025-03-15',
          acquisitionCost: 32000000,
          acquisitionDate: '2023-06-10',
          totalEarnings: 18200000,
          totalExpenses: 10500000,
          netProfit: 7700000,
          remainingDebt: 24300000,
          isBreakEven: false,
          monthlyEarnings: 1420000,
          monthlyExpenses: 810000,
          annualEarnings: 14200000,
          annualExpenses: 8100000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          registrationNumber: 'GHI-789-XY',
          vehicleType: 'delivery-truck',
          productType: 'multi-product',
          capacity: 5000,
          unit: 'liters',
          status: 'maintenance',
          currentLocation: 'Workshop - Lagos',
          lastMaintenanceDate: '2024-10-01',
          nextMaintenanceDate: '2025-01-01',
          insuranceExpiryDate: '2025-08-20',
          acquisitionCost: 28000000,
          acquisitionDate: '2024-02-01',
          totalEarnings: 9800000,
          totalExpenses: 6200000,
          netProfit: 3600000,
          remainingDebt: 24400000,
          isBreakEven: false,
          monthlyEarnings: 1380000,
          monthlyExpenses: 850000,
          annualEarnings: 9800000,
          annualExpenses: 6200000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setTrucks(sampleTrucks);
      localStorage.setItem('fleet_trucks', JSON.stringify(sampleTrucks));
    }
  };

  const loadTrips = () => {
    const stored = localStorage.getItem('fleet_trips');
    if (stored) {
      setTrips(JSON.parse(stored));
    } else {
      // Sample trips
      const sampleTrips: TruckTrip[] = [
        {
          id: '1',
          tripNumber: 'TRP-2024-001',
          truckId: '1',
          truckRegistration: 'ABC-123-XY',
          driverId: '1',
          origin: 'Lagos Depot',
          destination: 'Port Harcourt Station',
          productType: 'AGO',
          quantity: 33000,
          unit: 'liters',
          distance: 650,
          ratePerKm: 450,
          freight: 292500,
          earnings: 350000,
          totalExpenses: 112500,
          netProfit: 237500,
          status: 'in-progress',
          departureTime: '2024-10-06T08:00:00',
          estimatedArrivalTime: '2024-10-07T20:00:00',
          createdAt: '2024-10-06',
          updatedAt: '2024-10-06',
        },
        {
          id: '2',
          tripNumber: 'TRP-2024-002',
          truckId: '2',
          truckRegistration: 'DEF-456-XY',
          driverId: '2',
          origin: 'Abuja Depot',
          destination: 'Kaduna Station',
          productType: 'LPG',
          quantity: 8000,
          unit: 'kg',
          distance: 180,
          ratePerKm: 500,
          freight: 90000,
          earnings: 120000,
          totalExpenses: 35000,
          netProfit: 85000,
          status: 'scheduled',
          createdAt: '2024-10-06',
          updatedAt: '2024-10-06',
        },
        {
          id: '3',
          tripNumber: 'TRP-2024-003',
          truckId: '1',
          truckRegistration: 'ABC-123-XY',
          driverId: '1',
          origin: 'Port Harcourt Station',
          destination: 'Enugu Depot',
          productType: 'AGO',
          quantity: 30000,
          unit: 'liters',
          distance: 450,
          ratePerKm: 420,
          freight: 189000,
          earnings: 220000,
          totalExpenses: 85000,
          netProfit: 135000,
          status: 'completed',
          departureTime: '2024-10-01T10:00:00',
          arrivalTime: '2024-10-02T16:30:00',
          actualDuration: 30.5,
          createdAt: '2024-10-01',
          updatedAt: '2024-10-02',
        },
      ];
      setTrips(sampleTrips);
      localStorage.setItem('fleet_trips', JSON.stringify(sampleTrips));
    }
  };

  const saveTrucks = (newTrucks: TruckData[]) => {
    setTrucks(newTrucks);
    localStorage.setItem('fleet_trucks', JSON.stringify(newTrucks));
  };

  const saveTrips = (newTrips: TruckTrip[]) => {
    setTrips(newTrips);
    localStorage.setItem('fleet_trips', JSON.stringify(newTrips));
  };

  // Truck CRUD operations
  const handleAddTruck = () => {
    setEditingTruckId(null);
    setTruckForm({
      registrationNumber: '',
      vehicleType: '',
      vehicleTypeId: '',
      productType: 'AGO',
      capacity: '',
      unit: 'liters',
      status: 'available',
      currentLocation: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      insuranceExpiryDate: '',
      acquisitionCost: '',
      acquisitionDate: '',
    });
    setShowTruckModal(true);
  };

  const handleEditTruck = (truck: TruckData) => {
    setEditingTruckId(truck.id);
    setTruckForm({
      registrationNumber: truck.registrationNumber,
      vehicleType: truck.vehicleType,
      vehicleTypeId: truck.vehicleTypeId || '',
      productType: truck.productType,
      capacity: truck.capacity.toString(),
      unit: truck.unit,
      status: truck.status,
      currentLocation: truck.currentLocation || '',
      lastMaintenanceDate: truck.lastMaintenanceDate,
      nextMaintenanceDate: truck.nextMaintenanceDate,
      insuranceExpiryDate: truck.insuranceExpiryDate,
      acquisitionCost: truck.acquisitionCost.toString(),
      acquisitionDate: truck.acquisitionDate,
    });
    setShowTruckModal(true);
  };

  const handleSaveTruck = (e: React.FormEvent) => {
    e.preventDefault();

    const acquisitionCost = parseFloat(truckForm.acquisitionCost);
    const now = new Date().toISOString();

    // Get vehicle type name from selected ID
    const selectedVehicleType = vehicleTypes.find(vt => vt.id === truckForm.vehicleTypeId);
    const vehicleTypeName = selectedVehicleType ? selectedVehicleType.name : truckForm.vehicleType;

    const truck: TruckData = editingTruckId
      ? {
          ...trucks.find(t => t.id === editingTruckId)!,
          registrationNumber: truckForm.registrationNumber,
          vehicleType: vehicleTypeName,
          vehicleTypeId: truckForm.vehicleTypeId,
          productType: truckForm.productType,
          capacity: parseFloat(truckForm.capacity),
          unit: truckForm.unit,
          status: truckForm.status,
          currentLocation: truckForm.currentLocation,
          lastMaintenanceDate: truckForm.lastMaintenanceDate,
          nextMaintenanceDate: truckForm.nextMaintenanceDate,
          insuranceExpiryDate: truckForm.insuranceExpiryDate,
          acquisitionCost,
          acquisitionDate: truckForm.acquisitionDate,
          updatedAt: now,
        }
      : {
          id: Date.now().toString(),
          registrationNumber: truckForm.registrationNumber,
          vehicleType: vehicleTypeName,
          vehicleTypeId: truckForm.vehicleTypeId,
          productType: truckForm.productType,
          capacity: parseFloat(truckForm.capacity),
          unit: truckForm.unit,
          status: truckForm.status,
          currentLocation: truckForm.currentLocation,
          lastMaintenanceDate: truckForm.lastMaintenanceDate,
          nextMaintenanceDate: truckForm.nextMaintenanceDate,
          insuranceExpiryDate: truckForm.insuranceExpiryDate,
          acquisitionCost,
          acquisitionDate: truckForm.acquisitionDate,
          totalEarnings: 0,
          totalExpenses: 0,
          netProfit: 0,
          remainingDebt: acquisitionCost,
          isBreakEven: false,
          monthlyEarnings: 0,
          monthlyExpenses: 0,
          annualEarnings: 0,
          annualExpenses: 0,
          createdAt: now,
          updatedAt: now,
        };

    if (editingTruckId) {
      saveTrucks(trucks.map(t => (t.id === editingTruckId ? truck : t)));
    } else {
      saveTrucks([...trucks, truck]);
    }

    setShowTruckModal(false);
  };

  const handleDeleteTruck = (id: string) => {
    if (confirm('Are you sure you want to delete this truck? This action cannot be undone.')) {
      saveTrucks(trucks.filter(t => t.id !== id));
    }
  };

  // Trip CRUD operations
  const handleAddTrip = () => {
    setEditingTripId(null);
    setTripForm({
      truckId: '',
      driverId: '',
      origin: '',
      destination: '',
      productType: 'AGO',
      quantity: '',
      unit: 'liters',
      distance: '',
      ratePerKm: '',
      status: 'scheduled',
      departureTime: '',
      estimatedArrivalTime: '',
      notes: '',
    });
    setShowTripModal(true);
  };

  const handleEditTrip = (trip: TruckTrip) => {
    setEditingTripId(trip.id);
    setTripForm({
      truckId: trip.truckId,
      driverId: trip.driverId,
      origin: trip.origin,
      destination: trip.destination,
      productType: trip.productType,
      quantity: trip.quantity.toString(),
      unit: trip.unit,
      distance: trip.distance.toString(),
      ratePerKm: trip.ratePerKm.toString(),
      status: trip.status,
      departureTime: trip.departureTime || '',
      estimatedArrivalTime: trip.estimatedArrivalTime || '',
      notes: trip.notes || '',
    });
    setShowTripModal(true);
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();

    const distance = parseFloat(tripForm.distance);
    const ratePerKm = parseFloat(tripForm.ratePerKm);
    const quantity = parseFloat(tripForm.quantity);
    const freight = distance * ratePerKm;
    const now = new Date().toISOString();

    const selectedTruck = trucks.find(t => t.id === tripForm.truckId);
    const tripNumber = editingTripId
      ? trips.find(t => t.id === editingTripId)!.tripNumber
      : `TRP-${new Date().getFullYear()}-${String(trips.length + 1).padStart(3, '0')}`;

    const trip: TruckTrip = {
      id: editingTripId || Date.now().toString(),
      tripNumber,
      truckId: tripForm.truckId,
      truckRegistration: selectedTruck?.registrationNumber,
      driverId: tripForm.driverId,
      origin: tripForm.origin,
      destination: tripForm.destination,
      productType: tripForm.productType,
      quantity,
      unit: tripForm.unit,
      distance,
      ratePerKm,
      freight,
      earnings: freight, // Can be adjusted later
      totalExpenses: 0,
      netProfit: freight,
      status: tripForm.status,
      departureTime: tripForm.departureTime || undefined,
      estimatedArrivalTime: tripForm.estimatedArrivalTime || undefined,
      notes: tripForm.notes,
      createdAt: editingTripId ? trips.find(t => t.id === editingTripId)!.createdAt : now,
      updatedAt: now,
    };

    if (editingTripId) {
      saveTrips(trips.map(t => (t.id === editingTripId ? trip : t)));
    } else {
      saveTrips([...trips, trip]);
    }

    setShowTripModal(false);
  };

  const handleDeleteTrip = (id: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      saveTrips(trips.filter(t => t.id !== id));
    }
  };

  const getStatusColor = (status: TruckData['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'loading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTripStatusColor = (status: TruckTrip['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate fleet statistics
  const fleetStats = {
    totalTrucks: trucks.length,
    availableTrucks: trucks.filter(t => t.status === 'available').length,
    inTransit: trucks.filter(t => t.status === 'in-transit').length,
    totalValue: trucks.reduce((sum, t) => sum + t.acquisitionCost, 0),
    totalEarnings: trucks.reduce((sum, t) => sum + t.totalEarnings, 0),
    totalExpenses: trucks.reduce((sum, t) => sum + t.totalExpenses, 0),
    totalProfit: trucks.reduce((sum, t) => sum + t.netProfit, 0),
    breakEvenTrucks: trucks.filter(t => t.isBreakEven).length,
  };

  const tripStats = {
    totalTrips: trips.length,
    scheduled: trips.filter(t => t.status === 'scheduled').length,
    inProgress: trips.filter(t => t.status === 'in-progress').length,
    completed: trips.filter(t => t.status === 'completed').length,
    totalRevenue: trips.reduce((sum, t) => sum + t.earnings, 0),
    totalProfit: trips.reduce((sum, t) => sum + t.netProfit, 0),
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-600" />
              Fleet Management
            </h1>
            <p className="text-gray-600 mt-1">Manage trucks, trips, and fleet operations</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/operations/fleet/financials"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
              Financial Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Fleet Statistics */}
      {activeTab === 'trucks' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Fleet Value</p>
            <p className="text-2xl font-bold text-blue-600">₦{(fleetStats.totalValue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-1">{fleetStats.totalTrucks} trucks</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600">₦{(fleetStats.totalEarnings / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-1">{fleetStats.breakEvenTrucks} break-even</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-purple-600">₦{(fleetStats.totalProfit / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-1">
              {fleetStats.totalEarnings > 0 ? ((fleetStats.totalProfit / fleetStats.totalEarnings) * 100).toFixed(1) : 0}% margin
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Fleet Status</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{fleetStats.availableTrucks}</p>
              <p className="text-sm text-gray-600">available</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{fleetStats.inTransit} in transit</p>
          </div>
        </div>
      )}

      {/* Trip Statistics */}
      {activeTab === 'trips' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Trips</p>
            <p className="text-2xl font-bold text-blue-600">{tripStats.totalTrips}</p>
            <p className="text-xs text-gray-500 mt-1">{tripStats.completed} completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-orange-600">{tripStats.inProgress}</p>
            <p className="text-xs text-gray-500 mt-1">{tripStats.scheduled} scheduled</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₦{(tripStats.totalRevenue / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-purple-600">₦{(tripStats.totalProfit / 1000).toFixed(0)}k</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('trucks')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'trucks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Trucks</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'trips'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Trips & Expenses</span>
              </div>
            </button>
          </div>
          <button
            onClick={() => (activeTab === 'trucks' ? handleAddTruck() : handleAddTrip())}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            {activeTab === 'trucks' ? 'Add Truck' : 'Create Trip'}
          </button>
        </div>

        {/* Trucks Content */}
        {activeTab === 'trucks' && (
          <div className="p-6">
            {trucks.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No trucks in fleet</p>
                <button
                  onClick={handleAddTruck}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Truck
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trucks.map((truck) => (
                  <div key={truck.id} className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{truck.registrationNumber}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(truck.status)}`}>
                            {truck.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {truck.vehicleType} • {truck.productType}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditTruck(truck)}
                          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTruck(truck.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {truck.capacity.toLocaleString()} {truck.unit}
                      </span>
                    </div>

                    {/* Location */}
                    {truck.currentLocation && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        {truck.currentLocation}
                      </div>
                    )}

                    {/* Financial Summary */}
                    <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Acquisition Cost</span>
                        <span className="font-medium text-gray-900">₦{(truck.acquisitionCost / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Net Profit</span>
                        <span className="font-bold text-green-600">₦{(truck.netProfit / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ROI</span>
                        <span className={`font-bold ${truck.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {truck.acquisitionCost > 0 ? ((truck.netProfit / truck.acquisitionCost) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      {truck.isBreakEven ? (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                          <AlertCircle className="h-4 w-4" />
                          Break-even achieved
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining Debt</span>
                          <span className="font-medium text-orange-600">₦{(truck.remainingDebt / 1000000).toFixed(1)}M</span>
                        </div>
                      )}
                    </div>

                    {/* Maintenance */}
                    <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Last Maintenance</span>
                        <span className="text-gray-700">{new Date(truck.lastMaintenanceDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Next Maintenance</span>
                        <span className="font-medium text-gray-700">{new Date(truck.nextMaintenanceDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Insurance Expiry</span>
                        <span className="text-gray-700">{new Date(truck.insuranceExpiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trips Content */}
        {activeTab === 'trips' && (
          <div className="p-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Trip & Expense Management</h4>
                  <p className="text-sm text-blue-800">
                    Click "Manage Trip" on any trip to access detailed expense tracking with categories
                    (fuel, toll, maintenance, driver allowance, parking, loading fees), receipt management,
                    real-time profit calculations, and complete financial breakdown.
                  </p>
                </div>
              </div>
            </div>

            {trips.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No trips scheduled</p>
                <button
                  onClick={handleAddTrip}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Trip
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900">{trip.tripNumber}</h3>
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getTripStatusColor(trip.status)}`}>
                              {trip.status}
                            </span>
                            <span className="text-sm text-gray-600">• {trip.truckRegistration}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditTrip(trip)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/operations/fleet/trips/${trip.id}`}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              title="View trip details, manage expenses, and track financials"
                            >
                              Manage Trip
                            </Link>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center text-gray-700">
                            <MapPin className="h-4 w-4 mr-1" />
                            {trip.origin}
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center text-gray-700">
                            <MapPin className="h-4 w-4 mr-1" />
                            {trip.destination}
                          </div>
                          <span className="text-gray-500">• {trip.distance} km</span>
                        </div>

                        {/* Details */}
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-gray-600">Product:</span>
                            <span className="ml-1 font-medium text-gray-900">{trip.productType}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-1 font-medium text-gray-900">
                              {trip.quantity.toLocaleString()} {trip.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Rate:</span>
                            <span className="ml-1 font-medium text-gray-900">₦{trip.ratePerKm}/km</span>
                          </div>
                        </div>

                        {/* Timing */}
                        {trip.departureTime && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1.5" />
                            Departed: {new Date(trip.departureTime).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Financial Summary */}
                      <div className="text-right space-y-1 ml-6">
                        <div className="text-sm text-gray-600">Net Profit</div>
                        <div className={`text-2xl font-bold ${trip.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₦{trip.netProfit.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Earnings: ₦{trip.earnings.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Expenses: ₦{trip.totalExpenses.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Truck Modal */}
      {showTruckModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTruckId ? 'Edit Truck' : 'Add New Truck'}
                </h2>
                <button
                  onClick={() => setShowTruckModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSaveTruck} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={truckForm.registrationNumber}
                      onChange={(e) => setTruckForm({ ...truckForm, registrationNumber: e.target.value })}
                      placeholder="e.g., ABC-123-XY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                    <select
                      required
                      value={truckForm.vehicleTypeId}
                      onChange={(e) => {
                        const selectedType = vehicleTypes.find(vt => vt.id === e.target.value);
                        setTruckForm({
                          ...truckForm,
                          vehicleTypeId: e.target.value,
                          vehicleType: selectedType ? selectedType.name : ''
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.filter(vt => vt.isActive).map(vt => (
                        <option key={vt.id} value={vt.id}>
                          {vt.name}
                        </option>
                      ))}
                    </select>
                    {vehicleTypes.filter(vt => vt.isActive).length === 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        No active vehicle types found. Please add vehicle types first.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                    <select
                      required
                      value={truckForm.productType}
                      onChange={(e) => setTruckForm({ ...truckForm, productType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AGO">AGO (Diesel)</option>
                      <option value="PMS">PMS (Petrol)</option>
                      <option value="DPK">DPK (Kerosene)</option>
                      <option value="LPG">LPG (Gas)</option>
                      <option value="multi-product">Multi-Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      required
                      value={truckForm.status}
                      onChange={(e) => setTruckForm({ ...truckForm, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="in-transit">In Transit</option>
                      <option value="loading">Loading</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={truckForm.capacity}
                      onChange={(e) => setTruckForm({ ...truckForm, capacity: e.target.value })}
                      placeholder="33000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select
                      required
                      value={truckForm.unit}
                      onChange={(e) => setTruckForm({ ...truckForm, unit: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="liters">Liters</option>
                      <option value="kg">Kilograms</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                  <input
                    type="text"
                    value={truckForm.currentLocation}
                    onChange={(e) => setTruckForm({ ...truckForm, currentLocation: e.target.value })}
                    placeholder="e.g., Lagos Depot"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Maintenance & Insurance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance *</label>
                      <input
                        type="date"
                        required
                        value={truckForm.lastMaintenanceDate}
                        onChange={(e) => setTruckForm({ ...truckForm, lastMaintenanceDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance *</label>
                      <input
                        type="date"
                        required
                        value={truckForm.nextMaintenanceDate}
                        onChange={(e) => setTruckForm({ ...truckForm, nextMaintenanceDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry *</label>
                      <input
                        type="date"
                        required
                        value={truckForm.insuranceExpiryDate}
                        onChange={(e) => setTruckForm({ ...truckForm, insuranceExpiryDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Cost (₦) *</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={truckForm.acquisitionCost}
                        onChange={(e) => setTruckForm({ ...truckForm, acquisitionCost: e.target.value })}
                        placeholder="25000000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date *</label>
                      <input
                        type="date"
                        required
                        value={truckForm.acquisitionDate}
                        onChange={(e) => setTruckForm({ ...truckForm, acquisitionDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowTruckModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTruckId ? 'Update Truck' : 'Add Truck'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTripId ? 'Edit Trip' : 'Create New Trip'}
                </h2>
                <button
                  onClick={() => setShowTripModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSaveTrip} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Truck *</label>
                    <select
                      required
                      value={tripForm.truckId}
                      onChange={(e) => setTripForm({ ...tripForm, truckId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a truck</option>
                      {trucks.map(truck => (
                        <option key={truck.id} value={truck.id}>
                          {truck.registrationNumber} - {truck.productType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver ID *</label>
                    <input
                      type="text"
                      required
                      value={tripForm.driverId}
                      onChange={(e) => setTripForm({ ...tripForm, driverId: e.target.value })}
                      placeholder="DRV-001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
                    <input
                      type="text"
                      required
                      value={tripForm.origin}
                      onChange={(e) => setTripForm({ ...tripForm, origin: e.target.value })}
                      placeholder="Lagos Depot"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                    <input
                      type="text"
                      required
                      value={tripForm.destination}
                      onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                      placeholder="Abuja Station"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                    <select
                      required
                      value={tripForm.productType}
                      onChange={(e) => setTripForm({ ...tripForm, productType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AGO">AGO (Diesel)</option>
                      <option value="PMS">PMS (Petrol)</option>
                      <option value="DPK">DPK (Kerosene)</option>
                      <option value="LPG">LPG (Gas)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      required
                      value={tripForm.status}
                      onChange={(e) => setTripForm({ ...tripForm, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={tripForm.quantity}
                      onChange={(e) => setTripForm({ ...tripForm, quantity: e.target.value })}
                      placeholder="33000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select
                      required
                      value={tripForm.unit}
                      onChange={(e) => setTripForm({ ...tripForm, unit: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="liters">Liters</option>
                      <option value="kg">Kilograms</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={tripForm.distance}
                      onChange={(e) => setTripForm({ ...tripForm, distance: e.target.value })}
                      placeholder="450"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate per KM (₦) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={tripForm.ratePerKm}
                    onChange={(e) => setTripForm({ ...tripForm, ratePerKm: e.target.value })}
                    placeholder="450"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {tripForm.distance && tripForm.ratePerKm && (
                    <p className="text-sm text-gray-600 mt-1">
                      Calculated Freight: ₦{(parseFloat(tripForm.distance) * parseFloat(tripForm.ratePerKm)).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                    <input
                      type="datetime-local"
                      value={tripForm.departureTime}
                      onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Arrival</label>
                    <input
                      type="datetime-local"
                      value={tripForm.estimatedArrivalTime}
                      onChange={(e) => setTripForm({ ...tripForm, estimatedArrivalTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={tripForm.notes}
                    onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Additional notes about this trip..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowTripModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTripId ? 'Update Trip' : 'Create Trip'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
