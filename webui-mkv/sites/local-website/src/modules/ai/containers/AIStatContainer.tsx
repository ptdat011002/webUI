import React from 'react';
import { PaddingWrapper } from 'modules/_shared';
import { useForm } from 'antd/es/form/Form';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { FormBuilder } from '@packages/react-form-builder';
import { t } from 'configs/i18next.ts';
import { formGutter } from '../../../configs/theme.tsx';
import { Flex } from '@packages/ds-core';
import {
  FeatureType,
  ISearchLoggerRequest,
  IStatsSetting,
  TimeFormat,
} from '../types/stats.ts';
import dayjs from 'dayjs';
import { useAiStats } from '../hooks';
import { getRangeFromDateAndType } from '../helpers/datetime.ts';

const labelCol = { span: 8 };

export const AIStatContainer: React.FC = () => {
  const [form] = useForm<IStatsSetting>();

  const { triggerExportData, actionLoading } = useAiStats();
  const dateNow = new Date();

  const handleSubmit = async (value: IStatsSetting) => {
    const date = getRangeFromDateAndType(value.date, value.time);

    const payload: ISearchLoggerRequest = {
      // string(dd/mm/year)
      start_date: date.startDate.format('YYYY-MM-DD'),
      end_date: date.endDate.format('YYYY-MM-DD'),
      // string(hh/mm/ss)
      start_time: date.startDate.format('HH:mm:ss'),
      end_time: date.endDate.format('HH:mm:ss'),
      main_type: 'Event',
      sub_type: value.type,
    };

    return triggerExportData(payload, value.file_name);
  };
  return (
    <PaddingWrapper>
      <Form<IStatsSetting>
        form={form}
        layout="horizontal"
        labelCol={labelCol}
        colon={false}
        initialValues={{
          date: dayjs(dateNow),
          time: TimeFormat.day,
          type: FeatureType.all,
          file_name: '',
        }}
        style={{ width: '70%' }}
        onFinish={handleSubmit}
      >
        <FormBuilder<IStatsSetting>
          asChild
          gutter={formGutter}
          configs={{
            date: {
              formType: 'custom',
              label: t('time'),
              render: ({ value, ...props }) => {
                return (
                  <Flex gapX="s16">
                    <Form.Item name="date" {...props}>
                      <DatePicker />
                    </Form.Item>
                    <Form.Item name="time" {...props}>
                      <Select
                        style={{ width: 100 }}
                        options={Object.values(TimeFormat).map((value) => ({
                          value,
                          label: t(value),
                        }))}
                      />
                    </Form.Item>
                  </Flex>
                );
              },
            },
            type: {
              formType: 'select',
              label: t('feature_type'),
              options: [
                {
                  value: FeatureType.all,
                  label: t('all'),
                },
                {
                  value: FeatureType.face_detection,
                  label: t('face_detection'),
                },
                {
                  value: FeatureType.face_recognition,
                  label: t('face_recognition'),
                },
                {
                  value: FeatureType.crowd_detection,
                  label: t('crowd_detection'),
                },
                {
                  value: FeatureType.move_detection,
                  label: t('move_detection'),
                },
                {
                  value: FeatureType.hurdle_detection,
                  label: t('hurdle_detection'),
                },
                {
                  value: FeatureType.person_counting,
                  label: t('person_counting'),
                },
                {
                  value: FeatureType.intrusion_detection,
                  label: t('intrusion_detection'),
                },
              ],
            },
            file_name: {
              formType: 'custom',
              label: t('file_name'),
              required: true,
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', { field: t('file_name') }),
                },
              ],
              render: ({ value, ...props }) => {
                return (
                  <Flex gapX="s16">
                    <Form.Item name="file_name" {...props}>
                      <Input style={{ width: 300 }} />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={actionLoading}
                    >
                      {t('download_file')}
                    </Button>
                  </Flex>
                );
              },
            },
          }}
          layouts={[
            {
              name: 'date',
              span: 24,
            },
            {
              name: 'type',
              span: 24,
            },
            {
              name: 'file_name',
              span: 24,
            },
          ]}
        />
      </Form>
    </PaddingWrapper>
  );
};
