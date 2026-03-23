'use client';
export const dynamic = 'force-dynamic'


import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/lib/types';
import { Plus, Edit, Trash2, AlertTriangle, Package } from 'lucide-react';

export default function InventoryPage() {
  const [items] = useState<InventoryItem[]>([
    {
      id: '1',
      sku: 'LPG-CYL-6KG',
      name: '6kg LPG Cylinder',
      category: 'lpg-cylinders',
      description: 'Standard 6kg LPG gas cylinder',
      unit: 'pieces',
      reorderLevel: 50,
      reorderQuantity: 200,
      currentStock: 145,
      unitPrice: 8500,
      supplier: 'Gasoline Suppliers Ltd',
      location: 'Warehouse A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      sku: 'LPG-CYL-12KG',
      name: '12kg LPG Cylinder',
      category: 'lpg-cylinders',
      description: 'Standard 12kg LPG gas cylinder',
      unit: 'pieces',
      reorderLevel: 30,
      reorderQuantity: 100,
      currentStock: 78,
      unitPrice: 15000,
      supplier: 'Gasoline Suppliers Ltd',
      location: 'Warehouse A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      sku: 'LPG-REG-001',
      name: 'LPG Regulator - Standard',
      category: 'lpg-regulators',
      description: 'Standard pressure LPG regulator',
      unit: 'pieces',
      reorderLevel: 100,
      reorderQuantity: 500,
      currentStock: 45,
      unitPrice: 2500,
      supplier: 'Gas Equipment Co',
      location: 'Warehouse B',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '4',
      sku: 'LPG-HOSE-2M',
      name: 'LPG Gas Hose - 2m',
      category: 'lpg-hoses',
      description: '2 meter reinforced LPG gas hose',
      unit: 'pieces',
      reorderLevel: 150,
      reorderQuantity: 500,
      currentStock: 380,
      unitPrice: 1800,
      supplier: 'Gas Equipment Co',
      location: 'Warehouse B',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '5',
      sku: 'LPG-VALVE-STD',
      name: 'LPG Cylinder Valve',
      category: 'lpg-valves',
      description: 'Standard cylinder safety valve',
      unit: 'pieces',
      reorderLevel: 80,
      reorderQuantity: 300,
      currentStock: 25,
      unitPrice: 3200,
      supplier: 'Safety Equipment Inc',
      location: 'Warehouse A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]);

  const getCategoryLabel = (category: string) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    } else if (item.currentStock <= item.reorderLevel) {
      return { label: 'Low Stock', variant: 'warning' as const };
    } else {
      return { label: 'In Stock', variant: 'success' as const };
    }
  };

  const lowStockItems = items.filter((item) => item.currentStock <= item.reorderLevel);
  const totalValue = items.reduce((acc, item) => acc + item.currentStock * item.unitPrice, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LPG Accessories Inventory</h1>
            <p className="text-gray-500">Manage LPG cylinders, regulators, and accessories</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
                {lowStockItems.length > 0 && <AlertTriangle className="h-5 w-5 text-orange-600" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {items.reduce((acc, item) => acc + item.currentStock, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-900">Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-800">
                {lowStockItems.length} item(s) are running low on stock and need reordering.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => {
                const status = getStockStatus(item);
                return (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.sku}</Badge>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{getCategoryLabel(item.category)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="text-lg font-semibold">
                          {item.currentStock} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Unit Price</p>
                        <p className="text-lg font-semibold">₦{item.unitPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Value</p>
                        <p className="text-lg font-semibold">
                          ₦{(item.currentStock * item.unitPrice).toLocaleString()}
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
      </div>
    </DashboardLayout>
  );
}
