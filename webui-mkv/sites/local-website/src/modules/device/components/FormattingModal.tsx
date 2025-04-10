import React, { useEffect, useState } from 'react';
import { Box, Flex, styled, Text } from '@packages/ds-core';
import { Progress } from 'antd';
import { t } from 'i18next';
import { ScreenCenter } from 'modules/_shared';

export interface FormattingModalProps {
  className?: string;
  close?: () => void;
}

export const FormattingModal: React.FC<FormattingModalProps> = ({
  close,
  className,
}) => {
  const [percent, setPercent] = useState(0);

  // write code to count from 0 -> 100 in 120 seconds
  // then call onDone
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          close?.();
          return 100;
        }
        return prev + 1;
      });
    }, import.meta.env.VITE_UPDATE_FW_INTERVAL * 10);
    return () => clearInterval(interval);
  }, [close]);

  return (
    <Wrapper className={className}>
      <ScreenCenter>
        <Flex direction="column" align="center">
          <Progress
            percent={percent}
            size={['100%', 24]}
            type="line"
            showInfo={false}
          />
          <Box marginTop="s32">
            <Text fontSize="h5" fontWeight="400">
              {t(
                'Memory is formatting, this process may take a few minutes. Please wait.',
              )}
            </Text>
          </Box>
        </Flex>
      </ScreenCenter>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 2rem;
  box-sizing: border-box;
`;
