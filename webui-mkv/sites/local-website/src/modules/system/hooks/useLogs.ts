import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import { systemService } from '../system-service';
import { ILogQueries } from '../types/log_history';

export const useLogs = (
  queries: ILogQueries,
  options?: { onSuccess?: (data) => void },
) => {
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error, mutate } = useSWR(
    [queries, 'system-config-datetime-info'],
    ([q]) => {
      return systemService.getLogs(q);
    },
    {
      onError: (error) => {
        handlerError(error as IApiError);
      },
      onSuccess: (data) => {
        options?.onSuccess?.(data);
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  return {
    isLoading,
    data,
    error,
    mutate,
  };
};
