// src/constants/colors.ts

/**
 * WHY THIS FILE?
 * - Centralized color palette for the entire app
 * - Easy to switch between light and dark mode
 * - Consistent design system
 * - Change colors in one place, affects entire app
 */

/**
 * Color palette for light mode
 * These follow modern design principles
 */
export const lightColors = {
  // Primary brand colors
  primary: '#3B82F6',        // Blue - main brand color
  primaryDark: '#2563EB',    // Darker blue for pressed states
  primaryLight: '#60A5FA',   // Lighter blue for backgrounds
  
  // Secondary colors
  secondary: '#8B5CF6',      // Purple - accent color
  secondaryDark: '#7C3AED',
  secondaryLight: '#A78BFA',
  
  // Success, warning, error
  success: '#10B981',        // Green - success messages
  warning: '#F59E0B',        // Orange - warnings
  error: '#EF4444',          // Red - errors
  info: '#3B82F6',           // Blue - info messages
  
  // Neutral colors (grays)
  background: '#FFFFFF',     // Main background
  surface: '#F9FAFB',        // Cards, elevated surfaces
  border: '#E5E7EB',         // Borders and dividers
  
  // Text colors
  text: '#111827',           // Primary text (almost black)
  textSecondary: '#6B7280',  // Secondary text (gray)
  textTertiary: '#9CA3AF',   // Tertiary text (light gray)
  textInverse: '#FFFFFF',    // Text on dark backgrounds
  
  // Interactive elements
  link: '#3B82F6',           // Links
  disabled: '#D1D5DB',       // Disabled state
  placeholder: '#9CA3AF',    // Input placeholders
  
  // Special
  overlay: 'rgba(0, 0, 0, 0.5)',  // Modal overlays
  shadow: 'rgba(0, 0, 0, 0.1)',   // Shadows
} as const;

/**
 * Color palette for dark mode
 * Inverted colors for better contrast in dark environments
 */
export const darkColors = {
  // Primary brand colors (slightly adjusted for dark mode)
  primary: '#60A5FA',
  primaryDark: '#3B82F6',
  primaryLight: '#93C5FD',
  
  // Secondary colors
  secondary: '#A78BFA',
  secondaryDark: '#8B5CF6',
  secondaryLight: '#C4B5FD',
  
  // Success, warning, error (brighter for dark backgrounds)
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Neutral colors
  background: '#111827',     // Dark background
  surface: '#1F2937',        // Cards, elevated surfaces
  border: '#374151',         // Borders
  
  // Text colors (inverted)
  text: '#F9FAFB',           // Primary text (almost white)
  textSecondary: '#D1D5DB',  // Secondary text
  textTertiary: '#9CA3AF',   // Tertiary text
  textInverse: '#111827',    // Text on light backgrounds
  
  // Interactive elements
  link: '#60A5FA',
  disabled: '#4B5563',
  placeholder: '#6B7280',
  
  // Special
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
} as const;

/**
 * Semantic color names
 * Use these in components instead of direct colors
 * Makes it easier to understand what color is for what purpose
 */
export const semanticColors = {
  // File type colors (for file icons and badges)
  pdf: '#EF4444',          // Red
  excel: '#10B981',        // Green
  word: '#3B82F6',         // Blue
  powerpoint: '#F59E0B',   // Orange
  image: '#8B5CF6',        // Purple
  text: '#6B7280',         // Gray
  archive: '#EC4899',      // Pink
  
  // Status colors (for conversion status badges)
  completed: '#10B981',    // Green
  processing: '#F59E0B',   // Orange
  failed: '#EF4444',       // Red
  pending: '#6B7280',      // Gray
} as const;

/**
 * Spacing values (padding, margin, gap)
 * Follows 4px base unit system
 */
export const spacing = {
  xs: 4,     // 4px
  sm: 8,     // 8px
  md: 16,    // 16px
  lg: 24,    // 24px
  xl: 32,    // 32px
  xxl: 48,   // 48px
} as const;

/**
 * Border radius values
 * For consistent rounded corners
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,  // Fully rounded (pills)
} as const;

/**
 * Font sizes
 * Following a modular scale
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Font weights
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Shadow presets
 * For cards and elevated elements
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,  // Android
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

/**
 * Export theme object
 * This is what components will import
 */
export const theme = {
  light: lightColors,
  dark: darkColors,
  semantic: semanticColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} as const;

/**
 * Type for theme
 * Used in components that need type safety
 */
export type Theme = typeof theme;
export type ColorScheme = 'light' | 'dark';
