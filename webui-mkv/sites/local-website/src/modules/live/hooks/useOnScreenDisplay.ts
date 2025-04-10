import { useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import useSWR from 'swr';
import { liveService } from '../live-service.ts';
import { IOSDConfigRequest } from '../types';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useOnScreenDisplay = () => {
  const { handlerError } = useAPIErrorHandler();
  const [loading, setLoading] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    'osd-configuration',
    () => {
      return liveService.getOSDConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    },
  );

  const updateOSD = async (config: IOSDConfigRequest) => {
    try {
      setLoading(true);
      await liveService.setOSDConfig(config);
      await mutate();
      message.success(
        t('action_success', {
          action: t('save'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    isLoading,
    data,
    updateOSD,
  };
};
