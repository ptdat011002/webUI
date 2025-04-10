import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import React from 'react';
import { aiService } from '../service';
import { IEmergencyLaneIntrusionSetting } from '../types/setting';

export const useAiEmergencyLaneIntrusionConfig = (options?: {
  onSuccess?: (data: IEmergencyLaneIntrusionSetting) => void;
  signal?: AbortSignal;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error, mutate } = useSWR(
    'system-ai-emergency-lane-intrusion',
    () => {
    return aiService.getAiEmergencyLaneIntrusionConfig({ signal: options?.signal });
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

const updateConfig = async (config: Partial<IEmergencyLaneIntrusionSetting>) => {
    try {
      if (!data) return;
      setActionLoading(true);
      const res = await aiService.setAiEmergencyLaneIntrusionConfig({
        ...data,
        ...config,
      });
      await mutate(async (data) => {
        return { ...data, ...config };
      });

      return res;
    } catch (error: IApiError | every) {
      if (error['reason'] == 'turn on FR or (FD|LCD|PID|CD|PC)') {
        const newError = Object.assign({}, error, { tab_name: "wrong_way" });
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
