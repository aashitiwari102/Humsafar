export const LightColors = {
  primary: {
    blue: '#2563EB',
    darkBlue: '#1D4ED8',
    lightBlue: '#3B82F6',
  },
  secondary: {
    white: '#FFFFFF',
    lightGray: '#F8FAFC',
    gray: '#64748B',
    darkGray: '#475569',
    background: '#F8FAFC',
  },
  accent: {
    green: '#10B981',
    lightGreen: '#34D399',
    darkGreen: '#059669',
  },
  status: {
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8',
    white: '#FFFFFF',
  }
};

export const DarkColors = {
  primary: {
    blue: '#3B82F6',
    darkBlue: '#1D4ED8',
    lightBlue: '#60A5FA',
  },
  secondary: {
    white: '#1F2937',
    lightGray: '#374151',
    gray: '#9CA3AF',
    darkGray: '#6B7280',
    background: '#111827',
  },
  accent: {
    green: '#34D399',
    lightGreen: '#6EE7B7',
    darkGreen: '#10B981',
  },
  status: {
    danger: '#F87171',
    warning: '#FBBF24',
    success: '#34D399',
    info: '#60A5FA',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    light: '#9CA3AF',
    white: '#F9FAFB',
  }
};

export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Responsive breakpoints
export const ScreenSizes = {
  small: 375,   // iPhone SE
  medium: 414,  // iPhone 11 Pro Max
  large: 768,   // iPad
  xlarge: 1024, // iPad Pro
};

// Responsive utility functions
export const isSmallScreen = (width: number) => width < ScreenSizes.medium;
export const isMediumScreen = (width: number) => width >= ScreenSizes.medium && width < ScreenSizes.large;
export const isLargeScreen = (width: number) => width >= ScreenSizes.large;

export const getResponsiveSpacing = (width: number) => ({
  xs: isSmallScreen(width) ? 2 : 4,
  sm: isSmallScreen(width) ? 4 : 8,
  md: isSmallScreen(width) ? 8 : 16,
  lg: isSmallScreen(width) ? 12 : 24,
  xl: isSmallScreen(width) ? 16 : 32,
  xxl: isSmallScreen(width) ? 24 : 48,
});

export const getResponsiveFontSize = (width: number) => ({
  xs: isSmallScreen(width) ? 10 : 12,
  sm: isSmallScreen(width) ? 12 : 14,
  md: isSmallScreen(width) ? 14 : 16,
  lg: isSmallScreen(width) ? 16 : 18,
  xl: isSmallScreen(width) ? 18 : 20,
  xxl: isSmallScreen(width) ? 20 : 24,
  xxxl: isSmallScreen(width) ? 28 : 32,
});