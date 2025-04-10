import appApi from 'configs/fetchers/app-api';
import {
  IEventListData,
  IImageColorRequest,
  IImageColorResponse,
  IImageControlConfigRequest,
  IImageControlConfigResponse,
  INightVisionConfigRequest,
  INightVisionConfigResponse,
  IOSDConfigRequest,
  IOSDConfigResponse,
  IPTZConfig,
  IPTZInProgress,
  PTZCommand,
} from './types';

export const liveService = {
  // /StreamConfig/ImageColor/Get
  async getImageColor() {
    return appApi
      .post<IImageColorResponse>('/StreamConfig/ImageColor/Get')
      .then((res) => res.data);
  },

  // /StreamConfig/ImageColor/Set
  async setImageColor(payload: IImageColorRequest) {
    return appApi
      .post('/StreamConfig/ImageColor/Set', { ...payload })
      .then((res) => res.data);
  },

  // /StreamConfig/ImageColor/Default
  async resetImageColor() {
    return appApi
      .post('/StreamConfig/ImageColor/Default')
      .then((res) => res.data);
  },

  // /StreamConfig/PTZ/Get
  async getImageProperties() {
    return appApi
      .post<IPTZConfig>('/StreamConfig/PTZ/Get')
      .then((res) => res.data);
  },

  // /StreamConfig/PTZ/Set
  async setImageProperties(config: IPTZConfig) {
    try {
      const res = await appApi.post('/StreamConfig/PTZ/Set', { ...config });
  
      return res.data;
    } catch (error) {
      console.log('Error setting PTZ:', error);
      throw error;
    }
  },

  // /StreamConfig/PTZ/Control/Progress
  async getPTZInProgress() {
    return appApi
      .post<IPTZInProgress>('/StreamConfig/PTZ/Control/Progress')
      .then((res) => res.data);
  },

  async requestFocus() {
    const config: IPTZConfig = {
      ptz_cmd: PTZCommand.PTZ_CMD_FOCUS_AUTO,
    };

    return this.setImageProperties(config);
  },

  async getWarningList() {
    return appApi.post<IEventListData>('/Event/Check').then((res) => res.data);
  },

  async getOSDConfig() {
    return appApi
      .post<IOSDConfigResponse>('/StreamConfig/OSD/Get')
      .then((res) => res.data);
  },

  async setOSDConfig(config: IOSDConfigRequest) {
    return appApi
      .post('/StreamConfig/OSD/Set', { ...config })
      .then((res) => res.data);
  },

  async getNightVisionConfig() {
    return appApi
      .post<INightVisionConfigResponse>('/StreamConfig/NightVision/Get')
      .then((res) => res.data);
  },

  async setNightVisionConfig(config: INightVisionConfigRequest) {
    return appApi
      .post('/StreamConfig/NightVision/Set', { ...config })
      .then((res) => res.data);
  },

  async getImageControlConfig() {
    return appApi
      .post<IImageControlConfigResponse>('/StreamConfig/ImageControl/Get')
      .then((res) => res.data);
  },

  async setImageControlConfig(payload: IImageControlConfigRequest) {
    return appApi
      .post('/StreamConfig/ImageControl/Set', { ...payload })
      .then((res) => res.data);
  },
};
