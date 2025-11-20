// src/api/auth.ts

/**
 * WHY THIS FILE?
 * - All authentication-related API calls in one place
 * - Type-safe requests and responses
 * - Easy to test and maintain
 */

import apiClient from './client';
import { API_CONFIG } from '../constants/config';
import { 
  SignupRequest, 
  LoginRequest, 
  LoginResponse,
  User 
} from '../../types/api';

/**
 * Sign up a new user
 * 
 * ENDPOINT: POST /api/signup
 * BACKEND: signup_root.post("/api/signup")
 * 
 * @param data - User registration data
 * @returns User object (without token)
 */
export const signup = async (data: SignupRequest): Promise<User> => {
  try {
    // Make POST request to signup endpoint
    const response = await apiClient.post<User>(
      API_CONFIG.ENDPOINTS.SIGNUP,
      data
    );
    
    // Return the user data
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;  // Re-throw so caller can handle it
  }
};

/**
 * Log in an existing user
 * 
 * ENDPOINT: POST /api/login
 * BACKEND: signup_root.post("/api/login")
 * 
 * @param data - Login credentials
 * @returns User object and JWT token
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // Make POST request to login endpoint
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      data
    );
    
    // Return both user and token
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Log out user (client-side only)
 * Your backend doesn't have a logout endpoint
 * We just clear local token
 */
export const logout = async (): Promise<void> => {
  // Token will be cleared by the auth store
  // This is just a placeholder for future server-side logout if needed
};