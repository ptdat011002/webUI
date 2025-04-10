import {
  Spinner,
  styled,
  ThemeProvider as DsThemeProvider,
  useTheme,
} from '@packages/ds-core';
import { ConfigProvider } from 'antd';
import { formInputHeight, getTheme, inActiveColor } from 'configs/theme';
import React, { ReactNode, useEffect, useMemo } from 'react';

import enPicker from 'antd/es/date-picker/locale/en_US';
import enCalender from 'antd/es/calendar/locale/en_US';

import viCalender from 'antd/es/calendar/locale/vi_VN';
import viPicker from 'antd/es/date-picker/locale/vi_VN';

import en from 'antd/es/locale/en_US';
import vi from 'antd/es/locale/vi_VN';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';

import buddhistEra from 'dayjs/plugin/buddhistEra';
import { useTranslation } from 'react-i18next';
import { useMedia } from '.';

dayjs.extend(buddhistEra);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { mode } = useMedia();
  const modeTheme = getTheme(mode);
  return (
    <DsThemeProvider theme={modeTheme}>
      <AntdProvider>{children}</AntdProvider>
    </DsThemeProvider>
  );
};

const AntdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const { mode } = useMedia();

  const localeConfig = useMemo(() => {
    switch (i18n.language) {
      case 'vi':
        return {
          pickerLocal: viPicker,
          calenderLocal: viCalender,
          lang: vi,
        };
      case 'en':
        return {
          pickerLocal: enPicker,
          calenderLocal: enCalender,
          lang: en,
        };
      default:
        return {
          pickerLocal: viPicker,
          calenderLocal: viCalender,
          lang: vi,
        };
    }
  }, [i18n.language]);

  useEffect(() => {
    dayjs.locale('vi');
  }, [i18n.language]);

  return (
    <ConfigProvider
      locale={{
        ...localeConfig.lang,
        DatePicker: {
          ...localeConfig.pickerLocal,
          lang: {
            ...localeConfig.pickerLocal.lang,
            ...getDateFormatLocale(i18n.language),
          },
        },
        Calendar: {
          ...localeConfig.calenderLocal,
          lang: {
            ...localeConfig.calenderLocal.lang,
            ...getDateFormatLocale(i18n.language),
          },
        },
      }}
      spin={{
        indicator: <Spinner size={24} />,
      }}
      theme={{
        token: {
          controlHeight: mode == 'mobile' ? 38 : 42,
          colorPrimary: theme.colors?.primary,
          fontFamily: theme.fontFamily,
          colorText: theme.colors?.textPrimary,
          colorTextSecondary: theme.colors?.secondary,
          colorError: theme.colors?.error,
          colorSuccess: theme.colors?.success,
          colorBgLayout: theme.colors?.background,
          colorBgContainer: theme.colors?.backgroundSecondary,
          colorSuccessBg: theme.colors?.success,
          colorErrorBg: theme.colors?.error,
          fontSize: theme.fontSizes.m,
          fontSizeSM: theme.fontSizes.s,
          fontSizeLG: theme.fontSizes.l,
          fontSizeXL: theme.fontSizes.h3,
          fontSizeHeading1: theme.fontSizes.h1,
          fontSizeHeading2: theme.fontSizes.h2,
          fontSizeHeading3: theme.fontSizes.h3,
          fontSizeHeading4: theme.fontSizes.h4,
          fontSizeHeading5: theme.fontSizes.h5,
          borderRadius: 8,
        },
        components: {
          Menu: {},
          Input: {
            lineHeight: 1.1,
            colorText: theme.colors?.dark,
            colorBgContainer: theme.colors?.light,
            activeBorderColor: theme.colors?.primary,
            activeShadow: `0px 0px 0px 1px ${theme.colors?.primary}`,
            errorActiveShadow: `0px 0px 0px 1px ${theme.colors?.error}`,
            colorBgContainerDisabled: theme.colors?.lightA500,
          },
          DatePicker: {
            colorText: theme.colors?.dark,
            colorBgContainer: theme.colors?.light,
            colorBgContainerDisabled: theme.colors?.lightA500,
            controlHeight: formInputHeight,
          },

          InputNumber: {
            colorText: theme.colors?.dark,
            colorBgContainer: theme.colors?.light,
            colorBgContainerDisabled: theme.colors?.lightA500,
            addonBg: theme.colors?.light,
          },
          Select: {
            colorBgContainer: theme.colors.light,
            colorTextBase: theme.colors.dark,
            colorText: theme.colors.dark,
            optionHeight: formInputHeight,
            colorBgContainerDisabled: theme.colors?.lightA500,
          },

          Dropdown: {
            colorText: theme.colors?.dark,
          },
          Radio: {
            colorBgContainer: theme.colors?.light,
            buttonSolidCheckedColor: theme.colors?.red,
            colorPrimary: theme.colors?.light,
            wrapperMarginInlineEnd: 32,
          },
          Switch: {
            colorTextQuaternary: inActiveColor,
            colorTextTertiary: inActiveColor,
            trackPadding: 3,
            handleSize: 19,
            controlHeight: 24,
          },

          Button: {
            lineHeight: 1.1,
            colorText: theme.colors?.textPrimary,
            colorTextSecondary: theme.colors?.textSecondary,
            paddingInline: 46,
            paddingBlock: 5,
            primaryShadow: 'none',
          },

          Form: {
            itemMarginBottom: mode == 'mobile' ? 4 : 12,
          },
          Layout: {
            siderBg: theme.colors?.backgroundSecondary,
            headerBg: 'transparent',
          },
          Table: {
            borderColor: theme.colors?.secondary,
            headerBg: theme.colors?.primary,
            headerSplitColor: theme.colors?.secondary,
            rowExpandedBg: theme.colors?.backgroundSecondary,
            cellPaddingBlock: mode == 'mobile' ? 8 : 15,
            cellPaddingInline: mode == 'mobile' ? 24 : 40,
            headerBorderRadius: 12,
            cellFontSize: theme.fontSizes.m,
            fontWeightStrong: 500,
          },
          Tag: {
            colorSuccessBg: theme.colors?.success,
            colorErrorBg: theme.colors?.error,
          },
          Pagination: {},
          Progress: {
            defaultColor: theme.colors?.primary,
            colorText: theme.colors?.textPrimary,
            lineHeight: 1.1,
          },
          Drawer: {
            colorBgElevated: theme.colors.backgroundSecondary,
            colorBorder: theme.colors.secondary,
          },
          Checkbox: {
            controlHeight: 38,
            // lineHeight: 1.2
          },
          Calendar: {
            itemActiveBg: '#0047FF',
          },
        },
      }}
    >
      <AntDesignCustomWrapper>{children}</AntDesignCustomWrapper>
    </ConfigProvider>
  );
};

const AntDesignCustomWrapper = styled.div`
  .ant-radio-inner {
    &::after {
      background-color: ${({ theme }) => theme.colors?.primary} !important;
    }
  }

  .ant-picker-ok .ant-btn-sm {
    font-size: 14px !important;
  }

  .ant-checkbox .ant-checkbox-inner {
    width: 1.125rem;
    height: 1.125rem;
    background-color: white;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    width: 1.125rem;
    height: 1.125rem;
    background-color: ${({ theme }) => theme.colors?.primary};
  }
`;

const getDateFormatLocale = (language: string) => {
  switch (language) {
    case 'vi':
      return {
        fieldDateFormat: 'DD/MM/YYYY',
        fieldDateTimeFormat: 'DD/MM/YYYY - HH:mm:ss',
        yearFormat: 'YYYY',
        cellYearFormat: 'YYYY',
      };

    default:
      return {
        fieldDateFormat: 'YYYY-MM-DD',
        fieldDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        yearFormat: 'YYYY',
        cellYearFormat: 'YYYY',
      };
  }
};
