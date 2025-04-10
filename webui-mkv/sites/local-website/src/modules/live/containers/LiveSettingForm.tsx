import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Form, Input, Switch } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { t } from 'configs/i18next.ts';
import { Box, Spinner } from '@packages/ds-core';
import { useOnScreenDisplay } from '../hooks';
import { IOSDConfig, IOSDConfigRequest } from '../types';

export interface LiveSettingFormProps {
  className?: string;
  setOsdConfig: (config?: IOSDConfig) => void;
}

export interface ILiveVideoForm {
  enable: boolean;
  name: string;
  date_format: string;
  time_format: string;
  show_name: boolean;
  show_time: boolean;
}

export const LiveSettingForm: React.FC<LiveSettingFormProps> = ({
  setOsdConfig,
}) => {
  const {
    loading: isUpdating,
    isLoading: isFetching,
    data,
    updateOSD,
  } = useOnScreenDisplay();

  const [form] = useForm();
  const enable = useWatch('enable', form);

  const initialValues = useMemo(
    () => ({
      enable: data?.enable || false,
      name: data?.display_name || '',
      show_name: data?.name.show || false,
      show_time: data?.datetime.show || false,
    }),
    [data],
  );

  useEffect(() => {
    if (!data) return;
    setOsdConfig(data);
  }, [data]);

  const onFinish = useCallback(async (values: ILiveVideoForm) => {
    const payload: IOSDConfigRequest = {
      enable: values.enable,
      display_name: values.name,
      name: {
        show: values.show_name,
        position: data?.name.position || { x: 0, y: 0 },
      },
      datetime: {
        show: values.show_time,
        position: data?.datetime.position || { x: 0, y: 0 },
      },
      logo: {
        show: data?.logo.show || false,
        position: data?.logo.position || { x: 0, y: 0 },
      },
    };
    await updateOSD(payload);
  }, []);

  if (isFetching) return <Spinner />;

  return (
    <Form
      form={form}
      colon={false}
      labelCol={{ span: 10 }}
      initialValues={initialValues}
      onFinish={onFinish}
      labelAlign={'left'}
      onValuesChange={(_, allValues) => {
        if (!data) return;

        const updatedConfig = {
          ...data,
          enable: allValues.enable,
          display_name: allValues.name,
          name: {
            ...data.name,
            show: allValues.enable ? allValues.show_name : false,
          },
          datetime: {
            ...data.datetime,
            show: allValues.enable ? allValues.show_time : false,
          },
        };

        setOsdConfig(updatedConfig);
      }}
    >
      <Form.Item label={t('show')} name={'enable'}>
        <Switch />
      </Form.Item>

      <Form.Item
        label={t('Name')}
        name={'name'}
        hidden={!enable}
        rules={[
          {
            validator: (_, value) => {
              // if (value.length < 1) {
              //   return Promise.reject(t('minLength', { length: 1 }));
              // }
              if (value.length > 12) {
                return Promise.reject(t('maxLength', { length: 12 }));
              }
              // if (value[0] === ' ') {
              //   return Promise.reject(t('firstCharIsNotSpace'));
              // }
              if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                return Promise.reject(t('onlyAlphanumeric'));
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t('Show Name')} name={'show_name'} hidden={!enable}>
        <Switch />
      </Form.Item>

      <Form.Item label={t('Show Time')} name={'show_time'} hidden={!enable}>
        <Switch />
      </Form.Item>

      <Box marginTop="s24">
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};
