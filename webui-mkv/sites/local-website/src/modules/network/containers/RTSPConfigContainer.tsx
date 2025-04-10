import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { Box, Flex, Spinner, Text } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next';
import { useForm } from 'antd/es/form/Form';
import { formGutter } from 'configs/theme';
import { ScreenCenter } from 'modules/_shared';
import { useRTSPConfigure } from '../hooks';
import { IRTSPConfig } from '../types';

const exampleStrs = [
  'rtsp://ip_addr_device:port/stream_name',
  'name: 0 (mainstream), 1 (substream)',
  'Ví dụ: rtsp://193.169.0.2:554/stream0',
];

export interface RTSPConfigContainerProps {
  className?: string;
}

const labelCol = { span: 10 };

export const RTSPConfigContainer: React.FC<RTSPConfigContainerProps> = () => {
  const { loading, data, onUpdate, actionLoading } = useRTSPConfigure();
  const [form] = useForm<IRTSPConfig>();

  if (loading)
    return (
      <ScreenCenter>
        <Spinner />
      </ScreenCenter>
    );

  return (
    <div>
      <Form
        form={form}
        layout="horizontal"
        labelCol={labelCol}
        initialValues={{
          rtsp_enable: data?.rtsp_enable,
        }}
        onFinish={onUpdate}
        colon={false}
      >
        <FormBuilder<IRTSPConfig>
          asChild
          gutter={formGutter}
          configs={{
            rtsp_enable: {
              formType: 'switch',
              label: 'RTSP',
            },
          }}
          layouts={[
            {
              name: 'rtsp_enable',
              span: 24,
            },
          ]}
        />
        <Box marginBottom="s24" marginTop="s24">
          <Flex direction="column">
            <Text italic fontSize="s" fontWeight="200">
              {t('guide')}
            </Text>
            {exampleStrs.map((str, index) => (
              <Text italic fontSize="s" fontWeight="200" key={index}>
                {str}
              </Text>
            ))}
          </Flex>
        </Box>
        <Box marginTop="s48">
          <Flex>
            <Button type="primary" htmlType="submit" loading={actionLoading}>
              {t('save')}
            </Button>
          </Flex>
        </Box>
      </Form>
    </div>
  );
};
