import React, { useCallback, useMemo } from 'react';
import { ManualRebootButton, TimeRebootItem } from '../components';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useAutoReboot } from '../hooks';
import { Box, Spinner, styled } from '@packages/ds-core';
import { Button, Form, Switch } from 'antd';
import { t } from 'configs/i18next.ts';
import { PaddingWrapper } from 'modules/_shared';
import { IAutoReboot } from '../types';
import _ from 'lodash';

export interface OperatorRebootContainerProps {
  className?: string;
}

export type IAutoRebootForm = {
  auto_reboot: boolean;
  mode: 'period' | 'daily' | 'weekly' | 'monthly';
  start_time: string;
  wday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  mday: number;
};

const OperatorRebootContainer: React.FC<OperatorRebootContainerProps> = () => {
  const { data, isGetLoading, isUpdateLoading, updateAutoReboot } =
    useAutoReboot();

  const [form] = useForm<IAutoRebootForm>();
  const autoReboot = useWatch('auto_reboot', form);

  const initialValues: IAutoRebootForm = useMemo(
    () => ({
      auto_reboot: data?.auto_reboot || false,
      mode: data?.schedule_time?.mode || 'daily',
      start_time: _.get(
        data,
        'schedule_time.list_day[0].list_time[0].start_time',
        '00:00:00',
      ),
      wday: _.get(data, 'schedule_time.list_day[0].wday', 'Sun'),
      mday: _.get(data, 'schedule_time.list_day[0].mday', 1),
    }),
    [data],
  );

  const getResult = (values: IAutoRebootForm): IAutoReboot => {
    if (!values.auto_reboot) return { auto_reboot: false };

    return {
      auto_reboot: values.auto_reboot,
      schedule_time: {
        mode: values.mode,
        period_time: data?.schedule_time?.period_time || 0,
        list_day: [
          {
            wday: values.wday,
            mday: values.mday,
            list_time: [
              {
                start_time: values.start_time,
                end_time: values.start_time,
              },
            ],
          },
        ],
      },
    };
  };

  const onFinish = useCallback(async (values: IAutoRebootForm) => {
    await updateAutoReboot(getResult(values));
  }, []);

  if (isGetLoading) return <Spinner />;

  return (
    data && (
      <Wrapper>
        <Form
          form={form}
          initialValues={initialValues}
          colon={false}
          labelCol={{ span: 6 }}
          labelAlign={'left'}
          onFinish={onFinish}
          style={{ width: '50rem' }}
        >
          <Form.Item label={t('auto_reboot')} name="auto_reboot">
            <Switch />
          </Form.Item>
          <Form.Item label={t('time')} hidden={!autoReboot}>
            <TimeRebootItem />
          </Form.Item>
          <ButtonWrapper>
            <Button type="primary" htmlType="submit" loading={isUpdateLoading}>
              {t('save')}
            </Button>
            <ManualRebootButton />
          </ButtonWrapper>
        </Form>
      </Wrapper>
    )
  );
};

export default OperatorRebootContainer;

const ButtonWrapper = styled(Box)`
  margin-top: 16px;

  button {
    margin-right: 24px;
  }
`;

const Wrapper = styled(PaddingWrapper)`
  width: 100%;
`;
