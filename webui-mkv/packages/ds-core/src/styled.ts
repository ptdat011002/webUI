/* eslint-disable @typescript-eslint/no-empty-interface */
import { default as baseStyled } from '@emotion/styled';
import { ThemeToken } from './theme/token';

declare module '@emotion/react' {
  export interface Theme extends ThemeToken {}
}

export const styled = baseStyled;
