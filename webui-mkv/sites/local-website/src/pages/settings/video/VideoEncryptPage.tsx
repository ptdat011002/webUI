import { Page } from 'modules/workspace/components';
import React from 'react';
import { PlayOutlined } from '@packages/ds-icons';
import { routeKeys, routeNames } from 'configs/constants';
import { ScreenTabs } from 'modules/_shared';
import { t } from 'configs/i18next.ts';
import { menuIconSize } from 'configs/theme';

const MainStreamTab = React.lazy(
  () => import('modules/video/containers/EncryptMainStreamContainer'),
);

const SubStreamTab = React.lazy(
  () => import('modules/video/containers/EncryptSubStreamContainer'),
);

const VideoEncryptPage: React.FC = () => {
  return (
    <Page
      icon={<PlayOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.video,
          path: routeKeys.video,
        },
        {
          title: routeNames.record_encrypt,
          path: routeKeys.record_encrypt,
        },
      ]}
    >
      <ScreenTabs
        items={[
          {
            key: 'main_stream',
            label: t('mainStream'),
            screen: <MainStreamTab />,
          },
          {
            key: 'sub_stream',
            label: t('subStream'),
            screen: <SubStreamTab />,
          },
        ]}
      />
    </Page>
  );
};

export default VideoEncryptPage;
