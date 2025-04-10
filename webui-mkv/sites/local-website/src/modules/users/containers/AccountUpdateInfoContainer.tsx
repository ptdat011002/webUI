import React from 'react';
import { Box, Flex, styled } from '@packages/ds-core';
import { IAccountInfo, IAccountUpdateInfo, UserState } from '../types';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useAccount } from '../hooks';
import { FormBuilder } from '@packages/react-form-builder';
import { t } from 'configs/i18next';
import { userEnableArray } from '../constants.ts';

export interface AccountUpdateInfoContainerProps {
  className?: string;
  account: IAccountInfo;
  close?: () => void;
  userKey: string;
}

export const AccountUpdateInfoContainer: React.FC<
  AccountUpdateInfoContainerProps
> = ({ className, account, close, userKey }) => {
  const [form] = useForm();
  const { actionLoading, updateAccount } = useAccount();

  const handleSaveData = async (value: IAccountUpdateInfo) => {
    const user_info = {
      [userKey]: {
        ...account,
        username: value.userName,
        user_enable: value.isUserEnabled === UserState.Active,
      },
    };

    return updateAccount({
      user_info: user_info,
      type: 'LockUser',
    }).then(close);
  };
  return (
    <Wrapper className={className}>
      <Form<IAccountUpdateInfo>
        layout="vertical"
        form={form}
        onFinish={handleSaveData}
        initialValues={{
          userName: account.username,
          isUserEnabled: account.user_enable
            ? UserState.Active
            : UserState.Inactive,
        }}
      >
        <FormBuilder<IAccountUpdateInfo>
          asChild
          configs={{
            userName: {
              formType: 'input',
              label: t('accountName'),
              required: false,
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', {
                    field: t('accountName'),
                  }),
                },
              ],
              disabled: true,
            },
            isUserEnabled: {
              formType: 'select',
              label: t('status'),
              options: Object.values(UserState).map((status) => ({
                label: userEnableArray[status],
                value: status,
              })),
            },
          }}
          layouts={[
            {
              name: 'userName',
              span: 24,
            },

            {
              name: 'isUserEnabled',
              span: 24,
            },
          ]}
          // formLayout="vertical"
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
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 2rem;
  box-sizing: border-box;
`;
