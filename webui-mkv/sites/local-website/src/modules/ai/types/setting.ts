export interface IAISetting {
  warning?: boolean;
  face_size?: number;
  distance_from_person_to_device?: number;
}

export interface IAiFaceConfig {
  FD?: IAIFaceDetectSetting;
  FR?: IAIFaceRecognitionSetting;
}

export interface IAIFaceDetectSetting {
  enable?: boolean;

  face_size?: number;

  /**
   * default 0.8
   */
  threshold?: number;

  record_enable?: boolean;

  snapshot_enable?: boolean;

  alarm_enable?: boolean;
}

export interface IAIFaceRecognitionSetting {
  enable?: boolean;

  image_path?: string;

  db_path?: string;

  /** default 0.45 */
  threshold?: number;

  /** default 0.25 */
  fas_threshold?: number;

  /** default 60 */
  minW?: number;

  /** default 1920 */
  maxW?: number;

  record_enable?: boolean;
  skew: number;
}

export interface IPIDSetting {
  zones?: Array<every>;
  enable?: boolean;
  threshold?: number;
}

export interface ILCDSetting {
  enable?: boolean;
  threshold?: number;
  lines?: Array<every>;
  directions?: Array<every>;
}

export interface IPeopleCountingSetting {
  enable?: boolean;
  threshold?: number;
  zones?: Array<every>;
}

export interface ICrowdDetectionSetting {
  enable?: boolean;
  threshold?: number;
  detection_number?: number;
}

export interface IMotionDetectionSetting {
  enable?: boolean;
  zone_info?: Array<every>;
  sensitivity?: number;
}

export interface ILicensePlateRecognitionSetting {
  enable?: boolean;
  license_plate_threshold?: number;
  min_pixel?: number;
  max_pixel?: number;
  zones?: Array<every>;
}

export interface IRedLightViolationSetting {
  enable?: boolean;
  redLightDelayTime?: number;
  lines?: Array<every>;
  signalLight?: Array<every>;
}

export interface ILaneEncroachmentSetting {
  enable?: boolean;
  linePairs?: Array<every>;
  order?: number;
  directions?: string;
}

export interface IWrongWaySetting {
  enable?: boolean;
  zones?: Array<every>;
  order?: number;
  directions?: string;
}

export interface IParkingDetectionSetting {
  enable?: boolean;
  zones?: Array<every>;
  time?: number;
  order?: number;
}

export interface IEmergencyLaneIntrusionSetting {
  enable?: boolean;
  zone_info?: Array<every>;
  order?: number;
}