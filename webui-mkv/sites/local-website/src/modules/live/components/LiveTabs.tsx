import { Box, styled, Flex } from '@packages/ds-core';
import React, { ReactNode, Suspense, useMemo } from 'react';

export interface LiveTabsProps {
  items: ILiveTabItem[];
  activeKey?: every;
  onChangeActiveKey?: (key: string) => void;
  className?: string;
  flexTab?: boolean;
  tabSize?: 'm' | 'l';
  forceRender?: boolean;
  noTabPadding?: boolean;
}

export interface ILiveTabItem {
  label: ReactNode;
  key: every;
  component: ReactNode;
}

export const LiveTabs: React.FC<LiveTabsProps> = ({
  items,
  activeKey,
  onChangeActiveKey,
  className,
  flexTab = false,
  tabSize = 'm',
  noTabPadding = false,
}) => {
  const activeItem = useMemo(() => {
    return items.find((item) => activeKey === item.key) || [...items].shift();
  }, [items, activeKey]);

  return (
    <Wrapper className={className}>
      <TabHeader gapX="s4">
        {items.map((item) => (
          <TabButton
            tabSize={tabSize}
            flexTab={flexTab}
            key={item.key}
            isActive={item.key === activeKey}
            onClick={() => onChangeActiveKey?.(item.key)}
          >
            {item.label}
          </TabButton>
        ))}
      </TabHeader>
      <TabContent hasPadding={!noTabPadding}>
        <Suspense>{activeItem?.component}</Suspense>
      </TabContent>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;

const TabHeader = styled(Flex)``;

const TabContent = styled(Box)<{ hasPadding: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 0 0 0.75rem 0.75rem;
  ${({ hasPadding }) => hasPadding && { padding: '1rem' }};
  flex: 1;
  overflow-y: auto;
  height: 100%;
  margin-bottom: 4px;
  ::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    width: 100%;
    flex: unset;
  }
`;

const TabButton = styled.button<{
  isActive: boolean;
  flexTab: boolean;
  tabSize: 'm' | 'l';
}>`
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.textPrimary};
  border: none;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.backgroundSecondary : '#1F1F1F'};
  line-height: 50px;
  font-size: ${({ theme, tabSize }) => theme.fontSizes[tabSize]}px;
  border-radius: 0.75rem 0.75rem 0 0;
  cursor: pointer;
  white-space: nowrap;
  width: ${({ tabSize }) => (tabSize == 'm' ? 154 : 180)}px;
  flex: ${({ flexTab }) => (flexTab ? 1 : 'unset')};
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 40px;
  }
`;
