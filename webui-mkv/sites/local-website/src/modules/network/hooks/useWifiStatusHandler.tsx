import { useModal } from '@packages/react-modal';
import { errorMessageMapping } from 'configs/fetchers/error-code';
import { t } from 'i18next';
import { NotiParams } from '@packages/react-modal/dist/types';
import { ThemeModalProvider } from 'modules/_shared/providers';
import { IApiError } from 'modules/_shared/types';

export const useWifiStatusHandler = () => {
  const modal = useModal();

  const handlerError = (
    error: IApiError | every,
    notiParams?: Omit<NotiParams, 'type' | 'message'>,
  ) => {
    const message =
      errorMessageMapping[error?.error_code] ?? t('error.default');
    modal.error({
      title: t('notification'),
      message: (
        <ThemeModalProvider selector=".modal">{message}</ThemeModalProvider>
      ),
      onConfirm: ({ close }) => close(),
      closeable: true,
      confirmText: t('agree'),
      ...notiParams,
    });
  };

  const handlerSuccess = () => {
    modal.success({
      title: t('notification'),
      message: (
        <ThemeModalProvider selector=".modal">
          {t('connect_success')}
        </ThemeModalProvider>
      ),
      onConfirm: ({ close }) => close(),
      confirmText: t('agree'),
      closeable: true,
    });
  };

  const handlerWarning = (
    error: IApiError | every,
    notiParams?: Omit<NotiParams, 'type' | 'message'>,
  ) => {
    const message =
      errorMessageMapping[error?.error_code] ?? t('error.default');
    modal.warning({
      title: t('notification'),
      message: (
        <ThemeModalProvider selector=".modal">{message}</ThemeModalProvider>
      ),
      onConfirm: ({ close }) => close(),
      closeable: true,
      confirmText: t('agree'),
      ...notiParams,
    });
  };

  return {
    handlerError,
    handlerSuccess,
    handlerWarning,
  };
};
