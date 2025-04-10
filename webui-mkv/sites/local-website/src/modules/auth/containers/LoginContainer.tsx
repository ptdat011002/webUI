import { Box, Flex, Text, styled } from '@packages/ds-core';
import { Logo } from 'modules/_shared/components/Logo';
import { ILoginWithPasswordPayload } from '../types';
import { FormBuilder } from '@packages/react-form-builder';
import { t } from 'configs/i18next';
import { Button, Form } from 'antd';
import { LanguageDropDown } from 'modules/locale/containers';
import { useForm } from 'antd/es/form/Form';
import { useLogin } from '../hooks';
import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router';

export const LoginContainer: React.FC = () => {
  const { loading, loginWithPassword } = useLogin();
  const { isForgotPassword, setForgotPassword } = useAuthContext();
  const [form] = useForm();
  const navigate = useNavigate();
  const handleForgotPassword = () => {
    console.log('handleForgotPassword');
    console.log('isForgotPassword', isForgotPassword);
    if (setForgotPassword) {
      setForgotPassword(true);
    }
    console.log('isForgotPassword', isForgotPassword);
    navigate('/forgot-password');
  };

  return (
    <Wrapper>
      <Form layout="vertical" form={form} onFinish={loginWithPassword}>
        <Flex justify="center" direction="column" align="center">
          <Box padding={['s16', 's8']}>
            <Logo width={180} />
          </Box>
          <Box marginTop="s24">
            <FormBuilder<ILoginWithPasswordPayload>
              asChild
              configs={{
                username: {
                  formType: 'input',
                  label: t('username'),
                  placeholder: t('username'),
                  required: false,
                  rules: [
                    {
                      required: true,
                      message: t('fieldIsRequired', { field: t('username') }),
                    },
                  ],
                },
                password: {
                  formType: 'password',
                  type: 'password',
                  label: t('password'),
                  placeholder: '********',
                  required: false,
                  rules: [
                    {
                      required: true,
                      message: t('fieldIsRequired', { field: t('password') }),
                    },
                  ],
                },
              }}
              layouts={[
                {
                  name: 'username',
                  span: 24,
                },
                {
                  name: 'password',
                  span: 24,
                },
              ]}
            />
            <Box marginTop="s20">
              <Button type="primary" block htmlType="submit" loading={loading}>
                {t('login')}
              </Button>
            </Box>
          </Box>
          <Box marginTop="s48">
            <Flex gap="s8" align="center">
              <Text fontSize="s">{t('selectLanguage')}</Text>
              <LanguageDropDown />
            </Flex>
          </Box>
          <Box marginTop="s4">
            <Flex gap="s8" align="center">
              <Button type="link" onClick={handleForgotPassword}>
                <Text fontSize="s">{t('forgotPassword')}</Text>
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: inline-block;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spaces.s28};
  border-radius: 20px;
  width: 430px;
  max-width: 100%;
  box-sizing: border-box;
`;
