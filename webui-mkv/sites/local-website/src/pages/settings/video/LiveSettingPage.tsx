import { SettingsOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React, { useState } from 'react';
import { routeKeys, routeNames } from 'configs/constants';
import { PaddingWrapper } from 'modules/_shared';
import { LiveSettingForm, VideoSettingLayout } from 'modules/live/containers';
import { IOSDConfig } from 'modules/live/types';

const LiveSettingPage: React.FC = () => {
  const [osdConfig, setOsdConfig] = useState<IOSDConfig>();

  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.video,
          path: routeKeys.video,
        },
        {
          title: routeNames.display_setting,
          path: routeKeys.display_setting,
        },
      ]}
    >
      <PaddingWrapper>
        <VideoSettingLayout
          leftContent={<LiveSettingForm setOsdConfig={setOsdConfig} />}
          osdConfig={osdConfig}
          isShow={true}
        />
      </PaddingWrapper>
    </Page>
  );
};

export default LiveSettingPage;
