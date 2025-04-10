import { Flex, Text, styled } from '@packages/ds-core';
import { ChevronRightOutlined } from '@packages/ds-icons';
import React, { ReactNode } from 'react';

export interface LineButtonProps {
  suffixIcon?: React.ReactNode;
  label: ReactNode;
  className?: string;
  onClick?: () => void;
  iconSize?: number;
  divider?: boolean;
}

export const LineButton: React.FC<LineButtonProps> = ({
  className,
  onClick,
  label,
  suffixIcon = <ChevronRightOutlined size={12} />,
  divider = true,
}) => {
  return (
    <Wrapper
      onClick={onClick}
      gapX="s8"
      justify="space-between"
      className={className}
      divider={divider}
    >
      {label}
      <Text className="icon-button">{suffixIcon}</Text>
    </Wrapper>
  );
};

const Wrapper = styled(Flex)<{
  divider: boolean;
}>`
  cursor: pointer;
  border-bottom: 1px solid
    ${({ theme, divider }) => (divider ? theme.colors.textPrimary : 'none')};
  padding: 0.375rem 0;
  .icon-button {
    color: ${({ theme }) => theme.colors.gray};
    padding: 2px;

    :hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
