import React, { useMemo } from 'react';

export interface ITimesProps {
  className?: string;
  timeSpace: number;
}

const defaultHours = [
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
];

const generateTimes = (interval: number) => {
  const times: string[] = [];
  for (let i = 0; i < 24 * 60; i += interval) {
    const hours = String(Math.floor(i / 60)).padStart(2, '0');
    const minutes = String(i % 60).padStart(2, '0');
    times.push(`${hours}:${minutes}`);
  }
  return times;
};

export const Times: React.FC<ITimesProps> = ({ className, timeSpace }) => {
  const times = useMemo(() => {
    const timeMap = {
      120: defaultHours,
      60: generateTimes(60),
      30: generateTimes(30),
      15: generateTimes(15),
      10: generateTimes(10),
      5: generateTimes(5),
    };

    return timeMap[timeSpace] || defaultHours;
  }, [timeSpace]);

  return (
    <div className={className}>
      {times.map((time: string, index: number) => (
        <div
          key={time}
          className="time-label"
          style={{ left: `${(index * 100) / times.length}%` }}
        >
          {time}
        </div>
      ))}
    </div>
  );
};
