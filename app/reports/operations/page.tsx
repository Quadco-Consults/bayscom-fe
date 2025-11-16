'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  Activity,
  Truck,
  Fuel,
  Flame,
  DollarSign,
  Bike,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Zap,
  Users,
  Target,
  Wrench,
  ShoppingCart,
  FileText,
} from 'lucide-react';

interface OperationalMetrics {
  fleetManagement: {
    totalVehicles: number;
    activeVehicles: number;
    maintenanceScheduled: number;
    fuelConsumption: number;
    averageUtilization: number;
    totalMileage: number;
    maintenanceCosts: number;
    fuelCosts: number;
  };
  fillingStations: {
    totalStations: number;
    activeStations: number;
    dailySales: number;
    monthlyRevenue: number;
    averageTransactionValue: number;
    fuelInventory: number;
    dispenserUptime: number;
    customerSatisfaction: number;
  };
  lpgOperations: {
    totalCylinders: number;
    cylindersInUse: number;
    refillOperations: number;
    deliveryOperations: number;
    safetyIncidents: number;
    cylinderTurnover: number;
    averageDeliveryTime: number;
    customerRetention: number;
  };
  tradingOperations: {
    totalTransactions: number;
    volumeTraded: number;
    averageMargin: number;
    profitability: number;
    creditExposure: number;
    settlementTime: number;
    riskScore: number;
    marketShare: number;
  };
  peddlingOperations: {
    activePeddlers: number;
    routesCovered: number;
    deliveriesCompleted: number;
    averageDeliveryTime: number;
    customerReachRate: number;
    revenuePerPeddler: number;
    fuelEfficiency: number;
    territoryExpansion: number;
  };
}

interface OperationalTrends {
  period: string;
  fleetUtilization: number;
  stationPerformance: number;
  lpgDeliveries: number;
  tradingVolume: number;
  peddlingRevenue: number;
  overallEfficiency: number;
}

const mockOperationalData: OperationalMetrics = {
  fleetManagement: {
    totalVehicles: 125,
    activeVehicles: 118,
    maintenanceScheduled: 12,
    fuelConsumption: 15420.5,
    averageUtilization: 87.3,
    totalMileage: 425650,
    maintenanceCosts: 2850000,
    fuelCosts: 8750000,
  },
  fillingStations: {
    totalStations: 18,
    activeStations: 17,
    dailySales: 45200.75,
    monthlyRevenue: 1356000,
    averageTransactionValue: 8950,
    fuelInventory: 2750000,
    dispenserUptime: 98.7,
    customerSatisfaction: 4.6,
  },
  lpgOperations: {
    totalCylinders: 15000,
    cylindersInUse: 12750,
    refillOperations: 850,
    deliveryOperations: 420,
    safetyIncidents: 0,
    cylinderTurnover: 2.3,
    averageDeliveryTime: 45,
    customerRetention: 92.4,
  },
  tradingOperations: {
    totalTransactions: 245,
    volumeTraded: 875000,
    averageMargin: 12.5,
    profitability: 89.2,
    creditExposure: 15000000,
    settlementTime: 2.1,
    riskScore: 15.8,
    marketShare: 23.5,
  },
  peddlingOperations: {
    activePeddlers: 45,
    routesCovered: 125,
    deliveriesCompleted: 1850,
    averageDeliveryTime: 35,
    customerReachRate: 94.2,
    revenuePerPeddler: 285000,
    fuelEfficiency: 12.5,
    territoryExpansion: 8.7,
  },
};

const mockTrendData: OperationalTrends[] = [
  { period: 'Jan 2024', fleetUtilization: 82, stationPerformance: 88, lpgDeliveries: 78, tradingVolume: 85, peddlingRevenue: 75, overallEfficiency: 81.6 },
  { period: 'Feb 2024', fleetUtilization: 85, stationPerformance: 91, lpgDeliveries: 82, tradingVolume: 89, peddlingRevenue: 79, overallEfficiency: 85.2 },
  { period: 'Mar 2024', fleetUtilization: 88, stationPerformance: 94, lpgDeliveries: 86, tradingVolume: 92, peddlingRevenue: 83, overallEfficiency: 88.6 },
  { period: 'Apr 2024', fleetUtilization: 87, stationPerformance: 96, lpgDeliveries: 89, tradingVolume: 94, peddlingRevenue: 86, overallEfficiency: 90.4 },
  { period: 'May 2024', fleetUtilization: 89, stationPerformance: 98, lpgDeliveries: 92, tradingVolume: 96, peddlingRevenue: 89, overallEfficiency: 92.8 },
  { period: 'Jun 2024', fleetUtilization: 92, stationPerformance: 97, lpgDeliveries: 94, tradingVolume: 98, peddlingRevenue: 92, overallEfficiency: 94.6 },
];

