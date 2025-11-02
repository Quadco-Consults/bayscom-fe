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
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Calendar,
  Droplet,
  FileText,
  Search,
  X
} from 'lucide-react';

interface DippingRecord {
  id: string;
  date: string;
  stationId: string;
  stationName: string;
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  tankId: string;
  openingBalance: number; // Book stock
  waybillQty: number; // Quantity on waybill from depot
  transitLoss: number; // Loss during transport
  receipts: number; // Actual receipt (waybillQty - transitLoss)
  sales: number;
  closingBalance: number; // Calculated (opening + receipts - sales)
  physicalStock: number; // Dipped/measured
  variance: number; // Physical - Closing Balance (Daily Overage/Shortage)
  variancePercentage: number;
  cumulativeVariance: number;
  pricePerLiter: number; // Price per liter for the product
  varianceValue: number; // Variance × Price
  temperature?: number;
  operator: string;
  remarks: string;
  status: 'normal' | 'warning' | 'critical';
  createdAt: string;
}

// Sample data based on JABI DIPPINGS AND LODGEMENTS.xlsx
const sampleDippings: DippingRecord[] = [
  {
    id: '1',
    date: '2025-11-02',
    stationId: '1',
    stationName: 'JABI Station',
    productType: 'PMS',
    tankId: 'T1',
    openingBalance: 24878,
    receipts: 45000,
    sales: 18210,
    closingBalance: 51668,
    physicalStock: 24850,
    variance: -26818,
    variancePercentage: -51.9,
    cumulativeVariance: -26818,
    varianceValue: -3888610, // At ₦145/L
    temperature: 28,
    operator: 'John Doe',
    remarks: 'Major shortage - Investigation required',
    status: 'critical',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    date: '2025-11-01',
    stationId: '1',
    stationName: 'JABI Station',
    productType: 'PMS',
    tankId: 'T1',
    openingBalance: 1974,
    receipts: 59400,
    sales: 12810,
    closingBalance: 48564,
    physicalStock: 61200,
    variance: 12636,
    variancePercentage: 26.0,
    cumulativeVariance: 12636,
    varianceValue: 1832220,
    temperature: 27,
    operator: 'John Doe',
    remarks: 'Overage - possible correction from previous day',
    status: 'warning',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    date: '2025-11-02',
    stationId: '1',
    stationName: 'JABI Station',
    productType: 'AGO',
    tankId: 'T2',
    openingBalance: 15420,
    receipts: 0,
    sales: 321,
    closingBalance: 15099,
    physicalStock: 15050,
    variance: -49,
    variancePercentage: -0.3,
    cumulativeVariance: -49,
    varianceValue: -10290, // At ₦210/L
    temperature: 29,
    operator: 'John Doe',
    remarks: 'Normal variance - within acceptable range',
    status: 'normal',
    createdAt: new Date().toISOString(),
  },
];

