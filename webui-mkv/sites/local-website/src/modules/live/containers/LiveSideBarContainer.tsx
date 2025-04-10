import React, { useState } from 'react';
import { LiveTabs } from '../components';
import { t } from 'i18next';
import { ImageConfigureContainer } from './ImageConfigureContainer';
// import { WarningContainer } from './WarningContainer';
import { ColorPropertiesContainer } from './ColorPropertiesContainer';
import { Flex, Text } from '@packages/ds-core';
import { WarningContainer } from './WarningContainer.tsx';

export interface LiveSideBarContainerProps {
  className?: string;
}

enum TabKey {
  'warning',
  'color-properties',
  'photo_configure',
}

export const LiveSideBarContainer: React.FC<LiveSideBarContainerProps> = ({
  className,
}) => {
  const [activeKey, setActiveKey] = useState<TabKey>(TabKey.warning);
  return (
    <LiveTabs
      className={className}
      activeKey={activeKey}
      onChangeActiveKey={(key) => setActiveKey(key as every)}
      flexTab
      noTabPadding
      items={[
        {
          key: TabKey.warning,
          component: <WarningContainer />,
          label: (
            <Flex gap="s8" justify="center" align="baseline">
              <Text>{t('warning')}</Text>
            </Flex>
          ),
        },
        {
          key: TabKey['color-properties'],
          component: <ColorPropertiesContainer />,
          label: t('color_properties'),
        },
        {
          key: TabKey.photo_configure,
          component: <ImageConfigureContainer />,
          label: t('photo_configure'),
        },
      ]}
    />
  );
};
