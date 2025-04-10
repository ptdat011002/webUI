import { SettingsOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { routeKeys, routeNames } from 'configs/constants';
import { PhotoForm, VideoSettingLayout } from 'modules/live/containers';
import { PaddingWrapper } from 'modules/_shared';

const PhotoPage: React.FC = () => {
  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.video,
          path: routeKeys.video,
        },
        {
          title: routeNames.video_photo,
          path: routeKeys.video_photo,
        },
      ]}
    >
      <PaddingWrapper>
        <VideoSettingLayout leftContent={<PhotoForm />} />
      </PaddingWrapper>
    </Page>
  );
};

export default PhotoPage;
