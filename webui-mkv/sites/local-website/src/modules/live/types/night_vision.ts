export interface INightVisionConfig {
  nightvision_mode: 'AUTO' | 'ON' | 'OFF' | 'MANUAL';
  day_night_mode?: 'ON' | 'OFF';
  ir_cut_mode?: 'ON' | 'OFF';
  ir_led?: IIrLedConfig;
}

export interface IIrLedConfig {
  mode: 'SmartIR' | 'MANUAL';
  high_value?: number;
  low_value?: number;
}
