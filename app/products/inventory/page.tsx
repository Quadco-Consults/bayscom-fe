'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/lib/types';
import { Plus, Edit, Trash2, AlertTriangle, Package, X } from 'lucide-react';

// Default demo products
const defaultProducts: InventoryItem[] = [
    {
      id: '1',
      sku: 'LPG-CYL-6KG',
      name: '6kg LPG Cylinder',
      category: 'lpg-cylinders',
      description: 'Standard 6kg LPG gas cylinder',
      unit: 'pieces',
      reorderLevel: 50,
      reorderQuantity: 200,
      currentStock: 145,
      unitPrice: 8500,
      supplier: 'Gasoline Suppliers Ltd',
      location: 'Warehouse A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      sku: 'LPG-CYL-12KG',
      name: '12kg LPG Cylinder',
      category: 'lpg-cylinders',
      description: 'Standard 12kg LPG gas cylinder',
      unit: 'pieces',
      reorderLevel: 30,
      reorderQuantity: 100,
      currentStock: 78,
      unitPrice: 15000,
      supplier: 'Gasoline Suppliers Ltd',
      location: 'Warehouse A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      sku: 'LPG-REG-001',
      name: 'LPG Regulator - Standard',
      category: 'lpg-regulators',
      description: 'Standard pressure LPG regulator',
      unit: 'pieces',
      reorderLevel: 100,
      reorderQuantity: 500,
      currentStock: 45,
      unitPrice: 2500,
      supplier: 'Gas Equipment Co',
      location: 'Warehouse B',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '4',
      sku: 'LPG-HOSE-2M',
      name: 'LPG Gas Hose - 2m',
      category: 'lpg-hoses',
      description: '2 meter reinforced LPG gas hose',
      unit: 'pieces',
      reorderLevel: 150,
      reorderQuantity: 500,
      currentStock: 380,
      unitPrice: 1800,
      supplier: 'Gas Equipment Co',
      location: 'Warehouse B',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '5',
      sku: 'LPG-VALVE-STD',
      name: 'LPG Cylinder Valve',
      category: 'lpg-valves',
      description: 'Standard cylinder safety valve',
      unit: 'pieces',
      reorderLevel: 80,
      reorderQuantity: 300,
      currentStock: 25,
      unitPrice: 3200,
      supplier: 'Safety Equipment Inc',
      location: 'Warehouse A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

export default function InventoryPage() {
  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [classificationFilter, setClassificationFilter] = useState<string>('all'); // all, asset, consumable
  const [items, setItems] = useState<InventoryItem[]>(defaultProducts);

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('itemCategories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Failed to parse categories:', error);
      }
    }
  }, []);

  // Load products from localStorage or use defaults
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        setItems(products);
      } catch (error) {
        console.error('Failed to parse products:', error);
        // Use default products if parse fails
        localStorage.setItem('products', JSON.stringify(defaultProducts));
      }
    } else {
      // First time load - save default products to localStorage
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);

  // Save products to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('products', JSON.stringify(items));
    }
  }, [items]);

  // Form state
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    categoryId: '',
    subcategoryId: '',
    classification: 'consumable', // asset or consumable
    description: '',
    unit: 'pieces',
    reorderLevel: '',
    reorderQuantity: '',
    currentStock: '',
    unitPrice: '',
    location: '',
  });

  // Get available subcategories based on selected category
  const getAvailableSubcategories = () => {
    if (!formData.categoryId) return [];
    const category = categories.find(c => c.id === formData.categoryId);
    return category?.subcategories || [];
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // If changing category, reset subcategory
      if (field === 'categoryId') {
        return {
          ...prev,
          categoryId: value,
          subcategoryId: '',
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Handle add item
  const handleAddItem = () => {
    setFormData({
      sku: '',
      name: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      subcategoryId: '',
      classification: 'consumable',
      description: '',
      unit: 'pieces',
      reorderLevel: '',
      reorderQuantity: '',
      currentStock: '',
      unitPrice: '',
      location: '',
    });
    setShowAddModal(true);
  };

  // Handle edit item
  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      categoryId: (item as any).categoryId || '',
      subcategoryId: (item as any).subcategoryId || '',
      classification: (item as any).classification || 'consumable',
      description: item.description,
      unit: item.unit,
      reorderLevel: item.reorderLevel.toString(),
      reorderQuantity: item.reorderQuantity.toString(),
      currentStock: item.currentStock.toString(),
      unitPrice: item.unitPrice.toString(),
      location: item.location,
    });
    setShowEditModal(true);
  };

  // Handle delete item
  const handleDeleteItem = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      alert('Item deleted successfully!');
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (showEditModal && selectedItem) {
      // Update existing item
      const updatedItem: any = {
        ...selectedItem,
        sku: formData.sku,
        name: formData.name,
        category: formData.categoryId, // Keep for backward compatibility
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        classification: formData.classification,
        description: formData.description,
        unit: formData.unit,
        reorderLevel: parseInt(formData.reorderLevel),
        reorderQuantity: parseInt(formData.reorderQuantity),
        currentStock: parseInt(formData.currentStock),
        unitPrice: parseFloat(formData.unitPrice),
        supplier: '', // Not required anymore
        location: formData.location,
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setItems(prev => prev.map(i => i.id === selectedItem.id ? updatedItem : i));
      setShowEditModal(false);
      setSelectedItem(null);
      alert('Item updated successfully!');
    } else {
      // Create new item
      const newItem: any = {
        id: String(items.length + 1),
        sku: formData.sku,
        name: formData.name,
        category: formData.categoryId, // Keep for backward compatibility
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        classification: formData.classification,
        description: formData.description,
        unit: formData.unit,
        reorderLevel: parseInt(formData.reorderLevel),
        reorderQuantity: parseInt(formData.reorderQuantity),
        currentStock: parseInt(formData.currentStock),
        unitPrice: parseFloat(formData.unitPrice),
        supplier: '', // Not required anymore
        location: formData.location,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setItems(prev => [newItem, ...prev]);
      setShowAddModal(false);
      alert('Item added successfully!');
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  // Get subcategory name by ID
  const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
    if (!subcategoryId) return '';
    const category = categories.find(c => c.id === categoryId);
    const subcategory = category?.subcategories?.find((s: any) => s.id === subcategoryId);
    return subcategory?.name || '';
  };

  const getCategoryLabel = (category: string) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    } else if (item.currentStock <= item.reorderLevel) {
      return { label: 'Low Stock', variant: 'warning' as const };
    } else {
      return { label: 'In Stock', variant: 'success' as const };
    }
  };

  // Filter items by classification
  const filteredItems = items.filter((item) => {
    if (classificationFilter === 'all') return true;
    return (item as any).classification === classificationFilter;
  });

  const lowStockItems = filteredItems.filter((item) => item.currentStock <= item.reorderLevel);
  const totalValue = filteredItems.reduce((acc, item) => acc + item.currentStock * item.unitPrice, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-500">Manage all products across categories and subcategories</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="asset">Assets Only</option>
              <option value="consumable">Consumables Only</option>
            </select>
            <Button onClick={handleAddItem} className="bg-[#2D5016] hover:bg-[#1F3509]">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
                {lowStockItems.length > 0 && <AlertTriangle className="h-5 w-5 text-orange-600" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredItems.reduce((acc, item) => acc + item.currentStock, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-900">Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-800">
                {lowStockItems.length} item(s) are running low on stock and need reordering.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                const classification = (item as any).classification || 'consumable';
                return (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.sku}</Badge>
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <Badge className={classification === 'asset' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}>
                            {classification === 'asset' ? 'Asset' : 'Consumable'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {(item as any).categoryId ? getCategoryName((item as any).categoryId) : getCategoryLabel(item.category)}
                          {(item as any).subcategoryId && ` > ${getSubcategoryName((item as any).categoryId, (item as any).subcategoryId)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="text-lg font-semibold">
                          {item.currentStock} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Unit Price</p>
                        <p className="text-lg font-semibold">₦{item.unitPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Value</p>
                        <p className="text-lg font-semibold">
                          ₦{(item.currentStock * item.unitPrice).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="e.g., LPG-CYL-6KG"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., 6kg LPG Cylinder"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category...</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory {formData.categoryId && getAvailableSubcategories().length > 0 && '*'}
                    </label>
                    <select
                      value={formData.subcategoryId}
                      onChange={(e) => handleInputChange('subcategoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.categoryId && getAvailableSubcategories().length > 0}
                      disabled={!formData.categoryId || getAvailableSubcategories().length === 0}
                    >
                      <option value="">
                        {!formData.categoryId
                          ? 'Select category first...'
                          : getAvailableSubcategories().length === 0
                          ? 'No subcategories available'
                          : 'Select a subcategory...'}
                      </option>
                      {getAvailableSubcategories().map((subcategory: any) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classification *
                    </label>
                    <select
                      value={formData.classification}
                      onChange={(e) => handleInputChange('classification', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="consumable">Consumable</option>
                      <option value="asset">Asset</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="liters">Liters</option>
                      <option value="meters">Meters</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Item description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Stock Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock *
                    </label>
                    <Input
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => handleInputChange('currentStock', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Level *
                    </label>
                    <Input
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Quantity *
                    </label>
                    <Input
                      type="number"
                      value={formData.reorderQuantity}
                      onChange={(e) => handleInputChange('reorderQuantity', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price (₦) *
                    </label>
                    <Input
                      type="number"
                      value={formData.unitPrice}
                      onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location/Warehouse *
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Warehouse A"
                      required
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="e.g., LPG-CYL-6KG"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., 6kg LPG Cylinder"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category...</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory {formData.categoryId && getAvailableSubcategories().length > 0 && '*'}
                    </label>
                    <select
                      value={formData.subcategoryId}
                      onChange={(e) => handleInputChange('subcategoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.categoryId && getAvailableSubcategories().length > 0}
                      disabled={!formData.categoryId || getAvailableSubcategories().length === 0}
                    >
                      <option value="">
                        {!formData.categoryId
                          ? 'Select category first...'
                          : getAvailableSubcategories().length === 0
                          ? 'No subcategories available'
                          : 'Select a subcategory...'}
                      </option>
                      {getAvailableSubcategories().map((subcategory: any) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classification *
                    </label>
                    <select
                      value={formData.classification}
                      onChange={(e) => handleInputChange('classification', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="consumable">Consumable</option>
                      <option value="asset">Asset</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="liters">Liters</option>
                      <option value="meters">Meters</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Item description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Stock Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock *
                    </label>
                    <Input
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => handleInputChange('currentStock', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Level *
                    </label>
                    <Input
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Quantity *
                    </label>
                    <Input
                      type="number"
                      value={formData.reorderQuantity}
                      onChange={(e) => handleInputChange('reorderQuantity', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price (₦) *
                    </label>
                    <Input
                      type="number"
                      value={formData.unitPrice}
                      onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location/Warehouse *
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Warehouse A"
                      required
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Update Product
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
