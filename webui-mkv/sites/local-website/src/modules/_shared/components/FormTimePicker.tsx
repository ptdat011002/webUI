import { ConfigProvider, TimePicker } from 'antd';
import React from 'react';
import { styled } from '@packages/ds-core';

export interface FormTimePickerProps {
  className?: string;
  format?: string;
}

export const FormTimePicker: React.FC<FormTimePickerProps> = ({
  className,
  ...props
}) => {
  return (
    <Wrapper className={className}>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              fontSizeSM: 14,
              fontSize: 14,
            },
          },
        }}
      >
        <TimePicker
          style={{ width: '100%' }}
          allowClear={false}
          showNow={false}
          popupClassName="form-time-picker"
          popupStyle={{ fontSize: 14 }}
          {...props}
        />
      </ConfigProvider>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: '100%';
`;

FormTimePicker.displayName = 'FormTimePicker';
