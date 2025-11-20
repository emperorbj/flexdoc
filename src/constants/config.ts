// src/constants/config.ts

/**
 * WHY THIS FILE?
 * - All app configuration in one place
 * - Easy to switch between dev/production
 * - Environment-specific settings
 * - No hardcoded URLs in components
 */

/**
 * API Configuration
 * Points to your FastAPI backend
 */

// You'll set this in .env file
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 30000,  // 30 seconds (some conversions take time)
  
  // Endpoints (matches your FastAPI routes)
  ENDPOINTS: {
    // Auth endpoints
    SIGNUP: '/api/signup',
    LOGIN: '/api/login',
    
    // File endpoints
    CONVERT: '/api/convert',
    FILES: '/api/files',
    FILE_BY_ID: (id: string) => `/api/files/${id}`,  // Function that takes ID
  },
} as const;

/**
 * File upload configuration
 */
export const FILE_CONFIG = {
  // Maximum file size (50MB)
  MAX_FILE_SIZE: 50 * 1024 * 1024,  // 50MB in bytes
  
  // Allowed file types (MIME types)
  ALLOWED_MIME_TYPES: [
    // PDF
    'application/pdf',
    
    // Word documents
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    
    // Excel
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    
    // Archives
    'application/zip',
    'application/x-zip-compressed',
    
    // Markdown
    'text/markdown',
    'text/plain',
  ],
  
  // Allowed file extensions
  ALLOWED_EXTENSIONS: [
    '.pdf', '.docx', '.doc', '.xlsx', '.xls',
    '.jpg', '.jpeg', '.png', '.gif',
    '.zip', '.md', '.txt'
  ],
} ;

/**
 * Storage keys for AsyncStorage/SecureStore
 * Centralized to prevent typos
 */
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: '@flexdoc/auth_token',
  USER_DATA: '@flexdoc/user_data',
  
  // Preferences
  THEME: '@flexdoc/theme',
  ONBOARDING_COMPLETED: '@flexdoc/onboarding_completed',
  
  // Cache
  FILES_CACHE: '@flexdoc/files_cache',
} as const;

/**
 * App settings
 */
export const APP_CONFIG = {
  APP_NAME: 'FlexDoc',
  APP_VERSION: '1.0.0',
  
  // Pagination
  FILES_PER_PAGE: 20,
  
  // Cache duration (in milliseconds)
  CACHE_DURATION: 5 * 60 * 1000,  // 5 minutes
  
  // Auto-refresh interval for files list
  AUTO_REFRESH_INTERVAL: 30 * 1000,  // 30 seconds
  
  // Retry configuration for failed requests
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,  // 1 second
} as const;

/**
 * Animation durations (in milliseconds)
 * For consistent animations across the app
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Toast/Notification durations
 */
export const TOAST_DURATION = {
  SHORT: 2000,   // 2 seconds
  MEDIUM: 3500,  // 3.5 seconds
  LONG: 5000,    // 5 seconds
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Name validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

/**
 * Helper function to check if we're in development
 */
export const isDevelopment = () => {
  return __DEV__;  // React Native built-in constant
};

/**
 * Helper to get full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Format file size from bytes to human-readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if file is allowed based on MIME type
 */
export const isFileTypeAllowed = (mimeType: string): boolean => {
  return FILE_CONFIG.ALLOWED_MIME_TYPES.includes(mimeType);
};

/**
 * Check if file size is within limit
 */
export const isFileSizeValid = (size: number): boolean => {
  return size <= FILE_CONFIG.MAX_FILE_SIZE;
};