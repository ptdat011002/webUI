import { Flex, styled } from '@packages/ds-core';
import React from 'react';

export interface VerticalRangeInputProps {
  className?: string;
  value?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const VerticalRangeInput: React.FC<VerticalRangeInputProps> = ({
  className,
  value,
  onChange,
  min,
  max,
  step,
}) => {
  return (
    <Wrapper className={className}>
      <Flex direction={'column'} align={'center'}>
        <RangeInput
          type="range"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        <ValueSpan>{value}</ValueSpan>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  transform: rotate(-90deg);
`;

const RangeInput = styled.input`
  &[type='range'] {
    appearance: none;
    width: 86px;
    height: 4px;
    background: #454545;
    cursor: pointer;
    border-radius: 4px;

    ::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1b937d;
      box-shadow: 0 0 0 2px #ffffff;
    }
  }
`;

const ValueSpan = styled.span`
  margin-top: 8px;
  transform: rotate(90deg);
`;
