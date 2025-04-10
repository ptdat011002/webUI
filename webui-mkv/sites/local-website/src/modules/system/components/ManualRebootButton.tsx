import React from 'react';
import { t } from 'configs/i18next.ts';
import { Button } from 'antd';
import { useManualReboot } from '../hooks';
import { useModal } from '@packages/react-modal';
import { Text } from '@packages/ds-core';
import { useAuthContext } from 'modules/auth/hooks';

export interface ManualRebootButtonProps {
  className?: string;
}

export const ManualRebootButton: React.FC<ManualRebootButtonProps> = () => {
  const { loading, updateManualReboot } = useManualReboot();
  const modal = useModal();

  const { setSleep } = useAuthContext();

  const handleReboot = () =>
    modal.confirm({
      title: t('notification'),
      loading: true,
      message: (
        <Text color="dark">
          {t('Are you sure you want to reboot the device?')}
        </Text>
      ),
      onConfirm: async ({ setLoading, close }) => {
        setLoading(true);
        setSleep?.(true);
        await updateManualReboot()
          .then(() => {
            modal.confirm({
              title: t('notification'),
              message: (
                <Text color="dark">
                  {t('Device is rebooting. Please log in again after 120s.')}
                </Text>
              ),
              onConfirm: ({ close }) => close(),
            });
          })
          .finally(() => {
            setLoading(false);
            setSleep?.(false);
          });
      },
      onCancel: ({ close }) => close(),
    });

  return (
    <Button
      color={'#6E6E6E'}
      style={{ border: 'none' }}
      loading={loading}
      onClick={handleReboot}
    >
      {t('reboot')}
    </Button>
  );
};
