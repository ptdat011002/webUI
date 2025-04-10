import React from 'react';
import { IWifiItem, useWifiAction } from '../hooks';
import { Button, Form } from 'antd';
import { IJoinWifiPayload, IWifiDetailConfig, SecurityOption } from '../types';
import { FormBuilder } from '@packages/react-form-builder';
import { Box, Flex, styled, Text } from '@packages/ds-core';
import { useForm, useWatch } from 'antd/es/form/Form';
import { t } from 'i18next';

export interface WifiChangeInfoContainerProps {
  className?: string;
  wifi: IWifiItem;
  close?: () => void;
}

export const WifiChangeInfoContainer: React.FC<
  WifiChangeInfoContainerProps
> = ({ className, wifi, close }) => {
  const [form] = useForm();
  const security = useWatch('security', form);
  const { loading, joinWifi } = useWifiAction(wifi);

  const handleSaveData = (data: IWifiDetailConfig) => {
    const config: IJoinWifiPayload = {
      ...wifi,
      security: data.security,
      password: data.password,
    };

    return joinWifi(config).then(close);
  };

  return (
    <Wrapper className={className}>
      <Box marginBottom="s16">
        <Text fontSize="m" fontWeight="600">
          {t('wifi_name_f', {
            field: wifi.ssid,
          })}
        </Text>
      </Box>
      <Form<IWifiDetailConfig>
        layout="vertical"
        form={form}
        onFinish={handleSaveData}
        initialValues={{
          security: wifi.security,
          password: wifi.password,
        }}
      >
        <FormBuilder<IWifiDetailConfig>
          asChild
          configs={{
            security: {
              formType: 'select',
              label: t('security'),
              placeholder: t('security'),
              options: Object.values(SecurityOption).map((v) => ({
                label: v,
                value: v,
              })),
              required: false,
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', { field: t('security') }),
                },
              ],
            },
            password: {
              formType: 'password',
              label: t('password'),
              placeholder: '********',
              required: false,
              rules: [
                {
                  required: security !== SecurityOption.OPEN,
                  message: t('fieldIsRequired', { field: t('password') }),
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'security',
              span: 24,
            },
            {
              name: 'password',
              span: 24,
            },
          ]}
        />
        <Box marginTop="s32">
          <Flex gapX="s16">
            <Button type="primary" block ghost onClick={close}>
              {t('cancel')}
            </Button>
            <Button type="primary" block htmlType="submit" loading={loading}>
              {t('save')}
            </Button>
          </Flex>
        </Box>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 2rem;
  box-sizing: border-box;
`;
