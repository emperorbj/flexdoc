// src/store/useThemeStore.ts

/**
 * WHY THIS FILE?
 * - Manage light/dark theme globally
 * - Persist theme preference
 * - Easy theme switching
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../src/constants/config';
import { ColorScheme } from '../src/constants/colors';

interface ThemeState {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (scheme: ColorScheme) => Promise<void>;
  loadStoredTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  colorScheme: 'light',
  isDark: false,
  
  /**
   * Toggle between light and dark mode
   */
  toggleTheme: async () => {
    const newScheme: ColorScheme = get().isDark ? 'light' : 'dark';
    await get().setTheme(newScheme);
  },
  
  /**
   * Set specific theme
   */
  setTheme: async (scheme: ColorScheme) => {
    try {
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, scheme);
      
      // Update state
      set({
        colorScheme: scheme,
        isDark: scheme === 'dark',
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },
  
  /**
   * Load saved theme on app start
   */
  loadStoredTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      
      if (stored === 'light' || stored === 'dark') {
        set({
          colorScheme: stored,
          isDark: stored === 'dark',
        });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  },
}));