import useSWR from 'swr';
import { networkService } from '../network-service';
import { useState } from 'react';
import { IEthernetConfig } from '../types/ethernet';
import { useAPIErrorHandler } from 'modules/_shared';
import { IApiError } from 'modules/_shared/types';
import { APIErrorCode } from 'configs/fetchers/error-code';
import { t } from 'i18next';
import { message } from 'antd';

export const useEthernetConfigure = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isLoading } = useSWR(
    'ethernet-configuration',
    () => {
      return networkService.getEthernetConfig();
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

  const updateEthernetConfig = async (config: IEthernetConfig) => {
    console.log('config');
    try {
      setLoading(true);
      await networkService.setEthernetConfig(config);
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
    ethernetConfig: data,
    loading: isLoading,
    onUpdate: updateEthernetConfig,
    actionLoading,
  };
};
