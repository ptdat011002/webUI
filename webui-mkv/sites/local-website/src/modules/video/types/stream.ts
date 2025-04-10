export interface IStream {
  resolution: string;
  fps: number;
  encode_type: 'H264' | 'H265' | 'MJPEG';
  encode_level: 'Baseline' | 'MainProfile' | 'HighProfile';
  bitrate_control: 'CBR' | 'VBR';
  bitrate: number;
  i_frame_interval: number;
  audio_enable?: boolean;
}
