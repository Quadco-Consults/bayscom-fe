'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, AlertCircle, Building2 } from 'lucide-react';
import { getActiveStations } from '@/lib/utils/stationHelpers';

interface ProductSummary {
  productType: 'PMS' | 'AGO' | 'DPK';
  totalReceipts: number;
  totalSales: number;
  totalTransitLoss: number;
  totalVariance: number;
  totalVarianceValue: number;
  pricePerLiter: number;
}

interface MonthlySummary {
  month: string;
  stationId: string;
  stationName: string;
  // Product Summaries
  products: ProductSummary[];
  // Financial Summary
  totalRevenue: number;
  totalCashCollected: number;
  totalBankLodgements: number;
  cashVariance: number;
  // Delivery Summary
  totalDeliveries: number;
  totalWaybillQty: number;
  totalTransitLoss: number;
  transitLossPercentage: number;
  // Overall Status
  overallVariance: number;
  overallVarianceValue: number;
  status: 'good' | 'warning' | 'critical';
}

export default function MonthlySalesSummary() {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedStation, setSelectedStation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      generateSummary();
    }
  }, [selectedMonth, selectedStation]);

  const loadStations = () => {
    const activeStations = getActiveStations();
    setStations(activeStations);
    if (activeStations.length > 0 && !selectedStation) {
      setSelectedStation(activeStations[0].id);
    }
  };

  const generateSummary = () => {
    setLoading(true);

    // Load data from localStorage
    const pmsRecords = JSON.parse(localStorage.getItem('pms_stock_records') || '[]');
    const agoRecords = JSON.parse(localStorage.getItem('ago_stock_records') || '[]');
    const dpkRecords = JSON.parse(localStorage.getItem('dpk_stock_records') || '[]');
    const lodgements = JSON.parse(localStorage.getItem('bank_lodgements') || '[]');
    const deliveries = JSON.parse(localStorage.getItem('product_deliveries') || '[]');
    const pumpSales = JSON.parse(localStorage.getItem('pump_sales_records') || '[]');

    // Filter by month and station
    const filterByMonthAndStation = (records: any[]) => {
      return records.filter((r: any) => {
        const matchesMonth = r.date.startsWith(selectedMonth);
        const matchesStation = !selectedStation || r.stationId === selectedStation;
        return matchesMonth && matchesStation;
      });
    };

    const filteredPMS = filterByMonthAndStation(pmsRecords);
    const filteredAGO = filterByMonthAndStation(agoRecords);
    const filteredDPK = filterByMonthAndStation(dpkRecords);
    const filteredLodgements = filterByMonthAndStation(lodgements);
    const filteredDeliveries = filterByMonthAndStation(deliveries);
    const filteredPumpSales = filterByMonthAndStation(pumpSales);

    // Calculate product summaries
    const calculateProductSummary = (records: any[], productType: 'PMS' | 'AGO' | 'DPK'): ProductSummary => {
      return records.reduce(
        (acc, record) => ({
          productType,
          totalReceipts: acc.totalReceipts + (record.receipts || 0),
          totalSales: acc.totalSales + (record.sales || 0),
          totalTransitLoss: acc.totalTransitLoss + (record.transitLoss || 0),
          totalVariance: acc.totalVariance + (record.dailyOverageShortage || 0),
          totalVarianceValue: acc.totalVarianceValue + (record.varianceValue || 0),
          pricePerLiter: record.pricePerLiter || acc.pricePerLiter,
        }),
        {
          productType,
          totalReceipts: 0,
          totalSales: 0,
          totalTransitLoss: 0,
          totalVariance: 0,
          totalVarianceValue: 0,
          pricePerLiter: productType === 'PMS' ? 617 : productType === 'AGO' ? 1200 : 900,
        }
      );
    };

    const pmsSummary = calculateProductSummary(filteredPMS, 'PMS');
    const agoSummary = calculateProductSummary(filteredAGO, 'AGO');
    const dpkSummary = calculateProductSummary(filteredDPK, 'DPK');

    // Calculate financial summary from pump sales
    const totalRevenue = filteredPumpSales.reduce((sum: number, sale: any) => sum + (sale.salesValue || 0), 0);
    const totalCashCollected = filteredPumpSales.reduce((sum: number, sale: any) => sum + (sale.cashCollected || 0), 0);

    // Calculate bank lodgements
    const totalBankLodgements = filteredLodgements.reduce(
      (sum: number, lodgement: any) => sum + (lodgement.amountDeposited || 0),
      0
    );

    // Calculate delivery summary
    const totalDeliveries = filteredDeliveries.length;
    const totalWaybillQty = filteredDeliveries.reduce((sum: number, d: any) => sum + (d.loadingQuantity || 0), 0);
    const totalTransitLoss = filteredDeliveries.reduce((sum: number, d: any) => sum + (d.transitLoss || 0), 0);
    const transitLossPercentage = totalWaybillQty > 0 ? (totalTransitLoss / totalWaybillQty) * 100 : 0;

    // Calculate overall variance
    const overallVariance = pmsSummary.totalVariance + agoSummary.totalVariance + dpkSummary.totalVariance;
    const overallVarianceValue = pmsSummary.totalVarianceValue + agoSummary.totalVarianceValue + dpkSummary.totalVarianceValue;

    // Determine status
    let status: 'good' | 'warning' | 'critical' = 'good';
    if (Math.abs(overallVarianceValue) > 500000 || transitLossPercentage > 2) {
      status = 'critical';
    } else if (Math.abs(overallVarianceValue) > 200000 || transitLossPercentage > 1) {
      status = 'warning';
    }

    const selectedStationData = stations.find(s => s.id === selectedStation);

    const summary: MonthlySummary = {
      month: selectedMonth,
      stationId: selectedStation,
      stationName: selectedStationData?.stationName || 'All Stations',
      products: [pmsSummary, agoSummary, dpkSummary].filter(p => p.totalSales > 0 || p.totalReceipts > 0),
      totalRevenue,
      totalCashCollected,
      totalBankLodgements,
      cashVariance: totalCashCollected - totalBankLodgements,
      totalDeliveries,
      totalWaybillQty,
      totalTransitLoss,
      transitLossPercentage,
      overallVariance,
      overallVarianceValue,
      status,
    };

    setSummaries([summary]);
    setLoading(false);
  };

  const exportToCSV = () => {
    if (summaries.length === 0) return;

    const summary = summaries[0];
    const rows: string[][] = [];

    // Header
    rows.push(['MONTHLY SALES SUMMARY']);
    rows.push(['Month:', summary.month]);
    rows.push(['Station:', summary.stationName]);
    rows.push(['']);

    // Product Summary
    rows.push(['PRODUCT SUMMARY']);
    rows.push(['Product', 'Receipts (L)', 'Sales (L)', 'Transit Loss (L)', 'Variance (L)', 'Variance Value (₦)', 'Price/L (₦)']);
    summary.products.forEach(p => {
      rows.push([
        p.productType,
        p.totalReceipts.toFixed(2),
        p.totalSales.toFixed(2),
        p.totalTransitLoss.toFixed(2),
        p.totalVariance.toFixed(2),
        p.totalVarianceValue.toFixed(2),
        p.pricePerLiter.toFixed(2),
      ]);
    });
    rows.push(['']);

    // Financial Summary
    rows.push(['FINANCIAL SUMMARY']);
    rows.push(['Total Revenue:', summary.totalRevenue.toFixed(2)]);
    rows.push(['Cash Collected:', summary.totalCashCollected.toFixed(2)]);
    rows.push(['Bank Lodgements:', summary.totalBankLodgements.toFixed(2)]);
    rows.push(['Cash Variance:', summary.cashVariance.toFixed(2)]);
    rows.push(['']);

    // Delivery Summary
    rows.push(['DELIVERY SUMMARY']);
    rows.push(['Total Deliveries:', summary.totalDeliveries.toString()]);
    rows.push(['Total Waybill Quantity:', summary.totalWaybillQty.toFixed(2)]);
    rows.push(['Total Transit Loss:', summary.totalTransitLoss.toFixed(2)]);
    rows.push(['Transit Loss %:', summary.transitLossPercentage.toFixed(2)]);
    rows.push(['']);

    // Overall Summary
    rows.push(['OVERALL SUMMARY']);
    rows.push(['Overall Variance (L):', summary.overallVariance.toFixed(2)]);
    rows.push(['Overall Variance Value (₦):', summary.overallVarianceValue.toFixed(2)]);
    rows.push(['Status:', summary.status.toUpperCase()]);

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-summary-${summary.month}-${summary.stationName.replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  const currentSummary = summaries[0];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Monthly Sales Summary
            </h1>
            <p className="text-gray-600 mt-1">Consolidated monthly report for all products and operations</p>
          </div>
          {currentSummary && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Export Summary
            </button>
          )}
        </div>
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
                <option value="">All Stations</option>
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

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Generating summary...
        </div>
      )}

      {!loading && currentSummary && (
        <>
          {/* Status Alert */}
          <div
            className={`p-4 rounded-lg border mb-6 ${
              currentSummary.status === 'critical'
                ? 'bg-red-50 border-red-200'
                : currentSummary.status === 'warning'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle
                className={`h-5 w-5 ${
                  currentSummary.status === 'critical'
                    ? 'text-red-600'
                    : currentSummary.status === 'warning'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              />
              <span
                className={`font-medium ${
                  currentSummary.status === 'critical'
                    ? 'text-red-900'
                    : currentSummary.status === 'warning'
                    ? 'text-yellow-900'
                    : 'text-green-900'
                }`}
              >
                {currentSummary.status === 'critical'
                  ? 'Critical: Significant variances detected'
                  : currentSummary.status === 'warning'
                  ? 'Warning: Minor variances detected'
                  : 'Good: Operations within acceptable limits'}
              </span>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Product Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receipts (L)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sales (L)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transit Loss (L)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance (L)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price/L</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentSummary.products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No product data available for this month
                      </td>
                    </tr>
                  ) : (
                    currentSummary.products.map(product => (
                      <tr key={product.productType} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.productType === 'PMS'
                                ? 'bg-blue-100 text-blue-800'
                                : product.productType === 'AGO'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {product.productType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{product.totalReceipts.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{product.totalSales.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-sm text-red-600">{product.totalTransitLoss.toLocaleString()}</td>
                        <td
                          className={`px-6 py-4 text-right text-sm font-medium ${
                            product.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.totalVariance >= 0 ? '+' : ''}
                          {product.totalVariance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">₦{product.pricePerLiter.toLocaleString()}</td>
                        <td
                          className={`px-6 py-4 text-right text-sm font-bold ${
                            product.totalVarianceValue >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          ₦{product.totalVarianceValue.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial & Delivery Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Financial Summary */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Financial Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-lg font-bold text-green-600">₦{currentSummary.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cash Collected</span>
                  <span className="text-lg font-medium text-gray-900">₦{currentSummary.totalCashCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bank Lodgements</span>
                  <span className="text-lg font-medium text-gray-900">₦{currentSummary.totalBankLodgements.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Cash Variance</span>
                    <span
                      className={`text-lg font-bold ${
                        currentSummary.cashVariance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {currentSummary.cashVariance >= 0 ? '+' : ''}₦{currentSummary.cashVariance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Summary */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Delivery Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Deliveries</span>
                  <span className="text-lg font-bold text-blue-600">{currentSummary.totalDeliveries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Waybill Quantity</span>
                  <span className="text-lg font-medium text-gray-900">{currentSummary.totalWaybillQty.toLocaleString()}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Transit Loss</span>
                  <span className="text-lg font-medium text-red-600">{currentSummary.totalTransitLoss.toLocaleString()}L</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Transit Loss %</span>
                    <span
                      className={`text-lg font-bold ${
                        currentSummary.transitLossPercentage <= 1
                          ? 'text-green-600'
                          : currentSummary.transitLossPercentage <= 2
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {currentSummary.transitLossPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Overall Stock Variance</p>
                  <p
                    className={`text-3xl font-bold ${
                      currentSummary.overallVariance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {currentSummary.overallVariance >= 0 ? '+' : ''}
                    {currentSummary.overallVariance.toLocaleString()}L
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Overall Variance Value</p>
                  <p
                    className={`text-3xl font-bold ${
                      currentSummary.overallVarianceValue >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ₦{currentSummary.overallVarianceValue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Overall Status</p>
                  <p
                    className={`text-3xl font-bold uppercase ${
                      currentSummary.status === 'critical'
                        ? 'text-red-600'
                        : currentSummary.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {currentSummary.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !currentSummary && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a month and station to generate the summary</p>
        </div>
      )}
    </div>
  );
}
