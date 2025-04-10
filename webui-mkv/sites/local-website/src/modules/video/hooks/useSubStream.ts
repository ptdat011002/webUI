import { useAPIErrorHandler } from 'modules/_shared/hooks/useErrorHandler.tsx';
import { videoService } from '../video-service.ts';
import { useState } from 'react';
import useSWR from 'swr';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useSubStream = () => {
  const { handlerError } = useAPIErrorHandler();

  const [loading, setLoading] = useState(false);

  const {
    data: subStreamData,
    isLoading: isSubStreamLoading,
    mutate: subStreamMutate,
    error,
  } = useSWR(
    'sub_encrypt',
    () => {
      return videoService.getSubStream();
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

  const setSubStream = async (data) => {
    try {
      setLoading(true);

      const newData = {
        ...subStreamData,
        ...data,
      };

      await videoService.setSubStream(newData);

      await subStreamMutate();

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
    subStreamData,
    isSubStreamLoading,
    setSubStream,
    loading,
    subStreamMutate,
    error,
  };
};
