import { ConfigProvider, Flex, Popover, Table, Typography } from 'antd';
import { ILog } from '../types/log_history';
import { t } from 'i18next';
import { Pagination } from 'modules/_shared';
import { Box, Spinner, styled, Text } from '@packages/ds-core';
import React from 'react';

export interface LogDataTableProps {
  currentPage?: number;
  logs: ILog[];
  total?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  loading?: boolean;
}

export const LogDataTable: React.FC<LogDataTableProps> = ({
  currentPage = 1,
  pageSize = 10,
  logs,
  loading,
  total,
  onPageChange,
}) => {
  return (
    <Wrapper>
      <ConfigProvider
        spin={{
          indicator: <Spinner />,
        }}
        renderEmpty={() => {
          return (
            <Box
              style={{
                minHeight: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text color="light">{t('no_data')}</Text>
            </Box>
          );
        }}
      >
        <Table<ILog>
          bordered
          dataSource={logs}
          scroll={{ x: '100%' }}
          pagination={false}
          columns={[
            {
              title: t('index'),
              render: (_, __, index) =>
                index + 1 + (currentPage - 1) * pageSize,
            },
            {
              title: t('log_time'),
              dataIndex: 'time',
              width: '25%',
              render: (_, record) => {
                return `${record.start_time} ${record.start_date}`;
              },
            },
            {
              title: t('log_content'),
              width: '20%',
              dataIndex: 'content',
              render: (_, record) => {
                return record.sub_type;
              },
            },
            {
              title: t('log_information'),
              width: '40%',
              dataIndex: 'information',
              render: (_, record) => {
                return (
                  <Typography.Paragraph
                    ellipsis={{
                      rows: 3,
                      expandable: true,
                      suffix: '',
                    }}
                  >
                    {JSON.stringify(record.information)}
                  </Typography.Paragraph>
                );
              },
            },
          ]}
          loading={loading}
        />
      </ConfigProvider>
      <Box marginTop="s16">
        <Flex justify="end">
          <Pagination
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </Flex>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  max-width: 100%;
`;
