import { Box, styled } from '@packages/ds-core';
// import { routeKeys } from 'configs/constants';
import { CopyRight } from 'modules/_shared/components/CopyRight';
// import { SetPasswordContainer } from 'modules/auth/containers';
import { ForgotPasswordContainer } from 'modules/auth/containers';
// import { useAuthContext } from 'modules/auth/hooks';

import React from 'react';
// import { Navigate } from 'react-router';

const ForgotPasswordPage: React.FC = () => {
  return (
    <Wrapper>
      <div className="main-container">
        <ForgotPasswordContainer />
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

export default ForgotPasswordPage;
