'use client';

import { useState, useEffect } from 'react';
import { Droplet, Plus, Pencil, Trash2, Search, Download, AlertCircle } from 'lucide-react';
import { getActiveStations } from '@/lib/utils/stationHelpers';

interface DPKStockRecord {
  id: string;
  date: string;
  stationId: string;
  stationName: string;
  // Daily Stock Movements
  openingBalance: number;
  waybillQty: number; // Quantity on waybill from depot
  transitLoss: number; // Loss during transport
  receipts: number; // Actual receipt (waybillQty - transitLoss)
  sales: number; // Sales for the day
  closingBalance: number; // Book balance (opening + receipts - sales)
  physicalStock: number; // Dipped stock (physical measurement)
  dailyOverageShortage: number; // Physical - Closing Balance
  // Pricing and Value
  pricePerLiter: number;
  varianceValue: number; // dailyOverageShortage × pricePerLiter
  // Metadata
  tankId: string;
  recordedBy: string;
  notes: string;
  createdAt: string;
}

export default function DPKStockReconciliation() {
  const [records, setRecords] = useState<DPKStockRecord[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStation, setFilterStation] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    stationId: '',
    stationName: '',
    openingBalance: 0,
    waybillQty: 0,
    transitLoss: 0,
    sales: 0,
    physicalStock: 0,
    pricePerLiter: 900, // Default DPK price
    tankId: '',
    recordedBy: '',
    notes: '',
  });

  useEffect(() => {
    loadStations();
    loadRecords();
  }, []);

  const loadStations = () => {
    const activeStations = getActiveStations().filter(s =>
      s.productsAvailable.includes('DPK')
    );
    setStations(activeStations);
  };

  const loadRecords = () => {
    const stored = localStorage.getItem('dpk_stock_records');
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      // Sample data
      const sampleData: DPKStockRecord[] = [
        {
          id: '1',
          date: '2025-03-01',
          stationId: 'jabi-001',
          stationName: 'JABI Station',
          openingBalance: 8500,
          waybillQty: 15000,
          transitLoss: 150, // 1% transit loss
          receipts: 14850,
          sales: 9200,
          closingBalance: 14150,
          physicalStock: 14080,
          dailyOverageShortage: -70,
          pricePerLiter: 900,
          varianceValue: -63000,
          tankId: 'DPK-T1',
          recordedBy: 'John Doe',
          notes: 'Normal operations',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: '2025-03-02',
          stationId: 'jabi-001',
          stationName: 'JABI Station',
          openingBalance: 14080,
          waybillQty: 0,
          transitLoss: 0,
          receipts: 0,
          sales: 4500,
          closingBalance: 9580,
          physicalStock: 9550,
          dailyOverageShortage: -30,
          pricePerLiter: 900,
          varianceValue: -27000,
          tankId: 'DPK-T1',
          recordedBy: 'John Doe',
          notes: 'No delivery',
          createdAt: new Date().toISOString(),
        },
      ];
      setRecords(sampleData);
      localStorage.setItem('dpk_stock_records', JSON.stringify(sampleData));
    }
  };

  const saveRecords = (newRecords: DPKStockRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('dpk_stock_records', JSON.stringify(newRecords));
  };

  const calculateValues = (data: any) => {
    const receipts = data.waybillQty - data.transitLoss;
    const closingBalance = data.openingBalance + receipts - data.sales;
    const dailyOverageShortage = data.physicalStock - closingBalance;
    const varianceValue = dailyOverageShortage * data.pricePerLiter;

    return {
      receipts,
      closingBalance,
      dailyOverageShortage,
      varianceValue,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const calculated = calculateValues(formData);
    const selectedStation = stations.find(s => s.id === formData.stationId);

    const record: DPKStockRecord = {
      id: editingId || Date.now().toString(),
      ...formData,
      stationName: selectedStation?.stationName || formData.stationName,
      receipts: calculated.receipts,
      closingBalance: calculated.closingBalance,
      dailyOverageShortage: calculated.dailyOverageShortage,
      varianceValue: calculated.varianceValue,
      createdAt: editingId
        ? records.find(r => r.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    if (editingId) {
      saveRecords(records.map(r => (r.id === editingId ? record : r)));
    } else {
      saveRecords([...records, record]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      stationId: '',
      stationName: '',
      openingBalance: 0,
      waybillQty: 0,
      transitLoss: 0,
      sales: 0,
      physicalStock: 0,
      pricePerLiter: 900,
      tankId: '',
      recordedBy: '',
      notes: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (record: DPKStockRecord) => {
    setFormData({
      date: record.date,
      stationId: record.stationId,
      stationName: record.stationName,
      openingBalance: record.openingBalance,
      waybillQty: record.waybillQty,
      transitLoss: record.transitLoss,
      sales: record.sales,
      physicalStock: record.physicalStock,
      pricePerLiter: record.pricePerLiter,
      tankId: record.tankId,
      recordedBy: record.recordedBy,
      notes: record.notes,
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      saveRecords(records.filter(r => r.id !== id));
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.tankId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStation = !filterStation || record.stationId === filterStation;
    const matchesMonth = !filterMonth || record.date.startsWith(filterMonth);
    return matchesSearch && matchesStation && matchesMonth;
  });

  // Calculate summary statistics
  const summary = filteredRecords.reduce(
    (acc, record) => ({
      totalReceipts: acc.totalReceipts + record.receipts,
      totalSales: acc.totalSales + record.sales,
      totalTransitLoss: acc.totalTransitLoss + record.transitLoss,
      totalVariance: acc.totalVariance + record.dailyOverageShortage,
      totalVarianceValue: acc.totalVarianceValue + record.varianceValue,
    }),
    { totalReceipts: 0, totalSales: 0, totalTransitLoss: 0, totalVariance: 0, totalVarianceValue: 0 }
  );

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Station',
      'Tank ID',
      'Opening Balance',
      'Waybill Qty',
      'Transit Loss',
      'Receipts',
      'Sales',
      'Closing Balance',
      'Physical Stock',
      'Daily Overage/Shortage',
      'Price/Liter',
      'Variance Value',
      'Recorded By',
      'Notes',
    ];

    const rows = filteredRecords.map(r => [
      r.date,
      r.stationName,
      r.tankId,
      r.openingBalance,
      r.waybillQty,
      r.transitLoss,
      r.receipts,
      r.sales,
      r.closingBalance,
      r.physicalStock,
      r.dailyOverageShortage,
      r.pricePerLiter,
      r.varianceValue,
      r.recordedBy,
      r.notes,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpk-stock-reconciliation-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Droplet className="h-8 w-8 text-purple-600" />
              DPK Stock Reconciliation
            </h1>
            <p className="text-gray-600 mt-1">Daily stock tracking for Dual Purpose Kerosene (DPK)</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Receipts</p>
          <p className="text-2xl font-bold text-purple-600">{summary.totalReceipts.toLocaleString()}L</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">{summary.totalSales.toLocaleString()}L</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Transit Loss</p>
          <p className="text-2xl font-bold text-red-600">{summary.totalTransitLoss.toLocaleString()}L</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Variance</p>
          <p className={`text-2xl font-bold ${summary.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.totalVariance >= 0 ? '+' : ''}{summary.totalVariance.toLocaleString()}L
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Variance Value</p>
          <p className={`text-2xl font-bold ${summary.totalVarianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₦{summary.totalVarianceValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search station or tank..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Station</label>
            <select
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Stations</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.stationName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full justify-center"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tank</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opening</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Waybill</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transit Loss</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receipts</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Closing</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Physical</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                    No records found. Click "New Record" to add your first DPK stock record.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.stationName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.tankId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{record.openingBalance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{record.waybillQty.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right">{record.transitLoss.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-purple-600 text-right font-medium">{record.receipts.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{record.sales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{record.closingBalance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{record.physicalStock.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${record.dailyOverageShortage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {record.dailyOverageShortage >= 0 ? '+' : ''}{record.dailyOverageShortage.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${record.varianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₦{record.varianceValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'Edit DPK Stock Record' : 'New DPK Stock Record'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Station *</label>
                    <select
                      required
                      value={formData.stationId}
                      onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tank ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.tankId}
                      onChange={(e) => setFormData({ ...formData, tankId: e.target.value })}
                      placeholder="e.g., DPK-T1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance (Liters) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.openingBalance}
                      onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Waybill Quantity (Liters) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.waybillQty}
                      onChange={(e) => setFormData({ ...formData, waybillQty: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transit Loss (Liters) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.transitLoss}
                      onChange={(e) => setFormData({ ...formData, transitLoss: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales (Liters) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.sales}
                      onChange={(e) => setFormData({ ...formData, sales: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Stock (Liters) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.physicalStock}
                      onChange={(e) => setFormData({ ...formData, physicalStock: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Liter (₦) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.pricePerLiter}
                      onChange={(e) => setFormData({ ...formData, pricePerLiter: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recorded By *</label>
                    <input
                      type="text"
                      required
                      value={formData.recordedBy}
                      onChange={(e) => setFormData({ ...formData, recordedBy: e.target.value })}
                      placeholder="Staff name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Any additional notes or observations..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Calculated Preview */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-gray-900 mb-2">Calculated Values</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Receipts:</span>
                      <span className="ml-2 font-medium">{(formData.waybillQty - formData.transitLoss).toLocaleString()} L</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Closing Balance:</span>
                      <span className="ml-2 font-medium">
                        {(formData.openingBalance + (formData.waybillQty - formData.transitLoss) - formData.sales).toLocaleString()} L
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Daily Variance:</span>
                      <span className={`ml-2 font-medium ${
                        (formData.physicalStock - (formData.openingBalance + (formData.waybillQty - formData.transitLoss) - formData.sales)) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {(formData.physicalStock - (formData.openingBalance + (formData.waybillQty - formData.transitLoss) - formData.sales)).toLocaleString()} L
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Variance Value:</span>
                      <span className={`ml-2 font-medium ${
                        ((formData.physicalStock - (formData.openingBalance + (formData.waybillQty - formData.transitLoss) - formData.sales)) * formData.pricePerLiter) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        ₦{((formData.physicalStock - (formData.openingBalance + (formData.waybillQty - formData.transitLoss) - formData.sales)) * formData.pricePerLiter).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editingId ? 'Update Record' : 'Create Record'}
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
