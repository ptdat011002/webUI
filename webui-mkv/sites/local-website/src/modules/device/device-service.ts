import AppApi from 'configs/fetchers/app-api.ts';
import {
  IAudioConfig,
  ISystemDeviceInfo,
  IStorage,
  IStorageFormatRequest,
  IStorageScheduleRequest,
  IStorageScheduleResponse,
} from './types';

export const deviceService = {
  async getSystemDeviceInfo() {
    return AppApi.post<ISystemDeviceInfo>('/SystemInformation/Get').then(
      (res) => res.data,
    );
  },

  async getStorageInformation() {
    return AppApi.post<IStorage>('/StorageConfig/Get').then((res) => res.data);
  },

  async setStorageInformation(payload: IStorage) {
    return AppApi.post('/StorageConfig/Set', payload).then((res) => res.data);
  },

  async getStorageSchedule() {
    return AppApi.post<IStorageScheduleResponse>('/Schedules/Storage/Get').then(
      (res) => res.data,
    );
  },

  async getAudioConfig() {
    return AppApi.post<IAudioConfig>('/StreamConfig/Audio/Get').then(
      (res) => res.data,
    );
  },

  async setAudioConfig(config: IAudioConfig) {
    return AppApi.post('/StreamConfig/Audio/Set', config).then(
      (res) => res.data,
    );
  },

  async setStorageSchedule(payload: IStorageScheduleRequest) {
    return AppApi.post('/Schedules/Storage/Set', payload).then(
      (res) => res.data,
    );
  },

  async setStorageFormat(payload: IStorageFormatRequest) {
    return AppApi.post('/StorageConfig/Format', payload).then(
      (res) => res.data,
    );
  },

  async setLanguage(language: 'VIE' | 'ENG') {
    return AppApi.post('/Login/Language/Set', { language }).then(
      (res) => res.data,
    );
  },
};
