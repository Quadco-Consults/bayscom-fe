'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  X,
  ArrowRightLeft,
  Package,
  Warehouse,
  FileText,
  Eye,
  Calendar,
  User,
  Filter
} from 'lucide-react';

interface TransferRecord {
  id: string;
  type: 'product-to-store' | 'store-to-product' | 'grn-to-product' | 'grn-to-store';
  productName: string;
  sku: string;
  quantity: number;
  from: string;
  to: string;
  grnId?: string;
  vendor?: string;
  date: string;
  performedBy: string;
}

export default function TransferHistoryPage() {
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord | null>(null);

  // Load transfer history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('transferHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        // Sort by date descending (most recent first)
        const sortedHistory = history.sort((a: TransferRecord, b: TransferRecord) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransferHistory(sortedHistory);
      } catch (error) {
        console.error('Failed to parse transfer history:', error);
      }
    }
  }, []);

  // Handle view transfer details
  const handleViewTransfer = (transfer: TransferRecord) => {
    setSelectedTransfer(transfer);
    setShowViewModal(true);
  };

  // Get transfer type badge
  const getTransferTypeBadge = (type: string) => {
    const badges = {
      'product-to-store': { label: 'Products → Store', color: 'bg-blue-100 text-blue-800' },
      'store-to-product': { label: 'Store → Products', color: 'bg-green-100 text-green-800' },
      'grn-to-product': { label: 'GRN → Products', color: 'bg-purple-100 text-purple-800' },
      'grn-to-store': { label: 'GRN → Store', color: 'bg-orange-100 text-orange-800' },
    };
    return badges[type as keyof typeof badges] || { label: type, color: 'bg-gray-100 text-gray-800' };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter transfers
  const filteredTransfers = transferHistory.filter((transfer) => {
    // Type filter
    const typeMatch = typeFilter === 'all' || transfer.type === typeFilter;

    // Search filter
    const query = searchQuery.toLowerCase();
    const searchMatch =
      searchQuery === '' ||
      transfer.productName.toLowerCase().includes(query) ||
      transfer.sku.toLowerCase().includes(query) ||
      transfer.from.toLowerCase().includes(query) ||
      transfer.to.toLowerCase().includes(query) ||
      (transfer.grnId && transfer.grnId.toLowerCase().includes(query)) ||
      (transfer.vendor && transfer.vendor.toLowerCase().includes(query));

    return typeMatch && searchMatch;
  });

  // Statistics
  const totalTransfers = transferHistory.length;
  const productToStore = transferHistory.filter(t => t.type === 'product-to-store').length;
  const storeToProduct = transferHistory.filter(t => t.type === 'store-to-product').length;
  const grnTransfers = transferHistory.filter(t => t.type.startsWith('grn-')).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfer History</h1>
            <p className="text-gray-500">View all inventory transfers across products, store, and goods received</p>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by product, SKU, GRN, or vendor..."
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

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="product-to-store">Products → Store</option>
                <option value="store-to-product">Store → Products</option>
                <option value="grn-to-product">GRN → Products</option>
                <option value="grn-to-store">GRN → Store</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransfers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Products → Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{productToStore}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Store → Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{storeToProduct}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">GRN Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{grnTransfers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer History Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransfers.length === 0 ? (
              <div className="text-center py-12">
                <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transfer history found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchQuery || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Transfer history will appear here as you move items'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Transfer ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">From → To</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransfers.map((transfer) => {
                      const typeBadge = getTransferTypeBadge(transfer.type);
                      return (
                        <tr key={transfer.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-xs text-gray-600">
                            {transfer.id}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{transfer.productName}</p>
                              <p className="text-xs text-gray-500">{transfer.sku}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={typeBadge.color}>{typeBadge.label}</Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold">{transfer.quantity}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-gray-600">{transfer.from}</span>
                              <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{transfer.to}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-xs">
                            {formatDate(transfer.date)}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewTransfer(transfer)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-3 w-3 inline mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Transfer Details Modal */}
        {showViewModal && selectedTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Transfer Details</h2>
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowViewModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Transfer Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Transfer ID</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedTransfer.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Transfer Type</label>
                        <Badge className={getTransferTypeBadge(selectedTransfer.type).color}>
                          {getTransferTypeBadge(selectedTransfer.type).label}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          Date & Time
                        </label>
                        <p className="text-sm text-gray-900">{formatDate(selectedTransfer.date)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          <User className="inline h-3 w-3 mr-1" />
                          Performed By
                        </label>
                        <p className="text-sm text-gray-900">{selectedTransfer.performedBy}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Product Name</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedTransfer.productName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">SKU</label>
                        <p className="text-sm text-gray-900">{selectedTransfer.sku}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Quantity Transferred</label>
                        <p className="text-sm text-gray-900 font-bold text-lg">{selectedTransfer.quantity} units</p>
                      </div>
                      {selectedTransfer.grnId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            <FileText className="inline h-3 w-3 mr-1" />
                            GRN ID
                          </label>
                          <p className="text-sm text-gray-900 font-mono">{selectedTransfer.grnId}</p>
                        </div>
                      )}
                      {selectedTransfer.vendor && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Vendor</label>
                          <p className="text-sm text-gray-900">{selectedTransfer.vendor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transfer Route */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Route</h3>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
                        {selectedTransfer.from.includes('GRN') ? (
                          <FileText className="h-6 w-6 text-blue-600" />
                        ) : selectedTransfer.from.includes('Store') ? (
                          <Warehouse className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Package className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{selectedTransfer.from}</p>
                      <p className="text-xs text-gray-500">Source</p>
                    </div>

                    <div className="px-4">
                      <ArrowRightLeft className="h-6 w-6 text-gray-400" />
                    </div>

                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                        {selectedTransfer.to.includes('Store') ? (
                          <Warehouse className="h-6 w-6 text-green-600" />
                        ) : (
                          <Package className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{selectedTransfer.to}</p>
                      <p className="text-xs text-gray-500">Destination</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
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
