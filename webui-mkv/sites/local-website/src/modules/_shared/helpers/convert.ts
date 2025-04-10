import dayjs from 'dayjs';

export const stringToBase64 = (key: string) => {
  return btoa(key);
};

export const getDateFromDateFormat = (date?: string, format?: string) => {
  if (!date || !format) {
    return '';
  }

  const dateArray = date.split('/');
  const formatArray = format.split('/');
  const dateObj = {
    day: dateArray[formatArray.indexOf('DD')],
    month: dateArray[formatArray.indexOf('MM')],
    year: dateArray[formatArray.indexOf('YYYY')],
  };
  const dateStr = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  return dateStr;
};

export const getDateWithFormat = (date?: dayjs.Dayjs, format?: string) => {
  if (!date || !format) {
    return '';
  }

  switch (format) {
    case 'DD/MM/YYYY':
      return date.format('DD/MM/YYYY');
    case 'MM/DD/YYYY':
      return date.format('MM/DD/YYYY');
    case 'YYYY-MM-DD':
      return date.format('YYYY-MM-DD');
    default:
      return date.format('DD/MM/YYYY');
  }
};
