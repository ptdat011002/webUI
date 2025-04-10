import { Box, styled } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import React, { useEffect, useState } from 'react';
import { ILockPassWord, ILockPasswordConfig } from '../types';
import { t } from 'i18next';
import { Form, Button, message } from 'antd';
import { useLockPasswordConfig } from '../hooks';
import { useForm } from 'antd/es/form/Form';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { CheckOutlined } from '@ant-design/icons';
import { SaveSuccess } from 'modules/_shared';

export interface LockPasswordContainerProps {
  className?: string;
  onChange?: (isDirty: boolean) => void;
}

export const LockPasswordContainer: React.FC<LockPasswordContainerProps> = ({ className, onChange }) => {
  const { loadData, actionLoading, setLockPasswordConfig } = useLockPasswordConfig();
  const [form] = useForm();
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false); // State for visibility of the success button
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    if (loadData) {
      const initialValues = {
        ...loadData,
        lock_user_timeout: loadData.lock_user_timeout ? `${loadData.lock_user_timeout} `.concat(t('minute')) : '',
        login_failed_timeout: loadData.login_failed_timeout ? `${loadData.login_failed_timeout}s` : '0s',
      };
      form.setFieldsValue(initialValues);
      setInitialFormData(initialValues);
      setIsSaveDisabled(true);
      onChange?.(false);
    }
  }, [loadData]);

  // Show warning when there is unsaved changes
  useWarningOnLeave(isShowWarning, t);

  const handleSave = async (value: ILockPassWord) => {
    const payload: ILockPasswordConfig = {
      device_name: value.device_name ?? ' ',
      menu_timeouts: value.menu_timeouts ?? 0,
      preview_session_timeout: value.preview_session_timeout ?? false,
      login_failed_number: value.login_failed_number,
      lock_user_timeout: value.lock_user_timeout ? (parseInt(value.lock_user_timeout.replace('s', ''), 10)) : 0,
      login_failed_timeout: value.login_failed_timeout ? parseInt(value.login_failed_timeout.replace('s', ''), 10) : 0,
      session_timeout: value.session_timeout ? parseInt(value.session_timeout.replace('s', ''), 10) : loadData?.session_timeout ?? 0,
    };

    try {
      await setLockPasswordConfig(payload);
      setIsShowWarning(false); // Reset giá trị isShowWarning khi đã lưu dữ liệu
      setSaveSuccessVisible(true); // Show the success button
      setTimeout(() => setSaveSuccessVisible(false), 5000); // Hide after 5 seconds
      setInitialFormData(form.getFieldsValue(true));
      setIsSaveDisabled(true);
      onChange?.(false);
    } catch (error) {
      message.error(t('save_failed'));
    }
  };

  // Lắng nghe thay đổi trên form
  const handleValuesChange = () => {
    const currentFormData = form.getFieldsValue(true);
    
    if (currentFormData.lock_user_timeout) {
        const extractedNumber = parseInt(currentFormData.lock_user_timeout, 10) || 0;
        currentFormData.lock_user_timeout = `${extractedNumber} phút`;
    }
    if (currentFormData.login_failed_timeout) {
        const extractedNumber = parseInt(currentFormData.login_failed_timeout, 10) || 0;
        currentFormData.login_failed_timeout = `${extractedNumber}s`;
    }
    
    const hasUnsavedChanges = JSON.stringify(currentFormData) !== JSON.stringify(initialFormData);
    setIsShowWarning(hasUnsavedChanges);
    setIsSaveDisabled(!hasUnsavedChanges);
    onChange?.(hasUnsavedChanges);
  };

  return (
    <Wrapper className={className}>
      <Form<ILockPassWord>
        layout="horizontal"
        form={form}
        onFinish={handleSave}
        onValuesChange={handleValuesChange}
        colon={false}
        labelCol={{ span: 10 }}
      >
        <FormBuilder<ILockPassWord>
          asChild
          configs={{
            lock_user_timeout: {
              formType: 'select',
              label: t('lock_user_timeout'),
              options: [
                { value: '1', label: '1 '.concat(t('minute')) },
                { value: '3', label: '3 '.concat(t('minute')) },
                { value: '5', label: '5 '.concat(t('minute')) },
                { value: '10', label: '10 '.concat(t('minute')) },
              ],
            },
            login_failed_number: {
              formType: 'input-number',
              label: t('login_failed_number'),
              required: false,
              rules: [
                {
                  type: 'number',
                  min: 1,
                  max: 20,
                  message: t('login_failed_number_range'),
                },
                {
                  required: true,
                  message: t('number_login_incorrect'),
                },
              ],
            },
            login_failed_timeout: {
              formType: 'select',
              label: t('login_failed_timeout'),
              options: [
                { value: '30', label: '30s' },
                { value: '25', label: '25s' },
                { value: '20', label: '20s' },
                { value: '15', label: '15s' },
                { value: '10', label: '10s' },
                { value: '0', label: '0s' }
              ],
            },
          }}
          layouts={[
            { name: 'lock_user_timeout', span: 24 },
            { name: 'login_failed_number', span: 24 },
            { name: 'login_failed_timeout', span: 24 },
          ]}
        />
        <Box marginTop="s24" display="flex">
          <Button
            type="primary" 
            htmlType="submit"
            loading={actionLoading}
            disabled={isSaveDisabled}
            className={isSaveDisabled ? 'custom-disabled-button' : ''}
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
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  width: 900px;

  .ant-form-item-control {
    width: fit-content;
    max-width: 350px;
  }
`;

export default LockPasswordContainer;
