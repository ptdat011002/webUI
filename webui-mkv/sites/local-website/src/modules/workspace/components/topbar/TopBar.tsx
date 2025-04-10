import { Box, Flex, styled, Text } from '@packages/ds-core';
import { Layout } from 'antd';
import { routeKeys } from 'configs/constants';
import { t } from 'configs/i18next';
import { menuIconSize, sideBarWidth } from 'configs/theme';
import {
  ClockPlayOutlined,
  SettingsOutlined,
  ShutdownOutlined,
} from '@packages/ds-icons';
import { Logo } from 'modules/_shared/components/Logo';
import { SecondaryButton } from 'modules/_shared/components/SecondaryButton';
import { Link, useMatches } from 'react-router-dom';
import { useModal } from '@packages/react-modal';
import { useLogin } from 'modules/auth/hooks';
import { IconButton, useMedia } from 'modules/_shared';
import { MenuOutlined } from '@packages/ds-icons/src';

export interface TopbarProps {
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
}

export const TopBar: React.FC<TopbarProps> = ({ onCollapse }) => {
  const matchs = useMatches();
  const { logout } = useLogin();
  const modal = useModal();

  const { mode } = useMedia();
  const isLiveActive = !!matchs.find((match) =>
    match.pathname.startsWith(routeKeys.live),
  );

  const isPlaybackActive = !!matchs.find((match) =>
    match.pathname.startsWith(routeKeys.playback),
  );

  const isSystemActive = !isLiveActive && !isPlaybackActive;

  const handleLogout = () => {
    modal.confirm({
      title: t('notification'),
      loading: true,
      message: (
        <Text color="dark">{t('Are you sure you want to log out?')}</Text>
      ),
      onConfirm: async ({ setLoading }) => {
        setLoading(true);
        await logout();
      },
      onCancel: ({ close }) => {
        close();
      },
    });
  };
  return (
    <StyledHeader>
      <Box style={{ width: '100%', height: '100%' }}>
        <Flex
          justify="space-between"
          block
          align="stretch"
          style={{ height: '100%' }}
        >
          <Flex className="top-bar-left" justify="start" align="center">
            <IconButton onClick={() => onCollapse?.(true)}>
              <MenuOutlined size={32} />
            </IconButton>
          </Flex>

          <MainTopBar className="top-bar-center">
            <StyleHeaderSidebar
              isCollapse={isLiveActive || isPlaybackActive || mode == 'mobile'}
            >
              <Logo className="logo" />
            </StyleHeaderSidebar>
            {mode != 'mobile' && (
              <Flex>
                <Link to={routeKeys.live}>
                  <TabButton active={isLiveActive}>
                    <Dot />
                    <Text fontSize="l">{t('live')}</Text>
                  </TabButton>
                </Link>{' '}
                <Link to={routeKeys.playback}>
                  <TabButton active={isPlaybackActive}>
                    <ClockPlayOutlined size={menuIconSize} />
                    <Text fontSize="l">{t('playback')}</Text>
                  </TabButton>
                </Link>
                <Link to={routeKeys.system}>
                  <TabButton active={isSystemActive}>
                    <SettingsOutlined size={menuIconSize} />
                    <Text fontSize="l">{t('setting')}</Text>
                  </TabButton>
                </Link>
              </Flex>
            )}
          </MainTopBar>
          <Flex className="top-bar-right" align="center" justify="end">
            <SecondaryButton onClick={handleLogout}>
              <ShutdownOutlined size={menuIconSize} />
            </SecondaryButton>
          </Flex>
        </Flex>
      </Box>
    </StyledHeader>
  );
};

const StyledHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  padding: 0 !important;
  height: 72px;

  .top-bar-left,
  .top-bar-right {
    width: 60px;
    padding: 0.5rem;

    box-sizing: content-box;
  }

  .top-bar-center {
    /* flex: 1; */
    display: flex;
    justify-content: center;
    /* width: 100%; */
  }

  .logo {
    width: 140px;
  }

  @media screen and (min-width: 1024px) {
    height: 100px;

    .top-bar-left {
      display: none;
    }

    .top-bar-right {
      width: auto;
    }

    .top-bar-center {
      justify-content: start;
      flex: unset;
    }

    .logo {
      width: 180px;
    }
  }
`;

const StyleHeaderSidebar = styled.div<{
  isCollapse?: boolean;
}>`
  width: ${sideBarWidth}px;
  transition: width 0.25s;
  max-height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0.75rem;
  position: relative;
  z-index: 2;

  @media screen and (max-width: 768px) {
    width: auto;
  }

  img {
    z-index: 2;
  }

  ::before {
    content: '';
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: ${({ theme, isCollapse }) =>
      !isCollapse ? theme.colors.backgroundSecondary : 'unset'};
    transition: width 0.2s;
    width: ${({ isCollapse }) => (isCollapse ? 0 : '100%')};
  }
`;

const MainTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TabButton = styled(Box)<{ active?: boolean }>`
  display: flex;
  height: 100%;
  padding: 0 1.5rem;
  column-gap: 0.75rem;
  align-items: center;
  box-sizing: content-box;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textPrimary};
  box-sizing: border-box;
  border-bottom: 3px solid transparent;
  border-bottom-color: ${({ theme, active }) =>
    active ? theme.colors.primary : 'isLiveActive'};
`;

const Dot = styled.div`
  display: inline-block;
  margin: auto;
  width: 21px;
  height: 21px;
  border-radius: 999px;
  background-color: red;
`;
