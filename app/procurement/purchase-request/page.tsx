'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileText, Clock, CheckCircle, XCircle, X, ChevronDown, Search } from 'lucide-react';
import { procurementAPI } from '@/lib/api/procurement';
import { configAPI } from '@/lib/api/config';

export default function PurchaseRequestPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // State management
  const [purchaseRequests, setPurchaseRequests] = useState([
    // Mock data - replace with actual API calls
    {
      id: 'PR-2024-001',
      title: 'Office Supplies',
      department: 'Administration',
      status: 'pending',
      amount: '₦150,000',
      date: '2024-10-25',
      items: 3,
      itemDetails: [
        { name: 'Office Pens (Blue)', quantity: '50', unit_price: '200', description: 'Blue ballpoint pens' },
        { name: 'A4 Paper (Ream)', quantity: '20', unit_price: '3500', description: 'Premium A4 paper' },
        { name: 'Folders', quantity: '100', unit_price: '700', description: 'Document folders' }
      ]
    },
    {
      id: 'PR-2024-002',
      title: 'Vehicle Maintenance',
      department: 'Operations',
      status: 'approved',
      amount: '₦500,000',
      date: '2024-10-20',
      items: 3,
      itemDetails: [
        { name: 'Engine Oil Change', quantity: '3', unit_price: '50000', description: 'Full synthetic oil' },
        { name: 'Brake Pads', quantity: '6', unit_price: '25000', description: 'Heavy duty brake pads' },
        { name: 'Tire Replacement', quantity: '8', unit_price: '25000', description: 'Premium tires' }
      ]
    },
    {
      id: 'PR-2024-003',
      title: 'IT Equipment',
      department: 'IT',
      status: 'rejected',
      amount: '₦1,200,000',
      date: '2024-10-18',
      items: 3,
      itemDetails: [
        { name: 'Dell Laptops', quantity: '5', unit_price: '150000', description: 'Dell Latitude series' },
        { name: 'Network Router', quantity: '2', unit_price: '75000', description: 'Enterprise router' },
        { name: 'UPS Systems', quantity: '3', unit_price: '100000', description: '2KVA UPS units' }
      ]
    },
  ]);

  // Form state for new purchase request
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  // View details state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    total_amount: '',
    items: [{ name: '', quantity: '', unit_price: '', description: '' }]
  });

  // Load departments on mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await configAPI.departments.getAll();
        setDepartments(response);
      } catch (error) {
        console.error('Failed to load departments:', error);
        // Use mock departments if API fails
        setDepartments([
          { id: 1, name: 'Administration' },
          { id: 2, name: 'Operations' },
          { id: 3, name: 'IT' },
          { id: 4, name: 'Finance' },
          { id: 5, name: 'Human Resources' }
        ]);
      }
    };
    loadDepartments();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle department selection
  const handleDepartmentSelect = (department: any) => {
    setSelectedDepartment(department.name);
    setFormData(prev => ({
      ...prev,
      department: department.id.toString()
    }));
    setShowDepartmentDropdown(false);
  };

  // Handle item changes
  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', unit_price: '', description: '' }]
    }));
  };

  // Remove item
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = calculateTotal();

      if (editingRequest) {
        // Update existing request
        const updatedRequest = {
          ...editingRequest,
          title: formData.title,
          description: formData.description,
          department: departments.find(d => d.id === parseInt(formData.department))?.name || formData.department,
          amount: `₦${totalAmount.toLocaleString()}`,
          items: formData.items.length,
          itemDetails: formData.items,
        };

        setPurchaseRequests(prev =>
          prev.map(pr => pr.id === editingRequest.id ? updatedRequest : pr)
        );

        alert('Purchase Request updated successfully!');
      } else {
        // Create new request
        const requestData = {
          title: formData.title,
          description: formData.description,
          department: formData.department,
          total_amount: totalAmount,
          requested_by: 1, // This should be the current user ID
          status: 'pending'
        };

        // Try to create via API, fall back to mock if needed
        let newRequest;
        try {
          newRequest = await procurementAPI.purchaseRequests.create(requestData);
        } catch (apiError) {
          console.warn('API creation failed, using mock:', apiError);
          // Create mock request with full item details
          newRequest = {
            id: `PR-2024-${String(purchaseRequests.length + 4).padStart(3, '0')}`,
            title: formData.title,
            description: formData.description,
            department: departments.find(d => d.id === parseInt(formData.department))?.name || formData.department,
            status: 'pending',
            amount: `₦${totalAmount.toLocaleString()}`,
            date: new Date().toISOString().split('T')[0],
            items: formData.items.length,
            itemDetails: formData.items, // Save the actual items
          };
        }

        // Add to local state
        setPurchaseRequests(prev => [newRequest, ...prev]);

        alert('Purchase request created successfully!');
      }

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        department: '',
        total_amount: '',
        items: [{ name: '', quantity: '', unit_price: '', description: '' }]
      });
      setSelectedDepartment('');
      setEditingRequest(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to save purchase request:', error);
      alert('Failed to save purchase request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing PR details
  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  // Handle editing PR
  const handleEditRequest = (request: any) => {
    setEditingRequest(request);
    const dept = departments.find((d: any) => d.name === request.department);
    setSelectedDepartment(request.department);
    setFormData({
      title: request.title,
      description: request.description || '',
      department: dept?.id?.toString() || '',
      total_amount: request.amount,
      items: request.itemDetails || [{ name: '', quantity: '', unit_price: '', description: '' }]
    });
    setShowCreateForm(true);
  };

  // Handle approve
  const handleApprove = (request: any) => {
    const approvedRequest = { ...request, status: 'approved' };

    setPurchaseRequests(prev =>
      prev.map(pr =>
        pr.id === request.id
          ? approvedRequest
          : pr
      )
    );
    setSelectedRequest(approvedRequest);

    // Save to localStorage for Purchase Order page
    const existingApprovedPRs = localStorage.getItem('approvedPRs');
    let approvedPRsList = [];

    if (existingApprovedPRs) {
      try {
        approvedPRsList = JSON.parse(existingApprovedPRs);
      } catch (error) {
        console.error('Failed to parse approved PRs:', error);
      }
    }

    // Add this PR to the list if not already there
    if (!approvedPRsList.find((pr: any) => pr.id === request.id)) {
      approvedPRsList.push(approvedRequest);
      localStorage.setItem('approvedPRs', JSON.stringify(approvedPRsList));
    }

    alert('Purchase Request approved successfully! It will now appear in the Purchase Orders page for conversion.');
  };

  // Handle reject
  const handleReject = (request: any) => {
    const reason = prompt('Enter rejection reason (optional):');
    setPurchaseRequests(prev =>
      prev.map(pr =>
        pr.id === request.id
          ? { ...pr, status: 'rejected', rejectionReason: reason }
          : pr
      )
    );
    setSelectedRequest({ ...request, status: 'rejected' });
    alert('Purchase Request rejected.');
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
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

  // Filter purchase requests based on search query
  const filteredPurchaseRequests = purchaseRequests.filter((request) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      request.id.toLowerCase().includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.department.toLowerCase().includes(query) ||
      request.status.toLowerCase().includes(query) ||
      request.amount.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Requests</h1>
              <p className="text-gray-600">Manage and track all purchase requests</p>
            </div>
            <button
              className="bg-[#2D5016] hover:bg-[#1F3509] text-white px-4 py-2 rounded-md inline-flex items-center text-sm font-medium"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search purchase requests..."
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

        {/* Create Form Modal Overlay */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRequest ? 'Edit Purchase Request' : 'Create New Purchase Request'}
                </h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingRequest(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter request title"
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      >
                        {selectedDepartment || 'Select department'}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {showDepartmentDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                          {departments.map((dept: any) => (
                            <button
                              key={dept.id}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                              onClick={() => handleDepartmentSelect(dept)}
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
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter request description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Items Section */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Request Items</h3>
                  </div>

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Item Name *
                            </label>
                            <Input
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              placeholder="Item name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Quantity *
                            </label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              placeholder="0"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Unit Price (₦) *
                            </label>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Total
                            </label>
                            <Input
                              value={`₦${((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toLocaleString()}`}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Item description or specifications"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Item Button - Now at the bottom */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addItem}
                      className="w-full px-4 py-3 text-sm border-2 border-dashed border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 inline-flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Item
                    </button>
                  </div>

                  {/* Total Amount */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                      <span className="text-xl font-bold text-[#2D5016]">
                        ₦{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingRequest(null);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded disabled:opacity-50"
                    disabled={loading || !formData.title || !formData.department}
                  >
                    {loading ? (editingRequest ? 'Updating...' : 'Creating...') : (editingRequest ? 'Update Purchase Request' : 'Create Purchase Request')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Purchase Request Details</h2>
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
                        <label className="block text-sm font-medium text-gray-600">Date Requested</label>
                        <p className="text-sm text-gray-900">{selectedRequest.date}</p>
                      </div>
                      {selectedRequest.description && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Description</label>
                          <p className="text-sm text-gray-900">{selectedRequest.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Amount</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(selectedRequest.status)}
                          <span className={getStatusBadge(selectedRequest.status)}>
                            {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Total Amount</label>
                        <p className="text-lg font-bold text-[#2D5016]">{selectedRequest.amount}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Number of Items</label>
                        <p className="text-sm text-gray-900">{selectedRequest.items} items</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Requested Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Unit Price</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.itemDetails && selectedRequest.itemDetails.length > 0 ? (
                          selectedRequest.itemDetails.map((item: any, index: number) => {
                            const quantity = parseFloat(item.quantity) || 0;
                            const unitPrice = parseFloat(item.unit_price) || 0;
                            const total = quantity * unitPrice;

                            return (
                              <tr key={index} className="border-t border-gray-100">
                                <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                                <td className="py-3 px-4 text-gray-600">{item.description || '-'}</td>
                                <td className="py-3 px-4">{quantity}</td>
                                <td className="py-3 px-4">₦{unitPrice.toLocaleString()}</td>
                                <td className="py-3 px-4 font-medium">₦{total.toLocaleString()}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                              No items found
                            </td>
                          </tr>
                        )}
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
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
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
                  <p className="text-2xl font-bold text-gray-900">28</p>
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
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">43</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Request ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchaseRequests.length > 0 ? (
                    filteredPurchaseRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className="ml-2 font-medium text-gray-900">{request.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{request.title}</td>
                      <td className="py-3 px-4 text-gray-600">{request.department}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{request.amount}</td>
                      <td className="py-3 px-4 text-gray-600">{request.items} items</td>
                      <td className="py-3 px-4 text-gray-600">{request.date}</td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                            onClick={() => handleViewRequest(request)}
                          >
                            View
                          </button>
                          {request.status === 'pending' && (
                            <button
                              className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                              onClick={() => handleEditRequest(request)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                        {searchQuery ? `No purchase requests found matching "${searchQuery}"` : 'No purchase requests found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}