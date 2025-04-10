import { Drawer, Flex, Menu } from 'antd';
import { useMenuItems } from '../hooks/useMenuItems';
import { Box, Text, styled } from '@packages/ds-core';
import React from 'react';
import { useMatches } from 'react-router';
import { routeKeys } from 'configs/constants';
import { IconButton } from 'modules/_shared';
import { CloseOutlined } from '@packages/ds-icons';

export interface MenuSidebarDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export const MenuSidebarDrawer: React.FC<MenuSidebarDrawerProps> = ({
  open,
  setOpen,
}) => {
  const matchs = useMatches();

  const isLiveActive = !!matchs.find((match) =>
    match.pathname.startsWith(routeKeys.live),
  );

  const { menuItems, selectKeys, openKeys } = useMenuItems(true);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      placement="left"
      width={300}
      zIndex={10000}
      title={
        <Flex
          style={{
            color: 'white',
            margin: 0,
          }}
          align="center"
          justify="space-between"
        >
          <Text>MENU</Text>
          <IconButton onClick={() => setOpen(false)}>
            <CloseOutlined size={48} />
          </IconButton>
        </Flex>
      }
      closeIcon={false}
      styles={{
        header: {
          borderBottom: 'none',
          paddingTop: 16,
          paddingLeft: 32,
          paddingBottom: 8,
          paddingRight: 0,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Wrapper>
        <MenuWrapper>
          <Menu
            items={menuItems}
            onSelect={() => {
              setOpen(false);
            }}
            className="root-menu"
            defaultOpenKeys={[...openKeys, ...selectKeys] as string[]}
            key={isLiveActive ? 'live' : 'settings'}
            selectedKeys={selectKeys}
            mode="inline"
          />
        </MenuWrapper>
      </Wrapper>
    </Drawer>
  );
};

const MenuWrapper = styled(Box)`
  user-select: none !important;
  padding: 0 !important;

  .ant-menu {
    border-inline-end: unset !important;
    margin-top: 0.125rem;
  }

  .root-menu-item,
  .ant-menu-submenu-title {
    align-items: center;
  }
  .ant-menu-title-content {
    padding-left: 0.5rem;
  }
  .root-menu-item {
    padding: 0 !important;
  }

  .ant-menu-submenu-title,
  .ant-menu-item {
    margin-inline-end: 0;
    width: 100% !important;
    margin-inline-start: 0;
    border-radius: 0 !important;
    padding: 0rem 1rem !important;
    height: 54px !important;
    line-height: 54px !important;
    margin-block: 0 !important;
  }

  .ant-menu-submenu-title,
  .ant-menu-item {
    :active {
      background-color: transparent !important;
    }

    .ant-menu-submenu-arrow {
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 16px;
    }
  }

  height: 100%;
  flex: 1;
  overflow-y: auto;

  .ant-menu {
    background-color: transparent !important;
  }

  .ant-menu-item.ant-menu-item-selected.ant-menu-item-only-child {
    background-color: transparent !important;
    font-weight: 400;
  }
  .ant-menu.ant-menu-sub.ant-menu-inline {
    ::before {
      display: unset !important;
    }
  }
  .ant-menu-item.ant-menu-item-only-child {
    margin-inline-end: 0;
    width: 100% !important;
    margin-inline-start: 0;
    border-radius: 0 !important;
    padding: 0rem 2rem !important;
    height: 50px !important;
    line-height: 50px !important;

    margin-block: 0 !important;
    padding-left: 3.2rem !important;
    :active {
      background-color: transparent !important;
    }

    .ant-menu-title-content {
      align-items: center;
      display: flex;
      column-gap: 1rem;
      font-size: ${({ theme }) => theme.fontSizes.m}px!important;
      ::before {
        content: '';
        background-color: currentColor;
        width: 6px !important;
        height: 6px !important;
        display: inline-block;
      }
    }
  }
  .ant-menu-item-selected,
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    background-color: ${({ theme }) => theme.colors.secondary};

    :hover,
    :active {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }

  //style scroll bar
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.primaryA200};
  }

  .ant-menu-submenu-arrow {
    color: white !important;
  }
`;
const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;
