import React, { ReactNode, useMemo } from 'react';
import {
  Theme,
  ThemeProvider as BaseThemeProvider,
  Global,
} from '@emotion/react';
import { CustomTheme, defaultTheme } from './token';
import { generateThemeColors, themeColors } from './token/colors';

export interface ThemeProviderProps {
  theme?: CustomTheme;
  children?: ReactNode;
  selector?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = {},
  children,
  selector = 'body',
}) => {
  const colors = useMemo(
    () => ({
      ...defaultTheme.colors,
      ...generateThemeColors({ ...themeColors, ...(theme?.colors || {}) }),
    }),
    [theme],
  );

  const emotionTheme: Theme = {
    ...defaultTheme,
    colors,
    fontFamily: theme.fontFamily ?? defaultTheme.fontFamily,
    fontSizes: {
      ...defaultTheme.fontSizes,
      ...theme?.fontSizes,
    },
    zIndex: {
      ...defaultTheme.zIndex,
      ...theme?.zIndex,
    },
  };

  return (
    <BaseThemeProvider theme={emotionTheme}>
      <Global
        styles={{
          [selector]: {
            fontFamily: theme?.fontFamily || defaultTheme.fontFamily,
            color: colors.textPrimary,
            backgroundColor: colors.background,
            fontSize: emotionTheme.fontSizes.m,
          },
        }}
      />

      {children}
    </BaseThemeProvider>
  );
};
