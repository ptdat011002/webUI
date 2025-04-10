import {
  ThemeColor,
  generateThemeColors,
  mainColors,
  shadeMainColors,
  themeColors,
} from './colors';

export const fontSizes = {
  xs: 12,
  s: 13,
  m: 14,
  l: 16,
  h1: 38,
  h2: 30,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
};

export const fontWeights = {
  '100': 100,
  '200': 200,
  '300': 300,
  '400': 400,
  '500': 500,
  '600': 600,
  '700': 700,
  normal: 400,
  bold: 500,
  booler: 600,
};
export type FontWeight = keyof typeof fontWeights;

export type FontSize = keyof typeof fontSizes;

export const radii = {
  0: 0,
  r2: '0.125rem',
  r4: '0.25rem',
  r8: '0.5rem',
  r16: '1rem',
  r32: '1rem',
  round: '10000rem',
};

export type Radii = keyof typeof radii;

export const spaces = {
  0: 0,
  s2: '0.125rem',
  s4: '0.25rem',
  s6: '0.375rem',
  s8: '0.5rem',
  s10: '0.625rem',
  s12: '0.75rem',
  s16: '1rem',
  s20: '1.25rem',
  s24: '1.5rem',
  s28: '1.75rem',
  s32: '2rem',
  s48: '3rem',
  s64: '4rem',
  s80: '5rem',
};

export type Space = keyof typeof spaces;
export type Spaces = typeof spaces;

export const defaultTheme = {
  fontFamily: 'Roboto, sans-serif',
  colors: {
    ...shadeMainColors(mainColors),
    ...generateThemeColors(themeColors),
  },
  fontSizes: { ...fontSizes },
  spaces: { ...spaces },
  fontWeights,
  breakpoints: {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1440px)',
    xxl: '(min-width: 1600px)',
  },
  radius: { ...radii },
  zIndex: {
    modal: 1050,
    notification: 1060,
    dropdown: 1070,
  },
};

export type ThemeToken = typeof defaultTheme;
export type Color = keyof ThemeToken['colors'];
export type ZIndex = Partial<ThemeToken['zIndex']>;

export type CustomTheme = {
  colors?: ThemeColor;
  fontSizes?: Partial<typeof fontSizes>;
  fontFamily?: string;
  zIndex?: ZIndex;
};
