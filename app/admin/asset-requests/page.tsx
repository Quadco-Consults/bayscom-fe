'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  PackageCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Edit,
  Eye,
  X,
  Monitor,
  Laptop,
  Printer,
  Car,
  User,
  Building,
  Calendar,
  FileText,
  Check,
  Send
} from 'lucide-react';

interface AssetRequest {
  id: string;
  requestNumber: string;
  title: string;
  requestedBy: string;
  requesterId: string;
  department: string;
  dateRequested: string;
  requiredBy: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'allocated' | 'returned';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  assetType: string;
  assetCategory: string;
  specificAsset?: string;
  assetTag?: string;
  requestType: 'temporary' | 'permanent' | 'replacement';
  duration?: string;
  returnDate?: string;
  justification: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  purpose: string;
  notes?: string;
  currentLocation?: string;
  assignedAsset?: {
    id: string;
    name: string;
    tag: string;
    condition: string;
  };
}

export default function AssetRequestsPage() {
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([
    {
      id: 'AR-001',
      requestNumber: 'AR-2024-001',
      title: 'Laptop for New Employee',
      requestedBy: 'John Adebayo',
      requesterId: 'EMP-001',
      department: 'Administration',
      dateRequested: '2024-11-10',
      requiredBy: '2024-11-15',
      status: 'allocated',
      approvedBy: 'Sarah Johnson',
      approvalDate: '2024-11-12',
      assetType: 'Laptop',
      assetCategory: 'IT Equipment',
      requestType: 'permanent',
      justification: 'New employee onboarding - requires laptop for daily operations',
      urgency: 'high',
      purpose: 'Employee onboarding',
      assignedAsset: {
        id: 'AST-001',
        name: 'Dell Latitude 5520',
        tag: 'BYS-LPT-001',
        condition: 'excellent'
      }
    },
    {
      id: 'AR-002',
      requestNumber: 'AR-2024-002',
      title: 'Temporary Vehicle for Site Visit',
      requestedBy: 'Emeka Okafor',
      requesterId: 'EMP-003',
      department: 'Operations',
      dateRequested: '2024-11-08',
      requiredBy: '2024-11-12',
      status: 'submitted',
      assetType: 'Vehicle',
      assetCategory: 'Vehicle',
      requestType: 'temporary',
      duration: '3 days',
      returnDate: '2024-11-15',
      justification: 'Site inspection and client meeting in Port Harcourt',
      urgency: 'medium',
      purpose: 'Business travel',
      notes: 'Requires vehicle with good fuel efficiency for long distance travel'
    },
    {
      id: 'AR-003',
      requestNumber: 'AR-2024-003',
      title: 'Printer Replacement',
      requestedBy: 'Fatima Ahmed',
      requesterId: 'EMP-002',
      department: 'Operations',
      dateRequested: '2024-11-12',
      requiredBy: '2024-11-18',
      status: 'approved',
      approvedBy: 'IT Manager',
      approvalDate: '2024-11-14',
      assetType: 'Printer',
      assetCategory: 'IT Equipment',
      requestType: 'replacement',
      justification: 'Current printer malfunctioning and not cost-effective to repair',
      urgency: 'medium',
      purpose: 'Equipment replacement'
    },
    {
      id: 'AR-004',
      requestNumber: 'AR-2024-004',
      title: 'Desktop Computer for Accounting',
      requestedBy: 'Aisha Bello',
      requesterId: 'EMP-004',
      department: 'Finance',
      dateRequested: '2024-11-14',
      requiredBy: '2024-11-20',
      status: 'rejected',
      rejectionReason: 'Budget constraints - request to be resubmitted next quarter',
      assetType: 'Desktop Computer',
      assetCategory: 'IT Equipment',
      requestType: 'permanent',
      justification: 'Additional workstation needed for accounting software',
      urgency: 'low',
      purpose: 'Workstation expansion'
    },
    {
      id: 'AR-005',
      requestNumber: 'AR-2024-005',
      title: 'Conference Room Projector',
      requestedBy: 'Management',
      requesterId: 'EMP-005',
      department: 'Administration',
      dateRequested: '2024-11-15',
      requiredBy: '2024-11-25',
      status: 'draft',
      assetType: 'Projector',
      assetCategory: 'IT Equipment',
      requestType: 'permanent',
      justification: 'Enhance presentation capabilities for client meetings',
      urgency: 'medium',
      purpose: 'Meeting enhancement'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Get unique values for filters
  const uniqueDepartments = [...new Set(assetRequests.map(req => req.department))];
  const uniqueCategories = [...new Set(assetRequests.map(req => req.assetCategory))];

  // Filter asset requests
  const filteredRequests = assetRequests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.assetType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || req.department === departmentFilter;
    const matchesCategory = categoryFilter === 'all' || req.assetCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesCategory;
  });

  // Calculate statistics
  const totalRequests = assetRequests.length;
  const pendingApproval = assetRequests.filter(req => req.status === 'submitted').length;
  const approvedRequests = assetRequests.filter(req => req.status === 'approved').length;
  const allocatedAssets = assetRequests.filter(req => req.status === 'allocated').length;

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      submitted: { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      allocated: { color: 'bg-purple-100 text-purple-800', label: 'Allocated' },
      returned: { color: 'bg-orange-100 text-orange-800', label: 'Returned' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { color: 'bg-blue-100 text-blue-800', label: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
    return (
      <Badge className={`${config.color} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  };

  // Get request type badge
  const getRequestTypeBadge = (type: string) => {
    const typeConfig = {
      temporary: { color: 'bg-cyan-100 text-cyan-800', label: 'Temporary' },
      permanent: { color: 'bg-indigo-100 text-indigo-800', label: 'Permanent' },
      replacement: { color: 'bg-amber-100 text-amber-800', label: 'Replacement' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
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
        return <Printer className="h-4 w-4 text-purple-500" />;
      case 'vehicle':
        return <Car className="h-4 w-4 text-green-500" />;
      case 'desktop computer':
        return <Monitor className="h-4 w-4 text-gray-500" />;
      default:
        return <PackageCheck className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'allocated':
        return <PackageCheck className="h-4 w-4 text-purple-500" />;
      case 'returned':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // View request details
  const viewRequest = (request: AssetRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Requests</h1>
            <p className="text-gray-600 mt-1">Request allocation and assignment of company assets</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Asset Request
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PackageCheck className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Requests
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalRequests}
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
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Approval
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {pendingApproval}
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
                      Approved
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {approvedRequests}
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
                  <PackageCheck className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Assets Allocated
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {allocatedAssets}
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
                  placeholder="Search asset requests..."
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
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="allocated">Allocated</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDepartmentFilter('all');
                  setCategoryFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Asset Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.requestNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.requestedBy}</div>
                        <div className="text-sm text-gray-500">{request.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getAssetIcon(request.assetType)}
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{request.assetType}</div>
                            <div className="text-sm text-gray-500">{request.assetCategory}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getRequestTypeBadge(request.requestType)}
                          {getUrgencyBadge(request.urgency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                        {request.approvedBy && (
                          <div className="text-xs text-gray-500 mt-1">
                            By: {request.approvedBy}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.requiredBy}</div>
                        <div className="text-sm text-gray-500">
                          Req: {request.dateRequested}
                        </div>
                        {request.returnDate && (
                          <div className="text-xs text-orange-600">
                            Return: {request.returnDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {request.status === 'submitted' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
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
        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <PackageCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No asset requests found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or create a new asset request.</p>
            </CardContent>
          </Card>
        )}

        {/* View Asset Request Modal */}
        {showViewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {getAssetIcon(selectedRequest.assetType)}
                    <div>
                      <h2 className="text-xl font-semibold">{selectedRequest.requestNumber}</h2>
                      <p className="text-gray-600">{selectedRequest.title}</p>
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
                {/* Request Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Request Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Requested By</label>
                        <p className="text-sm text-gray-900">{selectedRequest.requestedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-sm text-gray-900">{selectedRequest.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Purpose</label>
                        <p className="text-sm text-gray-900">{selectedRequest.purpose}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asset Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Asset Type</label>
                        <p className="text-sm text-gray-900">{selectedRequest.assetType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Category</label>
                        <p className="text-sm text-gray-900">{selectedRequest.assetCategory}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Request Type</label>
                        <div className="mt-1">{getRequestTypeBadge(selectedRequest.requestType)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Urgency</label>
                        <div className="mt-1">{getUrgencyBadge(selectedRequest.urgency)}</div>
                      </div>
                      {selectedRequest.duration && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Duration</label>
                          <p className="text-sm text-gray-900">{selectedRequest.duration}</p>
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
                        <label className="text-sm font-medium text-gray-500">Date Requested</label>
                        <p className="text-sm text-gray-900">{selectedRequest.dateRequested}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Required By</label>
                        <p className="text-sm text-gray-900">{selectedRequest.requiredBy}</p>
                      </div>
                      {selectedRequest.returnDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Return Date</label>
                          <p className="text-sm text-gray-900">{selectedRequest.returnDate}</p>
                        </div>
                      )}
                      {selectedRequest.approvalDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approval Date</label>
                          <p className="text-sm text-gray-900">{selectedRequest.approvalDate}</p>
                        </div>
                      )}
                      {selectedRequest.approvedBy && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved By</label>
                          <p className="text-sm text-gray-900">{selectedRequest.approvedBy}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Justification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Justification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-900">{selectedRequest.justification}</p>
                  </CardContent>
                </Card>

                {/* Assigned Asset */}
                {selectedRequest.assignedAsset && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assigned Asset</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Asset Name</label>
                          <p className="text-sm text-gray-900">{selectedRequest.assignedAsset.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Asset Tag</label>
                          <p className="text-sm text-gray-900 font-mono">{selectedRequest.assignedAsset.tag}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Condition</label>
                          <p className="text-sm text-gray-900 capitalize">{selectedRequest.assignedAsset.condition}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Rejection Reason */}
                {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Rejection Reason</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-900">{selectedRequest.rejectionReason}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Notes */}
                {selectedRequest.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  {selectedRequest.status === 'draft' && (
                    <>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Request
                      </Button>
                      <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === 'submitted' && (
                    <>
                      <Button variant="outline" className="text-red-600 hover:text-red-900">
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === 'approved' && (
                    <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                      <PackageCheck className="h-4 w-4 mr-2" />
                      Allocate Asset
                    </Button>
                  )}
                  {selectedRequest.status === 'allocated' && selectedRequest.requestType === 'temporary' && (
                    <Button variant="outline">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Mark as Returned
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}