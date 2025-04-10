import { Box, Spinner, Text, styled } from '@packages/ds-core';
import React, { useState, useEffect } from 'react';
import { Form, Button, message, Switch } from 'antd';
import { t } from 'i18next';
import PortManagementTable from '../components/PortManagementTable';
import { IPortManagement } from '../types/access_management';
import { useUpdatePort } from '../hooks';
import { useModal } from '@packages/react-modal';
import useWarningOnLeave from 'modules/_shared/hooks/useWarningOnLeave';
import { useDebug } from '../hooks/useDebug';
import { CheckOutlined } from '@ant-design/icons';
import { SaveSuccess } from 'modules/_shared';

export interface PortManagementContainerProps {
  className?: string;
  onChange?: (isDirty: boolean) => void;
}

const PortManagementContainer: React.FC<PortManagementContainerProps> = ({ className, onChange }) => {
  const { loadData, actionLoading, setPort } = useUpdatePort();
  const [portData, setPortData] = useState<IPortManagement[]>([]);
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false); // State for visibility of the success button
  const modal = useModal();
  const { debugData, updateDebug } = useDebug();
  const [debugEnable, setDebugEnable] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<IPortManagement[]>([]);
  const [initialDebugEnable, setInitialDebugEnable] = useState<boolean>(false);

  useEffect(() => {
    if (loadData && debugData) {
      const services = loadData.services;
      setPortData(loadData.services);
      setInitialData(JSON.parse(JSON.stringify(services)));

      const consoleEnable = !!debugData.console_enable;
      const sshEnable = !!debugData.ssh_enable;
      const telnetEnable = !!debugData.telnet_enable;
      setDebugEnable(consoleEnable && sshEnable && telnetEnable);
      setInitialDebugEnable(consoleEnable && sshEnable && telnetEnable);
    }
  }, [loadData, debugData]);

  // Show warning when there is unsaved changes
  useWarningOnLeave(isShowWarning, t);

  const isDataChanged = () => {
    const isDataChanged = (
      JSON.stringify(portData) !== JSON.stringify(initialData) || 
      debugEnable !== initialDebugEnable
    );

    return isDataChanged;
  };

  useEffect(() => {
    setIsShowWarning(isDataChanged());
    onChange?.(isDataChanged());
  }, [portData, debugEnable]);

  useEffect(() => {
    setIsShowWarning(false);
    onChange?.(false);
  }, [initialData, initialDebugEnable]);


  const handlePortChange = (index: number, value: string) => {
    const newPortData = [...portData];
    newPortData[index].port = parseInt(value, 10);
    setPortData(newPortData);
    setIsShowWarning(isDataChanged());
    onChange?.(isDataChanged());
  };

  const handleSwitchChange = (checked: boolean) => {
    setDebugEnable(checked);
    setIsShowWarning(isDataChanged());
    onChange?.(isDataChanged());
  };

  const handleSave = async () => {
    const portPayload = {
      services: portData.map((port) => ({
        old_index: port.old_index,
        service: port.service,
        port: port.port,
        protocol: port.protocol,
      })),
    };

    const debugPayload = {
      console_enable: debugEnable,
      ssh_enable: debugEnable,
      telnet_enable: debugEnable,
    };

    // Kiểm tra nếu có cổng chưa nhập
    const hasEmptyPort = portPayload.services.some(service => !service.port);
    if (hasEmptyPort) {
      modal.confirm({
        title: t('notification'),
        loading: true,
        message: (
          <Text color="dark">{t('please_do_not_leave_port_blank')}</Text>
        ),
        onConfirm: ({ close }) => {
          close();
        },
      });
      
      return;
    }

    try {
      // Gọi API để lưu port
      await setPort(portPayload);
      // Gọi API để lưu debug
      await updateDebug(debugPayload);

      setInitialDebugEnable(debugPayload.console_enable);
      setIsShowWarning(false);
      setSaveSuccessVisible(true);
      setTimeout(() => setSaveSuccessVisible(false), 5000);
    } catch (error) {
      message.error(t('save_failed'));
    }
  };

 if (!debugData) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Spinner />
    </div>
  );
}

  return (
    <Wrapper className={className}>
      <Box marginBottom="s24" />
      <Form<IPortManagement>
        layout="horizontal"
        onFinish={handleSave}
        colon={false}
        labelCol={{ span: 10 }}
      >
      <PortManagementTable portData={portData} onPortChange={handlePortChange} />
      <Box marginTop="s24">
        {t('debug')}
        <Switch 
          style={{ marginLeft: '20px' }} 
          checked={debugEnable} 
          onChange={handleSwitchChange} 
        />
      </Box>
      <Box marginTop="s24" display='flex'>
        <Button
            type="primary" 
            htmlType="submit" 
            loading={actionLoading}
            disabled={!isShowWarning}
            className={!isShowWarning ? 'custom-disabled-button' : ''}>
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
  width: 100%;
`;

export default PortManagementContainer;