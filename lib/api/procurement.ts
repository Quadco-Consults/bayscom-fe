import { apiClient } from './client';

export interface PurchaseRequest {
  id?: number;
  title: string;
  description: string;
  department: string;
  requested_by: number;
  status: 'pending' | 'approved' | 'rejected';
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseOrder {
  id?: number;
  purchase_request: number;
  vendor: number;
  order_number: string;
  status: 'pending' | 'shipped' | 'delivered';
  total_amount: number;
  delivery_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vendor {
  id?: number;
  name: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export const procurementAPI = {
  // Clients/Customers - matches your backend
  clients: {
    // Get all clients/customers
    getAll: async () => {
      const response = await apiClient.get('/procurement/client-customer/');
      return response.data;
    },

    // Get single client/customer
    getById: async (id: number) => {
      const response = await apiClient.get(`/procurement/client-customer/${id}/`);
      return response.data;
    },

    // Create client/customer
    create: async (data: any) => {
      const response = await apiClient.post('/procurement/client-customer/', data);
      return response.data;
    },

    // Update client/customer
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/procurement/client-customer/${id}/`, data);
      return response.data;
    },

    // Delete client/customer
    delete: async (id: number) => {
      const response = await apiClient.delete(`/procurement/client-customer/${id}/`);
      return response.data;
    },
  },

  // Purchase Request Memos - matches your backend
  purchaseRequestMemos: {
    // Get all purchase request memos
    getAll: async () => {
      const response = await apiClient.get('/procurement/purchase-request-memo/');
      return response.data;
    },

    // Get single memo
    getById: async (id: number) => {
      const response = await apiClient.get(`/procurement/purchase-request-memo/${id}/`);
      return response.data;
    },

    // Create memo
    create: async (data: any) => {
      const response = await apiClient.post('/procurement/purchase-request-memo/', data);
      return response.data;
    },

    // Update memo
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/procurement/purchase-request-memo/${id}/`, data);
      return response.data;
    },

    // Delete memo
    delete: async (id: number) => {
      const response = await apiClient.delete(`/procurement/purchase-request-memo/${id}/`);
      return response.data;
    },
  },

  // Purchase Requests
  purchaseRequests: {
    // Get all purchase requests
    getAll: async () => {
      const response = await apiClient.get('/procurement/purchase-request/');
      return response.data;
    },

    // Get single purchase request
    getById: async (id: number) => {
      const response = await apiClient.get(`/procurement/purchase-request/${id}/`);
      return response.data;
    },

    // Create purchase request
    create: async (data: PurchaseRequest) => {
      const response = await apiClient.post('/procurement/purchase-request/', data);
      return response.data;
    },

    // Update purchase request
    update: async (id: number, data: Partial<PurchaseRequest>) => {
      const response = await apiClient.patch(`/procurement/purchase-request/${id}/`, data);
      return response.data;
    },

    // Delete purchase request
    delete: async (id: number) => {
      const response = await apiClient.delete(`/procurement/purchase-request/${id}/`);
      return response.data;
    },

    // Approve purchase request
    approve: async (id: number) => {
      const response = await apiClient.post(`/procurement/purchase-request/${id}/approve/`);
      return response.data;
    },

    // Reject purchase request
    reject: async (id: number, reason: string) => {
      const response = await apiClient.post(`/procurement/purchase-request/${id}/reject/`, {
        reason,
      });
      return response.data;
    },
  },

  // Purchase Orders
  purchaseOrders: {
    // Get all purchase orders
    getAll: async () => {
      const response = await apiClient.get('/procurement/purchase-order/');
      return response.data;
    },

    // Get single purchase order
    getById: async (id: number) => {
      const response = await apiClient.get(`/procurement/purchase-order/${id}/`);
      return response.data;
    },

    // Create purchase order
    create: async (data: PurchaseOrder) => {
      const response = await apiClient.post('/procurement/purchase-order/', data);
      return response.data;
    },

    // Update purchase order
    update: async (id: number, data: Partial<PurchaseOrder>) => {
      const response = await apiClient.patch(`/procurement/purchase-order/${id}/`, data);
      return response.data;
    },

    // Delete purchase order
    delete: async (id: number) => {
      const response = await apiClient.delete(`/procurement/purchase-order/${id}/`);
      return response.data;
    },

    // Mark as shipped
    markShipped: async (id: number) => {
      const response = await apiClient.post(`/procurement/purchase-order/${id}/mark-shipped/`);
      return response.data;
    },

    // Mark as delivered
    markDelivered: async (id: number) => {
      const response = await apiClient.post(`/procurement/purchase-order/${id}/mark-delivered/`);
      return response.data;
    },
  },

  // Vendors
  vendors: {
    // Get all vendors
    getAll: async () => {
      const response = await apiClient.get('/procurement/vendor/');
      return response.data;
    },

    // Get single vendor
    getById: async (id: number) => {
      const response = await apiClient.get(`/procurement/vendor/${id}/`);
      return response.data;
    },

    // Create vendor
    create: async (data: Vendor) => {
      const response = await apiClient.post('/procurement/vendor/', data);
      return response.data;
    },

    // Update vendor
    update: async (id: number, data: Partial<Vendor>) => {
      const response = await apiClient.patch(`/procurement/vendor/${id}/`, data);
      return response.data;
    },

    // Delete vendor
    delete: async (id: number) => {
      const response = await apiClient.delete(`/procurement/vendor/${id}/`);
      return response.data;
    },

    // Activate vendor
    activate: async (id: number) => {
      const response = await apiClient.post(`/procurement/vendor/${id}/activate/`);
      return response.data;
    },

    // Deactivate vendor
    deactivate: async (id: number) => {
      const response = await apiClient.post(`/procurement/vendor/${id}/deactivate/`);
      return response.data;
    },
  },

  // Request for Quotations (RFQs) - matches your backend
  rfqs: {
    // Get all RFQs
    getAll: async () => {
      const response = await apiClient.get('/procurement/request-for-quotation/');
      return response.data;
    },

    // Get single RFQ
    getById: async (id: number) => {
      const response = await apiClient.get(`/procurement/request-for-quotation/${id}/`);
      return response.data;
    },

    // Create RFQ
    create: async (data: any) => {
      const response = await apiClient.post('/procurement/request-for-quotation/', data);
      return response.data;
    },

    // Update RFQ
    update: async (id: number, data: any) => {
      const response = await apiClient.patch(`/procurement/request-for-quotation/${id}/`, data);
      return response.data;
    },

    // Delete RFQ
    delete: async (id: number) => {
      const response = await apiClient.delete(`/procurement/request-for-quotation/${id}/`);
      return response.data;
    },
  },
};