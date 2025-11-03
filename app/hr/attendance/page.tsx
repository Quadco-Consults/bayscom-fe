'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Attendance } from '@/lib/types';
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  Plus
} from 'lucide-react';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data - replace with actual API calls
  const [attendanceRecords] = useState<Attendance[]>([
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
      date: selectedDate,
      checkIn: '08:15:00',
      checkOut: '17:30:00',
      status: 'present',
      workHours: 9.25,
      overtime: 0.5,
      location: 'Lagos Office',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      date: selectedDate,
      checkIn: '08:45:00',
      checkOut: '17:00:00',
      status: 'late',
      workHours: 8.25,
      location: 'Lagos Office',
      notes: 'Traffic delay',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      employeeId: '3',
      date: selectedDate,
      status: 'on-leave',
      notes: 'Annual leave approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      employeeId: '4',
      date: selectedDate,
      status: 'absent',
      notes: 'No notification',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const stats = {
    present: attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length,
    absent: attendanceRecords.filter(a => a.status === 'absent').length,
    onLeave: attendanceRecords.filter(a => a.status === 'on-leave').length,
    late: attendanceRecords.filter(a => a.status === 'late').length,
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      present: { variant: 'default', label: 'Present' },
      absent: { variant: 'destructive', label: 'Absent' },
      late: { variant: 'secondary', label: 'Late' },
      'half-day': { variant: 'outline', label: 'Half Day' },
      'on-leave': { variant: 'outline', label: 'On Leave' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const filteredRecords = selectedStatus === 'all'
    ? attendanceRecords
    : attendanceRecords.filter(r => r.status === selectedStatus);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600">Track and manage employee attendance</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.onLeave}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="on-leave">On Leave</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emp ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Work Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.employee?.user?.firstName} {record.employee?.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employee?.jobTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.employee?.employeeNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkIn ? (
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-green-600" />
                            {record.checkIn}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkOut ? (
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-red-600" />
                            {record.checkOut}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.workHours ? `${record.workHours} hrs` : '-'}
                        {record.overtime ? (
                          <span className="ml-2 text-xs text-orange-600">
                            (+{record.overtime} OT)
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
