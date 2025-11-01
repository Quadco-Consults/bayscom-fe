// Central API exports - all your backend modules
import { apiClient } from './client';
import { authAPI } from './auth';
import { procurementAPI } from './procurement';
import { configAPI } from './config';
import { adminAPI } from './admin';
import { operationsAPI } from './operations';
import { usersAPI } from './users';
import { supportAPI } from './support';
import { notificationsAPI } from './notifications';
import { activitiesAPI } from './activities';

// Re-export everything
export { apiClient, authAPI, procurementAPI, configAPI, adminAPI, operationsAPI, usersAPI, supportAPI, notificationsAPI, activitiesAPI };

// Re-export types
export type { LoginCredentials, LoginResponse, RegisterData } from './auth';
export type { PurchaseRequest, PurchaseOrder, Vendor } from './procurement';

// API instance for direct use
export { apiClient as api };

// All APIs in one object for convenience
export const API = {
  auth: authAPI,
  procurement: procurementAPI,
  config: configAPI,
  admin: adminAPI,
  operations: operationsAPI,
  users: usersAPI,
  support: supportAPI,
  notifications: notificationsAPI,
  activities: activitiesAPI,
} as const;

// API helpers
export const APIHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => authAPI.isAuthenticated(),

  // Get current access token
  getToken: () => authAPI.getAccessToken(),

  // Logout and clear tokens
  logout: () => authAPI.logout(),

  // Build query params for GET requests
  buildQuery: (params: Record<string, any>) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        query.append(key, String(params[key]));
      }
    });
    return query.toString();
  },

  // Handle API errors consistently
  handleError: (error: any) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
};