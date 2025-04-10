export const CAM_IP = window.location.hostname;
export const CAM_API_PORT = window.location.port;
export const CAM_LIVE_PORT = import.meta.env.DEV ? CAM_API_PORT : 1234;
export const CAM_LIVE_URL = `https://${CAM_IP}:${CAM_LIVE_PORT}`;
export const LIVE_STREAM_URL = `${CAM_LIVE_URL}/video.mp4`;
export const LIVE_PORT_NAME = "MP4_Live";
export const SETTING_STREAM_URL = `${CAM_LIVE_URL}/video.mp4?stream_type=sub`;
export const DOWNLOAD_URL = `https://${CAM_IP}/download.ipc?file=`;
