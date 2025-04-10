import { IApiResponse, IMockFun } from 'modules/_shared/types';
import { IAccountUserInfo } from './types';

export const userApiMock: IMockFun = (adapter) => {
  adapter
    .onPost('/SystemConfig/User/Get')
    .reply<IApiResponse<IAccountUserInfo>>(200, {
      data: {
        ADMIN: {
          user_state: 'Normal',
          user_enable: true,
          password: '12345678',
          username: 'ADMIN',
          password_confirm: '12345678',
          permission: {
            record_enable: true,
            system_config: true,
            device_config: true,
            playback_enable: true,
            ai_enable: true,
            event_enable: true,
            live_enable: true,
            network_config: true,
            stream_config: true,
          },
        },
        USER1: {
          user_state: 'Normal',
          user_enable: true,
          password: '12345678',
          username: 'USER1',
          password_confirm: '12345678',
          permission: {
            record_enable: true,
            system_config: true,
            device_config: false,
          },
        },
        USER2: {
          user_state: 'Expires',
          username: 'User 2',
          user_enable: false,
          password: '12345678',
        },
      },
      result: 'success',
    });
  adapter.onPost('/SystemConfig/User/Set').reply(200, {});
};
