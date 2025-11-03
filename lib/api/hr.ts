import { apiClient } from './client';
import type {
  Employee,
  Attendance,
  Leave,
  LeaveBalance,
  Overtime,
  PerformanceReview,
  Recruitment,
  JobApplication,
  Training,
  TrainingParticipant
} from '@/lib/types';

// HR API endpoints
export const hrAPI = {
  // Employee Management
  employees: {
    getAll: async () => {
      const response = await apiClient.get<Employee[]>('/hr/employees/');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Employee>(`/hr/employees/${id}/`);
      return response.data;
    },
    create: async (data: Partial<Employee>) => {
      const response = await apiClient.post<Employee>('/hr/employees/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Employee>) => {
      const response = await apiClient.patch<Employee>(`/hr/employees/${id}/`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/hr/employees/${id}/`);
      return response.data;
    },
  },

  // Attendance Management
  attendance: {
    getAll: async (params?: { date?: string; employeeId?: string }) => {
      const response = await apiClient.get<Attendance[]>('/hr/attendance/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Attendance>(`/hr/attendance/${id}/`);
      return response.data;
    },
    checkIn: async (data: { employeeId: string; location?: string }) => {
      const response = await apiClient.post<Attendance>('/hr/attendance/check-in/', data);
      return response.data;
    },
    checkOut: async (id: string) => {
      const response = await apiClient.post<Attendance>(`/hr/attendance/${id}/check-out/`);
      return response.data;
    },
    update: async (id: string, data: Partial<Attendance>) => {
      const response = await apiClient.patch<Attendance>(`/hr/attendance/${id}/`, data);
      return response.data;
    },
    getReport: async (params: { startDate: string; endDate: string; employeeId?: string }) => {
      const response = await apiClient.get('/hr/attendance/report/', { params });
      return response.data;
    },
  },

  // Leave Management
  leave: {
    getAll: async (params?: { status?: string; employeeId?: string }) => {
      const response = await apiClient.get<Leave[]>('/hr/leave/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Leave>(`/hr/leave/${id}/`);
      return response.data;
    },
    create: async (data: Partial<Leave>) => {
      const response = await apiClient.post<Leave>('/hr/leave/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Leave>) => {
      const response = await apiClient.patch<Leave>(`/hr/leave/${id}/`, data);
      return response.data;
    },
    approve: async (id: string, notes?: string) => {
      const response = await apiClient.post<Leave>(`/hr/leave/${id}/approve/`, { notes });
      return response.data;
    },
    reject: async (id: string, reason: string) => {
      const response = await apiClient.post<Leave>(`/hr/leave/${id}/reject/`, { reason });
      return response.data;
    },
    cancel: async (id: string) => {
      const response = await apiClient.post<Leave>(`/hr/leave/${id}/cancel/`);
      return response.data;
    },
    getBalance: async (employeeId: string) => {
      const response = await apiClient.get<LeaveBalance[]>(`/hr/leave/balance/${employeeId}/`);
      return response.data;
    },
  },

  // Overtime Management
  overtime: {
    getAll: async (params?: { status?: string; employeeId?: string }) => {
      const response = await apiClient.get<Overtime[]>('/hr/overtime/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Overtime>(`/hr/overtime/${id}/`);
      return response.data;
    },
    create: async (data: Partial<Overtime>) => {
      const response = await apiClient.post<Overtime>('/hr/overtime/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Overtime>) => {
      const response = await apiClient.patch<Overtime>(`/hr/overtime/${id}/`, data);
      return response.data;
    },
    approve: async (id: string) => {
      const response = await apiClient.post<Overtime>(`/hr/overtime/${id}/approve/`);
      return response.data;
    },
    reject: async (id: string, reason: string) => {
      const response = await apiClient.post<Overtime>(`/hr/overtime/${id}/reject/`, { reason });
      return response.data;
    },
  },

  // Performance Management
  performance: {
    getAll: async (params?: { employeeId?: string }) => {
      const response = await apiClient.get<PerformanceReview[]>('/hr/performance/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<PerformanceReview>(`/hr/performance/${id}/`);
      return response.data;
    },
    create: async (data: Partial<PerformanceReview>) => {
      const response = await apiClient.post<PerformanceReview>('/hr/performance/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<PerformanceReview>) => {
      const response = await apiClient.patch<PerformanceReview>(`/hr/performance/${id}/`, data);
      return response.data;
    },
    submit: async (id: string) => {
      const response = await apiClient.post<PerformanceReview>(`/hr/performance/${id}/submit/`);
      return response.data;
    },
    acknowledge: async (id: string, comments?: string) => {
      const response = await apiClient.post<PerformanceReview>(`/hr/performance/${id}/acknowledge/`, { comments });
      return response.data;
    },
  },

  // Recruitment Management
  recruitment: {
    getAll: async (params?: { status?: string }) => {
      const response = await apiClient.get<Recruitment[]>('/hr/recruitment/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Recruitment>(`/hr/recruitment/${id}/`);
      return response.data;
    },
    create: async (data: Partial<Recruitment>) => {
      const response = await apiClient.post<Recruitment>('/hr/recruitment/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Recruitment>) => {
      const response = await apiClient.patch<Recruitment>(`/hr/recruitment/${id}/`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/hr/recruitment/${id}/`);
      return response.data;
    },
    publish: async (id: string) => {
      const response = await apiClient.post<Recruitment>(`/hr/recruitment/${id}/publish/`);
      return response.data;
    },
    close: async (id: string) => {
      const response = await apiClient.post<Recruitment>(`/hr/recruitment/${id}/close/`);
      return response.data;
    },
  },

  // Job Applications
  applications: {
    getAll: async (params?: { recruitmentId?: string; status?: string }) => {
      const response = await apiClient.get<JobApplication[]>('/hr/applications/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<JobApplication>(`/hr/applications/${id}/`);
      return response.data;
    },
    create: async (data: Partial<JobApplication>) => {
      const response = await apiClient.post<JobApplication>('/hr/applications/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<JobApplication>) => {
      const response = await apiClient.patch<JobApplication>(`/hr/applications/${id}/`, data);
      return response.data;
    },
    updateStatus: async (id: string, status: string, notes?: string) => {
      const response = await apiClient.post<JobApplication>(`/hr/applications/${id}/status/`, { status, notes });
      return response.data;
    },
  },

  // Training Management
  training: {
    getAll: async (params?: { status?: string }) => {
      const response = await apiClient.get<Training[]>('/hr/training/', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get<Training>(`/hr/training/${id}/`);
      return response.data;
    },
    create: async (data: Partial<Training>) => {
      const response = await apiClient.post<Training>('/hr/training/', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Training>) => {
      const response = await apiClient.patch<Training>(`/hr/training/${id}/`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/hr/training/${id}/`);
      return response.data;
    },
    addParticipant: async (trainingId: string, employeeId: string) => {
      const response = await apiClient.post<TrainingParticipant>(`/hr/training/${trainingId}/participants/`, { employeeId });
      return response.data;
    },
    removeParticipant: async (trainingId: string, participantId: string) => {
      const response = await apiClient.delete(`/hr/training/${trainingId}/participants/${participantId}/`);
      return response.data;
    },
    updateParticipant: async (trainingId: string, participantId: string, data: Partial<TrainingParticipant>) => {
      const response = await apiClient.patch<TrainingParticipant>(`/hr/training/${trainingId}/participants/${participantId}/`, data);
      return response.data;
    },
  },
};