export default function OperationalReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'fleet', label: 'Fleet Management', icon: Truck },
    { id: 'stations', label: 'Filling Stations', icon: Fuel },
    { id: 'lpg', label: 'LPG Operations', icon: Flame },
    { id: 'trading', label: 'Trading', icon: DollarSign },
    { id: 'peddling', label: 'Peddling', icon: Bike },
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Overall Efficiency</p>
              <p className="text-3xl font-bold text-green-600">94.6%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Gauge className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+2.8%</span>
            <span className="text-black ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Active Operations</p>
              <p className="text-3xl font-bold text-blue-600">323</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+15</span>
            <span className="text-black ml-1">new this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Revenue Impact</p>
              <p className="text-3xl font-bold text-[#E67E22]">₦2.8B</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-[#E67E22]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-black ml-1">growth rate</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Safety Score</p>
              <p className="text-3xl font-bold text-green-600">98.7</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">Excellent</span>
            <span className="text-black ml-1">rating</span>
          </div>
        </div>
      </div>

      {/* Operational Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Operational Trends</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">6M</button>
            <button className="px-3 py-1 text-sm bg-[#8B1538] text-white rounded-md">1Y</button>
            <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">All</button>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-black">Operational trends visualization</p>
            <p className="text-sm text-gray-400">Interactive chart showing efficiency trends across all operations</p>
          </div>
        </div>
      </div>

      {/* Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Operation Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <span>Fleet Management</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Fuel className="h-5 w-5 text-green-600 mr-2" />
                <span>Filling Stations</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '97%' }}></div>
                </div>
                <span className="text-sm font-medium">97%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Flame className="h-5 w-5 text-orange-600 mr-2" />
                <span>LPG Operations</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <span className="text-sm font-medium">94%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                <span>Trading Operations</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <span className="text-sm font-medium">98%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bike className="h-5 w-5 text-indigo-600 mr-2" />
                <span>Peddling Operations</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Critical Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Fleet Maintenance Due</p>
                <p className="text-sm text-yellow-700">12 vehicles scheduled for maintenance this week</p>
                <p className="text-xs text-yellow-600 mt-1">Priority: Medium</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">LPG Delivery Optimization</p>
                <p className="text-sm text-blue-700">Route efficiency can be improved by 15%</p>
                <p className="text-xs text-blue-600 mt-1">Suggestion: AI-powered routing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Station Performance</p>
                <p className="text-sm text-green-700">All stations operating above target efficiency</p>
                <p className="text-xs text-green-600 mt-1">Status: Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFleetTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Vehicles</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.fleetManagement.totalVehicles}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-black">
              Active: <span className="font-medium text-green-600">{mockOperationalData.fleetManagement.activeVehicles}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Fuel Consumption</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.fleetManagement.fuelConsumption.toLocaleString()}L</p>
            </div>
            <Fuel className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-black">
              This month: <span className="font-medium">-5.2% vs last month</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Average Utilization</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.fleetManagement.averageUtilization}%</p>
            </div>
            <Gauge className="h-8 w-8 text-[#E67E22]" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">Above target (85%)</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Fleet Performance Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.fleetManagement.totalMileage.toLocaleString()}</p>
            <p className="text-sm text-black">Total Mileage (km)</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">₦{(mockOperationalData.fleetManagement.maintenanceCosts / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Maintenance Costs</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">₦{(mockOperationalData.fleetManagement.fuelCosts / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Fuel Costs</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.fleetManagement.maintenanceScheduled}</p>
            <p className="text-sm text-black">Scheduled Maintenance</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Stations</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.fillingStations.totalStations}</p>
            </div>
            <Fuel className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-black">
              Active: <span className="font-medium text-green-600">{mockOperationalData.fillingStations.activeStations}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Daily Sales</p>
              <p className="text-3xl font-bold text-black">₦{mockOperationalData.fillingStations.dailySales.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">+8.5% vs yesterday</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Dispenser Uptime</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.fillingStations.dispenserUptime}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">Excellent performance</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Station Performance Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">₦{(mockOperationalData.fillingStations.monthlyRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Monthly Revenue</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">₦{mockOperationalData.fillingStations.averageTransactionValue.toLocaleString()}</p>
            <p className="text-sm text-black">Avg Transaction</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">₦{(mockOperationalData.fillingStations.fuelInventory / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-black">Fuel Inventory Value</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.fillingStations.customerSatisfaction}/5</p>
            <p className="text-sm text-black">Customer Rating</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLPGTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Cylinders</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.lpgOperations.totalCylinders.toLocaleString()}</p>
            </div>
            <Flame className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-black">
              In Use: <span className="font-medium text-green-600">{mockOperationalData.lpgOperations.cylindersInUse.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Daily Refills</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.lpgOperations.refillOperations}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">+12% vs last week</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Safety Score</p>
              <p className="text-3xl font-bold text-black">{mockOperationalData.lpgOperations.safetyIncidents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">Zero incidents</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">LPG Performance Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.lpgOperations.deliveryOperations}</p>
            <p className="text-sm text-black">Daily Deliveries</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.lpgOperations.cylinderTurnover}x</p>
            <p className="text-sm text-black">Cylinder Turnover</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.lpgOperations.averageDeliveryTime}min</p>
            <p className="text-sm text-black">Avg Delivery Time</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{mockOperationalData.lpgOperations.customerRetention}%</p>
            <p className="text-sm text-black">Customer Retention</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Operational Reports</h1>
            <p className="mt-1 text-sm text-black">
              Monitor and analyze operational performance across all business units
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
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
          {activeTab === 'fleet' && renderFleetTab()}
          {activeTab === 'stations' && renderStationsTab()}
          {activeTab === 'lpg' && renderLPGTab()}
          {activeTab === 'trading' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Trading Operations</h3>
              <p className="text-black mb-4">Detailed trading performance metrics and analytics</p>
              <p className="text-sm text-gray-400">Coming soon - comprehensive trading reports</p>
            </div>
          )}
          {activeTab === 'peddling' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Peddling Operations</h3>
              <p className="text-black mb-4">Territory coverage and revenue performance metrics</p>
              <p className="text-sm text-gray-400">Coming soon - detailed peddling analytics</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}