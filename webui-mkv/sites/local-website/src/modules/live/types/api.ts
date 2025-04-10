import { ColorMode } from './color.ts';
import { AntiFlickerMode, PTZCommand, SlowShutterMode } from './image.ts';
import { IWarningData } from './warning.ts';
import { IOSDConfig } from './osd.ts';
import { INightVisionConfig } from './night_vision.ts';
import { IImageControlConfig } from './image_control.ts';

// color_type int
// black_white int
// brightness -255 – 255 int
// saturation 0 – 255 int
// hue -15 – 15 int
// contrast 0 – 128 int
// sharpening 0 – 11 int
// mctf_str_level 0 – 11 int
// wb_ratio Json object Table 5-6
// slow_shutter_mode int
// anti_flicker_mode int
export interface IImageColorResponse {
  wb_mode: ColorMode;
  brightness: number;
  saturation: number;
  hue: number;
  contrast: number;
  sharpening: number;
  mctf_str_lvl: number;
  // wb_ratio?: IWhiteBalanceRatio;
  wb_ratio: [number, number];
  color_type?: number;
  black_white?: number;
  slow_shutter_mode?: SlowShutterMode;
  anti_flicker_mode?: AntiFlickerMode;
}

export interface IImageColorRequest {
  wb_mode?: ColorMode;
  brightness?: number;
  saturation?: number;
  hue?: number;
  contrast?: number;
  sharpening?: number;
  black_white?: number;
  mctf_str_lvl?: number;
  wb_ratio?: [number, number];
  slow_shutter_mode?: SlowShutterMode;
  anti_flicker_mode?: AntiFlickerMode;
}

export interface IWhiteBalanceRatio {
  wb_r_ratio: number;
  wb_b_ratio: number;
}

// pan_step int (reserved)
// pan_max int for Get only reserved)
// tilt_step int reserved)
// tilt_max int for Get only reserved)
// zoom_step int
// zoom_max int for Get only
// focus_step int
// focus_max int for Get only
export interface IPTZConfig {
  ptz_cmd?: PTZCommand;
  // pan_step?: number;
  // pan_max?: number;
  // tilt_step?: number;
  // tilt_max?: number;
  zoom_step?: number;
  zoom_cur_pos?: number;
  zoom_max?: number;
  focus_step?: number;
  focus_cur_pos?: number;
  focus_max?: number;
  iris_value?: number;
}

export interface IPTZInProgress {
  // 0 - progress completed
  // 1 - in progress
  ptz_in_progress: 0 | 1;
}

export type IWarningResponse = IWarningData;

export type IOSDConfigResponse = IOSDConfig;

export type IOSDConfigRequest = {
  img_data?: string;
} & IOSDConfig;

export type INightVisionConfigResponse = INightVisionConfig;

export type INightVisionConfigRequest = INightVisionConfig;

export type IImageControlConfigResponse = IImageControlConfig;

export type IImageControlConfigRequest = IImageControlConfig;
