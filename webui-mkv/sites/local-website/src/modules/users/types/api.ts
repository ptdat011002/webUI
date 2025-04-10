/**
 * User API types
 */
import { AccountRole, AccountStatus } from './account.ts';

// POST:/API/SystemConfig/User/Set
export interface ISetAccountPayload {
  user_name: string;
  password?: string;
  password_confirm?: string;
  permission?: never;
  status?: AccountStatus;
}

// POST:/API/SystemConfig/User/Get
// TABLE 3.2
export interface IGetAccountRequest {
  user_name:
    | 'ADMIN'
    | 'USER1'
    | 'USER2'
    | 'USER3'
    | 'USER4'
    | 'USER5'
    | 'USER6'
    | 'USER7'
    | 'USER8'
    | 'USER9'
    | 'ALL';
}

// TABLE 3.3
export interface ISetAccountRequest {
  type: 'SavePassword' | 'SavePermission' | 'LockUser';
  min_password_length?: number;
  user_info: IAccountUserInfo;
}

export interface IAccountUserInfo {
  ADMIN?: IAccountInfoAPI;
  USER1?: IAccountInfoAPI;
  USER2?: IAccountInfoAPI;
  USER3?: IAccountInfoAPI;
  USER4?: IAccountInfoAPI;
  USER5?: IAccountInfoAPI;
  USER6?: IAccountInfoAPI;
  USER7?: IAccountInfoAPI;
  USER8?: IAccountInfoAPI;
  USER9?: IAccountInfoAPI;
}

// TABLE 3.4
export interface IAccountInfoAPI {
  user_state:
    | 'None'
    | 'Normal'
    | 'NotYetStart'
    | 'Expires'
    | 'ExpiresClearInfo';
  user_enable: boolean;
  username: string;
  password?: string;
  password_confirm?: string;
  permission?: IAccountUserPermission;
}

export interface IAccountInfoClient {
  role: AccountRole;
  userKey: string;
}

export type IAccountInfo = IAccountInfoAPI & IAccountInfoClient;

// TABLE 3.5
export interface IAccountUserPermission {
  live_enable?: boolean;
  playback_enable?: boolean;
  system_config?: boolean;
  device_config?: boolean;
  network_config?: boolean;
  stream_config?: boolean;
  record_enable?: boolean;
  event_enable?: boolean;
  ai_enable?: boolean;
}

export type PermissionKey = keyof IAccountUserPermission;
