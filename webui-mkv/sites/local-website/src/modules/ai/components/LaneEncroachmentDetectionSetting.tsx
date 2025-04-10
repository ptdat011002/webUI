import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@packages/ds-core';
import { Button, Col, Row } from 'antd';
import { SETTING_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config.ts';
import { t } from 'i18next';
import { IOSDConfig, VideoHandle } from 'modules/live/types';
import { OsdScreen, VideoPlayer } from 'modules/live/components';
import { handleCanvasClick, handleMouseMovePID, drawZones, CenterZoneCalculator} from 'modules/_shared/helpers/traffic-draw-utils';
import { convertResolutionToCanvas } from 'modules/_shared/helpers/canvas-draw';
import { useUpdatePort } from '../../system/hooks';

export interface LaneEncroachmentDetectionSettingProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  zones?: Array<any>;
  onZonesChange?: (newZones: any[]) => void;
  currentOrder: string;
  currentDirection: number;
}

export const LaneEncroachmentDetectionSetting: React.FC<LaneEncroachmentDetectionSettingProps> = ({
  leftContent,
  osdConfig,
  zones = [],
  onZonesChange,
  currentOrder,
  currentDirection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState([]);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number | null>(null);

  const MAX_SHAPES = 4;
  const MAX_POINTS = 4;
  const videoRef = useRef<VideoHandle>(null);
  const { loadData } = useUpdatePort();
  
  useEffect(() => {
    if (!loadData || !videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSrc = new URL(`${SETTING_STREAM_URL}`);
    const liveService = loadData.services.find(service => service.service === LIVE_PORT_NAME);
    if (liveService?.port) {
      videoSrc.port = String(liveService.port);
      console.log("[Lane Encroachment] video url is ", videoSrc.toString());
    } else {
      console.error("[Lane Encroachment] LIVE_PORT_NAME not found in services");
      return;
    }

    videoElement.play(videoSrc.toString());

    // Cleanup function: Pause video when component unmounts
    return () => {
      if (videoElement) {
        console.log("[Lane Encroachment] Component unmounted, pausing video...");
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
  
    // Always clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    interface ConvertedZone {
      id: string;
      points: { x: number; y: number }[];
      direction?: number;
    }
    let convertedZones: ConvertedZone[] = [];

    if (zones.length > 0) {
      const zonesToDraw = zones.slice(0, MAX_SHAPES);
      
      zonesToDraw.forEach((zone) => {
        const convertedZone = zone['lines'].map((z: { x: number; y: number }) =>
          convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight)
        );
        convertedZones.push({
          id: zone['id'],
          points: convertedZone,
          direction: Number(zone['direction'])
        });
      });
      
      if (convertedZones.length) {
        convertedZones.forEach((zone) => {
          ctx.strokeStyle = Number(zone.id) === selectedZoneIndex ? 'red' : 'yellow';
          drawZones(zone.points, canvasRef);
          const { centerX, centerY } = CenterZoneCalculator(zone);
          ctx.fillStyle = "red";
          ctx.font = "bold 16px Arial";
          ctx.fillText(`${zone.id}`, zone.points[0].x + 10, zone.points[0].y + 20);

          let directionText = '';
          switch(zone.direction) {
            case 1:
              directionText = '(A → B)';
              break;
            case -1:
              directionText = '(A ← B)';
              break;
            case 0:
              directionText = '(A ↔ B)';
              break;
            default:
              directionText = '(A ↔ B)';
          }
          
          ctx.fillText(`${directionText}`, centerX - 20, centerY);
        });
      }
    }
  }, [zones, selectedZoneIndex]);

  const handleDeleteShape = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onZonesChange?.([]);
        setSelectedZoneIndex(null);
      }
    }
  };
  
  const handleDeleteSelectedShape = () => {
    if (selectedZoneIndex !== null) {
      const newZones = zones.filter((zone) => Number(zone['id']) !== selectedZoneIndex);
      setSelectedZoneIndex(null);
      requestAnimationFrame(() => {
        onZonesChange?.(newZones);
        if (newZones.length === 0 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      });
    }
  };
  
  const handleCanvasClickWrapper = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (zones.length >= MAX_SHAPES) return;
    
    handleCanvasClick(event, canvasRef, setPoints, onZonesChange, zones, setSelectedZoneIndex, 
      MAX_SHAPES, currentOrder, MAX_POINTS, true, currentDirection);
  };

  const handleMouseMoveWrapper = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (zones.length >= MAX_SHAPES) return;
    handleMouseMovePID(event, canvasRef, points, zones, true, false);
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
            onClick={handleCanvasClickWrapper}
            onMouseMove={handleMouseMoveWrapper}
          />
        </VideoFrame>
        <Row justify="center" gutter={16} style={{ marginBottom: '24px', marginTop: '24px' }}>
          <Col style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Button type="primary" onClick={handleDeleteSelectedShape}>{t('delete')}</Button>
            <Button type="primary" style={{ marginLeft: '30px' }} onClick={handleDeleteShape}>
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
