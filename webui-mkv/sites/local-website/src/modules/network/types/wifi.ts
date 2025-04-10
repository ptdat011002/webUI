export type IWifiSignalLevel = 1 | 2 | 3 | 4;
export type IConnectStatus = 'connected' | 'connecting' | 'none';

export interface IWifiSettingConfig {
  enable: boolean;
  dhcp: boolean;
  ip_address?: string;
  subnet_mask_address?: string;
  gw_address?: string;
  dns?: string;
  ipv6_address?: string;
  ipv6_dhcp?: string;
  ipv6_dns?: string;
  ipv6_gw_address?: string;
  ipv6_prefix_len?: string;
}

// API

export interface IWifiInfo {
  ssid: string;
  rssi?: number;
  security?: string;
  mac_address?: string;
  password?: string;
}

// Table 4-6: Wifi AP IP Static Join
// KEY Requirement VALUE COMMENT
// RANGE TYPE
// ip_address Set(M) 7 – 11 bytes String IP address rule
// gw_address Set(M) 7 – 11 bytes String
// subnet_mask_address Set(M) 7 – 11 bytes String
// dns Set(M) 7 – 11 bytes String

export type IWifiIpStatic = {
  ip_address?: string;
  gw_address?: string;
  subnet_mask_address?: string;
  dns?: string;
};

export type IJoinWifiPayload = IWifiInfo & {
  ip_static?: IWifiIpStatic;
};
export type ISetWifiPayload = IWifiSettingConfig;
export type IGetWifiConfigResponse = IWifiSettingConfig;
export type IWifiScanResponse = {
  wifi_info: IWifiInfo[];
};

export interface IWifiFillPassword {
  password: string;
}

export interface IWifiConfigManual {
  ssid: string;
  password: string;
  security: string;
}

export interface IWifiDetailConfig {
  security: string;
  password: string;
}
export enum SecurityOption {
  WPA2 = 'wpa2',
  WPA = 'wpa',
  OPEN = 'open',
  WEP = 'wep',
}
