import React from 'react';
import { Box, styled } from '@packages/ds-core';
import {
  PlaybackContainer,
  PlaybackSearchContainer,
} from '../../modules/playback/containers';
import { CopyRight } from '../../modules/_shared';
import { IRecordSearch } from '../../modules/playback/types';
import { Col, Row } from 'antd';

const PlaybackPage: React.FC = () => {
  const [records, setRecords] = React.useState<IRecordSearch[]>();

  return (
    <Wrapper>
      <Row gutter={[24, 24]}>
        <Col span={24} xxl={6} xl={7} md={8}>
          <PlaybackSearchContainer onData={setRecords} />
        </Col>
        <Col span={24} xxl={18} xl={17} md={16}>
          <PlaybackContainerWrapper>
            <PlaybackContainer records={records} />
          </PlaybackContainerWrapper>
        </Col>
      </Row>
      <CopyRight />
    </Wrapper>
  );
};

export default PlaybackPage;

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 1.25rem 0.5rem 1.875rem;

  @media screen and (max-width: 1024px) {
    padding: 0.5rem;
  }
`;

const PlaybackContainerWrapper = styled(Box)`
  width: 100%;
  background-color: #333333;
  border-radius: 12px;
  padding: 1rem 2rem;
`;
