import { Box } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button } from 'antd';
import { PaddingWrapper } from 'modules/_shared';
import React from 'react';
import { t } from 'configs/i18next';
import { IAIFaceDetectSetting } from '../types/setting';
import { VideoSettingLayout } from 'modules/live/containers';
import { useAIFaceConfig } from '../hooks';
import { useForm } from 'antd/es/form/Form';

export interface AiFaceDetectSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
}

const AiFaceDetectSettingContainer: React.FC<AiFaceDetectSettingContainerProps> = ({ signal }) => {
  const [form] = useForm();
  const { isLoading, data, updateConfig, actionLoading } = useAIFaceConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data.FD);
    },
    signal,
  });
  return (
    <PaddingWrapper type="form">
      <VideoSettingLayout
        leftContent={
          <Box>
            <FormBuilder<IAIFaceDetectSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('face_detection'),
                },
                record_enable: {
                  formType: 'switch',
                  label: t('record'),
                },
              }}
              layouts={[
                {
                  name: 'enable',
                  span: 24,
                },
                {
                  name: 'record_enable',
                  span: 24,
                },
              ]}
              labelCol={{ span: 10 }}
              hideColon
              initialValues={{
                enable: true,
              }}
              onSubmit={async (values) => {
                await updateConfig({
                  FD: {
                    ...data?.FD,
                    ...values,
                  },
                });
              }}
            />
            <Box marginTop="s24">
              <Button
                type="primary"
                loading={isLoading || actionLoading}
                onClick={form.submit}
              >
                {t('save')}
              </Button>
            </Box>
          </Box>
        }
      />
    </PaddingWrapper>
  );
};

export default AiFaceDetectSettingContainer;