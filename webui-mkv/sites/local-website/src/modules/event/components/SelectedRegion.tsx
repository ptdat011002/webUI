import React from 'react';
import { Flex, styled } from '@packages/ds-core';
import { Button, Col, Row } from 'antd';
import { t } from 'configs/i18next.ts';

export const fullRegion = () => {
  const result: Array<Array<number>> = [];

  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      result.push([rowIndex, colIndex]);
    }
  }

  return result;
};

export interface SelectedRegionProps {
  className?: string;
  activatedRegionArray: Array<Array<number>>;
  setActivatedRegionArray: (value: Array<Array<number>>) => void;
}

export const SelectedRegion: React.FC<SelectedRegionProps> = ({
  activatedRegionArray,
  setActivatedRegionArray,
}) => {
  return (
    <Flex direction={'column'} align={'center'} gapY={'s24'}>
      <VideoFrameContainer>
        {Array(3)
          .fill(0)
          .map((_, rowIndex) => (
            <Row
              key={rowIndex}
              gutter={1}
              style={{
                marginBottom: rowIndex === 2 ? 0 : 1,
              }}
            >
              {Array(5)
                .fill(0)
                .map((_, colIndex) => {
                  const isActivated = activatedRegionArray.some((region) => {
                    const [regionRowIndex, regionColIndex] = region;
                    return (
                      regionRowIndex === rowIndex && regionColIndex === colIndex
                    );
                  });

                  return (
                    <Col
                      key={colIndex}
                      flex={1}
                      style={{
                        aspectRatio: '1/1',
                      }}
                    >
                      <VideoFrameItem
                        onClick={() => {
                          if (!isActivated) {
                            setActivatedRegionArray([
                              ...activatedRegionArray,
                              [rowIndex, colIndex],
                            ]);
                          } else {
                            setActivatedRegionArray(
                              activatedRegionArray.filter(
                                (region) =>
                                  region[0] !== rowIndex ||
                                  region[1] !== colIndex,
                              ),
                            );
                          }
                        }}
                        isActivated={isActivated}
                      />
                    </Col>
                  );
                })}
            </Row>
          ))}
      </VideoFrameContainer>
      <Flex justify={'center'} gapX={'s32'}>
        <Button
          type="primary"
          ghost
          onClick={() => setActivatedRegionArray([])}
        >
          {t('delete')}
        </Button>
        <Button
          type="primary"
          onClick={() => setActivatedRegionArray(fullRegion())}
        >
          {t('chooseAll')}
        </Button>
      </Flex>
    </Flex>
  );
};

const VideoFrameContainer = styled.div`
  max-width: 640px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.red};
  border: 1px solid ${({ theme }) => theme.colors.red};
  border-radius: ${({ theme }) => theme.radius.r4};
  overflow: hidden;
`;

const VideoFrameItem = styled.div<{
  isActivated: boolean;
}>`
  width: 100%;
  height: 100%;
  background-color: ${({ isActivated, theme }) =>
    isActivated ? theme.colors.primary : theme.colors.dark};
`;
