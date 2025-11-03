'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Department } from '@/lib/types';
import { Plus, Edit, Trash2, Users, Search, X } from 'lucide-react';

export default function DepartmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    employeeCount: 0,
  });

  const [departments, setDepartments] = useState<Department[]>([
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

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepartment) {
      // Update existing department
      setDepartments(departments.map(d =>
        d.id === selectedDepartment.id
          ? { ...d, ...formData, updatedAt: new Date().toISOString() }
          : d
      ));
    } else {
      // Create new department
      const newDepartment: Department = {
        id: String(departments.length + 1),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDepartments([...departments, newDepartment]);
    }
    handleCancel();
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      employeeCount: department.employeeCount,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedDepartment(undefined);
    setFormData({
      name: '',
      description: '',
      employeeCount: 0,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600">Manage organizational departments</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Departments Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{dept.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{dept.employeeCount} Employees</span>
                </div>
                {dept.manager && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">Manager</p>
                    <p className="text-sm font-medium text-gray-900">
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
                <span className="text-sm font-medium text-gray-700">Total Departments</span>
                <span className="text-2xl font-bold text-gray-900">{departments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Employees</span>
                <span className="text-2xl font-bold text-gray-900">
                  {departments.reduce((acc, dept) => acc + dept.employeeCount, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Average Team Size</span>
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(departments.reduce((acc, dept) => acc + dept.employeeCount, 0) / departments.length)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedDepartment ? 'Edit Department' : 'Add New Department'}
                  </CardTitle>
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name*
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="Enter department name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="Enter department description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Count
                    </label>
                    <input
                      type="number"
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedDepartment ? 'Update Department' : 'Create Department'}
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
