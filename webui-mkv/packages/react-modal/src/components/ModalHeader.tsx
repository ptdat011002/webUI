import { styled } from '@packages/ds-core';

export const ModalHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 0.75rem 0.5rem;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary600};
  text-align: center;
`;
