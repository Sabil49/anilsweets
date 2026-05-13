import { TextStyle, ViewStyle } from 'react-native';

export interface ColorTheme {
  primary: string;
  primaryLight: string;
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  green: string;
}

export interface SpacingTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface RadiusTheme {
  card: number;
  button: number;
  chip: number;
  input: number;
  image: number;
}

export interface TypographyTheme {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  bodyMd: TextStyle;
  small: TextStyle;
  caption: TextStyle;
}

export const Colors: ColorTheme = {
  primary: '#FF6B00',
  primaryLight: '#FFF0E5',
  background: '#FFF8F0',
  card: '#FFFFFF',
  text: '#222222',
  muted: '#777777',
  border: '#F0E8DF',
  success: '#22C55E',
  warning: '#FBBF24',
  green: '#16A34A',
};

export const Spacing: SpacingTheme = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export const Radius: RadiusTheme = {
  card: 18,
  button: 16,
  chip: 999,
  input: 12,
  image: 12,
};

export const Typography: TypographyTheme = {
  h1: { fontSize: 26, fontWeight: '800', color: '#222222' },
  h2: { fontSize: 20, fontWeight: '700', color: '#222222' },
  h3: { fontSize: 17, fontWeight: '700', color: '#222222' },
  body: { fontSize: 14, fontWeight: '400', color: '#222222' },
  bodyMd: { fontSize: 15, fontWeight: '500', color: '#222222' },
  small: { fontSize: 12, fontWeight: '400', color: '#777777' },
  caption: { fontSize: 11, fontWeight: '500', color: '#777777' },
};

// Unified theme export
export const theme = {
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  typography: Typography,
};

// Additional exports for new components
export const COLORS = {
  background: '#FFF8F0',
  surface: '#FFFFFF',
  text: {
    primary: '#222222',
    secondary: '#777777',
    muted: '#999999',
  },
  border: '#F0E8DF',
  espresso: {
    300: '#D4A574',
    500: '#FF6B00',
  },
  cream: {
    100: '#FFF0E5',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
};
