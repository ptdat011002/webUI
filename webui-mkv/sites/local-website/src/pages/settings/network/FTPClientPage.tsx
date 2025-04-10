import { WorldOutlined } from '@packages/ds-icons';
import { menuIconSize } from 'configs/theme';
import { Page } from 'modules/workspace/components';
import React from 'react';
import { Col, Row } from 'antd';
import { FTPConfigContainer } from 'modules/network/containers';
import { routeKeys, routeNames } from 'configs/constants';
import { PaddingWrapper } from 'modules/_shared';

const FTPClientPage: React.FC = () => {
  return (
    <Page
      icon={<WorldOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.network,
          path: routeKeys.network,
        },
        {
          title: routeNames.network_ftp,
          path: routeKeys.network_ftp,
        },
      ]}
    >
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} xl={13} lg={12} md={18}>
            <FTPConfigContainer />
          </Col>
        </Row>
      </PaddingWrapper>
    </Page>
  );
};

export default FTPClientPage;
