import { Box, Flex, Spinner, Text, styled } from '@packages/ds-core';
import { t } from 'configs/i18next';
import React, { Suspense, useTransition } from 'react';

export interface TabScreen {
  screen: React.ReactNode;
  key: string;
  label: string;
  onCLick?: () => void;
  isDataChanged?: () => boolean;
}

export interface ScreenTabsProps {
  items: TabScreen[];
  className?: string;
  defaultActiveKey?: string;
  tabClassName?: string;
}

export const ScreenTabs: React.FC<ScreenTabsProps> = ({
  className,
  items,
  defaultActiveKey,
  tabClassName,
}) => {
  const [isPending, startTransition] = useTransition();
  const [activeKey, setActiveKey] = React.useState(
    defaultActiveKey || items[0].key,
  );

  const onTabClick = (key: string, isDataChanged?: () => boolean): boolean =>{
    if (isDataChanged && isDataChanged()) {
      const confirmLeave = window.confirm(t('unsaved_changes_warning'));
      if (!confirmLeave) return false;
    }
    startTransition(() => {
      setActiveKey(key);
    });
    return true;
  };

  const itemActive = items.find((item) => item.key === activeKey);

  return (
    <Wrapper className={className}>
      <TabHeaderWrapper className="tab-header screen-tabs-ai-setting">
        <Flex flexWrap="wrap">
          {items.map(({ key, label, onCLick, isDataChanged }) => (
            <TabButton
              className={tabClassName}
              key={key}
              active={activeKey === key}
              onClick={() => {
                if (!isPending) {
                  if (onTabClick(key, isDataChanged)) {
                    console.log("Tab is changed to ", key);
                    if (onCLick) onCLick();
                  }
                }
              }}
            >
              <Text color="textPrimary" fontSize="l">
                {label}
              </Text>
            </TabButton>
          ))}
        </Flex>
      </TabHeaderWrapper>
      <TabContent>
        <ScrollableContent>
          <Suspense fallback={<Spinner />}>{itemActive?.screen}</Suspense>
        </ScrollableContent>
      </TabContent>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabHeaderWrapper = styled(Box)`
  padding: 0 1.375rem;

  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 768px) {
    padding: 0 0.375rem;
    overflow-x: auto;

    margin-top: 4px;
  }
`;

const TabButton = styled.button<{
  active?: boolean;
  className?: string;
}>`
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
  border: none;
  outline: none;
  cursor: pointer;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  line-height: 52px;
  max-width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.l}px;
  white-space: nowrap;
  justify-content: center;
  min-width: 182px;
  padding: 0 2.25rem;
  box-sizing: content-box;

  @media screen and (max-width: 768px) {
    min-width: 165px;
    padding: 0 1.25rem;
    line-height: 40px;
    max-width: unset;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const TabContent = styled(Box)`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex: 1;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding: 0.75rem;
  }
`;
