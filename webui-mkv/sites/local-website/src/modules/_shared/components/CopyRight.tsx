import { Box, Flex, styled } from '@packages/ds-core';
import { t } from 'configs/i18next';
import React from 'react';

export interface CopyRightProps {
  className?: string;
}
export const CopyRight: React.FC<CopyRightProps> = ({ className }) => {
  return (
    <Box padding={['s12', 's8']} className={className}>
      <Flex justify="center" block>
        <StyledCopyRight>{t('copyRight')}</StyledCopyRight>
      </Flex>
    </Box>
  );
};

const StyledCopyRight = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.s}px;
  text-align: center;
`;
