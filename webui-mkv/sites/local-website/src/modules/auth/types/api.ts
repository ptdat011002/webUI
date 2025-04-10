/**
 * Login with password API
 */

export interface ISecurityQuestionPayload {
  ID1: string;
  Question1: string;
  Answer1: string;
  ID2: string;
  Question2: string;
  Answer2: string;
  ID3: string;
  Question3: string;
  Answer3: string;
}

export interface ILoginWithPasswordPayload {
  username: string;
  password: string;
}

export interface ISetPasswordPayload {
  password: string;
  confirmPassword: string;
}

// POST: /API/Login/Range
export interface ILoginInformation {
  device_type: 'IPC';
  cur_lang: 'VIE' | 'ENG';
  default_lang: 'VIE' | 'ENG';
  first_login_flag: boolean;
  http_api_version?: string;
}

//POST: API/FirstLogin/SetPassword
export interface ISetPasswordPayload {
  password: string;
}

//POST: API/Web/Login
export type ILoginPayload = every;
export interface ILoggedInfo extends ILoginHeaders {
  fail_login_count: number;
  pwd_remain_time: number;
  last_login_time: string;
  last_login_ip: string;
  user_name: string;
}

export type ILoginResponse = ILoggedInfo;

export interface ILoginHeaders {
  'X-csrfToken'?: string;
}

export interface ILoginError {
  block_remain_time: number;
}

// POST /API/Web/Logout

export interface IHeartbeatPayload {
  keep_alive: boolean;
}

// POST: API/Login/DeviceInfo/Get
export interface IDeviceInfo {
  video_encode_type: Array<string>;
  manualfacturer: string;
}

export type IGetDeviceInfoResponse = IDeviceInfo;

export interface IKey {
  type: string;
  key: string;
  seq: number;
}

export type IGetPublicKey = {
  Key_lists: Array<IKey>;
};

export interface IDigestsAccessAuthentication {
  realm: string;
  nonce: string;
  qop: string;
  opaque: string;
  cnonce?: string;
  nc?: string;
}

export interface IQuestionInfo {
  id: number;
  question: string;
}
export interface IListQuestionS {
  list_question_1: IQuestionInfo[];
  list_question_2: IQuestionInfo[];
  list_question_3: IQuestionInfo[];
}

export type IListQuestionResponse = {
  public_key: string;
  questions: IListQuestionS;
  question_used?: number[];
};
