import { routeKeys, routeNames } from 'configs/constants';
import { SettingsOutlined } from '@packages/ds-icons';
import { Page } from 'modules/workspace/components';
import React, { useMemo } from 'react';
import { ScreenTabs } from 'modules/_shared';
import { useSearchParams } from 'react-router-dom';
import { t } from 'configs/i18next';
import { menuIconSize } from 'configs/theme';

const HistoryTab = React.lazy(
  () => import('modules/system/containers/OperatorHistoryContainer'),
);

const BackupTab = React.lazy(
  () => import('modules/system/containers/OperatorBackUpContainer'),
);

const RebootTab = React.lazy(
  () => import('modules/system/containers/OperatorRebootContainer'),
);

const UpdateTab = React.lazy(
  () => import('modules/system/containers/OperatorUpdateContainer'),
);

const OperationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && ['history', 'update', 'backup', 'reboot'].includes(tab)) {
      return tab;
    }
    return 'history';
  }, [searchParams.get('tab')]);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.system,
          path: routeKeys.system,
        },
        {
          title: routeNames.system_operation,
          path: routeKeys.system_operation,
        },
      ]}
    >
      <ScreenTabs
        defaultActiveKey={activeKey}
        items={[
          {
            key: 'history',
            label: t('history'),
            screen: <HistoryTab />,
            onCLick: () => setActiveTab('history'),
          },
          {
            key: 'update',
            label: t('update'),
            screen: <UpdateTab />,
            onCLick: () => setActiveTab('update'),
          },
          {
            key: 'backup',
            label: t('backupAndStorage'),
            screen: <BackupTab />,
            onCLick: () => setActiveTab('backup'),
          },
          {
            key: 'reboot',
            label: t('reboot'),
            screen: <RebootTab />,
            onCLick: () => setActiveTab('reboot'),
          },
        ]}
      />
    </Page>
  );
};

export default OperationPage;
