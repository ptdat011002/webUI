import { useState } from 'react';
import { useAPIErrorHandler } from '../../_shared';
import {
  IAccountChangePassword,
  IAccountInfo,
  ISetAccountRequest,
} from '../types';
import { usersService } from '../users-service.ts';
import { useAccounts } from './useAccounts.ts';
import { authService } from '../../auth/auth-service.ts';
import { encodeByRSA } from '../../auth/helper.ts';

export const useAccount = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const { mutate } = useAccounts();
  const { handlerError } = useAPIErrorHandler();

  const updateAccount = async (payload: ISetAccountRequest) => {
    try {
      setActionLoading(true);
      await usersService.updateAccountData(payload);
      await mutate();
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  const updateAccountChangePassword = async (
    value: IAccountChangePassword,
    account: IAccountInfo,
  ) => {
    try {
      setActionLoading(true);

      const publicKey = await authService.requestPublicKey();

      if (publicKey === undefined) return;

      // Encode password by RSA public key ->
      const encryptedPassword = await encodeByRSA(
        value.newPassword,
        publicKey.key,
      );

      const payload: ISetAccountRequest = {
        type: 'SavePassword',
        user_info: {
          [account.userKey]: {
            ...account,
            password: encryptedPassword,
            password_confirm: encryptedPassword,
          },
        },
      };

      console.log(payload);

      await usersService.updateAccountData(payload);
      await mutate();
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    updateAccount,
    updateAccountChangePassword,
  };
};
