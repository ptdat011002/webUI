export interface IRTMPConfig {
  rtmp_enable: boolean;
  rtmp_url: string;
}

export type IGetRTMPConfigResponse = IRTMPConfig;
export type ISetRTMPConfigPayload = IRTMPConfig;
