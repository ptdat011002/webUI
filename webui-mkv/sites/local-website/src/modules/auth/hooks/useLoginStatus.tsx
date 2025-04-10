import useSWR, { mutate as globalMutate } from 'swr';
import { ILoggedInfo, ILoginInformation } from '../types';
import { x_csrf_token } from 'configs/constants';
import { useAccounts } from 'modules/users/hooks';
import { IAccountInfoAPI } from 'modules/users/types';

export const useLoginStatus = (loginInformation?: ILoginInformation) => {
  const { data, isLoading, mutate } = useSWR(
    [loginInformation, '/login-status'],
    async ([info]) => {
      if (!info) return undefined;
      try {
        const xCsrfToken = localStorage.getItem(x_csrf_token) ?? undefined;
        const user_name = localStorage.getItem('user_name');
        return {
          'X-csrfToken': xCsrfToken,
          user_name,
        };
      } catch (e) {
        return undefined;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  const { accountData, mutate: mutateAccounts } = useAccounts();

  const setUserLogged = (loggedInfo?: ILoggedInfo) => {
    if (loggedInfo) {
      localStorage.setItem(x_csrf_token, loggedInfo['X-csrfToken'] || '');
      localStorage.setItem('user_name', loggedInfo.user_name);
      mutate(
        {
          'X-csrfToken': loggedInfo['X-csrfToken'],
          user_name: loggedInfo.user_name,
        },
        {
          revalidate: true,
        },
      );

      mutateAccounts();
    } else {
      mutate(undefined, {
        revalidate: false,
      });
      localStorage.removeItem(x_csrf_token);
      localStorage.removeItem('user_name');
      globalMutate(() => true, undefined);
    }
  };

  const currentAccount = accountData?.[
    data?.user_name?.toUpperCase() ?? ''
  ] as IAccountInfoAPI;

  return {
    loading: isLoading,
    isLogged: data?.['X-csrfToken'] ? true : false,
    setUserLogged,
    currentAccount,
  };
};
