import React from 'react';
import { Layout } from 'antd';
import { styled } from '@packages/ds-core';
import { MenuSidebar } from './components/MenuSidebar';
import { TopBar } from './components/topbar';
import { MenuSidebarDrawer } from './components/MenuSidebarDrawer';
import { useMedia } from 'modules/_shared';

export interface WorkspaceLayoutProps {
  children: React.ReactNode;
}
export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { mode } = useMedia();

  return (
    <React.Fragment>
      <StyledWorkspaceLayout>
        <TopBar onCollapse={setCollapsed} />
        <Layout hasSider>
          {mode !== 'mobile' && <MenuSidebar />}
          <MainContent>{children}</MainContent>
        </Layout>
      </StyledWorkspaceLayout>
      <MenuSidebarDrawer open={collapsed} setOpen={setCollapsed} />
    </React.Fragment>
  );
};

const StyledWorkspaceLayout = styled(Layout)`
  height: 100vh;
`;

const MainContent = styled(Layout.Content)`
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;
