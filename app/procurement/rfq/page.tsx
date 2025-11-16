'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  X,
  ChevronDown,
  Eye,
  Send,
  Edit,
  Trash2
} from 'lucide-react';

interface RFQItem {
  id: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  specifications?: string;
}

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  department: string;
  status: 'draft' | 'sent' | 'responded' | 'closed';
  dateCreated: string;
  closingDate: string;
  vendorCount: number;
  responseCount: number;
  items: RFQItem[];
  description: string;
}

export default function RFQPage() {
  // State management
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-2024-001',
      rfqNumber: 'RFQ-2024-001',
      title: 'Office Equipment Procurement',
      department: 'Administration',
      status: 'sent',
      dateCreated: '2024-11-10',
      closingDate: '2024-11-20',
      vendorCount: 5,
      responseCount: 3,
      items: [
        { id: '1', name: 'Office Chairs', description: 'Ergonomic office chairs', quantity: '20', unit: 'pieces' },
        { id: '2', name: 'Desk Computers', description: 'Desktop computers', quantity: '10', unit: 'pieces' },
      ],
      description: 'Request for quotation for office equipment procurement'
    },
    {
      id: 'RFQ-2024-002',
      rfqNumber: 'RFQ-2024-002',
      title: 'Vehicle Spare Parts',
      department: 'Operations',
      status: 'responded',
      dateCreated: '2024-11-05',
      closingDate: '2024-11-15',
      vendorCount: 8,
      responseCount: 6,
      items: [
        { id: '1', name: 'Brake Pads', description: 'Heavy duty brake pads', quantity: '50', unit: 'sets' },
        { id: '2', name: 'Engine Oil', description: 'Synthetic engine oil', quantity: '100', unit: 'liters' },
      ],
      description: 'RFQ for vehicle maintenance spare parts'
    },
    {
      id: 'RFQ-2024-003',
      rfqNumber: 'RFQ-2024-003',
      title: 'IT Infrastructure',
      department: 'IT',
      status: 'draft',
      dateCreated: '2024-11-12',
      closingDate: '2024-11-25',
      vendorCount: 0,
      responseCount: 0,
      items: [
        { id: '1', name: 'Network Switches', description: '24-port managed switches', quantity: '5', unit: 'pieces' },
      ],
      description: 'RFQ for network infrastructure upgrade'
    },
  ]);

  // Form state for new RFQ
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Operations' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Human Resources' }
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    closingDate: '',
    items: [{ id: '1', name: '', description: '', quantity: '', unit: '', specifications: '' }]
  });

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
    const newItem = {
      id: (formData.items.length + 1).toString(),
      name: '',
      description: '',
      quantity: '',
      unit: '',
      specifications: ''
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call - replace with actual API
    setTimeout(() => {
      const newRfq: RFQ = {
        id: `RFQ-2024-${String(rfqs.length + 1).padStart(3, '0')}`,
        rfqNumber: `RFQ-2024-${String(rfqs.length + 1).padStart(3, '0')}`,
        title: formData.title,
        department: departments.find(d => d.id.toString() === formData.department)?.name || 'Unknown',
        status: 'draft',
        dateCreated: new Date().toISOString().split('T')[0],
        closingDate: formData.closingDate,
        vendorCount: 0,
        responseCount: 0,
        items: formData.items.filter(item => item.name.trim() !== ''),
        description: formData.description
      };

      setRfqs(prev => [newRfq, ...prev]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        department: '',
        closingDate: '',
        items: [{ id: '1', name: '', description: '', quantity: '', unit: '', specifications: '' }]
      });
      setSelectedDepartment('');
      setLoading(false);
    }, 1000);
  };

  // View RFQ details
  const viewRfq = (rfq: RFQ) => {
    setSelectedRfq(rfq);
    setShowViewModal(true);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      sent: { color: 'bg-blue-100 text-blue-800', label: 'Sent' },
      responded: { color: 'bg-green-100 text-green-800', label: 'Responded' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Closed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-black" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'responded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-black" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Request for Quote (RFQ)</h1>
            <p className="text-black mt-1">Manage and track RFQs sent to vendors</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#8B1538] hover:bg-[#6B0F2A]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create RFQ
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-black" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Draft RFQs
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {rfqs.filter(rfq => rfq.status === 'draft').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Send className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Sent RFQs
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {rfqs.filter(rfq => rfq.status === 'sent').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Responded
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {rfqs.filter(rfq => rfq.status === 'responded').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-black truncate">
                      Closed
                    </dt>
                    <dd className="text-lg font-medium text-black">
                      {rfqs.filter(rfq => rfq.status === 'closed').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RFQ List */}
        <Card>
          <CardHeader>
            <CardTitle>RFQ List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      RFQ Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Vendors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Closing Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(rfq.status)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black">
                              {rfq.rfqNumber}
                            </div>
                            <div className="text-sm text-black">
                              {rfq.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">{rfq.department}</div>
                        <div className="text-sm text-black">{rfq.items.length} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(rfq.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {rfq.responseCount}/{rfq.vendorCount} responded
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {rfq.closingDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewRfq(rfq)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Create RFQ Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Create New RFQ</h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      RFQ Title *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter RFQ title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      Department *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
                        onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      >
                        <span className={selectedDepartment ? 'text-black' : 'text-black'}>
                          {selectedDepartment || 'Select Department'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {showDepartmentDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                          {departments.map((dept) => (
                            <div
                              key={dept.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleDepartmentSelect(dept)}
                            >
                              {dept.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter RFQ description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Closing Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.closingDate}
                    onChange={(e) => handleInputChange('closingDate', e.target.value)}
                    required
                  />
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-black">Items</h3>
                    <Button type="button" variant="outline" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  {formData.items.map((item, index) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-black">Item {index + 1}</h4>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Item Name *
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter item name"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Unit
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g., pieces, kg, liters"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Description
                        </label>
                        <Input
                          type="text"
                          placeholder="Brief description of the item"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Estimated Quantity
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Specifications
                          </label>
                          <Input
                            type="text"
                            placeholder="Technical specifications"
                            value={item.specifications}
                            onChange={(e) => handleItemChange(index, 'specifications', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#8B1538] hover:bg-[#6B0F2A]"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create RFQ'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View RFQ Modal */}
        {showViewModal && selectedRfq && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRfq.rfqNumber}</h2>
                    <p className="text-black">{selectedRfq.title}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-black">Department</h3>
                    <p className="text-sm text-black">{selectedRfq.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black">Status</h3>
                    <div className="mt-1">{getStatusBadge(selectedRfq.status)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black">Closing Date</h3>
                    <p className="text-sm text-black">{selectedRfq.closingDate}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-black mb-2">Description</h3>
                  <p className="text-sm text-black">{selectedRfq.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-4">Items ({selectedRfq.items.length})</h3>
                  <div className="space-y-4">
                    {selectedRfq.items.map((item, index) => (
                      <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-black">{item.name}</h4>
                            <p className="text-sm text-black">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-black">
                              Qty: {item.quantity} {item.unit}
                            </p>
                            {item.specifications && (
                              <p className="text-sm text-black">{item.specifications}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <div className="text-sm text-black">
                    Created: {selectedRfq.dateCreated} |
                    Vendors: {selectedRfq.vendorCount} |
                    Responses: {selectedRfq.responseCount}
                  </div>
                  <div className="space-x-2">
                    {selectedRfq.status === 'draft' && (
                      <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                        <Send className="h-4 w-4 mr-2" />
                        Send to Vendors
                      </Button>
                    )}
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}