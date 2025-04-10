import React, { useCallback, useEffect, useState } from 'react';
import { Box, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import { t } from 'configs/i18next';
import { IEmergencyLaneIntrusionSetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useModal } from '@packages/react-modal';
import { useAIMotionDetectConfig } from '../hooks/useAiMotionConfig';
import { EmergencyLaneIntrusionDetectionSetting } from '../components/EmergencyLaneIntrusionDetectionSetting';

export interface AiEmergencyLaneIntrusionDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiEmergencyLaneIntrusionDetectionSettingContainer: React.FC<AiEmergencyLaneIntrusionDetectionSettingContainerProps> = ({ signal, onChange}) => {
  const [form] = useForm();
  const { isLoading, data: motionData, updateConfig, actionLoading } = useAIMotionDetectConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [zone_info, setZones] = useState<any[]>([]);
  const modal = useModal();

  useEffect(() => {
    const updateFormValues = async () => {
      if (motionData && !isSaving) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const initialValues = {
          enable: motionData?.enable ?? false,
          zone_info: motionData?.zone_info ?? [],
        };
  
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setZones(motionData?.zone_info || []);
        setIsDataChanged(false);
      }
    };
    updateFormValues();
  }, [motionData, form, isSaving]);

  useWarningOnLeave(isDataChanged, t);

  const handleValuesChange = () => {
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  };

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      enable: currentFormData['enable'],
      zone_info: currentFormData['zone_info'],
    };
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)
      return isFormChanged;
  };

  useEffect(() => {
    setIsDataChanged(isDataChange());
    onChange?.(false);
  }, [initialFormData, form]);

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

    try {
      const resUpdateMDConfig = await updateConfig(payload);

      if (resUpdateMDConfig && resUpdateMDConfig['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        const currentFormData = form.getFieldsValue(true);
        const extractedData = {
          enable: currentFormData['enable'],
          zone_info: currentFormData['zone_info'],
        };
        setInitialFormData(extractedData);
      }
    } catch (error) {
      message.error(t('save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleZonesChange = useCallback((newZones: any[]) => {
    requestAnimationFrame(() => {
      setZones(newZones);
      setIsDataChanged(true);
      onChange?.(true);
    });
  }, [onChange]);

  return (
    <PaddingWrapper type="form">
      <EmergencyLaneIntrusionDetectionSetting
        zones={zone_info}
        onZonesChange={handleZonesChange}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<IEmergencyLaneIntrusionSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('emergency_lane_intrusion'),
                },
                order: {
                  formType: 'select',
                  label: t('detection_zone'),
                  style: { width: '50%' },
                  options: [
                    { value: '1', label: '1' }
                  ],
                },
              }}
              layouts={[
                {
                  name: 'enable',
                  span: 24,
                },
                {
                  name: 'order',
                  span: 24,
                },
              ]}
              labelCol={{ span: 10 }}
              hideColon
              onValuesChange={handleValuesChange}
              initialValues={{
                enable: motionData?.enable,
                // order: motionData?.order,
              }}
            />
            <Box marginTop="s24" display="flex">
              <Button
                type="primary"
                loading={isLoading || actionLoading}
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

export default AiEmergencyLaneIntrusionDetectionSettingContainer;