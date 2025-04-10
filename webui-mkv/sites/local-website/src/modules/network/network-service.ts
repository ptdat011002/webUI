import appApi from 'configs/fetchers/app-api';
import {
  IFTPConfig,
  IGetEthernetConfigResponse,
  IJoinWifiPayload,
  IRTMPConfig,
  IRTSPConfig,
  ISetEthernetConfigPayload,
  IWifiScanResponse,
  IWifiSettingConfig,
} from './types';

const WIFI_BASE_URL = '/NetworkConfig/Wifi';
const ETHERNET_BASE_URL = '/NetworkConfig/Ethernet';
const FTP_BASE_URL = '/NetworkConfig/FTP';
const RTSP_BASE_URL = '/NetworkConfig/RTSP';
const RTMP_BASE_URL = '/NetworkConfig/RTMP';

export const networkService = {
  async scanWifi() {
    return appApi
      .post<IWifiScanResponse>(`${WIFI_BASE_URL}/Scan`)
      .then((res) => res.data);
  },

  async joinWifi(payload: IJoinWifiPayload) {
    return appApi
      .post(`${WIFI_BASE_URL}/Join`, { ...payload })
      .then((res) => res.data);
  },

  async setWifiConfig(payload: IWifiSettingConfig) {
    return appApi
      .post(`${WIFI_BASE_URL}/Set`, { ...payload })
      .then((res) => res.data);
  },

  async getWifiConfig() {
    return appApi
      .post<IWifiSettingConfig>(`${WIFI_BASE_URL}/Get`)
      .then((res) => res.data);
  },

  async getWifiConnected() {
    return appApi
      .post<IWifiScanResponse>(`${WIFI_BASE_URL}/GetConnectedWifi`)
      .then((res) => res.data);
  },

  async getEthernetConfig() {
    return appApi
      .post<IGetEthernetConfigResponse>(`${ETHERNET_BASE_URL}/Get`)
      .then((res) => res.data);
  },

  async setEthernetConfig(payload: ISetEthernetConfigPayload) {
    return appApi
      .post(`${ETHERNET_BASE_URL}/Set`, { ...payload })
      .then((res) => res.data);
  },
  async getFTPConfig() {
    return appApi
      .post<IFTPConfig>(`${FTP_BASE_URL}/Get`)
      .then((res) => res.data);
  },
  async setFTPConfig(payload: IFTPConfig) {
    return appApi
      .post(`${FTP_BASE_URL}/Set`, { ...payload })
      .then((res) => res.data);
  },
  async getRTSPConfig() {
    return appApi
      .post<IRTSPConfig>(`${RTSP_BASE_URL}/Get`)
      .then((res) => res.data);
  },
  async setRTSPConfig(payload: IRTSPConfig) {
    return appApi
      .post(`${RTSP_BASE_URL}/Set`, { ...payload })
      .then((res) => res.data);
  },
  async getRTMPConfig() {
    return appApi
      .post<IRTMPConfig>(`${RTMP_BASE_URL}/Get`)
      .then((res) => res.data);
  },
  async setRTMPConfig(payload: IRTMPConfig) {
    return appApi
      .post(`${RTMP_BASE_URL}/Set`, { ...payload })
      .then((res) => res.data);
  },
};
