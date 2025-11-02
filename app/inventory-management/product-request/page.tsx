'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileText, Clock, CheckCircle, XCircle, X, ChevronDown, Search } from 'lucide-react';

export default function ProductRequestPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Demo/Placeholder product requests
  const defaultProductRequests = [
    {
      id: 'PRQ-2024-001',
      title: 'Monthly Office Supplies',
      purpose: 'Regular monthly restocking of office supplies for administrative department',
      department: 'Administration',
      status: 'pending',
      date: '2024-10-25',
      items: [
        { productId: '1', productName: '6kg LPG Cylinder', quantity: '10', unit: 'pieces' },
        { productId: '3', productName: 'LPG Regulator - Standard', quantity: '15', unit: 'pieces' }
      ],
      requestedBy: 'John Doe',
      createdAt: '2024-10-25T10:00:00',
    },
    {
      id: 'PRQ-2024-002',
      title: 'Equipment for New Branch',
      purpose: 'Setting up new branch office with required equipment and supplies',
      department: 'Operations',
      status: 'approved',
      date: '2024-10-20',
      items: [
        { productId: '2', productName: '12kg LPG Cylinder', quantity: '20', unit: 'pieces' },
        { productId: '4', productName: 'LPG Gas Hose - 2m', quantity: '25', unit: 'pieces' },
        { productId: '5', productName: 'LPG Cylinder Valve', quantity: '30', unit: 'pieces' }
      ],
      requestedBy: 'Jane Smith',
      createdAt: '2024-10-20T14:30:00',
    },
    {
      id: 'PRQ-2024-003',
      title: 'Replacement Parts',
      purpose: 'Replacement of worn out and damaged parts from warehouse',
      department: 'IT',
      status: 'rejected',
      date: '2024-10-18',
      items: [
        { productId: '3', productName: 'LPG Regulator - Standard', quantity: '5', unit: 'pieces' }
      ],
      requestedBy: 'Mike Johnson',
      createdAt: '2024-10-18T09:15:00',
    },
    {
      id: 'PRQ-2024-004',
      title: 'Stock Replenishment',
      purpose: 'Replenishment of low stock items in main warehouse',
      department: 'Finance',
      status: 'approved',
      date: '2024-10-15',
      items: [
        { productId: '1', productName: '6kg LPG Cylinder', quantity: '50', unit: 'pieces' },
        { productId: '4', productName: 'LPG Gas Hose - 2m', quantity: '100', unit: 'pieces' }
      ],
      requestedBy: 'Sarah Williams',
      createdAt: '2024-10-15T11:45:00',
    },
  ];

  // Demo/Default products available
  const defaultProducts = [
    {
      id: '1',
      sku: 'LPG-CYL-6KG',
      name: '6kg LPG Cylinder',
      category: 'lpg-cylinders',
      description: 'Standard 6kg LPG gas cylinder',
      unit: 'pieces',
      currentStock: 145,
      unitPrice: 8500,
    },
    {
      id: '2',
      sku: 'LPG-CYL-12KG',
      name: '12kg LPG Cylinder',
      category: 'lpg-cylinders',
      description: 'Standard 12kg LPG gas cylinder',
      unit: 'pieces',
      currentStock: 78,
      unitPrice: 15000,
    },
    {
      id: '3',
      sku: 'LPG-REG-001',
      name: 'LPG Regulator - Standard',
      category: 'lpg-regulators',
      description: 'Standard pressure LPG regulator',
      unit: 'pieces',
      currentStock: 45,
      unitPrice: 2500,
    },
    {
      id: '4',
      sku: 'LPG-HOSE-2M',
      name: 'LPG Gas Hose - 2m',
      category: 'lpg-hoses',
      description: '2 meter reinforced LPG gas hose',
      unit: 'pieces',
      currentStock: 380,
      unitPrice: 1800,
    },
    {
      id: '5',
      sku: 'LPG-VALVE-STD',
      name: 'LPG Cylinder Valve',
      category: 'lpg-valves',
      description: 'Standard cylinder safety valve',
      unit: 'pieces',
      currentStock: 25,
      unitPrice: 3200,
    },
  ];

  // State management
  const [productRequests, setProductRequests] = useState<any[]>(defaultProductRequests);
  const [availableProducts, setAvailableProducts] = useState<any[]>(defaultProducts);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Operations' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Human Resources' }
  ]);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    department: '',
    items: [{ productId: '', productName: '', quantity: '', unit: '' }]
  });

  const [productSearchTerms, setProductSearchTerms] = useState<{ [key: number]: string }>({});
  const [showProductDropdowns, setShowProductDropdowns] = useState<{ [key: number]: boolean }>({});

  // Load product requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('productRequests');
    if (savedRequests) {
      try {
        setProductRequests(JSON.parse(savedRequests));
      } catch (error) {
        console.error('Failed to parse product requests:', error);
      }
    }
  }, []);

  // Load available products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        setAvailableProducts(products);
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowProductDropdowns({});
        setShowDepartmentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save product requests to localStorage
  const saveToLocalStorage = (requests: any[]) => {
    localStorage.setItem('productRequests', JSON.stringify(requests));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If product is selected, auto-fill product name and unit
    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unit = product.unit;
      }
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleProductSelect = (index: number, product: any) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      productId: product.id,
      productName: product.name,
      unit: product.unit
    };
    setFormData(prev => ({ ...prev, items: newItems }));

    // Clear search and close dropdown
    setProductSearchTerms(prev => ({ ...prev, [index]: product.name }));
    setShowProductDropdowns(prev => ({ ...prev, [index]: false }));
  };

  const toggleProductDropdown = (index: number) => {
    setShowProductDropdowns(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleProductSearchChange = (index: number, value: string) => {
    setProductSearchTerms(prev => ({ ...prev, [index]: value }));
    setShowProductDropdowns(prev => ({ ...prev, [index]: true }));
  };

  const getFilteredProducts = (index: number) => {
    const searchTerm = productSearchTerms[index]?.toLowerCase() || '';
    if (!searchTerm) return availableProducts;

    return availableProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
    );
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', productName: '', quantity: '', unit: '' }]
    }));
  };

  const removeItemRow = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
      // Clear search term and dropdown state for this index
      setProductSearchTerms(prev => {
        const newTerms = { ...prev };
        delete newTerms[index];
        return newTerms;
      });
      setShowProductDropdowns(prev => {
        const newDropdowns = { ...prev };
        delete newDropdowns[index];
        return newDropdowns;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate stock availability for each requested item
    const validItems = formData.items.filter(item => item.productId && item.quantity);

    for (const item of validItems) {
      const product = availableProducts.find(p => p.id === item.productId);

      if (!product) {
        alert(`Product "${item.productName}" not found in inventory!`);
        return;
      }

      const requestedQty = parseInt(item.quantity);

      if (isNaN(requestedQty) || requestedQty <= 0) {
        alert(`Please enter a valid quantity for "${item.productName}"`);
        return;
      }

      if (requestedQty > product.currentStock) {
        alert(
          `Insufficient stock for "${item.productName}"!\n` +
          `Requested: ${requestedQty} ${item.unit}\n` +
          `Available: ${product.currentStock} ${item.unit}\n\n` +
          `Please reduce the quantity or choose a different product.`
        );
        return;
      }
    }

    const newRequest = {
      id: `PRQ-${Date.now()}`,
      title: formData.title,
      purpose: formData.purpose,
      department: selectedDepartment,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      items: validItems,
      requestedBy: 'Current User', // Replace with actual user
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...productRequests];
    setProductRequests(updatedRequests);
    saveToLocalStorage(updatedRequests);

    // Reset form
    setFormData({
      title: '',
      purpose: '',
      department: '',
      items: [{ productId: '', productName: '', quantity: '', unit: '' }]
    });
    setSelectedDepartment('');
    setProductSearchTerms({});
    setShowProductDropdowns({});
    setShowCreateForm(false);
    alert('Product request created successfully!');
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleApprove = (request: any) => {
    const updatedRequests = productRequests.map(req =>
      req.id === request.id ? { ...req, status: 'approved' } : req
    );
    setProductRequests(updatedRequests);
    saveToLocalStorage(updatedRequests);
    setSelectedRequest({ ...request, status: 'approved' });
    alert('Product request approved successfully!');
  };

  const handleReject = (request: any) => {
    const updatedRequests = productRequests.map(req =>
      req.id === request.id ? { ...req, status: 'rejected' } : req
    );
    setProductRequests(updatedRequests);
    saveToLocalStorage(updatedRequests);
    setSelectedRequest({ ...request, status: 'rejected' });
    alert('Product request rejected.');
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Filter requests based on search
  const filteredRequests = productRequests.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.id.toLowerCase().includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.department.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Request</h1>
              <p className="text-gray-600">Request products from inventory for your department</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#2D5016] hover:bg-[#1F3509]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search product requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{productRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {productRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {productRequests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {productRequests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Product Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Request ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{request.id}</td>
                        <td className="py-3 px-4 text-gray-600">{request.title}</td>
                        <td className="py-3 px-4 text-gray-600">{request.department}</td>
                        <td className="py-3 px-4 text-gray-600">{request.items.length} items</td>
                        <td className="py-3 px-4 text-gray-600">{request.date}</td>
                        <td className="py-3 px-4">
                          <span className={getStatusBadge(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                        {searchQuery ? `No requests found matching "${searchQuery}"` : 'No product requests yet. Create your first request to get started.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Request Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Product Request</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowCreateForm(false);
                    setProductSearchTerms({});
                    setShowProductDropdowns({});
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Request Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Request Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Monthly Office Supplies"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between bg-white hover:bg-gray-50"
                        >
                          <span className={selectedDepartment ? 'text-gray-900' : 'text-gray-500'}>
                            {selectedDepartment || 'Select department...'}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                        {showDepartmentDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                            {departments.map((dept: any) => (
                              <button
                                key={dept.id}
                                type="button"
                                onClick={() => {
                                  setSelectedDepartment(dept.name);
                                  setShowDepartmentDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                              >
                                {dept.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose / Reason for Request *
                    </label>
                    <textarea
                      value={formData.purpose}
                      onChange={(e) => handleInputChange('purpose', e.target.value)}
                      placeholder="Explain why these products are needed"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Requested Products</h3>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg">
                        <div className="col-span-5">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Product *
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={productSearchTerms[index] || item.productName || ''}
                              onChange={(e) => handleProductSearchChange(index, e.target.value)}
                              onFocus={() => toggleProductDropdown(index)}
                              placeholder="Search product by name or SKU..."
                              className="text-sm"
                              required
                            />
                            {showProductDropdowns[index] && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                {getFilteredProducts(index).length > 0 ? (
                                  getFilteredProducts(index).map((product) => (
                                    <button
                                      key={product.id}
                                      type="button"
                                      onClick={() => handleProductSelect(index, product)}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-0"
                                    >
                                      <div className="font-medium text-gray-900">{product.name}</div>
                                      <div className="text-xs text-gray-500">{product.description}</div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            placeholder="0"
                            min="1"
                            className="text-sm"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <Input
                            value={item.unit}
                            readOnly
                            className="text-sm bg-gray-100"
                            placeholder="Auto"
                          />
                        </div>

                        <div className="col-span-3 flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                            disabled={formData.items.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={addItemRow}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowCreateForm(false);
                      setProductSearchTerms({});
                      setShowProductDropdowns({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Request Modal */}
        {showViewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowViewModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Request Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Request Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Request ID</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedRequest.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <p className="text-sm text-gray-900">{selectedRequest.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Department</label>
                        <p className="text-sm text-gray-900">{selectedRequest.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Purpose</label>
                        <p className="text-sm text-gray-900">{selectedRequest.purpose}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Current Status</label>
                        <span className={getStatusBadge(selectedRequest.status)}>
                          {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Request Date</label>
                        <p className="text-sm text-gray-900">{selectedRequest.date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requested Products */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Requested Products</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.items.map((item: any, index: number) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-900">{item.productName}</td>
                            <td className="py-3 px-4">{item.quantity}</td>
                            <td className="py-3 px-4">{item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  {selectedRequest.status === 'pending' && (
                    <>
                      <button
                        className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                        onClick={() => handleApprove(selectedRequest)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                        onClick={() => handleReject(selectedRequest)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
