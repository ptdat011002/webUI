import { Box, Flex, styled, Text } from '@packages/ds-core';
import React from 'react';
import { IAccountChangePassword, IAccountInfo } from '../types';
import { Button, Form } from 'antd';
import { FormBuilder } from '@packages/react-form-builder';
import { t } from 'configs/i18next';
import { useForm } from 'antd/es/form/Form';
import { useAccount } from '../hooks';

export interface AccountChangePasswordContainerProps {
  className?: string;
  account: IAccountInfo;
  close?: () => void;
}

export const AccountChangePasswordContainer: React.FC<
  AccountChangePasswordContainerProps
> = ({ className, account, close }) => {
  const [form] = useForm();
  const { actionLoading, updateAccountChangePassword } = useAccount();

  const handleSaveData = (value: IAccountChangePassword) =>
    updateAccountChangePassword(value, account).then(close);
  return (
    <Wrapper className={className}>
      <Box marginBottom="s16">
        <Text fontSize="m" fontWeight="600">{`${t('username')}: ${
          account.username
        }`}</Text>
      </Box>
      <Form<IAccountChangePassword>
        layout="vertical"
        form={form}
        onFinish={handleSaveData}
      >
        <FormBuilder<IAccountChangePassword>
          asChild
          configs={{
            password: {
              required: false,
              formType: 'password',
              label: t('password'),
              // validateFirst: true,
              placeholder: '********',
              validateDebounce: 500,
              // rules: [
              //   {
              //     required: true,
              //     message: t('fieldIsRequired', { field: t('password') }),
              //   },
              // ],
            },
            newPassword: {
              required: false,
              formType: 'password',
              label: t('newPassword'),
              placeholder: '********',
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', { field: t('password') }),
                },
                {
                  /** include upercase, lowercase, number, min 8 lenght, ,max 32, include special charactor */
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                  message: t('fieldIsInvalid', { field: t('password') }),
                },
              ],
            },
            confirmPassword: {
              formType: 'password',
              label: t('confirmPassword'),
              required: false,
              dependencies: ['newPassword'],
              placeholder: '********',
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', { field: t('password') }),
                },
                {
                  validator: async (_, value) => {
                    console.log(value, form.getFieldValue('newPassword'));

                    if (value !== form.getFieldValue('newPassword')) {
                      return Promise.reject(t('passwordNotMatch'));
                    }
                    return Promise.resolve();
                  },
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'password',
              span: 24,
            },
            {
              name: 'newPassword',
              span: 24,
            },
            {
              name: 'confirmPassword',
              span: 24,
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 2rem;
  box-sizing: border-box;
`;
