// store/useFilesStore.ts

import { create } from 'zustand';
import { ConvertedFile } from '../types/api';
import * as filesApi from '../src/api/files';
import { ConversionType } from '../src/constants/conversionTypes';

interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'idle' | 'uploading' | 'converting' | 'success' | 'error';
  error?: string;
}

interface FilesState {
  // State
  files: ConvertedFile[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadProgress: FileUploadProgress | null;

  // Actions
  fetchFiles: () => Promise<void>;
  convertFile: (
    file: { uri: string; name: string; mimeType: string },
    conversionType: ConversionType
  ) => Promise<ConvertedFile>;
  deleteFile: (fileId: string) => Promise<void>;
  clearError: () => void;
  resetUploadProgress: () => void;
}

export const useFilesStore = create<FilesState>((set, get) => ({
  // ============================================
  // INITIAL STATE
  // ============================================
  files: [],
  isLoading: false,
  isUploading: false,
  error: null,
  uploadProgress: null,

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * FETCH FILES
   * Get all converted files for the current user
   */
  fetchFiles: async () => {
    try {
      set({ isLoading: true, error: null });

      const files = await filesApi.getUserFiles();

      set({
        files,
        isLoading: false,
      });

      console.log('✅ Files fetched successfully:', files.length);
    } catch (error: any) {
      const errorMessage = error?.detail || 'Failed to fetch files';

      set({
        isLoading: false,
        error: errorMessage,
      });

      console.error('❌ Fetch files error:', errorMessage);
      throw error;
    }
  },

  /**
   * CONVERT FILE
   * Upload and convert a file
   * 
   * FLOW:
   * 1. Set uploading state with progress
   * 2. Create FormData with file and conversion_type
   * 3. Call backend API
   * 4. Add converted file to local state
   * 5. Return the new file
   */
  convertFile: async (
    file: { uri: string; name: string; mimeType: string },
    conversionType: ConversionType
  ) => {
    try {
      // Set uploading state
      set({
        isUploading: true,
        error: null,
        uploadProgress: {
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        },
      });

      // Simulate upload progress (since we can't track real progress easily)
      const progressInterval = setInterval(() => {
        const current = get().uploadProgress;
        if (current && current.progress < 80) {
          set({
            uploadProgress: {
              ...current,
              progress: current.progress + 10,
            },
          });
        }
      }, 200);

      // Update to converting status
      setTimeout(() => {
        set({
          uploadProgress: {
            fileName: file.name,
            progress: 80,
            status: 'converting',
          },
        });
      }, 1000);

      // Call API
      const response = await filesApi.convertFile(file, conversionType);

      // Clear progress interval
      clearInterval(progressInterval);

      // Update progress to success
      set({
        uploadProgress: {
          fileName: file.name,
          progress: 100,
          status: 'success',
        },
      });

      // Add new file to the beginning of the list
      const newFile = response.file;
      set((state) => ({
        files: [newFile, ...state.files],
        isUploading: false,
      }));

      console.log('✅ File converted successfully:', newFile.converted_filename);

      // Reset upload progress after a delay
      setTimeout(() => {
        set({ uploadProgress: null });
      }, 2000);

      return newFile;
    } catch (error: any) {
      const errorMessage = error?.detail || 'File conversion failed';

      set({
        isUploading: false,
        error: errorMessage,
        uploadProgress: {
          fileName: file.name,
          progress: 0,
          status: 'error',
          error: errorMessage,
        },
      });

      console.error('❌ Convert file error:', errorMessage);

      // Reset upload progress after showing error
      setTimeout(() => {
        set({ uploadProgress: null });
      }, 3000);

      throw error;
    }
  },

  /**
   * DELETE FILE
   * Delete a file from backend and local state
   */
  deleteFile: async (fileId: string) => {
    try {
      set({ error: null });

      // Call API to delete
      await filesApi.deleteFile(fileId);

      // Remove from local state
      set((state) => ({
        files: state.files.filter((file) => file._id !== fileId),
      }));

      console.log('✅ File deleted successfully:', fileId);
    } catch (error: any) {
      const errorMessage = error?.detail || 'Failed to delete file';

      set({ error: errorMessage });

      console.error('❌ Delete file error:', errorMessage);
      throw error;
    }
  },

  /**
   * CLEAR ERROR
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * RESET UPLOAD PROGRESS
   */
  resetUploadProgress: () => {
    set({ uploadProgress: null });
  },
}));