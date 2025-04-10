import useSWR from 'swr';
import { authService } from '../auth-service';
import { useAPIErrorHandler } from 'modules/_shared';
import { t } from 'i18next';
import i18n from 'configs/i18next';
import { ILoginInformation } from '../types';

const mappingLanguage = {
  ENG: 'en',
  VIE: 'vi',
};

export const useDeviceInfo = () => {
  const { handlerError } = useAPIErrorHandler();
  const {
    data: loginInformation,
    isLoading,
    error,
    mutate,
  } = useSWR(
    'device-info',
    async () => {
      const response = await authService.getDeviceInfoBeforeLogin();
      // set language
      // get current lang in local storage
      const currentLang = localStorage.getItem('i18nextLng');

      const serverLang = response.cur_lang || response.default_lang || 'ENG';
      if (currentLang != mappingLanguage[serverLang]) {
        i18n.changeLanguage(mappingLanguage[serverLang]);
        return response;
      }
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
      onError: (error) => {
        handlerError(error, {
          closeable: false,
          confirmText: t('reload'),
          onConfirm: () => window.location.reload(),
        });
      },
    },
  );

  return {
    deviceInfo: {
      ...loginInformation,
      first_login_flag: import.meta.env.VITE_FORCE_FIRST_LOGIN_FLAG
        ? false
        : loginInformation?.first_login_flag,
    } as ILoginInformation,
    loading: isLoading,
    mutate,
    error,
  };
};
