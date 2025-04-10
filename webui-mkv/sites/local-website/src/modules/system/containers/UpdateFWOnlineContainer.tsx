import React from 'react';
import { Box, Flex, Spinner, styled, Text, useTheme } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, Col, Form } from 'antd';
import { IOperatorUpdateOnline, IUpgradeHttpConfig } from '../types';
import { t } from 'i18next';
import { ScreenCenter, Tile } from 'modules/_shared';
import { useFWOnline, useUpgradeFW } from '../hooks';
import { useForm } from 'antd/es/form/Form';
import { OnlineFwFindingAlert } from '../components';

// const exampleStrs = [
//   'https://192.169.1.1:pavanacameraai',
//   'https://192.169.1.1:pavanacameraai01',
// ];

export interface UpdateFwOnlineContainerProps {
  className?: string;
}

export const UpdateFwOnlineContainer: React.FC<
  UpdateFwOnlineContainerProps
> = ({ className }) => {
  const [form] = useForm();

  const {
    getFWData,
    loading: uiLoading,
    setFWOnline,
    actionLoading: fwOnlineUpdating,
  } = useFWOnline();

  const {
    actionLoading: upgrading,
    checkFWData,
    loading: checkLoading,
    startUpgrade,
    triggerCheckFW,
  } = useUpgradeFW();

  const theme = useTheme();

  const handleSaveData = async (value: IOperatorUpdateOnline) => {
    const payload: IUpgradeHttpConfig = {
      enable: value.autoUpdate,
      url: value.serverUrl,
      schedule: {},
    };
    return setFWOnline(payload);
  };
  const handleUpdate = () => startUpgrade();
  const handleCheck = triggerCheckFW;

  if (uiLoading) {
    return (
      <ScreenCenter>
        <Spinner />
      </ScreenCenter>
    );
  }

  return (
    <Wrapper className={className}>
      <Box marginBottom="s24">
        <Tile title={t('updateFWOnline')} />
      </Box>
      <Form<IOperatorUpdateOnline>
        layout="horizontal"
        form={form}
        onFinish={handleSaveData}
        colon={false}
        labelCol={{ span: 10 }}
        autoComplete="off"
        initialValues={{
          autoUpdate: getFWData?.enable,
          username: '',
          password: '',
          serverUrl: getFWData?.url,
        }}
      >
        <Col span={24} lg={15} md={18}>
          <Flex block gapX="s16" align="start">
            <Box style={{ flex: 1 }}>
              <FormBuilder<IOperatorUpdateOnline>
                asChild
                configs={{
                  autoUpdate: {
                    formType: 'switch',
                    label: t('autoUpdate'),
                  },
                  username: {
                    formType: 'input',
                    label: t('username'),
                    placeholder: t('inputUserName'),
                  },
                  password: {
                    formType: 'password',
                    label: t('password'),
                  },
                  serverUrl: {
                    formType: 'input',
                    label: t('serverUrl'),
                    placeholder: t('inputServerUrl'),
                    rules: [
                      {
                        required: true,
                        message: t('required'),
                      },
                    ],
                  },
                }}
                layouts={[
                  {
                    name: 'autoUpdate',
                    span: 24,
                  },
                  {
                    name: 'username',
                    span: 24,
                  },
                  {
                    name: 'password',
                    span: 24,
                  },
                  {
                    name: 'serverUrl',
                    span: 24,
                  },
                ]}
              />
            </Box>
          </Flex>
          {/* <Box marginBottom="s24" marginTop="s24">
            <Flex direction="column">
              <Text italic fontSize="m" fontWeight="400">
                {t('exampleServerUrl')}
              </Text>
              {exampleStrs.map((str, index) => (
                <Text italic fontSize="m" fontWeight="400" key={index}>
                  {str}
                </Text>
              ))}
            </Flex>
          </Box> */}
        </Col>
        <Box marginTop="s24">
          <Flex align="center" flexWrap="wrap" gap="s16">
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: 150,
              }}
              loading={fwOnlineUpdating}
            >
              {t('save')}
            </Button>
            <Button
              style={{
                backgroundColor: theme.colors.textSecondary,
                border: 'none',
                width: 150,
              }}
              loading={checkLoading}
              onClick={handleCheck}
            >
              {t('check')}
            </Button>
            <Button
              type="primary"
              ghost
              loading={upgrading}
              onClick={handleUpdate}
              style={{
                width: 150,
              }}
            >
              {t('update')}
            </Button>
            {!checkLoading && !!checkFWData ? (
              <OnlineFwFindingAlert
                type={checkFWData?.has_new_fw ? 'success' : 'error'}
              />
            ) : null}
          </Flex>
        </Box>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: block;
  width: 100%;
`;
