import { t } from 'configs/i18next';

export const routeKeys = {
  home: '/',
  login: '/login',
  first_login: '/set-password',
  live: '/live',
  live_primary: '/live/primary',
  live_secondary: '/live/secondary',
  notFound: '/404',

  security_question: '/security-question',
  forgot_password: '/forgot-password',
  reset_password: '/reset_password',
  playback: '/playback',

  system: '/system',
  system_operation: '/system/operation',
  system_device_info: '/system/device-info',
  system_setting: '/system/setting',
  system_users: '/system/users',
  system_access_management: '/system/access_management',
  ///===========
  video: '/video',
  video_encrypt: '/video/encrypt',
  display_setting: '/video/display-setting',
  video_photo: '/video/photo',

  //===========
  record: '/record',
  record_encrypt: '/record/encrypt',
  record_photo: '/record/photo',

  //===========

  event: '/event',
  event_setting: '/event/setting',
  event_warning: '/event/warning',
  event_sending: '/event/sending',

  //===========
  device: '/device',
  device_audio: '/device/audio',
  device_storage: '/device/storage',

  //===========
  ai: '/ai',
  ai_setting: '/ai/setting',
  ai_traffic_setting: '/ai/traffic-setting',
  ai_recognition: '/ai/recognition',
  ai_statistics: '/ai/statistics',

  //===========
  network: '/network',
  network_ethernet: '/network/ethernet',
  network_wifi: '/network/wifi',
  network_ftp: '/network/ftp',
  network_rtsp: '/network/rtsp',
  network_rtmp: '/network/rtmp',

  test: '/test',
};

export const routeNames: Record<keyof typeof routeKeys, string> = {
  home: t('home'),
  login: t('login'),
  first_login: t('first_login'),
  live: t('live'),
  notFound: t('notfound'),

  security_question: t('security_question'),
  forgot_password: t('forgot_password'),
  reset_password: t('reset_password'),
  playback: t('playback'),

  system: t('system'),
  system_operation: t('operation'),
  system_device_info: t('device_info'),
  system_setting: t('setting'),
  system_users: t('user_management'),
  system_access_management: t('access_management'),
  ///===========
  video: t('video_flow'),
  video_encrypt: t('encrypt'),
  display_setting: t('display_setting'),
  video_photo: t('image'),

  //===========
  record: t('record'),
  record_encrypt: t('encrypt'),
  record_photo: t('record_photo'),

  //===========

  event: t('event'),
  event_setting: t('setting'),
  event_warning: t('warning'),
  event_sending: t('event_sending'),

  //===========
  device: t('device'),
  device_audio: t('audio'),
  device_storage: t('storage'),

  //===========
  ai: t('ai'),
  ai_setting: t('setting'),
  ai_traffic_setting: t('setting_traffic'),
  ai_recognition: t('recognition'),
  ai_statistics: t('statistics'),

  //===========
  network: t('network'),
  network_ethernet: t('ethernet'),
  network_wifi: t('wifi'),
  network_ftp: t('ftp'),
  network_rtsp: t('rtsp'),
  network_rtmp: t('rtmp'),
  live_primary: t('primary_flow'),
  live_secondary: t('secondary_flow'),
  test: 'test',
};

export const dynamicRouteKeys = {};
