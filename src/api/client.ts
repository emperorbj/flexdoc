// src/api/client.ts

/**
 * WHY THIS FILE?
 * - Single axios instance for all API calls
 * - Automatically adds JWT token to requests
 * - Handles errors in one place
 * - Easy to add logging, retries, etc.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import { ApiError } from '../../types/api';

/**
 * Create axios instance with base configuration
 * This instance will be used for ALL API calls
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,           // Your FastAPI backend URL
  timeout: API_CONFIG.TIMEOUT,            // 30 seconds
  headers: {
    'Content-Type': 'application/json',   // Default to JSON
  },
});

/**
 * REQUEST INTERCEPTOR
 * 
 * WHY?
 * Runs BEFORE every request is sent
 * We use it to automatically add the JWT token to headers
 * 
 * HOW IT WORKS:
 * 1. Get token from secure storage
 * 2. If token exists, add it to Authorization header
 * 3. Send the request
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from secure storage
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      
      // If token exists, add it to headers
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log in development (helpful for debugging)
      if (__DEV__) {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
          console.log('📦 Request data:', config.data);
        }
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * WHY?
 * Runs AFTER every response is received
 * We use it to handle errors in one place
 * 
 * HOW IT WORKS:
 * 1. If response is successful (2xx), just return it
 * 2. If response is error (4xx, 5xx), format error and reject
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (__DEV__) {
      console.log(`✅ ${response.config.url}`, response.status);
    }
    
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Log errors in development
    if (__DEV__) {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
    }
    
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      
      /**
       * 401 Unauthorized - Token expired or invalid
       * Clear token and user data, user will be logged out
       */
      if (status === 401) {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        
        // You might want to navigate to login here
        // We'll handle this in the auth store later
      }
      
      /**
       * 404 Not Found - Resource doesn't exist
       */
      if (status === 404) {
        console.log('Resource not found');
      }
      
      /**
       * 500 Internal Server Error - Backend issue
       */
      if (status === 500) {
        console.error('Server error - please try again later');
      }
    } else if (error.request) {
      /**
       * Request was made but no response received
       * Usually means network error or backend is down
       */
      console.error('Network error - check your connection');
    }
    
    // Reject with formatted error
    return Promise.reject(formatError(error));
  }
);

/**
 * Format error for consistent error handling
 * Extracts meaningful error message from various error formats
 */
const formatError = (error: AxiosError<ApiError>): ApiError => {
  if (error.response?.data?.detail) {
    // FastAPI returns errors in "detail" field
    return {
      detail: error.response.data.detail,
      status_code: error.response.status,
    };
  }
  
  if (error.message) {
    // Generic axios errors
    return {
      detail: error.message,
      status_code: error.response?.status,
    };
  }
  
  // Fallback error
  return {
    detail: 'An unexpected error occurred',
    status_code: error.response?.status,
  };
};

/**
 * Export the configured client
 * All other API files will import and use this
 */
export default apiClient;

/**
 * Export a helper to create FormData for file uploads
 * 
 * WHY?
 * File uploads need multipart/form-data, not JSON
 * This helper makes it easy to create properly formatted FormData
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.keys(data).forEach((key) => {
    const value = data[key];
    
    // Handle different types of values
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  
  return formData;
};

/**
 * Helper to check if error is a specific type
 */
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.detail === 'string';
};