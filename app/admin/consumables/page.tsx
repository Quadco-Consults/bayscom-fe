'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Package,
  AlertTriangle,
  Search,
  Edit,
  Eye,
  Trash2,
  X,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Calendar,
  Warehouse,
  ShoppingCart
} from 'lucide-react';

interface Consumable {
  id: string;
  itemCode: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  supplier: string;
  storeLocation: string;
  lastRestocked: string;
  expiryDate?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

export default function ConsumablesPage() {
  const [consumables, setConsumables] = useState<Consumable[]>([
    {
      id: 'CSM-001',
      itemCode: 'OFF-001',
      name: 'A4 Printing Paper',
      description: 'White A4 paper for office printing',
      category: 'Office Supplies',
      unit: 'Ream',
      currentStock: 150,
      minimumStock: 50,
      maximumStock: 500,
      unitPrice: 2500,
      supplier: 'Office Mart Ltd',
      storeLocation: 'LGS-MAIN',
      lastRestocked: '2024-11-01',
      status: 'in-stock'
    },
    {
      id: 'CSM-002',
      itemCode: 'CLN-001',
      name: 'Toilet Paper',
      description: 'Soft toilet tissue rolls',
      category: 'Cleaning Supplies',
      unit: 'Pack',
      currentStock: 25,
      minimumStock: 30,
      maximumStock: 200,
      unitPrice: 1200,
      supplier: 'Clean Pro Supplies',
      storeLocation: 'LGS-MAIN',
      lastRestocked: '2024-10-20',
      status: 'low-stock'
    },
    {
      id: 'CSM-003',
      itemCode: 'SFT-001',
      name: 'Hand Sanitizer',
      description: 'Alcohol-based hand sanitizer 500ml',
      category: 'Safety Supplies',
      unit: 'Bottle',
      currentStock: 0,
      minimumStock: 20,
      maximumStock: 100,
      unitPrice: 800,
      supplier: 'Safety First Ltd',
      storeLocation: 'ABJ-BR01',
      lastRestocked: '2024-09-15',
      status: 'out-of-stock'
    },
    {
      id: 'CSM-004',
      itemCode: 'STA-001',
      name: 'Ball Point Pen (Blue)',
      description: 'Blue ink ball point pens',
      category: 'Stationery',
      unit: 'Box',
      currentStock: 80,
      minimumStock: 20,
      maximumStock: 150,
      unitPrice: 1500,
      supplier: 'Stationery Hub',
      storeLocation: 'LGS-MAIN',
      lastRestocked: '2024-11-05',
      status: 'in-stock'
    },
    {
      id: 'CSM-005',
      itemCode: 'MNT-001',
      name: 'Engine Oil (5W-30)',
      description: 'Synthetic engine oil for vehicles',
      category: 'Maintenance',
      unit: 'Liter',
      currentStock: 45,
      minimumStock: 20,
      maximumStock: 200,
      unitPrice: 3500,
      supplier: 'Auto Parts Nigeria',
      storeLocation: 'PHC-DEP01',
      lastRestocked: '2024-10-28',
      status: 'in-stock'
    },
    {
      id: 'CSM-006',
      itemCode: 'MED-001',
      name: 'First Aid Kit',
      description: 'Complete first aid medical kit',
      category: 'Medical Supplies',
      unit: 'Kit',
      currentStock: 12,
      minimumStock: 15,
      maximumStock: 50,
      unitPrice: 8000,
      supplier: 'Medical Supplies Co',
      storeLocation: 'LGS-MAIN',
      lastRestocked: '2024-08-15',
      expiryDate: '2025-08-15',
      status: 'low-stock'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');

  // Get unique categories and stores for filters
  const categories = [...new Set(consumables.map(item => item.category))];
  const stores = [...new Set(consumables.map(item => item.storeLocation))];

  // Filter consumables
  const filteredConsumables = consumables.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesStore = storeFilter === 'all' || item.storeLocation === storeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesStore;
  });

  // Calculate statistics
  const totalItems = consumables.length;
  const lowStockItems = consumables.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = consumables.filter(item => item.status === 'out-of-stock').length;
  const totalValue = consumables.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'in-stock': { color: 'bg-green-100 text-green-800', label: 'In Stock' },
      'low-stock': { color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' },
      'out-of-stock': { color: 'bg-red-100 text-red-800', label: 'Out of Stock' },
      'expired': { color: 'bg-gray-100 text-gray-800', label: 'Expired' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'out-of-stock':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <Calendar className="h-4 w-4 text-black" />;
      default:
        return <Package className="h-4 w-4 text-black" />;
    }
  };

  // View item details
  const viewItem = (item: Consumable) => {
    setSelectedConsumable(item);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Consumables</h1>
            <p className="text-black mt-1">Manage consumable items and inventory levels</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Consumable
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Total Items
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {totalItems}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Low Stock
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {lowStockItems}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Out of Stock
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {outOfStockItems}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Total Value
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      ₦{totalValue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search consumables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <select
                  value={storeFilter}
                  onChange={(e) => setStoreFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Stores</option>
                  {stores.map(store => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setStoreFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Consumables Table */}
        <Card>
          <CardHeader>
            <CardTitle>Consumables Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Store
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConsumables.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">
                              {item.name}
                            </div>
                            <div className="text-sm text-black">
                              {item.itemCode} • {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">{item.category}</div>
                        <div className="text-sm text-black">per {item.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-xs text-black">
                          Min: {item.minimumStock} • Max: {item.maximumStock}
                        </div>
                        {item.status === 'low-stock' && (
                          <div className="text-xs text-yellow-600 font-medium">
                            Below minimum level
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          ₦{item.unitPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-black">
                          Total: ₦{(item.currentStock * item.unitPrice).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">{item.storeLocation}</div>
                        <div className="text-sm text-black">{item.supplier}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                        {item.expiryDate && (
                          <div className="text-xs text-black mt-1">
                            Exp: {item.expiryDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#8B1538] hover:text-[#6B0F2A]"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* No Results */}
        {filteredConsumables.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No consumables found</h3>
              <p className="text-black">Try adjusting your search criteria or add a new consumable item.</p>
            </CardContent>
          </Card>
        )}

        {/* View Consumable Modal */}
        {showViewModal && selectedConsumable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedConsumable.name}</h2>
                    <p className="text-black">{selectedConsumable.itemCode}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Item Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Description</label>
                        <p className="text-sm text-black">{selectedConsumable.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Category</label>
                        <p className="text-sm text-black">{selectedConsumable.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Unit of Measurement</label>
                        <p className="text-sm text-black">{selectedConsumable.unit}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedConsumable.status)}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Supply Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Supplier</label>
                        <p className="text-sm text-black">{selectedConsumable.supplier}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Store Location</label>
                        <p className="text-sm text-black">{selectedConsumable.storeLocation}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Last Restocked</label>
                        <p className="text-sm text-black">{selectedConsumable.lastRestocked}</p>
                      </div>
                      {selectedConsumable.expiryDate && (
                        <div>
                          <label className="text-sm font-medium text-black">Expiry Date</label>
                          <p className="text-sm text-black">{selectedConsumable.expiryDate}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stock & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#8B1538]">
                          {selectedConsumable.currentStock}
                        </div>
                        <div className="text-sm text-black">Current Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {selectedConsumable.minimumStock}
                        </div>
                        <div className="text-sm text-black">Minimum Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedConsumable.maximumStock}
                        </div>
                        <div className="text-sm text-black">Maximum Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ₦{selectedConsumable.unitPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-black">Unit Price</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Stock Level</span>
                        <span>
                          {Math.round((selectedConsumable.currentStock / selectedConsumable.maximumStock) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#8B1538] h-3 rounded-full"
                          style={{
                            width: `${(selectedConsumable.currentStock / selectedConsumable.maximumStock) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-black">
                        Total Inventory Value: ₦{(selectedConsumable.currentStock * selectedConsumable.unitPrice).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Item
                  </Button>
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restock
                  </Button>
                  <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Create Purchase Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}