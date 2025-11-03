'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recruitment, JobApplication } from '@/lib/types';
import { Briefcase, Users, CheckCircle, XCircle, Plus, Download, MapPin, DollarSign, X, Calendar } from 'lucide-react';

export default function RecruitmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');

  const [viewMode, setViewMode] = useState<'postings' | 'applications'>(
    modeParam === 'applications' ? 'applications' : 'postings'
  );
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | undefined>();

  useEffect(() => {
    if (modeParam === 'applications') {
      setViewMode('applications');
    } else if (modeParam === 'postings') {
      setViewMode('postings');
    }
  }, [modeParam]);
  const [selectedPosition, setSelectedPosition] = useState<Recruitment | undefined>();
  const [selectedPositionForApps, setSelectedPositionForApps] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    jobTitle: '',
    departmentId: '',
    positions: 1,
    jobDescription: '',
    requirements: '',
    employmentType: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'temporary',
    salaryRangeMin: 0,
    salaryRangeMax: 0,
    location: '',
    closingDate: '',
  });

  const departments = [
    { id: '1', name: 'Management' },
    { id: '2', name: 'Operations' },
    { id: '3', name: 'Logistics & Fleet' },
    { id: '4', name: 'Sales & Marketing' },
    { id: '5', name: 'Finance & Accounting' },
    { id: '6', name: 'Human Resources' },
  ];

  const [positions, setPositions] = useState<Recruitment[]>([
    {
      id: '1',
      jobTitle: 'Operations Manager',
      departmentId: '2',
      department: {
        id: '2',
        name: 'Operations',
        description: 'Filling station and field operations',
        employeeCount: 45,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      positions: 2,
      jobDescription: 'Oversee daily operations of filling stations, manage staff, ensure compliance with safety standards.',
      requirements: 'Bachelor\'s degree, 5+ years experience in petroleum operations, strong leadership skills',
      employmentType: 'full-time',
      salaryRangeMin: 300000,
      salaryRangeMax: 450000,
      location: 'Lagos',
      postingDate: '2024-01-15',
      closingDate: '2024-02-15',
      status: 'open',
      applications: [],
      createdBy: 'hr-manager-1',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      jobTitle: 'Truck Driver',
      departmentId: '3',
      department: {
        id: '3',
        name: 'Logistics & Fleet',
        description: 'Truck fleet and transportation management',
        employeeCount: 32,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      positions: 5,
      jobDescription: 'Transport petroleum products safely, maintain vehicle logs, ensure timely deliveries.',
      requirements: 'Valid commercial driver\'s license, 3+ years experience with tankers, clean driving record',
      employmentType: 'full-time',
      salaryRangeMin: 120000,
      salaryRangeMax: 180000,
      location: 'Multiple Locations',
      postingDate: '2024-01-10',
      closingDate: '2024-02-10',
      status: 'open',
      applications: [],
      createdBy: 'hr-manager-1',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
  ]);

  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: '1',
      recruitmentId: '1',
      applicantName: 'Michael Okonkwo',
      applicantEmail: 'michael.o@email.com',
      applicantPhone: '+234 803 456 7890',
      status: 'interview',
      rating: 4,
      interviewDate: '2024-01-25',
      interviewNotes: 'Strong operational background, good communication skills',
      appliedDate: '2024-01-18',
      updatedAt: '2024-01-20',
    },
    {
      id: '2',
      recruitmentId: '2',
      applicantName: 'Fatima Abdullahi',
      applicantEmail: 'fatima.a@email.com',
      applicantPhone: '+234 804 567 8901',
      status: 'screening',
      appliedDate: '2024-01-19',
      updatedAt: '2024-01-19',
    },
  ]);

  const stats = {
    openPositions: positions.filter(p => p.status === 'open').length,
    totalApplications: applications.length,
    inInterview: applications.filter(a => a.status === 'interview').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPosition) {
      // Update existing position
      setPositions(positions.map(p =>
        p.id === selectedPosition.id
          ? {
              ...p,
              ...formData,
              department: departments.find(d => d.id === formData.departmentId),
              updatedAt: new Date().toISOString(),
            }
          : p
      ));
    } else {
      // Create new position
      const newPosition: Recruitment = {
        id: String(positions.length + 1),
        ...formData,
        department: departments.find(d => d.id === formData.departmentId),
        postingDate: new Date().toISOString(),
        status: 'open',
        applications: [],
        createdBy: 'hr-manager-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPositions([...positions, newPosition]);
    }
    handleCancel();
  };

  const handleEdit = (position: Recruitment) => {
    setSelectedPosition(position);
    setFormData({
      jobTitle: position.jobTitle,
      departmentId: position.departmentId,
      positions: position.positions,
      jobDescription: position.jobDescription,
      requirements: position.requirements,
      employmentType: position.employmentType,
      salaryRangeMin: position.salaryRangeMin,
      salaryRangeMax: position.salaryRangeMax,
      location: position.location,
      closingDate: position.closingDate,
    });
    setIsPostJobOpen(true);
  };

  const handleClose = (positionId: string) => {
    if (confirm('Are you sure you want to close this job posting?')) {
      setPositions(positions.map(p =>
        p.id === positionId
          ? { ...p, status: 'closed', updatedAt: new Date().toISOString() }
          : p
      ));
    }
  };

  const handleViewApplications = (positionId: string) => {
    setSelectedPositionForApps(positionId);
    router.push(`/hr/recruitment?mode=applications&position=${positionId}`);
  };

  const handleReview = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsReviewModalOpen(true);
  };

  const handleUpdateApplicationStatus = (status: JobApplication['status'], rating?: number, notes?: string) => {
    if (selectedApplication) {
      setApplications(applications.map(app =>
        app.id === selectedApplication.id
          ? {
              ...app,
              status,
              rating: rating !== undefined ? rating : app.rating,
              interviewNotes: notes || app.interviewNotes,
              updatedAt: new Date().toISOString(),
            }
          : app
      ));
      setIsReviewModalOpen(false);
      setSelectedApplication(undefined);
    }
  };

  const handleCancel = () => {
    setIsPostJobOpen(false);
    setSelectedPosition(undefined);
    setFormData({
      jobTitle: '',
      departmentId: '',
      positions: 1,
      jobDescription: '',
      requirements: '',
      employmentType: 'full-time',
      salaryRangeMin: 0,
      salaryRangeMax: 0,
      location: '',
      closingDate: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
      draft: { variant: 'outline', label: 'Draft' },
      open: { variant: 'default', label: 'Open' },
      closed: { variant: 'secondary', label: 'Closed' },
      filled: { variant: 'outline', label: 'Filled' },
      applied: { variant: 'outline', label: 'Applied' },
      screening: { variant: 'secondary', label: 'Screening' },
      interview: { variant: 'default', label: 'Interview' },
      offered: { variant: 'default', label: 'Offered' },
      hired: { variant: 'default', label: 'Hired' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };
    const badge = badges[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  useEffect(() => {
    const positionParam = searchParams.get('position');
    if (positionParam) {
      setSelectedPositionForApps(positionParam);
    } else {
      setSelectedPositionForApps(undefined);
    }
  }, [searchParams]);

  const filteredApplications = selectedPositionForApps
    ? applications.filter(a => a.recruitmentId === selectedPositionForApps)
    : applications;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {viewMode === 'postings' ? 'Job Postings' : 'Job Applications'}
            </h1>
            <p className="text-gray-600">
              {viewMode === 'postings'
                ? 'Manage job postings and hiring positions'
                : 'Review and manage candidate applications'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {viewMode === 'postings' && (
              <Button onClick={() => setIsPostJobOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Post Job
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Positions</p>
                  <p className="text-2xl font-bold text-[#8B1538]">{stats.openPositions}</p>
                </div>
                <div className="p-3 bg-[#8B1538] bg-opacity-10 rounded-full">
                  <Briefcase className="h-6 w-6 text-[#8B1538]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Interview</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.inInterview}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hired</p>
                  <p className="text-2xl font-bold text-green-600">{stats.hired}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {viewMode === 'postings' && (
          <div className="space-y-4">
            {positions.map((position) => (
              <Card key={position.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{position.jobTitle}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {position.department?.name} • {position.positions} position(s)
                          </p>
                        </div>
                        {getStatusBadge(position.status)}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="mr-2 h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="mr-2 h-4 w-4" />
                          ₦{position.salaryRangeMin.toLocaleString()} - ₦{position.salaryRangeMax.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="mr-2 h-4 w-4" />
                          {position.employmentType}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Description</h4>
                          <p className="text-sm text-gray-600">{position.jobDescription}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Requirements</h4>
                          <p className="text-sm text-gray-600">{position.requirements}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Closing: {new Date(position.closingDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(position)}>Edit</Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClose(position.id)}
                            disabled={position.status === 'closed'}
                          >
                            Close
                          </Button>
                          <Button size="sm" onClick={() => handleViewApplications(position.id)}>
                            View Applications
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'applications' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Job Applications
                  {selectedPositionForApps && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      for {positions.find(p => p.id === selectedPositionForApps)?.jobTitle}
                    </span>
                  )}
                </CardTitle>
                {selectedPositionForApps && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/hr/recruitment?mode=applications')}
                  >
                    Show All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((app) => {
                      const position = positions.find(p => p.id === app.recruitmentId);
                      return (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                            <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{position?.jobTitle}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {app.rating ? `${app.rating}/5` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button size="sm" variant="outline" onClick={() => handleReview(app)}>
                              Review
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Post/Edit Job Modal */}
        {isPostJobOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedPosition ? 'Edit Job Posting' : 'Post New Job'}</CardTitle>
                  <Button onClick={handleCancel} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        placeholder="e.g. Operations Manager"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                      <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Positions*</label>
                      <input
                        type="number"
                        value={formData.positions}
                        onChange={(e) => setFormData({ ...formData, positions: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type*</label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Closing Date*</label>
                      <input
                        type="date"
                        value={formData.closingDate}
                        onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="e.g. Lagos, Multiple Locations"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (₦)*</label>
                      <input
                        type="number"
                        value={formData.salaryRangeMin}
                        onChange={(e) => setFormData({ ...formData, salaryRangeMin: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        min="0"
                        placeholder="100000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (₦)*</label>
                      <input
                        type="number"
                        value={formData.salaryRangeMax}
                        onChange={(e) => setFormData({ ...formData, salaryRangeMax: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                        required
                        min="0"
                        placeholder="150000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="Describe the job responsibilities..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements*</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
                      required
                      placeholder="List the requirements and qualifications..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedPosition ? 'Update Job' : 'Post Job'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review Application Modal */}
        {isReviewModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Review Application</CardTitle>
                  <Button
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      setSelectedApplication(undefined);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Applicant Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Applicant Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{selectedApplication.applicantName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedApplication.applicantEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedApplication.applicantPhone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Applied Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Position</label>
                        <p className="text-sm text-gray-900">
                          {positions.find(p => p.id === selectedApplication.recruitmentId)?.jobTitle}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Current Status</label>
                        <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleUpdateApplicationStatus(selectedApplication.status, star)}
                          className={`text-2xl ${
                            (selectedApplication.rating || 0) >= star ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interview Notes */}
                  {selectedApplication.interviewNotes && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Interview Notes</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedApplication.interviewNotes}
                      </p>
                    </div>
                  )}

                  {/* Interview Date */}
                  {selectedApplication.interviewDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Interview Date</label>
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(selectedApplication.interviewDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Update Application Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleUpdateApplicationStatus('screening')}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Move to Screening
                      </Button>
                      <Button
                        onClick={() => handleUpdateApplicationStatus('interview')}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Schedule Interview
                      </Button>
                      <Button
                        onClick={() => handleUpdateApplicationStatus('offered')}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Make Offer
                      </Button>
                      <Button
                        onClick={() => handleUpdateApplicationStatus('hired')}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Mark as Hired
                      </Button>
                      <Button
                        onClick={() => handleUpdateApplicationStatus('rejected')}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
