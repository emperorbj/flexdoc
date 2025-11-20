// src/api/files.ts

/**
 * WHY THIS FILE?
 * - All file/conversion API calls in one place
 * - Handles file uploads with FormData
 * - Type-safe operations
 */

import apiClient, { createFormData } from './client';
import { API_CONFIG } from '../constants/config';
import {
  ConversionResponse,
  FilesListResponse,
  DeleteFileResponse,
  ConvertedFile,
} from '../../types/api';
import { ConversionType } from '../constants/conversionTypes';

/**
 * Convert a file
 * 
 * ENDPOINT: POST /api/convert
 * BACKEND: files_router.post("/api/convert")
 * 
 * @param file - The file to convert (from document picker)
 * @param conversionType - Type of conversion (e.g., "pdf_to_excel")
 * @returns Converted file metadata with cloud URL
 */
export const convertFile = async (
  file: {
    uri: string;
    name: string;
    mimeType: string;
  },
  conversionType: ConversionType
): Promise<ConversionResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    /**
     * IMPORTANT: React Native FormData format
     * 
     * For files, we need to pass an object with:
     * - uri: local file path
     * - name: filename
     * - type: mime type
     */
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as any);  // "as any" because TypeScript doesn't know RN's FormData format
    
    formData.append('conversion_type', conversionType);
    
    // Make POST request with FormData
    const response = await apiClient.post<ConversionResponse>(
      API_CONFIG.ENDPOINTS.CONVERT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',  // Important for file uploads!
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('File conversion error:', error);
    throw error;
  }
};

/**
 * Get all converted files for current user
 * 
 * ENDPOINT: GET /api/files
 * BACKEND: files_router.get("/api/files")
 * 
 * @returns List of all user's converted files
 */
export const getUserFiles = async (): Promise<ConvertedFile[]> => {
  try {
    const response = await apiClient.get<FilesListResponse>(
      API_CONFIG.ENDPOINTS.FILES
    );
    
    // Return just the files array
    return response.data.files;
  } catch (error) {
    console.error('Get files error:', error);
    throw error;
  }
};

/**
 * Delete a converted file
 * 
 * ENDPOINT: DELETE /api/files/{file_id}
 * BACKEND: files_router.delete("/api/files/{file_id}")
 * 
 * @param fileId - MongoDB ObjectId of the file
 * @returns Success message
 */
export const deleteFile = async (fileId: string): Promise<DeleteFileResponse> => {
  try {
    const response = await apiClient.delete<DeleteFileResponse>(
      API_CONFIG.ENDPOINTS.FILE_BY_ID(fileId)  // Generates "/api/files/123abc"
    );
    
    return response.data;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Get a single file by ID
 * Useful for file detail screen
 * 
 * Note: Your backend doesn't have this endpoint yet
 * But we might add it later, so including it here
 */
export const getFileById = async (fileId: string): Promise<ConvertedFile> => {
  try {
    // This endpoint doesn't exist in your backend yet
    // You would need to add it: @files_router.get("/api/files/{file_id}")
    const response = await apiClient.get<ConvertedFile>(
      API_CONFIG.ENDPOINTS.FILE_BY_ID(fileId)
    );
    
    return response.data;
  } catch (error) {
    console.error('Get file by ID error:', error);
    throw error;
  }
};