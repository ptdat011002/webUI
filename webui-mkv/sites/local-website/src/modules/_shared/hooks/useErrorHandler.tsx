import { useModal } from '@packages/react-modal';
import { IApiError } from '../types';
import { errorMessageMapping } from 'configs/fetchers/error-code';
import { t } from 'i18next';
import { ThemeModalProvider } from '../providers';
import { NotiParams } from '@packages/react-modal/dist/types';
import { authService } from 'modules/auth/auth-service';
import { sleep } from '@packages/react-helper';

export const useAPIErrorHandler = () => {
  const modal = useModal();

  const handlerError = (
    error: IApiError | every,
    notiParams?: Omit<NotiParams, 'type' | 'message'>,
  ) => {    
    let message =
      errorMessageMapping[error?.error_code] ?? t('error.default');
      
    if (error['reason'] && error['reason'] == 'turn on FR or (FD|LCD|PID|CD|PC)') {
      message = t('please_off_FR', {
        tab_name: t(error['tab_name']),
      });
    }

    if (error['reason'] && error['reason'].includes('AI enable failed')) {
      const match = error['reason'].match(/\[(.*?)\]/);
      if (match) {
        const features = match[1].split(' ').map(feature => {
          const translatedParts = t(feature);
          return translatedParts;
        });
        message = t('please_off_other_ai_features').concat(features.join(', '), t('before_enable_ai_feature', {
          tab_name: t(error['tab_name']),
        }));
      }
    }

    if (error['reason'] && error['reason'] == 'Need to turn off auto iris in image control') {
      message = t('Please_turn_off_auto_iris');
    }
      
    if (error['reason'] && error['reason'] == 'Failed to verify security question') {
      message = t('error_verify_security');
    } else if (error['error_code'] == 'login_failed_or_block') {
      message = t('login_failed_or_block', {
        lock_time: error.data.block_remain_time,
      });
    } else if (error['error_code'] == 'login_block_begin') {
      message = t('login_block_begin', {
        lock_time: error.data.block_remain_time / 60,
      });
    }

    modal.error({
      title: t('notification'),
      message: (
        <ThemeModalProvider selector=".modal">{message}</ThemeModalProvider>
      ),
      onConfirm: async ({ setLoading, close }) => {
        if (error?.error_code === 'request_re_login' || error?.error_code === 'user_expired_login') {
          setLoading(true);
          authService.logout();
          await sleep(500);
          window.location.reload();
        }
        close();
      },
      confirmText: t('agree'),
      ...notiParams,
    });
  };

  return {
    handlerError,
  };
};