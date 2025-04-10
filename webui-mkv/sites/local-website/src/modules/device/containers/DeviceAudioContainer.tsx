import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { IDeviceAudioConfig } from '../types/device-audio';
import { t } from 'i18next';
import { Box } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useDeviceAudio } from '../hooks/useDeviceAudio';

export interface DeviceAudioContainerProps {
  className?: string;
}

const options = [
  {
    label: '1',
    value: 5,
  },
  {
    label: '2',
    value: 10,
  },
  {
    label: '3',
    value: 15,
  },
  {
    label: '4',
    value: 20,
  },
  {
    label: '5',
    value: 25,
  },
  {
    label: '6',
    value: 30,
  },
  {
    label: '7',
    value: 40,
  },
  {
    label: '8',
    value: 50,
  },
  {
    label: '9',
    value: 60,
  },
  {
    label: '10',
    value: 70,
  },
];
export const DeviceAudioContainer: React.FC<DeviceAudioContainerProps> = () => {
  const [form] = useForm<IDeviceAudioConfig>();
  const { actionLoading, updateAudioConfig } = useDeviceAudio({
    onSuccess: (data) => {
      form.setFieldsValue({
        enable: data.audio_enable,
        encode_type: data.audio_codec,
        volume: data.out_volume,
      });
    },
  });

  const onFinish = async (values: IDeviceAudioConfig) => {
    await updateAudioConfig({
      audio_enable: values.enable,
      audio_codec: values.encode_type,
      out_volume: values.volume,
    });
  };
  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 10 }}
      colon={false}
      onFinish={onFinish}
    >
      <FormBuilder<IDeviceAudioConfig>
        asChild
        configs={{
          enable: {
            formType: 'switch',
            label: t('audio'),
          },
          encode_type: {
            formType: 'select',
            label: t('encode_type'),
            options: [
              {
                label: t('G711A'),
                value: 'G711A',
              },
              {
                label: t('G711U'),
                value: 'G711U',
              },
              {
                label: t('PCM'),
                value: 'PCM',
              },
              {
                label: t('G726'),
                value: 'G726',
              },
              {
                label: t('AAC'),
                value: 'AAC',
              },
            ],
          },
          volume: {
            formType: 'select',
            label: t('volume'),
            options: options,
          },
        }}
        layouts={[
          {
            name: 'enable',
            span: 24,
          },
          {
            name: 'volume',
            span: 24,
          },
          {
            name: 'encode_type',
            span: 24,
          },
        ]}
      />
      <Box marginTop="s48">
        <Button type="primary" loading={actionLoading} htmlType="submit">
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};
