import { IApiResponse, IMockFun } from 'modules/_shared/types.ts';
import {
  IGetFTPConfigResponse,
  IGetRTMPConfigResponse,
  IGetRTSPConfigResponse,
  IGetEthernetConfigResponse,
  IGetWifiConfigResponse,
  IWifiScanResponse,
} from './types';

export const networkMockApi: IMockFun = (adapter) => {
  adapter
    .onPost('/NetworkConfig/Wifi/Scan')
    .reply<IApiResponse<IWifiScanResponse>>(200, {
      data: {
        wifi_info: [
          {
            ssid: 'Tom Tom 2.4G',
            rssi: 80,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
            password: 'password',
          },
          {
            ssid: 'Sushi 2.4G',
            rssi: 90,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
            password: 'password',
          },
          {
            ssid: 'PongPong 100KG',
            rssi: 70,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
            password: 'password',
          },
          {
            ssid: 'DUC_LE 5GB',
            rssi: 60,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
          },
          {
            ssid: 'Linh Linh',
            rssi: 50,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
          },
        ],
      },
      result: 'success',
    });

  adapter
    .onPost('/NetworkConfig/Wifi/Get')
    .reply<IApiResponse<IGetWifiConfigResponse>>(200, {
      data: {
        enable: true,
        dhcp: false,
        ip_address: '',
      },
      result: 'success',
    });

  adapter
    .onPost('/NetworkConfig/Wifi/GetConnectedWifi')
    .reply<IApiResponse<IWifiScanResponse>>(200, {
      data: {
        wifi_info: [
          {
            ssid: 'Tom Tom 2.4G',
            rssi: 80,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
            password: 'password',
          },
          {
            ssid: 'Sushi 2.4G',
            rssi: 90,
            security: 'WPA2',
            mac_address: '00:00:00:00:00:00',
            password: 'password',
          },
        ],
      },
    });

  adapter
    .onPost('/NetworkConfig/Ethernet/Get')
    .reply<IApiResponse<IGetEthernetConfigResponse>>(200, {
      data: {
        dhcp: false,
        ip_address: '',
        subnet_mask_address: '',
        gw_address: '',
      },
    });
  adapter.onPost('/NetworkConfig/Ethernet/Set').reply(200, {});

  adapter.onPost('/NetworkConfig/FTP/Set').reply(200, {});
  adapter
    .onPost('/NetworkConfig/FTP/Get')
    .reply<IApiResponse<IGetFTPConfigResponse>>(200, {
      data: {
        ftp_enable: true,
        password: 'password',
        username: 'username',
        server_ip: '192.168.1.3',
        port: 21,
      },
    });
  adapter.onPost('/NetworkConfig/RTSP/Set').reply(200, {});
  adapter
    .onPost('/NetworkConfig/RTSP/Get')
    .reply<IApiResponse<IGetRTSPConfigResponse>>(200, {
      data: {
        rtsp_enable: true,
        rtsp_url: 'rtsp://some-url',
        rtsp_url_sub: 'rtsp://some-url',
      },
    });
  adapter.onPost('/NetworkConfig/RTMP/Set').reply(200, {});
  adapter
    .onPost('/NetworkConfig/RTMP/Get')
    .reply<IApiResponse<IGetRTMPConfigResponse>>(200, {
      data: {
        rtmp_enable: true,
        rtmp_url: 'rtmp://some-url',
      },
    });
};
