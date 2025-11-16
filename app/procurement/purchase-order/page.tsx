'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  FileText,
  User
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  vendor: string;
  vendorId: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
  deliveryDate: string;
  paymentTerms?: string;
  rfqId?: string;
  purchaseRequestId?: string;
}

interface PurchaseOrderForm {
  vendor: string;
  vendorId: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  deliveryDate: string;
  paymentTerms: string;
  specialInstructions: string;
  deliveryAddress: string;
}

const mockVendors = [
  { id: 'V001', name: 'ABC Supplies Ltd', category: 'Office Supplies' },
  { id: 'V002', name: 'Tech Solutions Inc', category: 'Technology' },
  { id: 'V003', name: 'AutoParts Nigeria', category: 'Automotive' },
  { id: 'V004', name: 'Medical Equipment Co', category: 'Healthcare' },
];

export default function PurchaseOrderPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-2024-001',
      vendor: 'ABC Supplies Ltd',
      vendorId: 'V001',
      amount: '₦750,000',
      status: 'pending',
      date: '2024-10-25',
      items: 5,
      deliveryDate: '2024-11-05',
      paymentTerms: 'NET 30',
    },
    {
      id: 'PO-2024-002',
      vendor: 'Tech Solutions Inc',
      vendorId: 'V002',
      amount: '₦1,200,000',
      status: 'delivered',
      date: '2024-10-20',
      items: 8,
      deliveryDate: '2024-10-30',
      paymentTerms: 'NET 15',
    },
    {
      id: 'PO-2024-003',
      vendor: 'AutoParts Nigeria',
      vendorId: 'V003',
      amount: '₦500,000',
      status: 'shipped',
      date: '2024-10-18',
      items: 3,
      deliveryDate: '2024-11-02',
      paymentTerms: 'NET 30',
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [formData, setFormData] = useState<PurchaseOrderForm>({
    vendor: '',
    vendorId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    deliveryDate: '',
    paymentTerms: 'NET 30',
    specialInstructions: '',
    deliveryAddress: '',
  });

  // Check for RFQ data in localStorage when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromRFQ = urlParams.get('from') === 'rfq';

    if (fromRFQ) {
      const rfqData = localStorage.getItem('createPOFromRFQ');
      if (rfqData) {
        const data = JSON.parse(rfqData);
        setFormData({
          vendor: data.vendor || '',
          vendorId: data.vendorId || '',
          items: data.items || [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
          deliveryDate: data.deliveryDate || '',
          paymentTerms: data.paymentTerms || 'NET 30',
          specialInstructions: `Purchase Order created from RFQ ${data.rfqId || ''}`,
          deliveryAddress: '',
        });
        setSelectedVendor(data.vendor || '');
        setShowCreateForm(true);

        // Clear the data
        localStorage.removeItem('createPOFromRFQ');

        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-black" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVendorSelect = (vendor: any) => {
    setSelectedVendor(vendor.name);
    setFormData(prev => ({
      ...prev,
      vendor: vendor.name,
      vendorId: vendor.id,
    }));
    setShowVendorDropdown(false);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate total for the item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.vendor || !formData.deliveryDate || formData.items.length === 0) {
        alert('Please fill in all required fields');
        return;
      }

      // Calculate total amount
      const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);

      // Generate new PO ID
      const newId = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`;

      // Create new purchase order
      const newPurchaseOrder: PurchaseOrder = {
        id: newId,
        vendor: formData.vendor,
        vendorId: formData.vendorId,
        amount: `₦${totalAmount.toLocaleString()}`,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        items: formData.items.length,
        deliveryDate: formData.deliveryDate,
        paymentTerms: formData.paymentTerms,
      };

      // Add to purchase orders list
      setPurchaseOrders(prev => [newPurchaseOrder, ...prev]);

      // Reset form
      setFormData({
        vendor: '',
        vendorId: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
        deliveryDate: '',
        paymentTerms: 'NET 30',
        specialInstructions: '',
        deliveryAddress: '',
      });
      setSelectedVendor('');
      setShowCreateForm(false);

      alert('Purchase Order created successfully!');

    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Error creating purchase order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: PurchaseOrder['status']) => {
    setPurchaseOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    alert(`Purchase Order ${orderId} status updated to ${newStatus}`);
  };

  const totalPending = purchaseOrders.filter(po => po.status === 'pending').length;
  const totalConfirmed = purchaseOrders.filter(po => po.status === 'confirmed').length;
  const totalShipped = purchaseOrders.filter(po => po.status === 'shipped').length;
  const totalDelivered = purchaseOrders.filter(po => po.status === 'delivered').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Purchase Orders</h1>
            <p className="text-black">Manage and track purchase orders</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#2D5016] hover:bg-[#1F3509]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Create Purchase Order Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Create Purchase Order</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Vendor Selection */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Vendor *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between"
                    >
                      <span className={selectedVendor ? 'text-black' : 'text-black'}>
                        {selectedVendor || 'Select a vendor'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    {showVendorDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                        {mockVendors.map((vendor) => (
                          <button
                            key={vendor.id}
                            type="button"
                            onClick={() => handleVendorSelect(vendor)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 block"
                          >
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-sm text-black">{vendor.category}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-black">
                      Items *
                    </label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-5">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Unit Price"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={`₦${item.total.toLocaleString()}`}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="col-span-1">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-right">
                    <div className="text-lg font-semibold">
                      Total: ₦{formData.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Delivery and Terms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Delivery Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Payment Terms
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="NET 15">NET 15</option>
                      <option value="NET 30">NET 30</option>
                      <option value="NET 45">NET 45</option>
                      <option value="COD">Cash on Delivery</option>
                      <option value="Prepaid">Prepaid</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter delivery address..."
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Any special handling or delivery instructions..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#2D5016] hover:bg-[#1F3509]"
                  >
                    {loading ? 'Creating...' : 'Create Purchase Order'}
                  </Button>
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
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Pending</p>
                  <p className="text-2xl font-bold text-black">{totalPending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Confirmed</p>
                  <p className="text-2xl font-bold text-black">{totalConfirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Shipped</p>
                  <p className="text-2xl font-bold text-black">{totalShipped}</p>
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
                  <p className="text-sm font-medium text-black">Delivered</p>
                  <p className="text-2xl font-bold text-black">{totalDelivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-left p-2">Vendor</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date Created</th>
                    <th className="text-left p-2">Delivery Date</th>
                    <th className="text-left p-2">Items</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{order.id}</td>
                      <td className="p-2">{order.vendor}</td>
                      <td className="p-2 font-medium">{order.amount}</td>
                      <td className="p-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="p-2">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                      <td className="p-2">{order.items}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                              className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded"
                            >
                              Confirm
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'shipped')}
                              className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 border border-purple-300 rounded"
                            >
                              Ship
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-300 rounded"
                            >
                              Deliver
                            </button>
                          )}
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