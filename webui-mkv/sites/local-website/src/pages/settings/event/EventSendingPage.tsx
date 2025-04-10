import { CalendarEventOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { routeKeys, routeNames } from 'configs/constants';
import { EventSendingForm } from 'modules/event/components';
import { PaddingWrapper } from 'modules/_shared';
import { styled } from '@packages/ds-core';

const EventSendingPage: React.FC = () => {
  return (
    <Page
      icon={<CalendarEventOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.event,
          path: routeKeys.event,
        },
        {
          title: routeNames.event_sending,
          path: routeKeys.event_sending,
        },
      ]}
    >
      <PaddingWrapper>
        <FormWrapper>
          <EventSendingForm />
        </FormWrapper>
      </PaddingWrapper>
    </Page>
  );
};

export default EventSendingPage;

const FormWrapper = styled.div`
  max-width: 652px;
`;
