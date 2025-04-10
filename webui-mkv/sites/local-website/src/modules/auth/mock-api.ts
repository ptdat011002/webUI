import { IApiError, IApiResponse, IMockFun } from 'modules/_shared/types';
import { ILoginInformation, ILoginResponse } from './types';
import { APIErrorCode } from 'configs/fetchers/error-code';

export const authApiMock: IMockFun = (adapter) => {
  adapter.onPost('/Login/Range').reply<IApiResponse<ILoginInformation>>(200, {
    data: {
      device_type: 'IPC',
      cur_lang: 'VIE',
      default_lang: 'VIE',
      first_login_flag: false,
      http_api_version: 'V1.0',
    },
    result: 'success',
  });

  adapter.onPost('/FirstLogin/SetPassword').reply<IApiError>(400, {
    error_code: APIErrorCode.no_permission,
  });

  adapter.onPost('/Web/Login').reply<IApiResponse<ILoginResponse>>(
    200,
    {
      data: {
        fail_login_count: 0,
        last_login_ip: '',
        last_login_time: '',
        pwd_remain_time: 0,
        user_name: 'admin',
      },
    },
    {
      'x-csrftoken': 'csrftoken',
    },
  );

  // adapter.onPost('/Web/Login').reply<IApiError>(
  //   400,
  //   {
  //     error_code: APIErrorCode.login_fail_or_block,
  //   },
  //   {
  //     'x-csrftoken': 'csrftoken',
  //   },
  // );
  adapter.onPost('/Login/Heartbeat').reply(200, {});
  adapter.onPost('/Login/DeviceInfo/Get').reply(200, {});
  adapter.onPost('/Web/Logout').reply(200, {});
  adapter.onPost('/Login/TransKey/Get').reply(200, {
    result: 'success',
    data: {
      Key_lists: [
        {
          type: 'base_x_public',
          key: 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALnoiHT0+3GHW+JvYvzwICZJi5IARspMCTy9aADjzS0Nsnev5rV89virKKoIroYByLn1EbcdO2D+boK2t+jCIVMCAwEAAQ==',
          seq: 0,
        },
      ],
    },
  });

  adapter.onPost('/FirstLogin/Password/Set').reply(200, {});
};
