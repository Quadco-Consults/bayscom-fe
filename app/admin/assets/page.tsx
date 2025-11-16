'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Monitor,
  Laptop,
  Printer,
  Car,
  Wrench,
  MapPin,
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Search,
  Edit,
  Eye,
  X,
  QrCode,
  Building,
  TrendingUp,
  Archive
} from 'lucide-react';

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  description: string;
  category: string;
  type: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  warranty: string;
  warrantyExpiry?: string;
  assignedTo: string;
  assignedDepartment: string;
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs-repair';
  status: 'active' | 'inactive' | 'maintenance' | 'disposed';
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'AST-001',
      assetTag: 'BYS-LPT-001',
      name: 'Dell Latitude 5520',
      description: 'Business laptop for office use',
      category: 'IT Equipment',
      type: 'Laptop',
      serialNumber: 'DL5520ABC123',
      manufacturer: 'Dell',
      model: 'Latitude 5520',
      purchaseDate: '2023-05-15',
      purchasePrice: 350000,
      currentValue: 280000,
      depreciationRate: 20,
      warranty: '3 years',
      warrantyExpiry: '2026-05-15',
      assignedTo: 'John Adebayo',
      assignedDepartment: 'Administration',
      location: 'Lagos Main Office',
      condition: 'excellent',
      status: 'active',
      lastMaintenance: '2024-08-15',
      nextMaintenance: '2024-12-15'
    },
    {
      id: 'AST-002',
      assetTag: 'BYS-PRN-001',
      name: 'HP LaserJet Pro M404n',
      description: 'Network printer for office printing',
      category: 'IT Equipment',
      type: 'Printer',
      serialNumber: 'HPLJ404N456',
      manufacturer: 'HP',
      model: 'LaserJet Pro M404n',
      purchaseDate: '2022-11-20',
      purchasePrice: 120000,
      currentValue: 80000,
      depreciationRate: 15,
      warranty: '2 years',
      warrantyExpiry: '2024-11-20',
      assignedTo: 'Shared Resource',
      assignedDepartment: 'Administration',
      location: 'Lagos Main Office',
      condition: 'good',
      status: 'active',
      lastMaintenance: '2024-09-10',
      nextMaintenance: '2024-12-10'
    },
    {
      id: 'AST-003',
      assetTag: 'BYS-VHC-001',
      name: 'Toyota Hilux',
      description: 'Company pickup truck for operations',
      category: 'Vehicle',
      type: 'Pickup Truck',
      serialNumber: 'TOY2024HIL789',
      manufacturer: 'Toyota',
      model: 'Hilux 2.4L',
      purchaseDate: '2024-01-10',
      purchasePrice: 15000000,
      currentValue: 14000000,
      depreciationRate: 10,
      warranty: '3 years',
      warrantyExpiry: '2027-01-10',
      assignedTo: 'Operations Team',
      assignedDepartment: 'Operations',
      location: 'Port Harcourt Depot',
      condition: 'excellent',
      status: 'active',
      lastMaintenance: '2024-10-15',
      nextMaintenance: '2024-12-15'
    },
    {
      id: 'AST-004',
      assetTag: 'BYS-GEN-001',
      name: 'Mikano Generator 15KVA',
      description: 'Standby power generator',
      category: 'Equipment',
      type: 'Generator',
      serialNumber: 'MIK15KVA2023',
      manufacturer: 'Mikano',
      model: 'MKG15000',
      purchaseDate: '2023-08-20',
      purchasePrice: 800000,
      currentValue: 650000,
      depreciationRate: 12,
      warranty: '2 years',
      warrantyExpiry: '2025-08-20',
      assignedTo: 'Maintenance Team',
      assignedDepartment: 'Operations',
      location: 'Abuja Branch',
      condition: 'good',
      status: 'active',
      lastMaintenance: '2024-10-01',
      nextMaintenance: '2024-12-01'
    },
    {
      id: 'AST-005',
      assetTag: 'BYS-FRN-001',
      name: 'Executive Office Chair',
      description: 'Ergonomic executive chair',
      category: 'Furniture',
      type: 'Office Chair',
      serialNumber: 'EXEC2023CH001',
      manufacturer: 'Office Pro',
      model: 'Executive Plus',
      purchaseDate: '2023-03-10',
      purchasePrice: 85000,
      currentValue: 68000,
      depreciationRate: 10,
      warranty: '2 years',
      warrantyExpiry: '2025-03-10',
      assignedTo: 'CEO Office',
      assignedDepartment: 'Management',
      location: 'Lagos Main Office',
      condition: 'excellent',
      status: 'active'
    },
    {
      id: 'AST-006',
      assetTag: 'BYS-LPT-002',
      name: 'MacBook Pro 14"',
      description: 'Design laptop for creative work',
      category: 'IT Equipment',
      type: 'Laptop',
      serialNumber: 'MBPRO14ABC456',
      manufacturer: 'Apple',
      model: 'MacBook Pro 14" M2',
      purchaseDate: '2023-12-05',
      purchasePrice: 850000,
      currentValue: 680000,
      depreciationRate: 20,
      warranty: '1 year',
      warrantyExpiry: '2024-12-05',
      assignedTo: 'Sarah Johnson',
      assignedDepartment: 'IT',
      location: 'Lagos Main Office',
      condition: 'excellent',
      status: 'maintenance',
      lastMaintenance: '2024-11-01',
      nextMaintenance: '2024-11-15'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');

  // Get unique categories for filters
  const categories = [...new Set(assets.map(asset => asset.category))];

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
  });

  // Calculate statistics
  const totalAssets = assets.length;
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const maintenanceAssets = assets.filter(asset => asset.status === 'maintenance').length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  // Get condition badge
  const getConditionBadge = (condition: string) => {
    const conditionConfig = {
      excellent: { color: 'bg-green-100 text-green-800', label: 'Excellent' },
      good: { color: 'bg-blue-100 text-blue-800', label: 'Good' },
      fair: { color: 'bg-yellow-100 text-yellow-800', label: 'Fair' },
      poor: { color: 'bg-orange-100 text-orange-800', label: 'Poor' },
      'needs-repair': { color: 'bg-red-100 text-red-800', label: 'Needs Repair' }
    };

    const config = conditionConfig[condition as keyof typeof conditionConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance' },
      disposed: { color: 'bg-red-100 text-red-800', label: 'Disposed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get asset icon
  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop':
        return <Laptop className="h-5 w-5 text-blue-500" />;
      case 'printer':
        return <Printer className="h-5 w-5 text-purple-500" />;
      case 'pickup truck':
      case 'vehicle':
        return <Car className="h-5 w-5 text-green-500" />;
      case 'generator':
        return <Wrench className="h-5 w-5 text-orange-500" />;
      default:
        return <Monitor className="h-5 w-5 text-black" />;
    }
  };

  // View asset details
  const viewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Assets Management</h1>
            <p className="text-black mt-1">Track and manage company assets and equipment</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Archive className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Total Assets
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {totalAssets}
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
                      Active
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {activeAssets}
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
                  <Wrench className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Maintenance
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {maintenanceAssets}
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
                  <DollarSign className="h-8 w-8 text-blue-500" />
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
                  placeholder="Search assets..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>

              <div>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="needs-repair">Needs Repair</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setConditionFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getAssetIcon(asset.type)}
                    <div>
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <p className="text-sm text-black">{asset.assetTag}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {getStatusBadge(asset.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Asset Details */}
                  <div>
                    <p className="text-sm font-medium text-black">{asset.manufacturer} {asset.model}</p>
                    <p className="text-xs text-black">{asset.description}</p>
                  </div>

                  {/* Assignment */}
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{asset.assignedTo}</p>
                      <p className="text-xs text-black">{asset.assignedDepartment}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-black">{asset.location}</p>
                  </div>

                  {/* Condition */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Condition:</span>
                    {getConditionBadge(asset.condition)}
                  </div>

                  {/* Value */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-black">Current Value</span>
                      <span className="font-medium">₦{asset.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-black">
                      <span>Purchase Price</span>
                      <span>₦{asset.purchasePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Warranty */}
                  {asset.warrantyExpiry && (
                    <div className="flex items-center space-x-2 text-xs text-black">
                      <Calendar className="h-3 w-3" />
                      <span>Warranty expires: {asset.warrantyExpiry}</span>
                    </div>
                  )}

                  {/* Next Maintenance */}
                  {asset.nextMaintenance && (
                    <div className="flex items-center space-x-2 text-xs text-orange-600">
                      <Wrench className="h-3 w-3" />
                      <span>Next maintenance: {asset.nextMaintenance}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewAsset(asset)}
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
        {filteredAssets.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No assets found</h3>
              <p className="text-black">Try adjusting your search criteria or add a new asset.</p>
            </CardContent>
          </Card>
        )}

        {/* View Asset Modal */}
        {showViewModal && selectedAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {getAssetIcon(selectedAsset.type)}
                    <div>
                      <h2 className="text-xl font-semibold">{selectedAsset.name}</h2>
                      <p className="text-black">{selectedAsset.assetTag}</p>
                    </div>
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
                {/* Asset Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asset Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Description</label>
                        <p className="text-sm text-black">{selectedAsset.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Category</label>
                        <p className="text-sm text-black">{selectedAsset.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Type</label>
                        <p className="text-sm text-black">{selectedAsset.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Serial Number</label>
                        <p className="text-sm text-black font-mono">{selectedAsset.serialNumber}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Manufacturer Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Manufacturer</label>
                        <p className="text-sm text-black">{selectedAsset.manufacturer}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Model</label>
                        <p className="text-sm text-black">{selectedAsset.model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Warranty</label>
                        <p className="text-sm text-black">{selectedAsset.warranty}</p>
                      </div>
                      {selectedAsset.warrantyExpiry && (
                        <div>
                          <label className="text-sm font-medium text-black">Warranty Expiry</label>
                          <p className="text-sm text-black">{selectedAsset.warrantyExpiry}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assignment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Assigned To</label>
                        <p className="text-sm text-black">{selectedAsset.assignedTo}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Department</label>
                        <p className="text-sm text-black">{selectedAsset.assignedDepartment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Location</label>
                        <p className="text-sm text-black">{selectedAsset.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedAsset.status)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#8B1538]">
                          ₦{selectedAsset.purchasePrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-black">Purchase Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₦{selectedAsset.currentValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-black">Current Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedAsset.depreciationRate}%
                        </div>
                        <div className="text-sm text-black">Annual Depreciation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ₦{(selectedAsset.purchasePrice - selectedAsset.currentValue).toLocaleString()}
                        </div>
                        <div className="text-sm text-black">Total Depreciated</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Condition and Maintenance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Condition & Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-black">Condition</label>
                        <div className="mt-1">{getConditionBadge(selectedAsset.condition)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-black">Purchase Date</label>
                        <p className="text-sm text-black">{selectedAsset.purchaseDate}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {(selectedAsset.lastMaintenance || selectedAsset.nextMaintenance) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedAsset.lastMaintenance && (
                          <div>
                            <label className="text-sm font-medium text-black">Last Maintenance</label>
                            <p className="text-sm text-black">{selectedAsset.lastMaintenance}</p>
                          </div>
                        )}
                        {selectedAsset.nextMaintenance && (
                          <div>
                            <label className="text-sm font-medium text-black">Next Maintenance</label>
                            <p className="text-sm text-black">{selectedAsset.nextMaintenance}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Asset
                  </Button>
                  <Button variant="outline">
                    <Wrench className="h-4 w-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                  <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View History
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