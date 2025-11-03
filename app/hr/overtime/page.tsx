'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Overtime } from '@/lib/types';
import { Clock, DollarSign, Check, X, Plus, Download, Calendar, Search, User } from 'lucide-react';

export default function OvertimePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');

  const [viewMode, setViewMode] = useState<'my-overtime' | 'manager'>(
    modeParam === 'manager' ? 'manager' : 'my-overtime'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<Overtime | undefined>();
  const [rejectionReason, setRejectionReason] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    hours: 0,
    rate: 0,
    reason: '',
  });

  useEffect(() => {
    if (modeParam === 'manager') {
      setViewMode('manager');
    } else if (modeParam === 'my-overtime') {
      setViewMode('my-overtime');
    }
  }, [modeParam]);

  // Simulate current user
  const currentUserId = '1';
  const currentUserRole = 'HR Officer';
  const isHR = currentUserRole === 'HR Officer';

  const departments = [
    { id: '1', name: 'Management' },
    { id: '2', name: 'Operations' },
    { id: '3', name: 'Logistics & Fleet' },
    { id: '4', name: 'Sales & Marketing' },
    { id: '5', name: 'Finance & Accounting' },
    { id: '6', name: 'Human Resources' },
  ];

  // Mock data
  const [overtimeRecords, setOvertimeRecords] = useState<Overtime[]>([
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
      date: '2024-01-20',
      hours: 4,
      rate: 2500,
      totalAmount: 10000,
      reason: 'Emergency delivery coordination',
      status: 'pending',
      createdAt: '2024-01-21',
      updatedAt: '2024-01-21',
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
      date: '2024-01-18',
      hours: 3,
      rate: 2000,
      totalAmount: 6000,
      reason: 'Month-end report preparation',
      status: 'approved',
      approvedBy: 'manager-1',
      approvalDate: '2024-01-19',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19',
    },
  ]);

  // Filter records based on view mode
  const displayRecords = viewMode === 'my-overtime'
    ? overtimeRecords.filter(o => o.employeeId === currentUserId)
    : overtimeRecords;

  const stats = {
    pending: displayRecords.filter(o => o.status === 'pending').length,
    approved: displayRecords.filter(o => o.status === 'approved').length,
    totalAmount: displayRecords
      .filter(o => o.status === 'approved')
      .reduce((sum, o) => sum + o.totalAmount, 0),
    totalHours: displayRecords.reduce((sum, o) => sum + o.hours, 0),
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      paid: { variant: 'outline', label: 'Paid' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const filteredRecords = displayRecords.filter(record => {
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || record.employee?.user?.departmentId === departmentFilter;
    const matchesSearch =
      record.employee?.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employee?.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employee?.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.hours * formData.rate;
    const newOvertime: Overtime = {
      id: String(overtimeRecords.length + 1),
      employeeId: currentUserId,
      employee: overtimeRecords[0].employee, // Mock current employee
      ...formData,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOvertimeRecords([...overtimeRecords, newOvertime]);
    handleCancel();
  };

  const handleApprove = (overtimeId: string) => {
    setOvertimeRecords(overtimeRecords.map(o =>
      o.id === overtimeId
        ? { ...o, status: 'approved', approvalDate: new Date().toISOString(), approvedBy: 'manager-1' }
        : o
    ));
  };

  const handleRejectClick = (overtime: Overtime) => {
    setSelectedOvertime(overtime);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOvertime && rejectionReason) {
      setOvertimeRecords(overtimeRecords.map(o =>
        o.id === selectedOvertime.id
          ? { ...o, status: 'rejected', rejectionReason, approvalDate: new Date().toISOString(), approvedBy: 'manager-1' }
          : o
      ));
      setIsRejectModalOpen(false);
      setSelectedOvertime(undefined);
      setRejectionReason('');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setFormData({
      date: '',
      hours: 0,
      rate: 0,
      reason: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Overtime Management</h1>
            <p className="text-gray-600">
              {viewMode === 'my-overtime'
                ? 'Submit and track your overtime hours'
                : 'Manage all employee overtime requests'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {viewMode === 'my-overtime' && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Overtime
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
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
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-[#8B1538]">{stats.totalHours}</p>
                </div>
                <div className="p-3 bg-[#8B1538] bg-opacity-10 rounded-full">
                  <Clock className="h-6 w-6 text-[#8B1538]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">₦{stats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        {viewMode === 'manager' ? (
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
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                  <option value="paid">Paid</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Overtime Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.employee?.user?.firstName} {record.employee?.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{record.employee?.jobTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.hours} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{record.rate.toLocaleString()}/hr
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₦{record.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">{record.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {viewMode === 'manager' && record.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleApprove(record.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectClick(record)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {record.status === 'rejected' && record.rejectionReason && (
                          <div className="text-xs text-red-600">
                            {record.rejectionReason}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Submit Overtime Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Submit Overtime</CardTitle>
                  <Button onClick={handleCancel} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours*</label>
                      <input
                        type="number"
                        value={formData.hours}
                        onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        min="0"
                        step="0.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₦/hr)*</label>
                      <input
                        type="number"
                        value={formData.rate}
                        onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount: ₦{(formData.hours * formData.rate).toLocaleString()}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason*</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="Describe the reason for overtime"
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
                  <CardTitle>Reject Overtime Request</CardTitle>
                  <Button
                    onClick={() => {
                      setIsRejectModalOpen(false);
                      setSelectedOvertime(undefined);
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
                      You are rejecting the overtime request for{' '}
                      <strong>
                        {selectedOvertime?.employee?.user?.firstName} {selectedOvertime?.employee?.user?.lastName}
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
                      placeholder="Provide a clear reason for rejecting this overtime request..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsRejectModalOpen(false);
                        setSelectedOvertime(undefined);
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
