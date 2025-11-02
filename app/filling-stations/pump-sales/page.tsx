'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Gauge,
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Search,
  X,
  TrendingUp
} from 'lucide-react';

interface PumpSalesRecord {
  id: string;
  date: string;
  stationId: string;
  stationName: string;
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  pumpId: string;
  pumpNumber: string; // e.g., P1, P2, P3
  openingReading: number; // Totalizer reading at start (cumulative)
  closingReading: number; // Totalizer reading at end (cumulative)
  salesQuantity: number; // Calculated: Closing - Opening
  pricePerUnit: number; // Price per litre/kg
  salesValue: number; // Calculated: Quantity × Price
  cashCollected: number; // Actual cash received
  variance: number; // Cash - Sales Value
  variancePercentage: number;
  attendant: string;
  shift: 'morning' | 'afternoon' | 'night' | 'full-day';
  remarks: string;
  createdAt: string;
}

// Sample data based on JABI STATION DAILY SALES MARCH.xlsx
const sampleSales: PumpSalesRecord[] = [
  {
    id: '1',
    date: '2025-11-02',
    stationId: '1',
    stationName: 'JABI Station',
    productType: 'PMS',
    pumpId: 'P1',
    pumpNumber: 'P1',
    openingReading: 1070678,
    closingReading: 1076217,
    salesQuantity: 5539, // Actual from Excel
    pricePerUnit: 617, // 2025 price
    salesValue: 3417563,
    cashCollected: 3417563,
    variance: 0,
    variancePercentage: 0,
    attendant: 'Attendant A',
    shift: 'full-day',
    remarks: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    date: '2025-11-02',
    stationId: '1',
    stationName: 'JABI Station',
    productType: 'PMS',
    pumpId: 'P2',
    pumpNumber: 'P2',
    openingReading: 890234,
    closingReading: 893156,
    salesQuantity: 2922,
    pricePerUnit: 617,
    salesValue: 1802874,
    cashCollected: 1800000,
    variance: -2874,
    variancePercentage: -0.16,
    attendant: 'Attendant B',
    shift: 'full-day',
    remarks: 'Minor cash shortage',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    date: '2025-11-02',
    stationId: '1',
    stationName: 'JABI Station',
    productType: 'AGO',
    pumpId: 'AGO1',
    pumpNumber: 'AGO1',
    openingReading: 456789,
    closingReading: 457110,
    salesQuantity: 321, // From Excel example
    pricePerUnit: 1200,
    salesValue: 385200,
    cashCollected: 385200,
    variance: 0,
    variancePercentage: 0,
    attendant: 'Attendant C',
    shift: 'full-day',
    remarks: '',
    createdAt: new Date().toISOString(),
  },
];

