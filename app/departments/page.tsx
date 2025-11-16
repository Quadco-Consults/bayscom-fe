'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Department } from '@/lib/types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'Management',
      description: 'Executive and senior management team',
      employeeCount: 5,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Operations',
      description: 'Filling station and field operations',
      employeeCount: 45,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      name: 'Logistics & Fleet',
      description: 'Truck fleet and transportation management',
      employeeCount: 32,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '4',
      name: 'Sales & Marketing',
      description: 'Business development and customer relations',
      employeeCount: 12,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '5',
      name: 'Finance & Accounting',
      description: 'Financial management and reporting',
      employeeCount: 8,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '6',
      name: 'Human Resources',
      description: 'Personnel management and development',
      employeeCount: 6,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Departments</h1>
            <p className="text-black">Manage organizational departments</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>

        {/* Departments Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{dept.name}</CardTitle>
                    <p className="text-sm text-black mt-1">{dept.description}</p>
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
                <div className="flex items-center text-sm text-black">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{dept.employeeCount} Employees</span>
                </div>
                {dept.manager && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-black">Manager</p>
                    <p className="text-sm font-medium text-black">
                      {dept.manager.firstName} {dept.manager.lastName}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">Total Departments</span>
                <span className="text-2xl font-bold text-black">{departments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">Total Employees</span>
                <span className="text-2xl font-bold text-black">
                  {departments.reduce((acc, dept) => acc + dept.employeeCount, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">Average Team Size</span>
                <span className="text-2xl font-bold text-black">
                  {Math.round(departments.reduce((acc, dept) => acc + dept.employeeCount, 0) / departments.length)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
