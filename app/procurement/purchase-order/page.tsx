'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Package, Truck, CheckCircle, Clock, X, ChevronDown, Search } from 'lucide-react';

export default function PurchaseOrderPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // GRN Modal state
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [receivingOrder, setReceivingOrder] = useState<any>(null);
  const [grnFormData, setGRNFormData] = useState({
    receivedDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [] as any[],
  });

  // State management
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO-2024-001',
      vendor: 'ABC Supplies Ltd',
      vendorId: 'V-001',
      amount: '₦750,000',
      status: 'pending',
      date: '2024-10-25',
      items: 5,
      deliveryDate: '2024-11-05',
      title: 'Office Supplies Order',
      isConverted: false, // Direct PO
      itemDetails: [
        { name: 'Pens', quantity: '100', unit_price: '200', description: 'Blue ballpoint' },
        { name: 'Paper', quantity: '50', unit_price: '3500', description: 'A4 reams' },
      ]
    },
    {
      id: 'PO-2024-002',
      vendor: 'Tech Solutions Inc',
      vendorId: 'V-002',
      amount: '₦1,200,000',
      status: 'delivered',
      date: '2024-10-20',
      items: 8,
      deliveryDate: '2024-10-30',
      title: 'IT Equipment Purchase',
      isConverted: false,
      prId: 'PR-2024-002',
      itemDetails: [
        { name: 'Laptops', quantity: '5', unit_price: '150000', description: 'Dell Latitude' },
        { name: 'Monitors', quantity: '5', unit_price: '80000', description: '27-inch displays' },
      ]
    },
    {
      id: 'PO-2024-003',
      vendor: 'AutoParts Nigeria',
      vendorId: 'V-003',
      amount: '₦500,000',
      status: 'pending',
      date: '2024-10-18',
      items: 3,
      deliveryDate: '2024-11-02',
      title: 'Vehicle Parts',
      isConverted: true,
      prId: 'PR-2024-003',
      itemDetails: [
        { name: 'Brake Pads', quantity: '10', unit_price: '15000', description: 'Heavy duty' },
        { name: 'Oil Filters', quantity: '20', unit_price: '5000', description: 'Premium filters' },
        { name: 'Spark Plugs', quantity: '30', unit_price: '3000', description: 'Standard' },
      ]
    },
    {
      id: 'PO-2024-004',
      vendor: 'Industrial Tools Co',
      vendorId: 'V-004',
      amount: '₦950,000',
      status: 'pending',
      date: '2024-10-23',
      items: 4,
      deliveryDate: '2024-11-08',
      title: 'Workshop Equipment',
      isConverted: false,
      itemDetails: [
        { name: 'Power Drill', quantity: '3', unit_price: '45000', description: 'Heavy duty drill' },
        { name: 'Tool Set', quantity: '5', unit_price: '120000', description: 'Complete tool kit' },
      ]
    },
  ]);

  // Approved PRs that need conversion (demo data)
  const [approvedPRs, setApprovedPRs] = useState([
    {
      id: 'PR-2024-004',
      title: 'Cleaning Supplies',
      department: 'Administration',
      amount: '₦125,000',
      date: '2024-10-28',
      items: 4,
      status: 'approved',
      itemDetails: [
        { name: 'Mops', quantity: '10', unit_price: '2500', description: 'Industrial mops' },
        { name: 'Detergent', quantity: '20', unit_price: '3500', description: 'Heavy duty' },
        { name: 'Buckets', quantity: '15', unit_price: '1500', description: 'Plastic buckets' },
        { name: 'Brooms', quantity: '12', unit_price: '1800', description: 'Heavy duty brooms' },
      ]
    },
    {
      id: 'PR-2024-005',
      title: 'Safety Equipment',
      department: 'Operations',
      amount: '₦350,000',
      date: '2024-10-26',
      items: 3,
      status: 'approved',
      itemDetails: [
        { name: 'Hard Hats', quantity: '25', unit_price: '5000', description: 'Safety helmets' },
        { name: 'Safety Vests', quantity: '30', unit_price: '3000', description: 'Reflective vests' },
        { name: 'Gloves', quantity: '50', unit_price: '2500', description: 'Work gloves' },
      ]
    }
  ]);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Vendor selection
  const [selectedVendor, setSelectedVendor] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  // Conversion modal state
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [convertingPR, setConvertingPR] = useState(null);
  const [conversionData, setConversionData] = useState({
    vendorId: '',
    deliveryDate: ''
  });

  // Edit PR modal state
  const [showEditPRModal, setShowEditPRModal] = useState(false);
  const [editingPR, setEditingPR] = useState(null);
  const [prFormData, setPRFormData] = useState({
    items: [{ name: '', quantity: '', unit_price: '', description: '' }]
  });

  const vendors = [
    { id: 'V-001', name: 'ABC Supplies Ltd', category: 'Office Supplies', rating: 4.5 },
    { id: 'V-002', name: 'Tech Solutions Inc', category: 'IT Equipment', rating: 4.8 },
    { id: 'V-003', name: 'AutoParts Nigeria', category: 'Vehicle Parts', rating: 4.2 },
    { id: 'V-004', name: 'Industrial Tools Co', category: 'Industrial Equipment', rating: 3.9 },
  ];

  const [formData, setFormData] = useState({
    title: '',
    vendorId: '',
    deliveryDate: '',
    notes: '',
    items: [{ name: '', quantity: '', unit_price: '', description: '' }]
  });

  // Check for approved PRs and converted PO on mount
  useEffect(() => {
    // Load approved PRs from localStorage
    const storedPRs = localStorage.getItem('approvedPRs');
    if (storedPRs) {
      try {
        const parsedPRs = JSON.parse(storedPRs);
        setApprovedPRs(parsedPRs);
      } catch (error) {
        console.error('Failed to parse approved PRs:', error);
      }
    }

    const convertedData = localStorage.getItem('convertedPO');
    if (convertedData) {
      const data = JSON.parse(convertedData);

      // Create new PO from converted PR
      const newPO = {
        id: `PO-2024-${String(purchaseOrders.length + 4).padStart(3, '0')}`,
        vendor: data.vendor.name,
        vendorId: data.vendor.id,
        amount: data.amount,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        items: data.items?.length || 0,
        deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
        title: data.title,
        prId: data.prId,
        isConverted: true,
        itemDetails: data.items || []
      };

      setPurchaseOrders(prev => [newPO, ...prev]);
      localStorage.removeItem('convertedPO');

      alert(`Purchase Order ${newPO.id} created successfully from PR ${data.prId}!`);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle vendor selection
  const handleVendorSelect = (vendor: any) => {
    setSelectedVendor(vendor.name);
    setFormData(prev => ({
      ...prev,
      vendorId: vendor.id
    }));
    setShowVendorDropdown(false);
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

    // Validate delivery date is in the future
    const deliveryDate = new Date(formData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    if (deliveryDate < today) {
      alert('Delivery date must be in the future. Please select a valid date.');
      return;
    }

    setLoading(true);

    try {
      const totalAmount = calculateTotal();
      const vendor = vendors.find(v => v.id === formData.vendorId);

      if (editingOrder) {
        // Update existing order
        const updatedOrder = {
          ...editingOrder,
          title: formData.title,
          vendor: vendor?.name || '',
          vendorId: formData.vendorId,
          amount: `₦${totalAmount.toLocaleString()}`,
          deliveryDate: formData.deliveryDate,
          items: formData.items.length,
          itemDetails: formData.items,
        };

        setPurchaseOrders(prev =>
          prev.map(po => po.id === editingOrder.id ? updatedOrder : po)
        );

        alert('Purchase Order updated successfully!');
      } else {
        // Create new order
        const newOrder = {
          id: `PO-2024-${String(purchaseOrders.length + 4).padStart(3, '0')}`,
          title: formData.title,
          vendor: vendor?.name || '',
          vendorId: formData.vendorId,
          amount: `₦${totalAmount.toLocaleString()}`,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          items: formData.items.length,
          deliveryDate: formData.deliveryDate,
          itemDetails: formData.items,
        };

        setPurchaseOrders(prev => [newOrder, ...prev]);

        alert('Purchase Order created successfully!');
      }

      // Reset form and close dialog
      setFormData({
        title: '',
        vendorId: '',
        deliveryDate: '',
        notes: '',
        items: [{ name: '', quantity: '', unit_price: '', description: '' }]
      });
      setSelectedVendor('');
      setEditingOrder(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to save purchase order:', error);
      alert('Failed to save purchase order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing PO details
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Handle editing PO
  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    const vendor = vendors.find(v => v.id === order.vendorId);
    setSelectedVendor(vendor?.name || '');
    setFormData({
      title: order.title,
      vendorId: order.vendorId,
      deliveryDate: order.deliveryDate,
      notes: '',
      items: order.itemDetails?.length > 0 ? order.itemDetails : [{ name: '', quantity: '', unit_price: '', description: '' }]
    });
    setShowCreateForm(true);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle opening conversion modal
  const handleOpenConversion = (pr: any) => {
    setConvertingPR(pr);
    setShowConversionModal(true);
  };

  // Handle editing awaiting PR
  const handleEditAwaitingPR = (pr: any) => {
    setEditingPR(pr);
    setPRFormData({
      items: pr.itemDetails || [{ name: '', quantity: '', unit_price: '', description: '' }]
    });
    setShowEditPRModal(true);
  };

  // Handle PR item changes
  const handlePRItemChange = (index: number, field: string, value: string) => {
    const newItems = [...prFormData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setPRFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  // Add PR item
  const addPRItem = () => {
    setPRFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', unit_price: '', description: '' }]
    }));
  };

  // Remove PR item
  const removePRItem = (index: number) => {
    if (prFormData.items.length > 1) {
      const newItems = prFormData.items.filter((_, i) => i !== index);
      setPRFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  // Calculate PR total
  const calculatePRTotal = () => {
    return prFormData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  };

  // Save PR edits
  const handleSavePREdits = () => {
    const totalAmount = calculatePRTotal();

    const updatedPR = {
      ...editingPR,
      items: prFormData.items.length,
      amount: `₦${totalAmount.toLocaleString()}`,
      itemDetails: prFormData.items
    };

    // Update in state
    setApprovedPRs(prev =>
      prev.map(pr => pr.id === editingPR.id ? updatedPR : pr)
    );

    // Update in localStorage
    const existingPRs = localStorage.getItem('approvedPRs');
    if (existingPRs) {
      try {
        const prsList = JSON.parse(existingPRs);
        const updatedList = prsList.map((pr: any) =>
          pr.id === editingPR.id ? updatedPR : pr
        );
        localStorage.setItem('approvedPRs', JSON.stringify(updatedList));
      } catch (error) {
        console.error('Failed to update localStorage:', error);
      }
    }

    setShowEditPRModal(false);
    setEditingPR(null);
    alert('Purchase Request updated successfully!');
  };

  // Handle PR conversion to PO
  const handleConvertPRtoPO = () => {
    if (!conversionData.vendorId || !conversionData.deliveryDate) {
      alert('Please select vendor and delivery date');
      return;
    }

    // Validate delivery date is in the future
    const deliveryDate = new Date(conversionData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    if (deliveryDate < today) {
      alert('Delivery date must be in the future. Please select a valid date.');
      return;
    }

    const vendor = vendors.find(v => v.id === conversionData.vendorId);

    // Create PO from PR
    const newPO = {
      id: `PO-2024-${String(purchaseOrders.length + approvedPRs.length + 4).padStart(3, '0')}`,
      vendor: vendor?.name || '',
      vendorId: conversionData.vendorId,
      amount: convertingPR.amount,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      items: convertingPR.items,
      deliveryDate: conversionData.deliveryDate,
      title: convertingPR.title,
      prId: convertingPR.id,
      isConverted: true,
      itemDetails: convertingPR.itemDetails || []
    };

    setPurchaseOrders(prev => [newPO, ...prev]);

    // Remove from approved PRs
    const updatedPRs = approvedPRs.filter(pr => pr.id !== convertingPR.id);
    setApprovedPRs(updatedPRs);
    localStorage.setItem('approvedPRs', JSON.stringify(updatedPRs));

    // Reset and close
    setShowConversionModal(false);
    setConvertingPR(null);
    setConversionData({ vendorId: '', deliveryDate: '' });

    alert(`Purchase Order ${newPO.id} created from ${convertingPR.id}!`);
  };

  // Handle item received (open GRN modal)
  const handleItemReceived = (order: any) => {
    setReceivingOrder(order);

    // Initialize GRN form with order items
    const items = order.itemDetails.map((item: any) => ({
      name: item.name,
      description: item.description,
      orderedQuantity: parseInt(item.quantity),
      receivedQuantity: parseInt(item.quantity), // Default to ordered quantity
    }));

    setGRNFormData({
      receivedDate: new Date().toISOString().split('T')[0],
      notes: '',
      items: items,
    });

    setShowGRNModal(true);
  };

  // Handle GRN form submission
  const handleGRNSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate overall status
    let hasShortfall = false;
    let hasExcess = false;
    let allComplete = true;

    grnFormData.items.forEach(item => {
      const difference = item.receivedQuantity - item.orderedQuantity;
      if (difference < 0) {
        hasShortfall = true;
        allComplete = false;
      } else if (difference > 0) {
        hasExcess = true;
      }
    });

    const overallStatus = hasShortfall ? 'partial' : hasExcess ? 'excess' : 'complete';

    // Create GRN object
    const grn = {
      id: `GRN-${Date.now()}`,
      poId: receivingOrder.id,
      vendor: receivingOrder.vendor,
      vendorId: receivingOrder.vendorId,
      receivedDate: grnFormData.receivedDate,
      notes: grnFormData.notes,
      items: grnFormData.items,
      status: overallStatus,
      createdAt: new Date().toISOString(),
    };

    // Save GRN to localStorage
    const existingGRNs = localStorage.getItem('goodsReceivedNotes');
    let grnList = [];

    if (existingGRNs) {
      try {
        grnList = JSON.parse(existingGRNs);
      } catch (error) {
        console.error('Failed to parse GRNs:', error);
      }
    }

    grnList.push(grn);
    localStorage.setItem('goodsReceivedNotes', JSON.stringify(grnList));

    // Mark PO as delivered
    setPurchaseOrders(prev =>
      prev.map(po =>
        po.id === receivingOrder.id
          ? { ...po, status: 'delivered' }
          : po
      )
    );

    setShowGRNModal(false);
    setReceivingOrder(null);
    alert(`Goods Received Note ${grn.id} created successfully!`);
  };

  // Handle received quantity change
  const handleReceivedQuantityChange = (index: number, value: string) => {
    const newItems = [...grnFormData.items];
    newItems[index] = {
      ...newItems[index],
      receivedQuantity: parseInt(value) || 0
    };
    setGRNFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  // Handle status updates (kept for backward compatibility)
  const handleMarkAsShipped = (order: any) => {
    const confirmation = confirm(`Mark order ${order.id} as shipped?`);
    if (confirmation) {
      setPurchaseOrders(prev =>
        prev.map(po =>
          po.id === order.id
            ? { ...po, status: 'shipped' }
            : po
        )
      );
      alert(`Order ${order.id} marked as shipped!`);
    }
  };

  const handleMarkAsDelivered = (order: any) => {
    const confirmation = confirm(`Mark order ${order.id} as delivered?`);
    if (confirmation) {
      setPurchaseOrders(prev =>
        prev.map(po =>
          po.id === order.id
            ? { ...po, status: 'delivered' }
            : po
        )
      );
      alert(`Order ${order.id} marked as delivered!`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awaiting':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'awaiting':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'shipped':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Combine approved PRs and POs for display
  const combinedItems = [
    ...approvedPRs.map(pr => ({ ...pr, type: 'PR', status: 'awaiting' })),
    ...purchaseOrders.map(po => ({ ...po, type: 'PO' }))
  ];

  // Filter based on search query
  const filteredItems = combinedItems.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.title?.toLowerCase().includes(query) ||
      item.vendor?.toLowerCase().includes(query) ||
      (item.department?.toLowerCase().includes(query)) ||
      item.status?.toLowerCase().includes(query) ||
      item.amount.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
              <p className="text-gray-600">Track and manage purchase orders</p>
            </div>
            <button
              className="bg-[#2D5016] hover:bg-[#1F3509] text-white px-4 py-2 rounded-md inline-flex items-center text-sm font-medium"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search purchase orders..."
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

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingOrder ? 'Edit Purchase Order' : 'Create New Purchase Order'}
                </h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingOrder(null);
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
                      Order Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter order title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                      >
                        {selectedVendor || 'Select vendor'}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {showVendorDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                          {vendors.map((vendor) => (
                            <button
                              key={vendor.id}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                              onClick={() => handleVendorSelect(vendor)}
                            >
                              <div>
                                <p className="font-medium">{vendor.name}</p>
                                <p className="text-xs text-gray-600">{vendor.category} • {vendor.rating}/5</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes or special instructions"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Items Section */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
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

                  {/* Add Item Button */}
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
                      setEditingOrder(null);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded disabled:opacity-50"
                    disabled={loading || !formData.title || !formData.vendorId || !formData.deliveryDate}
                  >
                    {loading ? (editingOrder ? 'Updating...' : 'Creating...') : (editingOrder ? 'Update Purchase Order' : 'Create Purchase Order')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Purchase Order Details</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowViewModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Order ID</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <p className="text-sm text-gray-900">{selectedOrder.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Vendor</label>
                        <p className="text-sm text-gray-900">{selectedOrder.vendor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Order Date</label>
                        <p className="text-sm text-gray-900">{selectedOrder.date}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Expected Delivery</label>
                        <p className="text-sm text-gray-900">{selectedOrder.deliveryDate}</p>
                      </div>
                      {selectedOrder.prId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Converted from PR</label>
                          <p className="text-sm text-gray-900 font-medium">{selectedOrder.prId}</p>
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
                          {getStatusIcon(selectedOrder.status)}
                          <span className={getStatusBadge(selectedOrder.status)}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Total Amount</label>
                        <p className="text-lg font-bold text-[#2D5016]">{selectedOrder.amount}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Number of Items</label>
                        <p className="text-sm text-gray-900">{selectedOrder.items} items</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
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
                        {selectedOrder.itemDetails && selectedOrder.itemDetails.length > 0 ? (
                          selectedOrder.itemDetails.map((item: any, index: number) => {
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
                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                  {selectedOrder.status === 'pending' && (
                    <button
                      className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                      onClick={() => {
                        handleItemReceived(selectedOrder);
                        setSelectedOrder({ ...selectedOrder, status: 'delivered' });
                      }}
                    >
                      Item Received
                    </button>
                  )}
                  <button
                    className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit PR Modal */}
        {showEditPRModal && editingPR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Purchase Request - {editingPR.id}</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditPRModal(false);
                    setEditingPR(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-bold">{editingPR.title}</span> - {editingPR.department}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">You can adjust quantities or remove items before converting to PO</p>
                </div>

                {/* Items Section */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Request Items</h3>
                  </div>

                  <div className="space-y-4">
                    {prFormData.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                          {prFormData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePRItem(index)}
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
                              onChange={(e) => handlePRItemChange(index, 'name', e.target.value)}
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
                              onChange={(e) => handlePRItemChange(index, 'quantity', e.target.value)}
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
                              onChange={(e) => handlePRItemChange(index, 'unit_price', e.target.value)}
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
                            onChange={(e) => handlePRItemChange(index, 'description', e.target.value)}
                            placeholder="Item description or specifications"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Item Button */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addPRItem}
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
                        ₦{calculatePRTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex space-x-2">
                <button
                  className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowEditPRModal(false);
                    setEditingPR(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  onClick={handleSavePREdits}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PR Conversion Modal */}
        {showConversionModal && convertingPR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Convert to Purchase Order</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowConversionModal(false);
                    setConvertingPR(null);
                    setConversionData({ vendorId: '', deliveryDate: '' });
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Converting <span className="font-bold">{convertingPR.id}</span> - {convertingPR.title}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Amount: {convertingPR.amount} | Items: {convertingPR.items}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vendor *
                  </label>
                  <select
                    value={conversionData.vendorId}
                    onChange={(e) => setConversionData(prev => ({ ...prev, vendorId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] text-sm"
                    required
                  >
                    <option value="">Choose vendor...</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} - {vendor.category} ({vendor.rating}/5)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date *
                  </label>
                  <Input
                    type="date"
                    value={conversionData.deliveryDate}
                    onChange={(e) => setConversionData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="p-6 border-t flex space-x-2">
                <button
                  className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowConversionModal(false);
                    setConvertingPR(null);
                    setConversionData({ vendorId: '', deliveryDate: '' });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded disabled:opacity-50"
                  onClick={handleConvertPRtoPO}
                  disabled={!conversionData.vendorId || !conversionData.deliveryDate}
                >
                  Convert to PO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Awaiting</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedPRs.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{purchaseOrders.filter(po => po.status === 'pending').length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{purchaseOrders.filter(po => po.status === 'delivered').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length + approvedPRs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Order Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Delivery Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(item.status)}
                            <span className="ml-2 font-medium text-gray-900">{item.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{item.title}</td>
                        <td className="py-3 px-4 text-gray-900">
                          {item.type === 'PR' ? (
                            <span className="text-gray-500 italic">Not assigned</span>
                          ) : (
                            item.vendor
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.amount}</td>
                        <td className="py-3 px-4 text-gray-600">{item.items} items</td>
                        <td className="py-3 px-4 text-gray-600">{item.date}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {item.type === 'PR' ? (
                            <span className="text-gray-500 italic">TBD</span>
                          ) : (
                            item.deliveryDate
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getStatusBadge(item.status)}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            <button
                              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                              onClick={() => item.type === 'PR' ? null : handleViewOrder(item)}
                            >
                              View
                            </button>
                            {item.type === 'PR' && item.status === 'awaiting' && (
                              <>
                                <button
                                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                                  onClick={() => handleEditAwaitingPR(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="px-2 py-1 text-xs bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                                  onClick={() => handleOpenConversion(item)}
                                >
                                  Convert to PO
                                </button>
                              </>
                            )}
                            {item.type === 'PO' && item.status === 'pending' && (
                              <>
                                {!item.isConverted && (
                                  <button
                                    className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                                    onClick={() => handleEditOrder(item)}
                                  >
                                    Edit
                                  </button>
                                )}
                                <button
                                  className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                                  onClick={() => handleItemReceived(item)}
                                >
                                  Item Received
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 px-4 text-center text-gray-500">
                        {searchQuery ? `No items found matching "${searchQuery}"` : 'No purchase orders or approved requests found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Goods Received Note Modal */}
        {showGRNModal && receivingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Goods Received Note</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowGRNModal(false);
                    setReceivingOrder(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleGRNSubmit} className="p-6 space-y-6">
                {/* Order Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Receiving Items for:</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">PO ID:</span>
                      <span className="ml-2 font-semibold text-blue-900">{receivingOrder.id}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Vendor:</span>
                      <span className="ml-2 font-semibold text-blue-900">{receivingOrder.vendor}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Order Date:</span>
                      <span className="ml-2 font-semibold text-blue-900">{receivingOrder.date}</span>
                    </div>
                  </div>
                </div>

                {/* GRN Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Received Date *
                    </label>
                    <Input
                      type="date"
                      value={grnFormData.receivedDate}
                      onChange={(e) => setGRNFormData(prev => ({ ...prev, receivedDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Items Received */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Items to Receive</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the actual quantity received for each item. The system will automatically calculate shortfalls or excess.
                  </p>

                  <div className="border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Ordered</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Received *</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Batch/Lot No</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Expiry Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grnFormData.items.map((item, index) => {
                          const difference = item.receivedQuantity - item.orderedQuantity;

                          return (
                            <tr key={index} className="border-t border-gray-100">
                              <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                              <td className="py-3 px-4 text-gray-600">{item.description || '-'}</td>
                              <td className="py-3 px-4 font-medium">{item.orderedQuantity}</td>
                              <td className="py-3 px-4">
                                <Input
                                  type="number"
                                  min="0"
                                  value={item.receivedQuantity}
                                  onChange={(e) => handleReceivedQuantityChange(index, e.target.value)}
                                  className="w-24"
                                  required
                                />
                              </td>
                              <td className="py-3 px-4">
                                <Input
                                  type="text"
                                  value={(item as any).batchNumber || ''}
                                  onChange={(e) => {
                                    const newItems = [...grnFormData.items];
                                    newItems[index] = { ...newItems[index], batchNumber: e.target.value } as any;
                                    setGRNFormData(prev => ({ ...prev, items: newItems }));
                                  }}
                                  placeholder="Batch/Lot"
                                  className="w-32"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <Input
                                  type="date"
                                  value={(item as any).expiryDate || ''}
                                  onChange={(e) => {
                                    const newItems = [...grnFormData.items];
                                    newItems[index] = { ...newItems[index], expiryDate: e.target.value } as any;
                                    setGRNFormData(prev => ({ ...prev, items: newItems }));
                                  }}
                                  className="w-36"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-medium ${
                                  difference === 0 ? 'text-gray-600' :
                                  difference < 0 ? 'text-red-600' :
                                  'text-blue-600'
                                }`}>
                                  {difference > 0 ? '+' : ''}{difference}
                                  {difference !== 0 && (
                                    <span className="text-xs ml-1">
                                      ({difference < 0 ? 'Shortfall' : 'Excess'})
                                    </span>
                                  )}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={grnFormData.notes}
                    onChange={(e) => setGRNFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about the delivery (damages, quality issues, etc.)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Items:</span>
                      <span className="ml-2 font-semibold">{grnFormData.items.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Items with Shortfall:</span>
                      <span className="ml-2 font-semibold text-red-600">
                        {grnFormData.items.filter(i => i.receivedQuantity < i.orderedQuantity).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Items with Excess:</span>
                      <span className="ml-2 font-semibold text-blue-600">
                        {grnFormData.items.filter(i => i.receivedQuantity > i.orderedQuantity).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowGRNModal(false);
                      setReceivingOrder(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded"
                  >
                    Confirm Receipt & Create GRN
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
