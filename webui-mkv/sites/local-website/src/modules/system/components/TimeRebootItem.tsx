import React from 'react';
import { Form, Select } from 'antd';
import dayjs from 'dayjs';

import { useWatch } from 'antd/es/form/Form';
import { FormTimePicker } from '../../_shared';
import { Flex } from '@packages/ds-core';
import { DateTime } from '../../_shared';

const format = 'HH:mm';

const modeOptions = DateTime.getModeOptions();

const weekOptions = DateTime.getWeekOptions();

const monthOptions = DateTime.getMonthOptions();

export interface TimeRebootItemProps {
  className?: string;
}

export const TimeRebootItem: React.FC<TimeRebootItemProps> = ({}) => {
  const form = Form.useFormInstance();

  const modeValue = useWatch('mode', form);

  return (
    <Flex gapX={'s8'}>
      <Form.Item name={'mode'}>
        <Select options={modeOptions} style={{ width: '10rem' }} />
      </Form.Item>

      <Form.Item name={'wday'} hidden={modeValue !== 'weekly'}>
        <Select options={weekOptions} style={{ width: '10rem' }} />
      </Form.Item>

      <Form.Item name={'mday'} hidden={modeValue !== 'monthly'}>
        <Select options={monthOptions} style={{ width: '10rem' }} />
      </Form.Item>

      <Form.Item
        name={'start_time'}
        getValueProps={(value: string) => {
          const [hour, minute, second] = value.split(':').map(Number);

          return {
            value: dayjs().hour(hour).minute(minute).second(second),
          };
        }}
        normalize={(value) => {
          const date = dayjs(value);

          const hour = DateTime.formatTime(date.hour());
          const minute = DateTime.formatTime(date.minute());
          const second = DateTime.formatTime(date.second());

          return `${hour}:${minute}:${second}`;
        }}
      >
        <FormTimePicker format={format} />
      </Form.Item>
    </Flex>
  );
};
