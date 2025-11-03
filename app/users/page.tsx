'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, EmployeeTermination, EmployeeSuspension } from '@/lib/types';
import { UserForm } from '@/components/users/user-form';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserX,
  DollarSign,
  Calendar,
  Briefcase,
  Building2,
  X,
  Ban
} from 'lucide-react';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'terminate' | 'suspend'>('terminate');
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [terminationForm, setTerminationForm] = useState({
    terminationDate: '',
    terminationType: 'resignation' as EmployeeTermination['terminationType'],
    reason: '',
    exitInterviewNotes: '',
    finalSettlement: 0,
    outstandingDues: 0,
  });

  const [suspensionForm, setSuspensionForm] = useState({
    suspensionDate: '',
    suspensionType: 'disciplinary' as EmployeeSuspension['suspensionType'],
    reason: '',
    duration: 7,
    startDate: '',
    endDate: '',
    isPaid: false,
    conditions: '',
    reinstatementConditions: '',
    notes: '',
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'john.doe@bayscom.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+234 801 234 5678',
      roleId: '1',
      role: { id: '1', name: 'Admin', description: '', permissions: [], createdAt: '', updatedAt: '' },
      departmentId: '1',
      department: { id: '1', name: 'Management', description: '', employeeCount: 5, createdAt: '', updatedAt: '' },
      positionId: '1',
      position: {
        id: '1',
        title: 'Operations Director',
        departmentId: '1',
        description: '',
        level: 'director',
        baseSalary: 500000,
        allowances: [
          { id: 'a1', name: 'Housing', amount: 200000, type: 'fixed' },
          { id: 'a2', name: 'Transport', amount: 100000, type: 'fixed' },
        ],
        totalCompensation: 800000,
        benefits: [],
        requirements: [],
        status: 'active',
        createdAt: '',
        updatedAt: '',
      },
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      email: 'jane.smith@bayscom.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+234 802 345 6789',
      roleId: '2',
      role: { id: '2', name: 'Station Manager', description: '', permissions: [], createdAt: '', updatedAt: '' },
      departmentId: '2',
      department: { id: '2', name: 'Operations', description: '', employeeCount: 20, createdAt: '', updatedAt: '' },
      positionId: '2',
      position: {
        id: '2',
        title: 'Station Manager',
        departmentId: '2',
        description: '',
        level: 'manager',
        baseSalary: 300000,
        allowances: [
          { id: 'a3', name: 'Housing', amount: 100000, type: 'fixed' },
        ],
        totalCompensation: 400000,
        benefits: [],
        requirements: [],
        status: 'active',
        createdAt: '',
        updatedAt: '',
      },
      status: 'on-leave',
      leaveStatus: {
        isOnLeave: true,
        leaveType: 'Annual Leave',
        startDate: '2024-01-20',
        endDate: '2024-01-27',
      },
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
    {
      id: '3',
      email: 'mike.johnson@bayscom.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      phoneNumber: '+234 803 456 7890',
      roleId: '3',
      role: { id: '3', name: 'Driver', description: '', permissions: [], createdAt: '', updatedAt: '' },
      departmentId: '3',
      department: { id: '3', name: 'Logistics & Fleet', description: '', employeeCount: 32, createdAt: '', updatedAt: '' },
      positionId: '3',
      position: {
        id: '3',
        title: 'Truck Driver',
        departmentId: '3',
        description: '',
        level: 'mid',
        baseSalary: 150000,
        allowances: [
          { id: 'a4', name: 'Fuel Allowance', amount: 30000, type: 'fixed' },
        ],
        totalCompensation: 180000,
        benefits: [],
        requirements: [],
        status: 'active',
        createdAt: '',
        updatedAt: '',
      },
      status: 'active',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
    },
  ]);

  const roles = [
    { id: '1', name: 'Admin', description: '', permissions: [], createdAt: '', updatedAt: '' },
    { id: '2', name: 'Station Manager', description: '', permissions: [], createdAt: '', updatedAt: '' },
    { id: '3', name: 'Driver', description: '', permissions: [], createdAt: '', updatedAt: '' },
    { id: '4', name: 'Accountant', description: '', permissions: [], createdAt: '', updatedAt: '' },
    { id: '5', name: 'HR Officer', description: '', permissions: [], createdAt: '', updatedAt: '' },
    { id: '6', name: 'Operations Officer', description: '', permissions: [], createdAt: '', updatedAt: '' },
  ];

  const departments = [
    { id: '1', name: 'Management' },
    { id: '2', name: 'Operations' },
    { id: '3', name: 'Logistics & Fleet' },
    { id: '4', name: 'Sales & Marketing' },
    { id: '5', name: 'Finance & Accounting' },
    { id: '6', name: 'Human Resources' },
  ];

  const positions = [
    { id: '1', title: 'Operations Director', departmentId: '1', description: '', level: 'director' as const, baseSalary: 500000, allowances: [{ id: 'a1', name: 'Housing', amount: 200000, type: 'fixed' as const }, { id: 'a2', name: 'Transport', amount: 100000, type: 'fixed' as const }], totalCompensation: 800000, benefits: [], requirements: [], status: 'active' as const, createdAt: '', updatedAt: '' },
    { id: '2', title: 'Station Manager', departmentId: '2', description: '', level: 'manager' as const, baseSalary: 300000, allowances: [{ id: 'a3', name: 'Housing', amount: 100000, type: 'fixed' as const }], totalCompensation: 400000, benefits: [], requirements: [], status: 'active' as const, createdAt: '', updatedAt: '' },
    { id: '3', title: 'Truck Driver', departmentId: '3', description: '', level: 'mid' as const, baseSalary: 150000, allowances: [{ id: 'a4', name: 'Fuel Allowance', amount: 30000, type: 'fixed' as const }], totalCompensation: 180000, benefits: [], requirements: [], status: 'active' as const, createdAt: '', updatedAt: '' },
    { id: '4', title: 'Fleet Manager', departmentId: '3', description: '', level: 'manager' as const, baseSalary: 350000, allowances: [], totalCompensation: 350000, benefits: [], requirements: [], status: 'active' as const, createdAt: '', updatedAt: '' },
    { id: '5', title: 'Accountant', departmentId: '5', description: '', level: 'mid' as const, baseSalary: 200000, allowances: [], totalCompensation: 200000, benefits: [], requirements: [], status: 'active' as const, createdAt: '', updatedAt: '' },
    { id: '6', title: 'HR Officer', departmentId: '6', description: '', level: 'mid' as const, baseSalary: 180000, allowances: [], totalCompensation: 180000, benefits: [], requirements: [], status: 'active' as const, createdAt: '', updatedAt: '' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === 'all' || user.departmentId === departmentFilter;
    const matchesPosition = positionFilter === 'all' || user.positionId === positionFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
  });

  const getStatusBadge = (status: User['status'], leaveStatus?: User['leaveStatus']) => {
    if (status === 'on-leave' && leaveStatus?.isOnLeave) {
      return (
        <Badge variant="outline" className="bg-blue-50">
          On Leave ({leaveStatus.leaveType})
        </Badge>
      );
    }

    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      active: { variant: 'default', label: 'Active' },
      inactive: { variant: 'secondary', label: 'Inactive' },
      suspended: { variant: 'destructive', label: 'Suspended' },
      terminated: { variant: 'destructive', label: 'Terminated' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const handleOpenActionModal = (user: User, type: 'terminate' | 'suspend') => {
    setSelectedUser(user);
    setActionType(type);

    if (type === 'terminate') {
      setTerminationForm({
        terminationDate: new Date().toISOString().split('T')[0],
        terminationType: 'resignation',
        reason: '',
        exitInterviewNotes: '',
        finalSettlement: 0,
        outstandingDues: 0,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      setSuspensionForm({
        suspensionDate: today,
        suspensionType: 'disciplinary',
        reason: '',
        duration: 7,
        startDate: today,
        endDate: endDate.toISOString().split('T')[0],
        isPaid: false,
        conditions: '',
        reinstatementConditions: '',
        notes: '',
      });
    }

    setIsActionModalOpen(true);
  };

  const handleDurationChange = (days: number) => {
    const startDate = new Date(suspensionForm.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    setSuspensionForm({
      ...suspensionForm,
      duration: days,
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  const handleStartDateChange = (date: string) => {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + suspensionForm.duration);
    setSuspensionForm({
      ...suspensionForm,
      startDate: date,
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      if (actionType === 'terminate') {
        setUsers(users.map(u =>
          u.id === selectedUser.id
            ? { ...u, status: 'terminated' as User['status'], updatedAt: new Date().toISOString() }
            : u
        ));
      } else {
        setUsers(users.map(u =>
          u.id === selectedUser.id
            ? { ...u, status: 'suspended' as User['status'], updatedAt: new Date().toISOString() }
            : u
        ));
      }
      setIsActionModalOpen(false);
      setSelectedUser(undefined);
    }
  };

  const handleUserSubmit = (data: any) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? {
              ...u,
              ...data,
              role: roles.find(r => r.id === data.roleId),
              department: departments.find(d => d.id === data.departmentId),
              position: positions.find(p => p.id === data.positionId),
              updatedAt: new Date().toISOString(),
            }
          : u
      ));
    } else {
      // Create new user
      const newUser: User = {
        id: String(users.length + 1),
        ...data,
        role: roles.find(r => r.id === data.roleId)!,
        department: departments.find(d => d.id === data.departmentId)!,
        position: positions.find(p => p.id === data.positionId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setSelectedUser(undefined);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    onLeave: users.filter(u => u.status === 'on-leave').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    terminated: users.filter(u => u.status === 'terminated').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage system users, positions, and compensation</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.location.href = '/positions'}>
              <Briefcase className="mr-2 h-4 w-4" />
              Manage Positions
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-3xl font-bold text-blue-600">{stats.onLeave}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-orange-600">{stats.suspended}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Terminated</p>
                <p className="text-3xl font-bold text-red-600">{stats.terminated}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                  >
                    <option value="all">All Positions</option>
                    {positions.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.title}</option>
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
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compensation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                          {user.position?.title || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                          {user.department?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {user.position?.totalCompensation
                            ? `₦${user.position.totalCompensation.toLocaleString()}/mo`
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(user.status, user.leaveStatus)}
                          {user.status === 'on-leave' && user.leaveStatus && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(user.leaveStatus.startDate!).toLocaleDateString()} - {new Date(user.leaveStatus.endDate!).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsFormOpen(true);
                            }}
                            variant="ghost"
                            size="sm"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status !== 'terminated' && user.status !== 'suspended' && (
                            <>
                              <Button
                                onClick={() => handleOpenActionModal(user, 'suspend')}
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-700"
                                title="Suspend"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleOpenActionModal(user, 'terminate')}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                title="Terminate"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            onClick={() => handleDelete(user.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* User Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedUser ? 'Edit User' : 'Add New User'}
                  </CardTitle>
                  <Button
                    onClick={() => {
                      setIsFormOpen(false);
                      setSelectedUser(undefined);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <UserForm
                  user={selectedUser}
                  onSubmit={handleUserSubmit}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setSelectedUser(undefined);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Terminate/Suspend Modal */}
        {isActionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {actionType === 'terminate' ? 'Terminate Employee' : 'Suspend Employee'}
                  </CardTitle>
                  <Button
                    onClick={() => setIsActionModalOpen(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedUser?.firstName} {selectedUser?.lastName} ({selectedUser?.email})
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleActionSubmit} className="space-y-4">
                  {/* Action Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action Type*</label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value as 'terminate' | 'suspend')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    >
                      <option value="suspend">Suspend Employee</option>
                      <option value="terminate">Terminate Employee</option>
                    </select>
                  </div>

                  {/* Termination Form */}
                  {actionType === 'terminate' && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Termination Date*
                          </label>
                          <input
                            type="date"
                            value={terminationForm.terminationDate}
                            onChange={(e) => setTerminationForm({ ...terminationForm, terminationDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Termination Type*
                          </label>
                          <select
                            value={terminationForm.terminationType}
                            onChange={(e) => setTerminationForm({ ...terminationForm, terminationType: e.target.value as EmployeeTermination['terminationType'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            required
                          >
                            <option value="resignation">Resignation</option>
                            <option value="dismissal">Dismissal</option>
                            <option value="retirement">Retirement</option>
                            <option value="contract-end">Contract End</option>
                            <option value="redundancy">Redundancy</option>
                            <option value="mutual-agreement">Mutual Agreement</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Termination*
                        </label>
                        <textarea
                          value={terminationForm.reason}
                          onChange={(e) => setTerminationForm({ ...terminationForm, reason: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exit Interview Notes
                        </label>
                        <textarea
                          value={terminationForm.exitInterviewNotes}
                          onChange={(e) => setTerminationForm({ ...terminationForm, exitInterviewNotes: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Final Settlement (₦)
                          </label>
                          <input
                            type="number"
                            value={terminationForm.finalSettlement}
                            onChange={(e) => setTerminationForm({ ...terminationForm, finalSettlement: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Outstanding Dues (₦)
                          </label>
                          <input
                            type="number"
                            value={terminationForm.outstandingDues}
                            onChange={(e) => setTerminationForm({ ...terminationForm, outstandingDues: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Suspension Form */}
                  {actionType === 'suspend' && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Suspension Type*
                          </label>
                          <select
                            value={suspensionForm.suspensionType}
                            onChange={(e) => setSuspensionForm({ ...suspensionForm, suspensionType: e.target.value as EmployeeSuspension['suspensionType'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            required
                          >
                            <option value="disciplinary">Disciplinary</option>
                            <option value="investigation">Investigation</option>
                            <option value="medical">Medical</option>
                            <option value="administrative">Administrative</option>
                            <option value="performance">Performance</option>
                            <option value="misconduct">Misconduct</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Paid Suspension*
                          </label>
                          <select
                            value={suspensionForm.isPaid ? 'paid' : 'unpaid'}
                            onChange={(e) => setSuspensionForm({ ...suspensionForm, isPaid: e.target.value === 'paid' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            required
                          >
                            <option value="paid">Paid Suspension</option>
                            <option value="unpaid">Unpaid Suspension</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date*
                          </label>
                          <input
                            type="date"
                            value={suspensionForm.startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (Days)*
                          </label>
                          <input
                            type="number"
                            value={suspensionForm.duration}
                            onChange={(e) => handleDurationChange(Number(e.target.value))}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date*
                          </label>
                          <input
                            type="date"
                            value={suspensionForm.endDate}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Suspension*
                        </label>
                        <textarea
                          value={suspensionForm.reason}
                          onChange={(e) => setSuspensionForm({ ...suspensionForm, reason: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                          required
                          placeholder="Provide detailed reason for the suspension"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conditions During Suspension
                        </label>
                        <textarea
                          value={suspensionForm.conditions}
                          onChange={(e) => setSuspensionForm({ ...suspensionForm, conditions: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                          placeholder="E.g., No access to office premises, return company property, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reinstatement Conditions
                        </label>
                        <textarea
                          value={suspensionForm.reinstatementConditions}
                          onChange={(e) => setSuspensionForm({ ...suspensionForm, reinstatementConditions: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                          placeholder="Conditions to be met for reinstatement"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes
                        </label>
                        <textarea
                          value={suspensionForm.notes}
                          onChange={(e) => setSuspensionForm({ ...suspensionForm, notes: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        />
                      </div>

                      {suspensionForm.isPaid && (
                        <div className="p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Employee will continue to receive salary during the suspension period.
                          </p>
                        </div>
                      )}

                      {!suspensionForm.isPaid && (
                        <div className="p-3 bg-orange-50 rounded-md">
                          <p className="text-sm text-orange-800">
                            <strong>Warning:</strong> Employee will not receive salary during the suspension period.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={() => setIsActionModalOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={actionType === 'terminate' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
                    >
                      {actionType === 'terminate' ? 'Terminate Employee' : 'Suspend Employee'}
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
