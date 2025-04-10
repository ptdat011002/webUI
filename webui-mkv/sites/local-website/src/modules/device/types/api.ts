import { ISchedule } from '../../_shared';
import { AudioEncodeType } from './device-audio.ts';

export interface ISystemDeviceInfo {
  device_id?: string;
  device_type?: string;
  device_model?: string;
  fw_version?: string;
  hardware_version?: string;
  mac_address?: string;
  wireless_address?: string;
  software_version?: string;
}

export type IStorageScheduleRequest = {
  schedules: ISchedule[];
};

export type IStorageScheduleResponse = {
  schedules: ISchedule[];
};

export type IStorageFormatRequest = {
  device_type: 'Internal' | 'SDCard';
  serial?: string;
};

export interface IAudioConfig {
  audio_enable?: boolean;
  audio_codec: AudioEncodeType;
  sample_rate: 8000 | 16000 | 32000 | 44100 | 48000;
  out_volume?: number;
  in_volume?: number;
  bitrate?: number;
}
