import { useAPIErrorHandler } from 'modules/_shared';
import { authService } from '../auth-service';
import { useAuthContext } from './useAuthContext';
import useSWR from 'swr';
import { IApiError } from 'modules/_shared/types';
import { APIErrorCode } from 'configs/fetchers/error-code';

export const useKeepLive = () => {
  const { deviceInfo, isLogged, loading, setUserLoggedInfo, sleep } =
    useAuthContext();
  const { handlerError } = useAPIErrorHandler();

  const { data } = useSWR(
    [isLogged && deviceInfo && !loading && !sleep, 'keep-live'],
    async ([enable]) => {
      if (enable) {
        await authService.heartbeat();
        return true;
      }
      return false;
    },
    {
      refreshInterval: 30000,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: () => {
        handlerError(
          {
            error_code: APIErrorCode.request_re_login,
          } as IApiError,
          {
            onConfirm: () => {
              setUserLoggedInfo?.();
              authService.logout();
              window.location.reload();
            },
          },
        );
      },
    },
  );
  return {
    isLockScreen: data,
  };
};
