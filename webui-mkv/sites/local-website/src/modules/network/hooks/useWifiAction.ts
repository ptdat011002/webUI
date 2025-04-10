import { useState } from 'react';
import { IWifiItem, useScanWifi } from './useScanWifi';
import { IJoinWifiPayload } from '../types';
import { networkService } from '../network-service.ts';
import { t } from 'i18next';
import { APIErrorCode } from 'configs/fetchers/error-code.tsx';
import { IApiError } from 'modules/_shared/types.ts';
import { useWifiStatusHandler } from './useWifiStatusHandler.tsx';

export const useWifiAction = (wifi: IWifiItem, enabled = true) => {
  const [actionLoading, setLoading] = useState(false);
  const { handlerError, handlerSuccess, handlerWarning } =
    useWifiStatusHandler();

  const { refresh } = useScanWifi(enabled);

  const joinWifi = async (payload: IJoinWifiPayload) => {
    try {
      setLoading(true);
      await networkService.joinWifi(payload);
      handlerSuccess();
      refresh();
    } catch (e) {
      if (e === 400) {
        handlerWarning(
          {
            error_code: APIErrorCode.cannot_connect_to_wifi,
          } as IApiError,
          {
            confirmText: t('agree'),
            onConfirm: ({ close }) => close(),
          },
        );
        return;
      }

      handlerError(
        {
          error_code: APIErrorCode.connect_wifi_fail,
        } as IApiError,
        {
          confirmText: t('agree'),
          onConfirm: ({ close }) => close(),
        },
      );
    } finally {
      setLoading(false);
    }
  };
  const addManualWifi = joinWifi;

  return {
    wifi,
    loading: actionLoading,
    joinWifi,
    addManualWifi,
  };
};
