'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerformanceReview } from '@/lib/types';
import { Star, TrendingUp, Award, Plus, Download, User } from 'lucide-react';

export default function PerformancePage() {
  const [reviews] = useState<PerformanceReview[]>([
    {
      id: '1',
      employeeId: '1',
      employee: {
        id: '1',
        userId: '1',
        employeeNumber: 'EMP001',
        dateOfJoining: '2020-01-15',
        dateOfBirth: '1990-05-20',
        gender: 'male',
        maritalStatus: 'married',
        address: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '+234 801 234 5678',
        jobTitle: 'Station Manager',
        employmentType: 'full-time',
        salary: 250000,
        status: 'active',
        createdAt: '2020-01-15',
        updatedAt: '2024-01-01',
        user: {
          id: '1',
          email: 'john.doe@bayscom.com',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+234 801 234 5678',
          roleId: '1',
          departmentId: '1',
          status: 'active',
          createdAt: '2020-01-15',
          updatedAt: '2024-01-01',
        },
      },
      reviewerId: 'manager-1',
      reviewPeriod: 'Q4 2023',
      reviewDate: '2024-01-15',
      overallRating: 4.5,
      categories: [
        { category: 'Job Knowledge', rating: 5, comments: 'Excellent understanding of petroleum operations' },
        { category: 'Quality of Work', rating: 4, comments: 'Consistently delivers high-quality results' },
        { category: 'Communication', rating: 4.5, comments: 'Great team player and communicator' },
        { category: 'Leadership', rating: 4.5, comments: 'Strong leadership of station team' },
        { category: 'Initiative', rating: 4, comments: 'Proactive in identifying improvements' },
      ],
      strengths: 'Strong operational knowledge, excellent leadership skills, reliable',
      areasForImprovement: 'Could improve documentation practices, delegate more effectively',
      goals: 'Increase station efficiency by 15%, mentor 2 junior staff members',
      status: 'submitted',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
    },
  ]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
    : 0;

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      submitted: { variant: 'default', label: 'Submitted' },
      acknowledged: { variant: 'outline', label: 'Acknowledged' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
            <p className="text-gray-600">Conduct and track employee performance reviews</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Review
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                </div>
                <div className="p-3 bg-[#8B1538] bg-opacity-10 rounded-full">
                  <Award className="h-6 w-6 text-[#8B1538]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8B1538] bg-opacity-10 rounded-full">
                      <User className="h-5 w-5 text-[#8B1538]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.employee?.user?.firstName} {review.employee?.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.employee?.jobTitle} • {review.reviewPeriod}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(review.status)}
                    <p className="text-sm text-gray-500">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Overall Rating</h4>
                      {getRatingStars(review.overallRating)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Category Ratings</h4>
                    <div className="space-y-3">
                      {review.categories.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{cat.category}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= cat.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-700">{cat.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                      <p className="text-sm text-gray-600">{review.strengths}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                      <p className="text-sm text-gray-600">{review.areasForImprovement}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Goals</h4>
                    <p className="text-sm text-gray-600">{review.goals}</p>
                  </div>

                  {review.employeeComments && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Employee Comments</h4>
                      <p className="text-sm text-gray-600">{review.employeeComments}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">View Details</Button>
                    {review.status === 'submitted' && <Button>Acknowledge</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
