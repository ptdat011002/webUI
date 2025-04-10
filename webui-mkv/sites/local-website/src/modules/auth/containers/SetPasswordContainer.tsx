import { Box, Flex, Text, styled } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Logo } from 'modules/_shared';
import { ISetPasswordPayload } from '../types';
import { useLogin } from '../hooks';
import { t } from 'configs/i18next';
import { LanguageDropDown } from 'modules/locale/containers/LangueDropDown';

export const SetPasswordContainer = () => {
  const { loading, changePassword } = useLogin();
  const [form] = useForm();

  return (
    <Wrapper>
      <Form form={form} layout="vertical" onFinish={changePassword}>
        <Flex justify="center" direction="column" align="center">
          <Flex direction="column" gapY="s16">
            <Flex justify="center">
              <Logo width={180} />
            </Flex>
            <Box style={{ textAlign: 'center' }}>
              <Text transform="uppercase" fontSize="l">
                {t('setPassword')}
              </Text>
            </Box>
            <Box>
              <Text italic fontSize="s" style={{ whiteSpace: 'pre-line' }}>
                {t('newPasswordRules')}
              </Text>
            </Box>
          </Flex>
          <Box marginTop="s16">
            <FormBuilder<ISetPasswordPayload>
              gutter={[12, 14]}
              asChild
              configs={{
                password: {
                  formType: 'password',
                  label: t('password'),
                  placeholder: '********',
                  required: false,
                  rules: [
                    {
                      required: true,
                      message: t('pleaseEnterField', {
                        field: t('password').toLowerCase(),
                      }),
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: t('incorrectFormatPassword'),
                    },
                  ],
                },
                confirmPassword: {
                  formType: 'password',
                  label: t('confirmPassword'),
                  placeholder: '********',
                  required: false,
                  dependencies: ['password'],
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: t('pleaseEnterField', {
                        field: t('confirmPassword').toLowerCase(),
                      }),
                    },
                    {
                      validator: async (_, value) => {
                        if (value !== form.getFieldValue('password')) {
                          return Promise.reject(
                            t('passwordNotMatch'),
                          );
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
                  name: 'confirmPassword',
                  span: 24,
                },
              ]}
            />
            <Box marginTop="s20">
              <Button type="primary" block htmlType="submit" loading={loading}>
                {t('save')}
              </Button>
            </Box>
          </Box>
          <Box marginTop="s48">
            <Flex gap="s8" align="center">
              <Text fontSize="s">{t('selectLanguage')}</Text>
              <LanguageDropDown />
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
