import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { Box, Flex, Spinner } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next';
import { useForm, useWatch } from 'antd/es/form/Form';
import { formGutter } from 'configs/theme';
import { ScreenCenter } from 'modules/_shared';
import { useRTMPConfigure } from '../hooks';
import { IRTMPConfig } from '../types';

export interface RTMPConfigContainerProps {
  className?: string;
}

const labelCol = { span: 10 };

export const RTMPConfigContainer: React.FC<RTMPConfigContainerProps> = () => {
  const { loading, data, onUpdate, actionLoading } = useRTMPConfigure();
  const [form] = useForm<IRTMPConfig>();
  const rsmpEnable = useWatch('rtmp_enable', form);

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
          rtmp_enable: data?.rtmp_enable,
          rtmp_url: data?.rtmp_url,
        }}
        onFinish={onUpdate}
        colon={false}
      >
        <FormBuilder<IRTMPConfig>
          asChild
          gutter={formGutter}
          configs={{
            rtmp_enable: {
              formType: 'switch',
              label: 'RTMP',
            },
            rtmp_url: {
              required: false,
              formType: 'input',
              label: 'URL',
              // defaultValue: rtmp://{ip}/{y}
              placeholder: 'rtmp://192.168.0.1/abb',
              disabled: !rsmpEnable,
              rules: [
                // validate on when rtmp_enable is true
                {
                  required: rsmpEnable,
                  message: t('pleaseInputField', {
                    field: t('server_address'),
                  }),
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'rtmp_enable',
              span: 24,
            },
            {
              name: 'rtmp_url',
              span: 24,
            },
          ]}
        />
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
