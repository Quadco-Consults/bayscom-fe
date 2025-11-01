import { apiClient } from './client';

// Operations API - matches your backend /api/v1/operations/
export const operationsAPI = {
  // Haulage Operations
  haulage: {
    // Get all haulage operations
    getAll: async () => {
      const response = await apiClient.get('/operations/haulage/');
      return response.data;
    },

    // Get single haulage operation
    getById: async (id: number) => {
      const response = await apiClient.get(`/operations/haulage/${id}/`);
      return response.data;
    },

    // Create haulage operation
    create: async (data: any) => {
      const response = await apiClient.post('/operations/haulage/', data);
      return response.data;
    },

    // Update haulage operation
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/operations/haulage/${id}/`, data);
      return response.data;
    },

    // Delete haulage operation
    delete: async (id: number) => {
      const response = await apiClient.delete(`/operations/haulage/${id}/`);
      return response.data;
    },

    // Complete haulage operation
    complete: async (id: number) => {
      const response = await apiClient.post(`/operations/haulage/${id}/complete/`);
      return response.data;
    },

    // Cancel haulage operation
    cancel: async (id: number, reason: string) => {
      const response = await apiClient.post(`/operations/haulage/${id}/cancel/`, { reason });
      return response.data;
    },
  },

  // Asset Tracker
  assetTracker: {
    // Get all asset tracking records
    getAll: async () => {
      const response = await apiClient.get('/operations/asset-tracker/');
      return response.data;
    },

    // Get single asset tracking record
    getById: async (id: number) => {
      const response = await apiClient.get(`/operations/asset-tracker/${id}/`);
      return response.data;
    },

    // Create asset tracking record
    create: async (data: any) => {
      const response = await apiClient.post('/operations/asset-tracker/', data);
      return response.data;
    },

    // Update asset tracking record
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/operations/asset-tracker/${id}/`, data);
      return response.data;
    },

    // Delete asset tracking record
    delete: async (id: number) => {
      const response = await apiClient.delete(`/operations/asset-tracker/${id}/`);
      return response.data;
    },

    // Get tracking by asset ID
    getByAssetId: async (assetId: number) => {
      const response = await apiClient.get(`/operations/asset-tracker/?asset_id=${assetId}`);
      return response.data;
    },

    // Get current location of asset
    getCurrentLocation: async (assetId: number) => {
      const response = await apiClient.get(`/operations/asset-tracker/current/?asset_id=${assetId}`);
      return response.data;
    },
  },
};