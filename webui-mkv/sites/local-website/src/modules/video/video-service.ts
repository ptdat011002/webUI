import appApi from 'configs/fetchers/app-api';
import { IStreamConfigResponse } from './types';

const CONFIG_API_URL = '/StreamConfig/Encode';
const MAIN_API_URL = CONFIG_API_URL + '/Main';
const SUB_API_URL = CONFIG_API_URL + '/Sub';

export const videoService = {
  async getMainStream() {
    return appApi
      .post<IStreamConfigResponse>(`${MAIN_API_URL}/Get`)
      .then((res) => res.data);
  },
  async getSubStream() {
    return appApi
      .post<IStreamConfigResponse>(`${SUB_API_URL}/Get`)
      .then((res) => res.data);
  },
  async setMainStream(payload: IStreamConfigResponse) {
    return appApi
      .post<IStreamConfigResponse>(`${MAIN_API_URL}/Set`, {
        ...payload,
      })
      .then((res) => res.data);
  },
  async setSubStream(payload: IStreamConfigResponse) {
    return appApi
      .post<IStreamConfigResponse>(`${SUB_API_URL}/Set`, {
        ...payload,
      })
      .then((res) => res.data);
  },
};
