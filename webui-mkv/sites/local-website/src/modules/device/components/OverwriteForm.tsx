import { useForm, useWatch } from 'antd/es/form/Form';
import { Button, Form, InputNumber, Select, Space, Switch } from 'antd';
import React from 'react';
import { t } from 'configs/i18next.ts';
import { Box, styled } from '@packages/ds-core';
import dayjs from 'dayjs';
import { FormTimePicker } from '../../_shared';
import { DateTime } from '../../_shared';

const weekOptions = DateTime.getWeekOptions();

const format = 'HH:mm';

export interface IOverwriteFormProps {
  className?: string;
  initialValues: IOverwriteFormValues;
  isLoading: boolean;
  handleOnFormatStorage: () => void;
  handleOnFinish: (values: IOverwriteFormValues) => void;
}

export interface IOverwriteFormValues {
  schedule_enable: boolean;
  wday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  start_time: string;
  override: 'Auto' | 'Off';
  threshold: number;
}

export const OverwriteForm: React.FC<IOverwriteFormProps> = ({
  initialValues,
  isLoading,
  handleOnFinish,
  handleOnFormatStorage,
}) => {
  const [form] = useForm();
  const autoOverride = useWatch('override', form);
  const scheduleEnable = useWatch('schedule_enable', form);

  return (
    <Form
      form={form}
      colon={false}
      labelCol={{
        span: 5,
      }}
      labelAlign={'left'}
      initialValues={initialValues}
      onFinish={handleOnFinish}
    >
      <Form.Item
        label={t('autoOverwrite')}
        name="override"
        getValueProps={(value) => ({
          value: value === 'Auto',
        })}
        normalize={(value) => (value ? 'Auto' : 'Off')}
      >
        <Switch
          onChange={(event) => {
            if (event) {
              form.setFieldsValue({ schedule_enable: false });
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label={t('overwriteThreshold')}
        name="threshold"
        hidden={autoOverride === 'Off'}
      >
        <InputNumber
          style={{ width: 150 }}
          min={50}
          max={90}
          addonAfter={'%'}
        />
      </Form.Item>

      <Form.Item label={t('schedule_delete')} name="schedule_enable">
        <Switch
          onChange={(event) => {
            if (event) {
              form.setFieldsValue({ override: 'Off' });
            }
          }}
        />
      </Form.Item>

      <Form.Item label={t('deleteTime')} hidden={!scheduleEnable}>
        <Space wrap>
          <Form.Item name={'wday'}>
            <Select options={weekOptions} style={{ width: '14rem' }} />
          </Form.Item>

          <Form.Item
            name={'start_time'}
            getValueProps={(value: string) => ({
              value: dayjs(value, 'HH:mm:ss'),
            })}
            normalize={(value) => value.format('HH:mm:ss')}
          >
            <FormTimePicker format={format} />
          </Form.Item>
        </Space>
      </Form.Item>

      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t('save')}
        </Button>

        <Button
          type="primary"
          ghost
          onClick={handleOnFormatStorage}
          loading={isLoading}
        >
          {t('memoryFormat')}
        </Button>
      </ButtonWrapper>
    </Form>
  );
};

const ButtonWrapper = styled(Box)`
  margin-top: 24px;

  button {
    margin-right: 24px;
  }
`;
