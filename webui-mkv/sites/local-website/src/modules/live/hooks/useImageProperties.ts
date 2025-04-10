import useSWR from 'swr';
import { useAPIErrorHandler } from '../../_shared';
import { useState } from 'react';
import { liveService } from '../live-service';
import { IPTZConfig } from '../types';
import { sleep } from '@packages/react-helper';
import { message } from 'antd';
import { t } from 'i18next';

export const useImageProperties = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { autoCheck } = useAutoCheckPTZInProgress();

  const { data, isLoading } = useSWR(
    'image-configuration',
    () => {
      return liveService.getImageProperties();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    },
  );

  const updateImageConfig = async (config: IPTZConfig) => {
    try {
      setLoading(true);
      await liveService.setImageProperties(config);
      await sleep(1000);
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );

      return await autoCheck(liveService.getImageProperties);
    } catch (e) {
      handlerError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const requestFocus = async () => {
    try {
      setLoading(true);
      await liveService.requestFocus();
      await sleep(2000);

      return await autoCheck(liveService.getImageProperties);
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    imageConfig: data,
    loading: isLoading,
    actionLoading,
    onUpdate: updateImageConfig,
    onRequestFocus: requestFocus,
  };
};

// create a method that will auto pooling api in seconds to wating to finish the progress,
// then the method passed will be called after the progress is done
export const useAutoCheckPTZInProgress = () => {
  const { handlerError } = useAPIErrorHandler();

  const checkPTZInProgress = async () => {
    try {
      const r = await liveService.getPTZInProgress();

      return r.ptz_in_progress === 1;
    } catch (e) {
      handlerError(e);
    }
  };
  const autoCheck = async <T>(callback: () => Promise<T>) => {
    const isProgressing = await checkPTZInProgress();

    if (isProgressing) {
      await sleep(1000);
      return await autoCheck(callback);
    }

    return await callback();
  };

  return {
    autoCheck,
    checkPTZInProgress,
  };
};
