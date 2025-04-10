import useSWR from 'swr';
import { networkService } from '../network-service';
import { useState } from 'react';
import { useAPIErrorHandler } from 'modules/_shared';
import { IApiError } from 'modules/_shared/types';
import { APIErrorCode } from 'configs/fetchers/error-code';
import { t } from 'i18next';
import { IRTMPConfig } from '../types';
import { message } from 'antd';

export const useRTMPConfigure = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    'rtmp-configuration',
    () => {
      return networkService.getRTMPConfig();
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

  const updateRTMPConfig = async (config: IRTMPConfig) => {
    try {
      setLoading(true);
      const payload = config.rtmp_enable
        ? config
        : ({ rtmp_enable: false } as IRTMPConfig);

      await networkService.setRTMPConfig(payload);
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );

      await mutate();
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading: isLoading,
    onUpdate: updateRTMPConfig,
    actionLoading,
  };
};
