import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { Box, Flex, Spinner } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { t } from 'configs/i18next';
import { useForm, useWatch } from 'antd/es/form/Form';
import { ipValidator } from 'modules/_shared/helpers/ip-validator';
import { formGutter } from 'configs/theme';
import { ScreenCenter } from 'modules/_shared';
import { useFTPConfigure } from '../hooks';
import { IFTPConfig } from '../types';

export interface FTPConfigContainerProps {
  className?: string;
}

const labelCol = { span: 10 };

export const FTPConfigContainer: React.FC<FTPConfigContainerProps> = () => {
  const { loading, data, onUpdate, actionLoading } = useFTPConfigure();
  const [form] = useForm<IFTPConfig>();
  const ftpEnable = useWatch('ftp_enable', form);

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
        initialValues={data}
        onFinish={onUpdate}
        colon={false}
      >
        <FormBuilder<IFTPConfig>
          asChild
          gutter={formGutter}
          configs={{
            ftp_enable: {
              formType: 'switch',
              label: 'FTP Client',
            },
            server_ip: {
              formType: 'input',
              label: t('server_address'),
              placeholder: '1.2.3.4',
              disabled: ftpEnable,
              required: false,
              validateFirst: true,
              rules: [
                {
                  required: ftpEnable,
                  message: t('fieldIsRequired', { field: 'server_address' }),
                },
                {
                  validator: (_, value) => {
                    if (value) {
                      const isIpValid = ipValidator(value);
                      if (!isIpValid) {
                        return Promise.reject(
                          t('fieldIsInvalid', { field: 'server_address' }),
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ],
            },
            username: {
              formType: 'input',
              label: t('accountName'),
              placeholder: 'admin',
              disabled: ftpEnable,
            },
            password: {
              formType: 'password',
              label: t('password'),
              disabled: ftpEnable,
              placeholder: '********',
              required: false,
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
              name: 'ftp_enable',
              span: 24,
            },
            {
              name: 'server_ip',
              span: 24,
            },
            {
              name: 'username',
              span: 24,
            },
            {
              name: 'password',
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
