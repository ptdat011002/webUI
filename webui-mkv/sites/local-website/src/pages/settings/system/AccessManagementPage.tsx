import { routeKeys, routeNames } from 'configs/constants';
import { SettingsOutlined } from '@packages/ds-icons';
import { Page } from 'modules/workspace/components';
import React, { useMemo, useState } from 'react';
import { ScreenTabs } from 'modules/_shared';
import { useSearchParams } from 'react-router-dom';
import { t } from 'configs/i18next';
import { menuIconSize } from 'configs/theme';

const LockPWTab = React.lazy(
  () => import('modules/system/containers/LockPasswordContainer'),
);

const LoginManagementTab = React.lazy(
  () => import('modules/system/containers/LoginManageContainer'),
);

const AdminManagementTab = React.lazy(
  () => import('modules/system/containers/PortManagementContainer'),
);

const AccessManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDataChange, setIsDataChanged] = useState(false);

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && ['lock_password', 'login_management', 'admin_management'].includes(tab)) {
      return tab;
    }
    return 'lock_password';
  }, [searchParams.get('tab')]);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    setIsDataChanged(false);
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
          title: routeNames.system_access_management,
          path: routeKeys.system_access_management,
        },
      ]}
    >
      <ScreenTabs
        defaultActiveKey={activeKey}
        items={[
          {
            key: 'lock_password',
            label: t('lock_password'),
            screen: <LockPWTab onChange={setIsDataChanged}/>,
            isDataChanged: () => isDataChange,
            onCLick: () => setActiveTab('lock_password'),
          },
          {
            key: 'login_management',
            label: t('login_management'),
            screen: <LoginManagementTab onChange={setIsDataChanged}/>,
            isDataChanged: () => isDataChange,
            onCLick: () => setActiveTab('login_management'),
          },
          {
            key: 'admin_management',
            label: t('admin_management'),
            screen: <AdminManagementTab onChange={setIsDataChanged}/>,
            isDataChanged: () => isDataChange,
            onCLick: () => setActiveTab('admin_management'),
          },
        ]}
      />
    </Page>
  );
};

export default AccessManagementPage;
