// POST: /API/Maintenance/HttpUpgrade/Manual

import { IScheduleTime } from 'modules/_shared/types';

export interface IUpgradeManualRequest {
  ota_url: string;
}

// POST: /API/Maintenance/FtpUpgrade/Get
// POST: /API/Maintenance/FtpUpgrade/Set
export interface IFTPUpdateConfig {
  ftp_addr: string;
  ftp_port: number;
  username: string;
  password: string;
  pwd_empty: boolean;
  ftp_path: string;
}

// POST: /API/Maintenance/FtpUpgrade/Check
export interface IUpgradeCheckResponse {
  has_new_fw: boolean;
  current_version: string;
  new_version: string;
}

// POST: /API/Maintenance/FtpUpgrade/Progress
export interface IUpgradeStateResponse {
  upgrade_percent: number;
  upgrade_state:
    | 'state'
    | 'checkVersion'
    | 'downloadStart'
    | 'downloading'
    | 'verifying'
    | 'upgrading'
    | 'upgradeSucceed'
    | 'upgradeFailure'
    | 'downloadFailure'
    | 'invalidFile';
  upgrade_result: 'success' | 'failure';
}

// POST: /API/Maintenance/HttpUpgrade/Set
export interface IUpgradeHttpConfig {
  enable: boolean;
  url: string;
  schedule?: IScheduleItem;
}

// POST: /API/NetworkConfig/NetBase/Set
export interface IPortConfig {
  old_index: number;
  service: string;
  port: number;
  protocol: string;
}

// POST: /API/SystemConfig/General/Set
export interface ILockPasswordConfig {
  device_name: string;
  menu_timeouts: number;
  preview_session_timeout: boolean;
  login_failed_number: number;
  lock_user_timeout: number;
  login_failed_timeout: number;
  session_timeout: number;
}

// ssh_enable O false bool flag enables ssh service
// telnet_enable O false bool flag enables telnet service
// console_enable O false bool show console log & login
export interface IScheduleItem {
  ssh_enable?: boolean;
  telnet_enable?: boolean;
  console_enable?: boolean;
}

export type IAutoReboot = {
  auto_reboot: boolean;
  schedule_time?: IScheduleTime;
};
