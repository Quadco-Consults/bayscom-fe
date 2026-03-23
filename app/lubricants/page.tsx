'use client';
export const dynamic = 'force-dynamic'


import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lubricant } from '@/lib/types';
import { Plus, Edit, Trash2, Droplet, TrendingUp } from 'lucide-react';

export default function LubricantsPage() {
  const [lubricants] = useState<Lubricant[]>([
    {
      id: '1',
      sku: 'LUB-ENG-20W50-4L',
      brand: 'Mobil',
      productName: 'Super 2000 X1',
      viscosityGrade: '20W-50',
      type: 'engine-oil',
      packagingSize: '4',
      unit: 'liters',
      currentStock: 250,
      reorderLevel: 100,
      unitPrice: 12500,
      sellingPrice: 15000,
      supplier: 'Mobil Oil Nigeria',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      sku: 'LUB-ENG-10W40-5L',
      brand: 'Shell',
      productName: 'Helix HX7',
      viscosityGrade: '10W-40',
      type: 'engine-oil',
      packagingSize: '5',
      unit: 'liters',
      currentStock: 180,
      reorderLevel: 80,
      unitPrice: 14000,
      sellingPrice: 17000,
      supplier: 'Shell Nigeria',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      sku: 'LUB-GEAR-80W90-1L',
      brand: 'Total',
      productName: 'Transmission Gear 8',
      viscosityGrade: '80W-90',
      type: 'gear-oil',
      packagingSize: '1',
      unit: 'liters',
      currentStock: 95,
      reorderLevel: 50,
      unitPrice: 3500,
      sellingPrice: 4500,
      supplier: 'Total Nigeria',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '4',
      sku: 'LUB-HYD-AW68-20L',
      brand: 'Castrol',
      productName: 'Hyspin AWS 68',
      viscosityGrade: 'ISO 68',
      type: 'hydraulic-oil',
      packagingSize: '20',
      unit: 'liters',
      currentStock: 45,
      reorderLevel: 30,
      unitPrice: 35000,
      sellingPrice: 42000,
      supplier: 'Castrol Nigeria',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '5',
      sku: 'LUB-GRS-MP2-500G',
      brand: 'Total',
      productName: 'Multis Complex EP 2',
      viscosityGrade: 'NLGI 2',
      type: 'grease',
      packagingSize: '500',
      unit: 'kg',
      currentStock: 120,
      reorderLevel: 60,
      unitPrice: 4200,
      sellingPrice: 5500,
      supplier: 'Total Nigeria',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]);

  const getTypeLabel = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTypeColor = (type: Lubricant['type']) => {
    switch (type) {
      case 'engine-oil':
        return 'default';
      case 'gear-oil':
        return 'secondary';
      case 'hydraulic-oil':
        return 'outline';
      case 'grease':
        return 'success';
      case 'transmission-fluid':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const totalValue = lubricants.reduce((acc, item) => acc + item.currentStock * item.unitPrice, 0);
  const potentialRevenue = lubricants.reduce((acc, item) => acc + item.currentStock * item.sellingPrice, 0);
  const totalProfit = potentialRevenue - totalValue;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lubricants</h1>
            <p className="text-gray-500">Manage lubricants inventory and sales</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lubricant
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lubricants.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Potential Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{potentialRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Potential Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">₦{totalProfit.toLocaleString()}</div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lubricants List */}
        <Card>
          <CardHeader>
            <CardTitle>Lubricants Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lubricants.map((lubricant) => {
                const profitMargin = ((lubricant.sellingPrice - lubricant.unitPrice) / lubricant.unitPrice * 100).toFixed(1);
                return (
                  <div key={lubricant.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <Droplet className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {lubricant.brand} - {lubricant.productName}
                          </h3>
                          <Badge variant="outline">{lubricant.sku}</Badge>
                          <Badge variant={getTypeColor(lubricant.type)}>{getTypeLabel(lubricant.type)}</Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span>Grade: {lubricant.viscosityGrade}</span>
                          <span>Size: {lubricant.packagingSize}{lubricant.unit}</span>
                          <span>Stock: {lubricant.currentStock} units</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Cost Price</p>
                        <p className="text-lg font-semibold">₦{lubricant.unitPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Selling Price</p>
                        <p className="text-lg font-semibold">₦{lubricant.sellingPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Margin</p>
                        <p className="text-lg font-semibold text-green-600">{profitMargin}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Value</p>
                        <p className="text-lg font-semibold">
                          ₦{(lubricant.currentStock * lubricant.unitPrice).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Brands Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Brands Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {Array.from(new Set(lubricants.map((l) => l.brand))).map((brand) => {
                const brandProducts = lubricants.filter((l) => l.brand === brand);
                const brandValue = brandProducts.reduce((acc, l) => acc + l.currentStock * l.unitPrice, 0);
                return (
                  <div key={brand} className="rounded-lg border p-4 text-center">
                    <h3 className="font-semibold text-lg">{brand}</h3>
                    <p className="text-sm text-gray-500 mt-1">{brandProducts.length} Products</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">₦{brandValue.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
