import useSWR from 'swr';
import { deviceService } from '../device-service.ts';
import { APIErrorCode } from 'configs/fetchers/error-code.tsx';
import { IApiError } from 'modules/_shared/types.ts';
import { useAPIErrorHandler } from 'modules/_shared';

export const useSystemDevice = () => {
  const { handlerError } = useAPIErrorHandler();
  const { data, isLoading, error } = useSWR(
    'system-device-info',
    () => {
      return deviceService.getSystemDeviceInfo();
    },
    {
      onError: () => {
        handlerError({
          error_code: APIErrorCode.unstable_network,
        } as IApiError);
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  return {
    isLoading,
    data,
    error,
  };
};
