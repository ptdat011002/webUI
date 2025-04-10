import React, { useMemo } from 'react';
import { FormBuilder } from '@packages/react-form-builder';
import { IMotionDetectionConfig } from '../types';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next.ts';
import { Box } from '@packages/ds-core';
import { useForm } from 'antd/es/form/Form';

export interface EventSettingFormProps {
  className?: string;
  data?: IMotionDetectionConfig;
  handleFinish: (values: IMotionDetectionConfig) => void;
  isUpdating: boolean;
}

export const EventSettingForm: React.FC<EventSettingFormProps> = ({
  data,
  handleFinish,
  isUpdating,
}) => {
  const [form] = useForm();

  const initialValues = useMemo(
    () => ({
      alarm_enable: !!data?.alarm_enable,
      record_enable: !!data?.record_enable,
    }),
    [data],
  );

  return (
    <Form
      form={form}
      colon={false}
      labelCol={{
        span: 10,
      }}
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <FormBuilder<IMotionDetectionConfig>
        asChild
        configs={{
          alarm_enable: {
            formType: 'switch',
            label: t('warning'),
          },
          record_enable: {
            formType: 'switch',
            label: t('Record'),
          },
        }}
        layouts={[
          {
            name: 'alarm_enable',
            span: 12,
            lg: 24,
          },
          {
            name: 'record_enable',
            span: 12,
            lg: 24,
          },
        ]}
      />
      <Box marginTop={'s24'}>
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};
