'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface Truck {
  id: string;
  registrationNumber: string;
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
}

export default function FleetFinancialsPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = () => {
    const stored = localStorage.getItem('fleet_trucks');
    if (stored) {
      setTrucks(JSON.parse(stored));
    }
  };

  const selectedTruck = selectedTruckId ? trucks.find(t => t.id === selectedTruckId) : null;

  // Calculate fleet-wide metrics
  const fleetMetrics = {
    totalFleetValue: trucks.reduce((sum, t) => sum + t.acquisitionCost, 0),
    totalFleetEarnings: trucks.reduce((sum, t) => sum + t.totalEarnings, 0),
    totalFleetExpenses: trucks.reduce((sum, t) => sum + t.totalExpenses, 0),
    totalFleetProfit: trucks.reduce((sum, t) => sum + t.netProfit, 0),
    totalRemainingDebt: trucks.reduce((sum, t) => sum + t.remainingDebt, 0),
    breakEvenTrucks: trucks.filter(t => t.isBreakEven).length,
    profitableTrucks: trucks.filter(t => t.netProfit > 0).length,
    averageROI: trucks.length > 0
      ? trucks.reduce((sum, t) => sum + ((t.netProfit / t.acquisitionCost) * 100), 0) / trucks.length
      : 0,
    monthlyFleetEarnings: trucks.reduce((sum, t) => sum + t.monthlyEarnings, 0),
    monthlyFleetExpenses: trucks.reduce((sum, t) => sum + t.monthlyExpenses, 0),
    annualFleetEarnings: trucks.reduce((sum, t) => sum + t.annualEarnings, 0),
    annualFleetExpenses: trucks.reduce((sum, t) => sum + t.annualExpenses, 0),
  };

  const getROIColor = (roi: number) => {
    if (roi >= 50) return 'text-green-600 bg-green-100 border-green-200';
    if (roi >= 20) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (roi >= 0) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  // Generate mock monthly data for chart
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      earnings: Math.random() * 2000000 + 1000000,
      expenses: Math.random() * 1200000 + 600000,
      profit: 0, // Will be calculated
    })).map(m => ({
      ...m,
      profit: m.earnings - m.expenses,
    }));
  };

  const monthlyData = selectedTruck ? getMonthlyData() : [];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedTruck && (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTruckId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                {selectedTruck ? `Financial Report - ${selectedTruck.registrationNumber}` : 'Fleet Financial Analytics'}
              </h1>
              <p className="text-gray-600 mt-1">
                {selectedTruck ? 'Detailed earnings and performance metrics' : 'Comprehensive fleet performance and ROI analysis'}
              </p>
            </div>
          </div>
          <Link
            href="/operations/fleet"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Fleet
          </Link>
        </div>
      </div>

      {!selectedTruck ? (
        <>
          {/* Fleet Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Fleet Value & ROI</p>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">₦{(fleetMetrics.totalFleetValue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600 font-medium mt-1">ROI: {fleetMetrics.averageROI.toFixed(1)}%</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">₦{(fleetMetrics.totalFleetEarnings / 1000000).toFixed(1)}M</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-600">
                <span>Monthly: ₦{(fleetMetrics.monthlyFleetEarnings / 1000).toFixed(0)}k</span>
                <span>Annual: ₦{(fleetMetrics.annualFleetEarnings / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Net Profit</p>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">₦{(fleetMetrics.totalFleetProfit / 1000000).toFixed(1)}M</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-600">
                <span>Margin: {((fleetMetrics.totalFleetProfit / fleetMetrics.totalFleetEarnings) * 100).toFixed(1)}%</span>
                <span>Debt: ₦{(fleetMetrics.totalRemainingDebt / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Fleet Status</p>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{trucks.length}</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-600">
                <span className="text-green-600 font-medium">{fleetMetrics.breakEvenTrucks} break-even</span>
                <span className="text-blue-600 font-medium">{fleetMetrics.profitableTrucks} profitable</span>
              </div>
            </div>
          </div>

          {/* Individual Truck Performance */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Individual Truck Performance</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trucks.map((truck) => {
                  const roi = (truck.netProfit / truck.acquisitionCost) * 100;
                  const monthsSinceAcquisition = Math.floor(
                    (new Date().getTime() - new Date(truck.acquisitionDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
                  );
                  const progressToBreakEven = (truck.netProfit / truck.acquisitionCost) * 100;

                  return (
                    <button
                      key={truck.id}
                      onClick={() => setSelectedTruckId(truck.id)}
                      className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{truck.registrationNumber}</h3>
                          <p className="text-xs text-gray-500">{monthsSinceAcquisition} months in service</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {truck.isBreakEven ? (
                            <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-full">
                              ✓ Break-even
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-full">
                              ⏱ In Progress
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${getROIColor(roi)}`}>
                            ROI: {roi.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Total Earnings</p>
                          <p className="text-sm font-bold text-green-600">₦{(truck.totalEarnings / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total Expenses</p>
                          <p className="text-sm font-bold text-red-600">₦{(truck.totalExpenses / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>

                      {/* Net Profit */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-600">Net Profit</p>
                        <p className="text-xl font-bold text-purple-600">₦{(truck.netProfit / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-gray-500">
                          Margin: {((truck.netProfit / truck.totalEarnings) * 100).toFixed(1)}%
                        </p>
                      </div>

                      {/* Break-Even Progress */}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Break-even Progress</span>
                          <span className="font-medium text-gray-900">{Math.min(progressToBreakEven, 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              truck.isBreakEven ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(progressToBreakEven, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500">Cost: ₦{(truck.acquisitionCost / 1000000).toFixed(1)}M</span>
                          {!truck.isBreakEven && (
                            <span className="text-orange-600 font-medium">
                              ₦{(truck.remainingDebt / 1000000).toFixed(1)}M remaining
                            </span>
                          )}
                          {truck.isBreakEven && truck.breakEvenDate && (
                            <span className="text-green-600 font-medium">
                              Since {new Date(truck.breakEvenDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Monthly Performance */}
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <p className="text-xs text-gray-600 mb-2">This Month</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Earnings</span>
                            <p className="font-medium text-gray-900">₦{(truck.monthlyEarnings / 1000).toFixed(0)}k</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Expenses</span>
                            <p className="font-medium text-gray-900">₦{(truck.monthlyExpenses / 1000).toFixed(0)}k</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Profit</span>
                            <p className="font-bold text-purple-600">
                              ₦{((truck.monthlyEarnings - truck.monthlyExpenses) / 1000).toFixed(0)}k
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Highest ROI */}
                <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
                  <p className="text-sm text-green-700 font-medium mb-2">🏆 Highest ROI</p>
                  {trucks.length > 0 && (() => {
                    const topROI = trucks.reduce((max, truck) =>
                      ((truck.netProfit / truck.acquisitionCost) * 100) > ((max.netProfit / max.acquisitionCost) * 100) ? truck : max
                    );
                    const roi = (topROI.netProfit / topROI.acquisitionCost) * 100;
                    return (
                      <>
                        <p className="text-2xl font-bold text-green-700">{topROI.registrationNumber}</p>
                        <p className="text-xl font-bold text-green-600 mt-1">{roi.toFixed(1)}% ROI</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Net Profit: ₦{(topROI.netProfit / 1000000).toFixed(1)}M
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Highest Monthly Profit */}
                <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
                  <p className="text-sm text-blue-700 font-medium mb-2">💰 Highest Monthly Profit</p>
                  {trucks.length > 0 && (() => {
                    const topMonthly = trucks.reduce((max, truck) =>
                      (truck.monthlyEarnings - truck.monthlyExpenses) > (max.monthlyEarnings - max.monthlyExpenses) ? truck : max
                    );
                    const profit = topMonthly.monthlyEarnings - topMonthly.monthlyExpenses;
                    return (
                      <>
                        <p className="text-2xl font-bold text-blue-700">{topMonthly.registrationNumber}</p>
                        <p className="text-xl font-bold text-blue-600 mt-1">₦{(profit / 1000).toFixed(0)}k</p>
                        <p className="text-sm text-gray-600 mt-2">
                          This Month's Profit
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Most Profitable Overall */}
                <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-4">
                  <p className="text-sm text-purple-700 font-medium mb-2">📈 Most Profitable</p>
                  {trucks.length > 0 && (() => {
                    const topProfit = trucks.reduce((max, truck) =>
                      truck.netProfit > max.netProfit ? truck : max
                    );
                    return (
                      <>
                        <p className="text-2xl font-bold text-purple-700">{topProfit.registrationNumber}</p>
                        <p className="text-xl font-bold text-purple-600 mt-1">₦{(topProfit.netProfit / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Total Net Profit
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Detailed Truck Report */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600">₦{(selectedTruck.totalEarnings / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-gray-500 mt-1">Monthly Avg: ₦{(selectedTruck.monthlyEarnings / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">₦{(selectedTruck.totalExpenses / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-gray-500 mt-1">Monthly Avg: ₦{(selectedTruck.monthlyExpenses / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Net Profit</p>
              <p className="text-3xl font-bold text-purple-600">₦{(selectedTruck.netProfit / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-gray-500 mt-1">
                Margin: {((selectedTruck.netProfit / selectedTruck.totalEarnings) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Toggle View Mode */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Earnings Report</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'annual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>
          </div>

          {/* Monthly/Annual Data */}
          {viewMode === 'monthly' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Monthly Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Earnings</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expenses</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyData.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.month}</td>
                        <td className="px-6 py-4 text-sm text-right text-green-600">₦{data.earnings.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-right text-red-600">₦{data.expenses.toLocaleString()}</td>
                        <td className={`px-6 py-4 text-sm text-right font-bold ${data.profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                          ₦{data.profit.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'annual' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Annual Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Annual Earnings</p>
                  <p className="text-2xl font-bold text-green-600">₦{(selectedTruck.annualEarnings / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600">Annual Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₦{(selectedTruck.annualExpenses / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">Annual Profit</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₦{((selectedTruck.annualEarnings - selectedTruck.annualExpenses) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
