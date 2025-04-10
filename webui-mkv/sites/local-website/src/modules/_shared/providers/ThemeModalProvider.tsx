import { ThemeProvider as DsThemeProvider, useTheme } from '@packages/ds-core';
import { ConfigProvider } from 'antd';
import { modalTheme } from 'configs/theme';
import React, { ReactNode } from 'react';

export interface ThemeModalProviderProps {
  selector?: string;
  children: ReactNode;
}

export const ThemeModalProvider: React.FC<ThemeModalProviderProps> = ({
  children,
  selector,
}) => {
  return (
    <DsThemeProvider theme={modalTheme} selector={selector}>
      <AntdProvider>{children}</AntdProvider>
    </DsThemeProvider>
  );
};

const AntdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusSM: 4,
          colorTextBase: theme.colors.dark,
        },
        components: {
          Input: {
            paddingBlock: 12,
            fontSize: 16,
            lineHeight: 1.1,
            colorText: theme.colors?.dark,
            colorBgContainer: theme.colors.light,
            colorTextBase: theme.colors.dark,
          },
          InputNumber: {
            paddingBlock: 12,
            fontSize: 16,
            lineHeight: 1.1,
          },
          Select: {
            fontSize: 16,
            colorBgContainer: theme.colors.light,
            colorTextBase: theme.colors.dark,
            colorText: theme.colors.dark,
            lineHeight: 1.1,
            controlHeight: 44,
          },
          Form: {
            labelColor: theme.colors?.dark,
            controlHeight: 30,
          },
          Button: {
            colorLink: theme.colors?.dark,
            colorLinkHover: theme.colors?.dark200,
            linkDecoration: 'underline',
          },
          Checkbox: {
            colorBgContainer: theme.colors.light,
            colorText: theme.colors.dark,
          },
          Radio: {
            colorBgContainer: theme.colors.light,
            colorText: theme.colors.dark,
            buttonSolidCheckedColor: theme.colors?.red,
            colorPrimary: theme.colors?.primary,
            wrapperMarginInlineEnd: 32,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
