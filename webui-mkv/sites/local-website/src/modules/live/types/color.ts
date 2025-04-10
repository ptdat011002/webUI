import { AntiFlickerMode } from './image.ts';

export enum ColorMode {
  WB_AUTOMATIC = 0,
  WB_INCANDESCENT /*for 2800K */,
  WB_D4000 /*for D4000 */,
  WB_D5000 /*for D5000 */,
  WB_SUNNY /*for 6500K */,
  WB_CLOUDY /*for 7500K */,
  WB_FLASH /*for FLASH */,
  WB_FLUORESCENT,
  WB_FLUORESCENT_H,
  /*for Higher than FLUORESCENT */
  WB_UNDERWATER,
  WB_CUSTOM,
  WB_OUTDOOR,
}

export const colorModeArray = [
  ColorMode.WB_AUTOMATIC,
  ColorMode.WB_INCANDESCENT,
  ColorMode.WB_D4000,
  ColorMode.WB_D5000,
  ColorMode.WB_SUNNY,
  ColorMode.WB_CLOUDY,
  ColorMode.WB_FLASH,
  ColorMode.WB_FLUORESCENT,
  ColorMode.WB_FLUORESCENT_H,
  ColorMode.WB_CUSTOM,
  ColorMode.WB_UNDERWATER,
  ColorMode.WB_OUTDOOR,
];

export interface IColorProperties {
  colorMode: ColorMode;
  // Đen trắng
  black_white: number;
  // Độ sánng
  brightness: number;
  // Độ bão hoà
  saturation: number;
  // Sắc thái
  hue: number;
  // Độ tương phản
  contrast: number;
  // Độ sắc nét
  sharpness: number;
  // Giảm nhiễu (MCTF)
  noiseReduction: number;
  // Màu đỏ
  red: number;
  // Màu xanh da trời
  cyan: number;
  slowShutterMode: boolean;
  antiFlickerMode: AntiFlickerMode;
}
