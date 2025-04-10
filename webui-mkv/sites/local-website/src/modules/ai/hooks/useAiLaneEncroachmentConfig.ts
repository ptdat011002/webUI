import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import React from 'react';
import { aiService } from '../service';
import { ILaneEncroachmentSetting } from '../types/setting';

export const useAiLaneEncroachmentConfig = (options?: {
  onSuccess?: (data: ILaneEncroachmentSetting) => void;
  signal?: AbortSignal;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error, mutate } = useSWR(
    'system-ai-lane-encroachment',
    () => {
      return aiService.getAiLaneEncroachmentConfig({ signal: options?.signal });
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

const updateConfig = async (config: Partial<ILaneEncroachmentSetting>, retryCount = 0) => {
    try {
      if (!data) return;
      setActionLoading(true);
      const res = await aiService.setAiLaneEncroachmentConfig({
        ...data,
        ...config,
      });
      await mutate(async (data) => {
        return { ...data, ...config };
      });

      return res;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return updateConfig(config, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }

      if (error['reason'].includes('AI enable failed')) {
        const newError = Object.assign({}, error, { tab_name: "lane_encroachment_detection" });
        handlerError(newError);
      } else {
        handlerError(error);
      }
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
    mutate,
  };
};
