import { WorldOutlined } from '@packages/ds-icons';
import { Col, Row } from 'antd';
import { routeKeys, routeNames } from 'configs/constants';
import { menuIconSize } from 'configs/theme';
import { PaddingWrapper } from 'modules/_shared';
import { WifiConfigContainer } from 'modules/network/containers';
import { Page } from 'modules/workspace/components';
import React from 'react';

const WifiPage: React.FC = () => {
  return (
    <Page
      icon={<WorldOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.network,
          path: routeKeys.network,
        },
        {
          title: routeNames.network_wifi,
          path: routeKeys.network_wifi,
        },
      ]}
    >
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} xl={14} xxl={12} lg={20} md={24}>
            <WifiConfigContainer />
          </Col>
        </Row>
      </PaddingWrapper>
    </Page>
  );
};

export default WifiPage;
