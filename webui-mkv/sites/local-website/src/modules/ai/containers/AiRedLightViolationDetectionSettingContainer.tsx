import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { Button, message, Select } from 'antd';
import { PaddingWrapper, SaveSuccess } from 'modules/_shared';
import { t } from 'configs/i18next';
import { IRedLightViolationSetting } from '../types/setting';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined } from '@ant-design/icons';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useModal } from '@packages/react-modal';
import { RedLightViolationDetectionSetting } from '../components/RedLightViolationDetectionSetting';
import { useAiRedLightViolationConfig } from '../hooks/useAiRedLightViolationConfig';
import styled from 'styled-components';
export interface AiRedLightViolationDetectionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
  onChange?: (isDirty: boolean) => void;
}

const AiRedLightViolationDetectionSettingContainer: React.FC<AiRedLightViolationDetectionSettingContainerProps> = ({ signal, onChange}) => {
  const [form] = useForm();
  const { isLoading, data: redLightData, updateConfig, actionLoading } = useAiRedLightViolationConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
    signal,
  });
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lines, setLines] = useState<any[]>([]);
  const [signalLight, setSignalLight] = useState<any[]>([]);
  const modal = useModal();
  const [isDrawDelimitationLine, setIsDrawDelimitationLine] = useState(false);
  const [isDrawNormalLine, setIsDrawNormalLine] = useState(false);
  const [isDrawLight, setIsDrawLight] = useState(false);
  const hasDelimitationLine = lines.some(line => line.id === 0);

  useEffect(() => {
    const updateFormValues = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (redLightData && !isSaving) {
        const initialValues = {
          enable: redLightData?.enable,
          lines: redLightData?.lines,
          redLightDelayTime: redLightData?.redLightDelayTime,
        };
  
        form.setFieldsValue(initialValues);
        setInitialFormData(initialValues);
        setLines(redLightData?.lines || []);
        const newSignalLight: any[] = [];
        redLightData?.lines?.forEach(line => {
          if (line.redLightBox) {
            const isDuplicate = newSignalLight.some(signal => 
              JSON.stringify(signal) === JSON.stringify(line.redLightBox)
            );
            if (!isDuplicate) {
              line.redLightBox.forEach((box: any) => {
                box.id = line.redLightBox_id;
              });
              newSignalLight.push(line.redLightBox);
            }
          }
        });
        setSignalLight(newSignalLight);
        onChange?.(false);
      }
    };
    setIsDataChanged(false);
    updateFormValues();
  }, [redLightData, form, isSaving]);

  useWarningOnLeave(isDataChanged, t);

  const handleValuesChange = () => {
    setIsDataChanged(isDataChange());
    onChange?.(isDataChange());
  };

  const isDataChange = () => {
    const currentFormData = form.getFieldsValue(true);
    const extractedData = {
      enable: currentFormData['enable'],
      lines: currentFormData['lines'],
      redLightDelayTime: currentFormData['redLightDelayTime'],
    };
    const isFormChanged = JSON.stringify(extractedData) !== JSON.stringify(initialFormData)
      return isFormChanged;
  };

  const handleSave = async () => {
    // Check if delimitation line is not configured
    if (!hasDelimitationLine) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('please_config_delimitation_line')}</Text>
        ),
        onConfirm: ({ close }) => {
          close();
        },
      });
      return;
    }
    // Check if normal line is not configured
    if (lines.length === 1 && hasDelimitationLine) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('please_config_normal_line')}</Text>
        ),
      });
      return;
    }
    // Check if signal light is not configured
    if (lines.length > 1 && signalLight.length === 0) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('please_config_signal_light')}</Text>
        ),
      });
      return;
    }
    // Check if signal light is not configured for each line
    if (lines.length > 1 && signalLight.length > 0) {
      const usedSignalLights = new Set();
      lines.forEach(line => {
        if (line.lightControl && line.lightControl !== 'allow') {
          const lightIndex = parseInt(line.lightControl.split('_')[1]) - 1;
          usedSignalLights.add(lightIndex);
        }
      });

      const unusedLights = [];
      signalLight.forEach((_, index) => {
        if (!usedSignalLights.has(index)) {
          unusedLights.push(index + 1 as never);
        }
      });
      if (unusedLights.length > 0) {
        modal.confirm({
          title: t('notification'),
          loading: true,
          message: (
            <Text color="dark">{t('have_not_config_line_for_signal_light', { light_number: unusedLights.join(', ') })}</Text>
          ),
          onConfirm: ({ close }) => {
            close();
          },
        });
        return;
      }
    }

    setIsSaving(true);
    const formValues = form.getFieldsValue(true);
    const updatedLines = lines.map(line => {
      if ([1, 2, 3].includes(line.id)) {
        if (!line.redLightBox || line.rule === undefined) {
          return { ...line, rule: 1, lightControl: 'allow' };
        }
      }
      return line;
    });

    const payload = {
      ...formValues,
      lines: updatedLines,
    };

    try {
      const resUpdateRedLightConfig = await updateConfig(payload);

      if (resUpdateRedLightConfig && resUpdateRedLightConfig['msg'] === "set_config_success") {
        setIsDataChanged(false);
        setSaveSuccessVisible(true);
        setTimeout(() => setSaveSuccessVisible(false), 5000);
        const currentFormData = form.getFieldsValue(true);
        const extractedData = {
          enable: currentFormData['enable'],
          lines: currentFormData['lines'],
          redLightDelayTime: currentFormData['redLightDelayTime'],
        };
        setInitialFormData(extractedData);
        setLines(updatedLines);
      }
    } catch (error) {
      message.error(t('save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDelimitationLine = () => {
    setIsDrawDelimitationLine(true);
    setIsDrawNormalLine(false);
    setIsDrawLight(false);
  };

  const handleAddNormalLine = () => {
    setIsDrawDelimitationLine(false);
    setIsDrawNormalLine(true);
    setIsDrawLight(false);
  };

  const handleAddLight = () => {
    setIsDrawDelimitationLine(false);
    setIsDrawNormalLine(false);
    setIsDrawLight(true);
  };

  const getTrafficLightOptions = () => {
    const options = [{ value: 'allow', label: t('always_allow_through') }];
    signalLight.forEach((_, index) => {
      options.unshift({ value: `light_${index + 1}`, label: `${t('light')} ${index + 1}` });
    });
    return options;
  };

  const handleLightChange = (lineId: number, value: string) => {
    const newLines = lines.map(line => {
      if (line.id === lineId) {
        if (value === 'allow') {
          return { ...line, lightControl: value, rule: 1, redLightBox: null };
        } else {
          const lightIndex = parseInt(value.split('_')[1]) - 1;
          return { 
            ...line, 
            lightControl: value,
            rule: 0,
            redLightBox: signalLight[lightIndex],
            redLightBox_id: lightIndex + 1,
          };
        }
      }
      return line;
    });
    setLines(newLines);
    setIsDataChanged(true);
    onChange?.(true);
  };

  if (isLoading) return <Spinner />;

  return (
    <PaddingWrapper type="form">
      <RedLightViolationDetectionSetting
        lines={lines}
        signalLight={signalLight}
        onLinesChange={(newLines: any[]) => {
          setLines(newLines);
          setIsDataChanged(true);
          onChange?.(true);
        }}
        onSignalLightChange={(newSignalLight: any[]) => {
          setSignalLight(newSignalLight);
          setIsDataChanged(true);
          onChange?.(true);
        }}
        isDrawDelimitationLine={isDrawDelimitationLine}
        isDrawNormalLine={isDrawNormalLine}
        isDrawLight={isDrawLight}
        leftContent={
          <Box style={{ position: 'relative', minHeight: '200px' }}>
            <FormBuilder<IRedLightViolationSetting>
              form={form}
              configs={{
                enable: {
                  formType: 'switch',
                  label: t('red_light_violation'),
                },
                redLightDelayTime: {
                  formType: 'select',
                  label: t('light_delay_time'),
                  style: { width: '50%' },
                  options: [
                    { value: 0, label: '0s' },
                    { value: 1, label: '1s' },
                    { value: 2, label: '2s' },
                    { value: 3, label: '3s' },
                  ],
                  defaultValue: 1,
                },
              }}
              layouts={[
                {
                  name: 'enable',
                  span: 24,
                },
                {
                  name: 'redLightDelayTime',
                  span: 24,
                }, 
              ]}
              labelCol={{ span: 10 }}
              hideColon
              onValuesChange={handleValuesChange}
              initialValues={{
                enable: redLightData?.enable,
                redLightDelayTime: Number(redLightData?.redLightDelayTime || 1),
              }}
            />
            <Box marginTop="s24" display="flex" style={{ gap: '8px', flexDirection: 'column', width: '300px' }}>
              <StyledDelimitationButton
                type={isDrawDelimitationLine ? "default" : "primary"}
                onClick={handleAddDelimitationLine}
                disabled={hasDelimitationLine}
              >
                {t('add_delimitation_line')}
              </StyledDelimitationButton>
              <StyledDelimitationButton
                type={isDrawNormalLine ? "default" : "primary"}
                onClick={handleAddNormalLine}
              >
                {t('add_normal_line')}
              </StyledDelimitationButton>
              <StyledDelimitationButton
                type={isDrawLight ? "default" : "primary"}
                onClick={handleAddLight}
              >
                {t('add_light')}
              </StyledDelimitationButton>
            </Box>
            <Box marginTop="s24">
              <StyledTable>
                <tbody>
                  <tr>
                    {[1, 2, 3].map((id) => {
                      const line = lines.find(l => l.id === id);
                      if (!line) return null;
                      return (
                        <td key={id}>
                          {t('line')} {id}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    {[1, 2, 3].map((id) => {
                      const line = lines.find(l => l.id === id);
                      if (!line) return null;
                      return (
                        <td key={id}>
                          {signalLight.length > 0 ? (
                            <Select
                              value={line.lightControl || 'allow'}
                              onChange={(value) => handleLightChange(id, value)}
                              options={getTrafficLightOptions()}
                            />
                          ) : (
                            <Text style={{ color: 'black', fontWeight: 'bold'}}>{t('always_allow_through')}</Text>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </StyledTable>
            </Box>
            <Box marginTop="s48" display="flex">
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

const StyledTable = styled.table`
  width: 100%;
  max-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;

  td {
    border: 1px solid #e8e8e8;
    padding: 12px;
    font-size: 14px;
    text-align: center;
    transition: background-color 0.3s;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 33.33%;

    &:first-child {
      background-color:rgb(250, 250, 250);
    }
  }

  tr:first-child td {
    background-color:rgb(245, 245, 245);
    font-weight: 600;
    color: #333;
  }

  .ant-select {
    width: 100%;
    max-width: 100%;
    
    .ant-select-selector {
      border-radius: 6px;
      border: 1px solid #d9d9d9;
      transition: all 0.3s;
      font-size: 14px;
      
      &:hover {
        border-color: #40a9ff;
      }
    }
    
    &.ant-select-focused .ant-select-selector {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
`;

const StyledDelimitationButton = styled(Button)`
  &.ant-btn[disabled] {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.45);
    cursor: not-allowed;
    opacity: 0.8;
    
    &:hover {
      background-color: #fafafa;
      border-color: #e8e8e8;
    }
  }
`;

export default AiRedLightViolationDetectionSettingContainer;