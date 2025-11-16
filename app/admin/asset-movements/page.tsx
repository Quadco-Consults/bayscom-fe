'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  TrendingUp,
  ArrowRightLeft,
  MapPin,
  User,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Edit,
  Eye,
  X,
  Package,
  Truck,
  Monitor,
  Laptop,
  FileText,
  Download,
  Filter
} from 'lucide-react';

interface AssetMovement {
  id: string;
  movementId: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  assetType: string;
  movementType: 'transfer' | 'assignment' | 'return' | 'relocation' | 'maintenance' | 'disposal';
  fromLocation: string;
  toLocation: string;
  fromAssignee?: string;
  toAssignee?: string;
  fromDepartment?: string;
  toDepartment?: string;
  initiatedBy: string;
  approvedBy?: string;
  dateInitiated: string;
  dateApproved?: string;
  dateCompleted?: string;
  expectedDate: string;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
  reason: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  documents?: string[];
}

export default function AssetMovementsPage() {
  const [movements, setMovements] = useState<AssetMovement[]>([
    {
      id: 'AM-001',
      movementId: 'AM-2024-001',
      assetId: 'AST-001',
      assetName: 'Dell Latitude 5520',
      assetTag: 'BYS-LPT-001',
      assetType: 'Laptop',
      movementType: 'transfer',
      fromLocation: 'Lagos Main Office',
      toLocation: 'Abuja Branch',
      fromAssignee: 'John Adebayo',
      toAssignee: 'Fatima Ahmed',
      fromDepartment: 'Administration',
      toDepartment: 'Operations',
      initiatedBy: 'IT Manager',
      approvedBy: 'Asset Manager',
      dateInitiated: '2024-11-10',
      dateApproved: '2024-11-11',
      dateCompleted: '2024-11-13',
      expectedDate: '2024-11-15',
      status: 'completed',
      reason: 'Employee transfer to Abuja office',
      condition: 'excellent',
      notes: 'Asset condition verified before transfer'
    },
    {
      id: 'AM-002',
      movementId: 'AM-2024-002',
      assetId: 'AST-003',
      assetName: 'Toyota Hilux',
      assetTag: 'BYS-VHC-001',
      assetType: 'Vehicle',
      movementType: 'relocation',
      fromLocation: 'Lagos Main Office',
      toLocation: 'Port Harcourt Depot',
      fromDepartment: 'Administration',
      toDepartment: 'Operations',
      initiatedBy: 'Operations Manager',
      approvedBy: 'General Manager',
      dateInitiated: '2024-11-08',
      dateApproved: '2024-11-09',
      expectedDate: '2024-11-12',
      status: 'in-transit',
      reason: 'Operational requirements for Port Harcourt depot',
      condition: 'excellent',
      notes: 'Vehicle relocated for field operations support'
    },
    {
      id: 'AM-003',
      movementId: 'AM-2024-003',
      assetId: 'AST-002',
      assetName: 'HP LaserJet Pro M404n',
      assetTag: 'BYS-PRN-001',
      assetType: 'Printer',
      movementType: 'maintenance',
      fromLocation: 'Lagos Main Office',
      toLocation: 'Maintenance Workshop',
      fromAssignee: 'Administration Team',
      initiatedBy: 'IT Support',
      dateInitiated: '2024-11-12',
      expectedDate: '2024-11-16',
      status: 'pending',
      reason: 'Routine maintenance and toner replacement',
      condition: 'good',
      notes: 'Scheduled maintenance to improve print quality'
    },
    {
      id: 'AM-004',
      movementId: 'AM-2024-004',
      assetId: 'AST-005',
      assetName: 'Executive Office Chair',
      assetTag: 'BYS-FRN-001',
      assetType: 'Furniture',
      movementType: 'assignment',
      fromLocation: 'Storage Room',
      toLocation: 'CEO Office',
      toAssignee: 'CEO',
      toDepartment: 'Management',
      initiatedBy: 'Facilities Manager',
      approvedBy: 'Office Manager',
      dateInitiated: '2024-11-05',
      dateApproved: '2024-11-06',
      dateCompleted: '2024-11-07',
      expectedDate: '2024-11-08',
      status: 'completed',
      reason: 'Office setup for new management',
      condition: 'excellent'
    },
    {
      id: 'AM-005',
      movementId: 'AM-2024-005',
      assetId: 'AST-006',
      assetName: 'MacBook Pro 14"',
      assetTag: 'BYS-LPT-002',
      assetType: 'Laptop',
      movementType: 'return',
      fromLocation: 'Employee Desk',
      toLocation: 'IT Storage',
      fromAssignee: 'Former Employee',
      initiatedBy: 'HR Manager',
      dateInitiated: '2024-11-14',
      expectedDate: '2024-11-18',
      status: 'approved',
      reason: 'Employee departure - asset recovery',
      condition: 'good',
      notes: 'Asset to be reassigned after data wipe and maintenance'
    },
    {
      id: 'AM-006',
      movementId: 'AM-2024-006',
      assetId: 'AST-004',
      assetName: 'Mikano Generator 15KVA',
      assetTag: 'BYS-GEN-001',
      assetType: 'Generator',
      movementType: 'relocation',
      fromLocation: 'Abuja Branch',
      toLocation: 'Kano Warehouse',
      fromDepartment: 'Operations',
      toDepartment: 'Operations',
      initiatedBy: 'Branch Manager',
      dateInitiated: '2024-11-15',
      expectedDate: '2024-11-20',
      status: 'rejected',
      reason: 'Generator needed for backup power at Kano warehouse',
      condition: 'good',
      notes: 'Request rejected - critical backup power needed at current location'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<AssetMovement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Get unique values for filters
  const uniqueLocations = [...new Set([...movements.map(m => m.fromLocation), ...movements.map(m => m.toLocation)])];
  const uniqueTypes = [...new Set(movements.map(m => m.movementType))];

  // Filter movements
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.movementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.fromAssignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.toAssignee?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || movement.status === statusFilter;
    const matchesType = typeFilter === 'all' || movement.movementType === typeFilter;
    const matchesLocation = locationFilter === 'all' ||
                           movement.fromLocation === locationFilter ||
                           movement.toLocation === locationFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  // Calculate statistics
  const totalMovements = movements.length;
  const pendingMovements = movements.filter(m => m.status === 'pending').length;
  const inTransitMovements = movements.filter(m => m.status === 'in-transit').length;
  const completedMovements = movements.filter(m => m.status === 'completed').length;

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-blue-100 text-blue-800', label: 'Approved' },
      'in-transit': { color: 'bg-purple-100 text-purple-800', label: 'In Transit' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get movement type badge
  const getMovementTypeBadge = (type: string) => {
    const typeConfig = {
      transfer: { color: 'bg-blue-100 text-blue-800', label: 'Transfer' },
      assignment: { color: 'bg-green-100 text-green-800', label: 'Assignment' },
      return: { color: 'bg-orange-100 text-orange-800', label: 'Return' },
      relocation: { color: 'bg-purple-100 text-purple-800', label: 'Relocation' },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance' },
      disposal: { color: 'bg-red-100 text-red-800', label: 'Disposal' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <Badge className={`${config.color} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  };

  // Get condition badge
  const getConditionBadge = (condition: string) => {
    const conditionConfig = {
      excellent: { color: 'bg-green-100 text-green-800', label: 'Excellent' },
      good: { color: 'bg-blue-100 text-blue-800', label: 'Good' },
      fair: { color: 'bg-yellow-100 text-yellow-800', label: 'Fair' },
      poor: { color: 'bg-red-100 text-red-800', label: 'Poor' }
    };

    const config = conditionConfig[condition as keyof typeof conditionConfig];
    return (
      <Badge className={`${config.color} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  };

  // Get asset icon
  const getAssetIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'laptop':
        return <Laptop className="h-4 w-4 text-blue-500" />;
      case 'printer':
      case 'projector':
        return <Monitor className="h-4 w-4 text-purple-500" />;
      case 'vehicle':
        return <Truck className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'in-transit':
        return <ArrowRightLeft className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // View movement details
  const viewMovement = (movement: AssetMovement) => {
    setSelectedMovement(movement);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Movements</h1>
            <p className="text-gray-600 mt-1">Track asset transfers, assignments, and relocations</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Movement
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Movements
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalMovements}
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
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {pendingMovements}
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
                  <ArrowRightLeft className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      In Transit
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {inTransitMovements}
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
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {completedMovements}
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search movements..."
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in-transit">In Transit</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setLocationFilter('all');
                  setDateRange('all');
                }}
                variant="outline"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Asset Movement History</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Movement Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From → To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getAssetIcon(movement.assetType)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {movement.assetName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {movement.assetTag} • {movement.movementId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getMovementTypeBadge(movement.movementType)}
                          {getConditionBadge(movement.condition)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-900">{movement.fromLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-900">{movement.toLocation}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {movement.fromAssignee && (
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{movement.fromAssignee}</span>
                            </div>
                          )}
                          {movement.toAssignee && (
                            <div className="flex items-center gap-2 mt-1">
                              <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-900">{movement.toAssignee}</span>
                            </div>
                          )}
                          {!movement.fromAssignee && !movement.toAssignee && (
                            <span className="text-gray-500 text-xs">No assignee change</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(movement.status)}
                          {getStatusBadge(movement.status)}
                        </div>
                        {movement.approvedBy && (
                          <div className="text-xs text-gray-500 mt-1">
                            By: {movement.approvedBy}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900">Initiated: {movement.dateInitiated}</div>
                          {movement.dateCompleted ? (
                            <div className="text-green-600">Completed: {movement.dateCompleted}</div>
                          ) : (
                            <div className="text-orange-600">Expected: {movement.expectedDate}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewMovement(movement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {movement.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
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
        {filteredMovements.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No movements found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or record a new movement.</p>
            </CardContent>
          </Card>
        )}

        {/* View Movement Modal */}
        {showViewModal && selectedMovement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {getAssetIcon(selectedMovement.assetType)}
                    <div>
                      <h2 className="text-xl font-semibold">{selectedMovement.movementId}</h2>
                      <p className="text-gray-600">{selectedMovement.assetName} ({selectedMovement.assetTag})</p>
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
                {/* Movement Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Movement Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Movement Type</label>
                        <div className="mt-1">{getMovementTypeBadge(selectedMovement.movementType)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedMovement.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Asset Condition</label>
                        <div className="mt-1">{getConditionBadge(selectedMovement.condition)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Initiated By</label>
                        <p className="text-sm text-gray-900">{selectedMovement.initiatedBy}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Location Movement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">From Location</label>
                        <p className="text-sm text-gray-900">{selectedMovement.fromLocation}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">To Location</label>
                        <p className="text-sm text-gray-900">{selectedMovement.toLocation}</p>
                      </div>
                      {selectedMovement.fromDepartment && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Department Change</label>
                          <p className="text-sm text-gray-900">
                            {selectedMovement.fromDepartment} → {selectedMovement.toDepartment}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date Initiated</label>
                        <p className="text-sm text-gray-900">{selectedMovement.dateInitiated}</p>
                      </div>
                      {selectedMovement.dateApproved && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date Approved</label>
                          <p className="text-sm text-gray-900">{selectedMovement.dateApproved}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Expected Date</label>
                        <p className="text-sm text-gray-900">{selectedMovement.expectedDate}</p>
                      </div>
                      {selectedMovement.dateCompleted && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date Completed</label>
                          <p className="text-sm text-green-600">{selectedMovement.dateCompleted}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Assignee Movement */}
                {(selectedMovement.fromAssignee || selectedMovement.toAssignee) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assignee Movement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedMovement.fromAssignee && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">From Assignee</label>
                            <p className="text-sm text-gray-900">{selectedMovement.fromAssignee}</p>
                          </div>
                        )}
                        {selectedMovement.toAssignee && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">To Assignee</label>
                            <p className="text-sm text-gray-900">{selectedMovement.toAssignee}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reason and Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Movement Reason</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-900">{selectedMovement.reason}</p>
                  </CardContent>
                </Card>

                {selectedMovement.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-900">{selectedMovement.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Approval Information */}
                {selectedMovement.approvedBy && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Approval Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved By</label>
                          <p className="text-sm text-gray-900">{selectedMovement.approvedBy}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approval Date</label>
                          <p className="text-sm text-gray-900">{selectedMovement.dateApproved}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  {selectedMovement.status === 'pending' && (
                    <>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Movement
                      </Button>
                      <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Movement
                      </Button>
                    </>
                  )}
                  {selectedMovement.status === 'approved' && (
                    <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Mark In Transit
                    </Button>
                  )}
                  {selectedMovement.status === 'in-transit' && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Completed
                    </Button>
                  )}
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
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