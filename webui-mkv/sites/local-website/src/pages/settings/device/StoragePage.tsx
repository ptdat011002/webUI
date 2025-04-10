import { DevicesOutlined } from '@packages/ds-icons';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { menuIconSize } from 'configs/theme.tsx';
import { routeKeys, routeNames } from 'configs/constants';
import { t } from 'configs/i18next.ts';
import { ScreenTabs } from 'modules/_shared';

const StorageTab = React.lazy(
  () => import('modules/device/containers/Storage.tsx'),
);

const ComputerStorageTab = React.lazy(
  () => import('modules/device/containers/ComputerStorage.tsx'),
);

const StoragePage: React.FC = () => {
  return (
    <Page
      icon={<DevicesOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.device,
          path: routeKeys.device,
        },
        {
          title: routeNames.device_storage,
          path: routeKeys.device_storage,
        },
      ]}
    >
      <ScreenTabs
        items={[
          {
            key: 'storage',
            label: t('storage'),
            screen: <StorageTab />,
          },
          {
            key: 'computer_storage',
            label: t('storageOnTheComputer'),
            screen: <ComputerStorageTab />,
          },
        ]}
      />
    </Page>
  );
};

export default StoragePage;
