export enum AudioEncodeType {
  G711A = 'G711A',
  G711U = 'G711U',
  PCM = 'PCM',
  G726 = 'G726',
  AAC = 'AAC',
}

export interface IDeviceAudioConfig {
  enable?: boolean;
  volume?: number;
  encode_type?: AudioEncodeType;
}
