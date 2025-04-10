import { Box, styled } from '@packages/ds-core';
import { SettingsOutlined } from '@packages/ds-icons';
import { ChevronRightCircleOutlined } from '@packages/ds-icons/src';
import { useInterval } from '@packages/react-helper';
import { CopyRight } from 'modules/_shared';
import { ReactNode, useState } from 'react';

export interface LiveLayoutProps {
  className?: string;
  mainScreen: ReactNode;
  sidebar: ReactNode;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const sideBarWidth = '550px';

export const LiveLayout: React.FC<LiveLayoutProps> = ({
  className,
  mainScreen,
  sidebar,
  collapsed = true,
  setCollapsed = () => {},
}) => {
  const [amount, setAmount] = useState(0);

  useInterval(
    () => {
      setAmount((a) => {
        if (a > 0) return 0;
        return 1;
      });
    },
    {
      delay: 5,
      condition: true,
    },
  );

  return (
    <Wrapper className={className}>
      <MainContent collapsed={collapsed}>
        <VideoScreen id="main-space">{mainScreen}</VideoScreen>
        <SideBarSpace id="sidebar-space">
          <div className="sidebar-content">{sidebar}</div>
          <FloatingButton
            noti={amount > 0}
            collapsed={collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <SettingsOutlined size={36} className="icon" />
            ) : (
              <ChevronRightCircleOutlined size={36} className="icon" />
            )}

            <Badge className="badge" show={amount > 0 && collapsed}>
              {amount}
            </Badge>
          </FloatingButton>
        </SideBarSpace>
      </MainContent>

      <CopyRight />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 100%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: hidden;
    width: 0;
  }
`;

const MainContent = styled.div<{ collapsed: boolean }>`
  flex: 1;
  display: flex;
  max-height: 100%;
  width: 100%;
  min-height: 100%;
  gap: 16px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  #main-space {
    flex: 1;
    height: 100%;
    transition: all 0.2s ease-in-out;
    padding-right: 1.5rem;
    padding-left: 1.5rem;

    @media screen and (max-width: 768px) {
      padding-right: 0.75rem;
      padding-left: 0.75rem;
      height: auto;
      flex: unset;
      width: 100%;
      min-height: 45vh;
    }
  }

  #sidebar-space {
    max-width: ${({ collapsed }) => (collapsed ? 0 : sideBarWidth)};
    width: ${sideBarWidth};
    height: 100%;
    position: relative;
    transition: max-width 0.3s ease-out;
    .sidebar-content {
      position: absolute;
      height: 100%;
      width: calc(${sideBarWidth} - 1.75rem);
      left: 0;
    }

    @media screen and (max-width: 768px) {
      width: 100%;
      max-width: 100%;
      position: relative;
      padding: 0 0.75rem;

      .sidebar-content {
        width: 100%;
        position: relative;
        box-sizing: content-box;
      }
    }
  }
`;

const VideoScreen = styled.div``;

const SideBarSpace = styled.div``;

const FloatingButton = styled.div<{
  collapsed;
  noti: boolean;
}>`
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 999;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  column-gap: ${({ noti, collapsed }) => (noti && collapsed ? '0.375rem' : 0)};
  justify-content: center;
  align-items: center;
  padding: 0.625rem 0.625rem;
  border-radius: 30px 0 0 30px;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  max-width: ${({ noti, collapsed }) => (noti && collapsed ? '200px' : '54px')};

  .icon {
    min-width: 36px;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Badge = styled.span<{ show: boolean }>`
  min-width: ${({ show }) => (show ? '24px' : 0)};
  max-width: ${({ show }) => (show ? 'auto' : 0)};
  height: ${({ show }) => (show ? '24px' : 0)};
  opacity: ${({ show }) => (show ? 1 : 0)};
  display: inline-flex;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.colors.error};
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.s}px;
  padding: ${({ show }) => (show ? '2px' : 0)};
  transition: all 0.5s ease-in-out;
  box-sizing: content-box;
`;
