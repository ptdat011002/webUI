// start_time M >= 0 int Search start date. the date
// format is Epoch timestamp
// end_time M >= 0 int Search end time. the time
// format is Epoch timestamp
// record_type M NormalRecord: 0x1,
// MotionRecord: 0x2,
// FDRecord, FRRecord,
// LCDRecord,
// int Video type: Normal,
// Motion, Face Detection,
// Face Recognition, Line
// Cross Detection, Perimeter
// Copyrights © Pavana Technologies
// Page | 76
// HTTP API
// PIDRecord, PCRecord,
// CDDRecord,
// All
// Intrusion Detection,
// People Counting, Crowd
// Density Detection

import { t } from 'i18next';

export interface IRecordSearchRequest {
  start_time?: string;
  end_time?: string;
  record_type?: number;
}

export interface IRecordSearchResponse {
  record: IRecordSearch[];
}

// AI_FR: 0x01 Face
// Recognize
// AI_FD: 0x02 Face
// Detection
// AI_MD: 0x04 Motion
// Detection
// AI_LCD: 0x08 Line
// Crossing Detection
// AI_PID: 0x10 Perimeter
// Instrucsion Detection.
// AI_PC: 0x20 Person
// Count
// AI_CDD 0x40 Crowd
// Density Detection.
// 4096: Normal Capture
// 0xFFFF: All Capture
export enum RecordType {
  AI_FR = 0x01,
  AI_FD = 0x02,
  AI_MD = 0x04,
  AI_LCD = 0x08,
  AI_PID = 0x10,
  AI_PC = 0x20,
  AI_CDD = 0x40,
  All = 0xffff,
  NormalRecord = 4096,
  // eslint-disable-next-line prettier/prettier
}

export const normalVideoRecordType = [RecordType.NormalRecord];
export const eventVideoRecordType = [
  RecordType.AI_FR,
  RecordType.AI_FD,
  RecordType.AI_MD,
  RecordType.AI_LCD,
  RecordType.AI_PID,
  RecordType.AI_PC,
  RecordType.AI_CDD,
];

export const mapRecordTypeToText = (recordType: RecordType): number => {
  return {
    [RecordType.NormalRecord]: t('normal_recording'),
    [RecordType.AI_FR]: t('face_recognition'),
    [RecordType.AI_FD]: t('face_detection'),
    [RecordType.AI_MD]: t('motion_detection'),
    [RecordType.AI_LCD]: t('line_cross_detection'),
    [RecordType.AI_PID]: t('perimeter_intrusion_detection'),
    [RecordType.AI_PC]: t('people_counting'),
    [RecordType.AI_CDD]: t('crowd_density_detection'),
  }[recordType];
};

// record_ty
// pe
// Requirement RANGE M Unknow: -1,
// NormalRecord:
// 0x1,
// MotionRecord:
// 0x2,
// FDRecord,
// FRRecord,
// LCDRecord,
// PIDRecord,
// PCRecord,
// CDDRecord
// int Video type: Normal, Motion, Face
// Detection, Face Recognition, Line Cross
// Detection, Perimeter Intrusion Detection,
// People Counting, Crowd Density
// Detection
// start_time M int Recorded file start time. The time format
// is Epoch timestamp
// duration M int File duration, in second
// size O int file size, unit byte
export interface IRecordSearch {
  record_type: RecordType;
  start_time: string; // Epoch timestamp
  duration: number; // in second
  size?: number; //
  file_name?: string;
}
