import { Box, Flex, styled, Text } from '@packages/ds-core';
import { t } from 'i18next';
import { useMedia } from 'modules/_shared/providers';
import React, { useMemo, useRef } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { Button } from 'antd';

export interface RecordScheduleContainerProps {
  className?: string;
  type: 'Capture' | 'Record';
}

type WDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

const wDays: WDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const RecordScheduleContainer: React.FC<RecordScheduleContainerProps> = ({
  type,
}) => {
  const { mode } = useMedia();

  const {
    isScheduled,
    addSchedule,
    removeSchedule,
    actionLoading,
    updateConfig,
  } = useSchedule(type);

  const sizeDot = useMemo(() => {
    switch (mode) {
      case '4k':
      case '2k':
      case 'hd':
        return 50;
      case 'laptop':
      case 'tablet':
        return 28;
      case 'mobile':
        return 24;
      default:
        return 50;
    }
  }, [mode]);

  return (
    <Wrapper>
      <Flex>
        {mode != 'mobile' && <Side />}
        <Flex
          gapX={mode === 'mobile' ? 's24' : 's48'}
          // justify="space-between"
          block
        >
          <Text fontWeight="600" whiteSpace="nowrap">
            {t('note')}:
          </Text>
          <Flex direction="row" gap="s16">
            <Flex gapX="s16" block>
              <Dot size={mode == 'mobile' ? 18 : 24} isActive />
              <Text>{t('scheduled')}</Text>
            </Flex>
            <Flex gapX="s16" block>
              <Dot size={mode == 'mobile' ? 18 : 24} />
              <Text whiteSpace="nowrap">{t('deScheduled')}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <ScheduleBoxWrapper>
        <Flex>
          <Side>
            <Flex direction="column">
              {wDays.map((wDay: WDay) => {
                return (
                  <Box key={wDay} padding="s2">
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        height: sizeDot,
                      }}
                    >
                      <Text whiteSpace="nowrap">
                        {mode == 'mobile' ? t(`ws.${wDay}`) : t(`w.${wDay}`)}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </Side>
          <ScheduleBox
            dotSize={sizeDot}
            isScheduled={isScheduled}
            addSchedule={addSchedule}
            removeSchedule={removeSchedule}
          />
        </Flex>
      </ScheduleBoxWrapper>

      <Box marginTop="s24">
        <Flex>
          <Button type="primary" loading={actionLoading} onClick={updateConfig}>
            {t('save')}
          </Button>
        </Flex>
      </Box>
    </Wrapper>
  );
};

const Side = styled(Box)`
  text-align: center;
  width: 110px;

  @media (max-width: 768px) {
    width: 44px;
    padding-right: 12px;
  }
`;

const ScheduleBox: React.FC<{
  dotSize: number;
  isScheduled: (wDay: WDay, hour: number) => boolean;
  addSchedule: (wDay: WDay, hour: number) => void;
  removeSchedule: (wDay: WDay, hour: number) => void;
}> = ({ dotSize, isScheduled, addSchedule, removeSchedule }) => {
  const dragging = useRef<Array<[WDay, number]> | undefined>(undefined);

  const [moves, setMoves] = React.useState<Array<[WDay, number]>>([]);
  const [mode, setMode] = React.useState<'add' | 'remove' | undefined>();

  const calculateAndAddSchedule = (wDay: WDay, hour: number) => {
    if (!!dragging.current) {
      const [startWDay, startHour] = dragging.current[0];
      const endWDay = wDay;
      const endHour = hour;

      const start = wDays.indexOf(startWDay) * 24 + startHour;
      const end = wDays.indexOf(endWDay) * 24 + endHour;

      const newMoves: Array<[WDay, number]> = [];

      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
        const wDay = wDays[Math.floor(i / 24)];
        const hour = i % 24;
        newMoves.push([wDay, hour]);
      }

      setMoves(() => newMoves);
    }
  };

  const handleDragEnd = () => {
    if (dragging.current) {
      if (mode === 'add') {
        moves.forEach(([wDay, hour]) => {
          addSchedule(wDay, hour);
        });
      }
      if (mode === 'remove') {
        moves.forEach(([wDay, hour]) => {
          removeSchedule(wDay, hour);
        });
      }
    }
    dragging.current = undefined;
    setMoves([]);
    setMode(undefined);
  };

  const isActivated = (wDay: WDay, hour: number) => {
    const inMove = !!moves.find(([w, h]) => w === wDay && h === hour);
    if (mode === 'remove' && inMove) {
      return false;
    }

    return (
      isScheduled(wDay, hour) ||
      !!moves.find(([w, h]) => w === wDay && h === hour)
    );
  };

  return (
    <WrapperScheduleBox>
      <HourRuler className="ruler">
        {Array(25)
          .fill(0)
          .map((_, index) => {
            return (
              <Box
                key={index}
                padding="s2"
                style={{
                  position: 'relative',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <Box
                  style={{
                    width: dotSize,
                  }}
                >
                  {index % 2 == 0 ? index : ''}
                </Box>
              </Box>
            );
          })}
      </HourRuler>

      {wDays.map((wDay: WDay) => {
        return (
          <Flex key={wDay}>
            {Array(24)
              .fill(0)
              .map((_, index) => {
                return (
                  <Box key={index} padding="s2">
                    <Dot
                      key={index}
                      size={dotSize}
                      isActive={isActivated(wDay, index)}
                      onMouseDown={(e) => {
                        dragging.current = [[wDay, index]];
                        // set mode
                        if (isScheduled(wDay, index)) {
                          setMode('remove');
                        } else {
                          setMode('add');
                        }
                        calculateAndAddSchedule(wDay, index);
                        e.preventDefault();
                      }}
                      onMouseUp={() => {
                        handleDragEnd();
                      }}
                      onMouseMove={(e) => {
                        if (!dragging.current) return;
                        calculateAndAddSchedule(wDay, index);
                        e.preventDefault();
                      }}
                    />
                  </Box>
                );
              })}
          </Flex>
        );
      })}
    </WrapperScheduleBox>
  );
};

const WrapperScheduleBox = styled(Box)`
  position: relative;
  /* overflow-x: hidden; */
`;

const HourRuler = styled(Flex)`
  position: absolute;
  top: -40px;
`;

const Dot = styled(Box)<{ isActive?: boolean; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  aspect-ratio: 1/1;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.light};
  cursor: pointer;
`;

const ScheduleBoxWrapper = styled(Box)`
  padding-top: 60px;
  max-width: 100%;
  /* padding-right: 14px; */
  overflow: auto;
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 8px;

  /* overflow-x: auto; */
`;

const Wrapper = styled(Box)`
  max-width: 100%;
  overflow: hidden;
  width: 100%;
`;

export default RecordScheduleContainer;
