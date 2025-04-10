import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import React from 'react';
import { message } from 'antd';
import { t } from 'configs/i18next';
import { recordService } from '../record-service';
import { IAlarmConfig } from '../types/setting';

export const useCaptureConfig = (options?: {
  onSuccess?: (data: IAlarmConfig) => void;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error } = useSWR(
    'capture-audio-device-info',
    () => {
      return recordService.getCaptureConfig();
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

  const updateConfig = async (config: Partial<IAlarmConfig>) => {
    try {
      if (!data) return;
      setActionLoading(true);
      await recordService.setCaptureConfig({
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
