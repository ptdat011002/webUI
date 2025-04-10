import { IApiResponse, IMockFun } from '../_shared/types.ts';
import {
  IAutoReboot,
  IFTPUpdateConfig,
  ISystemDataAndTimeConfig,
  IUpgradeCheckResponse,
  IUpgradeHttpConfig,
  IUpgradeStateResponse,
  TimeZone,
} from './types';
import { ILogResponse } from './types/log_history.ts';
import { INTPConfig } from './types/ntp.ts';

export const systemApiMock: IMockFun = (adapter) => {
  adapter.onPost('/Maintenance/HttpUpgrade/Manual').reply(200, {});
  adapter
    .onPost('/Maintenance/HttpUpgrade/Get')
    .reply<IApiResponse<IUpgradeHttpConfig>>(200, {
      data: {
        schedule: {
          console_enable: true,
          ssh_enable: true,
          telnet_enable: true,
        },
        enable: true,
        url: 'https://www.google.com',
      },
    });
  adapter
    .onPost('/Maintenance/FtpUpgrade/Get')
    .reply<IApiResponse<IFTPUpdateConfig>>(200, {
      data: {
        // write mock data here
        ftp_addr: 'ftp_addr',
        ftp_port: 21,
        username: 'username',
        password: 'password',
        pwd_empty: false,
        ftp_path: 'ftp_path',
      },
      result: 'success',
    });
  adapter.onPost('/Maintenance/FtpUpgrade/Set').reply(200, {});
  adapter
    .onPost('/Maintenance/FtpUpgrade/Check')
    .reply<IApiResponse<IUpgradeCheckResponse>>(200, {
      data: {
        has_new_fw: true,
        current_version: 'current_version',
        new_version: 'new_version',
      },
      result: 'success',
    });
  adapter.onPost('/Maintenance/FtpUpgrade/Upgrade').reply(200, {});
  adapter
    .onPost('/Maintenance/FtpUpgrade/Progress')
    .reply<IApiResponse<IUpgradeStateResponse>>(200, {
      data: {
        upgrade_percent: 100,
        upgrade_state: 'upgradeSucceed',
        upgrade_result: 'success',
      },
      result: 'success',
    });
  adapter.onPost('/Maintenance/Reboot/Manual').reply(200, {});
  adapter
    .onPost('/Maintenance/HttpUpgrade/Check')
    .reply<IApiResponse<IUpgradeCheckResponse>>(200, {
      data: {
        has_new_fw: false,
        current_version: 'current_version',
        new_version: 'new_version',
      },
      result: 'success',
    });
  adapter
    .onPost('/Maintenance/AutoReboot/Get')
    .reply<IApiResponse<IAutoReboot>>(200, {
      data: {
        auto_reboot: false,
      },
      result: 'success',
    });

  adapter
    .onPost('/SystemConfig/DateTime/Get')
    .reply<IApiResponse<ISystemDataAndTimeConfig>>(200, {
      data: {
        type: 'sync_with_server',
        time_format: 24,
        time_zone: TimeZone['GTM+7'],
        date_format: 'DD/MM/YYYY',
        date: '21/06/2024',
        time: '06:12:06',
      },
    });

  adapter.onPost('SystemConfig/NTP/Get').reply<IApiResponse<INTPConfig>>(200, {
    data: {
      ntp_enable: true,
    },
  });

  adapter.onPost('SystemConfig/NTP/Set').reply(200, {});
  adapter
    .onPost('/Maintenance/Logger/Search')
    .reply<IApiResponse<ILogResponse>>(200, {
      data: {
        event_lists: Array(100).fill({
          main_type: 'Configuration',
          sub_type: 'System',
          start_date: '21/06/2024',
          start_time: '06:12:06',
          information: {
            create_time: '20241215112936',
            file_name: 'PVN_event0_20241215112936.mp4',
          },
        }),
      },
    });
  // /Maintenance/ConfigManagement/Get
  adapter
    .onPost('/Maintenance/ConfigManagement/Get')
    .reply<IApiResponse<object>>(200, {
      data: {
        // mock
        a: 'a',
        b: 'b',
      },
    });
  // /Maintenance/ConfigManagement/Set
  adapter.onPost('/Maintenance/ConfigManagement/Set').reply(200, {});
};
