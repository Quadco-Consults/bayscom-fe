'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Fuel, Truck } from 'lucide-react';

export default function DashboardPage() {
  // Mock data - replace with actual API calls
  const stats = {
    totalRevenue: '₦45,231,890',
    revenueChange: 12.5,
    totalSales: '1,234',
    salesChange: 8.2,
    activeStations: '12',
    stationsChange: 0,
    activeTrucks: '28',
    trucksChange: -4.3,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-black">Welcome to Bayscom Energy ERP System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueChange}
            icon={DollarSign}
            iconColor="bg-[#2D5016]"
          />
          <StatsCard
            title="Total Sales"
            value={stats.totalSales}
            change={stats.salesChange}
            icon={ShoppingCart}
            iconColor="bg-[#8B1538]"
          />
          <StatsCard
            title="Active Stations"
            value={stats.activeStations}
            change={stats.stationsChange}
            icon={Fuel}
            iconColor="bg-[#6B0F2A]"
          />
          <StatsCard
            title="Active Trucks"
            value={stats.activeTrucks}
            change={stats.trucksChange}
            icon={Truck}
            iconColor="bg-[#E67E22]"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black">Sale #{1000 + i}</p>
                      <p className="text-xs text-black">2 hours ago</p>
                    </div>
                    <p className="text-sm font-medium text-black">₦{(Math.random() * 50000 + 10000).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Truck Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black">Truck {i + 1} - AGO</p>
                      <p className="text-xs text-black">Lagos to Port Harcourt</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      In Transit
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Filling Stations Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-black">Station {i + 1}</h3>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-black">Lagos, Nigeria</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-black">
                      <span>PMS Tank:</span>
                      <span className="font-medium text-black">{Math.floor(Math.random() * 30 + 70)}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>AGO Tank:</span>
                      <span className="font-medium text-black">{Math.floor(Math.random() * 30 + 70)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
