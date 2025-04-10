import React from 'react';
import { Box, Flex, styled, Text } from '@packages/ds-core';
import {
  eventVideoRecordType,
  IRecordForm,
  IRecordSearch,
  IRecordSearchRequest,
  normalVideoRecordType,
} from '../types';
import { useRecordSearch } from '../hooks';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { t } from 'configs/i18next.ts';
import CheckBoxAndSelect from '../components/CheckBoxAndSelect.tsx';
import dayjs from 'dayjs';
import { FormItemCalendar } from 'modules/_shared/components/FormItemCalendar.tsx';

export interface PlaybackSearchContainerProps {
  className?: string;
  onData?: (data: IRecordSearch[]) => void;
}

export const PlaybackSearchContainer: React.FC<
  PlaybackSearchContainerProps
> = ({ className, onData }) => {
  const [form] = useForm();

  const { actionSearch, actionLoading } = useRecordSearch();

  const handleSearch = async (values: IRecordForm) => {
    const allRecordType = [
      ...values.record_type_normal,
      ...values.record_type_event,
    ];

    const recordTypeBit = allRecordType.reduce((acc, cur) => acc | cur, 0);
    const startTime = values.date_time.startOf('day').format("YYYY-MM-DD HH:mm:ss");
    const endTime = values.date_time.endOf('day').format("YYYY-MM-DD HH:mm:ss");

    const payload: IRecordSearchRequest = {
      // epoch time
      start_time: startTime,
      end_time: endTime,
      // Todo: Bitwise OR
      record_type: recordTypeBit,
    };

    const data = await actionSearch(payload);

    onData && onData(data || []);
  };
  return (
    <Wrapper className={className}>
      <Form<IRecordForm>
        form={form}
        colon={false}
        onFinish={handleSearch}
        initialValues={{
          date_time: dayjs(),
        }}
      >
        <Flex gapY="s12" direction="column">
          <Form.Item name="date_time">
            <FormItemCalendar fullscreen={false} />
          </Form.Item>
          <Text>{t('search_type')}</Text>
          <Form.Item name="record_type_normal">
            <CheckBoxAndSelect
              options={normalVideoRecordType}
              hint={t('normal_video')}
            />
          </Form.Item>
          <Form.Item name="record_type_event">
            <CheckBoxAndSelect
              options={eventVideoRecordType}
              hint={t('event_video')}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={actionLoading}>
            {t('search')}
          </Button>
        </Flex>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  box-sizing: border-box;
  background-color: #333333;
  border-radius: 12px;
  flex-direction: column;
  padding: 1rem 1rem;
`;
