import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import React from 'react';
import { recordService } from '../record-service';
import { IRecordSetting } from '../types/setting';
import { message } from 'antd';
import { t } from 'configs/i18next';

export const useRecordConfig = (options?: {
  onSuccess?: (data: IRecordSetting) => void;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error } = useSWR(
    'system-record-cfg',
    () => {
      return recordService.getConfig();
    },
    {
      onError: (error) => {
        handlerError(error as IApiError);
      },
      onSuccess: (data) => {
        options?.onSuccess?.(data);
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const updateConfig = async (config: Partial<IRecordSetting>) => {
    try {
      if (!data) return;
      setActionLoading(true);
      await recordService.updateConfig({
        ...data,
        ...config,
      });
      message.success(
        t('action_success', {
          action: t('update'),
        }),
        5,
      );
    } catch (error) {
      handlerError(error as IApiError);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    isLoading,
    data,
    error,
    updateConfig,
    actionLoading,
  };
};
