import React, { useRef } from 'react';
import { styled } from '@packages/ds-core';
import { VideoTimeSheet } from '../../live/components';
import { IRecordSearch } from '../types';
import {
  RecordedVideoContainer,
  RecordedVideoHandle,
} from '../../live/containers';

export interface PlaybackContainerProps {
  className?: string;
  records?: IRecordSearch[];
}

export const PlaybackContainer: React.FC<PlaybackContainerProps> = ({
  records = [],
}) => {
  const recordedVideoRef = useRef<RecordedVideoHandle>(null);

  return (
    <Wrapper>
      <RecordedVideoContainer ref={recordedVideoRef} records={records} />
      <VideoTimeSheet
        records={records}
        onTimeClick={recordedVideoRef.current?.playFromTime}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 50rem;
  display: grid;
  grid-template-rows: 1fr 10rem;
`;
