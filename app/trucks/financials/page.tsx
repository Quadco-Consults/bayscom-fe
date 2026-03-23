'use client';
export const dynamic = 'force-dynamic'


import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TruckFinancialCard } from '@/components/trucks/truck-financial-card';
import { FleetFinancialOverview } from '@/components/trucks/fleet-financial-overview';
import { EarningsReport } from '@/components/trucks/earnings-report';
import { TruckFinancialSummary, FleetFinancialReport } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TruckFinancialsPage() {
  const [selectedTruck, setSelectedTruck] = useState<TruckFinancialSummary | null>(null);

  // Mock data - replace with actual API calls
  const mockTrucks: TruckFinancialSummary[] = [
    {
      truckId: '1',
      registrationNumber: 'ABC-123-XY',
      acquisitionCost: 25000000,
      acquisitionDate: '2023-01-15',
      monthsSinceAcquisition: 21,
      totalEarnings: 28500000,
      totalExpenses: 15200000,
      netProfit: 13300000,
      remainingDebt: 0,
      isBreakEven: true,
      breakEvenDate: '2024-08-20',
      roi: 53.2,
      monthlyEarnings: 1850000,
      monthlyExpenses: 980000,
      monthlyProfit: 870000,
      annualEarnings: 18500000,
      annualExpenses: 9800000,
      annualProfit: 8700000,
      totalTrips: 156,
      completedTrips: 152,
      averageEarningsPerTrip: 182692,
      averageExpensesPerTrip: 97435,
    },
    {
      truckId: '2',
      registrationNumber: 'DEF-456-XY',
      acquisitionCost: 32000000,
      acquisitionDate: '2023-06-10',
      monthsSinceAcquisition: 16,
      totalEarnings: 18200000,
      totalExpenses: 10500000,
      netProfit: 7700000,
      remainingDebt: 24300000,
      isBreakEven: false,
      roi: 24.06,
      projectedBreakEvenMonths: 18,
      monthlyEarnings: 1420000,
      monthlyExpenses: 810000,
      monthlyProfit: 610000,
      annualEarnings: 14200000,
      annualExpenses: 8100000,
      annualProfit: 6100000,
      totalTrips: 98,
      completedTrips: 95,
      averageEarningsPerTrip: 185714,
      averageExpensesPerTrip: 107143,
    },
    {
      truckId: '3',
      registrationNumber: 'GHI-789-XY',
      acquisitionCost: 28000000,
      acquisitionDate: '2024-02-01',
      monthsSinceAcquisition: 8,
      totalEarnings: 9800000,
      totalExpenses: 6200000,
      netProfit: 3600000,
      remainingDebt: 24400000,
      isBreakEven: false,
      roi: 12.86,
      projectedBreakEvenMonths: 28,
      monthlyEarnings: 1380000,
      monthlyExpenses: 850000,
      monthlyProfit: 530000,
      annualEarnings: 9800000,
      annualExpenses: 6200000,
      annualProfit: 3600000,
      totalTrips: 52,
      completedTrips: 50,
      averageEarningsPerTrip: 188462,
      averageExpensesPerTrip: 119231,
    },
  ];

  const fleetReport: FleetFinancialReport = {
    totalFleetValue: mockTrucks.reduce((sum, t) => sum + t.acquisitionCost, 0),
    totalFleetEarnings: mockTrucks.reduce((sum, t) => sum + t.totalEarnings, 0),
    totalFleetExpenses: mockTrucks.reduce((sum, t) => sum + t.totalExpenses, 0),
    totalFleetProfit: mockTrucks.reduce((sum, t) => sum + t.netProfit, 0),
    totalRemainingDebt: mockTrucks.reduce((sum, t) => sum + t.remainingDebt, 0),
    breakEvenTrucks: mockTrucks.filter((t) => t.isBreakEven).length,
    profitableTrucks: mockTrucks.filter((t) => t.netProfit > 0).length,
    averageROI: mockTrucks.reduce((sum, t) => sum + t.roi, 0) / mockTrucks.length,
    monthlyFleetEarnings: mockTrucks.reduce((sum, t) => sum + t.monthlyEarnings, 0),
    monthlyFleetExpenses: mockTrucks.reduce((sum, t) => sum + t.monthlyExpenses, 0),
    annualFleetEarnings: mockTrucks.reduce((sum, t) => sum + t.annualEarnings, 0),
    annualFleetExpenses: mockTrucks.reduce((sum, t) => sum + t.annualExpenses, 0),
    trucks: mockTrucks,
  };

  // Mock monthly data for selected truck
  const monthlyData = [
    { month: 'Jan', earnings: 1500000, expenses: 800000, profit: 700000, trips: 12 },
    { month: 'Feb', earnings: 1620000, expenses: 850000, profit: 770000, trips: 13 },
    { month: 'Mar', earnings: 1580000, expenses: 920000, profit: 660000, trips: 11 },
    { month: 'Apr', earnings: 1720000, expenses: 880000, profit: 840000, trips: 14 },
    { month: 'May', earnings: 1650000, expenses: 910000, profit: 740000, trips: 13 },
    { month: 'Jun', earnings: 1780000, expenses: 870000, profit: 910000, trips: 15 },
    { month: 'Jul', earnings: 1850000, expenses: 950000, profit: 900000, trips: 14 },
    { month: 'Aug', earnings: 1820000, expenses: 890000, profit: 930000, trips: 13 },
    { month: 'Sep', earnings: 1690000, expenses: 920000, profit: 770000, trips: 12 },
    { month: 'Oct', earnings: 1850000, expenses: 980000, profit: 870000, trips: 14 },
    { month: 'Nov', earnings: 0, expenses: 0, profit: 0, trips: 0 },
    { month: 'Dec', earnings: 0, expenses: 0, profit: 0, trips: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/trucks">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fleet Financial Analytics</h1>
                <p className="text-gray-500">Track earnings, expenses, and ROI for each truck</p>
              </div>
            </div>
          </div>
        </div>

        {selectedTruck ? (
          /* Detailed View */
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedTruck(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fleet Overview
            </Button>
            <EarningsReport summary={selectedTruck} monthlyData={monthlyData} />
          </div>
        ) : (
          /* Overview */
          <>
            {/* Fleet Summary */}
            <FleetFinancialOverview report={fleetReport} />

            {/* Individual Truck Cards */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Individual Truck Performance</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockTrucks.map((truck) => (
                  <TruckFinancialCard
                    key={truck.truckId}
                    summary={truck}
                    onClick={() => setSelectedTruck(truck)}
                  />
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Top Performers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Highest ROI</p>
                      <p className="text-sm text-gray-500">
                        {mockTrucks.reduce((best, t) => (t.roi > best.roi ? t : best)).registrationNumber}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {mockTrucks.reduce((best, t) => (t.roi > best.roi ? t : best)).roi.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Highest Monthly Profit</p>
                      <p className="text-sm text-gray-500">
                        {mockTrucks.reduce((best, t) => (t.monthlyProfit > best.monthlyProfit ? t : best)).registrationNumber}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ₦{mockTrucks.reduce((best, t) => (t.monthlyProfit > best.monthlyProfit ? t : best)).monthlyProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Most Trips Completed</p>
                      <p className="text-sm text-gray-500">
                        {mockTrucks.reduce((best, t) => (t.completedTrips > best.completedTrips ? t : best)).registrationNumber}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {mockTrucks.reduce((best, t) => (t.completedTrips > best.completedTrips ? t : best)).completedTrips}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
