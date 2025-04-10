import { styled } from '@packages/ds-core';

export const StyledModal = styled.div`
  display: inline-block;
  border-radius: 22px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.light};
  position: relative;
  max-width: 100%;
  .close-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 2;
    cursor: pointer;
  }
`;
