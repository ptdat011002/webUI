export interface IOSDConfig {
  enable: boolean;
  name: IOSDNameConfig;
  display_name: string;
  datetime: IOSDDateTimeConfig;
  logo: IOSDLogoConfig;
}

export interface IOSDNameConfig {
  show: boolean;
  position: IOSDPosition;
}

export type IOSDDateTimeConfig = IOSDNameConfig;

export type IOSDLogoConfig = IOSDNameConfig;

export interface IOSDPosition {
  x: number;
  y: number;
}
