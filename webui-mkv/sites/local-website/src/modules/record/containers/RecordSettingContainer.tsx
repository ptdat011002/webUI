import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { IRecordSetting } from '../types/setting';
import { t } from 'i18next';
import { Box, Flex, styled } from '@packages/ds-core';
import { Button, Col, Form, Row } from 'antd';
import { PaddingWrapper } from 'modules/_shared';
import { useRecordConfig } from '../hooks/useRecordConfig';

export interface RecordSettingContainerProps {
  className?: string;
}

const RecordSettingContainer: React.FC<RecordSettingContainerProps> = () => {
  const [form] = Form.useForm<IRecordSetting>();
  const { updateConfig, actionLoading } = useRecordConfig({
    onSuccess: (data) => {
      form.setFieldsValue({
        record_enable: data.record_enable,
        pre_record: data.pre_record,
      });
    },
  });
  return (
    <Wrapper>
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} xl={12}>
            <Form
              labelCol={{ span: 10 }}
              colon={false}
              form={form}
              onFinish={updateConfig}
            >
              <FormBuilder<IRecordSetting>
                configs={{
                  record_enable: {
                    label: t('record'),
                    formType: 'switch',
                  },
                  pre_record: {
                    label: t('pre_record'),
                    formType: 'select',
                    options: [
                      {
                        label: '0s',
                        value: -1,
                      },
                      {
                        label: '4s',
                        value: 0,
                      },
                      {
                        label: '8s',
                        value: 1,
                      },
                      {
                        label: '12s',
                        value: 2,
                      },
                    ],
                  },
                }}
                layouts={[
                  {
                    name: 'record_enable',
                    span: 24,
                  },
                  {
                    name: 'pre_record',
                    span: 24,
                  },
                ]}
                asChild
              />
              <Box marginTop="s32">
                <Flex>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={actionLoading}
                  >
                    {t('save')}
                  </Button>
                </Flex>
              </Box>
            </Form>
          </Col>
        </Row>
      </PaddingWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

export default RecordSettingContainer;
