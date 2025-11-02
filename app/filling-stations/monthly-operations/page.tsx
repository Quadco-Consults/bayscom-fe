'use client';

import { useState, useEffect } from 'react';
import { Calendar, Building2, Droplet, DollarSign, Truck, FileText, TrendingUp, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { getActiveStations } from '@/lib/utils/stationHelpers';
import Link from 'next/link';

interface ModuleStatus {
  name: string;
  href: string;
  icon: any;
  recordCount: number;
  expectedDays: number;
  completionPercentage: number;
  status: 'complete' | 'partial' | 'missing';
  description: string;
}

interface MonthlyPackage {
  month: string;
  stationId: string;
  stationName: string;
  totalDays: number;
  modules: ModuleStatus[];
  overallCompletion: number;
  overallStatus: 'complete' | 'partial' | 'missing';
}

export default function MonthlyOperationsPackage() {
  const [packages, setPackages] = useState<MonthlyPackage[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedStation, setSelectedStation] = useState('');

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedStation) {
      generatePackage();
    }
  }, [selectedMonth, selectedStation]);

  const loadStations = () => {
    const activeStations = getActiveStations();
    setStations(activeStations);
    if (activeStations.length > 0 && !selectedStation) {
      setSelectedStation(activeStations[0].id);
    }
  };

  const getDaysInMonth = (month: string): number => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum, 0).getDate();
  };

  const generatePackage = () => {
    const totalDays = getDaysInMonth(selectedMonth);

    // Load data from localStorage
    const pmsRecords = JSON.parse(localStorage.getItem('pms_stock_records') || '[]');
    const agoRecords = JSON.parse(localStorage.getItem('ago_stock_records') || '[]');
    const dpkRecords = JSON.parse(localStorage.getItem('dpk_stock_records') || '[]');
    const lodgements = JSON.parse(localStorage.getItem('bank_lodgements') || '[]');
    const deliveries = JSON.parse(localStorage.getItem('product_deliveries') || '[]');
    const pumpSales = JSON.parse(localStorage.getItem('pump_sales_records') || '[]');
    const dippingRecords = JSON.parse(localStorage.getItem('dipping_records') || '[]');

    // Filter by month and station
    const filterByMonthAndStation = (records: any[]) => {
      return records.filter((r: any) => {
        const matchesMonth = r.date?.startsWith(selectedMonth);
        const matchesStation = r.stationId === selectedStation;
        return matchesMonth && matchesStation;
      });
    };

    const filteredPMS = filterByMonthAndStation(pmsRecords);
    const filteredAGO = filterByMonthAndStation(agoRecords);
    const filteredDPK = filterByMonthAndStation(dpkRecords);
    const filteredLodgements = filterByMonthAndStation(lodgements);
    const filteredDeliveries = filterByMonthAndStation(deliveries);
    const filteredPumpSales = filterByMonthAndStation(pumpSales);
    const filteredDipping = filterByMonthAndStation(dippingRecords);

    // Calculate module status
    const calculateModuleStatus = (
      name: string,
      href: string,
      icon: any,
      recordCount: number,
      expectedDays: number,
      description: string
    ): ModuleStatus => {
      const completionPercentage = expectedDays > 0 ? (recordCount / expectedDays) * 100 : 0;
      let status: 'complete' | 'partial' | 'missing' = 'missing';
      if (completionPercentage >= 90) {
        status = 'complete';
      } else if (completionPercentage > 0) {
        status = 'partial';
      }

      return {
        name,
        href,
        icon,
        recordCount,
        expectedDays,
        completionPercentage,
        status,
        description,
      };
    };

    const modules: ModuleStatus[] = [
      calculateModuleStatus(
        'PMS Stock Reconciliation',
        '/filling-stations/stock-reconciliation/pms',
        Droplet,
        filteredPMS.length,
        totalDays,
        'Daily stock tracking for Premium Motor Spirit'
      ),
      calculateModuleStatus(
        'AGO Stock Reconciliation',
        '/filling-stations/stock-reconciliation/ago',
        Droplet,
        filteredAGO.length,
        totalDays,
        'Daily stock tracking for Automotive Gas Oil (Diesel)'
      ),
      calculateModuleStatus(
        'DPK Stock Reconciliation',
        '/filling-stations/stock-reconciliation/dpk',
        Droplet,
        filteredDPK.length,
        totalDays,
        'Daily stock tracking for Dual Purpose Kerosene'
      ),
      calculateModuleStatus(
        'Daily Tank Dipping',
        '/filling-stations/dipping',
        Droplet,
        filteredDipping.length,
        totalDays,
        'Physical stock measurement records'
      ),
      calculateModuleStatus(
        'Pump Sales Recording',
        '/filling-stations/pump-sales',
        DollarSign,
        filteredPumpSales.length,
        totalDays,
        'Daily pump sales and totalizer readings'
      ),
      calculateModuleStatus(
        'Bank Lodgement',
        '/filling-stations/bank-lodgement',
        Building2,
        filteredLodgements.length,
        totalDays, // Can have multiple per day, so we use total days as baseline
        'Bank deposit tracking with teller numbers'
      ),
      calculateModuleStatus(
        'Product Delivery',
        '/filling-stations/product-delivery',
        Truck,
        filteredDeliveries.length,
        5, // Assume ~5 deliveries per month
        'Waybill and delivery tracking with transit loss'
      ),
    ];

    // Calculate overall completion
    const totalExpectedRecords = modules.reduce((sum, m) => sum + m.expectedDays, 0);
    const totalActualRecords = modules.reduce((sum, m) => sum + m.recordCount, 0);
    const overallCompletion = totalExpectedRecords > 0 ? (totalActualRecords / totalExpectedRecords) * 100 : 0;

    let overallStatus: 'complete' | 'partial' | 'missing' = 'missing';
    if (overallCompletion >= 80) {
      overallStatus = 'complete';
    } else if (overallCompletion > 0) {
      overallStatus = 'partial';
    }

    const selectedStationData = stations.find(s => s.id === selectedStation);

    const pkg: MonthlyPackage = {
      month: selectedMonth,
      stationId: selectedStation,
      stationName: selectedStationData?.stationName || 'Unknown Station',
      totalDays,
      modules,
      overallCompletion,
      overallStatus,
    };

    setPackages([pkg]);
  };

  const currentPackage = packages[0];

  const getStatusColor = (status: 'complete' | 'partial' | 'missing') => {
    switch (status) {
      case 'complete':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'missing':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = (status: 'complete' | 'partial' | 'missing') => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'missing':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Monthly Operations Package
        </h1>
        <p className="text-gray-600 mt-1">Comprehensive view of all filling station operations for the month</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Station</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Station</option>
                {stations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.stationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {currentPackage && (
        <>
          {/* Overall Status Card */}
          <div className={`p-6 rounded-lg border-2 mb-6 ${getStatusColor(currentPackage.overallStatus)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(currentPackage.overallStatus)}
                <div>
                  <h2 className="text-xl font-bold">
                    {currentPackage.stationName} - {new Date(currentPackage.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <p className="text-sm mt-1">
                    {currentPackage.totalDays} days in month • Overall completion: {currentPackage.overallCompletion.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentPackage.overallCompletion.toFixed(0)}%</div>
                <div className="text-sm uppercase font-medium">{currentPackage.overallStatus}</div>
              </div>
            </div>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentPackage.modules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${getStatusColor(module.status)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <module.icon className="h-6 w-6" />
                    <h3 className="font-semibold">{module.name}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </div>

                <p className="text-sm mb-4 opacity-90">{module.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Records Entered:</span>
                    <span className="font-medium">{module.recordCount} / {module.expectedDays}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        module.status === 'complete'
                          ? 'bg-green-600'
                          : module.status === 'partial'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(module.completionPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Completion</span>
                    <span className="font-medium">{module.completionPercentage.toFixed(0)}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/filling-stations/monthly-summary"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">View Summary</div>
                  <div className="text-xs text-gray-500">Monthly consolidated report</div>
                </div>
              </Link>
              <Link
                href="/filling-stations/variance-dashboard"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">Variance Analysis</div>
                  <div className="text-xs text-gray-500">Check discrepancies</div>
                </div>
              </Link>
              <Link
                href="/filling-stations/daily-sales-report"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <FileText className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Daily Reports</div>
                  <div className="text-xs text-gray-500">View daily summaries</div>
                </div>
              </Link>
              <Link
                href="/filling-stations/station-management"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <Building2 className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Manage Stations</div>
                  <div className="text-xs text-gray-500">Station settings</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">How to use the Monthly Operations Package:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Select your station and month to view all operational modules for that period</li>
                  <li>Click on any module card to navigate directly to that module and enter data</li>
                  <li>Green cards indicate complete data (90%+), yellow cards show partial data, red cards indicate missing data</li>
                  <li>Ensure all modules are completed before month-end to generate accurate monthly summaries</li>
                  <li>Use the Quick Actions to view consolidated reports and analyze variances</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {!currentPackage && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a station and month to view the operations package</p>
        </div>
      )}
    </div>
  );
}
