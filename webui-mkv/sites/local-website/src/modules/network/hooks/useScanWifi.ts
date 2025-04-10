import useSWR, { mutate } from 'swr';
import { IConnectStatus, IWifiInfo, IWifiSignalLevel } from '../types';
import { networkService } from '../network-service';
import { useAPIErrorHandler } from 'modules/_shared';
import { APIErrorCode } from 'configs/fetchers/error-code';
import { IApiError } from 'modules/_shared/types';
import { t } from 'i18next';
import { getWifiSignalLevel } from '../helpers/wifi';

export interface IWifiItem extends IWifiInfo {
  status?: IConnectStatus;
  signal?: IWifiSignalLevel;
}

export interface UseScanWifiReturn {
  loading: boolean;
  items?: {
    recently: IWifiItem[];
    available: IWifiItem[];
  };

  refresh: () => void;
  actionLoading: boolean;
  error: every;
}

export const useScanWifi = (scanAble?: boolean): UseScanWifiReturn => {
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error } = useSWR(
    ['scan-wifi', scanAble],
    async () => {
      if (scanAble) {
        const [wifiScan, wifiConnected] = await Promise.all([
          networkService.scanWifi(),
          networkService.getWifiConnected(),
        ]);
        const allWifi: IWifiItem[] = wifiScan?.wifi_info?.map((item) => {
          return {
            ...item,
            signal: getWifiSignalLevel(item.rssi),
          };
        });

        const connectedWifi: IWifiItem[] = wifiConnected?.wifi_info?.map(
          (item) => {
            return {
              ...item,
              status: 'connected',
            };
          },
        );
        // TODO: add logic to get the recently connected wifi

        return {
          recently: connectedWifi ?? [],
          available: allWifi ?? [],
        };
      } else {
        return {
          recently: [],
          available: [],
        };
      }
    },
    {
      onError: (e) => {
        console.error(e);
        handlerError(
          {
            error_code: APIErrorCode.scan_wifi_fail,
          } as IApiError,
          {
            confirmText: t('retry'),
            onConfirm: mutate,
          },
        );
      },
      errorRetryCount: 0,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      keepPreviousData: true,
    },
  );

  return {
    loading: isLoading,
    refresh: () => {},
    actionLoading: false,
    items: data,
    error,
  };
};
