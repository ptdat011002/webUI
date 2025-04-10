import React, { useMemo } from 'react';
import _ from 'lodash';
import { IRecordSearch } from '../../../playback/types';
import { Flex } from '@packages/ds-core';
import { mapRecordTypeToUI } from './index.tsx';

export interface ILabelsProps {
  className?: string;
  records: IRecordSearch[];
}

export const Labels: React.FC<ILabelsProps> = ({ className, records }) => {
  const recordTypes = useMemo(() => {
    return _.uniq(records.map((record) => record.record_type));
  }, [records]);

  return (
    <div className={className}>
      {recordTypes.map((type, index) => {
        const { label, color } = mapRecordTypeToUI(type);
        return (
          <Flex key={index} gapX={'s10'} align={'center'}>
            <div
              style={{ background: color, width: '2rem', height: '2rem' }}
            ></div>
            <span>{label}</span>
          </Flex>
        );
      })}
    </div>
  );
};
