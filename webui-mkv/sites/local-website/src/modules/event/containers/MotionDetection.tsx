import React, { useCallback, useState } from 'react';
import { Col, Row } from 'antd';
import { EventSettingForm, fullRegion, SelectedRegion } from '../components';
import { Spinner, styled } from '@packages/ds-core';
import { useMotionDetection } from '../hooks';
import { IMotionDetectionConfig } from '../types';

export interface MotionDetectionProps {
  className?: string;
}

export const MotionDetection: React.FC<MotionDetectionProps> = () => {
  const { data, isFetching, isUpdating, setMotionDetection } =
    useMotionDetection();

  const [activatedRegionArray, setActivatedRegionArray] = useState<
    Array<Array<number>>
  >(fullRegion());

  const handleFinish = useCallback(async (values: IMotionDetectionConfig) => {
    await setMotionDetection({
      ...values,
      enable: true,
    });
  }, []);

  if (isFetching) return <Spinner />;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        width: '100%',
      }}
    >
      <Col span={24} lg={12}>
        <ContentWrapper>
          <EventSettingForm
            data={data}
            handleFinish={handleFinish}
            isUpdating={isUpdating}
          />
        </ContentWrapper>
      </Col>
      <Col span={24} lg={12}>
        <ContentWrapper>
          <SelectedRegion
            activatedRegionArray={activatedRegionArray}
            setActivatedRegionArray={setActivatedRegionArray}
          />
        </ContentWrapper>
      </Col>
    </Row>
  );
};

const ContentWrapper = styled.div`
  max-width: 640px;
`;
