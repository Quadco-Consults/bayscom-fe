'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Building2, Phone, Mail, MapPin, Star, X, Tag, Check } from 'lucide-react';

export default function VendorsPage() {
  // State management
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [vendors, setVendors] = useState([
    {
      id: 'V-001',
      name: 'ABC Supplies Ltd',
      categories: ['VC-001'], // Office Supplies
      email: 'contact@abcsupplies.com',
      phone: '+234 801 234 5678',
      address: 'Lagos, Nigeria',
      rating: 4.5,
      status: 'active',
      totalOrders: 24,
      totalValue: '₦2,400,000',
    },
    {
      id: 'V-002',
      name: 'Tech Solutions Inc',
      categories: ['VC-002'], // IT Equipment
      email: 'sales@techsolutions.com',
      phone: '+234 802 345 6789',
      address: 'Abuja, Nigeria',
      rating: 4.8,
      status: 'active',
      totalOrders: 18,
      totalValue: '₦5,200,000',
    },
    {
      id: 'V-003',
      name: 'AutoParts Nigeria',
      categories: ['VC-003'], // Vehicle Parts
      email: 'info@autoparts.ng',
      phone: '+234 803 456 7890',
      address: 'Port Harcourt, Nigeria',
      rating: 4.2,
      status: 'active',
      totalOrders: 31,
      totalValue: '₦3,800,000',
    },
    {
      id: 'V-004',
      name: 'Industrial Tools Co',
      categories: ['VC-004'], // Industrial Equipment
      email: 'orders@industrialtools.com',
      phone: '+234 804 567 8901',
      address: 'Kano, Nigeria',
      rating: 3.9,
      status: 'inactive',
      totalOrders: 8,
      totalValue: '₦1,200,000',
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categories: [] as string[],
    email: '',
    phone: '',
    address: '',
    rating: '4.0',
    status: 'active',
  });

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('vendorCategories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Failed to parse vendor categories:', error);
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle category selection (multi-select)
  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  // Get category names from IDs
  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map(id => categories.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  // Handle view vendor details
  const handleViewVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowViewModal(true);
  };

  // Handle edit vendor
  const handleEditVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      categories: vendor.categories || [],
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      rating: vendor.rating.toString(),
      status: vendor.status,
    });
    setShowEditModal(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    if (showEditModal && selectedVendor) {
      // Update existing vendor
      const updatedVendor = {
        ...selectedVendor,
        name: formData.name,
        categories: formData.categories,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        rating: parseFloat(formData.rating),
        status: formData.status,
      };

      setVendors(prev =>
        prev.map(v => v.id === selectedVendor.id ? updatedVendor : v)
      );

      setShowEditModal(false);
      setSelectedVendor(null);
      alert('Vendor updated successfully!');
    } else {
      // Create new vendor
      const newVendor = {
        id: `V-${String(vendors.length + 1).padStart(3, '0')}`,
        name: formData.name,
        categories: formData.categories,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        rating: parseFloat(formData.rating),
        status: formData.status,
        totalOrders: 0,
        totalValue: '₦0',
      };

      // Add to vendors list
      setVendors(prev => [newVendor, ...prev]);

      setShowAddForm(false);
      alert('Vendor added successfully!');
    }

    // Reset form
    setFormData({
      name: '',
      categories: [],
      email: '',
      phone: '',
      address: '',
      rating: '4.0',
      status: 'active',
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600">Manage your supplier relationships</p>
          </div>
          <Button
            className="bg-[#2D5016] hover:bg-[#1F3509]"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Add Vendor Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Vendor Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories * (Select multiple)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-left hover:bg-gray-50"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        {formData.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {formData.categories.map(catId => {
                              const cat = categories.find(c => c.id === catId);
                              return cat ? (
                                <span key={catId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                  {cat.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-500">Select categories...</span>
                        )}
                      </button>
                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.categories.includes(category.id)}
                                  onChange={() => toggleCategory(category.id)}
                                  className="mr-2"
                                />
                                <div className="flex items-center space-x-2">
                                  <Tag className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm">{category.name}</span>
                                </div>
                              </label>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No categories available. Create categories first.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="vendor@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="City, State, Country"
                    required
                  />
                </div>

                {/* Rating and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Rating (0-5)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                      placeholder="4.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Add Vendor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Vendor Details Modal */}
        {showViewModal && selectedVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowViewModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Vendor Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Vendor ID</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedVendor.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <p className="text-sm text-gray-900">{selectedVendor.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Categories</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVendor.categories && selectedVendor.categories.length > 0 ? (
                            selectedVendor.categories.map((catId: string) => {
                              const cat = categories.find(c => c.id === catId);
                              return cat ? (
                                <span key={catId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {cat.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-sm text-gray-500">No categories</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <span className={getStatusBadge(selectedVendor.status)}>
                          {selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Mail className="h-4 w-4" />
                          <span>{selectedVendor.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Phone className="h-4 w-4" />
                          <span>{selectedVendor.phone}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Address</label>
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedVendor.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Rating</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(selectedVendor.rating)}
                        </div>
                        <span className="text-lg font-semibold text-gray-900">({selectedVendor.rating})</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedVendor.totalOrders}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-[#2D5016]">{selectedVendor.totalValue}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditVendor(selectedVendor);
                    }}
                  >
                    Edit Vendor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vendor Modal */}
        {showEditModal && selectedVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Vendor</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedVendor(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Vendor Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories * (Select multiple)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-left hover:bg-gray-50"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        {formData.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {formData.categories.map(catId => {
                              const cat = categories.find(c => c.id === catId);
                              return cat ? (
                                <span key={catId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                  {cat.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-500">Select categories...</span>
                        )}
                      </button>
                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.categories.includes(category.id)}
                                  onChange={() => toggleCategory(category.id)}
                                  className="mr-2"
                                />
                                <div className="flex items-center space-x-2">
                                  <Tag className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm">{category.name}</span>
                                </div>
                              </label>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No categories available. Create categories first.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="vendor@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="City, State, Country"
                    required
                  />
                </div>

                {/* Rating and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (0-5)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                      placeholder="4.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedVendor(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Update Vendor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">₦12.6M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.categories && vendor.categories.length > 0 ? (
                          vendor.categories.map((catId: string) => {
                            const cat = categories.find(c => c.id === catId);
                            return cat ? (
                              <span key={catId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                {cat.name}
                              </span>
                            ) : null;
                          })
                        ) : (
                          <span className="text-sm text-gray-500">No categories</span>
                        )}
                      </div>
                    </div>
                    <span className={getStatusBadge(vendor.status)}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(vendor.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({vendor.rating})</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{vendor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.address}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-xl font-semibold text-gray-900">{vendor.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-xl font-semibold text-gray-900">{vendor.totalValue}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewVendor(vendor)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vendors Table (Alternative View) */}
        <Card>
          <CardHeader>
            <CardTitle>All Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          <p className="text-xs text-gray-600">{vendor.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {vendor.categories && vendor.categories.length > 0 ? (
                            vendor.categories.map((catId: string) => {
                              const cat = categories.find(c => c.id === catId);
                              return cat ? (
                                <span key={catId} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                  {cat.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-gray-900">{vendor.email}</p>
                          <p className="text-xs text-gray-600">{vendor.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(vendor.rating).slice(0, 5)}
                          <span className="text-xs text-gray-600">({vendor.rating})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{vendor.totalOrders}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{vendor.totalValue}</td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(vendor.status)}>
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewVendor(vendor)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            Edit
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
      </div>
    </DashboardLayout>
  );
}