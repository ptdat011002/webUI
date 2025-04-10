import { styled } from '@packages/ds-core';
import React from 'react';

export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ ...props }) => {
  return <StyleLogo src="/logo.svg" {...props} />;
};

const StyleLogo = styled.img<LogoProps>`
  object-fit: cover;
  max-width: 100%;
`;
