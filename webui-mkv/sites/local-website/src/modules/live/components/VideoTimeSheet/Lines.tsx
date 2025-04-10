import React, { useMemo } from 'react';

export interface ILinesProps {
  className?: string;
  defaultWidthForLines: number;
  timeSpace: number;
}

export const Lines: React.FC<ILinesProps> = ({
  className,
  defaultWidthForLines,
  timeSpace,
}) => {
  const lines = useMemo(() => {
    return Array.from(
      { length: defaultWidthForLines / timeSpace },
      (_, index) => index * timeSpace,
    );
  }, [timeSpace]);

  return (
    <div className={className}>
      {lines.map((hour, index) => {
        const left = `${(index * 100) / lines.length}%`;

        if (index % 2 === 0) {
          return (
            <div
              key={`${index}_${hour}`}
              className="line long"
              style={{ left: `${left}` }}
            />
          );
        }

        return (
          <div
            key={`${index}_${hour}`}
            className="line short"
            style={{ left: `${left}` }}
          />
        );
      })}
    </div>
  );
};
