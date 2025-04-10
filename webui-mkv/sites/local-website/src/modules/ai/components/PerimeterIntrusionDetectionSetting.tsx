import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@packages/ds-core';
import { Button, Col, Row } from 'antd';
import { SETTING_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config.ts';
import { t } from 'i18next';
import { IOSDConfig, VideoHandle } from 'modules/live/types';
import { OsdScreen, VideoPlayer } from 'modules/live/components';
import { convertResolutionToCanvas } from 'modules/_shared/helpers/canvas-draw';
import { drawZones, handleCanvasClick, handleMouseMovePID } from 'modules/_shared/helpers/pid-draw-utils';
import { useUpdatePort } from '../../system/hooks';

export interface PerimeterIntrusionDectectionSettingProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  zones?: Array<every>;
  onZonesChange?: (newZones: any[]) => void;
}

export const PerimeterIntrusionDectectionSetting: React.FC<PerimeterIntrusionDectectionSettingProps> = ({
  leftContent,
  osdConfig,
  zones = [],
  onZonesChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState([]);
  const MAX_ZONE = 8;
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number | null>(null);
  const videoRef = useRef<VideoHandle>(null);
  const { loadData } = useUpdatePort();
 
  useEffect(() => {
    if (!loadData || !videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSrc = new URL(`${SETTING_STREAM_URL}`);
    const liveService = loadData.services.find(service => service.service === LIVE_PORT_NAME);
    if (liveService?.port) {
      videoSrc.port = String(liveService.port);
      console.log("[PID] video url is ", videoSrc.toString());
    } else {
      console.error("[PID] LIVE_PORT_NAME not found in services");
      return;
    }

    videoElement.play(videoSrc.toString());

    // Cleanup function: Pause video when component unmounts
    return () => {
      if (videoElement) {
        console.log("[PID] Component unmounted, pausing video...");
        videoElement.pause();
      }
    };
  }, [loadData]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current?.clientWidth;
      canvasRef.current.height = canvasRef.current?.clientHeight;
    }
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    let convertedZones: { x: number; y: number }[][] = [];

    if (zones) {
      zones.forEach((zone) => {
        const convertedZone = zone.map((z: { x: number; y: number }) =>
          convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight)
        );
        convertedZones.push(convertedZone);
      });

      if (convertedZones.length) {
        convertedZones.forEach((zone, index) => {
          ctx.strokeStyle = index === selectedZoneIndex ? 'red' : 'yellow';
          drawZones(zone, canvasRef);
          ctx.fillStyle = "#1b937d";
          ctx.font = "bold 16px Arial";
          ctx.fillText(`${index + 1}`, zone[0].x + 5, zone[0].y - 5);
        });
      }    
    }
  }, [zones, selectedZoneIndex]);

  const handleDeleteLine = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onZonesChange?.([]);
      }
    }
  };

  const handleDeleteSelectedZone = () => {
    if (selectedZoneIndex !== null) {
      const newZones = zones.filter((_, index) => index !== selectedZoneIndex);
      if (onZonesChange) {
        onZonesChange(newZones);
      }
      setSelectedZoneIndex(null);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let convertedZones: { x: number; y: number }[][] = [];
          newZones.forEach((zone) => {
            const convertedZone = zone.map((z: { x: number; y: number }) =>
              convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight)
            );
            convertedZones.push(convertedZone);
          });
          convertedZones.forEach((zone, index) => {
            drawZones(zone, canvasRef);
            ctx.fillStyle = "#1b937d";
            ctx.font = "bold 16px Arial";
            ctx.fillText(`${index + 1}`, zone[0].x + 5, zone[0].y - 5);
          });
        }
      }
    }  
  };
  
  return (
    <Row gutter={[8, 8]}>
      <Col span={24} lg={14} xl={15} xxl={12} style={{ maxWidth: '640px' }}>
        <ContentWrapper>{leftContent}</ContentWrapper>
      </Col>
      <Col span={24} lg={10} xl={9} xxl={12} style={{ maxWidth: '640px' }}>
        <VideoFrame>
          {osdConfig && (
            <OsdScreen
              className={'osd-screen'}
              name={{
                show: osdConfig.name.show,
                display_name: osdConfig.display_name,
              }}
              datetime={{
                show: osdConfig.datetime.show,
              }}
            />
          )}
          <VideoPlayer className={'video-player'} ref={videoRef} hasDrawCoordinates={true} />
          <CanvasOverlay
            ref={canvasRef}
            width={640}
            height={480}
            onClick={(event) => {
              handleCanvasClick(event, canvasRef, setPoints, onZonesChange, zones, setSelectedZoneIndex, MAX_ZONE)}
            }
            onMouseMove={(event) => { if (zones.length < MAX_ZONE) {
              handleMouseMovePID(event, canvasRef, points, zones)}
            }}
          />
        </VideoFrame>
          <Row justify="center" gutter={16} style={{ marginBottom: '24px', marginTop: '24px' }}>
            <Col style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Button type="primary" onClick={handleDeleteSelectedZone}>{t('delete')}</Button>
              <Button type="primary" style={{ marginLeft: '30px' }} onClick={handleDeleteLine}>
                {t('deleteAll')}
              </Button>
            </Col>
          </Row>
      </Col>
    </Row>
  );
};

const VideoFrame = styled.div`
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 640px;
  height: 480px;
  background-color: #333;

  .osd-screen {
    position: absolute;
    z-index: 1;
  }

  @media (max-width: 768px) {
    width: 100%; 
    height: auto; 
    aspect-ratio: 4 / 3;
  }
`;

const ContentWrapper = styled.div`
  max-width: 640px;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const CanvasOverlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
  }
`;
