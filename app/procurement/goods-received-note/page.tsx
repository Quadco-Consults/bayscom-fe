'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, PackageCheck, Eye, X, Search, ArrowRightLeft } from 'lucide-react';

export default function GoodsReceivedNotePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [goodsReceivedNotes, setGoodsReceivedNotes] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferDestination, setTransferDestination] = useState<'products' | 'store'>('products');

  // Load GRNs from localStorage
  useEffect(() => {
    const savedGRNs = localStorage.getItem('goodsReceivedNotes');
    if (savedGRNs) {
      try {
        setGoodsReceivedNotes(JSON.parse(savedGRNs));
      } catch (error) {
        console.error('Failed to parse GRNs:', error);
      }
    }
  }, []);

  // Handle view GRN
  const handleViewGRN = (grn: any) => {
    setSelectedGRN(grn);
    setShowViewModal(true);
  };

  // Handle transfer GRN
  const handleTransferGRN = (grn: any) => {
    setSelectedGRN(grn);
    setTransferDestination('products');
    setShowTransferModal(true);
  };

  // Process transfer
  const processTransfer = () => {
    if (!selectedGRN) return;

    if (transferDestination === 'products') {
      // Transfer to Products Inventory
      const products = JSON.parse(localStorage.getItem('products') || '[]');

      selectedGRN.items.forEach((item: any) => {
        const existingProduct = products.find((p: any) => p.name === item.name || p.sku === item.sku);

        if (existingProduct) {
          // Update existing product
          existingProduct.currentStock += item.receivedQuantity;
        } else {
          // Create new product
          const newProduct = {
            id: Date.now().toString() + Math.random(),
            sku: item.sku || `SKU-${Date.now()}`,
            name: item.name,
            category: 'General',
            description: `Received from ${selectedGRN.vendor}`,
            unit: 'pieces',
            reorderLevel: 10,
            reorderQuantity: 50,
            currentStock: item.receivedQuantity,
            unitPrice: 0,
            supplier: selectedGRN.vendor,
            location: 'Main Warehouse',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          };
          products.push(newProduct);
        }
      });

      localStorage.setItem('products', JSON.stringify(products));

      // Save transfer history
      const transferHistory = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      selectedGRN.items.forEach((item: any) => {
        transferHistory.push({
          id: `TR-${Date.now()}-${Math.random()}`,
          type: 'grn-to-product',
          productName: item.name,
          sku: item.sku || 'N/A',
          quantity: item.receivedQuantity,
          from: `GRN ${selectedGRN.id}`,
          to: 'Products Inventory',
          grnId: selectedGRN.id,
          vendor: selectedGRN.vendor,
          date: new Date().toISOString(),
          performedBy: 'Current User',
        });
      });
      localStorage.setItem('transferHistory', JSON.stringify(transferHistory));

      alert(`Items from GRN ${selectedGRN.id} transferred to Products Inventory successfully!`);

    } else {
      // Transfer to Store
      const storeItems = JSON.parse(localStorage.getItem('storeItems') || '[]');

      selectedGRN.items.forEach((item: any) => {
        const existingStoreItem = storeItems.find((s: any) => s.name === item.name || s.sku === item.sku);

        if (existingStoreItem) {
          // Update existing store item
          existingStoreItem.quantity += item.receivedQuantity;
          existingStoreItem.lastTransfer = {
            type: 'in',
            quantity: item.receivedQuantity,
            from: `GRN ${selectedGRN.id}`,
            date: new Date().toISOString(),
          };
        } else {
          // Create new store item
          const newStoreItem = {
            id: Date.now().toString() + Math.random(),
            productId: Date.now().toString(),
            sku: item.sku || `SKU-${Date.now()}`,
            name: item.name,
            category: 'General',
            quantity: item.receivedQuantity,
            unit: 'pieces',
            location: 'Main Store',
            lastTransfer: {
              type: 'in',
              quantity: item.receivedQuantity,
              from: `GRN ${selectedGRN.id}`,
              date: new Date().toISOString(),
            }
          };
          storeItems.push(newStoreItem);
        }
      });

      localStorage.setItem('storeItems', JSON.stringify(storeItems));

      // Save transfer history
      const transferHistory = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      selectedGRN.items.forEach((item: any) => {
        transferHistory.push({
          id: `TR-${Date.now()}-${Math.random()}`,
          type: 'grn-to-store',
          productName: item.name,
          sku: item.sku || 'N/A',
          quantity: item.receivedQuantity,
          from: `GRN ${selectedGRN.id}`,
          to: 'Store',
          grnId: selectedGRN.id,
          vendor: selectedGRN.vendor,
          date: new Date().toISOString(),
          performedBy: 'Current User',
        });
      });
      localStorage.setItem('transferHistory', JSON.stringify(transferHistory));

      alert(`Items from GRN ${selectedGRN.id} transferred to Store successfully!`);
    }

    // Mark GRN as transferred
    const updatedGRNs = goodsReceivedNotes.map(grn =>
      grn.id === selectedGRN.id
        ? { ...grn, transferred: true, transferredTo: transferDestination, transferredDate: new Date().toISOString() }
        : grn
    );
    setGoodsReceivedNotes(updatedGRNs);
    localStorage.setItem('goodsReceivedNotes', JSON.stringify(updatedGRNs));

    setShowTransferModal(false);
    setSelectedGRN(null);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'complete':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'partial':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'excess':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Filter GRNs based on search query
  const filteredGRNs = goodsReceivedNotes.filter((grn) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      grn.id.toLowerCase().includes(query) ||
      grn.poId.toLowerCase().includes(query) ||
      grn.vendor.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Goods Received Note</h1>
              <p className="text-gray-600">Track all received goods from purchase orders</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search goods received notes..."
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
                  <p className="text-sm font-medium text-gray-600">Total GRNs</p>
                  <p className="text-2xl font-bold text-gray-900">{goodsReceivedNotes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PackageCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Complete</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {goodsReceivedNotes.filter(g => g.status === 'complete').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <PackageCheck className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Partial</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {goodsReceivedNotes.filter(g => g.status === 'partial').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PackageCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">With Excess</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {goodsReceivedNotes.filter(g => g.status === 'excess').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GRN Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Goods Received Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">GRN ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">PO ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Received Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGRNs.length > 0 ? (
                    filteredGRNs.map((grn) => (
                      <tr key={grn.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{grn.id}</td>
                        <td className="py-3 px-4 text-gray-600">{grn.poId}</td>
                        <td className="py-3 px-4 text-gray-600">{grn.vendor}</td>
                        <td className="py-3 px-4 text-gray-600">{grn.receivedDate}</td>
                        <td className="py-3 px-4 text-gray-600">{grn.items.length} items</td>
                        <td className="py-3 px-4">
                          <span className={getStatusBadge(grn.status)}>
                            {grn.status.charAt(0).toUpperCase() + grn.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewGRN(grn)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-3 w-3 inline mr-1" />
                              View
                            </button>
                            {!grn.transferred && (
                              <button
                                onClick={() => handleTransferGRN(grn)}
                                className="px-2 py-1 text-xs border border-[#2D5016] rounded bg-[#2D5016] text-white hover:bg-[#1F3509]"
                              >
                                <ArrowRightLeft className="h-3 w-3 inline mr-1" />
                                Transfer
                              </button>
                            )}
                            {grn.transferred && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                Transferred
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                        {searchQuery ? `No GRNs found matching "${searchQuery}"` : 'No goods received notes found. Items will appear here when purchase orders are received.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* View GRN Modal */}
        {showViewModal && selectedGRN && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">GRN Details</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowViewModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* GRN Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">GRN Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">GRN ID</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedGRN.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Purchase Order ID</label>
                        <p className="text-sm text-gray-900">{selectedGRN.poId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Vendor</label>
                        <p className="text-sm text-gray-900">{selectedGRN.vendor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Received Date</label>
                        <p className="text-sm text-gray-900">{selectedGRN.receivedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Overall Status</label>
                        <span className={getStatusBadge(selectedGRN.status)}>
                          {selectedGRN.status.charAt(0).toUpperCase() + selectedGRN.status.slice(1)}
                        </span>
                      </div>
                      {selectedGRN.notes && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Notes</label>
                          <p className="text-sm text-gray-900">{selectedGRN.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Received */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Items Received</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Ordered</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Received</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Difference</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGRN.items.map((item: any, index: number) => {
                          const difference = item.receivedQuantity - item.orderedQuantity;
                          const itemStatus = difference === 0 ? 'complete' : difference < 0 ? 'shortfall' : 'excess';

                          return (
                            <tr key={index} className="border-t border-gray-100">
                              <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                              <td className="py-3 px-4">{item.orderedQuantity}</td>
                              <td className="py-3 px-4 font-medium">{item.receivedQuantity}</td>
                              <td className="py-3 px-4">
                                <span className={difference === 0 ? 'text-gray-600' : difference < 0 ? 'text-red-600' : 'text-blue-600'}>
                                  {difference > 0 ? '+' : ''}{difference}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  itemStatus === 'complete' ? 'bg-green-100 text-green-800' :
                                  itemStatus === 'shortfall' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {itemStatus === 'complete' ? 'Complete' : itemStatus === 'shortfall' ? 'Shortfall' : 'Excess'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
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
                  <button
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    onClick={() => window.print()}
                  >
                    Print GRN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && selectedGRN && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Transfer Items</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedGRN(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">GRN Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">GRN ID:</span>
                      <span className="text-sm text-gray-900 font-medium">{selectedGRN.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Vendor:</span>
                      <span className="text-sm text-gray-900">{selectedGRN.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Items:</span>
                      <span className="text-sm text-gray-900">{selectedGRN.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Quantity:</span>
                      <span className="text-sm text-gray-900">
                        {selectedGRN.items.reduce((sum: number, item: any) => sum + item.receivedQuantity, 0)} units
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Items to Transfer</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-900">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGRN.items.map((item: any, index: number) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="py-3 px-4">{item.name}</td>
                            <td className="py-3 px-4 text-right font-medium">{item.receivedQuantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Select Transfer Destination *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="destination"
                        value="products"
                        checked={transferDestination === 'products'}
                        onChange={(e) => setTransferDestination(e.target.value as 'products' | 'store')}
                        className="mt-1 h-4 w-4 text-[#2D5016] focus:ring-[#2D5016]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">Products Inventory</div>
                        <div className="text-sm text-gray-500">
                          Transfer items to the main products inventory for immediate use
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="destination"
                        value="store"
                        checked={transferDestination === 'store'}
                        onChange={(e) => setTransferDestination(e.target.value as 'products' | 'store')}
                        className="mt-1 h-4 w-4 text-[#2D5016] focus:ring-[#2D5016]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">Store</div>
                        <div className="text-sm text-gray-500">
                          Transfer items to the store for centralized management
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowTransferModal(false);
                      setSelectedGRN(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={processTransfer}
                    className="flex-1 px-4 py-2 text-sm bg-[#2D5016] hover:bg-[#1F3509] text-white rounded inline-flex items-center justify-center"
                  >
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Transfer to {transferDestination === 'products' ? 'Products' : 'Store'}
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
