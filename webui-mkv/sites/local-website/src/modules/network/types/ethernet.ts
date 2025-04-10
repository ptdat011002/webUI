export interface IEthernetConfig {
  dhcp?: boolean;
  ip_address?: string;
  subnet_mask_address?: string;
  gw_address?: string;
  dns?: string;
  ipv6_dhcp?: boolean;
  ipv6_address?: string;
  ipv6_dns?: string;
  ipv6_gw_address?: string;
  ipv6_prefix_len?: string;
  mac_address?: string;
}

export type IGetEthernetConfigResponse = IEthernetConfig;
export type ISetEthernetConfigPayload = IEthernetConfig;
