import dayjs from 'dayjs';

export enum TimeZone {
  'GTM-12' = 'GMT-12:00',
  'GTM-11' = 'GMT-11:00',
  'GTM-10' = 'GMT-10:00',
  'GTM-9' = 'GMT-09:00',
  'GTM-8' = 'GMT-08:00',
  'GTM-7' = 'GMT-07:00',
  'GTM-6' = 'GMT-06:00',
  'GTM-5' = 'GMT-05:00',
  'GTM-4' = 'GMT-04:00',
  'GTM-3' = 'GMT-03:00',
  'GTM-2' = 'GMT-02:00',
  'GTM-1' = 'GMT-01:00',
  'GTM' = 'GMT',
  'GTM+1' = 'GMT+01:00',
  'GTM+2' = 'GMT+02:00',
  'GTM+3' = 'GMT+03:00',
  'GTM+4' = 'GMT+04:00',
  'GTM+5' = 'GMT+05:00',
  'GTM+6' = 'GMT+06:00',
  'GTM+7' = 'GMT+07:00',
  'GTM+8' = 'GMT+08:00',
  'GTM+9' = 'GMT+09:00',
  'GTM+10' = 'GMT+10:00',
  'GTM+11' = 'GMT+11:00',
  'GTM+12' = 'GMT+12:00',
  'GTM+13' = 'GMT+13:00',
}

export interface ISystemDataAndTimeConfig {
  /**
   * format yyyy/mm/dd
   */
  date?: string;

  /**
   * format hh:mm:ss
   */
  time?: string;

  type?: 'manual' | 'sync_with_server';

  date_format?: 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD/MM/YYYY';

  time_format?: 12 | 24;

  time_zone?: TimeZone;

  /**
   * format dd/mm/yyyy - hh:mm:ss
   */

  system_time?: dayjs.Dayjs;

  server_address?: string;

  sync_pc_time?: boolean;
}

export type IDateTimeConfig = Omit<ISystemDataAndTimeConfig, 'sync_pc_time'> & {
  ntp_enable: boolean;
};
