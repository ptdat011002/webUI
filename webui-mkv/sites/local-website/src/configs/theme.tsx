import { CustomTheme } from '@packages/ds-core/dist/theme/token';
import { ILayoutType } from 'modules/_shared/hooks/useMedia';

const primaryColor = '#1B937D';
const textPrimaryColor = '#FFFFFF';
export const fontFamily = 'Inter';
export const pageBackground = '#333333';
export const menuIconSize = 34;
export const sideBarWidth = 319;
export const formGutter: [number, number] = [12, 12];
export const formInputHeight = 42;
export const inActiveColor = '#CCCCCE';

export const theme: CustomTheme = {
  fontFamily: fontFamily,
  colors: {
    primary: primaryColor,
    textPrimary: textPrimaryColor,
    textSecondary: '#6E6E6E',
    secondary: '#0C1C23',
    error: '#C72305',
    success: '#3EDB56',
    background: '#131313',
    backgroundSecondary: '#333333',
  },
  fontSizes: {
    xs: 14,
    s: 16,
    m: 18,
    l: 20,
  },
};

export const modalTheme: CustomTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    textPrimary: '#000000',
    background: 'transparent',
  },
};

export const getTheme = (mode: ILayoutType) => {
  if (mode === 'mobile') {
    return {
      ...theme,
      fontSizes: {
        xs: 13,
        s: 14,
        m: 15,
        l: 16,
        h1: 22,
        h2: 20,
        h3: 18,
        h4: 17,
        h5: 16,
        h6: 15,
      },
    };
  }

  if (mode === 'laptop') {
    return {
      ...theme,
      fontSizes: {
        xs: 13,
        s: 14,
        m: 15,
        l: 16,
        h1: 22,
        h2: 20,
        h3: 18,
        h4: 17,
        h5: 16,
        h6: 15,
      },
    };
  }

  if (mode === 'hd') {
    return theme;
  }

  return theme;
};
