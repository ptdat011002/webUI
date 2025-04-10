import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export interface SpinnerProps {
  size?: number;
}

export const Spinner = styled.span<SpinnerProps>`
  margin: auto;
  display: inline-flex;
  align-items: center;
  &:before {
    content: '';
    box-sizing: border-box;
    display: inline-block;
    width: ${(props) => props.size || 24}px;
    height: ${(props) => props.size || 24}px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colors.primary};
    border-top-color: #333;
    animation: ${rotate} 1s linear infinite;
  }
`;
