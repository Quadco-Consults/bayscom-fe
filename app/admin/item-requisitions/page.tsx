'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Edit,
  Eye,
  X,
  ChevronDown,
  Package,
  User,
  Building,
  Calendar,
  FileText,
  Trash2,
  Send,
  Check
} from 'lucide-react';

interface RequisitionItem {
  id: string;
  itemName: string;
  itemCode: string;
  category: string;
  quantityRequested: number;
  quantityApproved?: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  justification: string;
  availableStock: number;
}

interface ItemRequisition {
  id: string;
  requisitionNumber: string;
  title: string;
  requestedBy: string;
  requesterId: string;
  department: string;
  dateRequested: string;
  requiredBy: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'fulfilled' | 'partially-fulfilled';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  items: RequisitionItem[];
  totalAmount: number;
  notes?: string;
  purpose: string;
}

export default function ItemRequisitionsPage() {
  const [requisitions, setRequisitions] = useState<ItemRequisition[]>([
    {
      id: 'REQ-001',
      requisitionNumber: 'REQ-2024-001',
      title: 'Office Supplies for Q4',
      requestedBy: 'John Adebayo',
      requesterId: 'EMP-001',
      department: 'Administration',
      dateRequested: '2024-11-10',
      requiredBy: '2024-11-20',
      status: 'approved',
      approvedBy: 'Sarah Johnson',
      approvalDate: '2024-11-12',
      purpose: 'Quarterly office supplies restocking',
      totalAmount: 85000,
      items: [
        {
          id: '1',
          itemName: 'A4 Printing Paper',
          itemCode: 'OFF-001',
          category: 'Office Supplies',
          quantityRequested: 50,
          quantityApproved: 50,
          unit: 'Ream',
          unitPrice: 2500,
          totalPrice: 125000,
          urgency: 'medium',
          justification: 'Running low on printing paper',
          availableStock: 150
        },
        {
          id: '2',
          itemName: 'Ball Point Pen (Blue)',
          itemCode: 'STA-001',
          category: 'Stationery',
          quantityRequested: 5,
          quantityApproved: 5,
          unit: 'Box',
          unitPrice: 1500,
          totalPrice: 7500,
          urgency: 'low',
          justification: 'Regular stationery replenishment',
          availableStock: 80
        }
      ]
    },
    {
      id: 'REQ-002',
      requisitionNumber: 'REQ-2024-002',
      title: 'Safety Equipment Request',
      requestedBy: 'Emeka Okafor',
      requesterId: 'EMP-003',
      department: 'Operations',
      dateRequested: '2024-11-08',
      requiredBy: '2024-11-15',
      status: 'submitted',
      purpose: 'Safety compliance for field operations',
      totalAmount: 45000,
      items: [
        {
          id: '1',
          itemName: 'Safety Helmets',
          itemCode: 'SFT-002',
          category: 'Safety Supplies',
          quantityRequested: 10,
          unit: 'Piece',
          unitPrice: 3500,
          totalPrice: 35000,
          urgency: 'high',
          justification: 'Required for site safety compliance',
          availableStock: 25
        },
        {
          id: '2',
          itemName: 'Safety Boots',
          itemCode: 'SFT-003',
          category: 'Safety Supplies',
          quantityRequested: 5,
          unit: 'Pair',
          unitPrice: 8000,
          totalPrice: 40000,
          urgency: 'high',
          justification: 'New employee safety equipment',
          availableStock: 12
        }
      ]
    },
    {
      id: 'REQ-003',
      requisitionNumber: 'REQ-2024-003',
      title: 'Maintenance Supplies',
      requestedBy: 'Fatima Ahmed',
      requesterId: 'EMP-002',
      department: 'Operations',
      dateRequested: '2024-11-12',
      requiredBy: '2024-11-18',
      status: 'rejected',
      rejectionReason: 'Insufficient budget allocation for maintenance supplies this month',
      purpose: 'Monthly maintenance supplies',
      totalAmount: 120000,
      items: [
        {
          id: '1',
          itemName: 'Engine Oil (5W-30)',
          itemCode: 'MNT-001',
          category: 'Maintenance',
          quantityRequested: 20,
          unit: 'Liter',
          unitPrice: 3500,
          totalPrice: 70000,
          urgency: 'medium',
          justification: 'Vehicle maintenance schedule',
          availableStock: 45
        }
      ]
    },
    {
      id: 'REQ-004',
      requisitionNumber: 'REQ-2024-004',
      title: 'Cleaning Supplies',
      requestedBy: 'Aisha Bello',
      requesterId: 'EMP-004',
      department: 'Administration',
      dateRequested: '2024-11-14',
      requiredBy: '2024-11-22',
      status: 'draft',
      purpose: 'Weekly cleaning supplies replenishment',
      totalAmount: 25000,
      items: [
        {
          id: '1',
          itemName: 'Toilet Paper',
          itemCode: 'CLN-001',
          category: 'Cleaning Supplies',
          quantityRequested: 10,
          unit: 'Pack',
          unitPrice: 1200,
          totalPrice: 12000,
          urgency: 'medium',
          justification: 'Running low on toilet paper',
          availableStock: 25
        }
      ]
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<ItemRequisition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  // Mock departments and available items
  const [departments] = useState([
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Operations' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Human Resources' }
  ]);

  const [availableItems] = useState([
    { id: 'OFF-001', name: 'A4 Printing Paper', category: 'Office Supplies', unit: 'Ream', price: 2500, stock: 150 },
    { id: 'STA-001', name: 'Ball Point Pen (Blue)', category: 'Stationery', unit: 'Box', price: 1500, stock: 80 },
    { id: 'CLN-001', name: 'Toilet Paper', category: 'Cleaning Supplies', unit: 'Pack', price: 1200, stock: 25 },
    { id: 'SFT-001', name: 'Hand Sanitizer', category: 'Safety Supplies', unit: 'Bottle', price: 800, stock: 0 },
    { id: 'SFT-002', name: 'Safety Helmets', category: 'Safety Supplies', unit: 'Piece', price: 3500, stock: 25 },
    { id: 'MNT-001', name: 'Engine Oil (5W-30)', category: 'Maintenance', unit: 'Liter', price: 3500, stock: 45 }
  ]);

  // Get unique departments for filters
  const uniqueDepartments = [...new Set(requisitions.map(req => req.department))];

  // Filter requisitions
  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || req.department === departmentFilter;

    const hasUrgency = req.items.some(item => urgencyFilter === 'all' || item.urgency === urgencyFilter);

    return matchesSearch && matchesStatus && matchesDepartment && hasUrgency;
  });

  // Calculate statistics
  const totalRequisitions = requisitions.length;
  const pendingApproval = requisitions.filter(req => req.status === 'submitted').length;
  const approvedRequisitions = requisitions.filter(req => req.status === 'approved').length;
  const totalValue = requisitions.reduce((sum, req) => sum + req.totalAmount, 0);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      submitted: { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      fulfilled: { color: 'bg-purple-100 text-purple-800', label: 'Fulfilled' },
      'partially-fulfilled': { color: 'bg-yellow-100 text-yellow-800', label: 'Partially Fulfilled' }
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
      case 'fulfilled':
        return <Package className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // View requisition details
  const viewRequisition = (requisition: ItemRequisition) => {
    setSelectedRequisition(requisition);
    setShowViewModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Item Requisitions</h1>
            <p className="text-gray-600 mt-1">Internal requests for consumable items and supplies</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Requisition
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBag className="h-8 w-8 text-[#8B1538]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Requisitions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalRequisitions}
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
                      {approvedRequisitions}
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
                  <Package className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Value
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
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
                  placeholder="Search requisitions..."
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
                  <option value="fulfilled">Fulfilled</option>
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
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDepartmentFilter('all');
                  setUrgencyFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requisitions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Item Requisitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requisition Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
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
                  {filteredRequisitions.map((requisition) => (
                    <tr key={requisition.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(requisition.status)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {requisition.requisitionNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {requisition.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{requisition.requestedBy}</div>
                        <div className="text-sm text-gray-500">{requisition.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requisition.items.length} items</div>
                        <div className="flex gap-1 mt-1">
                          {requisition.items.slice(0, 2).map((item, index) => (
                            <div key={index}>
                              {getUrgencyBadge(item.urgency)}
                            </div>
                          ))}
                          {requisition.items.length > 2 && (
                            <span className="text-xs text-gray-500">+{requisition.items.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₦{requisition.totalAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(requisition.status)}
                        {requisition.approvedBy && (
                          <div className="text-xs text-gray-500 mt-1">
                            By: {requisition.approvedBy}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requisition.requiredBy}</div>
                        <div className="text-sm text-gray-500">
                          Req: {requisition.dateRequested}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewRequisition(requisition)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {requisition.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {requisition.status === 'submitted' && (
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
        {filteredRequisitions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requisitions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or create a new requisition.</p>
            </CardContent>
          </Card>
        )}

        {/* View Requisition Modal */}
        {showViewModal && selectedRequisition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRequisition.requisitionNumber}</h2>
                    <p className="text-gray-600">{selectedRequisition.title}</p>
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
                {/* Requisition Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Request Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Requested By</label>
                        <p className="text-sm text-gray-900">{selectedRequisition.requestedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-sm text-gray-900">{selectedRequisition.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Purpose</label>
                        <p className="text-sm text-gray-900">{selectedRequisition.purpose}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedRequisition.status)}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dates & Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date Requested</label>
                        <p className="text-sm text-gray-900">{selectedRequisition.dateRequested}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Required By</label>
                        <p className="text-sm text-gray-900">{selectedRequisition.requiredBy}</p>
                      </div>
                      {selectedRequisition.approvalDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approval Date</label>
                          <p className="text-sm text-gray-900">{selectedRequisition.approvalDate}</p>
                        </div>
                      )}
                      {selectedRequisition.approvedBy && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved By</label>
                          <p className="text-sm text-gray-900">{selectedRequisition.approvedBy}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                        <p className="text-lg font-bold text-[#8B1538]">
                          ₦{selectedRequisition.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Items Count</label>
                        <p className="text-sm text-gray-900">{selectedRequisition.items.length} items</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Rejection Reason */}
                {selectedRequisition.status === 'rejected' && selectedRequisition.rejectionReason && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Rejection Reason</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-900">{selectedRequisition.rejectionReason}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Items Detail */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requested Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Requested</th>
                            {selectedRequisition.status === 'approved' && (
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Approved</th>
                            )}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock Available</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedRequisition.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                                  <div className="text-xs text-gray-500">{item.itemCode} • {item.category}</div>
                                  <div className="text-xs text-gray-600 mt-1">{item.justification}</div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.quantityRequested} {item.unit}
                              </td>
                              {selectedRequisition.status === 'approved' && (
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.quantityApproved} {item.unit}
                                </td>
                              )}
                              <td className="px-4 py-2 text-sm text-gray-900">
                                ₦{item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                ₦{item.totalPrice.toLocaleString()}
                              </td>
                              <td className="px-4 py-2">
                                {getUrgencyBadge(item.urgency)}
                              </td>
                              <td className="px-4 py-2">
                                <span className={`text-sm ${item.availableStock < item.quantityRequested ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                  {item.availableStock} {item.unit}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedRequisition.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-900">{selectedRequisition.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  {selectedRequisition.status === 'draft' && (
                    <>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Requisition
                      </Button>
                      <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Approval
                      </Button>
                    </>
                  )}
                  {selectedRequisition.status === 'submitted' && (
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
                  {selectedRequisition.status === 'approved' && (
                    <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                      <Package className="h-4 w-4 mr-2" />
                      Process Fulfillment
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