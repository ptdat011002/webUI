import { IApiResponse, IMockFun } from 'modules/_shared/types.ts';
import { IStreamConfigResponse } from './types';

export const videoMock: IMockFun = (adapter) => {
  adapter
    .onPost('/StreamConfig/Encode/Main/Get')
    .reply<IApiResponse<IStreamConfigResponse>>(200, {
      data: {
        resolution: '1920x1080',
        fps: 60,
        encode_type: 'H.265',
        bitrate_control: 'CBR',
        bitrate: 1000000,
        i_frame_interval: 2,
        enable: false,
      },
      result: 'success',
    });
  adapter
    .onPost('/StreamConfig/Encode/Sub/Get')
    .reply<IApiResponse<IStreamConfigResponse>>(200, {
      data: {
        resolution: '1280x720',
        fps: 15,
        encode_type: 'H.264',
        bitrate_control: 'CBR',
        bitrate: 2048,
        i_frame_interval: 30,
        enable: true,
      },
      result: 'success',
    });
  adapter.onPost('/StreamConfig/Encode/Main/Set').reply(200, {});
  adapter.onPost('/StreamConfig/Encode/Sub/Set').reply(200, {});
};
