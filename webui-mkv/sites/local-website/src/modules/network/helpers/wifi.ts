import { IWifiSignalLevel } from '../types';

export const getWifiSignalLevel = (rssi?: number): IWifiSignalLevel => {
  if (!rssi) {
    return 1;
  }
  if (rssi > -60) {
    return 4;
  }
  if (rssi > -70) {
    return 3;
  }
  if (rssi > -80) {
    return 2;
  }
  return 1;
};
