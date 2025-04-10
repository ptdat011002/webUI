import useSWR from 'swr';
import { networkService } from '../network-service';
import { useState } from 'react';
import { useAPIErrorHandler } from 'modules/_shared';
import { IApiError } from 'modules/_shared/types';
import { APIErrorCode } from 'configs/fetchers/error-code';
import { t } from 'i18next';
import { IFTPConfig } from '../types';
import { message } from 'antd';

export const useFTPConfigure = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isLoading } = useSWR(
    'ftp-configuration',
    () => {
      return networkService.getFTPConfig();
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

  const updateFTPConfig = async (config: IFTPConfig) => {
    try {
      setLoading(true);
      await networkService.setFTPConfig(config);
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
    onUpdate: updateFTPConfig,
    actionLoading,
  };
};
