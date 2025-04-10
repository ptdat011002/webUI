import useSWR from 'swr';
import { authService } from '../auth-service';
import { useAPIErrorHandler } from 'modules/_shared';
import { t } from 'i18next';
import { useNavigate } from 'react-router';
import { routeKeys } from 'configs/constants';
import { useAuthContext } from './useAuthContext';
import { ILoginInformation, ISecurityQuestionPayload, ISetPasswordPayload } from '../types';
// import i18n from 'configs/i18next';
export const useSecurityQuestion = () => {
  const questionsList = {
    list_question_1: [
      { id: 1, text: 'question11' },
      { id: 2, text: 'question12' },
      { id: 3, text: 'question13' },
      { id: 4, text: 'question14' },
      { id: 5, text: 'question15' },
      { id: 6, text: 'question16' },
    ],
    list_question_2: [
      { id: 1, text: 'question21' },
      { id: 2, text: 'question22' },
      { id: 3, text: 'question23' },
      { id: 4, text: 'question24' },
      { id: 5, text: 'question25' },
    ],
    list_question_3: [
      { id: 1, text: 'question31' },
      { id: 2, text: 'question32' },
      { id: 3, text: 'question33' },
      { id: 4, text: 'question34' },
      { id: 5, text: 'question35' },
    ],
  } as const;
  const { handlerError } = useAPIErrorHandler();
  const { refresh, deviceInfo, isResetPassword, setResetPassword, setForgotPassword } = useAuthContext();
  const navigate = useNavigate();
  const {
    data: securityQuestion,
    isLoading,
    error,
    mutate,
  } = useSWR(
    'security-question',
    async () => {
      const response = await authService.getSecurityQuestion();
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
  const ResetPassword = async (payload: ISetPasswordPayload) => {
    console.log('ResetPassword', payload);
    try {
      // Get public key
      const publicKey = await authService.requestPublicKey();
      if (!publicKey) {
        throw new Error("Can't get publicKey");
      }

      const resetPassword = await authService.resetPassword(payload, publicKey);
      console.log('resetPassword', resetPassword);
      if (resetPassword.msg == 'set config sucess' || resetPassword.msg == "set_config_success") {
        navigate(routeKeys.login);
      }
      if (setResetPassword) {
        setResetPassword(false);
      }
      if (setForgotPassword) {
        setForgotPassword(false);
      }
    }
    catch (e) {
      handlerError(e);
    }
  };
  //add function verifySecurityQuestion
  const verifySecurityQuestion = async (payload: ISecurityQuestionPayload) => {
    console.log('verifySecurityQuestion', payload);
    try {
      const response = await authService.verifySecurityQuestion(payload, securityQuestion?.public_key || '');
      console.log('response >>>>>>', response);
      if (response.msg == 'set config sucess' || response.msg == "set_config_success") {
        console.log('isResetPassword', isResetPassword);
        if (setResetPassword) {
          console.log('setResetPassword');
          setResetPassword(true);
        }
        console.log('go to resert password');
        navigate(routeKeys.reset_password);
      }
      return response;
    } catch (e) {
      console.log('co loi khi verify security question:', e);
      handlerError(e);
    }
  };
  //add function setSecurityQuestion
  const setSecurityQuestion = async (payload: ISecurityQuestionPayload) => {
    console.log('setSecurityQuestion', payload);
    try {
      const response = await authService.setSecurityQuestion(payload, securityQuestion?.public_key || '');
      await refresh?.(
        {
          ...(deviceInfo as ILoginInformation),
          first_login_flag: false,
        },
        {
          revalidate: false,
        },
      );
      if (response.msg == 'set config sucess' || response.msg == "set_config_success") {
        navigate(routeKeys.home);
      }
      return response;
    } catch (e) {
      console.log('co loi xay ra khi set security question:', e);
      handlerError(e);
    }
  };
  return {
    questionsList,
    securityQuestion,
    ResetPassword,
    verifySecurityQuestion,
    setSecurityQuestion,
    loading: isLoading,
    mutate,
    error,
  };
}