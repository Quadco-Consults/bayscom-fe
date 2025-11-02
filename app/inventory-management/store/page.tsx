'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Warehouse,
  Search,
  X,
  ArrowRightLeft,
  ArrowUpFromLine,
  ArrowDownToLine,
  Package,
  AlertTriangle
} from 'lucide-react';

interface StoreItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  lastTransfer?: {
    type: 'in' | 'out';
    quantity: number;
    from?: string;
    to?: string;
    date: string;
  };
}

export default function StorePage() {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'in' | 'out'>('in');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItemsForTransfer, setSelectedItemsForTransfer] = useState<string[]>([]);
  const [transferQuantities, setTransferQuantities] = useState<{[key: string]: string}>({});

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    productId: '',
    sku: '',
    name: '',
    quantity: '',
    from: '',
    to: '',
    notes: '',
  });

  // Load store items from localStorage
  useEffect(() => {
    const savedStoreItems = localStorage.getItem('storeItems');
    if (savedStoreItems) {
      try {
        setStoreItems(JSON.parse(savedStoreItems));
      } catch (error) {
        console.error('Failed to parse store items:', error);
      }
    }
  }, []);

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, []);

  // Save store items to localStorage
  useEffect(() => {
    if (storeItems.length > 0) {
      localStorage.setItem('storeItems', JSON.stringify(storeItems));
    }
  }, [storeItems]);

  // Handle transfer in (from Products or GRN to Store)
  const handleTransferIn = () => {
    setTransferType('in');
    setTransferForm({
      productId: '',
      sku: '',
      name: '',
      quantity: '',
      from: 'products',
      to: 'store',
      notes: '',
    });
    setShowTransferModal(true);
  };

  // Handle transfer out (from Store to Products)
  const handleTransferOut = (item: StoreItem) => {
    setSelectedItem(item);
    setTransferType('out');
    setTransferForm({
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      quantity: '',
      from: 'store',
      to: 'products',
      notes: '',
    });
    setShowTransferModal(true);
  };

  // Handle product selection for transfer in
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = products.find(p => p.id === productId);
    if (product) {
      setTransferForm(prev => ({
        ...prev,
        productId: product.id,
        sku: product.sku,
        name: product.name,
      }));
    }
  };

  // Submit transfer
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseInt(transferForm.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (transferType === 'in') {
      // Transfer IN to store
      const existingItem = storeItems.find(item => item.productId === transferForm.productId);

      if (existingItem) {
        // Update existing item
        setStoreItems(prev => prev.map(item =>
          item.productId === transferForm.productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lastTransfer: {
                  type: 'in',
                  quantity,
                  from: transferForm.from,
                  date: new Date().toISOString(),
                }
              }
            : item
        ));
      } else {
        // Add new item to store
        const newStoreItem: StoreItem = {
          id: Date.now().toString(),
          productId: transferForm.productId,
          sku: transferForm.sku,
          name: transferForm.name,
          category: 'General',
          quantity,
          unit: 'pieces',
          location: 'Main Store',
          lastTransfer: {
            type: 'in',
            quantity,
            from: transferForm.from,
            date: new Date().toISOString(),
          }
        };
        setStoreItems(prev => [newStoreItem, ...prev]);
      }

      // Update product inventory (reduce from products)
      const updatedProducts = products.map(p =>
        p.id === transferForm.productId
          ? { ...p, currentStock: p.currentStock - quantity }
          : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      // Save transfer history
      const transferHistory = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      transferHistory.push({
        id: `TR-${Date.now()}`,
        type: 'product-to-store',
        productName: transferForm.name,
        sku: transferForm.sku,
        quantity,
        from: 'Products Inventory',
        to: 'Store',
        date: new Date().toISOString(),
        performedBy: 'Current User',
      });
      localStorage.setItem('transferHistory', JSON.stringify(transferHistory));

      alert('Items transferred to store successfully!');
    } else {
      // Transfer OUT from store
      if (!selectedItem) return;

      if (quantity > selectedItem.quantity) {
        alert('Cannot transfer more than available quantity in store');
        return;
      }

      // Update store item
      setStoreItems(prev => prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              quantity: item.quantity - quantity,
              lastTransfer: {
                type: 'out',
                quantity,
                to: transferForm.to,
                date: new Date().toISOString(),
              }
            }
          : item
      ).filter(item => item.quantity > 0)); // Remove items with 0 quantity

      // Update product inventory (add back to products)
      const updatedProducts = products.map(p =>
        p.id === selectedItem.productId
          ? { ...p, currentStock: p.currentStock + quantity }
          : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      // Save transfer history
      const transferHistory = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      transferHistory.push({
        id: `TR-${Date.now()}`,
        type: 'store-to-product',
        productName: selectedItem.name,
        sku: selectedItem.sku,
        quantity,
        from: 'Store',
        to: 'Products Inventory',
        date: new Date().toISOString(),
        performedBy: 'Current User',
      });
      localStorage.setItem('transferHistory', JSON.stringify(transferHistory));

      alert('Items transferred from store successfully!');
    }

    setShowTransferModal(false);
    setSelectedItem(null);
    setTransferForm({
      productId: '',
      sku: '',
      name: '',
      quantity: '',
      from: '',
      to: '',
      notes: '',
    });
  };

  // Filter store items by search
  const filteredItems = storeItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  });

  const totalItems = storeItems.length;
  const totalQuantity = storeItems.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockItems = storeItems.filter(item => item.quantity < 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
              <p className="text-gray-500">Central location for managing inventory transfers</p>
            </div>
            <Button onClick={handleTransferIn} className="bg-[#2D5016] hover:bg-[#1F3509]">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Transfer In
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search store items..."
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuantity}</div>
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
              <CardTitle className="text-sm font-medium text-gray-500">Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Store Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Store Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Warehouse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No items in store yet</p>
                <p className="text-sm text-gray-400 mt-2">Transfer items from products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.sku}</Badge>
                          {item.quantity < 10 && (
                            <Badge variant="warning" className="bg-orange-100 text-orange-800">Low Stock</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.category} • {item.location}
                        </p>
                        {item.lastTransfer && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last {item.lastTransfer.type === 'in' ? 'received' : 'transferred out'}: {item.lastTransfer.quantity} units
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="text-lg font-semibold">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransferOut(item)}
                        className="border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
                      >
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Transfer to Products
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {transferType === 'in' ? 'Transfer to Store' : 'Transfer to Products'}
                </h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedItem(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="p-6 space-y-4">
                {transferType === 'in' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Product *
                    </label>
                    <select
                      value={transferForm.productId}
                      onChange={handleProductSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                      required
                    >
                      <option value="">Select a product...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku}) - Available: {product.currentStock}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product
                    </label>
                    <Input value={transferForm.name} disabled />
                    <p className="text-sm text-gray-500 mt-1">
                      Available in store: {selectedItem?.quantity} {selectedItem?.unit}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <Input
                    value={transferType === 'in' ? 'Products Inventory' : 'Store'}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <Input
                    value={transferType === 'in' ? 'Store' : 'Products Inventory'}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={transferForm.notes}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional transfer notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowTransferModal(false);
                      setSelectedItem(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded inline-flex items-center justify-center"
                  >
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    {transferType === 'in' ? 'Transfer to Store' : 'Transfer to Products'}
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
