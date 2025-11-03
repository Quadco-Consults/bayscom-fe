'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leave, LeaveBalance } from '@/lib/types';
import {
  Calendar,
  Clock,
  Check,
  X,
  Plus,
  Filter,
  Download,
  User,
  Search
} from 'lucide-react';

export default function LeavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');

  const [viewMode, setViewMode] = useState<'my-leave' | 'manager'>(
    modeParam === 'manager' ? 'manager' : 'my-leave'
  );
  const [activeTab, setActiveTab] = useState<'requests' | 'balance'>('requests');

  useEffect(() => {
    if (modeParam === 'manager') {
      setViewMode('manager');
    } else if (modeParam === 'my-leave') {
      setViewMode('my-leave');
    }
  }, [modeParam]);

  const handleModeChange = (mode: 'my-leave' | 'manager') => {
    router.push(`/hr/leave?mode=${mode}`);
  };
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | undefined>();
  const [rejectionReason, setRejectionReason] = useState('');
  const [formData, setFormData] = useState({
    leaveType: 'annual' as Leave['leaveType'],
    startDate: '',
    endDate: '',
    days: 0,
    reason: '',
    handoverNotes: '',
  });

  // Simulate current user (in real app, get from auth context)
  const currentUserId = '1';
  const currentUserRole = 'HR Officer'; // Can be 'HR Officer' or other roles

  // Mock data - replace with actual API calls
  const [leaveRequests, setLeaveRequests] = useState<Leave[]>([
    {
      id: '1',
      employeeId: '1',
      employee: {
        id: '1',
        userId: '1',
        employeeNumber: 'EMP001',
        dateOfJoining: '2020-01-15',
        dateOfBirth: '1990-05-20',
        gender: 'male',
        maritalStatus: 'married',
        address: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '+234 801 234 5678',
        jobTitle: 'Station Manager',
        employmentType: 'full-time',
        salary: 250000,
        status: 'active',
        createdAt: '2020-01-15',
        updatedAt: '2024-01-01',
        user: {
          id: '1',
          email: 'john.doe@bayscom.com',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+234 801 234 5678',
          roleId: '1',
          departmentId: '1',
          status: 'active',
          createdAt: '2020-01-15',
          updatedAt: '2024-01-01',
        },
      },
      leaveType: 'annual',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 6,
      reason: 'Family vacation',
      status: 'pending',
      handoverNotes: 'All tasks delegated to Jane Smith',
      reliefOfficerId: '2',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: '2',
      employeeId: '2',
      employee: {
        id: '2',
        userId: '2',
        employeeNumber: 'EMP002',
        dateOfJoining: '2021-03-10',
        dateOfBirth: '1992-08-15',
        gender: 'female',
        maritalStatus: 'single',
        address: '456 Oak Ave',
        city: 'Lagos',
        state: 'Lagos',
        emergencyContactName: 'John Smith',
        emergencyContactPhone: '+234 802 345 6789',
        jobTitle: 'Operations Officer',
        employmentType: 'full-time',
        salary: 180000,
        status: 'active',
        createdAt: '2021-03-10',
        updatedAt: '2024-01-01',
        user: {
          id: '2',
          email: 'jane.smith@bayscom.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '+234 802 345 6789',
          roleId: '2',
          departmentId: '2',
          status: 'active',
          createdAt: '2021-03-10',
          updatedAt: '2024-01-01',
        },
      },
      leaveType: 'sick',
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      days: 3,
      reason: 'Medical appointment',
      status: 'approved',
      approvedBy: 'manager-1',
      approvalDate: '2024-01-20',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
    },
  ]);

  const [leaveBalances] = useState<LeaveBalance[]>([
    {
      employeeId: '1',
      leaveType: 'Annual Leave',
      totalDays: 21,
      usedDays: 8,
      remainingDays: 13,
      year: 2024,
    },
    {
      employeeId: '1',
      leaveType: 'Sick Leave',
      totalDays: 10,
      usedDays: 3,
      remainingDays: 7,
      year: 2024,
    },
    {
      employeeId: '1',
      leaveType: 'Compassionate Leave',
      totalDays: 5,
      usedDays: 0,
      remainingDays: 5,
      year: 2024,
    },
  ]);

  const departments = [
    { id: '1', name: 'Management' },
    { id: '2', name: 'Operations' },
    { id: '3', name: 'Logistics & Fleet' },
    { id: '4', name: 'Sales & Marketing' },
    { id: '5', name: 'Finance & Accounting' },
    { id: '6', name: 'Human Resources' },
  ];

  // Filter requests based on view mode
  const displayRequests = viewMode === 'my-leave'
    ? leaveRequests.filter(l => l.employeeId === currentUserId)
    : leaveRequests;

  const stats = {
    pending: displayRequests.filter(l => l.status === 'pending').length,
    approved: displayRequests.filter(l => l.status === 'approved').length,
    rejected: displayRequests.filter(l => l.status === 'rejected').length,
  };

  const isHR = currentUserRole === 'HR Officer';

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      cancelled: { variant: 'outline', label: 'Cancelled' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      annual: 'Annual Leave',
      sick: 'Sick Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      unpaid: 'Unpaid Leave',
      compassionate: 'Compassionate Leave',
      study: 'Study Leave',
    };
    return labels[type] || type;
  };

  const filteredRequests = displayRequests.filter(leave => {
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || leave.employee?.user?.departmentId === departmentFilter;
    const matchesSearch =
      leave.employee?.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employee?.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employee?.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: Leave = {
      id: String(leaveRequests.length + 1),
      employeeId: '1', // Current user
      employee: leaveRequests[0].employee, // Mock current employee
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLeaveRequests([...leaveRequests, newLeave]);
    handleCancel();
  };

  const handleApprove = (leaveId: string) => {
    setLeaveRequests(leaveRequests.map(l =>
      l.id === leaveId
        ? { ...l, status: 'approved', approvalDate: new Date().toISOString(), approvedBy: 'manager-1' }
        : l
    ));
  };

  const handleRejectClick = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLeave && rejectionReason) {
      setLeaveRequests(leaveRequests.map(l =>
        l.id === selectedLeave.id
          ? { ...l, status: 'rejected', rejectionReason, approvalDate: new Date().toISOString(), approvedBy: 'manager-1' }
          : l
      ));
      setIsRejectModalOpen(false);
      setSelectedLeave(undefined);
      setRejectionReason('');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setFormData({
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      days: 0,
      reason: '',
      handoverNotes: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600">
              {viewMode === 'my-leave'
                ? 'Manage your leave requests and view your balance'
                : 'Manage all employee leave requests and balances'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {viewMode === 'my-leave' && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-[#8B1538] text-[#8B1538]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {viewMode === 'my-leave' ? 'My Leave Requests' : 'All Leave Requests'}
            </button>
            {viewMode === 'my-leave' && (
              <button
                onClick={() => setActiveTab('balance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'balance'
                    ? 'border-[#8B1538] text-[#8B1538]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Leave Balance
              </button>
            )}
          </nav>
        </div>

        {/* Leave Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {/* Search and Filters - Only show in manager mode */}
            {viewMode === 'manager' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by employee name or job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        >
                          <option value="all">All Departments</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Filter Only - Show in my-leave mode */}
            {viewMode === 'my-leave' && (
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((leave) => (
                <Card key={leave.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-[#8B1538] bg-opacity-10 rounded-full">
                            <User className="h-5 w-5 text-[#8B1538]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {leave.employee?.user?.firstName} {leave.employee?.user?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {leave.employee?.jobTitle} • {leave.employee?.employeeNumber}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Leave Type</p>
                            <p className="text-sm font-medium text-gray-900">{getLeaveTypeLabel(leave.leaveType)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-medium text-gray-900">{leave.days} days</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(leave.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">End Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(leave.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs text-gray-500">Reason</p>
                          <p className="text-sm text-gray-900">{leave.reason}</p>
                        </div>

                        {leave.handoverNotes && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Handover Notes</p>
                            <p className="text-sm text-gray-900">{leave.handoverNotes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(leave.status)}
                        {viewMode === 'manager' && leave.status === 'pending' && (
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => handleApprove(leave.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectClick(leave)}>
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {leave.status === 'rejected' && leave.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                            <strong>Rejection Reason:</strong> {leave.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Leave Balances Tab - Only show in my-leave mode */}
        {activeTab === 'balance' && viewMode === 'my-leave' && (
          <Card>
            <CardHeader>
              <CardTitle>My Leave Balance Summary - 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remaining
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveBalances.map((balance, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {balance.leaveType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {balance.totalDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {balance.usedDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {balance.remainingDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#8B1538] h-2 rounded-full"
                              style={{ width: `${(balance.usedDays / balance.totalDays) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round((balance.usedDays / balance.totalDays) * 100)}% used
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Leave Request Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>New Leave Request</CardTitle>
                  <Button onClick={handleCancel} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type*</label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as Leave['leaveType'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                    >
                      <option value="annual">Annual Leave</option>
                      <option value="sick">Sick Leave</option>
                      <option value="maternity">Maternity Leave</option>
                      <option value="paternity">Paternity Leave</option>
                      <option value="unpaid">Unpaid Leave</option>
                      <option value="compassionate">Compassionate Leave</option>
                      <option value="study">Study Leave</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Days*</label>
                      <input
                        type="number"
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason*</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="Provide reason for leave"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Handover Notes</label>
                    <textarea
                      value={formData.handoverNotes}
                      onChange={(e) => setFormData({ ...formData, handoverNotes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      placeholder="Describe task delegation and handover details"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reject Modal */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reject Leave Request</CardTitle>
                  <Button
                    onClick={() => {
                      setIsRejectModalOpen(false);
                      setSelectedLeave(undefined);
                      setRejectionReason('');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      You are rejecting the leave request for{' '}
                      <strong>
                        {selectedLeave?.employee?.user?.firstName} {selectedLeave?.employee?.user?.lastName}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Rejection*
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="Provide a clear reason for rejecting this leave request..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsRejectModalOpen(false);
                        setSelectedLeave(undefined);
                        setRejectionReason('');
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Reject Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
