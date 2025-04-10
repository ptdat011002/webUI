import { IRoute } from './types';
import { Navigate } from 'react-router';
import { routeKeys, routeNames } from 'configs/constants';
import { menuIconSize } from 'configs/theme';
import {
  AiOutlined,
  CalendarCheckOutlined,
  CameraOutlined,
  ClockPlayOutlined,
  DevicesOutlined,
  PlayOutlined,
  SettingsOutlined,
  VideoPlusOutlined,
  WorldOutlined,
} from '@packages/ds-icons';
import { LiveVideoContainer } from '../../modules/live/containers';

const defaultRoute = routeKeys.live;

export const settingsRoutes: IRoute[] = [
  {
    path: routeKeys.system,
    label: routeNames.system,
    icon: <SettingsOutlined size={menuIconSize} />,
    permission: ['system_config'],
    children: [
      {
        index: true,
        hiddenOnMenu: true,
        element: <Navigate to={routeKeys.system_device_info} />,
      },
      {
        path: routeKeys.system_device_info,
        label: routeNames.system_device_info,
        lazy: () =>
          import('pages/settings/system/DeviceInfoPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.system_users,
        label: routeNames.system_users,
        lazy: () =>
          import('pages/settings/system/UserManagementPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.system_setting,
        label: routeNames.system_setting,
        lazy: () =>
          import('pages/settings/system/SystemSettingPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.system_operation,
        label: routeNames.system_operation,
        lazy: () =>
          import('pages/settings/system/OperationPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.system_access_management,
        label: routeNames.system_access_management,
        lazy: () =>
          import('pages/settings/system/AccessManagementPage').then((m) => ({
            Component: m.default,
          })),
      },
    ], //#endregion
  },
  {
    path: routeKeys.video,
    //#region record routes
    icon: <PlayOutlined size={menuIconSize} />,
    label: routeNames.video,
    permission: ['stream_config'],
    children: [
      {
        index: true,
        hiddenOnMenu: true,
        element: <Navigate to={routeKeys.display_setting} />,
      },
      {
        path: routeKeys.display_setting,
        label: routeNames.display_setting,
        lazy: () =>
          import('pages/settings/video/LiveSettingPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.video_photo,
        label: routeNames.video_photo,
        lazy: () =>
          import('pages/settings/video/PhotoPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.video_encrypt,
        label: routeNames.video_encrypt,
        lazy: () =>
          import('pages/settings/video/VideoEncryptPage').then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
  {
    path: routeKeys.record,
    //#region record routes
    icon: <VideoPlusOutlined size={menuIconSize} />,
    label: routeNames.record,
    permission: ['record_enable'],

    children: [
      {
        index: true,
        label: routeNames.record,
        path: routeKeys.record,
        lazy: () =>
          import('pages/settings/record/RecordPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.record_photo,
        label: routeNames.record_photo,
        lazy: () =>
          import('pages/settings/record/RecordPhotoPage').then((m) => ({
            Component: m.default,
          })),
      },
    ],
    //#endregion
  },
  {
    path: routeKeys.event,
    icon: <CalendarCheckOutlined size={menuIconSize} />,
    label: routeNames.event,
    permission: ['event_enable'],

    //#region event routes
    children: [
      {
        index: true,
        hiddenOnMenu: true,
        element: <Navigate to={routeKeys.event_warning} />,
      },
      // {
      //   path: routeKeys.event_setting,
      //   label: routeNames.event_setting,
      //   lazy: () =>
      //     import('pages/settings/event/EventSettingPage').then((m) => ({
      //       Component: m.default,
      //     })),
      // },
      {
        path: routeKeys.event_warning,
        label: routeNames.event_warning,
        lazy: () =>
          import('pages/settings/event/EventWarningPage.tsx').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.event_sending,
        label: routeNames.event_sending,
        lazy: () =>
          import('pages/settings/event/EventSendingPage.tsx').then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
  {
    path: routeKeys.ai,
    icon: <AiOutlined size={menuIconSize} />,
    label: routeNames.ai,
    permission: ['ai_enable'],
    //#region ai routes
    children: [
      {
        index: true,
        hiddenOnMenu: true,
        element: <Navigate to={routeKeys.ai_setting} />,
      },
      {
        path: routeKeys.ai_setting,
        label: routeNames.ai_setting,
        lazy: () =>
          import('pages/settings/ai/AISettingPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.ai_traffic_setting,
        label: routeNames.ai_traffic_setting,
        lazy: () =>
          import('pages/settings/ai/AITrafficSettingPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.ai_recognition,
        label: routeNames.ai_recognition,
        lazy: () =>
          import('pages/settings/ai/AIRecognitionPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.ai_statistics,
        label: routeNames.ai_statistics,
        lazy: () =>
          import('pages/settings/ai/AiStatisticsPage').then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
  {
    path: routeKeys.network,
    icon: <WorldOutlined size={menuIconSize} />,
    label: routeNames.network, //#region network routes
    permission: ['network_config'],
    children: [
      {
        index: true,
        hiddenOnMenu: true,
        element: <Navigate to={routeKeys.network_ethernet} />,
      },
      {
        path: routeKeys.network_ethernet,
        label: routeNames.network_ethernet,
        lazy: () =>
          import('pages/settings/network/EthernetPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.network_wifi,
        label: routeNames.network_wifi,
        lazy: () =>
          import('pages/settings/network/WifiPage').then((m) => ({
            Component: m.default,
          })),
      },
      // Todo: bỏ vì không còn hỗ trợ
      // {
      //   path: routeKeys.network_ftp,
      //   label: routeNames.network_ftp,
      //   lazy: () =>
      //     import('pages/settings/network/FTPClientPage').then((m) => ({
      //       Component: m.default,
      //     })),
      // },
      {
        path: routeKeys.network_rtsp,
        label: routeNames.network_rtsp,
        lazy: () =>
          import('pages/settings/network/RTSPClientPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.network_rtmp,
        label: routeNames.network_rtmp,
        lazy: () =>
          import('pages/settings/network/RTMPClientPage').then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
  {
    path: routeKeys.device,
    icon: <DevicesOutlined size={menuIconSize} />,
    label: routeNames.device, //#region device routes
    permission: ['device_config'],
    children: [
      {
        index: true,
        hiddenOnMenu: true,
        element: <Navigate to={routeKeys.device_audio} />,
      },
      {
        path: routeKeys.device_audio,
        label: routeNames.device_audio,
        lazy: () =>
          import('pages/settings/device/AudioPage').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: routeKeys.device_storage,
        label: routeNames.device_storage,
        lazy: () =>
          import('pages/settings/device/StoragePage').then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
  {
    path: routeKeys.test,
    icon: <DevicesOutlined size={menuIconSize} />,
    label: routeNames.test, //#region device routes
    hiddenOnMenu: true,
    lazy: () =>
      import('pages/Test').then((m) => ({
        Component: m.TestPage,
      })),
  },
];

export const liveRoutes: IRoute = {
  path: routeKeys.live,
  icon: <CameraOutlined size={menuIconSize} />,
  label: routeNames.live.toUpperCase(),
  permission: ['live_enable'],
  lazy: () =>
    import('pages/lives/LivePage').then((m) => ({
      Component: m.default,
    })),

  children: [
    {
      index: true,
      element: <Navigate to={routeKeys.live_primary} />,
      hiddenOnMenu: true,
    },
    {
      path: routeKeys.live_primary,
      element: <LiveVideoContainer key="secondary" />,
      label: routeNames.live_primary,
    },
    {
      path: routeKeys.live_secondary,
      element: <LiveVideoContainer key="secondary" />,
      label: routeNames.live_secondary,
    },
  ],
};

export const playbackRoutes: IRoute = {
  path: routeKeys.playback,
  icon: <ClockPlayOutlined size={menuIconSize} />,
  label: routeNames.playback.toUpperCase(),
  lazy: () =>
    import('pages/playback/PlaybackPage').then((m) => ({
      Component: m.default,
    })),
};

const workspacesRoutes: IRoute[] = [
  ...settingsRoutes,
  liveRoutes,
  playbackRoutes,
  {
    index: true,
    element: <Navigate to={defaultRoute} replace />,
  },
];

const privateRoutes: IRoute = {
  path: '/',
  lazy: () =>
    import('modules/auth/providers/ProtectedRouterProvider').then((module) => ({
      Component: module.ProtectedRouterProvider,
    })),
  children: [
    {
      path: '/',
      lazy: () =>
        import('modules/workspace/Workspace').then((module) => ({
          Component: module.default,
        })),
      children: workspacesRoutes,
    },
  ],
};

const publicRoutes: IRoute[] = [
  {
    path: routeKeys.login,
    lazy: () =>
      import('pages/LoginPage').then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: routeKeys.first_login,
    lazy: () =>
      import('pages/FirstLoginPage').then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: routeKeys.security_question,
    lazy: () =>
      import('pages/SecuriryQuestionPage').then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: routeKeys.forgot_password,
    lazy: () =>
      import('pages/ForgotPasswordPage').then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: routeKeys.reset_password,
    lazy: () =>
      import('pages/ResetPasswordPage').then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: routeKeys.notFound,
    lazy: () =>
      import('pages/NotFound').then((module) => ({
        Component: module.NotFoundPage,
      })),
  },
];

export const allRoutes: IRoute[] = [
  ...publicRoutes,
  privateRoutes,
  {
    path: '*',
    element: <Navigate to={routeKeys.home} />,
  },
];
