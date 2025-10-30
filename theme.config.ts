/**
 * CENTRALIZED THEME CONFIGURATION
 * 
 * This is the single source of truth for all design tokens in the app.
 * Update colors, typography, spacing, shadows, and effects here to
 * apply changes throughout the entire application.
 * 
 * Inspired by Tailwind CSS configuration approach.
 */

export const themeConfig = {
  colors: {
    // Primary brand colors (purple/violet theme)
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',  // Main primary
      600: '#9333ea',
      700: '#7e22ce',  // Main primary dark
      800: '#6b21a8',
      900: '#581c87',
    },
    
    // Secondary colors (blue)
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main secondary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Success (green)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Main success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning (orange/amber)
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error (red)
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',  // Main error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Info (cyan/teal)
    info: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',  // Main info
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    
    // Neutral/Gray scale
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    
    // Special colors
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    
    // Attendance specific
    attendance: {
      present: '#22c55e',  // success.500
      absent: '#ef4444',   // error.500
      leave: '#f59e0b',    // warning.500
      late: '#f97316',     // orange
      halfDay: '#a855f7',  // primary.500
    },
    
    // Assignment/Test status
    status: {
      pending: '#f59e0b',     // warning
      submitted: '#06b6d4',   // info
      graded: '#22c55e',      // success
      overdue: '#ef4444',     // error
      draft: '#737373',       // neutral
    },
    
    // Background colors (support light & dark mode)
    background: {
      light: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
        elevated: '#FFFFFF',
      },
      dark: {
        primary: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
        elevated: '#1E293B',
      },
    },
    
    // Text colors
    text: {
      light: {
        primary: '#0F172A',
        secondary: '#475569',
        tertiary: '#94A3B8',
        disabled: '#CBD5E1',
        inverse: '#FFFFFF',
      },
      dark: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        tertiary: '#64748B',
        disabled: '#475569',
        inverse: '#0F172A',
      },
    },
    
    // Border colors
    border: {
      light: {
        default: '#E2E8F0',
        strong: '#CBD5E1',
        subtle: '#F1F5F9',
      },
      dark: {
        default: '#334155',
        strong: '#475569',
        subtle: '#1E293B',
      },
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semibold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
      // Alternative: Poppins
      alt: {
        regular: 'Poppins-Regular',
        medium: 'Poppins-Medium',
        semibold: 'Poppins-SemiBold',
        bold: 'Poppins-Bold',
      },
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    letterSpacing: {
      tighter: -0.8,
      tight: -0.4,
      normal: 0,
      wide: 0.4,
      wider: 0.8,
      widest: 1.6,
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing (4px base grid)
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  // Shadows (iOS and Android compatible)
  shadows: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 12,
    },
    '2xl': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 16,
    },
  },
  
  // Border widths
  borderWidth: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    8: 8,
  },
  
  // Opacity
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    25: 0.25,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    90: 0.9,
    95: 0.95,
    100: 1,
  },
  
  // Z-index layers
  zIndex: {
    hide: -1,
    base: 0,
    elevated: 10,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    toast: 1400,
    tooltip: 1500,
  },
  
  // Animation durations (milliseconds)
  animation: {
    duration: {
      fastest: 100,
      faster: 150,
      fast: 200,
      normal: 300,
      slow: 400,
      slower: 500,
      slowest: 700,
    },
    
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      // For React Native Reanimated
      spring: {
        damping: 15,
        mass: 1,
        stiffness: 150,
      },
    },
  },
  
  // Component-specific sizes
  components: {
    button: {
      height: {
        sm: 32,
        base: 44,  // iOS recommended minimum touch target
        lg: 56,
      },
      paddingHorizontal: {
        sm: 12,
        base: 16,
        lg: 24,
      },
    },
    
    input: {
      height: {
        sm: 36,
        base: 44,
        lg: 52,
      },
      paddingHorizontal: 12,
    },
    
    card: {
      padding: 16,
      borderRadius: 12,
    },
    
    avatar: {
      size: {
        xs: 24,
        sm: 32,
        base: 40,
        lg: 48,
        xl: 64,
        '2xl': 80,
        '3xl': 96,
      },
    },
    
    icon: {
      size: {
        xs: 16,
        sm: 20,
        base: 24,
        lg: 28,
        xl: 32,
      },
    },
  },
  
  // Breakpoints (for responsive design if needed)
  breakpoints: {
    sm: 375,  // iPhone SE
    md: 414,  // iPhone Plus
    lg: 768,  // iPad
    xl: 1024, // iPad Pro
  },
};

// Type exports for TypeScript
export type Theme = typeof themeConfig;
export type ThemeColors = typeof themeConfig.colors;
export type ThemeSpacing = typeof themeConfig.spacing;

// Helper function to get current theme based on mode
export const getTheme = (mode: 'light' | 'dark' = 'light') => {
  return {
    ...themeConfig,
    mode,
    colors: {
      ...themeConfig.colors,
      background: themeConfig.colors.background[mode],
      text: themeConfig.colors.text[mode],
      border: themeConfig.colors.border[mode],
    },
  };
};

export default themeConfig;
