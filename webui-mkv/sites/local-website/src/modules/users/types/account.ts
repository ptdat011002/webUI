import { IBase } from 'modules/_shared/types';
import { IAccountUserPermission } from './api.ts';

export interface IAccount extends IBase {
  id: string;
  userName: string;
  password?: string;
  role: AccountRole;
  status: AccountStatus;
}

export enum AccountRole {
  Admin = 'ADMIN',
  User = 'USER',
}

export enum AccountStatus {
  None = 'None',
  Normal = 'Normal',
  NotYetStart = 'NotYetStart',
  Expires = 'Expires',
  ExpiresClearInfo = 'ExpiresClearInfo',
}

export enum UserState {
  Inactive = 'inactive',
  Active = 'active',
}

export interface IAccountChangePassword {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAccountUpdateInfo {
  userName: string;
  isUserEnabled: UserState;
}

export type IAccountUpdatePermission = IAccountUserPermission & {
  all?: boolean;
};
