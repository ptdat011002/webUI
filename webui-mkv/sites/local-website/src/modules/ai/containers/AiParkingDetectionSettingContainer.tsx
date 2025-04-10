import React, { useEffect, useState, useCallback } from 'react';
import { Box, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import { t } from 'configs/i18next';
import { IParkingDetectionSetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useModal } from '@packages/react-modal';
import { ParkingDetectionSetting } from '../components/ParkingDetectionSetting';
import { useAiParkingConfig } from '../hooks/useAiParkingConfig';

export interface AiParkingDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiParkingDetectionSettingContainer: React.FC<AiParkingDetectionSettingContainerProps> = ({ signal, onChange}) => {
  const [form] = useForm();
  const { isLoading, data: parkingData, updateConfig, actionLoading } = useAiParkingConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const modal = useModal();
  const [currentOrder, setCurrentOrder] = useState<string>('1');

  useEffect(() => {
    const updateFormValues = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (parkingData && !isSaving) {
        const initialValues = {
          enable: parkingData?.enable,
          zones: parkingData?.zones,
          time: parkingData?.time,
        };
  
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setZones(parkingData?.zones ?? []);
        setCurrentOrder(String(parkingData?.order ?? '1'));
        onChange?.(false);
      }
    };
    setIsDataChanged(false);
    updateFormValues();
  }, [parkingData, form, isSaving]);

  useWarningOnLeave(isDataChanged, t);

  const handleValuesChange = (changedValues: any) => {
    if ('order' in changedValues) {
      setCurrentOrder(changedValues.order);
    }
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  };

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      enable: currentFormData['enable'],
      zones: currentFormData['zones'],
      time: currentFormData['time'],
      order: currentFormData['order'],
    };
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)
      return isFormChanged;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const payload = {
      ...formValues,
      time: parseInt(formValues.time, 10),
      zones: zones,
    };

    if (payload['enable'] && zones.length == 0) {
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
          zones: currentFormData['zones'],
          time: currentFormData['time'],
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

  if (isLoading) return <Spinner />;

  return (
    <PaddingWrapper type="form">
      <ParkingDetectionSetting
        zones={zones}
        onZonesChange={handleZonesChange}
        currentOrder={currentOrder}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<IParkingDetectionSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('parking'),
                },
                time: {
                  formType: 'select',
                  label: t('time_allow_parking'),
                  style: { width: '50%' },
                  options: Array.from({ length: 10 }, (_, i) => {
                    const value = (i + 3) * 5;
                    return { value: value, label: `${value}s` };
                  }),
                  defaultValue: 15,
                },
                order: {
                  formType: 'select',
                  label: t('detection_zone'),
                  style: { width: '50%' },
                  options: [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                  ],
                  defaultValue: '1',
                },
              }}
              layouts={[
                {
                  name: 'enable',
                  span: 24,
                },
                {
                  name: 'time',
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
                enable: parkingData?.enable,
                zones: parkingData?.zones,
                time: parkingData?.time || 15,
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

export default AiParkingDetectionSettingContainer;