import { styled } from '@packages/ds-core';

export const SecondaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 0.25rem 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
  border: none;
  :hover {
    background-color: ${({ theme }) => theme.colors.primaryA100};
  }

  @media screen and (max-width: 768px) {
    padding: 0.25rem 0.5rem;
  }
`;
