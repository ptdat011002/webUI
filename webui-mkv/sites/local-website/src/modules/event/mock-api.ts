import { IMotionDetectionConfigResponse } from './types';
import { IApiResponse, IMockFun } from '../_shared/types.ts';

export const eventApiMock: IMockFun = (adapter) => {
  adapter
    .onPost('/AIConfig/Motion/Get')
    .reply<IApiResponse<IMotionDetectionConfigResponse>>(200, {
      data: {
        alarm_enable: false,
        record_enable: false,
        enable: true,
      },
      result: 'success',
    });
};
