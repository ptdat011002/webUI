import MockAdapter from 'axios-mock-adapter';

export interface IBase {
  createdAt?: string;
}

export interface IApiResponse<T> {
  data: T;
  result?: string;
}

export interface IRequestBody<T> {
  data: T;
  version?: string;
}

export interface IApiError {
  version?: string;
  error_code?: string;
  ch_error_code?: Array<Record<string, string>>;
  data?: every;
  headers?: Record<string, every>;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type IMockFun = (adapter: MockAdapter) => void;

export interface ISchedule {
  schedule_type:
    | 'Record'
    | 'Ai'
    | 'Face'
    | 'Crowd'
    | 'Capture'
    | 'Storage'
    | 'HttpUpgrade';
  schedule_enable: boolean;
  schedule_time?: IScheduleTime;
}

export interface IScheduleTime {
  mode?: 'period' | 'daily' | 'weekly' | 'monthly';
  period_time?: number;
  list_day: IListDay[];
}

export interface IListDay {
  wday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  mday: number;
  list_time: IListTime[];
}

export interface IListTime {
  start_time: string;
  end_time: string;
}
