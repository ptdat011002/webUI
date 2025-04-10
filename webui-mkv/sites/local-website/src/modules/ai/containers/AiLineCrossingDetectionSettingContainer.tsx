import { Box, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import React, { useEffect, useState } from 'react';
import { t } from 'configs/i18next';
import { ILCDSetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { LineCrossingDectectionSetting } from '../components/LineCrossingDetectionSetting';
import { useAILCDConfig } from '../hooks/useAiLCDConfig';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useEventWarning } from 'modules/event/hooks/useEventWarning';
import { useModal } from '@packages/react-modal';
import { IEventWarningInfo } from 'modules/event/types';

export interface AiLineCrossingDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiLineCrossingDetectionSettingContainer: React.FC<AiLineCrossingDetectionSettingContainerProps> = ({ signal, onChange }) => {
  const [form] = useForm();
  const { isLoading: lCDLoading, data: lCDData, updateConfig, actionLoading } = useAILCDConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });

  const { data: warningData, setEventWarning } = useEventWarning();
  
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [recordEnable, setRecordEnable] = useState<boolean>(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const modal = useModal();

  // State để lưu giữ directions và lines
  const [directions, setDirections] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    const updateFormValues = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (lCDData && warningData && !isSaving) {
        const initialValues = {
          enable: lCDData?.enable ?? false,
          directions: lCDData?.directions ?? [],
          lines: lCDData?.lines ?? [],
          record_enable: warningData.lcd?.record_enable ?? false
        };

        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setDirections(lCDData?.directions || []);
        setLines(lCDData?.lines || []);
        setRecordEnable(warningData?.lcd?.record_enable ?? false)
        setIsDataChanged(false);
      }
    };
    updateFormValues();
  }, [lCDData, warningData, form, isSaving]);

  // Show warning when there is unsaved changes
  useWarningOnLeave(isDataChanged, t);

  useEffect(() => {
    setIsDataChanged(isDataChange());
    onChange?.(false);
  }, [initialFormData, recordEnable, form]);

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
      directions: currentFormData['directions'],
      lines: currentFormData['lines'],
      record_enable: currentFormData['record_enable'],
    }
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)
    return isFormChanged;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const payload = {
      ...formValues,
      directions,
      lines,
    };

    const recordingEnablePayload = {
      ...warningData,
      lcd: {
        ...warningData?.lcd,
        record_enable: recordEnable,
      },
    };

    if (payload['enable'] && lines.length == 0) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('there_are_no_lines_please_config_before_enable')}</Text>
        ),
        onConfirm: ({ close }) => {
          close();
        },
      });
      return;
    }

    try {
      const resUpdateConfig = await updateConfig(payload);
      const resRecordingEnable = await setEventWarning(recordingEnablePayload);

      if (resUpdateConfig && resRecordingEnable && resUpdateConfig['msg'] === "set_config_success" && resRecordingEnable['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        const currentFormData = form.getFieldsValue(true);
        const extractedData = {
          enable: currentFormData['enable'],
          directions: currentFormData['directions'],
          lines: currentFormData['lines'],
          record_enable: recordEnable
        }
        setInitialFormData(extractedData);
      }
    } catch (error) {
      message.error(t('save_failed'));
    }
  };

  if (lCDLoading) return <Spinner />;

  return (
    <PaddingWrapper type="form">
      <LineCrossingDectectionSetting
        directions={directions}
        lines={lines}
        onDirectionsChange={(newDirections: any[]) => {
          setDirections(newDirections);
          setIsDataChanged(true);
          onChange?.(true);
        }}
        onLinesChange={(newLines: any[]) => {
          setLines(newLines);
          setIsDataChanged(true);
          onChange?.(true);
        }}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<ILCDSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('line_crossing_detection'),
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
                enable: lCDData?.enable,
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

export default AiLineCrossingDetectionSettingContainer;
