import { styled } from '@packages/ds-core';

export interface ProgressProps {
  value?: number;
  max?: number;
}
export const Progress: React.FC<ProgressProps> = ({ value = 0, max = 100 }) => {
  return (
    <Wrapper>
      <progress max={max} value={value} />
    </Wrapper>
  );
};

const Wrapper = styled.label`
  height: 2.1rem;

  --color: linear-gradient(#fff8, #fff0),
    repeating-linear-gradient(-120deg, #0003 0 10px, #0000 0 20px),
    ${({ theme }) => theme.colors.primary};
  --background: transparent;

  progress[value] {
    height: 100%;

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    margin: 1px 10px;
    border-radius: 10em;
    background: var(--background);
  }

  progress[value]::-webkit-progress-bar {
    border-radius: 10em;
    background: var(--background);
    border: 1px solid ${({ theme }) => theme.colors.primary};
    padding: 2px;
  }

  progress[value]::-webkit-progress-value {
    border-radius: 9999px;
    background: var(--color);
    transition: width 0.5s;
    position: relative;
  }

  progress[value]::-moz-progress-bar {
    border-radius: 10em;
    background: var(--color);
  }
`;
