import React from 'react';
import { Box, Flex, styled, Text } from '@packages/ds-core';
import { IWifiItem, useWifiAction } from '../hooks';
import { useForm } from 'antd/es/form/Form';
import { Button, Form } from 'antd';
import { FormBuilder } from '@packages/react-form-builder';
import { IJoinWifiPayload, IWifiFillPassword } from '../types';
import { t } from 'configs/i18next';

export interface WifiFillPasswordContainerProps {
  className?: string;
  wifi: IWifiItem;
  close?: () => void;
}

export const WifiFillPasswordContainer: React.FC<
  WifiFillPasswordContainerProps
> = ({ className, wifi, close }) => {
  const [form] = useForm();
  const { joinWifi, loading } = useWifiAction(wifi);
  // const { wifiConfig } = useWifiConfigure();

  const handleSaveData = (data: IWifiFillPassword) => {
    const config: IJoinWifiPayload = {
      password: data.password,
      ssid: wifi.ssid,
      // ip_static: {
      //   dns: wifiConfig?.dns,
      //   gw_address: wifiConfig?.gw_address,
      //   ip_address: wifiConfig?.ip_address,
      //   subnet_mask_address: wifiConfig?.subnet_mask_address,
      // },

      // mac_address: wifi.mac_address,
      // rssi: wifi.rssi,
      // security: wifi.security,
    };

    return joinWifi(config).then(close);
  };
  return (
    <Wrapper className={className}>
      <Box marginBottom="s16">
        <Flex direction="column">
          <Text fontSize="m" fontWeight="600">
            {t('wifi_connect_title', {
              field1: wifi.ssid,
            })}
          </Text>
          <Text fontSize="m" fontWeight="600">
            {t('wifi_connect_subTitle')}
          </Text>
        </Flex>
      </Box>
      <Form<IWifiFillPassword>
        layout="vertical"
        form={form}
        onFinish={handleSaveData}
      >
        <FormBuilder<IWifiFillPassword>
          asChild
          configs={{
            password: {
              required: false,
              formType: 'password',
              label: t('password'),
              placeholder: '********',
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', { field: t('password') }),
                },
              ],
            },
          }}
          layouts={[
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
              {t('connect')}
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
