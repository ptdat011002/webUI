export interface IMotionDetectionConfig {
  enable: boolean;
  zone_info?: IZoneInfo;
  sensitivity?: number;
  record_enable?: boolean;
  snapshot_enable?: boolean;
  light_enable?: boolean;
  alarm_enable?: boolean;
}

export interface IZoneInfo {
  zone_number: number;
  point: IPoint[];
}

export interface IPoint {
  left: number;
  top: number;
  width: number;
  height: number;
}
