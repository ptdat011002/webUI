import useSWR from 'swr';
import { liveService } from '../live-service';
import { useState } from 'react';
import { useAPIErrorHandler } from '../../_shared';

export const useWarningList = () => {
  const { data, isLoading, mutate } = useSWR(
    'warning-list',
    liveService.getWarningList,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    },
  );

  const [actionLoading, setActionLoading] = useState(false);
  const { handlerError } = useAPIErrorHandler();

  const triggerReload = async () => {
    try {
      setActionLoading(true);
      const newData = await liveService.getWarningList();
      await mutate(newData);
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    data,
    loading: isLoading,
    actionLoading,
    triggerReload,
    mutate,
  };
};
