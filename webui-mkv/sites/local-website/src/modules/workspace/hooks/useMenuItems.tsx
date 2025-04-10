import React, { useMemo } from 'react';
import { useMatches } from 'react-router';
import { MenuProps } from 'antd';
import { IRoute } from 'configs/router';
import { Link } from 'react-router-dom';
import { liveRoutes, settingsRoutes } from 'configs/router/all-routes';
import { useAuthContext } from 'modules/auth/hooks';

type IMenuItem = NonNullable<MenuProps['items']>[number];

export const useMenuItems = (includeLive?: boolean) => {
  const matchs = useMatches();
  const { currentAccount } = useAuthContext();

  const { menuItems } = useMemo(() => {
    const allowPermissions = Object.entries(currentAccount?.permission ?? {})
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    const route2Menu = (route: IRoute, parentKey = ''): IMenuItem => {
      const menuItemKey = route.path || parentKey;
      const childrenItems = route?.children?.filter((c) => !c.hiddenOnMenu);
      return {
        label: (
          <Link to={route.path || ''} style={{ color: 'unset' }}>
            {route.label}
          </Link>
        ) as React.ReactNode,
        key: route.index ? menuItemKey + '/' : menuItemKey,
        children: childrenItems?.map((c) => route2Menu(c, menuItemKey)),
        icon: route.icon,
        className: 'root-menu-item',
      };
    };

    const routes = includeLive
      ? [liveRoutes, ...settingsRoutes]
      : settingsRoutes;
    const items: IMenuItem[] = routes
      .filter((c) => !c.hiddenOnMenu)
      .filter((route) => {
        return (
          route.permission?.length === 0 ||
          route.permission?.some((p) => allowPermissions.includes(p))
        );
      })
      .map((route) => route2Menu(route));

    return {
      menuItems: items,
    };
  }, [matchs, includeLive, currentAccount]);

  const openKeys =
    settingsRoutes.filter((route) => route.defaultOpen).map((r) => r.path) ??
    [];

  const selectKeys = matchs.map((m) => m.pathname);

  const allKeys = menuItems?.map((item) => item?.key) as string[];

  return {
    menuItems,
    openKeys,
    selectKeys,
    allKeys,
  };
};
