import { Box, Flex, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import React, { useEffect, useState } from 'react';
import { t } from 'configs/i18next';
import { ILicensePlateRecognitionSetting } from '../types/setting';
import { VideoSettingLayout } from 'modules/live/containers';
import { useForm } from 'antd/es/form/Form';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { CheckOutlined } from '@ant-design/icons';
import { useAiLicensePlateConfig } from '../hooks/useAiLicensePlateConfig';

export interface AiLicensePlateRecognitionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiLicensePlateRecognitionSettingContainer: React.FC<AiLicensePlateRecognitionSettingContainerProps> = ({ signal, onChange }) => {
  const [form] = useForm();
  const { isLoading, data: licensePlateData, updateConfig, actionLoading } = useAiLicensePlateConfig({
    onSuccess: (data) => {
      if (data) {
        const initialValues = {
          license_plate_threshold: Math.round((data.license_plate_threshold ?? 0.05) * 100),
          min_pixel: data.min_pixel,
          max_pixel: data.max_pixel,
        };
        form.setFieldsValue(initialValues);
      }
    },
    signal,
  });
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const updateFormValues = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (licensePlateData && !isSaving) {
        const initialValues = {
          license_plate_threshold: Math.round((licensePlateData?.license_plate_threshold ?? 0.05) * 100),
          min_pixel: licensePlateData.min_pixel,
          max_pixel: licensePlateData.max_pixel,
        };
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        onChange?.(false);
      }
    }
    setIsDataChanged(false);
    updateFormValues();
  }, [licensePlateData, form, isSaving]);

  // Show warning when there is unsaved changes
  useWarningOnLeave(isDataChanged, t);

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      license_plate_threshold: currentFormData['license_plate_threshold'],
      min_pixel: currentFormData['min_pixel'],
      max_pixel: currentFormData['max_pixel'],
    }
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)
    return isFormChanged;
  };

  const handleValuesChange = (changedValues: any) => {
    if ('min_pixel' in changedValues) {
      const newMin = changedValues.min_pixel;
      const currentMax = form.getFieldValue('max_pixel');
      if (newMin >= currentMax) {
        form.setFieldValue('min_pixel', currentMax - 1);
      }
    }
    if ('max_pixel' in changedValues) {
      const newMax = changedValues.max_pixel;
      const currentMin = form.getFieldValue('min_pixel');
      if (newMax <= currentMin) {
        form.setFieldValue('max_pixel', currentMin + 1);
      }
    }
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  }

  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const payload = {
      ...formValues,
      license_plate_threshold: formValues.license_plate_threshold / 100,
    };
    try {
      const resLicensePlateConfig = await updateConfig(payload);
      if (resLicensePlateConfig && resLicensePlateConfig['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        const currentFormData = form.getFieldsValue(true);
        const extractedData = {
          license_plate_threshold: currentFormData['license_plate_threshold'],
          min_pixel: currentFormData['min_pixel'],
          max_pixel: currentFormData['max_pixel'],
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
      <VideoSettingLayout
        leftContent={
          <Box>
            <FormBuilder<ILicensePlateRecognitionSetting>
              form={form}
              configs={{
                license_plate_threshold: {
                  formType: 'input-number',
                  label: (
                    <Flex align="center" gapX="s8">
                      <span>{t('license_plate_threshold')}</span>
                      <Text color="textSecondary" style={{ fontStyle: 'italic' }}>(1~100)</Text>
                    </Flex>
                  ),
                  rules: [
                    {
                      type: 'number',
                      min: 1,
                      max: 100,
                      message: t('license_plate_threshold_range'),
                    },
                    {
                      required: true,
                      message: t('please_enter_license_plate_threshold'),
                    },
                  ],
                },
                min_pixel: {
                  formType: 'slider',
                  label: t('min_pixel'),
                  min: 20,
                  max: 1079,
                  step: 1,
                },
                max_pixel: {
                  formType: 'slider',
                  label: t('max_pixel'),
                  min: 320,
                  max: 1080,
                  step: 1,
                },
              }}
              layouts={[
                { 
                  name: 'license_plate_threshold',
                  span: 24,
                },
                {
                  name: 'min_pixel',
                  span: 24,
                },
                {
                  name: 'max_pixel',
                  span: 24,
                },
              ]}
              labelCol={{ span: 10 }}
              hideColon
              onValuesChange={handleValuesChange}
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

export default AiLicensePlateRecognitionSettingContainer;