import React from 'react';
import {
  IAccountInfo,
  IAccountUpdatePermission,
  ISetAccountRequest,
} from '../types';
import { Box, Flex, styled, Text } from '@packages/ds-core';
import { Button, Form } from 'antd';
import { FormBuilder } from '@packages/react-form-builder';
import { useForm } from 'antd/es/form/Form';
import { useAccount } from '../hooks';
import { t } from 'i18next';
import _ from 'lodash';

export interface AccountUpdatePermissionContainerProps {
  account: IAccountInfo;
  className?: string;
  close?: () => void;
}

export const AccountUpdatePermissionContainer: React.FC<
  AccountUpdatePermissionContainerProps
> = ({ className, account, close }) => {
  const [form] = useForm();
  const { actionLoading, updateAccount } = useAccount();

  const handleSaveData = (value: IAccountUpdatePermission) => {
    const payload: ISetAccountRequest = {
      type: 'SavePermission',
      user_info: {
        [account.userKey]: {
          ...account,
          permission: {
            ...value,
          },
        },
      },
    };

    return updateAccount(payload).then(close);
  };

  const handleOnChangeForm = (value, values) => {
    if (value.all !== undefined) {
      form.setFieldsValue({
        record_enable: value.all,
        event_enable: value.all,
        ai_enable: value.all,
        live_enable: value.all,
        playback_enable: value.all,
        system_config: value.all,
        device_config: value.all,
        network_config: value.all,
        stream_config: value.all,
      });

      return;
    }

    // skip param all and check all status is true -> all is true
    const allStatus = _.omit(values, 'all');
    const isAllTrue = Object.values(allStatus).every((v) => v === true);

    form.setFieldsValue({
      all: isAllTrue,
    });
  };
  return (
    <Wrapper className={className}>
      <Box marginBottom="s16">
        <Box marginBottom="s16">
          <Text fontSize="m" fontWeight="600">{`${t('username')}: ${
            account.username
          }`}</Text>
        </Box>
        <Form<IAccountUpdatePermission>
          layout="horizontal"
          form={form}
          onFinish={handleSaveData}
          onValuesChange={handleOnChangeForm}
          colon={false}
          initialValues={{
            ...account.permission,
            all:
              account.permission !== null && account.permission !== undefined
                ? Object.values(account.permission).every((v) => v === true)
                : false,
          }}
        >
          <FormBuilder<IAccountUpdatePermission>
            asChild
            configs={{
              all: {
                formType: 'checkbox',
                children: t('all'),
              },
              record_enable: {
                formType: 'checkbox',
                children: t('recordEnable'),
              },
              event_enable: {
                formType: 'checkbox',
                children: t('eventEnable'),
              },
              ai_enable: {
                formType: 'checkbox',
                children: t('aiEnable'),
              },
              live_enable: {
                formType: 'checkbox',
                children: t('liveEnable'),
              },
              playback_enable: {
                formType: 'checkbox',
                children: t('playbackEnable'),
              },
              system_config: {
                formType: 'checkbox',
                children: t('systemConfig'),
              },
              device_config: {
                formType: 'checkbox',
                children: t('deviceConfig'),
              },
              network_config: {
                formType: 'checkbox',
                children: t('networkConfig'),
              },
              stream_config: {
                formType: 'checkbox',
                children: t('streamConfig'),
              },
            }}
            layouts={[
              {
                name: 'all',
                span: 12,
              },
              {
                name: 'live_enable',
                span: 12,
              },
              {
                name: 'playback_enable',
                span: 12,
              },
              {
                name: 'system_config',
                span: 12,
              },
              {
                name: 'device_config',
                span: 12,
              },
              {
                name: 'network_config',
                span: 12,
              },
              {
                name: 'stream_config',
                span: 12,
              },
              {
                name: 'record_enable',
                span: 12,
              },
              {
                name: 'event_enable',
                span: 12,
              },
              {
                name: 'ai_enable',
                span: 12,
              },
            ]}
          />
          <Box marginTop="s32">
            <Flex gapX="s16">
              <Button type="primary" block ghost onClick={close}>
                {t('cancel')}
              </Button>
              <Button
                type="primary"
                block
                htmlType="submit"
                loading={actionLoading}
              >
                {t('save')}
              </Button>
            </Flex>
          </Box>
        </Form>
      </Box>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 2rem;
  box-sizing: border-box;
`;
