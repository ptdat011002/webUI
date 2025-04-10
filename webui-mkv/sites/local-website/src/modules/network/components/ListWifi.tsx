import React from 'react';
import { IWifiItem } from '../hooks';
import { Box, Flex, styled } from '@packages/ds-core';
import { WifiLineItem } from './WifiLineItem';

export interface ListWifiProps {
  items: IWifiItem[];
  divider?: boolean;
  onDetail?: (wifi: IWifiItem) => void;
  onConnect?: (wifi: IWifiItem) => void;
}

export const ListWifi: React.FC<ListWifiProps> = ({
  items,
  divider = true,
  onDetail,
  onConnect,
}) => {
  return (
    <Wrapper divider={divider}>
      <Flex direction="column" gapY="s8">
        {items.map((item, index) => (
          <WifiLineItem
            wifi={item}
            key={item.rssi || index}
            onDetail={onDetail}
            onConnect={onConnect}
          />
        ))}
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled(Box)<{
  divider?: boolean;
}>`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${({ divider, theme }) =>
    divider ? `1px solid ${theme.colors.textPrimary} ` : 'none'};
`;
