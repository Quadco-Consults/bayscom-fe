import { apiClient } from './client';

// Configuration API - matches your backend /api/v1/config/
export const configAPI = {
  // Departments
  departments: {
    // Get all departments
    getAll: async () => {
      const response = await apiClient.get('/config/departments/');
      return response.data;
    },

    // Get single department
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/departments/${id}/`);
      return response.data;
    },

    // Create department
    create: async (data: any) => {
      const response = await apiClient.post('/config/departments/', data);
      return response.data;
    },

    // Update department
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/departments/${id}/`, data);
      return response.data;
    },

    // Delete department
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/departments/${id}/`);
      return response.data;
    },
  },

  // Items
  items: {
    // Get all items
    getAll: async () => {
      const response = await apiClient.get('/config/items/');
      return response.data;
    },

    // Get single item
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/items/${id}/`);
      return response.data;
    },

    // Create item
    create: async (data: any) => {
      const response = await apiClient.post('/config/items/', data);
      return response.data;
    },

    // Update item
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/items/${id}/`, data);
      return response.data;
    },

    // Delete item
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/items/${id}/`);
      return response.data;
    },
  },

  // Categories
  categories: {
    // Get all categories
    getAll: async () => {
      const response = await apiClient.get('/config/category/');
      return response.data;
    },

    // Get single category
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/category/${id}/`);
      return response.data;
    },

    // Create category
    create: async (data: any) => {
      const response = await apiClient.post('/config/category/', data);
      return response.data;
    },

    // Update category
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/category/${id}/`, data);
      return response.data;
    },

    // Delete category
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/category/${id}/`);
      return response.data;
    },
  },

  // Subcategories
  subcategories: {
    // Get all subcategories
    getAll: async () => {
      const response = await apiClient.get('/config/subcategory/');
      return response.data;
    },

    // Get single subcategory
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/subcategory/${id}/`);
      return response.data;
    },

    // Create subcategory
    create: async (data: any) => {
      const response = await apiClient.post('/config/subcategory/', data);
      return response.data;
    },

    // Update subcategory
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/subcategory/${id}/`, data);
      return response.data;
    },

    // Delete subcategory
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/subcategory/${id}/`);
      return response.data;
    },
  },

  // Financial Years
  financialYears: {
    // Get all financial years
    getAll: async () => {
      const response = await apiClient.get('/config/financial-year/');
      return response.data;
    },

    // Get single financial year
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/financial-year/${id}/`);
      return response.data;
    },

    // Create financial year
    create: async (data: any) => {
      const response = await apiClient.post('/config/financial-year/', data);
      return response.data;
    },

    // Update financial year
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/financial-year/${id}/`, data);
      return response.data;
    },

    // Delete financial year
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/financial-year/${id}/`);
      return response.data;
    },
  },

  // Positions
  positions: {
    // Get all positions
    getAll: async () => {
      const response = await apiClient.get('/config/positions/');
      return response.data;
    },

    // Get single position
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/positions/${id}/`);
      return response.data;
    },

    // Create position
    create: async (data: any) => {
      const response = await apiClient.post('/config/positions/', data);
      return response.data;
    },

    // Update position
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/positions/${id}/`, data);
      return response.data;
    },

    // Delete position
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/positions/${id}/`);
      return response.data;
    },
  },

  // Haulage Rates
  haulageRates: {
    // Get all haulage rates
    getAll: async () => {
      const response = await apiClient.get('/config/haulage-rate/');
      return response.data;
    },

    // Get single haulage rate
    getById: async (id: number) => {
      const response = await apiClient.get(`/config/haulage-rate/${id}/`);
      return response.data;
    },

    // Create haulage rate
    create: async (data: any) => {
      const response = await apiClient.post('/config/haulage-rate/', data);
      return response.data;
    },

    // Update haulage rate
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/config/haulage-rate/${id}/`, data);
      return response.data;
    },

    // Delete haulage rate
    delete: async (id: number) => {
      const response = await apiClient.delete(`/config/haulage-rate/${id}/`);
      return response.data;
    },
  },
};