export default function DippingPage() {
  const [dippings, setDippings] = useState<DippingRecord[]>(sampleDippings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterProduct, setFilterProduct] = useState<string>('all');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    productType: 'PMS' as 'PMS' | 'AGO' | 'DPK' | 'LPG',
    tankId: '',
    openingBalance: '',
    receipts: '',
    sales: '',
    physicalStock: '',
    temperature: '',
    operator: 'Current User',
    remarks: '',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dippingRecords');
    if (saved) {
      try {
        setDippings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load dipping records:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (dippings.length > 0) {
      localStorage.setItem('dippingRecords', JSON.stringify(dippings));
    }
  }, [dippings]);

  // Calculate variance and status
  const calculateVariance = () => {
    const opening = parseFloat(formData.openingBalance) || 0;
    const receipts = parseFloat(formData.receipts) || 0;
    const sales = parseFloat(formData.sales) || 0;
    const physical = parseFloat(formData.physicalStock) || 0;

    const closingBalance = opening + receipts - sales;
    const variance = physical - closingBalance;
    const variancePercentage = closingBalance > 0 ? (variance / closingBalance) * 100 : 0;

    // Price per litre/kg based on product type
    const prices = { PMS: 617, AGO: 1200, DPK: 900, LPG: 1052 }; // 2025 prices
    const price = prices[formData.productType];
    const varianceValue = variance * price;

    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (Math.abs(variancePercentage) > 2) {
      status = 'critical';
    } else if (Math.abs(variancePercentage) > 1) {
      status = 'warning';
    }

    return {
      closingBalance,
      variance,
      variancePercentage,
      varianceValue,
      status,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const calculated = calculateVariance();

    const newRecord: DippingRecord = {
      id: Date.now().toString(),
      date: formData.date,
      stationId: formData.stationId,
      stationName: 'JABI Station', // Get from station lookup
      productType: formData.productType,
      tankId: formData.tankId,
      openingBalance: parseFloat(formData.openingBalance),
      receipts: parseFloat(formData.receipts) || 0,
      sales: parseFloat(formData.sales),
      closingBalance: calculated.closingBalance,
      physicalStock: parseFloat(formData.physicalStock),
      variance: calculated.variance,
      variancePercentage: calculated.variancePercentage,
      cumulativeVariance: calculated.variance, // Should calculate cumulative
      varianceValue: calculated.varianceValue,
      temperature: parseFloat(formData.temperature) || undefined,
      operator: formData.operator,
      remarks: formData.remarks,
      status: calculated.status,
      createdAt: new Date().toISOString(),
    };

    setDippings(prev => [newRecord, ...prev]);
    setShowAddModal(false);

    // Show alert for critical variance
    if (calculated.status === 'critical') {
      alert(
        `⚠️ CRITICAL VARIANCE DETECTED!\n\n` +
        `Product: ${formData.productType}\n` +
        `Variance: ${calculated.variance.toLocaleString()} litres (${calculated.variancePercentage.toFixed(2)}%)\n` +
        `Value: ₦${Math.abs(calculated.varianceValue).toLocaleString()}\n\n` +
        `This requires immediate investigation!`
      );
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      productType: 'PMS',
      tankId: '',
      openingBalance: '',
      receipts: '',
      sales: '',
      physicalStock: '',
      temperature: '',
      operator: 'Current User',
      remarks: '',
    });
  };

  const getStatusBadge = (status: DippingRecord['status']) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    }
  };

  const getStatusIcon = (status: DippingRecord['status']) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  // Filter dippings
  const filteredDippings = dippings.filter((dip) => {
    const matchesSearch = searchQuery === '' ||
      dip.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dip.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProduct = filterProduct === 'all' || dip.productType === filterProduct;
    const matchesDate = !selectedDate || dip.date === selectedDate;

    return matchesSearch && matchesProduct && matchesDate;
  });

  // Statistics
  const stats = {
    total: filteredDippings.length,
    critical: filteredDippings.filter(d => d.status === 'critical').length,
    warning: filteredDippings.filter(d => d.status === 'warning').length,
    normal: filteredDippings.filter(d => d.status === 'normal').length,
    totalVarianceValue: filteredDippings.reduce((sum, d) => sum + d.varianceValue, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daily Tank Dipping & Stock Reconciliation</h1>
              <p className="text-gray-500">Physical stock measurement and variance tracking</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#2D5016] hover:bg-[#1F3509]">
              <Plus className="mr-2 h-4 w-4" />
              Record Dipping
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by station or product..."
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
              <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <p className="text-xs text-gray-500 mt-1">&gt;2% variance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
              <p className="text-xs text-gray-500 mt-1">1-2% variance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Normal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.normal}</div>
              <p className="text-xs text-gray-500 mt-1">&lt;1% variance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Variance Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalVarianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{Math.abs(stats.totalVarianceValue).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalVarianceValue >= 0 ? 'Overage' : 'Shortage'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dipping Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dipping Records</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDippings.length === 0 ? (
              <div className="text-center py-12">
                <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No dipping records found</p>
                <p className="text-sm text-gray-400 mt-2">Record your first tank dipping to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Station</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Opening</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Receipts</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Sales</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Book Stock</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Physical Stock</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Variance %</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Value (₦)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDippings.map((dip) => (
                      <tr key={dip.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{new Date(dip.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{dip.stationName}</p>
                            <p className="text-xs text-gray-500">Tank {dip.tankId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{dip.productType}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {dip.openingBalance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {dip.receipts.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {dip.sales.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {dip.closingBalance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-blue-900">
                          {dip.physicalStock.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${dip.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dip.variance > 0 ? '+' : ''}{dip.variance.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${dip.variancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dip.variancePercentage > 0 ? '+' : ''}{dip.variancePercentage.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${dip.varianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dip.varianceValue > 0 ? '+' : ''}₦{Math.abs(dip.varianceValue).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(dip.status)}
                            {getStatusBadge(dip.status)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Dipping Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Record Tank Dipping</h2>
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
                      Product Type *
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value as any }))}
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
                      Tank ID *
                    </label>
                    <Input
                      type="text"
                      value={formData.tankId}
                      onChange={(e) => setFormData(prev => ({ ...prev, tankId: e.target.value }))}
                      placeholder="e.g., T1, T2"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">Stock Movement (Litres/KG)</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Balance (Book Stock) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.openingBalance}
                        onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: e.target.value }))}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Receipts (Deliveries)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.receipts}
                        onChange={(e) => setFormData(prev => ({ ...prev, receipts: e.target.value }))}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sales *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.sales}
                        onChange={(e) => setFormData(prev => ({ ...prev, sales: e.target.value }))}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Physical Stock (Dipped) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.physicalStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, physicalStock: e.target.value }))}
                        placeholder="0"
                        required
                        className="font-bold"
                      />
                    </div>
                  </div>

                  {/* Live Calculation Preview */}
                  {formData.openingBalance && formData.sales && formData.physicalStock && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">Calculated Values:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-blue-700">Book Closing Stock:</span>
                          <span className="ml-2 font-bold text-blue-900">
                            {calculateVariance().closingBalance.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Variance:</span>
                          <span className={`ml-2 font-bold ${calculateVariance().variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {calculateVariance().variance > 0 ? '+' : ''}{calculateVariance().variance.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Variance %:</span>
                          <span className={`ml-2 font-bold ${calculateVariance().variancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {calculateVariance().variancePercentage > 0 ? '+' : ''}{calculateVariance().variancePercentage.toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Value (₦):</span>
                          <span className={`ml-2 font-bold ${calculateVariance().varianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {calculateVariance().varianceValue > 0 ? '+' : ''}₦{Math.abs(calculateVariance().varianceValue).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="e.g., 28.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operator *
                    </label>
                    <Input
                      type="text"
                      value={formData.operator}
                      onChange={(e) => setFormData(prev => ({ ...prev, operator: e.target.value }))}
                      placeholder="Name of person who did the dipping"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Any notes or observations about this dipping..."
                    rows={3}
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
                    Save Dipping Record
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
