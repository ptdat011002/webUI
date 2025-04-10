import React from 'react';
import { UpdateFwOfflineContainer } from './UpdateFWOfflineContainer';
import { Box, Flex, styled } from '@packages/ds-core';
import { UpdateFwOnlineContainer } from './UpdateFWOnlineContainer.tsx';

export interface OperatorUpdateContainerProps {
  className?: string;
}

const OperatorUpdateContainer: React.FC<OperatorUpdateContainerProps> = () => {
  return (
    <Wrapper>
      <Flex direction="column" gapY="s20">
        <UpdateFwOnlineContainer />
        <Box marginTop={'s8'} />
        <UpdateFwOfflineContainer />
      </Flex>
    </Wrapper>
  );
};
export default OperatorUpdateContainer;

const Wrapper = styled.div`
  flex: 1;
`;
