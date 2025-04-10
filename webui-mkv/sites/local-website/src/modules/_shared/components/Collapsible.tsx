import { Box, styled } from '@packages/ds-core';
import { ChevronRightOutlined } from '@packages/ds-icons';
import React, { ReactNode, useImperativeHandle } from 'react';
import { LineButton } from './LineButton';

export interface CollapsibleProps {
  defaultCollapsed?: boolean;
  title?: ReactNode;
  children?: ReactNode;
}

export interface CollapsibleRef {
  toggle: () => void;
}

export const Collapsible = React.forwardRef<CollapsibleRef, CollapsibleProps>(
  (props, pref) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(
      props.defaultCollapsed ?? true,
    );

    const toggle = () => {
      setCollapsed((prev) => !prev);
    };
    useImperativeHandle(pref, () => ({
      toggle: toggle,
    }));

    return (
      <Wrapper collapsed={collapsed}>
        <LineButton
          className="collapsible-header"
          onClick={toggle}
          label={props.title}
          suffixIcon={<ChevronRightOutlined className="suffix-icon" />}
        />

        <Box className="collapsible-content">
          <Box>{props.children}</Box>
        </Box>
      </Wrapper>
    );
  },
);

const Wrapper = styled(Box)<{
  collapsed: boolean;
}>`
  .collapsible-content {
    max-height: ${(props) => (props.collapsed ? '0' : '999px')};
    transition: max-height 0.25s ease-in-out;
    overflow: hidden;
  }
  .suffix-icon {
    transform: rotate(${(props) => (props.collapsed ? '0' : '90deg')});
    transition: transform 0.25s linear;
    font-size: 12px;

    cursor: pointer;
  }
`;

Collapsible.displayName = 'Collapsible';
