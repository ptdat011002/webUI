import { useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import { systemService } from '../system-service.ts';
import useSWR from 'swr';
import { IUpgradeHttpConfig } from '../types';

export const useFWOnline = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const { handlerError } = useAPIErrorHandler();
  const {
    data: getFWData,
    isLoading,
    mutate,
  } = useSWR(
    'getFW',
    () => {
      return systemService.getFWOnline();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );

  const setFWOnline = async (payload: IUpgradeHttpConfig) => {
    try {
      setActionLoading(true);
      await systemService.setInfoFWOnline(payload);
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    getFWData,
    loading: isLoading,
    actionLoading,
    mutate,
    setFWOnline,
  };
};

export const useUpgradeFW = () => {
  const {
    data: checkFWData,
    isLoading,
    mutate,
  } = useSWR('checkFW', systemService.checkFWOnline, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateIfStale: false,
    keepPreviousData: false,
  });

  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setActionLoading] = useState(false);

  const triggerCheckFW = async () => {
    try {
      setActionLoading(true);
      const newData = await systemService.checkFWOnline();
      await mutate(newData);
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  const startUpgrade = async () => {
    try {
      setActionLoading(true);
      await systemService.startUpgrade();
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    checkFWData,
    loading: isLoading,
    actionLoading,
    mutate,
    startUpgrade,
    triggerCheckFW,
  };
};
