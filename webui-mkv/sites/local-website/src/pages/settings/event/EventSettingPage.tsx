import { CalendarEventOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { routeKeys, routeNames } from 'configs/constants';
import { PaddingWrapper } from 'modules/_shared';
import { MotionDetection } from '../../../modules/event/containers';

const EventSettingPage: React.FC = () => {
  return (
    <Page
      icon={<CalendarEventOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.event,
          path: routeKeys.event,
        },
        {
          title: routeNames.event_setting,
          path: routeKeys.event_setting,
        },
      ]}
    >
      <PaddingWrapper>
        <MotionDetection />
      </PaddingWrapper>
    </Page>
  );
};

export default EventSettingPage;
