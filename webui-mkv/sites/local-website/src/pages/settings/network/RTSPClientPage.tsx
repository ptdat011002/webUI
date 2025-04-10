import { WorldOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { Col, Row } from 'antd';
import { routeKeys, routeNames } from 'configs/constants';
import { PaddingWrapper } from 'modules/_shared';
import { RTSPConfigContainer } from 'modules/network/containers';

const RTSPClientPage: React.FC = () => {
  return (
    <Page
      icon={<WorldOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.network,
          path: routeKeys.network,
        },
        {
          title: routeNames.network_rtsp,
          path: routeKeys.network_rtsp,
        },
      ]}
    >
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} xl={13} lg={12} md={18}>
            <RTSPConfigContainer />
          </Col>
        </Row>
      </PaddingWrapper>
    </Page>
  );
};

export default RTSPClientPage;
