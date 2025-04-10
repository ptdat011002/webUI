import { TimeFormat } from '../types/stats.ts';
import dayjs from 'dayjs';

export interface IRangeDate {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

// return md5 hash checksum of file from File object
export const getRangeFromDateAndType = (
  date: string,
  timeType: TimeFormat,
): IRangeDate => {
  const startDate = dayjs(date).startOf('day');
  let endDate = startDate;
  switch (timeType) {
    case TimeFormat.day:
      endDate = startDate.add(1, 'day').subtract(1, 'second');
      break;
    case TimeFormat.week:
      endDate = startDate.add(7, 'day').subtract(1, 'second');
      break;
    case TimeFormat.month:
      endDate = startDate.add(1, 'month').subtract(1, 'second');
      break;
    case TimeFormat.quarter:
      endDate = startDate.add(3, 'month').subtract(1, 'second');
      break;
    case TimeFormat.year:
      endDate = startDate.add(1, 'year').subtract(1, 'second');
      break;
  }

  return {
    // from the start of the day
    startDate: startDate,
    // to the end of the day
    endDate: endDate,
  };
};
