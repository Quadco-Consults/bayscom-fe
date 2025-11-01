import { apiClient } from './client';

// Support API - matches your backend /api/v1/support/
export const supportAPI = {
  // Support Tickets
  tickets: {
    // Get all support tickets
    getAll: async () => {
      const response = await apiClient.get('/support/ticket/');
      return response.data;
    },

    // Get single support ticket
    getById: async (id: number) => {
      const response = await apiClient.get(`/support/ticket/${id}/`);
      return response.data;
    },

    // Create support ticket
    create: async (data: any) => {
      const response = await apiClient.post('/support/ticket/', data);
      return response.data;
    },

    // Update support ticket
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/support/ticket/${id}/`, data);
      return response.data;
    },

    // Delete support ticket
    delete: async (id: number) => {
      const response = await apiClient.delete(`/support/ticket/${id}/`);
      return response.data;
    },

    // Close support ticket
    close: async (id: number, resolution?: string) => {
      const response = await apiClient.post(`/support/ticket/${id}/close/`, { resolution });
      return response.data;
    },

    // Reopen support ticket
    reopen: async (id: number, reason?: string) => {
      const response = await apiClient.post(`/support/ticket/${id}/reopen/`, { reason });
      return response.data;
    },

    // Assign ticket to user
    assign: async (id: number, assigneeId: number) => {
      const response = await apiClient.post(`/support/ticket/${id}/assign/`, { assignee_id: assigneeId });
      return response.data;
    },

    // Add comment to ticket
    addComment: async (id: number, comment: string) => {
      const response = await apiClient.post(`/support/ticket/${id}/comment/`, { comment });
      return response.data;
    },

    // Get tickets by status
    getByStatus: async (status: string) => {
      const response = await apiClient.get(`/support/ticket/?status=${status}`);
      return response.data;
    },

    // Get tickets by priority
    getByPriority: async (priority: string) => {
      const response = await apiClient.get(`/support/ticket/?priority=${priority}`);
      return response.data;
    },

    // Get my tickets (current user)
    getMy: async () => {
      const response = await apiClient.get('/support/ticket/my/');
      return response.data;
    },

    // Get assigned tickets (current user)
    getAssigned: async () => {
      const response = await apiClient.get('/support/ticket/assigned/');
      return response.data;
    },
  },
};