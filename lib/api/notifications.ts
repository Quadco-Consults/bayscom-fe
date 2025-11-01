import { apiClient } from './client';

// Notifications API - matches your backend /api/v1/notifications/
export const notificationsAPI = {
  // Notifications
  notifications: {
    // Get all notifications for current user
    getAll: async () => {
      const response = await apiClient.get('/notifications/');
      return response.data;
    },

    // Get single notification
    getById: async (id: number) => {
      const response = await apiClient.get(`/notifications/${id}/`);
      return response.data;
    },

    // Create notification
    create: async (data: any) => {
      const response = await apiClient.post('/notifications/', data);
      return response.data;
    },

    // Mark notification as read
    markAsRead: async (id: number) => {
      const response = await apiClient.patch(`/notifications/${id}/`, { is_read: true });
      return response.data;
    },

    // Mark notification as unread
    markAsUnread: async (id: number) => {
      const response = await apiClient.patch(`/notifications/${id}/`, { is_read: false });
      return response.data;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
      const response = await apiClient.post('/notifications/mark-all-read/');
      return response.data;
    },

    // Delete notification
    delete: async (id: number) => {
      const response = await apiClient.delete(`/notifications/${id}/`);
      return response.data;
    },

    // Get unread notifications count
    getUnreadCount: async () => {
      const response = await apiClient.get('/notifications/unread-count/');
      return response.data;
    },

    // Get unread notifications
    getUnread: async () => {
      const response = await apiClient.get('/notifications/?is_read=false');
      return response.data;
    },

    // Get notifications by type
    getByType: async (type: string) => {
      const response = await apiClient.get(`/notifications/?type=${type}`);
      return response.data;
    },

    // Delete all read notifications
    deleteAllRead: async () => {
      const response = await apiClient.delete('/notifications/delete-read/');
      return response.data;
    },
  },
};