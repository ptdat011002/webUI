import { Flex, styled, Text } from '@packages/ds-core';
import React, {
  HtmlHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DecreaseColored, IncreaseColored } from '@packages/ds-icons';
import ReactDOM from 'react-dom';

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
}

export interface SliderRef {
  animateTo: (value: number) => void;
}

export const AnimateSlider = React.forwardRef<SliderRef, SliderProps>(
  (
    {
      value = 0,
      className,
      max,
      min,
      control,
      renderLabel,
      showLabel,
      disabled,
      ...props
    },
    ref,
  ) => {
    const controlRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const valueRef = useRef<HTMLSpanElement>(null);
    const currentValue = useRef<number>(0);

    useImperativeHandle(ref, () => {
      return {
        animateTo: (value: number) => {
          // animate to value
          if (!wrapperRef.current || !controlRef.current) return;
          const percent = calculatePercent(value);
          const { width } = wrapperRef.current.getBoundingClientRect();
          const offsetLeft = (percent / 100) * width;
          controlRef.current.style.left = `${offsetLeft}px`;
          currentValue.current = value;
          // add animate class
          controlRef.current.classList.add('animate');

          console.log('animate to', value);

          setTimeout(() => {
            if (controlRef.current)
              controlRef.current.classList.remove('animate');
            props.onChange?.(value);
          }, 500);
        },
      };
    });

    useLayoutEffect(() => {
      if (
        value !== currentValue.current &&
        wrapperRef.current &&
        controlRef.current
      ) {
        const percent = calculatePercent(value);
        const { width } = wrapperRef.current.getBoundingClientRect();

        currentValue.current = value;

        if (width === 0) {
          controlRef.current.style.left = `${percent}%`;

          return;
        }
        const offsetLeft = (percent / 100) * width;
        controlRef.current.style.left = `${offsetLeft}px`;
      }
    }, [value]);

    const increase = () => {
      if (value >= (max ?? 100)) {
        return;
      }
      props.onChange?.(value + 1);
    };

    const decrease = () => {
      if (value <= (min ?? 0)) {
        return;
      }
      props.onChange?.(value - 1);
    };

    const calculateValue = (percent: number) => {
      const newValue = Math.round((percent / 100) * (max ?? 100));

      return Math.max(min ?? 0, Math.min(max ?? 100, newValue));
    };

    const calculatePercent = (value: number) => {
      const newPercent = (value / (max ?? 100)) * 100;

      return Math.max(0, Math.min(100, newPercent));
    };

    const clickToSlider = (e) => {
      if (!wrapperRef.current || !controlRef.current) return;
      const { width, left } = wrapperRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const offsetLeft = Math.max(0, Math.min(width, x));
      controlRef.current.style.left = `${offsetLeft}px`;
      const newValue = calculateValue((offsetLeft / width) * 100);
      currentValue.current = newValue;
      props.onChange?.(newValue);
    };

    useEffect(() => {
      // drag and drop

      controlRef.current?.addEventListener('mousedown', (e) => {
        isDragging.current = true;
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging.current || !wrapperRef.current || !controlRef.current) {
          return;
        }
        const { width, left } = wrapperRef.current.getBoundingClientRect();

        // drag control
        const x = e.x - left;
        const offsetLeft = Math.max(0, Math.min(width, x));
        controlRef.current.style.left = `${offsetLeft}px`;
        const newValue = calculateValue((offsetLeft / width) * 100);
        currentValue.current = newValue;
        if (valueRef.current)
          valueRef.current.textContent = newValue.toString();
      });

      window.addEventListener('mouseup', () => {
        // calculate value
        if (!wrapperRef.current || !controlRef.current || !isDragging.current) {
          return;
        }

        const { width } = wrapperRef.current.getBoundingClientRect();

        const x = controlRef.current.offsetLeft;

        const newValue = Math.round((x / width) * (max ?? 100));
        currentValue.current = newValue;

        props.onChange?.(newValue);
        isDragging.current = false;
      });
    }, [controlRef]);

    return (
      <React.Fragment>
        <Flex
          block
          align="center"
          gapX="s10"
          className={className}
          style={{
            position: 'relative',
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        >
          {control && (
            <IconButton onClick={decrease}>
              <DecreaseColored size={20} />
            </IconButton>
          )}
          {/*this slider can change the value on clicking the control*/}
          <SliderWrapper
            ref={wrapperRef}
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={clickToSlider}
          >
            <div className="slider-thumb" />
            <Tooltip title={<Text ref={valueRef}>{value}</Text>}>
              <div
                className="slider-control"
                ref={controlRef}
                style={{
                  pointerEvents: disabled ? 'none' : 'auto',
                }}
              />
            </Tooltip>
          </SliderWrapper>
          {control && (
            <IconButton onClick={increase}>
              <IncreaseColored size={20} />
            </IconButton>
          )}
          {showLabel && renderLabel && <Label>{renderLabel(value)}</Label>}{' '}
        </Flex>
      </React.Fragment>
    );
  },
);

const IconButton = styled.div`
  display: inline-block;
  margin-top: 4px;
  cursor: pointer;
`;

export interface ToolTipProps {
  children: React.ReactElement<HtmlHTMLAttributes<HTMLElement>>;
  title?: React.ReactNode;
}

export const Tooltip: React.FC<ToolTipProps> = ({ children, title }) => {
  const [, setShow] = useState(1);

  const wrapperRef = useRef<HTMLDivElement>();
  const innerRef = useRef<HTMLDivElement>();
  const isDragging = useRef(false);

  useLayoutEffect(() => {
    const element = document.createElement('div');
    element.className = 'slider-tooltip';
    wrapperRef.current = element;
    document.body.appendChild(element);
    setShow((t) => t + 1);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  const onMouseEnter = (e: React.MouseEvent) => {
    if (!innerRef.current) return;
    innerRef.current?.classList.add('show');
    const { x, y } = e.currentTarget.getBoundingClientRect();

    innerRef.current?.classList.add('show');

    const top = y - innerRef.current.clientHeight - 10;
    const left = x - innerRef.current.clientWidth / 2;

    innerRef.current.style.left = `${left}px`;
    innerRef.current.style.top = `${top}px`;
    isDragging.current = true;
  };

  return (
    <React.Fragment>
      {React.cloneElement(children, {
        onMouseEnter: onMouseEnter,
        onMouseMove: (e) => {
          onMouseEnter(e);
          children.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
          innerRef.current?.classList.remove('show');
          children.props.onMouseLeave?.(e);
        },
      })}
      {wrapperRef.current &&
        ReactDOM.createPortal(
          <InnerTooltip ref={innerRef as every}>{title}</InnerTooltip>,
          wrapperRef.current,
        )}
    </React.Fragment>
  );
};

Tooltip.displayName = 'ToolTip';

const InnerTooltip = styled.div`
  padding: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.light};
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  display: none;
  transform: translateX(25%);

  &.show {
    display: block;
  }

  ::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.primary};
  }

  /* transform: translateX(25%); */
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;

  .slider-thumb {
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, #d9d9d9 0%, #2c2c2c 55.5%, #1a1a1a 100%);
    border-radius: 5px;
    background: linear-gradient(90deg, #d9d9d9 0%, #2c2c2c 55.5%, #1a1a1a 100%);
    border-radius: 5px;
  }

  .slider-control {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    top: 0;
    left: 0;
    transform: translate(-25%, -25%);
    cursor: pointer;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.light} !important;

    &.animate {
      transition: left 0.5s linear;
    }

    ::after {
      content: '';
    }
  }
`;

AnimateSlider.displayName = 'AnimateSlider';

const Label = styled.div`
  display: inline-flex;
  min-width: fit-content;
  line-height: 12px;
  width: 3.5rem;
  justify-content: center;
`;
