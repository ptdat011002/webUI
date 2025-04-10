import appApi from 'configs/fetchers/app-api.ts';
import {
  IRecordGetUrl,
  IRecordSearchRequest,
  IRecordSearchResponse,
} from './types';

export const playbackService = {
  // /Playback/Record/Search
  async searchPlaybackRecord(payload: IRecordSearchRequest) {
    return appApi
      .post<IRecordSearchResponse>('/Playback/Record/Search', {
        ...payload,
      })
      .then((res) => res.data);
  },
  // /Playback/PlaybackHttpUrl/Get
  async getPlaybackHttpUrl(payload: IRecordSearchRequest) {
    return appApi
      .post<IRecordGetUrl>('/Playback/PlaybackHttpUrl/Get', {
        ...payload,
      })
      .then((res) => res.data);
  },
};
