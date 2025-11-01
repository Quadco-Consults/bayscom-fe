'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Tag, X, Edit, Trash2, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';

export default function ItemCategoryPage() {
  // State management
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [parentCategoryForSub, setParentCategoryForSub] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
  });

  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    description: '',
  });

  // Load categories from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('itemCategories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Failed to parse item categories:', error);
      }
    } else {
      // Set default categories with subcategories
      const defaultCategories = [
        {
          id: 'CAT-001',
          name: 'LPG Equipment',
          description: 'LPG cylinders, regulators, and accessories',
          itemCount: 0,
          subcategories: [
            { id: 'SUB-001', name: 'Cylinders', description: 'LPG gas cylinders', itemCount: 0 },
            { id: 'SUB-002', name: 'Regulators', description: 'Pressure regulators', itemCount: 0 },
            { id: 'SUB-003', name: 'Hoses', description: 'Gas hoses', itemCount: 0 },
            { id: 'SUB-004', name: 'Valves', description: 'Cylinder valves', itemCount: 0 },
          ],
        },
        {
          id: 'CAT-002',
          name: 'Lubricants',
          description: 'Engine oils and lubricants',
          itemCount: 0,
          subcategories: [
            { id: 'SUB-005', name: 'Engine Oil', description: 'Motor engine oils', itemCount: 0 },
            { id: 'SUB-006', name: 'Grease', description: 'Industrial grease', itemCount: 0 },
          ],
        },
        {
          id: 'CAT-003',
          name: 'Tools & Equipment',
          description: 'Tools and equipment',
          itemCount: 0,
          subcategories: [],
        },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('itemCategories', JSON.stringify(defaultCategories));
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('itemCategories', JSON.stringify(categories));
    }
  }, [categories]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle category form submission
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (showEditCategoryModal && selectedCategory) {
      // Update existing category
      setCategories(prev =>
        prev.map(c =>
          c.id === selectedCategory.id
            ? { ...c, name: categoryFormData.name, description: categoryFormData.description }
            : c
        )
      );
      setShowEditCategoryModal(false);
      setSelectedCategory(null);
      alert('Category updated successfully!');
    } else {
      // Create new category
      const newCategory = {
        id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
        name: categoryFormData.name,
        description: categoryFormData.description,
        itemCount: 0,
        subcategories: [],
      };

      setCategories(prev => [newCategory, ...prev]);
      setShowAddCategoryModal(false);
      alert('Category added successfully!');
    }

    setCategoryFormData({ name: '', description: '' });
  };

  // Handle subcategory form submission
  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (showEditSubcategoryModal && selectedSubcategory && selectedCategory) {
      // Update existing subcategory
      setCategories(prev =>
        prev.map(c =>
          c.id === selectedCategory.id
            ? {
                ...c,
                subcategories: c.subcategories.map((sub: any) =>
                  sub.id === selectedSubcategory.id
                    ? { ...sub, name: subcategoryFormData.name, description: subcategoryFormData.description }
                    : sub
                ),
              }
            : c
        )
      );
      setShowEditSubcategoryModal(false);
      setSelectedSubcategory(null);
      setSelectedCategory(null);
      alert('Subcategory updated successfully!');
    } else if (parentCategoryForSub) {
      // Create new subcategory
      const newSubcategory = {
        id: `SUB-${Date.now()}`,
        name: subcategoryFormData.name,
        description: subcategoryFormData.description,
        itemCount: 0,
      };

      setCategories(prev =>
        prev.map(c =>
          c.id === parentCategoryForSub.id
            ? { ...c, subcategories: [...c.subcategories, newSubcategory] }
            : c
        )
      );
      setShowAddSubcategoryModal(false);
      setParentCategoryForSub(null);
      alert('Subcategory added successfully!');
    }

    setSubcategoryFormData({ name: '', description: '' });
  };

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description,
    });
    setShowEditCategoryModal(true);
  };

  // Handle delete category
  const handleDeleteCategory = (category: any) => {
    if (category.itemCount > 0 || category.subcategories.length > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.subcategories.length} subcategories or ${category.itemCount} items.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== category.id));
      alert('Category deleted successfully!');
    }
  };

  // Handle add subcategory
  const handleAddSubcategory = (category: any) => {
    setParentCategoryForSub(category);
    setSubcategoryFormData({ name: '', description: '' });
    setShowAddSubcategoryModal(true);
  };

  // Handle edit subcategory
  const handleEditSubcategory = (category: any, subcategory: any) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSubcategoryFormData({
      name: subcategory.name,
      description: subcategory.description,
    });
    setShowEditSubcategoryModal(true);
  };

  // Handle delete subcategory
  const handleDeleteSubcategory = (category: any, subcategory: any) => {
    if (subcategory.itemCount > 0) {
      alert(`Cannot delete subcategory "${subcategory.name}" because it has ${subcategory.itemCount} items.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the subcategory "${subcategory.name}"?`)) {
      setCategories(prev =>
        prev.map(c =>
          c.id === category.id
            ? { ...c, subcategories: c.subcategories.filter((sub: any) => sub.id !== subcategory.id) }
            : c
        )
      );
      alert('Subcategory deleted successfully!');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Item Categories</h1>
            <p className="text-gray-600">Manage categories and subcategories for organizing items</p>
          </div>
          <Button
            className="bg-[#2D5016] hover:bg-[#1F3509]"
            onClick={() => setShowAddCategoryModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Stats Card */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subcategories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.reduce((sum, c) => sum + c.subcategories.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories in Use</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.filter(c => c.itemCount > 0 || c.subcategories.some((s: any) => s.itemCount > 0)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Tag className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.reduce((sum, c) => sum + c.itemCount + c.subcategories.reduce((subSum: number, s: any) => subSum + s.itemCount, 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories & Subcategories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const isExpanded = expandedCategories.includes(category.id);

                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg">
                      {/* Category Header */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{category.name}</h3>
                              <span className="text-xs text-gray-500">({category.id})</span>
                            </div>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {category.subcategories.length} subcategories
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddSubcategory(category)}
                            className="px-2 py-1 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Sub
                          </Button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="px-2 py-1 text-xs border border-red-300 rounded bg-white text-red-700 hover:bg-red-50"
                            disabled={category.subcategories.length > 0 || category.itemCount > 0}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      {isExpanded && category.subcategories.length > 0 && (
                        <div className="border-t border-gray-200 bg-white">
                          {category.subcategories.map((subcategory: any) => (
                            <div
                              key={subcategory.id}
                              className="flex items-center justify-between p-4 pl-12 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <Tag className="h-4 w-4 text-green-600" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{subcategory.name}</span>
                                    <span className="text-xs text-gray-500">({subcategory.id})</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{subcategory.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">{subcategory.itemCount} items</span>
                                <button
                                  onClick={() => handleEditSubcategory(category, subcategory)}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubcategory(category, subcategory)}
                                  className="px-2 py-1 text-xs border border-red-300 rounded bg-white text-red-700 hover:bg-red-50"
                                  disabled={subcategory.itemCount > 0}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 px-4 text-center text-gray-500">
                  No categories found. Click "Add Category" to create one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddCategoryModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <Input
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., LPG Equipment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditCategoryModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    setSelectedCategory(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <Input
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., LPG Equipment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowEditCategoryModal(false);
                      setSelectedCategory(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Subcategory Modal */}
        {showAddSubcategoryModal && parentCategoryForSub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Add Subcategory to "{parentCategoryForSub.name}"
                </h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowAddSubcategoryModal(false);
                    setParentCategoryForSub(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubcategorySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Name *
                  </label>
                  <Input
                    value={subcategoryFormData.name}
                    onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Cylinders"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subcategoryFormData.description}
                    onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this subcategory"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowAddSubcategoryModal(false);
                      setParentCategoryForSub(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Add Subcategory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Subcategory Modal */}
        {showEditSubcategoryModal && selectedSubcategory && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Subcategory</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditSubcategoryModal(false);
                    setSelectedSubcategory(null);
                    setSelectedCategory(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubcategorySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Name *
                  </label>
                  <Input
                    value={subcategoryFormData.name}
                    onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Cylinders"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subcategoryFormData.description}
                    onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this subcategory"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowEditSubcategoryModal(false);
                      setSelectedSubcategory(null);
                      setSelectedCategory(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Update Subcategory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
