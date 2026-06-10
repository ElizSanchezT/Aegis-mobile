import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Brand = {
  50:  '#f1edff',
  100: '#e1d8ff',
  200: '#c5b4ff',
  300: '#a48eff',
  400: '#8669f5',
  500: '#6b4bd6',
  600: '#5837bd',
  700: '#432a96',
  800: '#2f1d6e',
  900: '#1c1147',
} as const;

export const SOS = {
  50:  '#fff1f3',
  100: '#ffe1e6',
  200: '#fec5cd',
  400: '#ff6f86',
  500: '#ef4a64',
  600: '#d8324e',
  700: '#b51e3a',
} as const;

export const Ink = {
  50:  '#f5f4f9',
  100: '#ecebf2',
  200: '#d7d3e2',
  300: '#b5b0c8',
  400: '#8b85a3',
  500: '#6a6383',
  700: '#3a3450',
  900: '#161226',
} as const;

export const Surface = '#ffffff';
export const Canvas = '#f5f4f9';
export const Line   = '#ecebf2';

export const Shadow = {
  sm: {
    shadowColor: '#140f32',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#1c1147',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;
