import { useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import useSWR from 'swr';
import { systemService } from '../system-service.ts';
import { ILockPasswordConfig } from '../types';

export const useLockPasswordConfig = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setActionLoading] = useState(false);

  const {
    data: loadData,
    mutate,
  } = useSWR(
    'lock_password',
    () => {
      return systemService.getLockPasswordConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );

  const setLockPasswordConfig = async (payload: ILockPasswordConfig) => {
    try {
      setActionLoading(true);
      await systemService.setLockPasswordConfig(payload);
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
    setLockPasswordConfig,
  };
};
