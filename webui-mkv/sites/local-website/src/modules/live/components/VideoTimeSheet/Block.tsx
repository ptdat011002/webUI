import React from 'react';
import { IRecordSearch, RecordType } from '../../../playback/types';
import { mapRecordTypeToUI } from './index.tsx';

export interface IBlockProps {
  className?: string;
  records: IRecordSearch[];
  defaultWidthForLines: number;
}

export const Blocks: React.FC<IBlockProps> = ({
  className,
  records,
  defaultWidthForLines,
}) => {
  const defaultWidthForTimeSheet = defaultWidthForLines * 60;

  return (
    <div className={className}>
      {records
        .map((record) => {
          if (record.record_type === RecordType.NormalRecord) return null;

          const date = new Date(record.start_time * 1000);

          const fromHourMinutesSeconds =
            date.getHours() * 60 * 60 +
            date.getMinutes() * 60 +
            date.getSeconds();

          const left = `${
            (fromHourMinutesSeconds * 100) / defaultWidthForTimeSheet
          }%`;

          const width = `${(record.duration * 100) / 86400}%`;

          const { color } = mapRecordTypeToUI(record.record_type);

          return (
            <div
              key={`${fromHourMinutesSeconds}`}
              className="block"
              style={{ left, width, backgroundColor: color }}
            />
          );
        })
        .filter((block) => block !== null)}
    </div>
  );
};
