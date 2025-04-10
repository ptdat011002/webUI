import { CalendarEventOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { routeKeys, routeNames } from 'configs/constants';
import { PaddingWrapper } from 'modules/_shared';
import { EventWarningForm } from 'modules/event/components';
import { styled } from '@packages/ds-core';

const EventWarningPage: React.FC = () => {
  return (
    <Page
      icon={<CalendarEventOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.event,
          path: routeKeys.event,
        },
        {
          title: routeNames.event_warning,
          path: routeKeys.event_warning,
        },
      ]}
    >
      <PaddingWrapper>
        <FormWrapper>
          <EventWarningForm />
        </FormWrapper>
      </PaddingWrapper>
    </Page>
  );
};

export default EventWarningPage;

const FormWrapper = styled.div`
  max-width: 652px;
`;
