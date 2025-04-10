import { SettingsOutlined } from '@packages/ds-icons';
import { Col, Row } from 'antd';
import { routeKeys, routeNames } from 'configs/constants';
import { menuIconSize } from 'configs/theme';
import { DateTimeSettingContainer } from 'modules/system/containers';
import { Page } from 'modules/workspace/components';
import React from 'react';

const SystemSettingPage: React.FC = () => {
  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          path: routeKeys.system,
          title: routeNames.system,
        },
        {
          title: routeNames.system_setting,
          path: routeKeys.system_setting,
        },
      ]}
    >
      <Row>
        <Col span={24} lg={16}>
          <DateTimeSettingContainer />
        </Col>
      </Row>
    </Page>
  );
};

export default SystemSettingPage;
