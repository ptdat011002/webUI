// start_date M string Date string(dd/mm/year)
// end_date M string Date string(dd/mm/year)e
// start_time M string Time string(hh/mm/ss)
// end_time M string Time string(hh/mm/ss)
// main_type O string Main_type contains:
// Configuration, Event
// sub_type O string

import { ILogResponse } from 'modules/system/types/log_history';

export interface ISearchLoggerRequest {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  main_type?: 'Configuration' | 'Event';
  sub_type?: FeatureType;
}

export type ISearchLoggerResponse = ILogResponse;

export interface IStatsSetting {
  date: string;
  time: TimeFormat;
  type: FeatureType;
  file_name: string;
}

// Sub_type contains: HTTP,
// Onvif, System, Account,
// Record, Storage, Network,
// AI , Face_Detection,
// Face_Recognition,
// People_Count,
// Crowd_Detection, Intrusion,
// Line_Cross,
// Motion_Detection,
// Streaming

export enum FeatureType {
  crowd_detection = 'Crowd_Detection',
  face_detection = 'Face_Detection',
  face_recognition = 'Face_Recognition',
  move_detection = 'Motion_Detection',
  hurdle_detection = 'Line_Cross',
  person_counting = 'People_Count',
  intrusion_detection = 'Intrusion',
  all = 'AI',
}

export enum TimeFormat {
  day = 'day',
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
}
