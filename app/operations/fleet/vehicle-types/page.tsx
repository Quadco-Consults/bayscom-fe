'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, X } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VehicleTypesPage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  const loadVehicleTypes = () => {
    const stored = localStorage.getItem('fleet_vehicle_types');
    if (stored) {
      setVehicleTypes(JSON.parse(stored));
    } else {
      // Default vehicle types
      const defaultTypes: VehicleType[] = [
        {
          id: '1',
          name: 'Tanker',
          description: 'Large capacity fuel tanker for bulk transportation',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Delivery Truck',
          description: 'Medium capacity truck for product delivery',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setVehicleTypes(defaultTypes);
      localStorage.setItem('fleet_vehicle_types', JSON.stringify(defaultTypes));
    }
  };

  const saveVehicleTypes = (types: VehicleType[]) => {
    setVehicleTypes(types);
    localStorage.setItem('fleet_vehicle_types', JSON.stringify(types));
  };

  const handleAdd = () => {
    setEditingTypeId(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (type: VehicleType) => {
    setEditingTypeId(type.id);
    setFormData({
      name: type.name,
      description: type.description,
      isActive: type.isActive,
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();

    if (editingTypeId) {
      // Edit existing type
      const updatedTypes = vehicleTypes.map(type =>
        type.id === editingTypeId
          ? {
              ...type,
              name: formData.name,
              description: formData.description,
              isActive: formData.isActive,
              updatedAt: now,
            }
          : type
      );
      saveVehicleTypes(updatedTypes);
    } else {
      // Add new type
      const newType: VehicleType = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        createdAt: now,
        updatedAt: now,
      };
      saveVehicleTypes([...vehicleTypes, newType]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle type? This action cannot be undone.')) {
      saveVehicleTypes(vehicleTypes.filter(type => type.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    const updatedTypes = vehicleTypes.map(type =>
      type.id === id
        ? { ...type, isActive: !type.isActive, updatedAt: new Date().toISOString() }
        : type
    );
    saveVehicleTypes(updatedTypes);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-600" />
              Vehicle Types
            </h1>
            <p className="text-gray-600 mt-1">Manage vehicle type categories for your fleet</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Vehicle Type
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Vehicle Types</p>
          <p className="text-2xl font-bold text-blue-600">{vehicleTypes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active Types</p>
          <p className="text-2xl font-bold text-green-600">
            {vehicleTypes.filter(t => t.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Inactive Types</p>
          <p className="text-2xl font-bold text-gray-600">
            {vehicleTypes.filter(t => !t.isActive).length}
          </p>
        </div>
      </div>

      {/* Vehicle Types List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {vehicleTypes.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No vehicle types found</p>
              <button
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Your First Vehicle Type
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleTypes.map((type) => (
                    <tr key={type.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900">{type.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{type.description}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(type.id)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                            type.isActive
                              ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {type.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(type.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(type)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                  {editingTypeId ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
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
                    Vehicle Type Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Tanker, Delivery Truck"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Brief description of this vehicle type..."
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
                    {editingTypeId ? 'Update' : 'Add'} Vehicle Type
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
