import React from 'react';
import { Button, ConfigProvider, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AccountRole, IAccountInfo } from '../types';
import { t } from 'configs/i18next';
import { Box, Flex, Spinner, Text, styled } from '@packages/ds-core';

import { ModalWrapper, ScreenCenter } from 'modules/_shared';
import { AccountChangePasswordContainer } from './AccountChangePasswordContainer';
import { useModal } from '@packages/react-modal';
import {
  EditOutlined,
  PasswordOutlined,
  SettingsOutlined,
} from '@packages/ds-icons';
import { useAccounts } from '../hooks';
import { AccountUpdatePermissionContainer } from './AccountUpdatePermissionContainer.tsx';
import { AccountUpdateInfoContainer } from './AccountUpdateInfoContainer.tsx';

const actions: Record<AccountRole, Array<'edit' | 'password' | 'setting'>> = {
  [AccountRole.Admin]: ['password'],
  [AccountRole.User]: ['edit', 'password', 'setting'],
};

export interface UserListContainerProps {
  className?: string;
}

export const UserListContainer: React.FC<UserListContainerProps> = ({
  className,
}) => {
  const modal = useModal();

  const { accountData, loading } = useAccounts();

  const uiLoading = loading;

  const dataSource: IAccountInfo[] = Object.entries(
    accountData ?? {},
  ).map<IAccountInfo>((item) => ({
    ...item[1],
    role: item[0] === AccountRole.Admin ? AccountRole.Admin : AccountRole.User,
    userKey: item[0],
  }));
  const columns: ColumnsType<IAccountInfo> = [
    {
      title: t('stt'),
      dataIndex: 'stt',
      render: (_value, _record, index) => index + 1,
      key: 'stt',
      align: 'center',
      width: '10%',
    },
    {
      title: <Text whiteSpace="nowrap">{t('username')}</Text>,
      dataIndex: 'username',
      key: 'username',
      width: '35%',
    },
    {
      title: <Text whiteSpace="nowrap">{t('role')}</Text>,
      dataIndex: 'role',
      key: 'role',
      width: '15%',
      align: 'center',
      render: (_value, _record) => {
        return _record.role === AccountRole.Admin ? 'Admin' : 'User';
      },
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      align: 'center',
      render: (_value, _record) => (
        <Tag bordered={false} color={_record.user_enable ? 'success' : 'error'}>
          <Text color="darkA400">
            {_record.user_enable ? t('active') : t('inactive')}
          </Text>
        </Tag>
      ),
    },
    {
      title: t('action'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '30%',
      render: (_value, record) => (
        <Box
          style={{
            maxWidth: '100%',
          }}
          padding={['s2', 's4']}
        >
          <Flex justify="space-around" block>
            {actions[record.role].map((action) => {
              switch (action) {
                case 'edit':
                  return (
                    <Tooltip title={t('edit')}>
                      <Button
                        icon={<EditOutlined size={24} />}
                        type="text"
                        size="small"
                        onClick={() => handleOnclickEdit(record)}
                      />
                    </Tooltip>
                  );
                case 'password':
                  return (
                    <Tooltip title={t('changePassword')}>
                      <Button
                        icon={<PasswordOutlined size={24} />}
                        type="text"
                        size="small"
                        onClick={() => handleOnclickPassword(record)}
                      />
                    </Tooltip>
                  );
                case 'setting':
                  return (
                    <Tooltip title={t('permission')}>
                      <Button
                        icon={<SettingsOutlined size={26} />}
                        type="text"
                        size="small"
                        onClick={() => handleOnclickSetting(record)}
                      />
                    </Tooltip>
                  );
                default:
                  return null;
              }
            })}
          </Flex>
        </Box>
      ),
    },
  ];
  const handleOnclickEdit = (account: IAccountInfo) => {
    modal.show({
      title: t('editUser'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200, maxWidth: '100%' }}>
            <AccountUpdateInfoContainer
              account={account}
              close={close}
              userKey={account.userKey}
            />
          </div>
        </ModalWrapper>
      ),
    });
  };

  const handleOnclickPassword = (account: IAccountInfo) => {
    modal.show({
      title: t('changePassword'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200, maxWidth: '100%' }}>
            <AccountChangePasswordContainer account={account} close={close} />
          </div>
        </ModalWrapper>
      ),
    });
  };
  const handleOnclickSetting = (account: IAccountInfo) => {
    modal.show({
      title: t('permission'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200, maxWidth: '100%' }}>
            <AccountUpdatePermissionContainer account={account} close={close} />
          </div>
        </ModalWrapper>
      ),
    });
  };
  if (uiLoading) {
    return (
      <ScreenCenter>
        <Spinner />
      </ScreenCenter>
    );
  }

  return (
    <Wrapper className={className}>
      <ConfigProvider
        renderEmpty={() => (
          <Box padding="s32">
            <Text fontSize="s" color="textPrimary">
              {t('no_data')}
            </Text>
          </Box>
        )}
      >
        <Table<IAccountInfo>
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
        />
      </ConfigProvider>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  width: 100%;
  max-width: 100% !important;
  overflow: auto;
  background-color: #333;
  border-radius: 12px;
`;
