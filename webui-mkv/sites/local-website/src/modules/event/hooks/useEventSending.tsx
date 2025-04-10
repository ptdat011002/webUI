import { useAPIErrorHandler } from '../../_shared';
import { useState } from 'react';
import { eventService } from '../event-service.ts';
import useSWR from 'swr';
import { IEventSendingConfig } from '../types';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useEventSending = () => {
  const { handlerError } = useAPIErrorHandler();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    'event_sending',
    () => {
      return eventService.getEventSendingConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const setEventSending = async (payload: IEventSendingConfig) => {
    try {
      setLoading(true);
      await eventService.setEventSendingConfig(payload);
      await mutate();
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
    data,
    isLoading,
    setEventSending,
    loading,
    mutate,
  };
};
