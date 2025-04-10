import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import { t } from 'configs/i18next';
import { IPIDSetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useAIPIDConfig } from '../hooks/useAiPIDConfig';
import { PerimeterIntrusionDectectionSetting } from '../components/PerimeterIntrusionDetectionSetting';
import { useEventWarning } from 'modules/event/hooks/useEventWarning';
import { useModal } from '@packages/react-modal';
import { IEventWarningInfo } from 'modules/event/types';

export interface AiPIDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiPIDetectionSettingContainer: React.FC<AiPIDetectionSettingContainerProps> = ({ signal, onChange }) => {
  const [form] = useForm();
  const { isLoading, data: pidData, updateConfig, actionLoading } = useAIPIDConfig({
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

  const [zones, setZones] = useState<any[]>([]);
  const modal = useModal();

  useEffect(() => {
    const updateFormValues = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (pidData && warningData && !isSaving) {
        const initialValues = {
          enable: pidData?.enable ?? false,
          zones: pidData?.zones ?? [],
          record_enable: warningData.pid?.record_enable ?? false
        };
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setZones(pidData?.zones || []);
        setRecordEnable(warningData?.pid?.record_enable ?? false)
        setIsDataChanged(false);
      }
    };
    updateFormValues();
  }, [pidData, warningData, form, isSaving]);

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
      zones: currentFormData['zones'],
      record_enable: currentFormData['record_enable'],
    }
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
      zones,
    };

    if (payload['enable'] && zones.length == 0) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('there_are_no_zones_please_config_before_enable')}</Text>
        ),
        onConfirm: ({ close }) => {
          close();
        },
      });
      return;
    }

    const recordingEnablePayload = {
      ...warningData,
      pid: {
        ...warningData?.pid,
        record_enable: recordEnable,
      },
    };
    try {
      const resUpdatePIDConfig = await updateConfig(payload);
      const resRecordingEnable = await setEventWarning(recordingEnablePayload);

      if (resUpdatePIDConfig && resRecordingEnable && resUpdatePIDConfig['msg'] === "set_config_success" && resRecordingEnable['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        const currentFormData = form.getFieldsValue(true);
        const extractedData = {
          enable: currentFormData['enable'],
          zones: currentFormData['zones'],
          record_enable: recordEnable
        }
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
      <PerimeterIntrusionDectectionSetting
        zones={zones}
        onZonesChange={(newZones: any[]) => {
          setZones(newZones);
          setIsDataChanged(true);
          onChange?.(true);
        }}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<IPIDSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('intrusion_detection'),
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
                enable: pidData?.enable,
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

export default AiPIDetectionSettingContainer;
