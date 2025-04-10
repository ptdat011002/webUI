import React from 'react';
import { AiOutlined } from '@packages/ds-icons';
import { AIStatContainer } from 'modules/ai/containers/AIStatContainer.tsx';
import { menuIconSize } from 'configs/theme';
import { routeKeys, routeNames } from 'configs/constants';
import { Page } from 'modules/workspace/components';

const AiStatisticsPage: React.FC = () => {
  return (
    <Page
      icon={<AiOutlined size={menuIconSize} />}
      breadcrumbs={[
        { title: routeNames.ai, path: routeKeys.ai },
        {
          title: routeNames.ai_statistics,
          path: routeKeys.ai_statistics,
        },
      ]}
    >
      <AIStatContainer />
    </Page>
  );
};

export default AiStatisticsPage;
