import useSWR from 'swr';
import { networkService } from '../network-service';
import { useState } from 'react';
import { useAPIErrorHandler } from 'modules/_shared';
import { IApiError } from 'modules/_shared/types';
import { APIErrorCode } from 'configs/fetchers/error-code';
import { t } from 'i18next';
import { IRTSPConfig } from '../types';
import { message } from 'antd';

export const useRTSPConfigure = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    'rtsp-configuration',
    () => {
      return networkService.getRTSPConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      onError: (e) => {
        handlerError(
          {
            error_code: e?.error_code || APIErrorCode.can_not_fetch_data,
          } as IApiError,
          {
            confirmText: t('reload'),
            onConfirm: () => {
              window.location.reload();
            },
          },
        );
      },
    },
  );

  const updateRTSPConfig = async (config: IRTSPConfig) => {
    try {
      setLoading(true);
      await networkService.setRTSPConfig(config);

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
    loading: isLoading,
    onUpdate: updateRTSPConfig,
    actionLoading,
  };
};
