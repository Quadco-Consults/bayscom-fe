'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit, Trash2, X, Tag } from 'lucide-react';
import Link from 'next/link';

interface ExpenseCategory {
  id: string;
  value: string;
  label: string;
  color: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const COLOR_OPTIONS = [
  { value: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Orange' },
  { value: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Blue' },
  { value: 'bg-red-100 text-red-800 border-red-200', label: 'Red' },
  { value: 'bg-green-100 text-green-800 border-green-200', label: 'Green' },
  { value: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Purple' },
  { value: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Yellow' },
  { value: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Pink' },
  { value: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Indigo' },
  { value: 'bg-teal-100 text-teal-800 border-teal-200', label: 'Teal' },
  { value: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Gray' },
];

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const stored = localStorage.getItem('fleet_expense_categories');
    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      // Default categories
      const defaultCategories: ExpenseCategory[] = [
        {
          id: '1',
          value: 'fuel',
          label: 'Fuel',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          description: 'Diesel and fuel costs',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          value: 'toll',
          label: 'Toll Fee',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: 'Highway toll fees',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          value: 'maintenance',
          label: 'Maintenance',
          color: 'bg-red-100 text-red-800 border-red-200',
          description: 'Vehicle repairs and maintenance',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          value: 'driver-allowance',
          label: 'Driver Allowance',
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Driver per diem and allowances',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          value: 'parking',
          label: 'Parking',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          description: 'Parking fees',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          value: 'loading-fee',
          label: 'Loading Fee',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          description: 'Loading and unloading charges',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '7',
          value: 'other',
          label: 'Other',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Miscellaneous expenses',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('fleet_expense_categories', JSON.stringify(defaultCategories));
    }
  };

  const saveCategories = (newCategories: ExpenseCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem('fleet_expense_categories', JSON.stringify(newCategories));
  };

  const handleAdd = () => {
    setEditingCategoryId(null);
    setFormData({
      value: '',
      label: '',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (category: ExpenseCategory) => {
    if (category.isDefault) {
      alert('Cannot edit default categories. You can only activate/deactivate them.');
      return;
    }
    setEditingCategoryId(category.id);
    setFormData({
      value: category.value,
      label: category.label,
      color: category.color,
      description: category.description || '',
      isActive: category.isActive,
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();

    // Generate value from label if not editing
    const categoryValue = editingCategoryId
      ? formData.value
      : formData.label.toLowerCase().replace(/\s+/g, '-');

    // Check for duplicate values
    const isDuplicate = categories.some(
      cat => cat.value === categoryValue && cat.id !== editingCategoryId
    );

    if (isDuplicate) {
      alert('A category with this value already exists. Please use a different label.');
      return;
    }

    if (editingCategoryId) {
      // Edit existing category
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategoryId
          ? {
              ...cat,
              label: formData.label,
              color: formData.color,
              description: formData.description,
              isActive: formData.isActive,
              updatedAt: now,
            }
          : cat
      );
      saveCategories(updatedCategories);
    } else {
      // Add new category
      const newCategory: ExpenseCategory = {
        id: Date.now().toString(),
        value: categoryValue,
        label: formData.label,
        color: formData.color,
        description: formData.description,
        isActive: formData.isActive,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      };
      saveCategories([...categories, newCategory]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) {
      alert('Cannot delete default categories. You can deactivate them instead.');
      return;
    }
    if (confirm('Are you sure you want to delete this expense category? This action cannot be undone.')) {
      saveCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    const updatedCategories = categories.map(cat =>
      cat.id === id
        ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
        : cat
    );
    saveCategories(updatedCategories);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-8 w-8 text-blue-600" />
              Expense Categories
            </h1>
            <p className="text-gray-600 mt-1">Manage expense categories for trip cost tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/operations/fleet"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Fleet
            </Link>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active Categories</p>
          <p className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Default Categories</p>
          <p className="text-2xl font-bold text-purple-600">
            {categories.filter(c => c.isDefault).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Custom Categories</p>
          <p className="text-2xl font-bold text-orange-600">
            {categories.filter(c => !c.isDefault).length}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">About Expense Categories</h4>
            <p className="text-sm text-blue-800">
              These categories are used when tracking expenses for trips. Default categories cannot be deleted
              but can be deactivated. Custom categories can be fully edited or deleted.
            </p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No expense categories found</p>
              <button
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Your First Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Value</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${category.color}`}>
                            {category.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">{category.value}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {category.description || '-'}
                      </td>
                      <td className="py-3 px-4">
                        {category.isDefault ? (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 rounded-full">
                            Default
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 rounded-full">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(category.id)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            category.isActive
                              ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title={category.isDefault ? 'Default categories can only be activated/deactivated' : 'Edit'}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {!category.isDefault && (
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategoryId ? 'Edit Expense Category' : 'Add New Expense Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Insurance, Security"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Display name for the category
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Badge *
                  </label>
                  <select
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {COLOR_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${formData.color}`}>
                      {formData.label || 'Preview'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Brief description of this expense category..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCategoryId ? 'Update' : 'Add'} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
