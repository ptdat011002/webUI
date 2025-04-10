import appApi from 'configs/fetchers/app-api';

import { IAlarmConfig, IRecordSetting, IScheduleConfig } from './types/setting';

export const recordService = {
  async getConfig() {
    return appApi
      .post<IRecordSetting>('/RecordConfig/Get')
      .then((res) => res.data);
  },
  async updateConfig(payload: Partial<IRecordSetting>) {
    return appApi
      .post('/RecordConfig/Set', { ...payload })
      .then((res) => res.data);
  },

  async getRecordSchedule() {
    return appApi
      .post<IScheduleConfig>('/Schedules/Record/Get')
      .then((res) => res.data);
  },

  async setRecordSchedule(payload: IScheduleConfig) {
    return appApi
      .post('/Schedules/Record/Set', { ...payload })
      .then((res) => res.data);
  },

  async setCaptureSchedule(payload: IScheduleConfig) {
    return appApi
      .post('/Schedules/Capture/Set', { ...payload })
      .then((res) => res.data);
  },

  async getCaptureSchedule() {
    return appApi.post('/Schedules/Capture/Get').then((res) => res.data);
  },
  async getCaptureConfig() {
    return appApi.post<IAlarmConfig>('/Alarm/AI/Get').then((res) => res.data);
  },

  async setCaptureConfig(payload: IAlarmConfig) {
    return appApi.post('/Alarm/AI/Set', { ...payload }).then((res) => res.data);
  },
};
