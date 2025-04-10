import { Flex, styled } from '@packages/ds-core';
import { useMemo, useState } from 'react';
import { DecreaseColored, IncreaseColored } from '@packages/ds-icons';
import { debounce } from 'lodash';

export interface SliderProps {
  value?: number;
  max?: number;
  defaultValue?: number;
  className?: string;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export const IrisConfig = ({
  value,
  defaultValue,
  className,
  onChange,
  disabled,
}: SliderProps) => {
  const irisList = [
    3.1707,
    3.1764, 
    3.1889, 
    3.2052, 
    3.2248, 
    3.2485, 
    3.2753, 
    3.3048, 
    3.3372, 
    3.3731, 
    3.4129, 
    3.4567, 
    3.5029, 
    3.5544, 
    3.6094, 
    3.6705, 
    3.7337, 
    3.8006, 
    3.8725, 
    3.9488, 
    4.0299, 
    4.1163, 
    4.2102, 
    4.3087, 
    4.414, 
    4.5258, 
    4.6447, 
    4.77, 
    4.9012, 
    5.04, 
    5.1897, 
    5.3473, 
    5.5133, 
    5.69, 
    5.8805, 
    6.0803, 
    6.2964, 
    6.5308, 
    6.7787, 
    7.0436, 
    7.3331, 
    7.6506, 
    7.9903, 
    8.3617, 
    8.7654, 
    9.2057, 
    9.7077, 
    10.2399, 
    10.8466, 
    11.5227, 
    12.3051, 
    13.2016, 
    14.207, 
    15.3659, 
    16.7012, 
    18.3265, 
    20.3906, 
    22.7293, 
    25.7798, 
    30.0138, 
    35.6405, 
    43.16, 
    55.6728, 
    83.6309, 
    167.9973, 
    10000
  ];

  const defaultIndex = irisList.findIndex((item) => item === (value || defaultValue)) || 0;
  const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);
  const handleIncrease = () => {
    if (currentIndex < irisList.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      debouncedSave(irisList[newIndex]);
    }
  };

  const handleDecrease = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      debouncedSave(irisList[newIndex]);
    }
  };

  const debouncedSave = useMemo(() => 
    debounce((newValue: number) => {
      onChange?.(newValue);
    }, 500),
    [onChange]
  );

  return (
    <Flex align="center" gapX="s10" className={className} style={{ marginLeft: '30px' }}>
      <IconButton onClick={handleDecrease} disabled={disabled || currentIndex <= 0}>
        <DecreaseColored size={20} />
      </IconButton>
      <Input
        type="text"
        value={`f/${irisList[currentIndex]}`}
        disabled={disabled}
      />
      <IconButton onClick={handleIncrease} disabled={disabled || currentIndex >= irisList.length - 1}>
        <IncreaseColored size={20} />
      </IconButton>
    </Flex>
  );
};

const IconButton = styled.button`
  display: inline-block;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Input = styled.input`
  width: 100px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 0px 6px 10px;
  pointer-events: none;

  &:disabled {
    background: #f5f5f5;
  }
`;

IrisConfig.displayName = 'InputWithButtons';