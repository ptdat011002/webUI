import { DevicesOutlined } from '@packages/ds-icons';
import { Col, Row } from 'antd';
import { routeKeys, routeNames } from 'configs/constants';
import { PaddingWrapper } from 'modules/_shared';
import { DeviceAudioContainer } from 'modules/device/containers/DeviceAudioContainer';
import { Page } from 'modules/workspace/components';
import React from 'react';

const AudioPage: React.FC = () => {
  return (
    <Page
      icon={<DevicesOutlined />}
      breadcrumbs={[
        {
          path: routeKeys.device,
          title: routeNames.device,
        },
        {
          path: routeKeys.device_audio,
          title: routeNames.device_audio,
        },
      ]}
    >
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} lg={12}>
            <DeviceAudioContainer />
          </Col>
        </Row>
      </PaddingWrapper>
    </Page>
  );
};

export default AudioPage;
