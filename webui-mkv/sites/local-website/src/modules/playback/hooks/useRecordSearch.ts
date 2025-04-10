import { IApiError, useAPIErrorHandler } from 'modules/_shared';
import { playbackService } from '../playback-service.ts';
import { IRecordSearchRequest } from '../types';
import { useState } from 'react';

export const useRecordSearch = () => {
  const { handlerError } = useAPIErrorHandler();

  const [actionLoading, setActionLoading] = useState(false);

  const actionSearch = async (payload?: IRecordSearchRequest) => {
    try {
      setActionLoading(true);
      if (payload === null || payload === undefined) return;
      const result = await playbackService.searchPlaybackRecord(payload);

      return result?.record || [];
    } catch (e) {
      handlerError(e as IApiError);
    } finally {
      setActionLoading(false);
    }
  };

  //

  // const { data, isValidating, mutate } = useSWR(
  //   ['record_search_info', payload ? payload : null],
  //   async ([, payload]) => {
  //     if (payload === null || payload === undefined) return;
  //
  //     const result = await playbackService.searchPlaybackRecord(payload);
  //
  //     return result?.record || [];
  //   },
  //   {
  //     revalidateOnFocus: false,
  //     revalidateOnMount: true,
  //     revalidateIfStale: false,
  //     // keepPreviousData: true,
  //     onError: (error) => {
  //       handlerError(error as IApiError);
  //     },
  //   },
  // );

  return {
    actionSearch,
    actionLoading,
    setActionLoading,
    // isFetching: isValidating,
    // searchData: data,
    // mutate,
  };
};
