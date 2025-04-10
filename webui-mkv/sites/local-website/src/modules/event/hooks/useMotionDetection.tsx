import { eventService } from '../event-service.ts';
import useSWR from 'swr';
import { useAPIErrorHandler } from '../../_shared';
import { useState } from 'react';
import { IMotionDetectionConfigRequest } from '../types';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useMotionDetection = () => {
  const { handlerError } = useAPIErrorHandler();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    'motion_detection',
    () => {
      return eventService.getMotionDetectionConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const setMotionDetection = async (payload: IMotionDetectionConfigRequest) => {
    try {
      setLoading(true);
      await eventService.setMotionDetectionConfig(payload);
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );

      mutate(
        {
          ...(data as IMotionDetectionConfigRequest),
        },
        { revalidate: false },
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isFetching: isLoading,
    data,
    isUpdating: loading,
    setMotionDetection,
  };
};
