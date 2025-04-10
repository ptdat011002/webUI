import { useState } from 'react';
import useSWR from 'swr';
import { liveService } from '../live-service.ts';
import { INightVisionConfigRequest } from '../types';
import { IApiError, useAPIErrorHandler } from '../../_shared';

export const useNightVision = () => {
  const [loading, setLoading] = useState(false);

  const { handlerError } = useAPIErrorHandler();

  const { data, isLoading, mutate } = useSWR(
    'night-vision-configuration',
    () => {
      return liveService.getNightVisionConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
      onError: (error) => {
        handlerError(error as IApiError);
      },
    },
  );

  const updateNightVision = async (config: INightVisionConfigRequest) => {
    try {
      setLoading(true);
      await liveService.setNightVisionConfig({
        ...data,
        ...config,
      });
      await mutate();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isUpdating: loading,
    isFetching: isLoading,
    data,
    updateNightVision,
  };
};
