import { routeKeys, routeNames } from 'configs/constants';
import { SettingsOutlined } from '@packages/ds-icons';
import { Page } from 'modules/workspace/components';
import React, { useMemo } from 'react';
import { ScreenTabs } from 'modules/_shared';
import { useSearchParams } from 'react-router-dom';
import { t } from 'configs/i18next';
import { menuIconSize } from 'configs/theme';

const PhotoSettingContainer = React.lazy(
  () => import('modules/record/containers/PhotoSettingContainer'),
);

const RecordScheduleContainer = React.lazy(
  () => import('modules/record/containers/RecordScheduleContainer'),
);

const RecordPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && ['setting', 'schedule'].includes(tab)) {
      return tab;
    }
    return 'setting';
  }, [searchParams.get('tab')]);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.record,
          path: routeKeys.record,
        },
      ]}
    >
      <ScreenTabs
        defaultActiveKey={activeKey}
        items={[
          {
            key: 'setting',
            label: t('record_photo'),
            screen: <PhotoSettingContainer />,
            onCLick: () => setActiveTab('setting'),
          },
          {
            key: 'schedule',
            label: t('schedule'),
            screen: <RecordScheduleContainer type="Capture" />,
            onCLick: () => setActiveTab('schedule'),
          },
        ]}
      />
    </Page>
  );
};

export default RecordPage;
