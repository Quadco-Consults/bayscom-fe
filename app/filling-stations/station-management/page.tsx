'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, MapPin, Phone, Mail, Fuel, Droplet, Edit, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FillingStation {
  id: string
  stationCode: string
  stationName: string
  address: string
  city: string
  state: string
  managerName: string
  contactPhone: string
  contactEmail: string
  numberOfTanks: number
  numberOfPumps: number
  productsAvailable: ('PMS' | 'AGO' | 'DPK' | 'LPG')[]
  status: 'active' | 'inactive'
  createdAt: string
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

const PRODUCTS = [
  { id: 'PMS', name: 'PMS (Petrol)' },
  { id: 'AGO', name: 'AGO (Diesel)' },
  { id: 'DPK', name: 'DPK (Kerosene)' },
  { id: 'LPG', name: 'LPG (Gas)' }
]

export default function StationManagementPage() {
  const [stations, setStations] = useState<FillingStation[]>([])
  const [filteredStations, setFilteredStations] = useState<FillingStation[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStation, setSelectedStation] = useState<FillingStation | null>(null)

  const [formData, setFormData] = useState({
    stationCode: '',
    stationName: '',
    address: '',
    city: '',
    state: '',
    managerName: '',
    contactPhone: '',
    contactEmail: '',
    numberOfTanks: '',
    numberOfPumps: '',
    productsAvailable: [] as string[],
    status: 'active' as 'active' | 'inactive'
  })

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('fillingStations')
    if (savedData) {
      setStations(JSON.parse(savedData))
    } else {
      // Sample initial data
      const sampleData: FillingStation[] = [
        {
          id: '1',
          stationCode: 'JABI',
          stationName: 'JABI Station',
          address: 'Plot 123, Jabi District',
          city: 'Abuja',
          state: 'FCT',
          managerName: 'John Adeyemi',
          contactPhone: '08012345678',
          contactEmail: 'jabi@bayscom.com',
          numberOfTanks: 4,
          numberOfPumps: 8,
          productsAvailable: ['PMS', 'AGO', 'DPK'],
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          stationCode: 'WUSE2',
          stationName: 'WUSE 2 Station',
          address: 'Adetokunbo Ademola Crescent, Wuse 2',
          city: 'Abuja',
          state: 'FCT',
          managerName: 'Mary Okafor',
          contactPhone: '08023456789',
          contactEmail: 'wuse2@bayscom.com',
          numberOfTanks: 3,
          numberOfPumps: 6,
          productsAvailable: ['PMS', 'AGO'],
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          stationCode: 'WUYE',
          stationName: 'WUYE Station',
          address: 'Cadastral Zone, Wuye District',
          city: 'Abuja',
          state: 'FCT',
          managerName: 'Peter Obi',
          contactPhone: '08034567890',
          contactEmail: 'wuye@bayscom.com',
          numberOfTanks: 3,
          numberOfPumps: 6,
          productsAvailable: ['PMS', 'AGO', 'DPK'],
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          stationCode: 'GARKI',
          stationName: 'GARKI Station',
          address: 'Tafawa Balewa Way, Garki',
          city: 'Abuja',
          state: 'FCT',
          managerName: 'Ahmed Bello',
          contactPhone: '08045678901',
          contactEmail: 'garki@bayscom.com',
          numberOfTanks: 2,
          numberOfPumps: 4,
          productsAvailable: ['LPG'],
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ]
      setStations(sampleData)
      localStorage.setItem('fillingStations', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage whenever stations change
  useEffect(() => {
    if (stations.length > 0) {
      localStorage.setItem('fillingStations', JSON.stringify(stations))
    }
  }, [stations])

  // Filter stations based on search
  useEffect(() => {
    const filtered = stations.filter(station =>
      station.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.stationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.managerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStations(filtered)
  }, [searchTerm, stations])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.stationCode || !formData.stationName || !formData.address ||
        !formData.city || !formData.state || !formData.managerName) {
      alert('Please fill in all required fields!')
      return
    }

    // Check for duplicate station code
    const codeExists = stations.find(s =>
      s.stationCode.toLowerCase() === formData.stationCode.toLowerCase() &&
      s.id !== selectedStation?.id
    )

    if (codeExists) {
      alert(`Station code "${formData.stationCode}" already exists!\n\nPlease use a unique station code.`)
      return
    }

    if (formData.productsAvailable.length === 0) {
      alert('Please select at least one product type!')
      return
    }

    const newStation: FillingStation = {
      id: selectedStation?.id || Date.now().toString(),
      stationCode: formData.stationCode.toUpperCase(),
      stationName: formData.stationName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      managerName: formData.managerName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      numberOfTanks: parseInt(formData.numberOfTanks) || 0,
      numberOfPumps: parseInt(formData.numberOfPumps) || 0,
      productsAvailable: formData.productsAvailable as any,
      status: formData.status,
      createdAt: selectedStation?.createdAt || new Date().toISOString()
    }

    if (selectedStation) {
      setStations(stations.map(s => s.id === selectedStation.id ? newStation : s))
    } else {
      setStations([newStation, ...stations])
    }

    // Reset form
    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      stationCode: '',
      stationName: '',
      address: '',
      city: '',
      state: '',
      managerName: '',
      contactPhone: '',
      contactEmail: '',
      numberOfTanks: '',
      numberOfPumps: '',
      productsAvailable: [],
      status: 'active'
    })
    setSelectedStation(null)
  }

  const handleEdit = (station: FillingStation) => {
    setSelectedStation(station)
    setFormData({
      stationCode: station.stationCode,
      stationName: station.stationName,
      address: station.address,
      city: station.city,
      state: station.state,
      managerName: station.managerName,
      contactPhone: station.contactPhone,
      contactEmail: station.contactEmail,
      numberOfTanks: station.numberOfTanks.toString(),
      numberOfPumps: station.numberOfPumps.toString(),
      productsAvailable: station.productsAvailable,
      status: station.status
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    const station = stations.find(s => s.id === id)
    if (confirm(`Are you sure you want to delete "${station?.stationName}"?\n\nThis action cannot be undone.`)) {
      setStations(stations.filter(s => s.id !== id))
    }
  }

  const toggleProductSelection = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productsAvailable: prev.productsAvailable.includes(productId)
        ? prev.productsAvailable.filter(p => p !== productId)
        : [...prev.productsAvailable, productId]
    }))
  }

  const activeStationsCount = stations.filter(s => s.status === 'active').length
  const totalTanks = stations.reduce((sum, s) => sum + s.numberOfTanks, 0)
  const totalPumps = stations.reduce((sum, s) => sum + s.numberOfPumps, 0)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage filling stations and their information</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Station
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stations</p>
              <p className="text-2xl font-bold text-gray-900">{stations.length}</p>
            </div>
            <Fuel className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Stations</p>
              <p className="text-2xl font-bold text-green-600">{activeStationsCount}</p>
            </div>
            <Fuel className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tanks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTanks}</p>
            </div>
            <Droplet className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pumps</p>
              <p className="text-2xl font-bold text-gray-900">{totalPumps}</p>
            </div>
            <Fuel className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by station name, code, city, state, or manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No stations found
          </div>
        ) : (
          filteredStations.map((station) => (
            <Card key={station.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{station.stationName}</h3>
                  <p className="text-sm text-blue-600 font-mono">{station.stationCode}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {station.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{station.address}, {station.city}, {station.state}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{station.contactPhone}</span>
                </div>

                {station.contactEmail && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{station.contactEmail}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Manager:</span>
                  <span className="ml-2">{station.managerName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Tanks</p>
                  <p className="text-lg font-bold text-gray-900">{station.numberOfTanks}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Pumps</p>
                  <p className="text-lg font-bold text-gray-900">{station.numberOfPumps}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Products Available:</p>
                <div className="flex flex-wrap gap-1">
                  {station.productsAvailable.map(product => (
                    <span key={product} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${product === 'PMS' ? 'bg-green-100 text-green-800' :
                        product === 'AGO' ? 'bg-yellow-100 text-yellow-800' :
                        product === 'DPK' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'}`}>
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(station)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(station.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedStation ? 'Edit Station' : 'Add New Station'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Station Code *</label>
                    <Input
                      type="text"
                      value={formData.stationCode}
                      onChange={(e) => setFormData({ ...formData, stationCode: e.target.value.toUpperCase() })}
                      placeholder="e.g., JABI, WUSE2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Station Name *</label>
                    <Input
                      type="text"
                      value={formData.stationName}
                      onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                      placeholder="e.g., JABI Station"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Full station address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Abuja"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Manager Name *</label>
                    <Input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      placeholder="Station manager"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <Input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="08012345678"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="station@bayscom.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Tanks</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.numberOfTanks}
                      onChange={(e) => setFormData({ ...formData, numberOfTanks: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Pumps</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.numberOfPumps}
                      onChange={(e) => setFormData({ ...formData, numberOfPumps: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Products Available *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCTS.map(product => (
                        <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.productsAvailable.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {selectedStation ? 'Update Station' : 'Add Station'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
