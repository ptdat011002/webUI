export interface IFTPConfig {
  ftp_enable: boolean;
  server_ip: string;
  port: number;
  username: string;
  password: string;
}

export type IGetFTPConfigResponse = IFTPConfig;
export type ISetFTPConfigPayload = IFTPConfig;
