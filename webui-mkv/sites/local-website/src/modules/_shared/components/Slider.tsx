import { Flex, styled, useTheme } from '@packages/ds-core';
import React, { useEffect } from 'react';
import { ConfigProvider, Slider as AntdSlider } from 'antd';
import { DecreaseColored, IncreaseColored } from '@packages/ds-icons';

export interface SliderProps {
  showLabel?: boolean;
  tooltip?: boolean;
  value?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  className?: string;
  onChange?: (value: number) => void;
  control?: boolean;
  renderLabel?: (value: number) => React.ReactNode;
  animatable?: boolean;
  disabled?: boolean;
  maxSlider?: number;
  minSlider?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value = 0,
      className,
      tooltip,
      max,
      min,
      control,
      renderLabel,
      animatable = false,
      maxSlider = max,
      minSlider = min,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();

    const increase = () => {
      if (value >= (max ?? 100) || value >= (maxSlider ?? 100)) {
        return;
      }
      props.onChange?.(value + 1);
    };

    const decrease = () => {
      if (value <= (min ?? 0) || value <= (minSlider ?? 0)) {
        return;
      }
      props.onChange?.(value - 1);
    };

    const onChangeValue = (value: number) => {
      const maxVal = Math.min(max ?? 100, maxSlider ?? max ?? 100);
      const minVal = Math.max(min ?? 0, minSlider ?? min ?? 0);
      if (value > maxVal) {
        value = maxVal;
      }
      if (value < minVal) {
        value = minVal;
      }

      props.onChange?.(value);
    };

    useEffect(() => {
      console.log('init');
    }, []);

    return (
      <Flex block align="center" gapX="s10" className={className}>
        {control && (
          <IconButton onClick={decrease}>
            <DecreaseColored size={20} />
          </IconButton>
        )}

        <ConfigProvider
          theme={{
            token: {},
            components: {
              Slider: {
                trackHoverBg: 'transparent',
                railSize: 10,
                //   handleColor: theme.colors.light,
                handleSize: 18,
                colorBgElevated: theme.colors.primary,
                handleSizeHover: 18,
              },
              Tooltip: {
                colorBgSpotlight: 'transparent',
                controlHeight: 20,
                padding: 4,
                boxShadowSecondary: 'none',
              },
            },
          }}
        >
          {/*<div*/}
          {/*  on={() => console.log('focusDiv')}*/}
          {/*  style={{ width: '100%' }}*/}
          {/*>*/}
          <InputSlider
            animatable={animatable}
            disabled={props.disabled}
            tooltip={{
              open: tooltip,
              arrow: false,
              formatter: (value) =>
                renderLabel ? renderLabel(value ?? 0) : value,
            }}
            marks={{}}
            max={max}
            min={min}
            value={value}
            onChange={onChangeValue}
            ref={ref}
          />
          {/*</div>*/}
        </ConfigProvider>

        {control && (
          <IconButton onClick={increase}>
            <IncreaseColored size={20} />
          </IconButton>
        )}
        {renderLabel && <Label>{renderLabel(value)}</Label>}
      </Flex>
    );
  },
);

const IconButton = styled.div`
  display: inline-block;
  margin-top: 4px;
  cursor: pointer;
`;

const Label = styled.div`
  display: inline-flex;
  min-width: fit-content;
  line-height: 12px;
  width: 3.5rem;
  justify-content: center;
`;

const InputSlider = styled(AntdSlider)<{ animatable: boolean }>`
  width: 100%;

  .ant-slider-rail {
    background: linear-gradient(90deg, #d9d9d9 0%, #2c2c2c 55.5%, #1a1a1a 100%);
    border-radius: 5px;
  }

  .ant-slider-track {
    background-color: transparent;
  }

  .ant-slider-handle {
    ::after {
      content: '';
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.light} !important;
    }

    &:focus::after {
    }

    &:hover::after {
    }
  }

  .ant-slider-track {
    &:not(:focus-within) {
      transition: width 1s !important;
    }
  }

  .ant-slider-handle {
    &:not(:focus-within) {
      transition: left 1s !important;
    }
  }
`;

Slider.displayName = 'Slider';
