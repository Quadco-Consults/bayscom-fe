import { apiClient } from './client';

// Activity Tracker API - matches your backend /api/v1/activities/
export const activitiesAPI = {
  // Activity Logs
  activities: {
    // Get all activity logs
    getAll: async () => {
      const response = await apiClient.get('/activities/');
      return response.data;
    },

    // Get single activity log
    getById: async (id: number) => {
      const response = await apiClient.get(`/activities/${id}/`);
      return response.data;
    },

    // Create activity log (usually done automatically by backend)
    create: async (data: any) => {
      const response = await apiClient.post('/activities/', data);
      return response.data;
    },

    // Get activities by user
    getByUser: async (userId: number) => {
      const response = await apiClient.get(`/activities/?user_id=${userId}`);
      return response.data;
    },

    // Get activities by action type
    getByAction: async (action: string) => {
      const response = await apiClient.get(`/activities/?action=${action}`);
      return response.data;
    },

    // Get activities by model
    getByModel: async (model: string) => {
      const response = await apiClient.get(`/activities/?model=${model}`);
      return response.data;
    },

    // Get activities by date range
    getByDateRange: async (startDate: string, endDate: string) => {
      const response = await apiClient.get(`/activities/?start_date=${startDate}&end_date=${endDate}`);
      return response.data;
    },

    // Get my activities (current user)
    getMy: async () => {
      const response = await apiClient.get('/activities/my/');
      return response.data;
    },

    // Get recent activities
    getRecent: async (limit: number = 10) => {
      const response = await apiClient.get(`/activities/recent/?limit=${limit}`);
      return response.data;
    },

    // Get activities for specific object
    getForObject: async (contentType: string, objectId: number) => {
      const response = await apiClient.get(`/activities/?content_type=${contentType}&object_id=${objectId}`);
      return response.data;
    },
  },
};