export default function PumpSalesPage() {
  const [salesRecords, setSalesRecords] = useState<PumpSalesRecord[]>(sampleSales);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterStation, setFilterStation] = useState<string>('all');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    productType: 'PMS' as 'PMS' | 'AGO' | 'DPK' | 'LPG',
    pumpId: '',
    pumpNumber: '',
    openingReading: '',
    closingReading: '',
    pricePerUnit: '617', // Default PMS price
    cashCollected: '',
    attendant: '',
    shift: 'full-day' as 'morning' | 'afternoon' | 'night' | 'full-day',
    remarks: '',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pumpSalesRecords');
    if (saved) {
      try {
        setSalesRecords(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load pump sales records:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (salesRecords.length > 0) {
      localStorage.setItem('pumpSalesRecords', JSON.stringify(salesRecords));
    }
  }, [salesRecords]);

  // Calculate sales and variance
  const calculateSales = () => {
    const opening = parseFloat(formData.openingReading) || 0;
    const closing = parseFloat(formData.closingReading) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    const cash = parseFloat(formData.cashCollected) || 0;

    const salesQuantity = closing - opening;
    const salesValue = salesQuantity * price;
    const variance = cash - salesValue;
    const variancePercentage = salesValue > 0 ? (variance / salesValue) * 100 : 0;

    return {
      salesQuantity,
      salesValue,
      variance,
      variancePercentage,
    };
  };

  // Update price when product type changes
  const handleProductTypeChange = (productType: string) => {
    const prices = {
      PMS: '617',
      AGO: '1200',
      DPK: '900',
      LPG: '1052',
    };
    setFormData(prev => ({
      ...prev,
      productType: productType as any,
      pricePerUnit: prices[productType as keyof typeof prices],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate totalizer readings
    const opening = parseFloat(formData.openingReading);
    const closing = parseFloat(formData.closingReading);

    if (closing <= opening) {
      alert('Closing reading must be greater than opening reading!\n\nTotalizer meters are cumulative and cannot decrease.');
      return;
    }

    const calculated = calculateSales();

    const newRecord: PumpSalesRecord = {
      id: Date.now().toString(),
      date: formData.date,
      stationId: formData.stationId,
      stationName: 'JABI Station', // Get from station lookup
      productType: formData.productType,
      pumpId: formData.pumpId,
      pumpNumber: formData.pumpNumber,
      openingReading: opening,
      closingReading: closing,
      salesQuantity: calculated.salesQuantity,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      salesValue: calculated.salesValue,
      cashCollected: parseFloat(formData.cashCollected),
      variance: calculated.variance,
      variancePercentage: calculated.variancePercentage,
      attendant: formData.attendant,
      shift: formData.shift,
      remarks: formData.remarks,
      createdAt: new Date().toISOString(),
    };

    setSalesRecords(prev => [newRecord, ...prev]);
    setShowAddModal(false);

    // Alert for significant variance
    if (Math.abs(calculated.variancePercentage) > 1) {
      alert(
        `⚠️ VARIANCE DETECTED!\n\n` +
        `Pump: ${formData.pumpNumber}\n` +
        `Expected: ₦${calculated.salesValue.toLocaleString()}\n` +
        `Collected: ₦${parseFloat(formData.cashCollected).toLocaleString()}\n` +
        `Variance: ₦${Math.abs(calculated.variance).toLocaleString()} (${calculated.variancePercentage.toFixed(2)}%)\n\n` +
        `Please investigate!`
      );
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      productType: 'PMS',
      pumpId: '',
      pumpNumber: '',
      openingReading: '',
      closingReading: '',
      pricePerUnit: '617',
      cashCollected: '',
      attendant: '',
      shift: 'full-day',
      remarks: '',
    });
  };

  // Filter records
  const filteredRecords = salesRecords.filter((record) => {
    const matchesSearch = searchQuery === '' ||
      record.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.pumpNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.attendant.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProduct = filterProduct === 'all' || record.productType === filterProduct;
    const matchesStation = filterStation === 'all' || record.stationId === filterStation;
    const matchesDate = !selectedDate || record.date === selectedDate;

    return matchesSearch && matchesProduct && matchesStation && matchesDate;
  });

  // Statistics
  const stats = {
    totalSales: filteredRecords.reduce((sum, r) => sum + r.salesQuantity, 0),
    totalValue: filteredRecords.reduce((sum, r) => sum + r.salesValue, 0),
    totalCash: filteredRecords.reduce((sum, r) => sum + r.cashCollected, 0),
    totalVariance: filteredRecords.reduce((sum, r) => sum + r.variance, 0),
    recordsWithVariance: filteredRecords.filter(r => Math.abs(r.variance) > 0).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pump Sales Recording</h1>
              <p className="text-gray-500">Daily totalizer readings and sales tracking</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#2D5016] hover:bg-[#1F3509]">
              <Plus className="mr-2 h-4 w-4" />
              Record Sales
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by station, pump, or attendant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />

            <select
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
            >
              <option value="all">All Stations</option>
              <option value="1">JABI</option>
              <option value="2">WUSE 2</option>
              <option value="3">WUYE</option>
              <option value="4">GARKI</option>
            </select>

            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
            >
              <option value="all">All Products</option>
              <option value="PMS">PMS</option>
              <option value="AGO">AGO</option>
              <option value="DPK">DPK</option>
              <option value="LPG">LPG</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Litres/KG</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Expected Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₦{stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Sales × Price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cash Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{stats.totalCash.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Actual cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalVariance >= 0 ? '+' : ''}₦{Math.abs(stats.totalVariance).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalVariance >= 0 ? 'Excess' : 'Shortage'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.recordsWithVariance}</div>
              <p className="text-xs text-gray-500 mt-1">Pumps with variance</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pump Sales Records</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <Gauge className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sales records found</p>
                <p className="text-sm text-gray-400 mt-2">Record pump readings to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Pump</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Opening</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Closing</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Sales (L/KG)</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Value (₦)</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Cash (₦)</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Attendant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{record.stationName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono">
                            {record.pumpNumber}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{record.productType}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 font-mono text-xs">
                          {record.openingReading.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 font-mono text-xs">
                          {record.closingReading.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-blue-900">
                          {record.salesQuantity.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          ₦{record.pricePerUnit}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ₦{record.salesValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-700">
                          ₦{record.cashCollected.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {record.variance === 0 ? (
                            <Badge className="bg-green-100 text-green-800">₦0</Badge>
                          ) : (
                            <Badge className={record.variance > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {record.variance > 0 ? '+' : ''}₦{Math.abs(record.variance).toLocaleString()}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {record.attendant}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr className="font-bold">
                      <td colSpan={6} className="py-3 px-4 text-right text-gray-900">TOTAL:</td>
                      <td className="py-3 px-4 text-right text-blue-900">
                        {stats.totalSales.toLocaleString()}
                      </td>
                      <td className="py-3 px-4"></td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        ₦{stats.totalValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-green-700">
                        ₦{stats.totalCash.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={stats.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {stats.totalVariance >= 0 ? '+' : ''}₦{Math.abs(stats.totalVariance).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Sales Record Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Record Pump Sales</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shift *
                    </label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                      required
                    >
                      <option value="full-day">Full Day</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Station *
                    </label>
                    <select
                      value={formData.stationId}
                      onChange={(e) => setFormData(prev => ({ ...prev, stationId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                      required
                    >
                      <option value="">Select station...</option>
                      <option value="1">JABI Station</option>
                      <option value="2">WUSE 2 Station</option>
                      <option value="3">WUYE Station</option>
                      <option value="4">GARKI Station</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type *
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => handleProductTypeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                      required
                    >
                      <option value="PMS">PMS (Petrol)</option>
                      <option value="AGO">AGO (Diesel)</option>
                      <option value="DPK">DPK (Kerosene)</option>
                      <option value="LPG">LPG (Gas)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pump Number *
                    </label>
                    <Input
                      type="text"
                      value={formData.pumpNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, pumpNumber: e.target.value, pumpId: e.target.value }))}
                      placeholder="e.g., P1, P2, AGO1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attendant *
                    </label>
                    <Input
                      type="text"
                      value={formData.attendant}
                      onChange={(e) => setFormData(prev => ({ ...prev, attendant: e.target.value }))}
                      placeholder="Name of attendant"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">Totalizer Readings (Cumulative Meters)</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Reading *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.openingReading}
                        onChange={(e) => setFormData(prev => ({ ...prev, openingReading: e.target.value }))}
                        placeholder="e.g., 1070678"
                        required
                        className="font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">Start of day meter reading</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Closing Reading *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.closingReading}
                        onChange={(e) => setFormData(prev => ({ ...prev, closingReading: e.target.value }))}
                        placeholder="e.g., 1076217"
                        required
                        className="font-mono font-bold"
                      />
                      <p className="text-xs text-gray-500 mt-1">End of day meter reading</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Unit (₦) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Per litre or kilogram</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cash Collected (₦) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cashCollected}
                      onChange={(e) => setFormData(prev => ({ ...prev, cashCollected: e.target.value }))}
                      placeholder="Actual cash received"
                      required
                    />
                  </div>
                </div>

                {/* Live Calculation Preview */}
                {formData.openingReading && formData.closingReading && formData.pricePerUnit && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Calculated Values:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-700">Sales Quantity:</span>
                        <span className="ml-2 font-bold text-blue-900">
                          {calculateSales().salesQuantity.toLocaleString()} L/KG
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Expected Value:</span>
                        <span className="ml-2 font-bold text-blue-900">
                          ₦{calculateSales().salesValue.toLocaleString()}
                        </span>
                      </div>
                      {formData.cashCollected && (
                        <>
                          <div>
                            <span className="text-blue-700">Variance:</span>
                            <span className={`ml-2 font-bold ${calculateSales().variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {calculateSales().variance >= 0 ? '+' : ''}₦{Math.abs(calculateSales().variance).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-700">Variance %:</span>
                            <span className={`ml-2 font-bold ${calculateSales().variancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {calculateSales().variancePercentage >= 0 ? '+' : ''}{calculateSales().variancePercentage.toFixed(2)}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Any notes about this sale (variances, issues, etc)..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Save Sales Record
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
