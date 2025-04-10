import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Flex, styled } from '@packages/ds-core';
import { t } from 'configs/i18next.ts';
import { ZoomInOutlined, ZoomOutOutlined } from '@packages/ds-icons';
import { IRecordSearch, RecordType } from '../../../playback/types';
import { Blocks } from './Block.tsx';
import { Lines } from './Lines.tsx';
import { Times } from './Times.tsx';
import { Labels } from './Labels.tsx';

export const mapRecordTypeToUI = (recordType: RecordType) => {
  switch (recordType) {
    case RecordType.AI_FD:
      return {
        label: t('motion_detection'),
        color: '#FB8C00',
      };
    case RecordType.All:
      return {
        label: 'AI',
        color: '#7ED321',
      };
  }

  return {
    label: t('Normal'),
    color: '#1f1f1f',
  };
};

export interface VideoTimeLineProps {
  className?: string;
  records?: IRecordSearch[];
  onTimeClick?: (time: number) => void;
}

const timeSpaces = [120, 60, 30, 15, 10, 5];

const defaultWidthForLines = 24 * 60 * 3;

const widthMap = {
  120: 100,
  60: 200,
  30: 400,
  15: 800,
  10: 1600,
  5: 3200,
};

export const VideoTimeSheet: React.FC<VideoTimeLineProps> = ({
  records = [],
  onTimeClick,
}) => {
  const draggableWrapperRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const translateXRef = useRef(0);
  const startXRef = useRef(0);

  const [timeSpace, setTimeSpace] = useState<number>(timeSpaces[0]);
  const timeSheetPercentWidth = useMemo(() => {
    return widthMap[timeSpace] || 100;
  }, [timeSpace]);

  const handleZoomIn = (event: React.MouseEvent) => {
    const currentIndex = timeSpaces.indexOf(timeSpace);
    if (currentIndex < timeSpaces.length - 1) {
      setTimeSpace(timeSpaces[currentIndex + 1]);
    }

    event.stopPropagation();
  };

  const handleZoomOut = (event: React.MouseEvent) => {
    const currentIndex = timeSpaces.indexOf(timeSpace);
    if (currentIndex > 0) {
      setTimeSpace(timeSpaces[currentIndex - 1]);
    }

    event.stopPropagation();
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggableRef.current || !onTimeClick) return;

    const rect = draggableRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const ratio = clickX / rect.width;
    const timeInSeconds = ratio * 86400;

    const record = records.find(
      (r) =>
        r.start_time <= timeInSeconds &&
        timeInSeconds < r.start_time + r.duration,
    );

    if (record) {
      onTimeClick(timeInSeconds);
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startXRef.current = e.clientX - translateXRef.current;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newTranslateX = e.clientX - startXRef.current;

      if (!draggableWrapperRef.current || !draggableRef.current) return;
      const { left } = draggableWrapperRef.current.getBoundingClientRect();
      const { left: drapableLeft } =
        draggableRef.current.getBoundingClientRect();

      console.log({
        left,
        drapableLeft,
      });

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        translateXRef.current = newTranslateX;
        if (draggableRef.current) {
          draggableRef.current.style.transform = `translateX(${newTranslateX}px)`;
        }
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };

    const timeSheetElement = draggableWrapperRef.current;

    if (timeSheetElement) {
      timeSheetElement.addEventListener('mousedown', handleMouseDown);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (timeSheetElement) {
        timeSheetElement.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Flex direction={'column'} gapY={'s32'}>
      <Wrapper>
        <ButtonWrapper>
          <ZoomInOutlined className={'button'} onClick={handleZoomIn} />
          <ZoomOutOutlined className={'button'} onClick={handleZoomOut} />
        </ButtonWrapper>

        <DragWrapper ref={draggableWrapperRef}>
          <LinesWrapper
            ref={draggableRef}
            style={{
              width: `${timeSheetPercentWidth}%`,
            }}
            onClick={handleTimelineClick}
          >
            <Blocks
              defaultWidthForLines={defaultWidthForLines}
              records={records}
            />

            <Lines
              defaultWidthForLines={defaultWidthForLines}
              timeSpace={timeSpace}
            />

            <TimeLabelsWrapper>
              <Times timeSpace={timeSpace} />
            </TimeLabelsWrapper>
          </LinesWrapper>
        </DragWrapper>
      </Wrapper>
      <LabelWrapper>
        <Labels records={records} />
      </LabelWrapper>
    </Flex>
  );
};

const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundTimeSheet};
  position: relative;
  overflow: hidden;
`;

const LinesWrapper = styled.div`
  display: flex;
  position: relative;

  .line {
    position: absolute;
    width: 1px;
    background-color: ${({ theme }) => theme.colors.divider};
    bottom: 0;
    top: 0;
    margin: auto;
  }

  .line.long {
    height: 3rem;
  }

  .line.short {
    height: 2rem;
  }

  .block {
    height: 100%;
    position: absolute;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 1;

  .button {
    cursor: pointer;
    font-size: 28px;
  }
`;

const TimeLabelsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .time-label {
    position: absolute;
    color: ${({ theme }) => theme.colors.divider};
    bottom: 0;
  }
`;

const DragWrapper = styled.div<{
  width?: number;
}>`
  height: 100%;
  display: grid;
  grid-template-rows: 3fr;
  transition: transform 0.2s ease-out;
  width: ${({ width }) => width || 100}%;
`;

const LabelWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;
