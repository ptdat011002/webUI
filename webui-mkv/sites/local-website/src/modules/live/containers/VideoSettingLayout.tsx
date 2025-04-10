import { OsdScreen, VideoPlayer } from '../components';
import React, { useEffect, useRef } from 'react';
import { styled } from '@packages/ds-core';
import { SETTING_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config.ts';
import { useUpdatePort } from '../../system/hooks';
import { Col, Row } from 'antd';
import { IOSDConfig, VideoHandle } from '../types';

export interface VideoSettingLayoutProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  isShow?: boolean;
  peopleCount?: number;
}

export const VideoSettingLayout: React.FC<VideoSettingLayoutProps> = ({
  leftContent,
  osdConfig,
  isShow,
  peopleCount,
}) => {
  const videoRef = useRef<VideoHandle>(null);
  const { loadData } = useUpdatePort();

  useEffect(() => {
    if (!loadData || !videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSrc = new URL(`${SETTING_STREAM_URL}`);
    const liveService = loadData.services.find(service => service.service === LIVE_PORT_NAME);

    if (liveService?.port) {
      videoSrc.port = String(liveService.port);
      console.log("[VideoSettingLayout] video url is ", videoSrc.toString());
    } else {
      console.error("[VideoSettingLayout] LIVE_PORT_NAME not found in services");
      return;
    }

    videoElement.play(videoSrc.toString());

    // Cleanup function: Pause video when component unmounts
    return () => {
      videoElement?.pause();
    };
  }, [loadData]); // `useEffect` chạy lại khi `loadData` thay đổi

  return (
    <Row gutter={[8, 8]}>
      <Col span={24} lg={14} xl={15} xxl={12}>
        <ContentWrapper>{leftContent}</ContentWrapper>
      </Col>
      <Col span={24} lg={10} xl={9} xxl={12}>
        <VideoFrame>
          {(isShow || osdConfig) && (
            <OsdScreen
              people_count={peopleCount?.toString()}
              className={'osd-screen'}
              name={{
                show: osdConfig?.name.show,
                display_name: osdConfig?.display_name,
                position: osdConfig?.name.position,
              }}
              datetime={{
                show: osdConfig?.datetime.show,
                position: osdConfig?.datetime.position,
              }}
            />
          )}
          <VideoPlayer className={'video-player'} ref={videoRef} />
        </VideoFrame>
      </Col>
    </Row>
  );
};

const VideoFrame = styled.div`
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 4/3;

  .osd-screen {
    border: 8px solid #333;
    position: absolute;
    z-index: 1;
  }

  .video-player {
    border: 8px solid #333;
    background-color: #333;
  }
`;

const ContentWrapper = styled.div`
  max-width: 640px;
`;
