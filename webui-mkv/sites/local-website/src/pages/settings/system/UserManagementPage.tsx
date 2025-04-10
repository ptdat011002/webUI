import React from 'react';
import { SettingsOutlined } from '@packages/ds-icons';
import { routeKeys, routeNames } from 'configs/constants';
import { Page } from 'modules/workspace/components';
import { UserListContainer } from 'modules/users/containers';
import { Box, styled } from '@packages/ds-core';
import { menuIconSize } from 'configs/theme';
import { PaddingWrapper } from 'modules/_shared';

const UserManagePage: React.FC = () => {
  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.system,
          path: routeKeys.system,
        },
        {
          title: routeNames.system_users,
          path: routeKeys.system_users,
        },
      ]}
    >
      <PaddingWrapper>
        <StyledMain>
          <UserListContainer />
        </StyledMain>
      </PaddingWrapper>
    </Page>
  );
};

export default UserManagePage;

const StyledMain = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
