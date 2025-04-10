import { Flex, styled, Text } from '@packages/ds-core';
import React, { ReactNode } from 'react';
import { FailColored, SuccessColored } from '@packages/ds-icons';
import { t } from 'i18next';

export type NotiType = 'success' | 'error';

const icons: Record<NotiType, ReactNode> = {
  success: <SuccessColored size={30} />,
  error: <FailColored size={30} />,
};

const texts: Record<NotiType, string> = {
  success: t('hasNewUpdate'),
  error: t('noNewUpdate'),
};

export interface OnlineFWFindingAlertProps {
  className?: string;
  type: NotiType;
}

export const OnlineFwFindingAlert: React.FC<OnlineFWFindingAlertProps> = ({
  className,
  type,
}) => {
  return (
    <Wrapper className={className}>
      <Flex gapX="s16">
        {icons[type]}
        <Text>{texts[type]}</Text>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
