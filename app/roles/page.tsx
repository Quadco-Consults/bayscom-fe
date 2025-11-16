'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Role, Permission } from '@/lib/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function RolesPage() {
  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: [
        { id: '1', module: 'users', action: 'manage', description: 'Manage users' },
        { id: '2', module: 'roles', action: 'manage', description: 'Manage roles' },
        { id: '3', module: 'stations', action: 'manage', description: 'Manage stations' },
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Station Manager',
      description: 'Manage filling station operations',
      permissions: [
        { id: '4', module: 'stations', action: 'read', description: 'View stations' },
        { id: '5', module: 'stations', action: 'update', description: 'Update stations' },
        { id: '6', module: 'inventory', action: 'manage', description: 'Manage inventory' },
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      name: 'Fleet Manager',
      description: 'Manage truck fleet and logistics',
      permissions: [
        { id: '7', module: 'trucks', action: 'manage', description: 'Manage trucks' },
        { id: '8', module: 'trips', action: 'manage', description: 'Manage trips' },
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]);

  const modules = [
    { name: 'Users', value: 'users' },
    { name: 'Roles', value: 'roles' },
    { name: 'Departments', value: 'departments' },
    { name: 'Filling Stations', value: 'stations' },
    { name: 'Trucks', value: 'trucks' },
    { name: 'Inventory', value: 'inventory' },
    { name: 'Lubricants', value: 'lubricants' },
    { name: 'Sales', value: 'sales' },
  ];

  const actions = ['create', 'read', 'update', 'delete', 'manage'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Roles & Permissions</h1>
            <p className="text-black">Manage user roles and access permissions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        {/* Roles Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <p className="text-sm text-black mt-1">{role.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <Badge key={permission.id} variant="secondary">
                        {permission.module}: {permission.action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Available Modules & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.value} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-black">{module.name}</p>
                    <p className="text-sm text-black">{module.value}</p>
                  </div>
                  <div className="flex gap-2">
                    {actions.map((action) => (
                      <Badge key={action} variant="outline">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
