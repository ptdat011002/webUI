import useSWR from 'swr';
import { deviceService } from '../device-service.ts';
import { useState } from 'react';
import { IStorageScheduleRequest } from '../types';
import { IApiError, useAPIErrorHandler } from '../../_shared';

export const useStorageSchedule = () => {
  const [loading, setLoading] = useState(false);

  const { handlerError } = useAPIErrorHandler();

  const { data, isLoading, mutate } = useSWR(
    'schedule_storage',
    () => {
      return deviceService.getStorageSchedule();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
      onError: (error) => {
        handlerError(error as IApiError);
      },
    },
  );

  const setStorageSchedule = async (data: IStorageScheduleRequest) => {
    try {
      setLoading(true);
      await deviceService.setStorageSchedule(data);
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
    isUpdating: loading,
    setStorageSchedule,
  };
};
