export interface IRTSPConfig {
  rtsp_enable: boolean;
  rtsp_url?: string;
  rtsp_url_sub?: string;
}

export type IGetRTSPConfigResponse = IRTSPConfig;
export type ISetRTSPConfigPayload = IRTSPConfig;
