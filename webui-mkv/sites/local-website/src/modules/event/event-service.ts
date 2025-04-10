import AppApi from 'configs/fetchers/app-api.ts';
import {
  IEventSendingConfig,
  IEventWarningConfig,
  IMotionDetectionConfigRequest,
  IMotionDetectionConfigResponse,
} from './types';
import appApi from 'configs/fetchers/app-api.ts';
import {
  ISearchLoggerRequest,
  ISearchLoggerResponse,
} from 'modules/ai/types/stats';

export const eventService = {
  async getMotionDetectionConfig() {
    return AppApi.post<IMotionDetectionConfigResponse>(
      '/AIConfig/Motion/Get',
    ).then((res) => res.data);
  },

  async setMotionDetectionConfig(config: IMotionDetectionConfigRequest) {
    return AppApi.post('/AIConfig/Motion/Set', config).then((res) => res.data);
  },

  async getEventWarningConfig() {
    try {
      const res = await appApi.post<IEventWarningConfig>('/Alarm/AI/Get');
        
      return res.data;
    } catch (error) {
      console.log('Error getting Alarm Config:', error);
  
      throw error;
    }
  },

  async setEventWarningConfig(payload: IEventWarningConfig) {
    try {
      const res = await appApi.post('/Alarm/AI/Set', { ...payload });
  
      return res.data;
    } catch (error) {
      console.log('Error setting Alarm Config:', error);
  
      throw error;
    }
  },

  async getEventSendingConfig() {
    return appApi
      .post<IEventSendingConfig>('/Event/Get')
      .then((res) => res.data);
  },

  async setEventSendingConfig(payload: IEventSendingConfig) {
    return appApi.post('/Event/Set', payload).then((res) => res.data);
  },
};
