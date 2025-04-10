import useSWR from 'swr';
import { networkService } from '../network-service';
import { useState } from 'react';
import { IWifiSettingConfig } from '../types';
import { useAPIErrorHandler } from 'modules/_shared';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useWifiConfigure = () => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isLoading } = useSWR(
    'wifi-configuration',
    () => {
      return networkService.getWifiConfig();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
    },
  );

  const updateWifiConfig = async (config: IWifiSettingConfig) => {
    try {
      setLoading(true);
      await networkService.setWifiConfig(config);
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
    wifiConfig: data,
    loading: isLoading,
    onUpdate: updateWifiConfig,
    actionLoading,
  };
};
