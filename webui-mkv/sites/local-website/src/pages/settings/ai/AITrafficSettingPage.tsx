import { AiOutlined } from '@packages/ds-icons';
import { routeKeys, routeNames } from 'configs/constants';
import { t } from 'configs/i18next';
import { menuIconSize } from 'configs/theme';
import { ScreenTabs } from 'modules/_shared';

import { Page } from 'modules/workspace/components';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AiLicensePlateRecognitionSettingContainer from 'modules/ai/containers/AiLicensePlateRecognitionSettingContainer';
import AiLaneEncroachmentDetectionSettingContainer from 'modules/ai/containers/AiLaneEncroachmentDetectionSettingContainer';
import AiParkingDetectionSettingContainer from 'modules/ai/containers/AiParkingDetectionSettingContainer';
import AiEmergencyLaneIntrusionDetectionSettingContainer from 'modules/ai/containers/AiEmergencyLaneIntrusionDetectionSettingContainer';
import AiRedLightViolationDetectionSettingContainer from 'modules/ai/containers/AiRedLightViolationDetectionSettingContainer';
import AiWrongWayDetectionSettingContainer from 'modules/ai/containers/AiWrongWayDetectionSettingContainer';

const tabKeys = [
  'license_plate_recognition',
  'red_light_violation',
  'lane_encroachment',
  'wrong_way',
  'parking',
  'emergency_lane_intrusion',
];

const AITrafficSettingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isDataChange, setIsDataChanged] = useState(false);

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && tabKeys.includes(tab)) {
      return tab;
    }
    return tabKeys[0];
  }, [searchParams.get('tab')]);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    setIsDataChanged(false);
  };

  useEffect(() => {
    if (abortController) {
      abortController.abort();
    }
    const newController = new AbortController();
    setAbortController(newController);
    return () => newController.abort();
  }, [activeKey]);

  return (
    <Page
      icon={<AiOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.ai,
          path: routeKeys.ai,
        },
        {
          title: routeNames.ai_setting,
          path: routeKeys.ai_setting,
        },
      ]}
    >
      <ScreenTabs
        defaultActiveKey={activeKey}
        tabClassName='tab-inner-traffic-config'
        items={[
          {
            key: 'license_plate_recognition',
            label: t('license_plate_recognition'),
            screen: <AiLicensePlateRecognitionSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('license_plate_recognition'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'red_light_violation',
            label: t('red_light_violation'),
            screen: <AiRedLightViolationDetectionSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('red_light_violation'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'lane_encroachment',
            label: t('lane_encroachment'),
            screen: <AiLaneEncroachmentDetectionSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('lane_encroachment'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'wrong_way',
            label: t('wrong_way'),
            screen: <AiWrongWayDetectionSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('wrong_way'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'parking',
            label: t('parking'),
            screen: <AiParkingDetectionSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('parking'),
            isDataChanged: () => isDataChange
          },
          // {
          //   key: 'emergency_lane_intrusion',
          //   label: t('emergency_lane_intrusion'),
          //   screen: <AiEmergencyLaneIntrusionDetectionSettingContainer signal={abortController?.signal} />,
          //   onCLick: () => setActiveTab('emergency_lane_intrusion'),
          //   isDataChanged: () => isDataChange
          // },
        ]}
      />
    </Page>
  );
};

export default AITrafficSettingPage;
