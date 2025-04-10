import React, { useCallback, useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import { t } from 'configs/i18next';
import { IWrongWaySetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useModal } from '@packages/react-modal';
import { useAiWrongWayConfig } from '../hooks/useAiWrongWayConfig';
import { WrongWayDetectionSetting } from '../components/WrongWayDetectionSetting';
import { IOSDConfig } from 'modules/live/types/osd';

export interface AiWrongWayDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

export interface WrongWayDetectionSettingProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  zones?: Array<any>;
  onZonesChange?: (newZones: any[]) => void;
  currentOrder?: string;
  currentDirection?: { value: string; label: string };
}

const AiWrongWayDetectionSettingContainer: React.FC<AiWrongWayDetectionSettingContainerProps> = ({ signal, onChange}) => {
  const [form] = useForm();
  const { isLoading, data: wrongWayData, updateConfig, actionLoading } = useAiWrongWayConfig({
    onSuccess: (data) => {
      if (data.directions) {
        const { directions, ...dataWithoutDirection } = data;
        form.setFieldsValue(dataWithoutDirection);
      } else {
        form.setFieldsValue(data);
      }
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
  const [currentDirection, setCurrentDirection] = useState(1)

  const directionOptions = [
    { value: '1', label: 'A->B' },
    { value: '-1', label: 'A<-B' },
  ];

  useEffect(() => {
    const updateFormValues = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (wrongWayData && !isSaving) { 
        const initialValues = {
          enable: wrongWayData?.enable,
          zones: wrongWayData?.zones,
          order: String(wrongWayData?.order ?? '1'),
        };

        const selectedZone = wrongWayData?.zones?.find(zone => zone.id === Number(initialValues.order));
        let directionValue = directionOptions[0].value;
        
        if (selectedZone?.direction !== undefined && selectedZone?.direction !== null) {
          directionValue = String(selectedZone.direction);
        }
        initialValues['directions'] = directionValue;
  
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setZones(wrongWayData?.zones ?? []);
        setCurrentOrder(initialValues.order);
        setCurrentDirection(Number(directionValue));
        onChange?.(false);
      }
    };
    setIsDataChanged(false);
    updateFormValues();
  }, [wrongWayData, form, isSaving]);

  useWarningOnLeave(isDataChanged, t);

  const handleValuesChange = (changedValues: any) => {
    if ('order' in changedValues) {
      setCurrentOrder(changedValues.order);
      
      const selectedZone = zones.find(zone => zone.id === Number(changedValues.order));
      
      if (selectedZone?.direction) {
        const directionValue = String(selectedZone.direction);
        form.setFieldValue('directions', directionValue);
      } else {
        const defaultDirection = directionOptions[0];
        form.setFieldValue('directions', defaultDirection.value);
      }
    }

    if ('directions' in changedValues) {
      setCurrentDirection(changedValues.directions)
      const directionOption = directionOptions.find(opt => opt.value === changedValues.directions) || directionOptions[0];
      const currentOrderValue = form.getFieldValue('order') ?? '1';
      const updatedZones = zones.map(zone => {
        if (zone.id === Number(currentOrderValue)) {
          return {
            ...zone,
            direction: Number(directionOption.value)
          };
        }
        return zone;
      });

      if (JSON.stringify(updatedZones) !== JSON.stringify(zones)) {
        setZones(updatedZones);
        setIsDataChanged(true);
        onChange?.(true);
      }
    }
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  };

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      enable: currentFormData['enable'],
      zones: currentFormData['zones'],
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
      zones,
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
      <WrongWayDetectionSetting
        zones={zones}
        currentOrder={currentOrder}
        currentDirection={currentDirection}
        onZonesChange={handleZonesChange}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<IWrongWaySetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('wrong_way'),
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
                directions: {
                  formType: 'select',
                  label: t('directions'),
                  style: { width: '50%' },
                  options: directionOptions,
                  defaultValue: '1',
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
                {
                  name: 'directions',
                  span: 24,
                },
              ]}
              labelCol={{ span: 10 }}
              hideColon
              onValuesChange={handleValuesChange}
              initialValues={{
                enable: wrongWayData?.enable,
                zones: wrongWayData?.zones,
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

export default AiWrongWayDetectionSettingContainer;