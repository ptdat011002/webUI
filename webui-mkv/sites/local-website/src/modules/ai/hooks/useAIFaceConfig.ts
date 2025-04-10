import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import React from 'react';
import { IAiFaceConfig } from '../types';
import { aiService } from '../service';
import { message } from 'antd';
import { t } from 'configs/i18next';

export const useAIFaceConfig = (options?: {
  onSuccess?: (data: IAiFaceConfig) => void;
  signal?: AbortSignal;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error } = useSWR(
    'system-ai-face',
    () => {
      return aiService.getAiFaceConfig({ signal: options?.signal });
    },
    {
      onError: (error) => {
        handlerError(error as IApiError);
      },
      onSuccess: (data) => {
        if (data) {
          options?.onSuccess?.(data);
        }
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const updateConfig = async (config: Partial<IAiFaceConfig>) => {
    try {
      if (!data) return;
      setActionLoading(true);
      await aiService.setAiFaceConfig({
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
    updateConfig,
    actionLoading,
  };
};
