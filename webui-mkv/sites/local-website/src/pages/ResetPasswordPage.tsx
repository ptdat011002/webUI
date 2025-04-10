import { Box, styled } from '@packages/ds-core';
// import { routeKeys } from 'configs/constants';
import { CopyRight } from 'modules/_shared/components/CopyRight';
import { ResetPasswordContainer } from 'modules/auth/containers';
// import { useAuthContext } from 'modules/auth/hooks';
import React from 'react';
// import { Navigate } from 'react-router';

const ResetPasswordPage: React.FC = () => {
  // const { isLogged, deviceInfo } = useAuthContext();

  // if (!isLogged && !deviceInfo?.first_login_flag) {
  //   return <Navigate to={routeKeys.login} />;
  // }

  return (
    <Wrapper>
      <div className="main-container">
        <ResetPasswordContainer/>
      </div>
      <CopyRight className="copy-right" />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
  .main-container {
    flex: 1;
    padding: 1rem;
    display: flex;
    max-width: 100%;
    box-sizing: border-box;
  }
`;

export default ResetPasswordPage;
