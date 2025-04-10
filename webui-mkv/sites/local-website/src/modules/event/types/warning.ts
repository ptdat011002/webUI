export interface IEventWarningConfig {
  all?: IEventWarningInfo;
  cd?: IEventWarningInfo;
  fd?: IEventWarningInfo;
  fr?: IEventWarningInfo;
  lcd?: IEventWarningInfo;
  md?: IEventWarningInfo;
  pc?: IEventWarningInfo;
  pid?: IEventWarningInfo;
}

export interface IEventWarningInfo {
  webui_enable?: boolean;
  push_to_cloud?: boolean;
  ftp_upload?: boolean;
  audio_enable?: boolean;
  record_enable?: boolean;
  snapshot_mode?: {
    enable: boolean;
    interval: number;
    count?: number;
  };
}
