import { useAPIErrorHandler } from 'modules/_shared/hooks/useErrorHandler.tsx';
import { videoService } from '../video-service.ts';
import { useState } from 'react';
import useSWR from 'swr';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';
import { IStream } from '../types';

export const useMainStream = () => {
  const { handlerError } = useAPIErrorHandler();

  const [loading, setLoading] = useState(false);

  const {
    data: mainStreamData,
    isLoading: isMainStreamLoading,
    mutate: mainStreamMutate,
    error,
  } = useSWR(
    'main_encrypt',
    () => {
      return videoService.getMainStream();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
      onError: (e) => handlerError(e),
    },
  );

  const setMainStream = async (data: IStream) => {
    try {
      setLoading(true);

      const newData = {
        ...mainStreamData,
        ...data,
      };

      await videoService.setMainStream(newData);

      await mainStreamMutate();

      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    mainStreamData,
    isMainStreamLoading,
    setMainStream,
    loading,
    mainStreamMutate,
    error,
  };
};
