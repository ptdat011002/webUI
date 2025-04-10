import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { deviceService } from '../device-service';
import { IApiError } from 'modules/_shared/types';
import { IAudioConfig } from '../types';
import React from 'react';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useDeviceAudio = (options?: {
  onSuccess?: (data: IAudioConfig) => void;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error } = useSWR(
    'system-audio-device-info',
    () => {
      return deviceService.getAudioConfig();
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

  const updateAudioConfig = async (config: Partial<IAudioConfig>) => {
    try {
      if (!data) return;
      setActionLoading(true);
      await deviceService.setAudioConfig({
        ...data,
        ...config,
      });
      message.success(
        t('action_success', {
          action: t('update'),
        }),
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
    updateAudioConfig,
    actionLoading,
  };
};
