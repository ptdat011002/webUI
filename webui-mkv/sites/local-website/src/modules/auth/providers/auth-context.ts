// create context

import React from 'react';
import { ILoggedInfo, ILoginInformation } from '../types';
import { KeyedMutator } from 'swr';
import { IAccountInfoAPI } from 'modules/users/types';

export interface IAuthContext {
  deviceInfo?: ILoginInformation;
  isLogged?: boolean;
  loading?: boolean;
  isForgotPassword?: boolean;
  isResetPassword?: boolean;
  refresh?: KeyedMutator<ILoginInformation>;
  currentAccount?: IAccountInfoAPI;
  setUserLoggedInfo?: (loggedInfo?: ILoggedInfo) => void;
  setForgotPassword?: (forgotP: boolean) => void;
  setResetPassword?: (resetP: boolean) => void;
  sleep?: boolean;
  setSleep?: (sleep: boolean) => void;
}

export const AuthContext = React.createContext<IAuthContext>({});
