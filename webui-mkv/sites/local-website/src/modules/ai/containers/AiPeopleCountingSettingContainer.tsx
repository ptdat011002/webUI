import { Box, Spinner } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import React, { useEffect, useState } from 'react';
import { t } from 'configs/i18next';
import { IPeopleCountingSetting } from '../types/setting';
import { VideoSettingLayout } from 'modules/live/containers';
import { useForm } from 'antd/es/form/Form';
import { useAIPeopleCountingConfig } from '../hooks/useAiPeopleCountingConfig';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { CheckOutlined } from '@ant-design/icons';
import { useEventWarning } from 'modules/event/hooks/useEventWarning';
import { useWarningList } from 'modules/live/hooks';
import { IEventWarningInfo } from 'modules/event/types';

export interface AiPeopleCountingSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiPeopleCountingSettingContainer: React.FC<AiPeopleCountingSettingContainerProps> = ({ signal, onChange }) => {
  const [form] = useForm();
  const { isLoading, data: ppcData, updateConfig, actionLoading } = useAIPeopleCountingConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });
  const { data: warningData, setEventWarning } = useEventWarning();
  const { data: warningList, triggerReload } = useWarningList();
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [recordEnable, setRecordEnable] = useState<boolean>(false);
  const [peopleCount, setPeopleCount] = useState(0);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (warningList) {
      const updatePeopleCount = () => {
        const peopleCountWarnings = warningList.event_lists.filter(item => item.sub_type === "[AI]People_Count");
        const lastIndexWarning = peopleCountWarnings[peopleCountWarnings.length - 1];
        const count = lastIndexWarning?.information['people_count'];
        setPeopleCount(count);
      };
      updatePeopleCount();
      const interval = setInterval(() => {
        triggerReload();
        updatePeopleCount();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [warningList]);

  useEffect(() => {
    const updateFormValues = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
      if (ppcData && warningData && !isSaving) {
        const initialValues = {
          enable: ppcData?.enable ?? false,
          record_enable: warningData.pc?.record_enable ?? false
        };
        setRecordEnable(warningData.pc?.record_enable ?? false);
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setIsDataChanged(false);
      }
    }
    updateFormValues();
  }, [ppcData, warningData, form, isSaving]);

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
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const zones = [];
    const payload = {
      ...formValues,
      zones
    };
    const recordingEnablePayload = {
      ...warningData,
      pc: {
        ...warningData?.pc,
        record_enable: recordEnable,
      },
    };
    try {
      const resPPConfig = await updateConfig(payload);
      const resRecordingEnable = await setEventWarning(recordingEnablePayload);
      if (resPPConfig && resRecordingEnable && resPPConfig['msg'] === "set_config_success" && resRecordingEnable['msg'] === "set_config_success") {
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
        peopleCount={peopleCount}
        isShow={true}
        leftContent={
          <Box>
            <FormBuilder<IPeopleCountingSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('people_counting'),
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
                enable: ppcData?.enable,
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

export default AiPeopleCountingSettingContainer;

