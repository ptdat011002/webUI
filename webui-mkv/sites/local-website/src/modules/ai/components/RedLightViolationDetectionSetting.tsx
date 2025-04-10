import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@packages/ds-core';
import { Button, Col, Row } from 'antd';
import { SETTING_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config.ts';
import { t } from 'i18next';
import { IOSDConfig, VideoHandle } from 'modules/live/types';
import { OsdScreen, VideoPlayer } from 'modules/live/components';
import { convertResolutionToCanvas, drawLine, drawSquare } from 'modules/_shared/helpers/canvas-draw';
import { useUpdatePort } from '../../system/hooks';
import { startDrawingDelimitationLine, handleMouseMoveDelimitationLine, endDrawingDelimitationLine, 
  startDrawingSignalLight, updateShapeSizeSignalLight, endDrawingSignalLight, drawShapeSignalLight } from 'modules/_shared/helpers/traffic-draw-utils';

export interface RedLightViolationDetectionSettingProps {
  className?: string;
  leftContent: React.ReactNode;
  osdConfig?: IOSDConfig;
  lines?: Array<any>;
  signalLight?: Array<any>;
  onLinesChange?: (newLines: any[]) => void;
  onSignalLightChange?: (newSignalLight: any[]) => void;
  isDrawDelimitationLine?: boolean;
  isDrawNormalLine?: boolean;
  isDrawLight?: boolean;
}

interface StyledProps {
  isDrawingMode: boolean;
}

export const RedLightViolationDetectionSetting: React.FC<RedLightViolationDetectionSettingProps> = ({
  leftContent,
  osdConfig,
  lines = [],
  signalLight = [],
  onLinesChange,
  onSignalLightChange,
  isDrawDelimitationLine = false,
  isDrawNormalLine = false,
  isDrawLight = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [startPos, setStartPos] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const tempLineRef = useRef(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | string | null>(null);
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
  const MAX_LINES = 3;
  
  const videoRef = useRef<VideoHandle>(null);
  const { loadData } = useUpdatePort();
  
  useEffect(() => {
    if (!loadData || !videoRef.current) return;
    const videoElement = videoRef.current;
    const videoSrc = new URL(`${SETTING_STREAM_URL}`);
    const liveService = loadData.services.find(service => service.service === LIVE_PORT_NAME);
    if (liveService?.port) {
      videoSrc.port = String(liveService.port);
      console.log("[RedLight] video url is ", videoSrc.toString());
    } else {
      console.error("[RedLight] LIVE_PORT_NAME not found in services");
      return;
    }

    videoElement.play(videoSrc.toString());

    // Cleanup function: Pause video when component unmounts
    return () => {
      if (videoElement) {
        console.log("[RedLight] Component unmounted, pausing video...");
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

  const drawAllShapes = () => {    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines
    if (lines) {
      lines?.forEach((line) => {
        const lineStart = convertResolutionToCanvas(line['line'][0]['x'], line['line'][0]['y'], canvas.clientWidth, canvas.clientHeight);
        const lineEnd = convertResolutionToCanvas(line['line'][1]['x'], line['line'][1]['y'], canvas.clientWidth, canvas.clientHeight);
        ctx.strokeStyle = `line_${line['id']}` === selectedItemIndex ? 'yellow' : line['id'] === 0 ? 'red' : 'green';
        drawLine(ctx, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
        drawSquare(ctx, lineStart);
        
        const angle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);
        const text = line['id'] === 0 ? t('delimitation_line') : t('line') + ' ' + line['id'];
        
        ctx.save();
        ctx.translate(lineStart.x + 15, lineStart.y - 15);
        ctx.rotate(angle);
        ctx.fillStyle = `line_${line['id']}` === selectedItemIndex ? 'yellow' : line['id'] === 0 ? 'red' : 'green';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 10, 0);
        ctx.restore();
      });
    }

    // Draw signal light zones
    if (signalLight.length > 0) {
      let newShapes: ShapeType[] = [];
      let allConvertedZones: Point[] = [];

      if (signalLight.length >= MAX_LINES) {
        const zonesToDraw = signalLight.filter((_, index) => index < MAX_LINES);
        signalLight = zonesToDraw;
      }

      signalLight.forEach((light) => {
        const convertedZone: Point[] = light.map((z: Point) => convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight));
        allConvertedZones.push(...convertedZone);
        if (convertedZone.length === 2) {
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
            number: light[0].id, 
            startX: x1 as number, 
            startY: y1 as number
          });
        }
      });
  
      setShapes(newShapes);
      if (allConvertedZones.length) {
        // Pass the selected light index if a signal light is selected
        const selectedLightIndex = typeof selectedItemIndex === 'string' && selectedItemIndex.startsWith('light_') 
          ? parseInt(selectedItemIndex.split('_')[1])
          : null;
        drawShapeSignalLight(newShapes, canvasRef, selectedLightIndex);
      }
    }
  };

  // Replace the existing useEffect for redrawCanvas
  useEffect(() => {
    if (canvasRef.current) {
      drawAllShapes();
    }
  }, [lines, signalLight, isDrawDelimitationLine, isDrawNormalLine, isDrawLight, selectedItemIndex]);

  const handleDeleteShape = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShapes([]);
        onLinesChange?.([]);
        onSignalLightChange?.([]);
        setSelectedItemIndex(null);
      }
    }
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if clicked on a line
    let found = false;
    lines.forEach((line) => {
      const lineStart = convertResolutionToCanvas(
        line['line'][0]['x'], 
        line['line'][0]['y'], 
        canvasRef.current?.clientWidth, 
        canvasRef.current?.clientHeight
      );
      const distance = Math.sqrt((mouseX - lineStart.x) ** 2 + (mouseY - lineStart.y) ** 2);
      
      if (distance < 10 && line['line'][0]['x'] !== line['line'][1]['x'] && line['line'][0]['y'] !== line['line'][1]['y']) {
        found = true;
        // setSelectedItemIndex(line['id']);
        setSelectedItemIndex(`line_${line['id']}`)
      }
    });

    // If no line was clicked, check signal lights
    if (!found) {
      signalLight.forEach((light) => {
        const lightPos = convertResolutionToCanvas(
          light[0]['x'],
          light[0]['y'],
          canvasRef.current?.clientWidth,
          canvasRef.current?.clientHeight
        );
        const distance = Math.sqrt((mouseX - lightPos.x) ** 2 + (mouseY - lightPos.y) ** 2);

        if (distance < 10) {
          found = true;
          setSelectedItemIndex(`light_${light[0].id}`);
        }
      });
    }

    // If clicked outside any item, deselect
    if (!found) {
      setSelectedItemIndex(null);
    }
  };

  const handleDeleteSelectedShape = () => {
    if (selectedItemIndex === null) return;

    // Check if selected item is a signal light
    if (typeof selectedItemIndex === 'string' && selectedItemIndex.startsWith('light_')) {
      const lightIndex = parseInt(selectedItemIndex.split('_')[1]);
      
      const newSignalLight = signalLight.filter((light) => light[0].id !== lightIndex);
      newSignalLight.forEach((light) => {
        if (light[0].id > lightIndex) {
          light[0].id -= 1;
        }
      });
      onSignalLightChange?.(newSignalLight);

      if (newSignalLight.length === 0) {
        setShapes([]);
      }      
      // Update lines that were using this signal light
      const newLines = lines.map(line => {
        if (line.lightControl === `light_${lightIndex}`) {
          return { ...line, lightControl: 'allow', rule: 1, redLightBox: null };
        }
        // Adjust lightControl index for lights after the deleted one
        if (line.lightControl && line.lightControl.startsWith('light_')) {
          const currentLightIndex = parseInt(line.lightControl.split('_')[1]);
          if (currentLightIndex > lightIndex) {
            return { 
              ...line, 
              lightControl: `light_${currentLightIndex - 1}`,
              redLightBox: newSignalLight[currentLightIndex - 2],
              redLightBox_id: currentLightIndex - 1,
            };
          }
        }
        return line;
      });
      onLinesChange?.(newLines);
    } else if (typeof selectedItemIndex === 'string' && selectedItemIndex.startsWith('line_')) {
      // Remove selected line
      const newLines = lines.filter(line => line['id'] !== parseInt(selectedItemIndex.split('_')[1]));
      onLinesChange?.(newLines);
    }
    setSelectedItemIndex(null);
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
  
    drawShapeSignalLight(shapes, canvasRef, selectedItemIndex);
  }, [shapes]);

  const handleLightMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    if (shapes.length > MAX_LINES) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawAllShapes();

    // Redraw existing shapes
    drawShapeSignalLight(shapes, canvasRef, selectedItemIndex);

    // Update and draw the current shape being drawn
    updateShapeSizeSignalLight(e, canvasRef, shapes, setShapes, startPos);
  };

  const isDrawingMode = isDrawDelimitationLine || isDrawNormalLine || isDrawLight;

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawDelimitationLine || isDrawNormalLine) {
      startDrawingDelimitationLine(e, lines, canvasRef, setStartPos, startPos, onLinesChange, isDrawing, setIsDrawing, 
        tempLineRef, isDrawDelimitationLine, isDrawNormalLine);
    } else if (isDrawLight) {
      if (shapes.length >= MAX_LINES) return;
      startDrawingSignalLight(e, canvasRef, shapes, setStartPos, setShapes, MAX_LINES, startPos, onSignalLightChange, isDrawing, setIsDrawing); 
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawDelimitationLine || isDrawNormalLine) {
      handleMouseMoveDelimitationLine(e, isDrawing, canvasRef, startPos, lines, tempLineRef, 
        isDrawDelimitationLine, isDrawNormalLine, signalLight, MAX_LINES, PADDING, CANVAS_WIDTH, CANVAS_HEIGHT, selectedItemIndex);
    } else if (isDrawLight) {
      handleLightMouseMove(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawDelimitationLine || isDrawNormalLine) {
      endDrawingDelimitationLine(e, lines, startPos, canvasRef, onLinesChange, tempLineRef, 
        setStartPos, isDrawing, isDrawDelimitationLine, isDrawNormalLine);
      setIsDrawing(false);
    } else if (isDrawLight) {
      if (shapes.length > MAX_LINES) return;
      endDrawingSignalLight(e, isDrawing, canvasRef, MAX_LINES, shapes, startPos, CANVAS_WIDTH, 
        CANVAS_HEIGHT, PADDING, onSignalLightChange, setStartPos, signalLight); 
      setIsDrawing(false);
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
            isDrawingMode={isDrawingMode}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const CanvasOverlay = styled.canvas<StyledProps>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: auto;
  cursor: ${props => props.isDrawingMode ? 'crosshair' : 'default'};
  border: ${props => props.isDrawingMode ? '2px solid #1890ff' : 'none'};
  box-shadow: ${props => props.isDrawingMode ? '0 0 10px #1890ff' : 'none'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
  }
`;
