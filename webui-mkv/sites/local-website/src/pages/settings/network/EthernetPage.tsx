import { WorldOutlined } from '@packages/ds-icons';
import { Col, Row } from 'antd';
import { routeKeys, routeNames } from 'configs/constants';
import { menuIconSize } from 'configs/theme';
import { PaddingWrapper } from 'modules/_shared';
import { EthernetConfigContainer } from 'modules/network/containers';
import { Page } from 'modules/workspace/components';
import React from 'react';

const EthernetPage: React.FC = () => {
  return (
    <Page
      icon={<WorldOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.network,
          path: routeKeys.network,
        },
        {
          title: routeNames.network_ethernet,
          path: routeKeys.network_ethernet,
        },
      ]}
    >
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} xl={13} lg={12} md={18}>
            <EthernetConfigContainer />
          </Col>
        </Row>
      </PaddingWrapper>
    </Page>
  );
};

export default EthernetPage;
