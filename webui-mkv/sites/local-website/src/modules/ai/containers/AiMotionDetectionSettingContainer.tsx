import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import { t } from 'configs/i18next';
import { IMotionDetectionSetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useEventWarning } from 'modules/event/hooks/useEventWarning';
import { useModal } from '@packages/react-modal';
import { MotionDectectionSetting } from '../components/MotionDetectionSetting';
import { useAIMotionDetectConfig } from '../hooks/useAiMotionConfig';
import { IEventWarningInfo } from 'modules/event/types';

export interface AiMotionDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiMotionDetectionSettingContainer: React.FC<AiMotionDetectionSettingContainerProps> = ({ signal, onChange}) => {
  const [form] = useForm();
  const { isLoading, data: motionData, updateConfig, actionLoading } = useAIMotionDetectConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });
  const { data: warningData, setEventWarning } = useEventWarning();
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [recordEnable, setRecordEnable] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [zone_info, setZones] = useState<any[]>([]);
  const modal = useModal();

  useEffect(() => {
    const updateFormValues = async () => {
      if (motionData && warningData && !isSaving) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const initialValues = {
          enable: motionData?.enable ?? false,
          zone_info: motionData?.zone_info ?? [],
          record_enable: warningData.md?.record_enable ?? false
        };
  
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setZones(motionData?.zone_info || []);
        setRecordEnable(warningData?.md?.record_enable ?? false);
        setIsDataChanged(false);
      }
    };
    updateFormValues();
  }, [motionData, warningData, form, isSaving]);

  useWarningOnLeave(isDataChanged, t);

  const handleValuesChange = (changedValues: any) => {
    if ('record_enable' in changedValues) {
      setRecordEnable(changedValues.record_enable);
    }
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  };

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      enable: currentFormData['enable'],
      zone_info: currentFormData['zone_info'],
      record_enable: currentFormData['record_enable'],
    };
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)
      return isFormChanged;
  };

  useEffect(() => {
    setIsDataChanged(isDataChange());
    onChange?.(false);
  }, [initialFormData, recordEnable, form]);

  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const payload = {
      ...formValues,
      zone_info,
    };

    if (payload['enable'] && zone_info.length == 0) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('there_are_no_shapes_please_config_before_enable')}</Text>
        ),
        onConfirm: ({ close }) => {
          close();
        },
      });
      return;
    }

    const recordingEnablePayload = {
      ...warningData,
      md: {
        ...warningData?.md,
        record_enable: recordEnable,
      },
    };
    try {
      const resUpdateMDConfig = await updateConfig(payload);
      const resRecordingEnable = await setEventWarning(recordingEnablePayload);

      if (resUpdateMDConfig && resRecordingEnable && resUpdateMDConfig['msg'] === "set_config_success" && resRecordingEnable['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        const currentFormData = form.getFieldsValue(true);
        const extractedData = {
          enable: currentFormData['enable'],
          zone_info: currentFormData['zone_info'],
          record_enable: recordEnable
        };
        setInitialFormData(extractedData);
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
      <MotionDectectionSetting
        zone_info={zone_info}
        onZonesChange={(newZones: any[]) => {
          setZones(newZones);
          setIsDataChanged(true);
          onChange?.(true);
        }}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<IMotionDetectionSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('motion_detection'),
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
                enable: motionData?.enable,
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

export default AiMotionDetectionSettingContainer;