import React from 'react';
import { useForm } from 'antd/es/form/Form';
import { Button, Form } from 'antd';
import { IEventSendingConfig } from '../types';
import { FormBuilder } from '@packages/react-form-builder';
import { t } from 'configs/i18next.ts';
import { Box, Spinner } from '@packages/ds-core';
import { useEventSending } from '../hooks';

export interface EventSendingFormProps {
  className?: string;
}

export const EventSendingForm: React.FC<EventSendingFormProps> = () => {
  const [form] = useForm();

  const { data, loading, setEventSending } = useEventSending();

  const handleOnFinish = async (values: IEventSendingConfig) => {
    await setEventSending(values);
  };

  if (loading) return <Spinner />;

  return (
    <Form
      form={form}
      colon={false}
      labelCol={{
        span: 10,
      }}
      initialValues={data}
      onFinish={handleOnFinish}
    >
      <FormBuilder<IEventSendingConfig>
        asChild
        configs={{
          server_url: {
            formType: 'input',
            label: t('serverAddress'),
          },
        }}
        layouts={[
          {
            name: 'server_url',
            span: 24,
          },
        ]}
      />
      <Box marginTop={'s24'}>
        <Button type="primary" htmlType="submit">
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};
