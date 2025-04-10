import { Box, Spinner } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import React, { useEffect, useState } from 'react';
import { t } from 'configs/i18next';
import { ICrowdDetectionSetting } from '../types/setting';
import { VideoSettingLayout } from 'modules/live/containers';
import { useForm } from 'antd/es/form/Form';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { CheckOutlined } from '@ant-design/icons';
import { useAICrowdDetectionConfig } from '../hooks/useAiCrowdDetectionConfig';
import { useEventWarning } from 'modules/event/hooks/useEventWarning';
import { IEventWarningInfo } from 'modules/event/types';

export interface AiCrowdDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void; // Truyền trạng thái form
}

const AiCrowdDetectionSettingContainer: React.FC<AiCrowdDetectionSettingContainerProps> = ({ signal, onChange }) => {
  const [form] = useForm();
  const { isLoading, data: cdData, updateConfig, actionLoading } = useAICrowdDetectionConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });
  const { data: warningData, setEventWarning } = useEventWarning();
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [recordEnable, setRecordEnable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const updateFormValues = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
      if (cdData && warningData && !isSaving) {
        const initialValues = {
          enable: cdData?.enable ?? false,
          record_enable: warningData.cd?.record_enable ?? false
        };
        setRecordEnable(warningData.cd?.record_enable ?? false);
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setIsDataChanged(false);
      }
    }
    updateFormValues();
  }, [cdData, warningData, form, isSaving]);

  // Show warning when there is unsaved changes
  useWarningOnLeave(isDataChanged, t);

  useEffect(() => {
    setIsDataChanged(isDataChange());
    onChange?.(false);
  }, [initialFormData, recordEnable, form]);

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      enable: currentFormData['enable'],
      record_enable: currentFormData['record_enable'],
    }
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)

    return isFormChanged;
  };

  const handleValuesChange = (changedValues: any) => {
    if ('record_enable' in changedValues) {
      setRecordEnable(changedValues.record_enable);
    }
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  }

  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const payload = {
      ...formValues,
    };
    const recordingEnablePayload = {
      ...warningData,
      cd: {
        ...warningData?.cd,
        record_enable: recordEnable,
      },
    };
    try {
      const resCDConfig = await updateConfig(payload);
      const resRecordingEnable = await setEventWarning(recordingEnablePayload);
      if (resCDConfig && resRecordingEnable && resCDConfig['msg'] === "set_config_success" && resRecordingEnable['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        setInitialFormData({ enable: formValues['enable'], record_enable: recordEnable });
      }
    } catch (error) {
      message.error(t('save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Spinner />;
  
  return (
    <PaddingWrapper type="form">
      <VideoSettingLayout
        leftContent={
          <Box>
            <FormBuilder<ICrowdDetectionSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('crowd_detection'),
                },
              }}
              layouts={[
                {
                  name: 'enable',
                  span: 24,
                },
              ]}
              labelCol={{ span: 10 }}
              hideColon
              onValuesChange={handleValuesChange}
              initialValues={{
                enable: cdData?.enable,
              }}
            />
            <FormBuilder<IEventWarningInfo>
              form={form}
              configs={{
                record_enable: {
                  formType: 'switch',
                  label: t('record'),
                },
              }}
              layouts={[
                {
                  name: 'record_enable',
                  span: 24,
                },
              ]}
              labelCol={{ span: 10 }}
              hideColon
              onValuesChange={handleValuesChange}
              initialValues={{
                record_enable: recordEnable,
              }}
            />
            <Box marginTop="s24" display="flex">
              <Button
                type="primary"
                loading={actionLoading}
                onClick={handleSave}
                disabled={!isDataChanged}
                className={!isDataChanged ? 'custom-disabled-button' : ''}
              >
                {t('save')}
              </Button>
              {saveSuccessVisible && (
                <SaveSuccess>
                  <div className="icon-container">
                    <CheckOutlined />
                  </div> 
                  <span>{t('save_success')}</span>
                </SaveSuccess>
              )}
            </Box>
          </Box>
        }
      />
    </PaddingWrapper>
  );
};

export default AiCrowdDetectionSettingContainer;