import useSWR from 'swr';
import { deviceService } from '../device-service.ts';
import { useState } from 'react';
import { IStorage } from '../types';
import { IApiError, useAPIErrorHandler } from '../../_shared';

export const useStorageInformation = () => {
  const [loading, setLoading] = useState(false);

  const { handlerError } = useAPIErrorHandler();

  const { data, isLoading, mutate } = useSWR(
    'information_storage',
    () => {
      return deviceService.getStorageInformation();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
      onError: (error) => {
        handlerError(error as IApiError);
      },
    },
  );

  const setStorageInformation = async (payload: IStorage) => {
    try {
      setLoading(true);
      await deviceService.setStorageInformation(payload);
      await mutate();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isFetching: isLoading,
    data,
    loading,
    setStorageInformation,
  };
};
