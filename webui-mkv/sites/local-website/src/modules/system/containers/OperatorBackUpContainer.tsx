import { Box, styled } from '@packages/ds-core';
import React from 'react';

import { ExportConfigContainer } from './ExportConfigContainer.tsx';
import { ImportConfigContainer } from './ImportConfigContainer.tsx';

export interface OperatorBackUpContainerProps {
  className?: string;
}

export const OperatorBackUpContainer: React.FC<
  OperatorBackUpContainerProps
> = ({ className }) => {
  return (
    <Wrapper className={className}>
      <ImportConfigContainer />
      <ExportConfigContainer />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: block;
  width: 100%;
  margin: 32px;
`;
export default OperatorBackUpContainer;
