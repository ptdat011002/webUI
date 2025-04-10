import { AiOutlined } from '@packages/ds-icons';
import { routeKeys, routeNames } from 'configs/constants';
import { t } from 'configs/i18next';
import { menuIconSize } from 'configs/theme';
import { ScreenTabs } from 'modules/_shared';
import AiCrowdDetectionSettingContainer from 'modules/ai/containers/AiCrowdDetectionSettingContainer';
import AiFaceDetectSettingContainer from 'modules/ai/containers/AiFaceDetectSettingContainer';
import AiFaceRecognitionSettingContainer from 'modules/ai/containers/AiFaceRecognitionSettingContainer';
import AiLineCrossingDetectionSettingContainer from 'modules/ai/containers/AiLineCrossingDetectionSettingContainer';
import AiPeopleCountingSettingContainer from 'modules/ai/containers/AiPeopleCountingSettingContainer';
import AiPIDSettingContainer from 'modules/ai/containers/AiPIDetectionContainer';
import AiMotionDetectionSettingContainer from 'modules/ai/containers/AiMotionDetectionSettingContainer';

import { Page } from 'modules/workspace/components';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const tabKeys = [
  'face_recognition',
  'face_detection',
  'line_crossing_detection',
  'people_counting',
  'pid',
  'crowd_detection',
  'motion_detection',
];

const AISettingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isDataChange, setIsDataChanged] = useState(false); // Đánh dấu form có thay đổi

  const activeKey = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && tabKeys.includes(tab)) {
      return tab;
    }
    return tabKeys[0];
  }, [searchParams.get('tab')]);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    setIsDataChanged(false); // Reset trạng thái sau khi chuyển tab
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
        tabClassName='tab-inner-ai-config'
        items={[
          {
            key: 'face_recognition',
            label: t('face_recognition'),
            screen: <AiFaceRecognitionSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('face_recognition'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'face_detection',
            label: t('face_detection'),
            screen: <AiFaceDetectSettingContainer signal={abortController?.signal} />,
            onCLick: () => setActiveTab('face_detection'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'line_crossing_detection',
            label: t('line_crossing_detection'),
            screen: <AiLineCrossingDetectionSettingContainer signal={abortController?.signal} onChange={setIsDataChanged} />,
            onCLick: () => setActiveTab('line_crossing_detection'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'people_counting',
            label: t('people_counting'),
            screen: <AiPeopleCountingSettingContainer signal={abortController?.signal} onChange={setIsDataChanged} />,
            onCLick: () => setActiveTab('people_counting'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'pid',
            label: t('pid'),
            screen: <AiPIDSettingContainer signal={abortController?.signal} onChange={setIsDataChanged} />,
            onCLick: () => setActiveTab('pid'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'crowd_detection',
            label: t('crowd_detection'),
            screen: <AiCrowdDetectionSettingContainer signal={abortController?.signal} onChange={setIsDataChanged} />,
            onCLick: () => setActiveTab('crowd_detection'),
            isDataChanged: () => isDataChange
          },
          {
            key: 'motion_detection',
            label: t('move_detection'),
            screen: <AiMotionDetectionSettingContainer signal={abortController?.signal} onChange={setIsDataChanged} />,
            onCLick: () => setActiveTab('motion_detection'),
            isDataChanged: () => isDataChange
          },
        ]}
      />
    </Page>
  );
};

export default AISettingPage;
