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

export interface LoginManageContainerProps {
  className?: string;
  onChange?: (isDirty: boolean) => void;
}

export const LoginManageContainer: React.FC<LoginManageContainerProps> = ({ className, onChange }) => {
  const { loadData, actionLoading, setLockPasswordConfig } = useLockPasswordConfig();
  const [form] = useForm();
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    if (loadData) {
      const initialValues = {
        ...loadData,
        session_timeout: loadData.session_timeout ? `${loadData.session_timeout} `.concat(t('minute')) : '',
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
      login_failed_number: value.login_failed_number ?? loadData?.login_failed_number,
      lock_user_timeout: value.lock_user_timeout ? parseInt(value.lock_user_timeout.replace('s', ''), 10) : loadData?.lock_user_timeout ?? 0,
      login_failed_timeout: value.login_failed_timeout ? parseInt(value.login_failed_timeout.replace('s', ''), 10) : loadData?.login_failed_timeout ?? 0,
      session_timeout: value.session_timeout? parseInt(value.session_timeout.replace('s', ''), 10) : 0,
    };

    try {
      await setLockPasswordConfig(payload);
      setIsShowWarning(false);
      setSaveSuccessVisible(true);
      setTimeout(() => setSaveSuccessVisible(false), 5000);
      setInitialFormData(form.getFieldsValue(true));
      setIsSaveDisabled(true);
      onChange?.(false);
    } catch (error) {
      message.error(t('save_failed'));
    }
  };

  const handleValuesChange = () => {
    // Compare current form data with initial data
    const currentFormData = form.getFieldsValue(true);
    const hasUnsavedChanges = JSON.stringify(currentFormData) !== JSON.stringify(initialFormData);
    console.log('hasUnsavedChanges', hasUnsavedChanges);
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
            session_timeout: {
              formType: 'select',
              label: t('time_auto_logout'),
              options: [
                {
                  value: '1 '.concat(t('minute')),
                },
                {
                  value: '3 '.concat(t('minute')),
                },
                {
                  value: '5 '.concat(t('minute')),
                },
                {
                  value: '10 '.concat(t('minute')),
                },
                {
                  value: '15 '.concat(t('minute')),
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'session_timeout',
              span: 24,
            },
          ]}
        />
        <Box marginTop="s24" display='flex'>
            <Button
              type="primary" 
              htmlType="submit"
              loading={actionLoading}
              disabled={isSaveDisabled}
              className={isSaveDisabled ? 'custom-disabled-button' : ''}
            >
              {t('save')}
            </Button>{' '}
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
  width: 652px;
`;

export default LoginManageContainer;
