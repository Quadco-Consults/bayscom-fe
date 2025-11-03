'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Position, PositionAllowance } from '@/lib/types';
import {
  Briefcase,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  X,
  Building2,
  TrendingUp,
  Search
} from 'lucide-react';

export default function PositionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    departmentId: '',
    description: '',
    level: 'mid' as Position['level'],
    baseSalary: 0,
    allowances: [] as PositionAllowance[],
    benefits: [] as string[],
    requirements: [] as string[],
    status: 'active' as Position['status'],
  });

  const [allowanceForm, setAllowanceForm] = useState({
    name: '',
    amount: 0,
    type: 'fixed' as 'fixed' | 'percentage',
    description: '',
  });

  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      title: 'Station Manager',
      departmentId: '2',
      department: { id: '2', name: 'Operations', description: '', employeeCount: 20, createdAt: '', updatedAt: '' },
      description: 'Oversee daily operations of filling stations',
      level: 'manager',
      baseSalary: 300000,
      allowances: [
        { id: 'a1', name: 'Housing', amount: 100000, type: 'fixed' },
        { id: 'a2', name: 'Transport', amount: 50000, type: 'fixed' },
        { id: 'a3', name: 'Performance Bonus', amount: 15, type: 'percentage', description: '15% of base salary' },
      ],
      totalCompensation: 495000,
      benefits: ['Health Insurance', 'Annual Leave (21 days)', 'Pension'],
      requirements: ['Bachelor\'s degree', '5+ years experience'],
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Fleet Manager',
      departmentId: '3',
      department: { id: '3', name: 'Logistics & Fleet', description: '', employeeCount: 32, createdAt: '', updatedAt: '' },
      description: 'Manage truck fleet and logistics operations',
      level: 'manager',
      baseSalary: 350000,
      allowances: [
        { id: 'a4', name: 'Housing', amount: 120000, type: 'fixed' },
        { id: 'a5', name: 'Transport', amount: 60000, type: 'fixed' },
        { id: 'a6', name: 'Field Allowance', amount: 40000, type: 'fixed' },
      ],
      totalCompensation: 570000,
      benefits: ['Health Insurance', 'Annual Leave (21 days)', 'Pension', 'Vehicle'],
      requirements: ['Bachelor\'s degree in Logistics', '7+ years experience'],
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
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

  const calculateTotalCompensation = (baseSalary: number, allowances: PositionAllowance[]) => {
    let total = baseSalary;
    allowances.forEach(allowance => {
      if (allowance.type === 'fixed') {
        total += allowance.amount;
      } else {
        total += (baseSalary * allowance.amount) / 100;
      }
    });
    return total;
  };

  const handleAddAllowance = () => {
    if (allowanceForm.name && allowanceForm.amount > 0) {
      const newAllowance: PositionAllowance = {
        id: `temp-${Date.now()}`,
        ...allowanceForm,
      };
      setFormData({
        ...formData,
        allowances: [...formData.allowances, newAllowance],
      });
      setAllowanceForm({ name: '', amount: 0, type: 'fixed', description: '' });
    }
  };

  const handleRemoveAllowance = (id: string) => {
    setFormData({
      ...formData,
      allowances: formData.allowances.filter(a => a.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalComp = calculateTotalCompensation(formData.baseSalary, formData.allowances);

    if (selectedPosition) {
      setPositions(positions.map(p =>
        p.id === selectedPosition.id
          ? { ...p, ...formData, totalCompensation: totalComp, updatedAt: new Date().toISOString() }
          : p
      ));
    } else {
      const newPosition: Position = {
        id: String(positions.length + 1),
        ...formData,
        totalCompensation: totalComp,
        department: departments.find(d => d.id === formData.departmentId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPositions([...positions, newPosition]);
    }
    handleCancel();
  };

  const handleEdit = (position: Position) => {
    setSelectedPosition(position);
    setFormData({
      title: position.title,
      departmentId: position.departmentId,
      description: position.description,
      level: position.level,
      baseSalary: position.baseSalary,
      allowances: position.allowances,
      benefits: position.benefits,
      requirements: position.requirements,
      status: position.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedPosition(undefined);
    setFormData({
      title: '',
      departmentId: '',
      description: '',
      level: 'mid',
      baseSalary: 0,
      allowances: [],
      benefits: [],
      requirements: [],
      status: 'active',
    });
    setAllowanceForm({ name: '', amount: 0, type: 'fixed', description: '' });
  };

  const filteredPositions = positions.filter(position => {
    return position.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getLevelBadge = (level: string) => {
    const badges: Record<string, string> = {
      entry: 'bg-gray-100 text-gray-800',
      junior: 'bg-blue-100 text-blue-800',
      mid: 'bg-green-100 text-green-800',
      senior: 'bg-orange-100 text-orange-800',
      lead: 'bg-purple-100 text-purple-800',
      manager: 'bg-red-100 text-red-800',
      director: 'bg-indigo-100 text-indigo-800',
      executive: 'bg-pink-100 text-pink-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Position Management</h1>
            <p className="text-gray-600">Define positions with salary structures and benefits</p>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Position
            </Button>
          )}
        </div>

        {!isFormOpen && (
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search positions by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {isFormOpen ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedPosition ? 'Edit Position' : 'Create New Position'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position Title*</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level*</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as Position['level'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    >
                      <option value="entry">Entry</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                      <option value="manager">Manager</option>
                      <option value="director">Director</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary (₦)*</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Allowances & Bonuses</h3>
                  <div className="grid md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Allowance Name"
                      value={allowanceForm.name}
                      onChange={(e) => setAllowanceForm({ ...allowanceForm, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={allowanceForm.amount || ''}
                      onChange={(e) => setAllowanceForm({ ...allowanceForm, amount: Number(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    />
                    <select
                      value={allowanceForm.type}
                      onChange={(e) => setAllowanceForm({ ...allowanceForm, type: e.target.value as 'fixed' | 'percentage' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                    <Button type="button" onClick={handleAddAllowance} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.allowances.length > 0 && (
                    <div className="space-y-2">
                      {formData.allowances.map((allowance) => (
                        <div key={allowance.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{allowance.name}</p>
                            <p className="text-xs text-gray-500">
                              {allowance.type === 'fixed'
                                ? `₦${allowance.amount.toLocaleString()}`
                                : `${allowance.amount}% of base salary`}
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleRemoveAllowance(allowance.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-900">
                      Total Compensation: ₦{calculateTotalCompensation(formData.baseSalary, formData.allowances).toLocaleString()}/month
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
                  <Button type="submit">
                    {selectedPosition ? 'Update Position' : 'Create Position'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPositions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-8">
                    No positions found matching your search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPositions.map((position) => (
                <Card key={position.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-[#8B1538] bg-opacity-10 rounded-full">
                          <Briefcase className="h-5 w-5 text-[#8B1538]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                          <p className="text-sm text-gray-500">{position.department?.name}</p>
                        </div>
                        {getLevelBadge(position.level)}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{position.description}</p>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Base Salary</p>
                            <p className="text-sm font-medium text-gray-900">₦{position.baseSalary.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Total Compensation</p>
                            <p className="text-sm font-medium text-green-600">₦{position.totalCompensation.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Allowances</p>
                            <p className="text-sm font-medium text-gray-900">{position.allowances.length}</p>
                          </div>
                        </div>
                      </div>

                      {position.allowances.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Allowances & Bonuses:</p>
                          <div className="flex flex-wrap gap-2">
                            {position.allowances.map((allowance) => (
                              <Badge key={allowance.id} variant="outline">
                                {allowance.name}: {allowance.type === 'fixed' ? `₦${allowance.amount.toLocaleString()}` : `${allowance.amount}%`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button onClick={() => handleEdit(position)} variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(position.id)} variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
