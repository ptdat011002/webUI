import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { IWifiSettingConfig } from '../types/wifi';
import { Box, Flex, Spinner } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next';
import WifiConnectionConfigContainer from './WifiConnectionConfigContainer';
import { useWifiConfigure } from '../hooks/useWifiConfigure';
import { useForm, useWatch } from 'antd/es/form/Form';
import {
  gateWayValidator,
  ipValidator,
  subnetMaskValidator,
} from 'modules/_shared/helpers/ip-validator';
import { ScreenCenter } from 'modules/_shared';

export interface WifiConfigContainerProps {
  className?: string;
}

const labelCol = { span: 10 };

export const WifiConfigContainer: React.FC<WifiConfigContainerProps> = () => {
  const { loading, wifiConfig, actionLoading, onUpdate } = useWifiConfigure();
  const [form] = useForm<IWifiSettingConfig>();
  const dhcp = useWatch('dhcp', form);
  const ip_address = useWatch('ip_address', form);
  const subnet_mask_address = useWatch('subnet_mask_address', form);

  if (loading)
    return (
      <ScreenCenter>
        <Spinner />
      </ScreenCenter>
    );

  return (
    <div>
      <Form
        initialValues={wifiConfig}
        form={form}
        labelCol={labelCol}
        colon={false}
        onFinish={onUpdate}
      >
        <FormBuilder<IWifiSettingConfig>
          asChild
          configs={{
            enable: {
              label: 'Wifi',
              formType: 'custom',
              render: ({ value, onChange }) => (
                <WifiConnectionConfigContainer
                  enable={value}
                  onEnableChange={onChange}
                />
              ),
            },
            dhcp: {
              formType: 'switch',
              label: 'DHCP',
            },
            ip_address: {
              formType: 'input',
              label: t('ip address'),
              placeholder: '1.2.3.4',
              disabled: dhcp,
              validateFirst: true,
              dependencies: ['dhcp'],
              required: false,
              rules: [
                {
                  required: !dhcp,
                  message: t('pleaseEnterField', { field: t('ip address') }),
                },
                {
                  validator: (_, value) => {
                    if (dhcp) {
                      return Promise.resolve();
                    }
                    if (value) {
                      const isIpValid = ipValidator(value);
                      if (!isIpValid) {
                        return Promise.reject(
                          new Error(
                            t('field is incorrect.please input again', {
                              field: 'IP Address',
                            }),
                          ),
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ],
            },
            subnet_mask_address: {
              formType: 'input',
              label: 'Subnet Mask',
              placeholder: '1.2.3.4',
              disabled: dhcp,
              validateFirst: true,
              required: false,
              dependencies: ['dhcp'],
              rules: [
                {
                  required: !dhcp,
                  message: t('pleaseEnterField', { field: 'Subnet Mask' }),
                },
                {
                  validator: (_, value) => {
                    if (dhcp) {
                      return Promise.resolve();
                    }
                    if (value) {
                      const isIpValid = subnetMaskValidator(value);
                      if (!isIpValid) {
                        return Promise.reject(
                          new Error(
                            t('field is incorrect.please input again', {
                              field: 'Subnet Mask',
                            }),
                          ),
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ],
            },
            gw_address: {
              formType: 'input',
              label: 'Gateway',
              placeholder: '1.2.3.4',
              disabled: dhcp,
              validateFirst: true,
              required: false,
              dependencies: ['dhcp', 'ip_address', 'subnet_mask_address'],
              rules: [
                {
                  required: !dhcp,
                  message: t('pleaseEnterField', { field: 'Subnet Mask' }),
                },
                {
                  validator: (_, value) => {
                    if (dhcp) {
                      return Promise.resolve();
                    }
                    if (value) {
                      const isIpValid = gateWayValidator(
                        ip_address,
                        subnet_mask_address,
                        value,
                      );
                      if (!isIpValid) {
                        return Promise.reject(
                          new Error(
                            t('field is incorrect.please input again', {
                              field: 'Gateway',
                            }),
                          ),
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'enable',
              span: 24,
              className: 'custom-switch',
            },
            {
              name: 'dhcp',
              span: 24,
              className: 'custom-switch',
            },
            {
              name: 'ip_address',
              span: 24,
            },
            {
              name: 'subnet_mask_address',
              span: 24,
            },
            {
              name: 'gw_address',
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
