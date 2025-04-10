import { t } from 'i18next';
import { LiveLayout } from 'modules/live/LiveLayout';
import { LiveProvider } from 'modules/live/LiveProvider';
import { LiveTabs } from 'modules/live/components/LiveTabs';
import { LiveSideBarContainer } from 'modules/live/containers/LiveSideBarContainer';
import { IVideoFlow } from 'modules/live/types';
import React, { useState } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

const PrimaryFlowPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const flow: IVideoFlow = useMatch('/live/primary') ? 'primary' : 'secondary';

  return (
    <LiveProvider flow={flow}>
      <LiveLayout
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mainScreen={
          <LiveTabs
            tabSize="l"
            activeKey={flow}
            onChangeActiveKey={(key) => navigate(`/live/${key}`)}
            items={[
              {
                key: 'primary',
                component: <Outlet />,
                label: t('primary_flow'),
              },
              {
                key: 'secondary',
                component: <Outlet />,
                label: t('secondary_flow'),
              },
            ]}
          />
        }
        sidebar={<LiveSideBarContainer />}
      />
    </LiveProvider>
  );
};

export default PrimaryFlowPage;
