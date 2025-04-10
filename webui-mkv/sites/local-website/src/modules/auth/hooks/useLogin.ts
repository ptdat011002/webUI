import { useState } from 'react';
import { authService } from '../auth-service';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router';
import { routeKeys } from 'configs/constants';
import {
  ILoginInformation,
  ILoginWithPasswordPayload,
  ISetPasswordPayload,
} from '../types';
import { useAPIErrorHandler } from 'modules/_shared/hooks/useErrorHandler';
import { sleep } from '@packages/react-helper';

export const useLogin = () => {
  const { setUserLoggedInfo, refresh, deviceInfo, setResetPassword, setForgotPassword } = useAuthContext();
  const { handlerError } = useAPIErrorHandler();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginWithPassword = async (payload: ILoginWithPasswordPayload) => {
    try {
      setLoading(true);
      const digest = await authService.requestDigestsAccessAuthentication();
      const loginResponse = await authService.login(payload, digest);
      setUserLoggedInfo?.(loginResponse);
      if (setResetPassword) {
        setResetPassword(false);
      }
      if (setForgotPassword) {
        setForgotPassword(false);
      }
      navigate(routeKeys.home);
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (payload: ISetPasswordPayload) => {
    try {
      setLoading(true);
      const publicKey = await authService.requestPublicKey();
      if (!publicKey) {
        throw new Error("Can't get publicKey");
      }
      await authService.firstLoginSetPassword(payload, publicKey);
      await refresh?.(
        {
          ...(deviceInfo as ILoginInformation),
          first_login_flag: false,
        },
        {
          revalidate: false,
        },
      );
      navigate(routeKeys.security_question, {
        replace: true,
      });
    } catch (e) {
      handlerError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (callback?: () => void) => {
    try {
      setLoading(true);
      authService.logout();
      callback?.();
      await sleep(500);
      setUserLoggedInfo?.();
      window.location.reload();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return {
    loginWithPassword,
    loading,
    changePassword,
    logout,
  };
};
