import dayjs from 'dayjs';
import { RecordType } from './search.ts';

export interface IRecordForm {
  date_time: dayjs.Dayjs;
  record_type_normal: RecordType[];
  record_type_event: RecordType[];
}
