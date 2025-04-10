import React from 'react';
import { Box, Flex, styled } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Col, Form, Row } from 'antd';
import { IOperatorUpdateOffline } from '../types';
import { t } from 'i18next';
import {
  FormFileInput,
  OutlineButton,
  ThemeModalProvider,
  Tile,
} from 'modules/_shared';
import { useUpdateFWOffline } from '../hooks';
import { useModal } from '@packages/react-modal';
import { useForm } from 'antd/es/form/Form';

export interface UpdateFwOfflineContainerProps {
  className?: string;
}

export const UpdateFwOfflineContainer: React.FC<
  UpdateFwOfflineContainerProps
> = ({ className }) => {
  const [form] = useForm();

  const { actionLoading, uploadFWToServer } = useUpdateFWOffline();
  const modal = useModal();

  const handleSaveData = async (value: IOperatorUpdateOffline) => {
    modal.confirm({
      message: (
        <ThemeModalProvider selector=".modal">
          {t('updateFWOfflineConfirm')}
        </ThemeModalProvider>
      ),
      title: t('notification'),
      cancelText: t('cancel'),
      confirmText: t('ok'),
      onCancel: ({ close }) => close(),
      onConfirm: async ({ close }) => {
        close();

        return uploadFWToServer(value);
      },
    });
  };
  return (
    <Wrapper className={className}>
      <Box marginBottom="s24">
        <Tile title={t('updateFWOffline')} />
      </Box>
      <Form<IOperatorUpdateOffline>
        layout="vertical"
        form={form}
        onFinish={handleSaveData}
      >
        <Row>
          <Col span={24} lg={15} md={18}>
            <Flex block gapX="s16" align="start" flexWrap="wrap">
              <Box style={{ flex: 1 }}>
                <FormBuilder<IOperatorUpdateOffline>
                  asChild
                  configs={{
                    fileUpload: {
                      formType: 'custom',
                      render: (props) => (
                        <FormFileInput
                          {...(props as every)}
                          placeholder={t('chooseFile')}
                          accept=".zip"
                        />
                      ),
                      validateFirst: true,
                      rules: [
                        {
                          required: true,
                          message: t('fieldIsRequired', {
                            field: t('File'),
                          }),
                        },
                        {
                          // only allow .zip file
                          validator: (_, value) => {
                            if (value && !value.name.match(/.*\.zip$/)) {
                              return Promise.reject(
                                t('fieldIsInvalid', {
                                  field: 'File',
                                }),
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
                      name: 'fileUpload',
                      span: 24,
                    },
                  ]}
                />
              </Box>
              <Box padding={['s2', 0]}>
                <OutlineButton
                  htmlType="submit"
                  label={t('update')}
                  loading={actionLoading}
                />
              </Box>
            </Flex>
          </Col>
        </Row>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: block;
  width: 100%;
`;
