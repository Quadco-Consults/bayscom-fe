'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Save, Calendar, Building2, AlertCircle, Trash2 } from 'lucide-react';
import { getActiveStations } from '@/lib/utils/stationHelpers';

interface PumpReading {
  pumpNumber: string;
  qtyAtBeginning: number;
  qtyAtEnd: number;
  salesQty: number; // Calculated
  salesNaira: number; // Calculated
  cashReceipt: number;
  diff: number; // Calculated
}

interface ProductSection {
  productType: 'PMS' | 'AGO' | 'DPK';
  pricePerLiter: number;
  pumps: PumpReading[];
  totalSalesQty: number; // Calculated
  totalSalesNaira: number; // Calculated
  totalCashReceipt: number; // Calculated
  totalDiff: number; // Calculated
}

interface DailyPumpSales {
  id: string;
  date: string;
  stationId: string;
  stationName: string;
  shift: string; // "FIRST SHIFT"
  pmsSection: ProductSection;
  dkpSection: ProductSection;
  agoSection: ProductSection;
  grandTotalCashReceipt: number; // Calculated
  createdAt: string;
  updatedAt: string;
}

export default function DailyPumpSalesEntry() {
  const [stations, setStations] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStation, setSelectedStation] = useState('');
  const [dailyRecords, setDailyRecords] = useState<DailyPumpSales[]>([]);
  const [currentRecord, setCurrentRecord] = useState<DailyPumpSales | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadStations();
    loadRecords();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedStation) {
      loadOrCreateDailyRecord();
    }
  }, [selectedDate, selectedStation]);

  const loadStations = () => {
    const activeStations = getActiveStations();
    setStations(activeStations);
    if (activeStations.length > 0 && !selectedStation) {
      setSelectedStation(activeStations[0].id);
    }
  };

  const loadRecords = () => {
    const stored = localStorage.getItem('daily_pump_sales');
    if (stored) {
      setDailyRecords(JSON.parse(stored));
    }
  };

  const saveRecords = (records: DailyPumpSales[]) => {
    setDailyRecords(records);
    localStorage.setItem('daily_pump_sales', JSON.stringify(records));
  };

  const getStationPumpCounts = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    // Default: 8 PMS pumps, 2 DPK pumps, 2 AGO pumps (matching WUSE 2 and WUYE)
    // Can be customized per station
    return {
      pms: 8,
      dpk: 2,
      ago: 2,
    };
  };

  const createEmptyPumps = (count: number): PumpReading[] => {
    return Array.from({ length: count }, (_, i) => ({
      pumpNumber: `P${i + 1}`,
      qtyAtBeginning: 0,
      qtyAtEnd: 0,
      salesQty: 0,
      salesNaira: 0,
      cashReceipt: 0,
      diff: 0,
    }));
  };

  const createEmptyRecord = (): DailyPumpSales => {
    const station = stations.find(s => s.id === selectedStation);
    const pumpCounts = getStationPumpCounts(selectedStation);

    return {
      id: `${selectedDate}-${selectedStation}`,
      date: selectedDate,
      stationId: selectedStation,
      stationName: station?.stationName || '',
      shift: 'FIRST SHIFT',
      pmsSection: {
        productType: 'PMS',
        pricePerLiter: 145, // Historical price from Excel
        pumps: createEmptyPumps(pumpCounts.pms),
        totalSalesQty: 0,
        totalSalesNaira: 0,
        totalCashReceipt: 0,
        totalDiff: 0,
      },
      dkpSection: {
        productType: 'DPK',
        pricePerLiter: 150, // Historical price from Excel
        pumps: createEmptyPumps(pumpCounts.dpk),
        totalSalesQty: 0,
        totalSalesNaira: 0,
        totalCashReceipt: 0,
        totalDiff: 0,
      },
      agoSection: {
        productType: 'AGO',
        pricePerLiter: 185, // Historical price from Excel
        pumps: createEmptyPumps(pumpCounts.ago),
        totalSalesQty: 0,
        totalSalesNaira: 0,
        totalCashReceipt: 0,
        totalDiff: 0,
      },
      grandTotalCashReceipt: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const loadOrCreateDailyRecord = () => {
    const recordId = `${selectedDate}-${selectedStation}`;
    const existing = dailyRecords.find(r => r.id === recordId);

    if (existing) {
      setCurrentRecord(existing);
      setIsEditing(true);
    } else {
      setCurrentRecord(createEmptyRecord());
      setIsEditing(false);
    }
  };

  const calculatePumpValues = (pump: PumpReading, pricePerLiter: number): PumpReading => {
    const salesQty = pump.qtyAtEnd - pump.qtyAtBeginning;
    const salesNaira = salesQty * pricePerLiter;
    const diff = pump.cashReceipt - salesNaira;

    return {
      ...pump,
      salesQty,
      salesNaira,
      diff,
    };
  };

  const calculateSectionTotals = (section: ProductSection): ProductSection => {
    const updatedPumps = section.pumps.map(pump => calculatePumpValues(pump, section.pricePerLiter));

    const totalSalesQty = updatedPumps.reduce((sum, p) => sum + p.salesQty, 0);
    const totalSalesNaira = updatedPumps.reduce((sum, p) => sum + p.salesNaira, 0);
    const totalCashReceipt = updatedPumps.reduce((sum, p) => sum + p.cashReceipt, 0);
    const totalDiff = updatedPumps.reduce((sum, p) => sum + p.diff, 0);

    return {
      ...section,
      pumps: updatedPumps,
      totalSalesQty,
      totalSalesNaira,
      totalCashReceipt,
      totalDiff,
    };
  };

  const updatePumpReading = (
    sectionType: 'pmsSection' | 'dkpSection' | 'agoSection',
    pumpIndex: number,
    field: keyof PumpReading,
    value: number
  ) => {
    if (!currentRecord) return;

    const updatedSection = { ...currentRecord[sectionType] };
    updatedSection.pumps = [...updatedSection.pumps];
    updatedSection.pumps[pumpIndex] = {
      ...updatedSection.pumps[pumpIndex],
      [field]: value,
    };

    const recalculatedSection = calculateSectionTotals(updatedSection);

    const updatedRecord = {
      ...currentRecord,
      [sectionType]: recalculatedSection,
    };

    // Calculate grand total
    updatedRecord.grandTotalCashReceipt =
      updatedRecord.pmsSection.totalCashReceipt +
      updatedRecord.dkpSection.totalCashReceipt +
      updatedRecord.agoSection.totalCashReceipt;

    setCurrentRecord(updatedRecord);
  };

  const updateSectionPrice = (sectionType: 'pmsSection' | 'dkpSection' | 'agoSection', price: number) => {
    if (!currentRecord) return;

    const updatedSection = { ...currentRecord[sectionType], pricePerLiter: price };
    const recalculatedSection = calculateSectionTotals(updatedSection);

    const updatedRecord = {
      ...currentRecord,
      [sectionType]: recalculatedSection,
    };

    updatedRecord.grandTotalCashReceipt =
      updatedRecord.pmsSection.totalCashReceipt +
      updatedRecord.dkpSection.totalCashReceipt +
      updatedRecord.agoSection.totalCashReceipt;

    setCurrentRecord(updatedRecord);
  };

  const handleSave = () => {
    if (!currentRecord) return;

    const updatedRecord = {
      ...currentRecord,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = dailyRecords.findIndex(r => r.id === updatedRecord.id);

    let newRecords: DailyPumpSales[];
    if (existingIndex >= 0) {
      newRecords = [...dailyRecords];
      newRecords[existingIndex] = updatedRecord;
    } else {
      newRecords = [...dailyRecords, updatedRecord];
    }

    saveRecords(newRecords);
    setIsEditing(true);
    alert('Daily pump sales saved successfully!');
  };

  const handleDelete = () => {
    if (!currentRecord) return;
    if (!confirm('Are you sure you want to delete this daily record?')) return;

    const newRecords = dailyRecords.filter(r => r.id !== currentRecord.id);
    saveRecords(newRecords);
    setCurrentRecord(createEmptyRecord());
    setIsEditing(false);
    alert('Record deleted successfully!');
  };

  const renderProductSection = (
    sectionType: 'pmsSection' | 'dkpSection' | 'agoSection',
    title: string,
    color: string
  ) => {
    if (!currentRecord) return null;

    const section = currentRecord[sectionType];

    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-6">
        {/* Section Header */}
        <div className={`px-6 py-4 border-b-2 border-gray-200 ${color}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Price per Liter:</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">₦</span>
                <input
                  type="number"
                  value={section.pricePerLiter}
                  onChange={(e) => updateSectionPrice(sectionType, parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pumps Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">PUMP</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">QTY@BEG</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">QTY@END</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">SALES (QTY)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">SALES (=N=)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">CASH RECEIPT</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">DIFF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {section.pumps.map((pump, index) => (
                <tr key={pump.pumpNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{pump.pumpNumber}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={pump.qtyAtBeginning || ''}
                      onChange={(e) =>
                        updatePumpReading(sectionType, index, 'qtyAtBeginning', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={pump.qtyAtEnd || ''}
                      onChange={(e) =>
                        updatePumpReading(sectionType, index, 'qtyAtEnd', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-blue-600">
                    {pump.salesQty.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    ₦{pump.salesNaira.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={pump.cashReceipt || ''}
                      onChange={(e) =>
                        updatePumpReading(sectionType, index, 'cashReceipt', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                    />
                  </td>
                  <td
                    className={`px-4 py-3 text-right text-sm font-bold ${
                      pump.diff >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {pump.diff >= 0 ? '+' : ''}₦{pump.diff.toLocaleString()}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm text-blue-600">
                  {section.totalSalesQty.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">
                  ₦{section.totalSalesNaira.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">
                  ₦{section.totalCashReceipt.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 text-right text-sm ${
                    section.totalDiff >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {section.totalDiff >= 0 ? '+' : ''}₦{section.totalDiff.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Daily Pump Sales Entry
            </h1>
            <p className="text-gray-600 mt-1">Record all pump meter readings for the day (matches Excel format)</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              {isEditing ? 'Update' : 'Save'} Record
            </button>
          </div>
        </div>
      </div>

      {/* Date and Station Selection */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
            <input
              type="text"
              value={currentRecord?.shift || 'FIRST SHIFT'}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
        </div>
        {isEditing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <AlertCircle className="h-4 w-4" />
            <span>Editing existing record from {new Date(currentRecord?.createdAt || '').toLocaleString()}</span>
          </div>
        )}
      </div>

      {currentRecord && (
        <>
          {/* PMS Section */}
          {renderProductSection('pmsSection', 'PMS (Premium Motor Spirit)', 'bg-blue-50')}

          {/* DPK Section */}
          {renderProductSection('dkpSection', 'DPK (Dual Purpose Kerosene)', 'bg-purple-50')}

          {/* AGO Section */}
          {renderProductSection('agoSection', 'AGO (Automotive Gas Oil / Diesel)', 'bg-orange-50')}

          {/* Grand Total */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">GRAND TOTAL CASH RECEIPT</h2>
              <div className="text-3xl font-bold text-green-600">
                ₦{currentRecord.grandTotalCashReceipt.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">How to use:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Select the date and station for the day you want to record</li>
                  <li>Enter QTY@BEG (beginning meter reading) and QTY@END (ending meter reading) for each pump</li>
                  <li>Enter the CASH RECEIPT (actual cash collected) for each pump</li>
                  <li>SALES QTY, SALES (=N=), and DIFF are calculated automatically</li>
                  <li>Totals are calculated automatically for each product section</li>
                  <li>Green DIFF = overage (more cash than expected), Red DIFF = shortage</li>
                  <li>Click Save to store the record - you can edit it later by selecting the same date and station</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {!currentRecord && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a date and station to start entering pump sales</p>
        </div>
      )}
    </div>
  );
}
