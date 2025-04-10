import { Box, Text, styled, useTheme } from '@packages/ds-core';
import {
  Calendar,
  ConfigProvider,
  CalendarProps,
  Flex,
  Button,
  Dropdown,
} from 'antd';

import dayjs from 'dayjs';

import buddhistEra from 'dayjs/plugin/buddhistEra';

import { IconButton } from '.';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@packages/ds-icons';

dayjs.extend(buddhistEra);

export const FormItemCalendar: React.FC<CalendarProps<every>> = ({
  className,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Wrapper className={className}>
      <ConfigProvider
        locale={{
          locale: 'vi',
        }}
        theme={{
          token: {
            colorText: '#fff',
            motionDurationMid: '0s',
            motionDurationFast: '0s',
            motionDurationSlow: '0s',
          },
          components: {
            Calendar: {
              fullPanelBg: theme.colors.background,
              fullBg: theme.colors.background,
              colorText: '#ebebeb',
            },
            Button: {
              fontSizeSM: 14,
              fontSize: 14,
            },
            Radio: {
              colorText: '#000',
              colorPrimary: theme.colors.primary,
            },
          },
        }}
      >
        <Calendar
          {...props}
          headerRender={({ value, onChange }) => {
            return (
              <Flex justify="space-between" align="center">
                <StyleIconButton>
                  <ChevronLeftOutlined />
                </StyleIconButton>
                <Flex gap={6}>
                  <Dropdown
                    menu={{
                      items: Array.from({ length: 12 }).map((_, index) => ({
                        value: index,
                        onClick: () => {
                          onChange(value.month(index));
                        },
                        label: (
                          <Text transform="capitalize">
                            {dayjs().month(index).format('MMMM')}
                          </Text>
                        ),

                        type: 'item',
                        key: index,
                      })),
                    }}
                  >
                    <ValueButton>{value.format('MMMM')}</ValueButton>
                  </Dropdown>
                  <Dropdown
                    menu={{
                      items: Array.from({ length: 4 }).map((_, index) => ({
                        value: index,
                        label: dayjs().subtract(index, 'year').format('YYYY'),
                        type: 'item',
                        key: index,
                        onClick: () =>
                          onChange(
                            value.year(dayjs().subtract(index, 'year').year()),
                          ),
                      })),
                    }}
                  >
                    <ValueButton>{value.format('YYYY')}</ValueButton>
                  </Dropdown>
                </Flex>
                <StyleIconButton>
                  <ChevronRightOutlined />
                </StyleIconButton>
              </Flex>
            );
          }}
          fullCellRender={(date) => {
            const isValue =
              date.format('YYYY-MM-DD') === props.value?.format('YYYY-MM-DD');
            const outOfRange =
              props.value?.isBefore(date, 'month') ||
              props.value?.isAfter(date, 'month');
            return (
              <Box padding={[0, 's4']}>
                <DateCell activated={isValue} hidden={outOfRange}>
                  {date.format('D')}
                </DateCell>
              </Box>
            );
          }}
        />
      </ConfigProvider>
    </Wrapper>
  );
};

const ValueButton = styled.button`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: none !important;
  color: ${({ theme }) => theme.colors.textPrimary};
  height: 100%;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.r4};
  text-transform: capitalize;
  cursor: pointer;
`;

const StyleIconButton = styled(IconButton)`
  font-size: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radius.round};
`;

const DateCell = styled(Box)<{
  activated?: boolean;
  hidden?: boolean;
}>`
  border-radius: ${({ theme }) => theme.radius.r4};
  background-color: ${({ theme, activated, hidden }) =>
    activated
      ? theme.colors.primary
      : hidden
      ? theme.colors.background
      : theme.colors.backgroundSecondary};
  color: ${({ theme, hidden }) =>
    hidden ? theme.colors.textSecondary : theme.colors.textPrimary};
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  transition: none !important;
  padding: ${({ theme }) => theme.spaces.s16};
  border-radius: ${({ theme }) => theme.radius.r8};
  background-color: ${({ theme }) => theme.colors.background};

  .ant-picker-panel {
    border-top: none !important;
  }
  .ant-picker-content {
    thead {
      tr > th {
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        color: ${({ theme }) => theme.colors.textSecondary};
        font-weight: 550;
      }
    }
  }
`;

FormItemCalendar.displayName = 'FormItemCalendar';
