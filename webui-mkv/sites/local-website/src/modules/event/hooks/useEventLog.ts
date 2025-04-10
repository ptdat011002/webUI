import useSWR from 'swr';
import { eventService } from '../event-service';
import { ISearchLoggerRequest } from 'modules/ai/types/stats';

export const useEventLogs = (request?: ISearchLoggerRequest) => {
  const { data, isLoading, mutate } = useSWR(
    ['event_logs', request],
    ([_, request]) => {
      return eventService.searchLogs(request);
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  return {
    data,
    isLoading,
    mutate,
  };
};
