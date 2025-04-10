import { IApiResponse, IMockFun } from '../_shared/types.ts';
import { IRecordGetUrl, IRecordSearchResponse, RecordType } from './types';

export const playbackMockApi: IMockFun = (adapter) => {
  adapter
    .onPost('/Playback/Record/Search')
    .reply<IApiResponse<IRecordSearchResponse>>(200, {
      data: {
        record: [
          {
            record_type: RecordType.MotionRecord,
            start_time: 1630512000,
            duration: 10,
          },
          {
            record_type: RecordType.MotionRecord,
            start_time: 1630512010,
            duration: 15,
          },
          {
            record_type: RecordType.MotionRecord,
            start_time: 1630512025,
            duration: 20,
          },
          {
            record_type: RecordType.MotionRecord,
            start_time: 1630512045,
            duration: 25,
          },
          {
            record_type: RecordType.AI,
            start_time: 1727392163,
            duration: 10800,
          },
          {
            record_type: RecordType.MotionRecord,
            start_time: 1727392163 + 10800 * 3,
            duration: 10800 * 2,
          },
        ],
      },
    });

  adapter
    .onPost('/Playback/PlaybackHttpUrl/Get')
    .reply<IApiResponse<IRecordGetUrl>>(200, {
      data: {
        playback_url:
          'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        size: 100,
      },
    });
};
