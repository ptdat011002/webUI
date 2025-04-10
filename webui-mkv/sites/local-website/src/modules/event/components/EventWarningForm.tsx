import React, { useMemo } from 'react';
import { useForm } from 'antd/es/form/Form';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next.ts';
import { Box, Spinner } from '@packages/ds-core';
import { useEventWarning } from '../hooks';

export interface EventWarningFormProps {
  className?: string;
}

interface IEventWarningForm {
  webui_enable: boolean;
  push_to_cloud: boolean;
  ftp_upload: boolean;
  audio_enable: boolean;
  record_enable: boolean;
  snapshot_interval: 'OFF' | '3' | '5' | '10';
}

export const EventWarningForm: React.FC<EventWarningFormProps> = () => {
  const [form] = useForm();

  const { data, isLoading, setEventWarning, loading } = useEventWarning();

  const initialValues = useMemo(() => {
    const snapshot_interval = data?.snapshot_mode
      ? data.snapshot_mode.interval
      : 'OFF';

    return {
      snapshot_interval: snapshot_interval,
      audio_enable: data?.audio_enable || true,
      push_to_cloud: data?.push_to_cloud || false,
      ftp_upload: data?.ftp_upload || false,
      record_enable: data?.record_enable || false,
      webui_enable: data?.webui_enable || false,
    };
  }, [data]);

  const handleOnFinish = async (values: IEventWarningForm) => {
    await setEventWarning({
      webui_enable: values.webui_enable,
      push_to_cloud: values.push_to_cloud,
      ftp_upload: values.ftp_upload,
      audio_enable: values.audio_enable,
      record_enable: values.record_enable,
      snapshot_mode: {
        ...data?.snapshot_mode,
        enable: values.snapshot_interval !== 'OFF',
        interval: parseInt(values.snapshot_interval),
      },
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <Form
      form={form}
      colon={false}
      labelCol={{
        span: 10,
      }}
      initialValues={initialValues}
      onFinish={handleOnFinish}
    >
      <FormBuilder<IEventWarningForm>
        asChild
        configs={{
          snapshot_interval: {
            formType: 'select',
            label: t('recordAfterEvent'),
            options: [
              {
                value: 'OFF',
                label: t('off'),
              },
              {
                value: '3',
                label: '3s',
              },
              {
                value: '5',
                label: '5s',
              },
              {
                value: '10',
                label: '10s',
              },
            ],
          },
          audio_enable: {
            formType: 'switch',
            label: t('playAlertThroughSpeaker'),
          },
          push_to_cloud: {
            formType: 'switch',
            label: t('sendEventThroughAPI'),
          },
          ftp_upload: {
            formType: 'switch',
            label: t('uploadEventImageToFTPServer'),
          },
          record_enable: {
            formType: 'switch',
            label: t('turnOnRecording'),
          },
          webui_enable: {
            formType: 'switch',
            label: t('showNotification'),
          },
        }}
        layouts={[
          {
            name: 'snapshot_interval',
            span: 24,
            md: 24,
          },
          {
            name: 'webui_enable',
            span: 12,
            md: 24,
          },
          {
            name: 'push_to_cloud',
            span: 12,
            md: 24,
          },
          {
            name: 'ftp_upload',
            span: 24,
            md: 24,
          },
          {
            name: 'audio_enable',
            span: 24,
            md: 24,
          },
          {
            name: 'record_enable',
            span: 12,
            md: 24,
          },
        ]}
        labelCol={{
          span: 12,
        }}
      />
      <Box marginTop={'s24'}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};
