import { Box, styled } from '@packages/ds-core';
import React from 'react';

export interface PreviewStreamContainerProps {
  className?: string;
}

const PreviewStreamContainer: React.FC<PreviewStreamContainerProps> = () => {
  return (
    <Wrapper>
      <Box></Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  aspect-ratio: 16/9;
`;

export default PreviewStreamContainer;
