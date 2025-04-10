import React from 'react';
import { Text } from '@packages/ds-core';
import { ColumnsType } from 'antd/es/table';
import { IStorage, IStorageInfo } from '../types';
import { t } from 'configs/i18next.ts';
import { Table, Tag } from 'antd';
import { DateTime } from '../../_shared';

const mapStatusUi = (value: boolean) => {
  switch (value) {
    case true:
      return {
        backgroundColor: '#C72305',
        text: t('fullMemory'),
      };
    case false:
      return {
        backgroundColor: '#3EDB56',
        text: t('notFullMemory'),
      };
  }
};

const mapType = (value: string) => {
  switch (value) {
    case 'ReadAndWrite':
      return t('readAndWrite');
    default:
      return t('unknown');
  }
};

const convertMbToGb = (value: number) => Math.round(value / 1024);

const columns: ColumnsType<IStorageInfo> = [
  {
    title: 'STT',
    dataIndex: 'stt',
    render: (_, __, index) => index + 1,
    key: 'stt',
    align: 'center',
    width: '10%',
  },
  {
    title: <Text whiteSpace="nowrap">{t('memory')}</Text>,
    dataIndex: 'memory',
    key: 'memory',
    align: 'center',
    render: () => 'HD1',
  },
  {
    title: t('type'),
    dataIndex: 'rw_type',
    key: 'rw_type',
    align: 'center',
    render: (value) => mapType(value),
  },
  {
    title: <Text whiteSpace="nowrap">{t('status')}</Text>,
    dataIndex: 'format_enable',
    key: 'format_enable',
    render: (value) => {
      const { backgroundColor, text } = mapStatusUi(value);
      return (
        <Tag color={backgroundColor}>
          <Text color="darkA400">{text}</Text>
        </Tag>
      );
    },
    align: 'center',
  },
  {
    title: <Text whiteSpace="nowrap">{t('usedCapacity')}</Text>,
    dataIndex: 'usedSize',
    key: 'usedSize',
    align: 'center',
    render: (_, record) =>
      `${convertMbToGb(
        (record?.total_size || 0) - (record?.free_size || 0),
      )}G/${convertMbToGb(record?.total_size || 0)}G`,
  },
  {
    title: <Text whiteSpace="nowrap">{`${t('recordedCapacity')}`}</Text>,
    dataIndex: 'usedTime',
    key: 'usedTime',
    align: 'center',
    render: (_, record) =>
      `${DateTime.formatTime(
        (record?.total_time || 0) - (record?.free_time || 0),
      )}${t('hour')}/${DateTime.formatTime(record?.total_time || 0)}${t(
        'hour',
      )}`,
  },
];

export interface StorageInformationTableProps {
  className?: string;
  onRowSelect?: (records: IStorageInfo[]) => void;
  data?: IStorage;
}

export const StorageInformationTable: React.FC<
  StorageInformationTableProps
> = ({ onRowSelect, data }) => {
  return (
    <Table<IStorageInfo>
      rowSelection={{
        onChange: (_, selectedRows) => onRowSelect?.(selectedRows),
      }}
      columns={columns}
      dataSource={!!data?.storage_info ? [data.storage_info] : []}
      pagination={false}
      bordered
      scroll={{
        x: '100%',
      }}
    />
  );
};
