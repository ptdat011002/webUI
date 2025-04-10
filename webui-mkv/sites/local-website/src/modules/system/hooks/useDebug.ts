import { systemService } from '../system-service.ts';
import { useState } from 'react';
import { useAPIErrorHandler } from 'modules/_shared/hooks/useErrorHandler.tsx';
import { APIErrorCode } from 'configs/fetchers/error-code.tsx';
import { IApiError } from 'modules/_shared/types.ts';
import { IScheduleItem } from '../types';
import useSWR from 'swr';

export const useDebug = () => {
  const { handlerError } = useAPIErrorHandler();

  const [loading, setLoading] = useState(false);

  const {
    data: debugData,
  } = useSWR(
    'debug',
    () => {
      return systemService.getDebug();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );

  const updateDebug = async (payload: IScheduleItem) => {
    try {
      setLoading(true);
      await systemService.updateDebug(payload);
    } catch (e) {
      handlerError({
        error_code: APIErrorCode.unstable_network,
      } as IApiError);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    debugData,
    updateDebug,
    loading,
  };
};