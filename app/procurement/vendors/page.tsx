'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Phone, Mail, MapPin, Star } from 'lucide-react';

export default function VendorsPage() {
  // Mock data - replace with actual API calls
  const vendors = [
    {
      id: 'V-001',
      name: 'ABC Supplies Ltd',
      category: 'Office Supplies',
      email: 'contact@abcsupplies.com',
      phone: '+234 801 234 5678',
      address: 'Lagos, Nigeria',
      rating: 4.5,
      status: 'active',
      totalOrders: 24,
      totalValue: '₦2,400,000',
    },
    {
      id: 'V-002',
      name: 'Tech Solutions Inc',
      category: 'IT Equipment',
      email: 'sales@techsolutions.com',
      phone: '+234 802 345 6789',
      address: 'Abuja, Nigeria',
      rating: 4.8,
      status: 'active',
      totalOrders: 18,
      totalValue: '₦5,200,000',
    },
    {
      id: 'V-003',
      name: 'AutoParts Nigeria',
      category: 'Vehicle Parts',
      email: 'info@autoparts.ng',
      phone: '+234 803 456 7890',
      address: 'Port Harcourt, Nigeria',
      rating: 4.2,
      status: 'active',
      totalOrders: 31,
      totalValue: '₦3,800,000',
    },
    {
      id: 'V-004',
      name: 'Industrial Tools Co',
      category: 'Industrial Equipment',
      email: 'orders@industrialtools.com',
      phone: '+234 804 567 8901',
      address: 'Kano, Nigeria',
      rating: 3.9,
      status: 'inactive',
      totalOrders: 8,
      totalValue: '₦1,200,000',
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Vendors</h1>
            <p className="text-black">Manage your supplier relationships</p>
          </div>
          <Button className="bg-[#2D5016] hover:bg-[#1F3509]">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Active Vendors</p>
                  <p className="text-2xl font-bold text-black">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Avg Rating</p>
                  <p className="text-2xl font-bold text-black">4.3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Categories</p>
                  <p className="text-2xl font-bold text-black">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Total Value</p>
                  <p className="text-2xl font-bold text-black">₦12.6M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{vendor.name}</h3>
                      <p className="text-sm text-black">{vendor.category}</p>
                    </div>
                    <span className={getStatusBadge(vendor.status)}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(vendor.rating)}
                    </div>
                    <span className="text-sm text-black">({vendor.rating})</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-black">
                      <Mail className="h-4 w-4" />
                      <span>{vendor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-black">
                      <Phone className="h-4 w-4" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-black">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.address}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-black">Total Orders</p>
                      <p className="text-xl font-semibold text-black">{vendor.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Total Value</p>
                      <p className="text-xl font-semibold text-black">{vendor.totalValue}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vendors Table (Alternative View) */}
        <Card>
          <CardHeader>
            <CardTitle>All Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-black">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Total Value</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-black">{vendor.name}</p>
                          <p className="text-xs text-black">{vendor.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-black">{vendor.category}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-black">{vendor.email}</p>
                          <p className="text-xs text-black">{vendor.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(vendor.rating).slice(0, 5)}
                          <span className="text-xs text-black">({vendor.rating})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-black">{vendor.totalOrders}</td>
                      <td className="py-3 px-4 font-medium text-black">{vendor.totalValue}</td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(vendor.status)}>
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
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
      </div>
    </DashboardLayout>
  );
}