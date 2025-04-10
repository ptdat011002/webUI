import { t } from 'configs/i18next';

export enum ILogLevel {
  ERROR = 1,
  WARN = 2,
  STAT = 3,
  NOTICE = 4,
  INFO = 5,
  DEBUG = 6,
  NONE = 7,
}

export const logLevelOptions = [
  { value: ILogLevel.ERROR, label: 'Lỗi' },
  { value: ILogLevel.WARN, label: 'Cảnh báo' },
  { value: ILogLevel.STAT, label: 'Thống kê' },
  { value: ILogLevel.NOTICE, label: 'Thông báo' },
  { value: ILogLevel.INFO, label: 'Thông tin' },
  { value: ILogLevel.DEBUG, label: 'Debug' },
  { value: ILogLevel.NONE, label: 'Không' },
];

export interface ILog {
  main_type: 'Configuration' | 'Event';
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  username?: string;
  sub_type?: ILogSubType;
  information?: every;
}

export enum ILogSubType {
  HTTP = '[HTTP]',
  Onvif = '[Onvif]',
  System = '[System]',
  Account = '[Account]',
  Record = '[Record]',
  Storage = '[Storage]',
  Network = '[Network]',
  Ai = '[AI]',
  Face_Detection = 'Face_Detection',
  Face_Recognition = 'Face_Recognition',
  People_Count = 'People_Count',
  Crowd_Detection = 'Crowd_Detection',
  Intrusion = 'Intrusion',
  Line_Cross = 'Line_Cross',
  Motion_Detection = 'Motion_Detection',
  Streaming = '[Streaming]',
}

export const logTypeOptions = [
  {
    value: null,
    label: t('all'),
  },
  {
    value: ILogSubType.HTTP,
    label: 'HTTP',
  },
  {
    value: ILogSubType.Onvif,
    label: 'Onvif',
  },
  {
    value: ILogSubType.System,
    label: t('system'),
  },
  {
    value: ILogSubType.Account,
    label: t('account'),
  },
  {
    value: ILogSubType.Record,
    label: t('record'),
  },
  {
    value: ILogSubType.Storage,
    label: t('storage'),
  },
  {
    value: ILogSubType.Network,
    label: t('network'),
  },
  {
    value: ILogSubType.Ai,
    label: t('ai'),
  },
  {
    value: ILogSubType.Face_Detection,
    label: t('face_detection'),
  },
  {
    value: ILogSubType.Face_Recognition,
    label: t('face_recognition'),
  },
  {
    value: ILogSubType.People_Count,
    label: t('people_counting'),
  },
  {
    value: ILogSubType.Crowd_Detection,
    label: t('crowd_detection'),
  },
  {
    value: ILogSubType.Intrusion,
    label: t('intrusion_detection'),
  },
  {
    value: ILogSubType.Line_Cross,
    label: t('line_cross_detection'),
  },
  {
    value: ILogSubType.Motion_Detection,
    label: t('motion_detection'),
  },
  {
    value: ILogSubType.Streaming,
    label: t('streaming'),
  },
];

export interface ILogQueries {
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;

  main_type?: 'Configuration' | 'Event';

  sub_type?: ILogSubType;
}

export interface ILogResponse {
  logs: ILog[];
}

export interface ILogHistory {
  time: string;
  content: string;
  information: string;
}
