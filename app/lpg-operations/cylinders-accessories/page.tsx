'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Package, TrendingUp, DollarSign, Archive } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CylinderAccessory {
  id: string
  category: 'GAS CYLINDER' | 'REGULATOR' | 'BURNER' | 'CAMPING EQUIPMENT' | 'OTHER'
  itemName: string
  size: string // e.g., "12.5KG", "6KG", "5KG", "3KG"
  brand: string // e.g., "AMAZE", "SETRO", "DK FLAMEZ", "RECKA"

  // Inventory
  totalQuantity: number
  qtySold: number
  qtyLeft: number

  // Pricing
  purchasePrice: number
  vatExclPrice: number
  sellingPrice: number
  totalAmount: number

  // Financial
  salesAmount: number
  costPriceInQtySold: number
  margin: number
  marginPercentage: number

  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['GAS CYLINDER', 'REGULATOR', 'BURNER', 'CAMPING EQUIPMENT', 'OTHER']
const CYLINDER_SIZES = ['12.5KG', '6KG', '5KG', '3KG', '25KG', '50KG']
const BRANDS = ['AMAZE', 'SETRO', 'DK FLAMEZ', 'BEST CHOICE', 'RECKA', 'COMPACT', 'GENERIC']

export default function CylindersAccessoriesPage() {
  const [items, setItems] = useState<CylinderAccessory[]>([])
  const [filteredItems, setFilteredItems] = useState<CylinderAccessory[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<CylinderAccessory | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const [formData, setFormData] = useState({
    category: 'GAS CYLINDER' as 'GAS CYLINDER' | 'REGULATOR' | 'BURNER' | 'CAMPING EQUIPMENT' | 'OTHER',
    itemName: '',
    size: '',
    brand: '',
    totalQuantity: '',
    qtySold: '0',
    purchasePrice: '',
    vatExclPrice: '',
    sellingPrice: ''
  })

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lpgCylindersAccessories')
    if (savedData) {
      setItems(JSON.parse(savedData))
    } else {
      // Sample data from GARKI Excel document
      const sampleData: CylinderAccessory[] = [
        {
          id: '1',
          category: 'GAS CYLINDER',
          itemName: '12.5 KG GAS CYLINDER',
          size: '12.5KG',
          brand: 'AMAZE',
          totalQuantity: 13,
          qtySold: 0,
          qtyLeft: 13,
          purchasePrice: 32500,
          vatExclPrice: 30000,
          sellingPrice: 40000,
          totalAmount: 422500,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 23.08,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          category: 'GAS CYLINDER',
          itemName: '12.5 KG GAS CYLINDER',
          size: '12.5KG',
          brand: 'SETRO',
          totalQuantity: 22,
          qtySold: 0,
          qtyLeft: 22,
          purchasePrice: 34500,
          vatExclPrice: 32000,
          sellingPrice: 42000,
          totalAmount: 759000,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 21.74,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          category: 'GAS CYLINDER',
          itemName: '6 KG GAS CYLINDER',
          size: '6KG',
          brand: 'BEST CHOICE/SETRO',
          totalQuantity: 24,
          qtySold: 0,
          qtyLeft: 24,
          purchasePrice: 20000,
          vatExclPrice: 18000,
          sellingPrice: 27000,
          totalAmount: 480000,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 35.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          category: 'GAS CYLINDER',
          itemName: '5 KG GAS CYLINDER',
          size: '5KG',
          brand: 'SETRO',
          totalQuantity: 55,
          qtySold: 3,
          qtyLeft: 52,
          purchasePrice: 18000,
          vatExclPrice: 16500,
          sellingPrice: 25000,
          totalAmount: 990000,
          salesAmount: 75000,
          costPriceInQtySold: 54000,
          margin: 21000,
          marginPercentage: 38.89,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          category: 'GAS CYLINDER',
          itemName: '3 KG GAS CYLINDER',
          size: '3KG',
          brand: 'SETRO',
          totalQuantity: 38,
          qtySold: 2,
          qtyLeft: 36,
          purchasePrice: 16000,
          vatExclPrice: 14500,
          sellingPrice: 24000,
          totalAmount: 608000,
          salesAmount: 48000,
          costPriceInQtySold: 32000,
          margin: 16000,
          marginPercentage: 50.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '6',
          category: 'CAMPING EQUIPMENT',
          itemName: 'CAMPING BURNER',
          size: 'N/A',
          brand: 'GENERIC',
          totalQuantity: 254,
          qtySold: 0,
          qtyLeft: 254,
          purchasePrice: 3500,
          vatExclPrice: 3200,
          sellingPrice: 5000,
          totalAmount: 889000,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 42.86,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '7',
          category: 'REGULATOR',
          itemName: 'REGULATOR',
          size: 'N/A',
          brand: 'RECKA',
          totalQuantity: 93,
          qtySold: 0,
          qtyLeft: 93,
          purchasePrice: 9000,
          vatExclPrice: 8500,
          sellingPrice: 12000,
          totalAmount: 837000,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 33.33,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '8',
          category: 'REGULATOR',
          itemName: 'REGULATOR',
          size: 'N/A',
          brand: 'COMPACT',
          totalQuantity: 187,
          qtySold: 0,
          qtyLeft: 187,
          purchasePrice: 5500,
          vatExclPrice: 5000,
          sellingPrice: 8000,
          totalAmount: 1028500,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 45.45,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '9',
          category: 'BURNER',
          itemName: '6KG IRON BURNER AND CONTROL',
          size: '6KG',
          brand: 'GENERIC',
          totalQuantity: 86,
          qtySold: 0,
          qtyLeft: 86,
          purchasePrice: 4500,
          vatExclPrice: 4000,
          sellingPrice: 7000,
          totalAmount: 387000,
          salesAmount: 0,
          costPriceInQtySold: 0,
          margin: 0,
          marginPercentage: 55.56,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '10',
          category: 'BURNER',
          itemName: '3KG IRON BURNER AND CONTROL',
          size: '3KG',
          brand: 'GENERIC',
          totalQuantity: 148,
          qtySold: 3,
          qtyLeft: 145,
          purchasePrice: 3500,
          vatExclPrice: 3200,
          sellingPrice: 5500,
          totalAmount: 518000,
          salesAmount: 16500,
          costPriceInQtySold: 10500,
          margin: 6000,
          marginPercentage: 57.14,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setItems(sampleData)
      localStorage.setItem('lpgCylindersAccessories', JSON.stringify(sampleData))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('lpgCylindersAccessories', JSON.stringify(items))
    }
  }, [items])

  // Filter items
  useEffect(() => {
    let filtered = items

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.size.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [searchTerm, filterCategory, items])

  const calculateFields = () => {
    const totalQty = parseInt(formData.totalQuantity) || 0
    const qtySold = parseInt(formData.qtySold) || 0
    const qtyLeft = totalQty - qtySold

    const purchasePrice = parseFloat(formData.purchasePrice) || 0
    const vatExclPrice = parseFloat(formData.vatExclPrice) || purchasePrice * 0.925
    const sellingPrice = parseFloat(formData.sellingPrice) || 0

    const totalAmount = totalQty * purchasePrice
    const salesAmount = qtySold * sellingPrice
    const costPriceInQtySold = qtySold * purchasePrice
    const margin = salesAmount - costPriceInQtySold
    const marginPercentage = sellingPrice > 0 ? ((sellingPrice - purchasePrice) / sellingPrice) * 100 : 0

    return {
      qtyLeft,
      vatExclPrice,
      totalAmount,
      salesAmount,
      costPriceInQtySold,
      margin,
      marginPercentage
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.itemName || !formData.totalQuantity || !formData.purchasePrice || !formData.sellingPrice) {
      alert('Please fill in all required fields!')
      return
    }

    const calculated = calculateFields()

    const newItem: CylinderAccessory = {
      id: selectedItem?.id || Date.now().toString(),
      category: formData.category,
      itemName: formData.itemName,
      size: formData.size,
      brand: formData.brand,
      totalQuantity: parseInt(formData.totalQuantity),
      qtySold: parseInt(formData.qtySold) || 0,
      qtyLeft: calculated.qtyLeft,
      purchasePrice: parseFloat(formData.purchasePrice),
      vatExclPrice: calculated.vatExclPrice,
      sellingPrice: parseFloat(formData.sellingPrice),
      totalAmount: calculated.totalAmount,
      salesAmount: calculated.salesAmount,
      costPriceInQtySold: calculated.costPriceInQtySold,
      margin: calculated.margin,
      marginPercentage: calculated.marginPercentage,
      createdAt: selectedItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (selectedItem) {
      setItems(items.map(i => i.id === selectedItem.id ? newItem : i))
    } else {
      setItems([newItem, ...items])
    }

    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      category: 'GAS CYLINDER',
      itemName: '',
      size: '',
      brand: '',
      totalQuantity: '',
      qtySold: '0',
      purchasePrice: '',
      vatExclPrice: '',
      sellingPrice: ''
    })
    setSelectedItem(null)
  }

  const handleEdit = (item: CylinderAccessory) => {
    setSelectedItem(item)
    setFormData({
      category: item.category,
      itemName: item.itemName,
      size: item.size,
      brand: item.brand,
      totalQuantity: item.totalQuantity.toString(),
      qtySold: item.qtySold.toString(),
      purchasePrice: item.purchasePrice.toString(),
      vatExclPrice: item.vatExclPrice.toString(),
      sellingPrice: item.sellingPrice.toString()
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  // Summary calculations
  const totalInventoryValue = filteredItems.reduce((sum, i) => sum + i.totalAmount, 0)
  const totalSalesAmount = filteredItems.reduce((sum, i) => sum + i.salesAmount, 0)
  const totalMargin = filteredItems.reduce((sum, i) => sum + i.margin, 0)
  const totalQtyInStock = filteredItems.reduce((sum, i) => sum + i.qtyLeft, 0)

  const calculated = calculateFields()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cylinders & Accessories Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage gas cylinders, regulators, burners, and equipment</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalInventoryValue.toLocaleString()}</p>
            </div>
            <Archive className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">₦{totalSalesAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Margin</p>
              <p className="text-2xl font-bold text-purple-600">₦{totalMargin.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Qty in Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalQtyInStock.toLocaleString()}</p>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by item name, brand, or size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Items Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Item Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Brand</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Total Qty</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Sold</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Left</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Purchase Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Selling Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Margin %</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${item.category === 'GAS CYLINDER' ? 'bg-purple-100 text-purple-800' :
                          item.category === 'REGULATOR' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'BURNER' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{item.itemName}</td>
                    <td className="py-3 px-4 text-sm">{item.size}</td>
                    <td className="py-3 px-4 text-sm">{item.brand}</td>
                    <td className="py-3 px-4 text-sm text-right">{item.totalQuantity}</td>
                    <td className="py-3 px-4 text-sm text-right">{item.qtySold}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium">{item.qtyLeft}</td>
                    <td className="py-3 px-4 text-sm text-right">₦{item.purchasePrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium">₦{item.sellingPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={item.marginPercentage > 40 ? 'text-green-600 font-bold' : 'text-gray-900'}>
                        {item.marginPercentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Item Name *</label>
                    <Input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      placeholder="e.g., 12.5 KG GAS CYLINDER"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Size</option>
                      {CYLINDER_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                      <option value="N/A">N/A</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Brand</option>
                      {BRANDS.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Total Quantity *</label>
                    <Input
                      type="number"
                      value={formData.totalQuantity}
                      onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Qty Sold</label>
                    <Input
                      type="number"
                      value={formData.qtySold}
                      onChange={(e) => setFormData({ ...formData, qtySold: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Qty Left (Auto)</label>
                    <Input
                      type="text"
                      value={calculated.qtyLeft}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Price (₦) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">VAT Excl. Price (Auto)</label>
                    <Input
                      type="text"
                      value={calculated.vatExclPrice.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Selling Price (₦) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Calculated Fields Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-bold">₦{calculated.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sales Amount:</span>
                      <p className="font-bold">₦{calculated.salesAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Margin:</span>
                      <p className="font-bold text-green-600">₦{calculated.margin.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Margin %:</span>
                      <p className="font-bold text-purple-600">{calculated.marginPercentage.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {selectedItem ? 'Update Item' : 'Add Item'}
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
