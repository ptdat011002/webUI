import {
  IAudioConfig,
  IStorageScheduleResponse,
  ISystemDeviceInfo,
} from './types';
import { IApiResponse, IMockFun } from 'modules/_shared/types.ts';
import { AudioEncodeType } from './types/device-audio';

export const systemDeviceApiMock: IMockFun = (adapter) => {
  adapter
    .onPost('/SystemInformation/Get')
    .reply<IApiResponse<ISystemDeviceInfo>>(200, {
      data: {
        device_id: '123456',
        device_type: 'IPC',
        fw_version: '1.0.0',
        hardware_version: '1.0.0',
        mac_address: '00:00:00:00:00:00',
        wireless_address: '00:00:00:00:00:01',
      },
      result: 'success',
    });
  adapter
    .onPost('/Schedules/Storage/Get')
    .reply<IApiResponse<IStorageScheduleResponse>>(200, {
      data: {
        schedule_enable: true,
        schedule_time: undefined,
        schedule_type: 'Storage',
      },
      result: 'success',
    });

  adapter.onPost('/StreamConfig/Audio/Set').reply(200, {
    result: 'success',
  });

  adapter
    .onPost('/StreamConfig/Audio/Get')
    .reply<IApiResponse<IAudioConfig>>(200, {
      data: {
        audio_codec: AudioEncodeType.G711A,
        audio_enable: true,
        sample_rate: 8000,
        bitrate: 64,
        out_volume: 8,
      },
    });
};
