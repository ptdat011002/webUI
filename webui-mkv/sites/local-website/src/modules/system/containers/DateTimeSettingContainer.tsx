import { Box, styled } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { IDateTimeConfig, TimeZone } from '../types';
import { t } from 'i18next';
import { useForm } from 'antd/es/form/Form';
``;

import { FormDateTimePicker } from 'modules/_shared';
import { Button, Form, Radio } from 'antd';
import { useSystemDateTimeConfig } from '../hooks/useSystemDateTimeConfig';
import dayjs from 'dayjs';
import {
  getDateFromDateFormat,
  getDateWithFormat,
} from 'modules/_shared/helpers/convert';

export interface DateTimeSettingContainerProps {
  className?: string;
}

export const DateTimeSettingContainer: React.FC<
  DateTimeSettingContainerProps
> = ({ className }) => {
  const [form] = useForm<IDateTimeConfig>();

  const isNtpEnable = Form.useWatch('ntp_enable', form);

  const { updateSystemDateTimeConfig, mutate, actionLoading } =
    useSystemDateTimeConfig({
      onSuccess: (data) => {
        const datetimeConfig = data.datetime;
        const ntpConfig = data.ntp;

        const dateStr = getDateFromDateFormat(
          datetimeConfig.date,
          datetimeConfig.date_format,
        );
        const timeStr = datetimeConfig.time;
        const systemTime =
          dateStr && timeStr ? `${dateStr} ${timeStr}` : undefined;

        const system_time = systemTime ? dayjs(systemTime) : undefined;

        form.setFieldsValue({
          ...datetimeConfig,
          system_time: system_time,
          ntp_enable: ntpConfig.ntp_enable ?? false,
          server_address: ntpConfig.server ?? "",
        });
      },
    });

  const onSubmit = async (values: IDateTimeConfig) => {
    const dateStr = getDateWithFormat(values.system_time, values.date_format);
    const timeStr = values.system_time?.format('HH:mm:ss');

    const date = dateStr;
    const time = timeStr;

    await updateSystemDateTimeConfig({
      ...values,
      date,
      time,
    }).then(() => {
      mutate();
    });
  };

  return (
    <Wrapper className={className}>
      <Form
        form={form}
        colon={false}
        layout="horizontal"
        labelCol={{ span: 8 }}
        onFinish={onSubmit}
      >
        <FormBuilder<IDateTimeConfig>
          asChild
          configs={{
            ntp_enable: {
              formType: 'custom',
              label: t('setting_time'),
              render: ({ value, ...props }) => {
                return (
                  <Radio.Group
                    value={value}
                    {...(props as every)}
                    options={[
                      {
                        label: t('manual'),
                        value: false,
                      },
                      {
                        label: t('sync_with_server'),
                        value: true,
                      },
                    ]}
                  />
                );
              },
            },
            date_format: {
              formType: 'select',
              label: t('date_format'),
              options: [
                {
                  value: 'MM/DD/YYYY',
                },
                {
                  value: 'YYYY-MM-DD',
                },
                {
                  value: 'DD/MM/YYYY',
                },
              ],
            },
            time_zone: {
              formType: 'select',
              label: t('time_zone'),

              options: [
                ...Object.keys(TimeZone).map((key) => ({
                  label: key,
                  value: TimeZone[key as keyof typeof TimeZone],
                })),
              ],
            },

            time_format: {
              formType: 'select',
              label: t('time_format'),

              options: [
                {
                  value: 12,
                  label: t('dynamic_hour', {
                    hour: 12,
                  }),
                },
                {
                  value: 24,
                  label: t('dynamic_hour', {
                    hour: 24,
                  }),
                },
              ],
            },

            system_time: {
              disabled: isNtpEnable,
              formType: 'custom',
              label: t('system_time'),
              render: FormDateTimePicker as every,
            },

            server_address: {
              disabled: !isNtpEnable,
              formType: 'select',
              label: t('server_address'),
              defaultActiveFirstOption: true,
              options: [
                {
                  value: 'Pool.ntp.org',
                },
                {
                  value: 'Time.windows.com',
                },
                {
                  value: 'Time.nist.gov',
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'ntp_enable',
              span: 24,
            },
            {
              name: 'date_format',
              span: 24,
            },
            {
              name: 'time_zone',
              span: 24,
            },
            {
              name: 'time_format',
              span: 24,
            },
            {
              name: 'system_time',
              span: 24,
            },
            {
              name: 'server_address',
              span: 24,
            },
          ]}
        />

        <Box marginTop={'s20'}>
          <Button type="primary" htmlType="submit" loading={actionLoading}>
            {t('save')}
          </Button>
        </Box>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)``;
