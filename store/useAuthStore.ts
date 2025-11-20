// src/store/useAuthStore.ts

/**
 * WHY THIS FILE?
 * - Global authentication state (user, token, login status)
 * - Any component can access user data
 * - Login/logout functions available everywhere
 * - Persists user data across app restarts
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, LoginRequest, SignupRequest } from '../types/api';
import { STORAGE_KEYS } from '../src/constants/config';
import * as authApi from '../src/api/auth';

/**
 * Auth Store State Interface
 * Defines what data the store holds
 */
interface AuthState {
  // State
  user: User | null;              // Current logged-in user (null if not logged in)
  token: string | null;           // JWT token (null if not logged in)
  isAuthenticated: boolean;       // Quick check: is user logged in?
  isLoading: boolean;             // Is an auth operation in progress?
  error: string | null;           // Error message (if any)
  
  // Actions (functions to modify state)
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * Create the auth store
 * 
 * HOW ZUSTAND WORKS:
 * - create() creates a hook
 * - First parameter is a function that receives "set" and "get"
 * - "set" updates the state
 * - "get" reads current state
 * - Returns a hook: useAuthStore()
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // ============================================
  // INITIAL STATE
  // ============================================
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // ============================================
  // ACTIONS
  // ============================================
  
  /**
   * LOGIN
   * 
   * FLOW:
   * 1. Set loading to true
   * 2. Call backend login API
   * 3. Save token to SecureStore
   * 4. Save user to SecureStore (optional, for offline access)
   * 5. Update state with user and token
   * 6. Set isAuthenticated to true
   */
  login: async (credentials: LoginRequest) => {
    try {
      // Set loading state
      set({ isLoading: true, error: null });
      
      // Call backend API
      const response = await authApi.login(credentials);
      
      // Save token securely
      await SecureStore.setItemAsync(
        STORAGE_KEYS.AUTH_TOKEN, 
        response.token
      );
      
      // Save user data (as JSON string)
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );
      
      // Update state
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log('✅ Login successful');
    } catch (error: any) {
      // Handle error
      const errorMessage = error?.detail || 'Login failed. Please try again.';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      console.error('❌ Login error:', errorMessage);
      throw error;  // Re-throw so UI can show error
    }
  },
  
  /**
   * SIGNUP
   * 
   * FLOW:
   * 1. Set loading to true
   * 2. Call backend signup API
   * 3. After signup, automatically login
   *    (Your backend returns user but not token on signup)
   */
  signup: async (userData: SignupRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      // Call backend signup API
      await authApi.signup(userData);
      
      // After successful signup, login automatically
      await get().login({
        email: userData.email,
        password: userData.password,
      });
      
      console.log('✅ Signup successful');
    } catch (error: any) {
      const errorMessage = error?.detail || 'Signup failed. Please try again.';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      console.error('❌ Signup error:', errorMessage);
      throw error;
    }
  },
  
  /**
   * LOGOUT
   * 
   * FLOW:
   * 1. Clear token from SecureStore
   * 2. Clear user data from SecureStore
   * 3. Reset state to initial values
   */
  logout: async () => {
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      
      // Reset state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  },
  
  /**
   * LOAD STORED AUTH
   * 
   * WHY?
   * When app starts, check if user was previously logged in
   * If token exists, restore the session
   * 
   * WHEN TO CALL?
   * In app's root layout (_layout.tsx) on mount
   */
  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Try to get stored token and user
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userString = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      
      if (token && userString) {
        // Parse user data
        const user: User = JSON.parse(userString);
        
        // Restore session
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('✅ Session restored');
      } else {
        // No stored session
        set({ isLoading: false });
        console.log('ℹ️ No stored session found');
      }
    } catch (error) {
      console.error('❌ Error loading stored auth:', error);
      set({ isLoading: false });
    }
  },
  
  /**
   * CLEAR ERROR
   * 
   * WHY?
   * After showing an error message, clear it
   * So next operation doesn't show old error
   */
  clearError: () => {
    set({ error: null });
  },
}));