import React from 'react';
import { SettingsOutlined } from '@packages/ds-icons';
import { routeKeys, routeNames } from 'configs/constants';
import { Page } from 'modules/workspace/components';
import { DeviceInfoTable } from 'modules/device/containers';
import { Spinner } from '@packages/ds-core';
import { menuIconSize } from 'configs/theme';
import { useSystemDevice } from 'modules/device/hooks';
import { Col, Row } from 'antd';
import { PaddingWrapper } from 'modules/_shared';

const DeviceInfoPage: React.FC = () => {
  const { data, isLoading } = useSystemDevice();
  return (
    <Page
      icon={<SettingsOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.system,
          path: routeKeys.system,
        },
        {
          title: routeNames.system_device_info,
          path: routeKeys.system_device_info,
        },
      ]}
    >
      <PaddingWrapper>
        {isLoading && <Spinner />}
        {data && (
          <Row>
            <Col md={24} lg={18} xl={14} span={24}>
              <DeviceInfoTable data={data} />
            </Col>
          </Row>
        )}
      </PaddingWrapper>
    </Page>
  );
};

export default DeviceInfoPage;
