import { apiClient } from './client';

// Admin API - matches your backend /api/v1/admins/
export const adminAPI = {
  // Inventory Management
  inventory: {
    // Asset Conditions
    assetConditions: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/asset-conditions/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/asset-conditions/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/asset-conditions/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/asset-conditions/${id}/`, data);
        return response.data;
      },
      delete: async (id: number) => {
        const response = await apiClient.delete(`/admins/inventory/asset-conditions/${id}/`);
        return response.data;
      },
    },

    // Asset Types
    assetTypes: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/asset-types/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/asset-types/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/asset-types/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/asset-types/${id}/`, data);
        return response.data;
      },
      delete: async (id: number) => {
        const response = await apiClient.delete(`/admins/inventory/asset-types/${id}/`);
        return response.data;
      },
    },

    // Asset Classifications
    assetClassifications: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/asset-classifications/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/asset-classifications/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/asset-classifications/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/asset-classifications/${id}/`, data);
        return response.data;
      },
      delete: async (id: number) => {
        const response = await apiClient.delete(`/admins/inventory/asset-classifications/${id}/`);
        return response.data;
      },
    },

    // Assets
    assets: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/assets/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/assets/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/assets/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/assets/${id}/`, data);
        return response.data;
      },
      delete: async (id: number) => {
        const response = await apiClient.delete(`/admins/inventory/assets/${id}/`);
        return response.data;
      },
    },

    // Asset History
    assetHistory: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/assets/history/');
        return response.data;
      },
      getByAssetId: async (assetId: number) => {
        const response = await apiClient.get(`/admins/inventory/assets/history/?asset_id=${assetId}`);
        return response.data;
      },
    },

    // Asset Requests
    assetRequests: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/assets/requests/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/assets/requests/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/assets/requests/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/assets/requests/${id}/`, data);
        return response.data;
      },
      approve: async (id: number) => {
        const response = await apiClient.post(`/admins/inventory/assets/requests/${id}/approve/`);
        return response.data;
      },
      reject: async (id: number, reason: string) => {
        const response = await apiClient.post(`/admins/inventory/assets/requests/${id}/reject/`, { reason });
        return response.data;
      },
    },

    // Item Requisitions
    itemRequisitions: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/item-requisitions/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/item-requisitions/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/item-requisitions/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/item-requisitions/${id}/`, data);
        return response.data;
      },
    },

    // Good Receive Notes (GRN)
    goodReceiveNotes: {
      getAll: async () => {
        const response = await apiClient.get('/admins/inventory/good-receive-notes/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/inventory/good-receive-notes/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/inventory/good-receive-notes/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/inventory/good-receive-notes/${id}/`, data);
        return response.data;
      },
    },
  },

  // Fleet Management
  fleets: {
    // Vehicle Requests
    vehicleRequests: {
      getAll: async () => {
        const response = await apiClient.get('/admins/fleets/vehicles/requests/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/fleets/vehicles/requests/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/fleets/vehicles/requests/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/fleets/vehicles/requests/${id}/`, data);
        return response.data;
      },
      approve: async (id: number) => {
        const response = await apiClient.post(`/admins/fleets/vehicles/requests/${id}/approve/`);
        return response.data;
      },
      reject: async (id: number, reason: string) => {
        const response = await apiClient.post(`/admins/fleets/vehicles/requests/${id}/reject/`, { reason });
        return response.data;
      },
    },

    // Vehicle Maintenance
    vehicleMaintenance: {
      getAll: async () => {
        const response = await apiClient.get('/admins/fleets/vehicles/maintenance/tickets/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/fleets/vehicles/maintenance/tickets/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/fleets/vehicles/maintenance/tickets/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/fleets/vehicles/maintenance/tickets/${id}/`, data);
        return response.data;
      },
    },

    // Fuel Consumption
    fuelConsumption: {
      getAll: async () => {
        const response = await apiClient.get('/admins/fleets/fuel-consumptions/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/fleets/fuel-consumptions/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/fleets/fuel-consumptions/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/fleets/fuel-consumptions/${id}/`, data);
        return response.data;
      },
    },
  },

  // Facility Management
  facilities: {
    // Facility Maintenance
    maintenance: {
      getAll: async () => {
        const response = await apiClient.get('/admins/facilities/maintenance/tickets/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/facilities/maintenance/tickets/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/facilities/maintenance/tickets/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/facilities/maintenance/tickets/${id}/`, data);
        return response.data;
      },
    },
  },

  // Payment Requests
  payments: {
    requests: {
      getAll: async () => {
        const response = await apiClient.get('/admins/payments/requests/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/payments/requests/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/payments/requests/', data);
        return response.data;
      },
      update: async (id: number, data: any) => {
        const response = await apiClient.patch(`/admins/payments/requests/${id}/`, data);
        return response.data;
      },
      approve: async (id: number) => {
        const response = await apiClient.post(`/admins/payments/requests/${id}/approve/`);
        return response.data;
      },
      reject: async (id: number, reason: string) => {
        const response = await apiClient.post(`/admins/payments/requests/${id}/reject/`, { reason });
        return response.data;
      },
    },
  },

  // Asset Maintenance
  assetMaintenance: {
    getAll: async () => {
      const response = await apiClient.get('/admins/assets/maintenance/');
      return response.data;
    },
    getById: async (id: number) => {
      const response = await apiClient.get(`/admins/assets/maintenance/${id}/`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await apiClient.post('/admins/assets/maintenance/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/admins/assets/maintenance/${id}/`, data);
      return response.data;
    },
  },

  // Authorization & Expenses
  authorization: {
    expenses: {
      getAll: async () => {
        const response = await apiClient.get('/admins/authorization/expenses/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/authorization/expenses/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/authorization/expenses/', data);
        return response.data;
      },
      approve: async (id: number) => {
        const response = await apiClient.post(`/admins/authorization/expenses/${id}/approve/`);
        return response.data;
      },
      reject: async (id: number, reason: string) => {
        const response = await apiClient.post(`/admins/authorization/expenses/${id}/reject/`, { reason });
        return response.data;
      },
    },
  },

  // Reports
  reports: {
    travelExpenses: {
      getAll: async () => {
        const response = await apiClient.get('/admins/reports/travel-expenses/');
        return response.data;
      },
      getById: async (id: number) => {
        const response = await apiClient.get(`/admins/reports/travel-expenses/${id}/`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await apiClient.post('/admins/reports/travel-expenses/', data);
        return response.data;
      },
    },
  },
};