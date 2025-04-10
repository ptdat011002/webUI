import React from 'react';
import { Flex, Text, styled, keyframes } from '@packages/ds-core';
import {
  LoadingFilled,
  WifiFilled,
  WifiL1Filled,
  WifiL2Filled,
} from '@packages/ds-icons';
import { IconButton } from 'modules/_shared';
import { SecurityFilled } from '@packages/ds-icons';
import { InfoCircleOutlined } from '@packages/ds-icons';
import { IWifiItem } from '../hooks';
import { IConnectStatus, IWifiSignalLevel } from '../types/wifi';
import { inActiveColor } from 'configs/theme';

export interface WifiLineItemProps {
  wifi: IWifiItem;
  onDetail?: (wifi: IWifiItem) => void;
  onConnect?: (wifi: IWifiItem) => void;
}

const IconWifi: Record<IWifiSignalLevel, React.ReactNode> = {
  1: <WifiL2Filled />,
  4: <WifiFilled />,
  2: <WifiL1Filled />,
  3: <WifiL2Filled />,
};

export const WifiLineItem: React.FC<WifiLineItemProps> = ({
  wifi,
  onDetail,
  onConnect,
}) => {
  return (
    <Wrapper status={wifi.status} justify="space-between" gapX="s12">
      <Flex
        gapX="s10"
        align="center"
        onClick={() => onConnect?.(wifi)}
        style={{
          cursor: 'pointer',
        }}
      >
        <Text className="wifi-icon">
          {wifi.status === 'connecting' ? (
            <LoadingFilled />
          ) : (
            IconWifi[wifi.signal || 1]
          )}
        </Text>

        <Text>{wifi.ssid}</Text>
      </Flex>
      <Flex gap="s4" align="center">
        <IconButton onClick={(e) => e.preventDefault()}>
          <SecurityFilled size={16} />
        </IconButton>
        <IconButton onClick={() => onDetail?.(wifi)}>
          <InfoCircleOutlined size={16} />
        </IconButton>
      </Flex>
    </Wrapper>
  );
};

// rotate for loading setting stroke
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(36deg);
  }
  20% {
    transform: rotate(72deg);
  }
  30% {
    transform: rotate(108deg);
  }
  40% {
    transform: rotate(144deg);
  }
  50% {
    transform: rotate(180deg);
  }
  60% {
    transform: rotate(216deg);
  }
  70% {
    transform: rotate(252deg);
  }
  80% {
    transform: rotate(288deg);
  }
  90% {
    transform: rotate(324deg);
  }
  100% {
    transform: rotate(360deg);
  }

 
`;

const Wrapper = styled(Flex)<{
  status?: IConnectStatus;
}>`
  cursor: pointer;
  .wifi-icon {
    min-width: 30px;
    height: 30px;
    background-color: ${({ theme, status }) => {
      if (status === 'connected') {
        return theme.colors.primary;
      }
      return inActiveColor;
    }};
    border-radius: ${({ theme }) => theme.radius.round};
    animation-name: ${({ status }) => (status === 'connecting' ? rotate : '')};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;

    color: ${({ theme, status }) => {
      if (status === 'connected') {
        return theme.colors.textPrimary;
      }
      return theme.colors.textSecondary;
    }};
  }
`;
