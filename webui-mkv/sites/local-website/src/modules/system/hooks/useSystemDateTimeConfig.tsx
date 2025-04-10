import { useAPIErrorHandler } from 'modules/_shared';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import React from 'react';
import { systemService } from '../system-service';
import { IDateTimeConfig, ISystemDataAndTimeConfig } from '../types';
import { message } from 'antd';
import { t } from 'configs/i18next';
import { INTPConfig } from '../types/ntp';
export interface ISystemDateTimeConfigHook {
  data: {
    datetime: ISystemDataAndTimeConfig;
    ntp: INTPConfig;
  };
}
export const useSystemDateTimeConfig = (options?: {
  onSuccess?: (data: ISystemDateTimeConfigHook['data']) => void;
}) => {
  const [actionLoading, setActionLoading] = React.useState(false);
  const { handlerError } = useAPIErrorHandler();

  const { data, isLoading, error, mutate } = useSWR(
    'system-config-datetime-info',
    async () => {
      const [dateTimeConfig, ntpConfig] = await Promise.all([
        systemService.getSystemDateTimeConfig(),
        systemService.getNTPConfig(),
      ]);
      return {
        datetime: dateTimeConfig,
        ntp: ntpConfig,
      };
    },
    {
      onError: (error) => {
        handlerError(error as IApiError);
      },
      onSuccess: (data) => {
        options?.onSuccess?.(data);
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  const updateSystemDateTimeConfig = async (
    config: Partial<IDateTimeConfig>,
  ) => {
    try {
      if (!data) return;
      setActionLoading(true);
      await Promise.all([
        systemService.setSystemDateTimeConfig({
          ...data.datetime,
          date: config.date,
          time: config.time,
          date_format: config.date_format,
          time_format: config.time_format,
          time_zone: config.time_zone,
        }),
        systemService.setNTPConfig({
          ...data.ntp,
          ntp_enable: config.ntp_enable,
        }),
      ]);
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );
    } catch (error) {
      handlerError(error as IApiError);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    isLoading,
    data,
    error,
    updateSystemDateTimeConfig,
    actionLoading,
    mutate,
  };
};
