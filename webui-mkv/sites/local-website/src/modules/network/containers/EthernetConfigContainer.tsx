import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { IEthernetConfig } from '../types/ethernet';
import { Box, Flex, Spinner } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useEthernetConfigure } from '../hooks';
import {
  gateWayValidator,
  ipValidator,
  subnetMaskValidator,
} from 'modules/_shared/helpers/ip-validator';
import { formGutter } from 'configs/theme';
import { ScreenCenter } from 'modules/_shared';

export interface EthernetConfigContainerProps {
  className?: string;
}

const labelCol = { span: 10 };

export const EthernetConfigContainer: React.FC<
  EthernetConfigContainerProps
> = () => {
  const { loading, ethernetConfig, actionLoading, onUpdate } =
    useEthernetConfigure();
  const [form] = useForm<IEthernetConfig>();
  const dhcp = useWatch(['dhcp'], form);
  const ip_address = useWatch(['ip_address'], form);
  const subnet_mask_address = useWatch(['subnet_mask_address'], form);

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
        initialValues={ethernetConfig}
        onFinish={onUpdate}
        colon={false}
      >
        <FormBuilder<IEthernetConfig>
          asChild
          gutter={formGutter}
          configs={{
            dhcp: {
              formType: 'switch',
              label: 'DHCP',
              onChange: (value) => {
                if (value) {
                  form.setFieldsValue({
                    ip_address: '',
                    subnet_mask_address: '',
                    gw_address: '',
                  });
                }
              },
            },
            ip_address: {
              formType: 'input',
              label: t('ip address'),
              placeholder: '1.2.3.4',
              disabled: dhcp,
              required: false,
              validateFirst: true,
              dependencies: ['dhcp'],
              rules: [
                {
                  required: !dhcp,
                  message: t('pleaseEnterField', { field: t('ip address') }),
                },
                {
                  validator: (_, value) => {
                    if (!dhcp) {
                      const valid = ipValidator(value);
                      if (!valid) {
                        return Promise.reject(
                          new Error(
                            t('fieldIsInvalid', {
                              field: t('ip address'),
                            }),
                          ),
                        );
                      } else {
                        return Promise.resolve();
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
              required: false,
              validateFirst: true,
              dependencies: ['dhcp'],
              rules: [
                {
                  required: !dhcp,
                  message: t('pleaseEnterField', { field: 'Subnet Mask' }),
                },
                {
                  validator: (_, value) => {
                    if (!dhcp) {
                      const valid = subnetMaskValidator(value);
                      if (!valid) {
                        return Promise.reject(
                          new Error(
                            t('fieldIsInvalid', {
                              field: 'Subnet Mask',
                            }),
                          ),
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ],
              disabled: dhcp,
            },
            gw_address: {
              formType: 'input',
              label: 'Gateway',
              placeholder: '1.2.3.4',
              disabled: dhcp,
              required: false,
              validateFirst: true,
              dependencies: ['dhcp', 'ip_address', 'gw_address'],
              rules: [
                {
                  required: !dhcp,
                  message: t('pleaseEnterField', { field: 'Gateway' }),
                },

                {
                  validator: (_, value) => {
                    if (!dhcp) {
                      const valid = gateWayValidator(
                        ip_address,
                        subnet_mask_address,
                        value,
                      );
                      if (!valid) {
                        return Promise.reject(
                          new Error(
                            t('fieldIsInvalid', {
                              field: 'Gateway',
                            }),
                          ),
                        );
                      } else {
                        return Promise.resolve();
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
              name: 'dhcp',
              span: 24,
              align: 'flex-start',
              className: 'custom-switch',
            },
            {
              name: 'ip_address',
              span: 24,
              align: 'flex-start',
            },
            {
              name: 'subnet_mask_address',
              span: 24,
              align: 'flex-start',
            },
            {
              name: 'gw_address',
              span: 24,
              align: 'flex-start',
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
