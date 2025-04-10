import { FormBuilder } from '@packages/react-form-builder';
import { Button, Form, FormInstance } from 'antd';
import React from 'react';
import { ILogQueries, ILogSubType, logTypeOptions } from '../types/log_history';
import { t } from 'i18next';
import { FormDateTimePicker, useMedia } from 'modules/_shared';
import { styled } from '@packages/ds-core';
import dayjs from 'dayjs';
import { getDateWithFormat } from 'modules/_shared/helpers/convert';

export interface LogQueryFormProps {
  form?: FormInstance;
  onSubmit?: (values: ILogQueries) => void;
  loading?: boolean;
  initialValues?: ILogQueries;
}

interface FormValues {
  from_time: dayjs.Dayjs;
  to_time: dayjs.Dayjs;
  log_type?: string | null;
}

export const LogQueryForm: React.FC<LogQueryFormProps> = ({
  onSubmit,
  loading,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { mode } = useMedia();

  const submit = (values: FormValues) => {
    const fromDateStr = getDateWithFormat(values.from_time, 'MM/DD/YYYY');
    const fromTimeStr = values.from_time?.format('HH:mm:ss');

    const toDateStr = getDateWithFormat(values.to_time, 'MM/DD/YYYY');
    const toTimeStr = values.to_time?.format('HH:mm:ss');

    onSubmit?.({
      start_date: fromDateStr,
      start_time: fromTimeStr,
      end_date: toDateStr,
      end_time: toTimeStr,
      sub_type: values.log_type as every,
    });
  };

  return (
    <FormBuilder<FormValues & { submit?: boolean }>
      onSubmit={submit}
      form={form}
      configs={{
        log_type: {
          formType: 'select',
          label: t('log_type'),
          options: logTypeOptions as every,
        } as every,

        from_time: {
          formType: 'custom',
          label: t('start_time'),
          render: FormDateTimePicker as every,
        },
        to_time: {
          formType: 'custom',
          label: t('end_time'),
          render: FormDateTimePicker as every,
        },
        submit: {
          formType: 'custom',
          label: mode == 'mobile' ? '' : <React.Fragment />,
          render: () => (
            <SubmitStyled
              type="primary"
              block
              loading={loading}
              htmlType="submit"
            >
              {t('search')}
            </SubmitStyled>
          ),
        },
      }}
      layouts={[
        {
          name: 'log_type',
          span: 24,
          lg: 6,
          md: 24,
        },
        {
          name: 'from_time',
          span: 24,
          lg: 7,
          md: 12,
        },
        {
          name: 'to_time',
          span: 24,
          lg: 7,
          md: 12,
        },
        {
          name: 'submit',
          span: 24,
          lg: 4,
          md: 12,
        },
      ]}
      formLayout="vertical"
      gutter={[24, 16]}
      initialValues={{
        log_type: initialValues?.sub_type ?? null,
        from_time: dayjs(initialValues?.start_date ?? new Date()),
        to_time: dayjs(initialValues?.end_date ?? new Date()).endOf('day'),
      }}
    />
  );
};

const SubmitStyled = styled(Button)`
  padding: 0 !important;
  max-width: 200px;
`;
