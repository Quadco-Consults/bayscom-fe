'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Warehouse,
  Package,
  AlertTriangle,
  CheckCircle,
  X,
  Search,
  Edit,
  Eye,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface StoreLocation {
  id: string;
  name: string;
  code: string;
  type: 'main' | 'branch' | 'warehouse' | 'depot';
  address: string;
  city: string;
  state: string;
  manager: string;
  managerPhone: string;
  managerEmail: string;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  currentStock: number;
  consumablesCount: number;
  assetsCount: number;
  lastInventory: string;
  establishedDate: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreLocation[]>([
    {
      id: 'STR-001',
      name: 'Main Store - Lagos',
      code: 'LGS-MAIN',
      type: 'main',
      address: '123 Victoria Island, Lagos',
      city: 'Lagos',
      state: 'Lagos',
      manager: 'Adebayo Ogundimu',
      managerPhone: '+234 803 123 4567',
      managerEmail: 'a.ogundimu@bayscom.com',
      status: 'active',
      capacity: 10000,
      currentStock: 8500,
      consumablesCount: 245,
      assetsCount: 156,
      lastInventory: '2024-11-10',
      establishedDate: '2020-01-15'
    },
    {
      id: 'STR-002',
      name: 'Abuja Branch Store',
      code: 'ABJ-BR01',
      type: 'branch',
      address: 'Plot 45 Gwarimpa Estate, Abuja',
      city: 'Abuja',
      state: 'FCT',
      manager: 'Fatima Ahmed',
      managerPhone: '+234 807 234 5678',
      managerEmail: 'f.ahmed@bayscom.com',
      status: 'active',
      capacity: 5000,
      currentStock: 3200,
      consumablesCount: 128,
      assetsCount: 89,
      lastInventory: '2024-11-08',
      establishedDate: '2021-06-20'
    },
    {
      id: 'STR-003',
      name: 'Port Harcourt Depot',
      code: 'PHC-DEP01',
      type: 'depot',
      address: 'Trans Amadi Industrial Layout, Port Harcourt',
      city: 'Port Harcourt',
      state: 'Rivers',
      manager: 'Emeka Okafor',
      managerPhone: '+234 812 345 6789',
      managerEmail: 'e.okafor@bayscom.com',
      status: 'active',
      capacity: 15000,
      currentStock: 12800,
      consumablesCount: 189,
      assetsCount: 267,
      lastInventory: '2024-11-12',
      establishedDate: '2019-09-10'
    },
    {
      id: 'STR-004',
      name: 'Kano Warehouse',
      code: 'KNO-WH01',
      type: 'warehouse',
      address: 'Sharada Industrial Estate, Kano',
      city: 'Kano',
      state: 'Kano',
      manager: 'Aisha Bello',
      managerPhone: '+234 816 456 7890',
      managerEmail: 'a.bello@bayscom.com',
      status: 'maintenance',
      capacity: 8000,
      currentStock: 2100,
      consumablesCount: 67,
      assetsCount: 45,
      lastInventory: '2024-10-28',
      establishedDate: '2022-03-05'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter stores based on search and filters
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    const matchesType = typeFilter === 'all' || store.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate summary statistics
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.status === 'active').length;
  const totalCapacity = stores.reduce((sum, s) => sum + s.capacity, 0);
  const totalCurrentStock = stores.reduce((sum, s) => sum + s.currentStock, 0);
  const utilizationRate = Math.round((totalCurrentStock / totalCapacity) * 100);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    const typeConfig = {
      main: { color: 'bg-blue-100 text-blue-800', label: 'Main Store' },
      branch: { color: 'bg-purple-100 text-purple-800', label: 'Branch' },
      warehouse: { color: 'bg-orange-100 text-orange-800', label: 'Warehouse' },
      depot: { color: 'bg-indigo-100 text-indigo-800', label: 'Depot' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // View store details
  const viewStore = (store: StoreLocation) => {
    setSelectedStore(store);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Stores Management</h1>
            <p className="text-black mt-1">Manage store locations, inventory, and operations</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Warehouse className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Total Stores
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {totalStores}
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
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Active Stores
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {activeStores}
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
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Total Capacity
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {totalCapacity.toLocaleString()}
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
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Utilization Rate
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {utilizationRate}%
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="main">Main Store</option>
                  <option value="branch">Branch</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="depot">Depot</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <p className="text-sm text-black">{store.code}</p>
                  </div>
                  <div className="space-y-1">
                    {getTypeBadge(store.type)}
                    {getStatusBadge(store.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{store.city}, {store.state}</p>
                      <p className="text-xs text-black">{store.address}</p>
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{store.manager}</p>
                      <p className="text-xs text-black">{store.managerPhone}</p>
                    </div>
                  </div>

                  {/* Capacity & Utilization */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity Utilization</span>
                      <span>{Math.round((store.currentStock / store.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#8B1538] h-2 rounded-full"
                        style={{ width: `${(store.currentStock / store.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>{store.currentStock.toLocaleString()} / {store.capacity.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Inventory Counts */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-xs text-black">Consumables</p>
                      <p className="text-sm font-semibold">{store.consumablesCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-black">Assets</p>
                      <p className="text-sm font-semibold">{store.assetsCount}</p>
                    </div>
                  </div>

                  {/* Last Inventory */}
                  <div className="flex items-center space-x-2 text-xs text-black">
                    <Calendar className="h-3 w-3" />
                    <span>Last inventory: {store.lastInventory}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewStore(store)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredStores.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Warehouse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No stores found</h3>
              <p className="text-black">Try adjusting your search criteria or add a new store.</p>
            </CardContent>
          </Card>
        )}

        {/* View Store Modal */}
        {showViewModal && selectedStore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedStore.name}</h2>
                    <p className="text-black">{selectedStore.code}</p>
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
                {/* Store Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Store Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Type</label>
                        <div className="mt-1">{getTypeBadge(selectedStore.type)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedStore.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Established Date</label>
                        <p className="text-sm text-black">{selectedStore.establishedDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Address</label>
                        <p className="text-sm text-black">{selectedStore.address}</p>
                        <p className="text-sm text-black">{selectedStore.city}, {selectedStore.state}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Store Manager</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Name</label>
                        <p className="text-sm text-black">{selectedStore.manager}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Phone</label>
                        <p className="text-sm text-black">{selectedStore.managerPhone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Email</label>
                        <p className="text-sm text-black">{selectedStore.managerEmail}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Capacity and Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Capacity & Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#8B1538]">
                          {selectedStore.capacity.toLocaleString()}
                        </div>
                        <div className="text-sm text-black">Total Capacity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedStore.currentStock.toLocaleString()}
                        </div>
                        <div className="text-sm text-black">Current Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedStore.consumablesCount}
                        </div>
                        <div className="text-sm text-black">Consumables</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedStore.assetsCount}
                        </div>
                        <div className="text-sm text-black">Assets</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Capacity Utilization</span>
                        <span>{Math.round((selectedStore.currentStock / selectedStore.capacity) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#8B1538] h-3 rounded-full"
                          style={{ width: `${(selectedStore.currentStock / selectedStore.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Last Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Last inventory count: {selectedStore.lastInventory}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Store
                  </Button>
                  <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                    <Package className="h-4 w-4 mr-2" />
                    View Inventory
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