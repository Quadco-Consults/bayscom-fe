import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
}

export const authAPI = {
  // Login user - matches your backend exactly
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login/', credentials);

    // Store tokens in localStorage after successful login
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh);
    }

    return response.data;
  },

  // Password reset - request OTP
  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('/auth/password/reset/', { email });
    return response.data;
  },

  // Password reset - confirm with OTP
  confirmPasswordReset: async (token: string, new_password: string) => {
    const response = await apiClient.post('/auth/password/reset/confirm/', {
      token,
      new_password,
    });
    return response.data;
  },

  // Password change - request OTP for current user
  requestPasswordChange: async () => {
    const response = await apiClient.post('/auth/password/change/');
    return response.data;
  },

  // Password change - confirm with OTP
  confirmPasswordChange: async (token: string, new_password: string) => {
    const response = await apiClient.post('/auth/password/change/confirm/', {
      token,
      new_password,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout/', {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      // Continue with logout even if server request fails
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Get stored access token
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  // Get stored refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },
};