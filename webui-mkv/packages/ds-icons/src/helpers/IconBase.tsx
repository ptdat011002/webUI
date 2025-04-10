/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import styled from '@emotion/styled';
import { IconContext, DefaultContext } from './IconContext';
import { Color } from '@packages/ds-core/dist/theme/token';

export interface IconTree {
  tag: string;
  attr: { [key: string]: string };
  child?: IconTree[];
}

interface StyledSvgProps {
  color?: Color;
  theme?: {
    colors?: {
      [key: string]: string;
    };
  };
}

function Tree2Element(tree: IconTree[]): React.ReactElement<{}>[] {
  return (
    tree &&
    tree.map((node, i) =>
      React.createElement(
        node.tag,
        { key: i, ...node.attr },
        Tree2Element(node.child as IconTree[]),
      ),
    )
  );
}
export function GenIcon(
  data: IconTree,
): (props: IconBaseProps) => React.ReactElement<{}> {
  const IconWrapper = (props: IconBaseProps): React.ReactElement<{}> => (
    <IconBase attr={{ ...data.attr }} {...props}>
      {Tree2Element(data.child as IconTree[])}
    </IconBase>
  );
  return IconWrapper;
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  className?: string;
  strokeWidth?: number;
  color?: Color;
}

export type IconType = (props: IconBaseProps) => JSX.Element;
export function IconBase(props: IconBaseProps & { attr?: {} }): JSX.Element {
  const elem = (conf: IconContext): JSX.Element => {
    const computedSize = props.size || conf.size || '1em';
    let className: string = '';
    if (conf.className) className = conf.className;
    if (props.className) className = (className ?? '') + props.className;
    const { attr, color, ...svgProps } = props;
    return (
      <StyledSVG
        fill="currentColor"
        strokeWidth={
          props.strokeWidth
            ? typeof computedSize === 'number' && computedSize >= 24
              ? computedSize <= 40
                ? 1.5
                : 2
              : 1
            : undefined
        }
        {...conf.attr}
        {...attr}
        {...svgProps}
        className={className}
        style={{
          ...conf.style,
          ...props.style,
        }}
        color={color}
        height={computedSize}
        width={computedSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        {props.children}
      </StyledSVG>
    );
  };

  return IconContext !== undefined ? (
    <IconContext.Consumer>
      {(conf: IconContext): JSX.Element => elem(conf)}
    </IconContext.Consumer>
  ) : (
    elem(DefaultContext)
  );
}

export const SvgCss = ({ color, theme }: StyledSvgProps): string => `
  path[stroke],
  rect[stroke],
  line {
    stroke: ${color ? theme?.colors?.[color] || color : ''};
  }
  path:not([stroke]),
  rect:not([stroke]) {
    fill: ${color ? theme?.colors?.[color] || color : ''};
  }
`;

const StyledSVG = styled.svg`
  ${SvgCss};
`;
