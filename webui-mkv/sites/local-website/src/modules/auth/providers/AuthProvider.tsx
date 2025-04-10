import React, { useState } from 'react';
import { AuthContext } from './auth-context';
import { useLoginStatus, useDeviceInfo } from '../hooks';
import { Spinner, styled } from '@packages/ds-core';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface ISecurityflag {
  isForgotPassword: boolean;
  setForgotPassword: (forgotP: boolean) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { deviceInfo, loading: deviceLoading, error, mutate } = useDeviceInfo();
  const [sleep, setSleep] = useState(false);
  const {
    isLogged,
    loading: loginStatusLoading,
    setUserLogged,
    currentAccount,
  } = useLoginStatus(deviceInfo);

  const loading = deviceLoading || loginStatusLoading;
  const [forgotP, setForgotP] = React.useState(false);
  const [resetP, setResetP] = React.useState(false);
  //set value to context

  if (loading) {
    return (
      <CenterScreen>
        <Spinner />
      </CenterScreen>
    );
  }

  if (error) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        deviceInfo: deviceInfo,
        isLogged: isLogged,
        isForgotPassword: forgotP,
        isResetPassword: resetP,
        setUserLoggedInfo: setUserLogged,
        refresh: mutate,
        setForgotPassword: setForgotP,
        setResetPassword: setResetP,
        currentAccount,
        sleep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const CenterScreen = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex: 1;
`;
