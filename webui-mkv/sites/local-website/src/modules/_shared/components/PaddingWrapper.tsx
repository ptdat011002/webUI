import { styled } from '@packages/ds-core';

const paddingSizeMap = {
  normal: '1.25rem 1.5rem 0.5rem 1.5rem',
  form: '0.875rem 2.875rem 0 2.875rem',
  formTab: '0.875rem 1.5rem 0 1.5rem',
};

export const PaddingWrapper = styled.div<{
  type?: 'normal' | 'form' | 'formTab';
}>`
  padding: ${({ type = 'normal' }) => paddingSizeMap[type || 'normal']};
  width: 100%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    padding: ${({ theme }) => theme.spaces.s8};
  }

  @media screen and (max-width: 400px) {
    padding: ${({ theme }) => theme.spaces.s4};
  }
`;
