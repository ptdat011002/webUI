import { useState } from 'react';
import useSWR from 'swr';
import { liveService } from '../live-service.ts';
import { IImageControlConfigRequest } from '../types';
import { IApiError, useAPIErrorHandler } from '../../_shared';

export const useImageControl = () => {
  const [loading, setLoading] = useState(false);

  const { handlerError } = useAPIErrorHandler();

  const { data, isLoading, mutate } = useSWR(
    'image-control-configuration',
    () => {
      return liveService.getImageControlConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
      onError: (error) => {
        handlerError(error as IApiError);
      },
    },
  );

  const updateImageControl = async (config: IImageControlConfigRequest) => {
    try {
      setLoading(true);
      await liveService.setImageControlConfig({
        ...data,
        ...config,
      });
      await mutate();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isUpdating: loading,
    isFetching: isLoading,
    data,
    updateImageControl,
  };
};
