import { apiClient } from './client';

// User Management API - matches your backend /api/v1/users/
export const usersAPI = {
  // Users
  users: {
    // Get all users
    getAll: async () => {
      const response = await apiClient.get('/users/');
      return response.data;
    },

    // Get single user
    getById: async (id: number) => {
      const response = await apiClient.get(`/users/${id}/`);
      return response.data;
    },

    // Create user
    create: async (data: any) => {
      const response = await apiClient.post('/users/', data);
      return response.data;
    },

    // Update user
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/users/${id}/`, data);
      return response.data;
    },

    // Delete user
    delete: async (id: number) => {
      const response = await apiClient.delete(`/users/${id}/`);
      return response.data;
    },

    // Activate user
    activate: async (id: number) => {
      const response = await apiClient.post(`/users/${id}/activate/`);
      return response.data;
    },

    // Deactivate user
    deactivate: async (id: number) => {
      const response = await apiClient.post(`/users/${id}/deactivate/`);
      return response.data;
    },

    // Reset user password
    resetPassword: async (id: number) => {
      const response = await apiClient.post(`/users/${id}/reset-password/`);
      return response.data;
    },
  },

  // Roles
  roles: {
    // Get all roles
    getAll: async () => {
      const response = await apiClient.get('/roles/');
      return response.data;
    },

    // Get single role
    getById: async (id: number) => {
      const response = await apiClient.get(`/roles/${id}/`);
      return response.data;
    },

    // Create role
    create: async (data: any) => {
      const response = await apiClient.post('/roles/', data);
      return response.data;
    },

    // Update role
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/roles/${id}/`, data);
      return response.data;
    },

    // Delete role
    delete: async (id: number) => {
      const response = await apiClient.delete(`/roles/${id}/`);
      return response.data;
    },

    // Assign role to user
    assignToUser: async (roleId: number, userId: number) => {
      const response = await apiClient.post(`/roles/${roleId}/assign/`, { user_id: userId });
      return response.data;
    },

    // Remove role from user
    removeFromUser: async (roleId: number, userId: number) => {
      const response = await apiClient.post(`/roles/${roleId}/remove/`, { user_id: userId });
      return response.data;
    },
  },

  // Permissions
  permissions: {
    // Get all permissions
    getAll: async () => {
      const response = await apiClient.get('/permissions/');
      return response.data;
    },

    // Get single permission
    getById: async (id: number) => {
      const response = await apiClient.get(`/permissions/${id}/`);
      return response.data;
    },

    // Create permission
    create: async (data: any) => {
      const response = await apiClient.post('/permissions/', data);
      return response.data;
    },

    // Update permission
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/permissions/${id}/`, data);
      return response.data;
    },

    // Delete permission
    delete: async (id: number) => {
      const response = await apiClient.delete(`/permissions/${id}/`);
      return response.data;
    },

    // Assign permission to role
    assignToRole: async (permissionId: number, roleId: number) => {
      const response = await apiClient.post(`/permissions/${permissionId}/assign-role/`, { role_id: roleId });
      return response.data;
    },

    // Remove permission from role
    removeFromRole: async (permissionId: number, roleId: number) => {
      const response = await apiClient.post(`/permissions/${permissionId}/remove-role/`, { role_id: roleId });
      return response.data;
    },
  },
};