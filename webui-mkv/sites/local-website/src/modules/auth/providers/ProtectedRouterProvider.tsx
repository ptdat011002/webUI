import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../hooks/useAuthContext';
import { routeKeys } from 'configs/constants';
import React from 'react';

import { useKeepLive } from '../hooks/useKeepLive';

export const ProtectedRouterProvider: React.FC = () => {
  const { isLogged, deviceInfo, isForgotPassword, isResetPassword } = useAuthContext();

  useKeepLive();
  console.log('Protected router isResetPassword', isResetPassword);
  if (isResetPassword) {
    return <Navigate to={routeKeys.reset_password} />;
  }
  if (isForgotPassword) {
    return <Navigate to={routeKeys.forgot_password} />;
  }

  // TODO
  if (!isLogged) {
    return <Navigate to={routeKeys.login} />;
  }

  // TODO: disable first login flag on commit

  if (deviceInfo?.first_login_flag) {
    return <Navigate to={routeKeys.first_login} />;
  }

  return <Outlet />;
};
