'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PackageCheck, Eye, X } from 'lucide-react';

export default function GoodsReceivedNotePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [goodsReceivedNotes, setGoodsReceivedNotes] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<any>(null);

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
    <DashboardLayout
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search goods received notes..."
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goods Received Note</h1>
            <p className="text-gray-600">Track all received goods from purchase orders</p>
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
                          <button
                            onClick={() => handleViewGRN(grn)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 inline mr-1" />
                            View
                          </button>
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
      </div>
    </DashboardLayout>
  );
}
