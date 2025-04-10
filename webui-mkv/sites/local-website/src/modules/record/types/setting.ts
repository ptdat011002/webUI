export interface IRecordSetting {
  record_enable?: boolean;
  pre_record?: number;
}

export interface IPhotoSetting {
  enable?: boolean;
  cycle?: number;
  event?: PhotoSettingEvent;
}

export enum PhotoSettingEvent {
  crowd_detection = 'cd',
  face_detection = 'fd',
  face_recognition = 'fr',
  // lcd
  move_detection = 'md',

  hurdle_detection = 'lcd',
  //pc
  person_counting = 'pc',
  intrusion_detection = 'pid',
  all = 'all',
}
export interface IScheduleConfig {
  schedule_type: 'Record' | 'Capture';

  schedule_enable: boolean;

  schedule_time?: IScheduleTime;
}

export interface IScheduleTime {
  mode: 'period' | 'daily' | 'weekly' | 'monthly';
  period_time: number;

  list_day?: Array<{
    wday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    mday?: number;
    list_time?: Array<{
      start_time?: string;
      end_time?: string;
    }>;
  }>;
}

export type IAlarmConfig = Partial<Record<PhotoSettingEvent, IAiAlarmConfig>>;

export interface IAiAlarmConfig {
  snapshot_mode?: {
    enable: boolean;
    interval: number;
    count: number;
  };
}
