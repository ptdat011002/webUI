import { PermissionKey } from 'modules/users/types';
import { ReactNode } from 'react';
import { RouteObject } from 'react-router';

export type IRoute = Omit<RouteObject, 'children'> & {
  hiddenOnMenu?: boolean;
  label?: string;
  icon?: ReactNode;
  children?: IRoute[];
  permission?: PermissionKey[];
  defaultOpen?: boolean;
};

export interface MenuItem extends Pick<IRoute, 'icon' | 'label' | 'path'> {
  key: string;
  children?: MenuItem[];
}
