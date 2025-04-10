import { styled } from '@packages/ds-core';

export const IconButton = styled.button`
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 2px;
  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  user-select: none;
  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
