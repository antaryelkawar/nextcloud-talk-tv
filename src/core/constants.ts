export const COLORS = {
  BACKGROUND: '#121212',
  SURFACE: '#1E1E1E',
  PRIMARY: '#0082C9', // Nextcloud Blue
  SECONDARY: '#FFFFFF', // High-emphasis text and icons
  TERTIARY: '#B0B0B0', // Low-emphasis text and icons
  SUCCESS: '#4CAF50', // Online status
  ERROR: '#F44336', // Errors, hangup buttons
  WARNING: '#FF9800', // Muted/Busy status
} as const;

export const TYPOGRAPHY = {
  FONT_FAMILY: 'Inter, sans-serif',
  BODY_SIZE: 24,
  HEADING_SIZE: 36,
  BOLD_WEIGHT: 700,
  REGULAR_WEIGHT: 400,
} as const;

export const SPACING = {
  BASE: 8,
  SAFE_ZONE: 60,
} as const;
