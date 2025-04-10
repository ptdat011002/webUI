import { useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import useSWR from 'swr';
import { liveService } from '../live-service.ts';
import { IImageColorRequest } from '../types';
import { message } from 'antd';
import { t } from 'i18next';

export const useColorProperties = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    'color-configuration',
    () => {
      return liveService.getImageColor();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
    },
  );

  const updateColor = async (config: IImageColorRequest) => {
    try {
      setLoading(true);
      await liveService.setImageColor(config);

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

  const resetColor = async () => {
    try {
      setLoading(true);
      await liveService.resetImageColor();
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
    colorConfig: data,
    loading: isLoading,
    onUpdate: updateColor,
    onReset: resetColor,
    actionLoading,
  };
};
