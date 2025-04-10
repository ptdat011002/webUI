import { styled } from '@packages/ds-core';
import { CalendarEventBoldOutlined } from '@packages/ds-icons';
import { ConfigProvider, DatePicker } from 'antd';

import dayjs from 'dayjs';

import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

export interface FormDateTimePickerProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (date) => void;
  disabled?: boolean;
}

export const FormDateTimePicker: React.FC<FormDateTimePickerProps> = ({
  className,
  ...props
}) => {
  return (
    <Wrapper className={className}>
      <ConfigProvider
        theme={{
          token: {
            colorText: '#000',
            motionDurationMid: '0s',
            motionDurationFast: '0s',
            motionDurationSlow: '0s',
          },
          components: {
            Button: {
              fontSizeSM: 14,
              fontSize: 14,
            },
          },
        }}
      >
        <DatePicker
          style={{ width: '100%' }}
          allowClear={false}
          showTime={{
            showHour: true,
            showMinute: true,
            showSecond: true,
            showNow: true,
          }}
          popupStyle={{ fontSize: 14, transition: 'none' }}
          {...props}
          disabled={(props as every).config?.disabled}
          suffixIcon={<CalendarEventBoldOutlined size={24} />}
        />
      </ConfigProvider>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: '100%';
  transition: none !important;
`;

FormDateTimePicker.displayName = 'FormDateTimePicker';
