import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@packages/ds-core';
import { Button, Col, Row } from 'antd';
import { SETTING_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config.ts';
import { t } from 'i18next';
import { IOSDConfig, VideoHandle } from 'modules/live/types';
import { OsdScreen, VideoPlayer } from 'modules/live/components';
import { startDrawing, endDrawing, drawShapes, updateShapeSize, handleTouchStart, handleTouchEnd, updateShapeSizeMobile} from 'modules/_shared/helpers/motion-detect-draw-utils';
import { convertResolutionToCanvas } from 'modules/_shared/helpers/canvas-draw';
import { useUpdatePort } from '../../system/hooks';

export interface MotionDectectionSettingProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  zone_info?: Array<every>;
  onZonesChange?: (newZones: any[]) => void;
}

export const MotionDectectionSetting: React.FC<MotionDectectionSettingProps> = ({
  leftContent,
  osdConfig,
  zone_info = [],
  onZonesChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [startPos, setStartPos] = useState(null);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  interface Point {
    x: number;
    y: number;
  };

  interface ShapeType {
    x: number;
    y: number;
    width: number;
    height: number;
    number: number;
    startX: number;
    startY: number;
  };

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;
  const PADDING = 0;
  const MAX_SHAPES = 4;
  
  const videoRef = useRef<VideoHandle>(null);
  const { loadData } = useUpdatePort();
  
  useEffect(() => {
    if (!loadData || !videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSrc = new URL(`${SETTING_STREAM_URL}`);
    const liveService = loadData.services.find(service => service.service === LIVE_PORT_NAME);
    if (liveService?.port) {
      videoSrc.port = String(liveService.port);
      console.log("[MD] video url is ", videoSrc.toString());
    } else {
      console.error("[MD] LIVE_PORT_NAME not found in services");
      return;
    }

    videoElement.play(videoSrc.toString());

    // Cleanup function: Pause video when component unmounts
    return () => {
      if (videoElement) {
        console.log("[MD] Component unmounted, pausing video...");
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
  
    if (zone_info.length > 0) {
      let newShapes: ShapeType[] = [];
      let allConvertedZones: Point[] = [];

      if (zone_info.length >= MAX_SHAPES) {
        const zonesToDraw = zone_info.filter((_, index) => index < 4);
        zone_info = zonesToDraw;
      }
      zone_info.forEach((zone: Point[]) => {
        const convertedZone: Point[] = zone.map((z: Point) => convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight));
        allConvertedZones.push(...convertedZone);
        if (convertedZone.length = 2) {
          const x2 = convertedZone[1].x;
          const y2 = convertedZone[1].y;
          let x1 = convertedZone[0].x;
          let y1 = convertedZone[0].y;
  
          let width = Math.abs(x2 - x1);
          let height = Math.abs(y2 - y1);
          let left = Math.min(x1, x2);
          let top = Math.min(y1, y2);
  
          if (left < PADDING) left = PADDING;
          if (top < PADDING) top = PADDING;
          if (left + width > CANVAS_WIDTH - PADDING) width = CANVAS_WIDTH - left - PADDING;
          if (top + height > CANVAS_HEIGHT - PADDING) height = CANVAS_HEIGHT - top - PADDING;
  
          newShapes.push({ 
            x: left, 
            y: top, 
            width, 
            height, 
            number: newShapes.length + 1, 
            startX: x1 as number, 
            startY: y1 as number
          });
        }
      });
  
      setShapes(newShapes);  
      if (allConvertedZones.length) {
        drawShapes(newShapes, canvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, selectedZoneIndex);
      }
    }
  }, [zone_info, selectedZoneIndex]);

  const handleDeleteShape = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShapes([]);
        onZonesChange?.([]);
        setSelectedZoneIndex(null);
      }
    }
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      zone_info.forEach((zone, index) => {
        const lineStart = convertResolutionToCanvas(zone[0].x, zone[0].y, canvasRef.current?.clientWidth, canvasRef.current?.clientHeight);
        const distance = Math.sqrt((mouseX - lineStart.x) ** 2 + (mouseY - lineStart.y) ** 2);
        
        if (distance < 10 && zone[0].x !== zone[1].x && zone[0].y !== zone[1].y) {
          setSelectedZoneIndex(index);
        }
      });
    }
  };

  const handleDeleteSelectedShape = () => {
    if (selectedZoneIndex !== null) {
      const newZones = zone_info.filter((_, index) => index !== selectedZoneIndex);
      if (onZonesChange) {
        onZonesChange(newZones);
      }
      if (zone_info.length === 1) {
        setShapes([]);
      }
      setSelectedZoneIndex(null);
    }
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawShapes(shapes, canvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, selectedZoneIndex);
  }, [shapes]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    updateShapeSize(e, canvasRef, shapes, setShapes, startPos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    updateShapeSizeMobile(e, canvasRef, shapes, setShapes, startPos);
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
            onClick={handleCanvasClick}
            onMouseDown={(e) => { if (zone_info.length < MAX_SHAPES) {
              startDrawing(e, canvasRef, shapes, setStartPos, setShapes, MAX_SHAPES, startPos, onZonesChange, isDrawing, setIsDrawing); 
            }}}
            onTouchStart={(e) => { if (zone_info.length < MAX_SHAPES) {
              handleTouchStart(e, canvasRef, shapes, setStartPos, setShapes, MAX_SHAPES, startPos, onZonesChange, isDrawing, setIsDrawing); 
            }}}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={(e) => { if (zone_info.length < MAX_SHAPES) { 
              endDrawing(e, isDrawing, canvasRef, MAX_SHAPES, shapes, startPos, CANVAS_WIDTH, 
                CANVAS_HEIGHT, PADDING, onZonesChange, setStartPos); 
              setIsDrawing(false); }}
            }
            onTouchEnd={(e) => { if (zone_info.length < MAX_SHAPES) { 
              handleTouchEnd(e, isDrawing, canvasRef, MAX_SHAPES, shapes, startPos, CANVAS_WIDTH, 
                CANVAS_HEIGHT, PADDING, onZonesChange, setStartPos); 
              setIsDrawing(false); }}
            }
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
