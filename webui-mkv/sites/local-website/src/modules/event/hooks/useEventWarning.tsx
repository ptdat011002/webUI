import { useAPIErrorHandler } from '../../_shared';
import { useState } from 'react';
import { eventService } from '../event-service.ts';
import useSWR from 'swr';
import { IEventWarningConfig } from '../types';

export const useEventWarning = () => {
  const { handlerError } = useAPIErrorHandler();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    'event_warning',
    () => {
      return eventService.getEventWarningConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const setEventWarning = async (payload: IEventWarningConfig) => {
    try {
      setLoading(true);
      const res = await eventService.setEventWarningConfig(payload);
      await mutate();

      return res;
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    isLoading,
    setEventWarning,
    loading,
    mutate,
  };
};
