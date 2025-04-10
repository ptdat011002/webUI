import appApi from 'configs/fetchers/app-api';
import {
  IAutoReboot,
  IFTPUpdateConfig,
  ISystemDataAndTimeConfig,
  IUpgradeCheckResponse,
  IUpgradeHttpConfig,
  IUpgradeManualRequest,
  IUpgradeStateResponse,
  IPortConfig,
  ILockPasswordConfig,
  IScheduleItem
} from './types';
import axios from 'axios';
import { ILogQueries, ILogResponse } from './types/log_history';
import { INTPConfig } from './types/ntp';

export const systemService = {
  async upgradeManual(payload: IUpgradeManualRequest) {
    return appApi
      .post('/Maintenance/HttpUpgrade/Manual', { ...payload })
      .then((res) => res.data);
  },

  async getInfoFWOffline() {
    return appApi
      .post<IFTPUpdateConfig>('/Maintenance/FtpUpgrade/Get')
      .then((res) => res.data);
  },

  async setInfoFWOffline(payload: IFTPUpdateConfig) {
    return appApi
      .post('/Maintenance/FtpUpgrade/Set', { ...payload })
      .then((res) => res.data);
  },

  // CHECK
  // URL /API/Maintenance/FtpUpgrade/Check
  // Method POST
  // Description Check Ftp Upgrade
  // Request Body
  // Response Table 8.3

  async checkFWOffline() {
    return appApi
      .post<IUpgradeCheckResponse>('/Maintenance/FtpUpgrade/Check')
      .then((res) => res.data);
  },

  // Upgrade
  // URL /API/Maintenance/FtpUpgrade/Upgrade
  // Method POST
  // Description Start Upgrade
  // Request Body
  // Response

  async upgradeFWOffline() {
    return appApi
      .post('/Maintenance/FtpUpgrade/Upgrade')
      .then((res) => res.data);
  },

  // URL /API/Maintenance/FtpUpgrade/Progress
  // Method POST
  // Description It is used to download percent
  // Request Body
  // Response Table 8.4

  async getUpgradeState() {
    return appApi
      .post<IUpgradeStateResponse>('/Maintenance/FtpUpgrade/Progress')
      .then((res) => res.data);
  },

  async updateManualReboot() {
    return appApi.post('/Maintenance/Reboot/Manual').then((res) => res.data);
  },

  async getAutoReboot() {
    return appApi
      .post<IAutoReboot>('/Maintenance/AutoReboot/Get')
      .then((res) => res.data);
  },

  async updateAutoReboot(payload: IAutoReboot) {
    return appApi
      .post('/Maintenance/AutoReboot/Set', { ...payload })
      .then((res) => res.data);
  },

  async operatorUpdateOffline(payload: FormData) {
    return axios({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: payload,
      url: '/upload.ipc',
    }).then((value) => value.data.data);

    // return appApi
    //   .post<IUpgradeManualRequest>('/upload.ipc', payload, {
    //     baseURL: '',
    //     // baseURL: 'http://193.169.0.99:3000',
    //     headers: {
    //       'Content-Type': 'application/zip',
    //     },
    //   })
    //   .then((res) => res.data);
  },

  // URL /API/Maintenance/HttpUpgrade/Check
  // Method POST
  // Description Check Http Upgrade
  // Request Body
  // Response Table 8-3
  async checkFWOnline() {
    return appApi
      .post<IUpgradeCheckResponse>('/Maintenance/HttpUpgrade/Check')
      .then((res) => res.data);
  },

  // URL /API/Maintenance/HttpUpgrade/Upgrade
  // Method POST
  // Description Start Upgrade
  // Request Body
  // Response
  async startUpgrade() {
    return appApi
      .post('/Maintenance/HttpUpgrade/Upgrade')
      .then((res) => res.data);
  },

  // URL /API/Maintenance/HttpUpgrade/Progress
  // Method POST
  // Description It is used to download percent
  // Request Body
  // Response Table 8-4
  async getUpgradeStateOnline() {
    return appApi
      .post<IUpgradeStateResponse>('/Maintenance/HttpUpgrade/Progress')
      .then((res) => res.data);
  },

  // URL /API/Maintenance/HttpUpgrade/Set
  // Method POST
  // Description Set the Http Upgrade Configuration: enable, auto, url
  // Request Body Table 8-5
  // Response
  async setInfoFWOnline(payload: IUpgradeHttpConfig) {
    return appApi
      .post('/Maintenance/HttpUpgrade/Set', { ...payload })
      .then((res) => res.data);
  },

  // URL /API/NetworkConfig/NetBase/Set
  // Method POST
  // Description Set the NetBase Configuration: port, protocol
  // Request Body Table 8-5
  // Response
  async setPortManagement(payload: { services: IPortConfig[] }) {
    return appApi
      .post('/NetworkConfig/NetBase/Set', { ...payload })
      .then((res) => res.data);
  },

  // URL /API/NetworkConfig/NetBase/Get
  // Method POST
  // Description Get the NetBase Configuration: port, protocol
  // Request Body Table 8-5
  // Response
  async getPortManagement() {
    return appApi
    .post<{services: IPortConfig[]}>('/NetworkConfig/NetBase/Get')
    .then((res) => res.data);
},

// URL /Maintenance/Debug/Set
// Method POST
// Description Set the Debug Configuration: console_enable, ssh_enable, telnet_enable
async updateDebug(payload: IScheduleItem) {
  try {
    const res = await appApi.post('/Maintenance/Debug/Set', { ...payload });

    return res.data; // Return the data part of the response if needed
  } catch (error) {
    console.log('Error update debug:', error);

    throw error;
  }
},

// URL /Maintenance/Debug/Get
// Method POST
// Description Get the Debug Configuration: console_enable, ssh_enable, telnet_enable
async getDebug() {
  try {
    const res = await appApi.post<IScheduleItem>('/Maintenance/Debug/Get')

    return res.data; // Return the data part of the response if needed
  } catch (error) {
    console.log('Error getting debug:', error);

    throw error;
  }
},

// URL /API/SystemConfig/General/Set
// Method POST
// Description Set the Lock password Configuration: login_failed_number, lock_user_timeout, login_failed_timeout
// Request Body Table 8-5
// Response
async setLockPasswordConfig(payload: ILockPasswordConfig) {

  try {
    const res = await appApi.post('/SystemConfig/General/Set', payload);

    return res.data; // Return the data part of the response if needed
  } catch (error) {
    console.log('Error setting lock password config:', error);

    throw error;
  }
},

// URL /API/SystemConfig/General/Get
// Method POST
// Description Get the Lock password Configuration: login_failed_number, lock_user_timeout, login_failed_timeout
// Request Body Table 8-5
// Response
async getLockPasswordConfig() {
  return appApi
    .post<ILockPasswordConfig>('/SystemConfig/General/Get')
    .then((res) => res.data);
  },

  // URL /API/Maintenance/HttpUpgrade/Get
  // Method POST
  // Description Get the information of Http Upgrade
  // Request Data
  // Response Table 8-8
  async getFWOnline() {
    return appApi
      .post<IUpgradeHttpConfig>('/Maintenance/HttpUpgrade/Get')
      .then((res) => res.data);
  },

  async getSystemDateTimeConfig() {
    return appApi
      .post<ISystemDataAndTimeConfig>('/SystemConfig/DateTime/Get')
      .then((res) => res.data);
  },

  async setSystemDateTimeConfig(payload: ISystemDataAndTimeConfig) {
    return appApi
      .post<ISystemDataAndTimeConfig>('/SystemConfig/DateTime/Set', {
        ...payload,
      })
      .then((res) => res.data);
  },

  async getLogs(queries: ILogQueries) {
    return appApi
      .post<ILogResponse>('/Event/Logger/Search', {
        ...queries,
      })
      .then((res) => res.data);
  },

  async getExportConfig() {
    return appApi
      .post<object>('/Maintenance/ConfigManagement/Get')
      .then((res) => res.data);
  },
  async importConfig(data: object) {
    return appApi
      .post('/Maintenance/ConfigManagement/Set', data)
      .then((res) => res.data);
  },

  async getNTPConfig() {
    return appApi
      .post<INTPConfig>('/SystemConfig/NTP/Get')
      .then((res) => res.data);
  },

  async setNTPConfig(payload: INTPConfig) {
    return appApi
      .post('/SystemConfig/NTP/Set', {
        ...payload,
      })
      .then((res) => res.data);
  },
};
