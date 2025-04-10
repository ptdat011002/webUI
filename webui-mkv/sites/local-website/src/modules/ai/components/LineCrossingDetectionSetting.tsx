import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@packages/ds-core';
import { Button, Col, Row } from 'antd';
import { SETTING_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config.ts';
import { t } from 'i18next';
import { IOSDConfig, VideoHandle } from 'modules/live/types';
import { OsdScreen, VideoPlayer } from 'modules/live/components';
import { convertResolutionToCanvas, directionOfArrow, drawDirection, drawFromAToB, drawLine, drawSquare, handleMouseDown, handleMouseMoveLCD, handleMouseUp, handleTouchEnd, handleTouchMoveLCD, handleTouchStart } from 'modules/_shared/helpers/canvas-draw';
import { useUpdatePort } from '../../system/hooks';

export interface LineCrossingDectectionSettingProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  directions?: Array<every>;
  lines?: Array<every>;
  onDirectionsChange?: (newDirections: any[]) => void;
  onLinesChange?: (newLines: any[]) => void;
}

export const LineCrossingDectectionSetting: React.FC<LineCrossingDectectionSettingProps> = ({
  leftContent,
  osdConfig,
  directions = [],
  lines = [],
  onDirectionsChange,
  onLinesChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const tempLineRef = useRef(null);
  const MAX_LINES = 8;
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const videoRef = useRef<VideoHandle>(null);
  const { loadData } = useUpdatePort();
 
  useEffect(() => {
    if (!loadData || !videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSrc = new URL(`${SETTING_STREAM_URL}`);
    const liveService = loadData.services.find(service => service.service === LIVE_PORT_NAME);
    if (liveService?.port) {
      videoSrc.port = String(liveService.port);
      console.log("[LCD] video url is ", videoSrc.toString());
    } else {
      console.error("[LCD] LIVE_PORT_NAME not found in services");
      return;
    }

    videoElement.play(videoSrc.toString());

    // Cleanup function: Pause video when component unmounts
    return () => {
      if (videoElement) {
        console.log("[LCD] Component unmounted, pausing video...");
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    let perpX = 0;
    let perpY = 0;

    if (lines) {
      lines?.forEach((line, index) => {
        const lineStart = convertResolutionToCanvas(line[0]['x'], line[0]['y'], canvas.clientWidth, canvas.clientHeight);
        const lineEnd = convertResolutionToCanvas(line[1]['x'], line[1]['y'], canvas.clientWidth, canvas.clientHeight);
  
        // Tính hướng vuông góc
        const perp = directionOfArrow(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
        perpX = perp.perpX;
        perpY = perp.perpY;
        ctx.strokeStyle = index === selectedLineIndex ? 'red' : 'yellow';
        drawLine(ctx, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
        drawSquare(ctx, lineStart);
        ctx.fillStyle = "#1b937d";
        ctx.font = "bold 16px Arial";
        ctx.fillText(`${index + 1}`, lineStart.x + 5, lineStart.y - 5);
      });
    }
    
    // Vẽ mũi tên vuông góc từ dữ liệu 'directions'
    if (directions) {
      directions?.forEach((direction) => {
        if (direction.length) {
          const arrowStart = convertResolutionToCanvas(direction[0]['x'], direction[0]['y'], canvas.clientWidth, canvas.clientHeight);
          const arrowEnd = convertResolutionToCanvas(direction[1]['x'], direction[1]['y'], canvas.clientWidth, canvas.clientHeight);
          const lengthPx = 30;
          drawDirection(ctx, arrowStart.x, arrowStart.y, arrowEnd.x, arrowEnd.y);
          drawFromAToB(ctx, arrowStart.x, arrowStart.y, perpX, perpY, lengthPx, arrowEnd.x, arrowEnd.y);
        }        
      });
    }
  }, [lines, directions, selectedLineIndex]);

  const handleSelectLine = (event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      lines.forEach((line, index) => {
        const lineStart = convertResolutionToCanvas(line[0].x, line[0].y, canvasRef.current?.clientWidth, canvasRef.current?.clientHeight);
        const distance = Math.sqrt((mouseX - lineStart.x) ** 2 + (mouseY - lineStart.y) ** 2);
        
        if (distance < 10 && line[0].x !== line[1].x && line[0].y !== line[1].y) {
          setSelectedLineIndex(index);
        }
      });
    }
  };

  const handleDeleteSelectedLine = () => {
    if (selectedLineIndex !== null) {
      const newLines = lines.filter((_, index) => index !== selectedLineIndex);
      const newDirections = directions.filter((_, index) => index !== selectedLineIndex);
      if (onLinesChange) {
        onLinesChange(newLines);
      }
      if (onDirectionsChange) {
        onDirectionsChange(newDirections);
      }
      setSelectedLineIndex(null);
    }
  };
  
  const handleDeleteLine = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onLinesChange?.([]);
        onDirectionsChange?.([]);
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
            onClick={handleSelectLine}
            onMouseDown={(event) => { if (lines.length < MAX_LINES) {
              handleMouseDown(event, lines, canvasRef, setStartPos, MAX_LINES, startPos, 
                onLinesChange, onDirectionsChange, isDrawing, setIsDrawing, tempLineRef);
            }}}
            onTouchStart={(event) => { if (lines.length < MAX_LINES) {
              handleTouchStart(event, lines, canvasRef, setStartPos, MAX_LINES, startPos, 
                onLinesChange, onDirectionsChange, isDrawing, setIsDrawing, tempLineRef);
            }}}
            onMouseMove={(event) => handleMouseMoveLCD(event, isDrawing, canvasRef, startPos, lines, tempLineRef, directions)}
            onTouchMove={(event) => handleTouchMoveLCD(event, isDrawing, canvasRef, startPos, lines, tempLineRef, directions)}
            onMouseUp={(event) => { if (lines.length < MAX_LINES) {
              handleMouseUp(event, lines, startPos, canvasRef, onDirectionsChange, onLinesChange, 
                MAX_LINES, tempLineRef, setStartPos, isDrawing);
                setIsDrawing(false);
              }
            }}
            onTouchEnd={(event) => { if (lines.length < MAX_LINES) {
              handleTouchEnd(event, lines, startPos, canvasRef, onDirectionsChange, onLinesChange, 
                MAX_LINES, tempLineRef, setStartPos, isDrawing);
                setIsDrawing(false);
              }
            }} 
          />
        </VideoFrame>
          <Row justify="center" gutter={16} style={{ marginBottom: '24px', marginTop: '24px' }}>
            <Col style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Button type="primary" onClick={handleDeleteSelectedLine}>{t('delete')}</Button>
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