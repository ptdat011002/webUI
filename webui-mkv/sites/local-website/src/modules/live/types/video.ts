export type IVideoFlow = 'primary' | 'secondary';

export enum ScreenType {
  normal = 'normal',
  extend = 'extend',
}

export type VideoHandle = {
  // live video
  play: (videoURL: string) => void;
  pause: () => void;

  // recorded video
  preloadRecord: (videoURL: string) => void;
  playRecord: () => void;
  pauseRecord: () => void;

  // actions
  setVolume: (value: number) => void;
  setScale: (scale: number) => void;
  setRate: (rate: number) => void;
  setScreenType: (screenType: ScreenType) => void;
  capture: () => undefined | HTMLCanvasElement;
  playFromTime: (url: string, time: number) => void;
};

export const OPEN_VIDEO_SRC_FAILED =
  'DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed';
