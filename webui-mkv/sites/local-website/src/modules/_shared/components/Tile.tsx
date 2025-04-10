import React from 'react';
import { styled } from '@packages/ds-core';

export interface TileProps {
  className?: string;
  title: string;
}

export const Tile: React.FC<TileProps> = ({ className, title }) => {
  return <StyledTile className={className}>{title}</StyledTile>;
};

const StyledTile = styled.div`
  align-items: center;
  display: flex;
  column-gap: 1rem;
  ::before {
    content: '';
    background-color: currentColor;
    width: 6px !important;
    height: 6px !important;
    display: inline-block;
  }
`;
