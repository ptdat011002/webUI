import { t } from '../../../configs/i18next.ts';

export class DateTime {
  static getWeekOptions() {
    return [
      { label: t('Monday'), value: 'Mon' },
      { label: t('Tuesday'), value: 'Tue' },
      { label: t('Wednesday'), value: 'Wed' },
      { label: t('Thursday'), value: 'Thu' },
      { label: t('Friday'), value: 'Fri' },
      { label: t('Saturday'), value: 'Sat' },
      { label: t('Sunday'), value: 'Sun' },
    ];
  }

  static getMonthOptions() {
    return Array.from({ length: 31 }, (_, i) => ({
      label: String(i + 1),
      value: i + 1,
    }));
  }

  static getModeOptions() {
    return [
      {
        label: t('EveryDay'),
        value: 'daily',
      },
      {
        label: t('EveryWeek'),
        value: 'weekly',
      },
      {
        label: t('EveryMonth'),
        value: 'monthly',
      },
    ];
  }

  static formatTime(time: number) {
    return time.toString().padStart(2, '0');
  }
}

export const getDateTime = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = DateTime.formatTime(date.getMonth() + 1);
  const day = DateTime.formatTime(date.getDate());
  const hours = DateTime.formatTime(date.getHours());
  const minutes = DateTime.formatTime(date.getMinutes());
  const seconds = DateTime.formatTime(date.getSeconds());

  return `${year}_${month}_${day} at ${hours}_${minutes}_${seconds}`;
};
