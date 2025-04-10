import React from 'react';
import { useForm, useWatch } from 'antd/es/form/Form';
import { Button, Form, InputNumber, Select, Switch } from 'antd';
import { t } from 'configs/i18next.ts';
import { Box, Text } from '@packages/ds-core';
import { IStream } from '../types';
import { useMedia } from 'modules/_shared';

export interface EncryptStreamProps {
  className?: string;
  onSubmit: (values: IStream) => void;
  isLoading?: boolean;
  defaultValue: IStream;
  type?: 'main' | 'sub';
}

const EncryptStreamForm: React.FC<EncryptStreamProps> = ({
  onSubmit,
  isLoading = false,
  defaultValue,
  type = 'main',
}) => {
  const [form] = useForm();
  const { mode } = useMedia();

  const encodeType = useWatch('encode_type', form);

  return (
    <Form<IStream>
      form={form}
      onFinish={onSubmit}
      colon={false}
      labelCol={{ span: 10 }}
      initialValues={defaultValue}
      labelAlign={'left'}
    >
      <Form.Item name={'resolution'} label={t('resolution')}>
        <Select
          options={
            type === 'main'
              ? [
                  { value: '1280x720', label: '1280x720' },
                  { value: '1920x1080', label: '1920x1080' },
                  { value: '2560x1440', label: '2560x1440' },
                  { value: '2592x1944', label: '2592x1944' },
                ]
              : [
                  { value: '640x480', label: '640x480' },
                  { value: '1280x720', label: '1280x720' },
                  { value: '1920x1080', label: '1920x1080' },
                ]
          }
        />
      </Form.Item>

      <Form.Item
        name={'fps'}
        label={
          <Text whiteSpace={mode === 'mobile' ? 'nowrap' : 'pre-line'}>
            {t('fps')}
            {'\n(1-60)'}
          </Text>
        }
        rules={[
          {
            validator: (_, value) => {
              if (value < 1) return Promise.reject(t('minValue', { value: 1 }));
              if (value > 60)
                return Promise.reject(t('maxValue', { value: 60 }));
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name={'encode_type'} label={t('encodeType')}>
        <Select>
          <Select.Option value="H264">H.264</Select.Option>
          <Select.Option value="H265">H.265</Select.Option>
          {type === 'sub' && <Select.Option value="MJPEG">MJPEG</Select.Option>}
        </Select>
      </Form.Item>

      <Form.Item
        name={'encode_level'}
        label={t('encode_config')}
        hidden={!['H264', 'H265'].includes(encodeType)}
      >
        <Select>
          <Select.Option value="Baseline">Baseline</Select.Option>
          <Select.Option value="MainProfile">MainProfile</Select.Option>
          <Select.Option value="HighProfile">HighProfile</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={'bitrate'}
        label={t('bitrate')}
        rules={[
          {
            validator: (_, value) => {
              if (value < 64)
                return Promise.reject(t('minValue', { value: 64 }));
              if (value > 16384)
                return Promise.reject(t('maxValue', { value: 16384 }));
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name={'i_frame_interval'}
        label={t('iFrameInterval')}
        rules={[
          {
            validator: (_, value) => {
              if (value < 1) return Promise.reject(t('minValue', { value: 1 }));
              if (value > 4) return Promise.reject(t('maxValue', { value: 4 }));
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name={'audio_enable'} label={t('sound')}>
        <Switch />
      </Form.Item>

      <Box marginTop="s20">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};

export default EncryptStreamForm;
