import { IRecordSearchRequest } from '../types';
import { IApiError, useAPIErrorHandler } from '../../_shared';
import { playbackService } from '../playback-service.ts';
import { useState } from 'react';

export const useRecordUrl = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setActionLoading] = useState(false);

  const actionGetUrl = async (payload?: IRecordSearchRequest) => {
    try {
      setActionLoading(true);
      if (payload === null || payload === undefined) return;
      return await playbackService.getPlaybackHttpUrl(payload);
    } catch (e) {
      handlerError(e as IApiError);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionGetUrl,
    isFetchingUrl: actionLoading,
    setActionLoading,
  };
};
