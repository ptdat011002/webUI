import appApi from 'configs/fetchers/app-api';
import {
  IAddFacePlayLoad,
  IAiFaceConfig,
  IFaceSearchResponse,
  IRemoveFacePlayLoad,
  ISearchFacePayload,
} from './types';
import { ICrowdDetectionSetting, ILaneEncroachmentSetting, ILCDSetting, IMotionDetectionSetting, IParkingDetectionSetting, 
  IPeopleCountingSetting, IPIDSetting, IRedLightViolationSetting, IWrongWaySetting, ILicensePlateRecognitionSetting, 
  IEmergencyLaneIntrusionSetting} from './types/setting';
import { ISearchLoggerRequest, ISearchLoggerResponse } from './types/stats.ts';
import { IApiError } from 'modules/_shared/types.ts';

export const aiService = {
  addFace: async (data: IAddFacePlayLoad) => {
    return appApi.post('/AIConfig/Faces/Add', data).then((res) => res.data);
  },

  updateFace: async (data: IAddFacePlayLoad) => {
    return appApi.post('/AIConfig/Faces/Modify', data).then((res) => res.data);
  },

  async removeFace(data: IRemoveFacePlayLoad) {
    return appApi.post('/AIConfig/Faces/Remove', data).then((res) => res.data);
  },

  async searchFace(data?: ISearchFacePayload) {
    return appApi
      .post<IFaceSearchResponse>('/AIConfig/Faces/Search', data)
      .then((res) => res.data);
  },

  async getAiFaceConfig(options?: { signal?: AbortSignal }) {
    return appApi
      .post<IAiFaceConfig>('/AIConfig/FaceConfig/Get', undefined, {
        signal: options?.signal,
      })
      .then((res) => res.data);
  },

  async setAiFaceConfig(data: IAiFaceConfig) {
    return appApi
      .post('/AIConfig/FaceConfig/Set', data)
      .then((res) => res.data);
  },

  async getAiPIDConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IPIDSetting>('/AIConfig/PID/Get', undefined, {
        signal: options?.signal,
      });

      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Perimeter Intrusion Detection Config:', error);
  
      throw error;
    }
  },

  async setAiPIDConfig(data: IPIDSetting, retryCount = 0) {
    try {
      const saveData = {
        enable: data.enable,
        zones: data.zones,
        threshold: data.threshold,
      }; 
      const res = await appApi.post('/AIConfig/PID/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiPIDConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Perimeter Intrusion Detection Config:', error);
  
      throw error;
    }
  },

  async getAiLCDConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<ILCDSetting>('/AIConfig/LCD/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Line Crossing Detection Config:', error);
      throw error;
    }
  },
  

  async setAiLCDConfig(data: ILCDSetting, retryCount = 0) { 
    try {
      const saveData = {
        enable: data.enable,
        lines: data.lines,
        directions: data.directions,
        threshold: data.threshold,
      }; 
      const res = await appApi.post('/AIConfig/LCD/Set', saveData);
  
      return res.data; // Return the data part of the response if needed
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiLCDConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Line Crossing Detection Config:', error);
  
      throw error;
    }
  },

  async getAiPeopleCountingConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IPeopleCountingSetting>('/AIConfig/PeopleCount/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting People counting Config:', error);
  
      throw error;
    }
  },

  async setAiPeopleCountingConfig(data: IPeopleCountingSetting, retryCount = 0) {
    try {
      const saveData = {
        enable: data.enable,
        threshold: data.threshold,
      }; 
      const res = await appApi.post('/AIConfig/PeopleCount/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiPeopleCountingConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting People counting Config:', error);
  
      throw error;
    }
  },

  async getAiCrowdDetectionConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<ICrowdDetectionSetting>('/AIConfig/CrowdDensity/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Crowd Detection Config:', error);
  
      throw error;
    }
  },

  async setAiCrowdDetectionConfig(data: ICrowdDetectionSetting, retryCount = 0) {
    try {
      const saveData = {
        enable: data.enable,
        threshold: data.threshold,
        detection_number: data.detection_number
      }; 
      const res = await appApi.post('/AIConfig/CrowdDensity/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiCrowdDetectionConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Crowd Detection Config:', error);
  
      throw error;
    }
  },
  async searchEventLog(data: ISearchLoggerRequest) {
    return appApi
      .post<ISearchLoggerResponse>('/Event/Logger/Search', data)
      .then((res) => res.data);
  },

  async getAiMotionDetectionConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IMotionDetectionSetting>('/AIConfig/Motion/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Motion Detection Config:', error);
  
      throw error;
    }
  },

  async setAiMotionDetectionConfig(data: IMotionDetectionSetting, retryCount = 0) {
    try {
      const saveData = {
        enable: data.enable,
        sensitivity: data.sensitivity,
        zone_info: data.zone_info,
      };
      const res = await appApi.post('/AIConfig/Motion/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiMotionDetectionConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Motion Detection Config:', error);
  
      throw error;
    }
  },

  async getAiParkingDetectionConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IParkingDetectionSetting>('/AIConfig/illegalParking/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Parking Detection Config:', error);
      throw error;
    }
  },

  async setAiParkingDetectionConfig(data: IParkingDetectionSetting, retryCount = 0) {
    try {
      const saveData = {
        enable: data.enable,
        zones: data.zones,
        time: data.time,
      };
      const res = await appApi.post('/AIConfig/illegalParking/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiParkingDetectionConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Parking Detection Config:', error);
  
      throw error;
    }
  },

  async getAiRedLightViolationConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IRedLightViolationSetting>('/AIConfig/Redlight/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Red Light Violation Detection Config:', error);
      throw error;
    }
  },

  async setAiRedLightViolationConfig(data: IRedLightViolationSetting, retryCount = 0) {
    try {
      const processedLines = data.lines?.map(line => {
        if (line.rule === 1) {
          const { redLightBox, ...lineWithoutRedLightBox } = line;
          return lineWithoutRedLightBox;
        }
        return line;
      }) || [];

      const saveData = {
        enable: data.enable,
        lines: processedLines,
        redLightDelayTime: data.redLightDelayTime,
      };

      const res = await appApi.post('/AIConfig/Redlight/Set', saveData);
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiRedLightViolationConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Red Light Violation Detection Config:', error);
  
      throw error;
    }
  },

  async getAiLaneEncroachmentConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<ILaneEncroachmentSetting>('/AIConfig/LaneViolation/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Lane Encroachment Detection Config:', error);
      throw error;
    }
  },

  async setAiLaneEncroachmentConfig(data: ILaneEncroachmentSetting, retryCount = 0) {
    try {
      const linesPairsWithDirection = data.linePairs?.map(line => {
        if (line.direction === undefined) {
          return { ...line, direction: 1 };
        }
        return line;
      });
      const saveData = {
        enable: data.enable,
        linePairs: linesPairsWithDirection,
      };
      const res = await appApi.post('/AIConfig/LaneViolation/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiLaneEncroachmentConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Lane Encroachment Detection Config:', error);
  
      throw error;
    }
  },

  async getAiWrongWayConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IWrongWaySetting>('/AIConfig/WrongWay/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Wrong Way Detection Config:', error);
      throw error;
    }
  },

  async setAiWrongWayConfig(data: IWrongWaySetting, retryCount = 0) {
    try {
      const zonesWithDirection = data.zones?.map(zone => {
        if (zone.direction === undefined) {
          return { ...zone, direction: 1 };
        }
        return zone;
      });
      const saveData = {
        enable: data.enable,
        zones: zonesWithDirection,
      };
      console.log('saveData', saveData);
      const res = await appApi.post('/AIConfig/WrongWay/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiWrongWayConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting Wrong Way Detection Config:', error);
  
      throw error;
    }
    },

  async getAiEmergencyLaneIntrusionConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<IEmergencyLaneIntrusionSetting>('/AIConfig/EmergencyLaneIntrusion/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting Emergency Lane Intrusion Detection Config:', error);
      throw error;
    }
  },

  async setAiEmergencyLaneIntrusionConfig(data: IEmergencyLaneIntrusionSetting) {
    try {
      const saveData = {
        enable: data.enable,
        zone_info: data.zone_info,
        order: data.order,
      };
      const res = await appApi.post('/AIConfig/EmergencyLaneIntrusion/Set', saveData);
  
      return res.data;
    } catch (error) {
      console.log('Error setting Emergency Lane Intrusion Detection Config:', error);
      throw error;
    }
  },

  async getAiLicensePlateRecognitionConfig(options?: { signal?: AbortSignal }) {
    try {
      const res = await appApi.post<ILicensePlateRecognitionSetting>('/AIConfig/ANPR/Get', undefined, {
        signal: options?.signal,
      });
  
      return res.data;
    } catch (error) {
      if (error === 'AbortError') {
        return;
      }
      console.log('Error getting License Plate Recognition Config:', error);
      throw error;
    }
  },

  async setAiLicensePlateRecognitionConfig(data: ILicensePlateRecognitionSetting, retryCount = 0) {
    try {
      const saveData = {
        enable: data.enable,
        license_plate_threshold: data.license_plate_threshold,
        min_pixel: data.min_pixel ?? 20,
        max_pixel: data.max_pixel ?? 320,
      };

      const res = await appApi.post('/AIConfig/ANPR/Set', saveData);
  
      return res.data;
    } catch (error: IApiError | any) {
      if (error['result'] === 'failed' && 
        error['reason'] === 'Device is busy, AI Process is executing.' && 
        error['error_code'] === 'set_config_failed') {
          console.log('retryCount', retryCount);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.setAiLicensePlateRecognitionConfig(data, retryCount + 1);
        }
        throw new Error('Max retries reached for device busy error');
      }
      console.log('Error setting License Plate Recognition Config:', error);
  
      throw error;
    }
  },
};
