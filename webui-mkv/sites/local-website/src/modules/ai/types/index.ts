import { IAIFaceDetectSetting, IAIFaceRecognitionSetting } from './setting';

export interface IFaceConfig {
  face_id?: number;
  name: string;
  age?: number;
  image?: string;
  sex?: number;
}

export interface IAddFacePlayLoad {
  count: number;
  faceInfo: IFaceConfig[];
}

export interface IRemoveFacePlayLoad {
  count: number;
  faceInfo?: number[];
}

export interface ISearchFacePayload {
  start_time?: string;
  end_time?: string;
  name?: string;
  person_id?: string;
  face_id?: number;
}

export interface ISearchByNameOrId {
  keyword: string;
}

export type IFaceSearchResponse = {
  count: number;
  faceInfo: IFaceConfig[];
};

export interface IAiFaceConfig {
  FD?: IAIFaceDetectSetting;
  FR?: IAIFaceRecognitionSetting;
}
