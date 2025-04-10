import { useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import useSWR from 'swr';
import { systemService } from '../system-service.ts';
import { IAutoReboot } from '../types';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useAutoReboot = () => {
  const { handlerError } = useAPIErrorHandler();

  const [loading, setLoading] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    'auto-reboot',
    async () => {
      return await systemService.getAutoReboot();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const updateAutoReboot = async (payload: IAutoReboot) => {
    try {
      setLoading(true);
      await systemService.updateAutoReboot(payload);
      await mutate();
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    isGetLoading: isLoading,
    isUpdateLoading: loading,
    error,
    mutate,
    updateAutoReboot,
  };
};
