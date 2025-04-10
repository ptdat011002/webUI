import { useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import useSWR from 'swr';
import { systemService } from '../system-service.ts';
import { IPortConfig } from '../types';

export const useUpdatePort = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setActionLoading] = useState(false);

  const {
    data: loadData,
    mutate,
  } = useSWR(
    'services',
    () => {
      return systemService.getPortManagement();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );

  const setPort = async (payload: { services: IPortConfig[] }) => {
    try {
      setActionLoading(true);
      await systemService.setPortManagement(payload);
      await mutate(); // Revalidate the data
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    loadData,
    actionLoading,
    setPort,
  };
};
