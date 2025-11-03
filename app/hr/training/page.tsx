'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Training, TrainingParticipant } from '@/lib/types';
import {
  GraduationCap,
  Users,
  Calendar,
  DollarSign,
  Plus,
  Download,
  MapPin,
  Clock,
  Award
} from 'lucide-react';

export default function TrainingPage() {
  const [trainings] = useState<Training[]>([
    {
      id: '1',
      title: 'Safety & Compliance Training',
      description: 'Comprehensive training on petroleum safety standards, HSE procedures, and regulatory compliance',
      trainingType: 'internal',
      trainer: 'HSE Department',
      location: 'Lagos Office',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      duration: 3,
      capacity: 25,
      cost: 0,
      status: 'planned',
      participants: [
        {
          id: '1',
          trainingId: '1',
          employeeId: '1',
          status: 'registered',
          certificateIssued: false,
          registeredDate: '2024-01-20',
        },
        {
          id: '2',
          trainingId: '1',
          employeeId: '2',
          status: 'registered',
          certificateIssued: false,
          registeredDate: '2024-01-21',
        },
      ],
      materials: 'Safety manual, PPE guidelines, regulatory handbook',
      createdBy: 'hr-manager-1',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Customer Service Excellence',
      description: 'Advanced customer service techniques for station attendants and front-line staff',
      trainingType: 'workshop',
      trainer: 'Professional Trainers Ltd',
      location: 'External Venue',
      startDate: '2024-02-20',
      endDate: '2024-02-22',
      duration: 3,
      capacity: 20,
      cost: 150000,
      status: 'planned',
      participants: [],
      materials: 'Workbook, case studies, certificate of completion',
      createdBy: 'hr-manager-1',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18',
    },
    {
      id: '3',
      title: 'Fleet Management & Logistics',
      description: 'Best practices in fleet operations, route optimization, and maintenance scheduling',
      trainingType: 'online',
      trainer: 'Industry Experts',
      location: 'Online Platform',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      duration: 3,
      capacity: 30,
      cost: 50000,
      status: 'completed',
      participants: [
        {
          id: '3',
          trainingId: '3',
          employeeId: '3',
          status: 'completed',
          score: 85,
          certificateIssued: true,
          feedback: 'Excellent course content',
          registeredDate: '2024-01-05',
        },
      ],
      materials: 'Video lessons, PDF resources, quiz assessments',
      createdBy: 'hr-manager-1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12',
    },
  ]);

  const stats = {
    upcoming: trainings.filter(t => t.status === 'planned').length,
    ongoing: trainings.filter(t => t.status === 'ongoing').length,
    completed: trainings.filter(t => t.status === 'completed').length,
    totalParticipants: trainings.reduce((sum, t) => sum + t.participants.length, 0),
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      planned: { variant: 'outline', label: 'Planned' },
      ongoing: { variant: 'default', label: 'Ongoing' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      registered: { variant: 'outline', label: 'Registered' },
      attended: { variant: 'default', label: 'Attended' },
      absent: { variant: 'destructive', label: 'Absent' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getTrainingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      internal: 'Internal',
      external: 'External',
      online: 'Online',
      workshop: 'Workshop',
      seminar: 'Seminar',
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
            <p className="text-gray-600">Manage employee training programs and track progress</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Training
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-[#8B1538]">{stats.upcoming}</p>
                </div>
                <div className="p-3 bg-[#8B1538] bg-opacity-10 rounded-full">
                  <Calendar className="h-6 w-6 text-[#8B1538]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ongoing</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.ongoing}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participants</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalParticipants}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {trainings.map((training) => (
            <Card key={training.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[#8B1538] bg-opacity-10 rounded-full">
                      <GraduationCap className="h-6 w-6 text-[#8B1538]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{training.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(training.status)}
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900">{getTrainingTypeLabel(training.trainingType)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Trainer</p>
                    <p className="text-sm font-medium text-gray-900">{training.trainer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{training.duration} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="text-sm font-medium text-gray-900">
                      {training.cost === 0 ? 'Free' : `₦${training.cost.toLocaleString()}`}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {training.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    {training.participants.length} / {training.capacity} participants
                  </div>
                </div>

                {training.materials && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Materials</p>
                    <p className="text-sm text-gray-600">{training.materials}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-[#8B1538] h-2 rounded-full"
                      style={{ width: `${(training.participants.length / training.capacity) * 100}%` }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Manage Participants</Button>
                    {training.status === 'planned' && <Button size="sm">Start Training</Button>}
                    {training.status === 'ongoing' && <Button size="sm">Mark Complete</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {trainings.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No training programs</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by scheduling a new training.</p>
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
