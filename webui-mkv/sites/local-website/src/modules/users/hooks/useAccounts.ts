import { usersService } from '../users-service';
import useSWR from 'swr';
import { IGetAccountRequest } from '../types';

export const useAccounts = () => {
  const {
    data: accountData,
    isLoading,
    mutate,
  } = useSWR(
    'account',
    () => {
      const query: IGetAccountRequest = {
        user_name: 'ALL',
      };

      return usersService.getAccountData(query);
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );

  return {
    mutate,
    loading: isLoading,
    accountData: accountData,
  };
};
