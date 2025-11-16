'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/users/user-table';
import { UserForm } from '@/components/users/user-form';
import { User } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  // Mock data - replace with actual API calls
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
      status: 'active',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
  ]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedUser) {
      // Update user
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u)));
    } else {
      // Create new user
      const newUser: User = {
        id: String(users.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setSelectedUser(undefined);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">User Management</h1>
            <p className="text-black">Manage system users and their access</p>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>

        {/* Form or Table */}
        <Card>
          <CardHeader>
            <CardTitle>{isFormOpen ? (selectedUser ? 'Edit User' : 'Create New User') : 'Users'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isFormOpen ? (
              <UserForm user={selectedUser} onSubmit={handleSubmit} onCancel={handleCancel} />
            ) : (
              <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
